-- ==============================================================================
-- EEE Academy — Production Database Schema & Row-Level Security (RLS)
-- Target: Supabase PostgreSQL
-- Matches: PRD.md Section 7, 8, & 13
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Define Controlled Enum Types
DO $$ BEGIN
  CREATE TYPE course_category AS ENUM ('semester', 'duet_admission', 'job_prep');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE lead_status AS ENUM ('pending', 'contacted', 'closed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('not_submitted', 'submitted', 'verified', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE enrollment_status AS ENUM ('not_enrolled', 'pending', 'active', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE group_access_status AS ENUM ('not_added', 'added', 'removed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE payment_method AS ENUM ('bkash', 'nagad', 'other_manual');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE payment_attempt_status AS ENUM ('submitted', 'verified', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE admin_role AS ENUM ('super_admin', 'course_manager', 'payment_verifier');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 3. Utility Trigger for updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 4. Tables
-- ==============================================================================

-- 4.1 Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  department TEXT NOT NULL DEFAULT 'EEE',
  category course_category NOT NULL DEFAULT 'semester',
  semester TEXT,
  regular_price NUMERIC(10,2) NOT NULL CHECK (regular_price >= 0),
  discount_price NUMERIC(10,2) CHECK (discount_price IS NULL OR (discount_price >= 0 AND discount_price <= regular_price)),
  features TEXT[] NOT NULL DEFAULT '{}',
  syllabus JSONB NOT NULL DEFAULT '[]'::jsonb,
  duration TEXT NOT NULL DEFAULT '',
  delivery_format TEXT NOT NULL DEFAULT 'Live online classes',
  is_active BOOLEAN NOT NULL DEFAULT true,
  admission_open BOOLEAN NOT NULL DEFAULT true,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

DROP TRIGGER IF EXISTS trigger_courses_updated_at ON public.courses;
CREATE TRIGGER trigger_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 4.2 Teachers Table
CREATE TABLE IF NOT EXISTS public.teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  qualifications TEXT NOT NULL DEFAULT '',
  institution_or_batch TEXT NOT NULL DEFAULT '',
  expertise TEXT NOT NULL DEFAULT '',
  bio TEXT NOT NULL DEFAULT '',
  photo_url TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

DROP TRIGGER IF EXISTS trigger_teachers_updated_at ON public.teachers;
CREATE TRIGGER trigger_teachers_updated_at
  BEFORE UPDATE ON public.teachers
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 4.3 Class Demos Table
CREATE TABLE IF NOT EXISTS public.class_demos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  topic TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  teacher_id UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
  video_url TEXT,
  thumbnail_url TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

DROP TRIGGER IF EXISTS trigger_class_demos_updated_at ON public.class_demos;
CREATE TRIGGER trigger_class_demos_updated_at
  BEFORE UPDATE ON public.class_demos
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 4.4 Site Settings Table (Single Operational Row)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp_number TEXT DEFAULT '+8801700000000',
  helpline_number TEXT DEFAULT '+8801700000000',
  messenger_url TEXT DEFAULT 'https://m.me/eeeacademy',
  support_email TEXT DEFAULT 'support@eeeacademy.edu.bd',
  location_address TEXT DEFAULT 'Dhaka, Bangladesh',
  map_url TEXT,
  facebook_page_url TEXT DEFAULT 'https://facebook.com/eeeacademy',
  bkash_instructions TEXT DEFAULT 'Send Money / Payment to our verified merchant or personal number.',
  nagad_instructions TEXT DEFAULT 'Send Money / Payment to our verified Nagad number.',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

DROP TRIGGER IF EXISTS trigger_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER trigger_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 4.5 Course Leads Table (Student Inquiries)
CREATE TABLE IF NOT EXISTS public.course_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  course_title_snapshot TEXT NOT NULL,
  course_price_snapshot NUMERIC(10,2) NOT NULL,
  student_name TEXT NOT NULL,
  polytechnic TEXT NOT NULL,
  polytechnic_roll TEXT NOT NULL,
  department TEXT NOT NULL,
  semester TEXT,
  phone TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  email TEXT,
  lead_status lead_status NOT NULL DEFAULT 'pending',
  payment_status payment_status NOT NULL DEFAULT 'not_submitted',
  enrollment_status enrollment_status NOT NULL DEFAULT 'not_enrolled',
  group_access_status group_access_status NOT NULL DEFAULT 'not_added',
  admin_notes TEXT,
  idempotency_key TEXT UNIQUE NOT NULL,
  is_likely_duplicate BOOLEAN NOT NULL DEFAULT false,
  last_contacted_at TIMESTAMPTZ,
  enrolled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

DROP TRIGGER IF EXISTS trigger_course_leads_updated_at ON public.course_leads;
CREATE TRIGGER trigger_course_leads_updated_at
  BEFORE UPDATE ON public.course_leads
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 4.6 Payments Table (Manual Payment Verification Attempts)
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.course_leads(id) ON DELETE CASCADE,
  method payment_method NOT NULL DEFAULT 'bkash',
  amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  transaction_id_normalized TEXT,
  sender_phone TEXT,
  status payment_attempt_status NOT NULL DEFAULT 'submitted',
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Partial unique index on normalized transaction id so verified transactions cannot be reused
CREATE UNIQUE INDEX IF NOT EXISTS payments_unique_verified_tx_idx
  ON public.payments (transaction_id_normalized)
  WHERE (status = 'verified' AND transaction_id_normalized IS NOT NULL AND transaction_id_normalized <> '');

-- 4.7 Admin Users Table (Role-based access mapping)
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role admin_role NOT NULL DEFAULT 'course_manager',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 4.8 Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  safe_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 4.9 Course Private Access Table (Secret Facebook Group URLs - Admin only!)
CREATE TABLE IF NOT EXISTS public.course_private_access (
  course_id UUID PRIMARY KEY REFERENCES public.courses(id) ON DELETE CASCADE,
  facebook_group_url TEXT NOT NULL,
  access_instructions TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- ==============================================================================
-- 5. Performance & Operational Indexes
-- ==============================================================================
CREATE INDEX IF NOT EXISTS courses_active_idx ON public.courses (is_active, order_index);
CREATE INDEX IF NOT EXISTS courses_slug_idx ON public.courses (slug);
CREATE INDEX IF NOT EXISTS teachers_published_idx ON public.teachers (is_published, display_order);
CREATE INDEX IF NOT EXISTS demos_published_idx ON public.class_demos (is_published, display_order);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.course_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_status_idx ON public.course_leads (lead_status, payment_status, enrollment_status);
CREATE INDEX IF NOT EXISTS leads_phone_idx ON public.course_leads (phone);
CREATE INDEX IF NOT EXISTS payments_lead_id_idx ON public.payments (lead_id);
CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx ON public.audit_logs (created_at DESC);

-- ==============================================================================
-- 6. Helper Functions for Role Authorization
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.is_admin(required_role public.admin_role DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
      AND is_active = true
      AND (
        required_role IS NULL
        OR role = 'super_admin'
        OR role = required_role
      )
  );
$$;

-- ==============================================================================
-- 7. Row Level Security (RLS) Policies
-- ==============================================================================

-- Enable RLS on all 9 tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_demos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_private_access ENABLE ROW LEVEL SECURITY;

-- 7.1 Courses Policies
DROP POLICY IF EXISTS "Public can view active courses" ON public.courses;
CREATE POLICY "Public can view active courses"
  ON public.courses FOR SELECT
  USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage courses" ON public.courses;
CREATE POLICY "Admins can manage courses"
  ON public.courses FOR ALL
  TO authenticated
  USING (public.is_admin('course_manager') OR public.is_admin('super_admin'))
  WITH CHECK (public.is_admin('course_manager') OR public.is_admin('super_admin'));

-- 7.2 Teachers Policies
DROP POLICY IF EXISTS "Public can view published teachers" ON public.teachers;
CREATE POLICY "Public can view published teachers"
  ON public.teachers FOR SELECT
  USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage teachers" ON public.teachers;
CREATE POLICY "Admins can manage teachers"
  ON public.teachers FOR ALL
  TO authenticated
  USING (public.is_admin('course_manager') OR public.is_admin('super_admin'))
  WITH CHECK (public.is_admin('course_manager') OR public.is_admin('super_admin'));

-- 7.3 Class Demos Policies
DROP POLICY IF EXISTS "Public can view published demos" ON public.class_demos;
CREATE POLICY "Public can view published demos"
  ON public.class_demos FOR SELECT
  USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage demos" ON public.class_demos;
CREATE POLICY "Admins can manage demos"
  ON public.class_demos FOR ALL
  TO authenticated
  USING (public.is_admin('course_manager') OR public.is_admin('super_admin'))
  WITH CHECK (public.is_admin('course_manager') OR public.is_admin('super_admin'));

-- 7.4 Site Settings Policies
DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
CREATE POLICY "Public can view site settings"
  ON public.site_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Super admins can update site settings" ON public.site_settings;
CREATE POLICY "Super admins can update site settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (public.is_admin('super_admin'))
  WITH CHECK (public.is_admin('super_admin'));

-- 7.5 Course Leads Policies
-- Note: Anonymous users CANNOT read, update, or delete leads.
-- Lead inserts are performed by the server action using service_role or authenticated admin.
DROP POLICY IF EXISTS "Admins can view and manage leads" ON public.course_leads;
CREATE POLICY "Admins can view and manage leads"
  ON public.course_leads FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 7.6 Payments Policies
DROP POLICY IF EXISTS "Admins can view and manage payments" ON public.payments;
CREATE POLICY "Admins can view and manage payments"
  ON public.payments FOR ALL
  TO authenticated
  USING (public.is_admin('payment_verifier') OR public.is_admin('super_admin'))
  WITH CHECK (public.is_admin('payment_verifier') OR public.is_admin('super_admin'));

-- 7.7 Admin Users Policies
DROP POLICY IF EXISTS "Admins can view own profile or super admin manages" ON public.admin_users;
CREATE POLICY "Admins can view own profile or super admin manages"
  ON public.admin_users FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin('super_admin'));

DROP POLICY IF EXISTS "Super admins can manage admin users" ON public.admin_users;
CREATE POLICY "Super admins can manage admin users"
  ON public.admin_users FOR ALL
  TO authenticated
  USING (public.is_admin('super_admin'))
  WITH CHECK (public.is_admin('super_admin'));

-- 7.8 Audit Logs Policies
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
CREATE POLICY "Admins can view audit logs"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (public.is_admin('super_admin'));

DROP POLICY IF EXISTS "Admins can insert audit logs" ON public.audit_logs;
CREATE POLICY "Admins can insert audit logs"
  ON public.audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- 7.9 Course Private Access Policies (strictly admin-only)
DROP POLICY IF EXISTS "Admins can manage private course access" ON public.course_private_access;
CREATE POLICY "Admins can manage private course access"
  ON public.course_private_access FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ==============================================================================
-- 8. Seed Initial Data
-- ==============================================================================

-- 8.1 Default Site Settings (Only insert if empty)
INSERT INTO public.site_settings (
  id,
  whatsapp_number,
  helpline_number,
  messenger_url,
  support_email,
  location_address,
  facebook_page_url,
  bkash_instructions,
  nagad_instructions
)
SELECT
  '00000000-0000-0000-0000-000000000001'::uuid,
  '+8801700000000',
  '+8801700000000',
  'https://m.me/eeeacademy',
  'support@eeeacademy.edu.bd',
  'Dhaka, Bangladesh',
  'https://facebook.com/eeeacademy',
  'Send Money / Payment to our verified merchant or personal number.',
  'Send Money / Payment to our verified Nagad number.'
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings);

-- 8.2 Seed Initial Courses
INSERT INTO public.courses (
  id,
  title,
  slug,
  description,
  department,
  category,
  semester,
  regular_price,
  discount_price,
  features,
  syllabus,
  duration,
  delivery_format,
  is_active,
  admission_open,
  order_index
)
VALUES
  (
    '11111111-1111-1111-1111-111111111111'::uuid,
    '4th Semester EEE Support',
    '4th-semester-eee-support',
    'Structured support for Diploma EEE 4th semester topics, board-exam style practice, and weekly doubt clearing.',
    'EEE',
    'semester',
    '4th',
    4500,
    3500,
    ARRAY['Weekly live classes', 'Board-pattern practice sets', 'Recorded class access', 'WhatsApp support group after enrollment'],
    '["Electrical Circuits II", "Electronics I", "Electrical Engineering Materials", "Board question discussion"]'::jsonb,
    '12 weeks',
    'Live online classes',
    true,
    true,
    1
  ),
  (
    '22222222-2222-2222-2222-222222222222'::uuid,
    'DUET Admission Preparation',
    'duet-admission-preparation',
    'Focused preparation for Diploma EEE students planning to sit for DUET admission.',
    'EEE',
    'duet_admission',
    NULL,
    8000,
    NULL,
    ARRAY['Admission syllabus coverage', 'Model tests', 'Problem-solving classes'],
    '["Mathematics", "Physics", "EEE fundamentals", "Model exams"]'::jsonb,
    '16 weeks',
    'Live online classes',
    true,
    true,
    2
  ),
  (
    '33333333-3333-3333-3333-333333333333'::uuid,
    'EEE Job Preparation',
    'eee-job-preparation',
    'Preparation pathway for government and private job examinations relevant to Diploma EEE graduates.',
    'EEE',
    'job_prep',
    NULL,
    6000,
    5000,
    ARRAY['MCQ practice', 'Written exam guidance', 'Subject-wise revision'],
    '["Basic electricity", "Machines", "Power systems", "General knowledge for jobs"]'::jsonb,
    '14 weeks',
    'Live online classes',
    true,
    true,
    3
  ),
  (
    '44444444-4444-4444-4444-444444444444'::uuid,
    '5th Semester EEE Support',
    '5th-semester-eee-support',
    'Semester support for 5th semester Diploma EEE students. Admission is currently closed in this preview.',
    'EEE',
    'semester',
    '5th',
    4500,
    NULL,
    ARRAY['Live classes', 'Practice sheets', 'Exam discussion'],
    '["Digital Electronics", "Electrical Machines", "Power"]'::jsonb,
    '12 weeks',
    'Live online classes',
    true,
    false,
    4
  )
ON CONFLICT (slug) DO NOTHING;

-- 8.3 Seed Initial Teachers
INSERT INTO public.teachers (
  id,
  name,
  qualifications,
  institution_or_batch,
  expertise,
  bio,
  photo_url,
  display_order,
  is_published
)
VALUES
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
    'Engr. Tanvir Ahmed',
    'B.Sc in EEE (DUET), Diploma in EEE',
    'DUET Batch 18',
    'Electrical Circuits & Power Systems',
    'Experienced mentor dedicated to helping diploma engineering students master fundamentals and excel in board exams.',
    NULL,
    1,
    true
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
    'Engr. Rafiul Hasan',
    'B.Sc in EEE (BUET), Ex-Sub Assistant Engineer',
    'BUET Batch 16',
    'Electronics, Machines & Job Prep',
    'Specialist in power systems, electrical machines, and DUET admission problem solving techniques.',
    NULL,
    2,
    true
  )
ON CONFLICT (id) DO NOTHING;

-- 8.4 Seed Initial Class Demos
INSERT INTO public.class_demos (
  id,
  title,
  topic,
  description,
  teacher_id,
  video_url,
  thumbnail_url,
  display_order,
  is_published
)
VALUES
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid,
    'Circuit Analysis Mastery',
    'Kirchhoff’s Laws & Nodal Analysis',
    'Comprehensive explanation of node voltage analysis with diploma board questions solution.',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    NULL,
    1,
    true
  ),
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid,
    'Transformer Fundamentals',
    'Electrical Machines & Phasor Diagram',
    'Step-by-step visual explanation of single phase transformer operation under load conditions.',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    NULL,
    2,
    true
  )
ON CONFLICT (id) DO NOTHING;
