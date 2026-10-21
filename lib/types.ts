export type CourseCategory = "semester" | "duet_admission" | "job_prep";

export type LeadStatus = "pending" | "contacted" | "closed" | "cancelled";
export type PaymentStatus = "not_submitted" | "submitted" | "verified" | "rejected";
export type EnrollmentStatus =
  | "not_enrolled"
  | "pending"
  | "active"
  | "completed"
  | "cancelled";
export type GroupAccessStatus = "not_added" | "added" | "removed";
export type PaymentMethod = "bkash" | "nagad" | "other_manual";
export type PaymentAttemptStatus = "submitted" | "verified" | "rejected";
export type AdminRole = "super_admin" | "course_manager" | "payment_verifier";

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  department: string;
  category: CourseCategory;
  semester: string | null;
  regular_price: number;
  discount_price: number | null;
  features: string[];
  syllabus: string[];
  duration: string;
  delivery_format: string;
  is_active: boolean;
  admission_open: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Teacher {
  id: string;
  name: string;
  qualifications: string;
  institution_or_batch: string;
  expertise: string;
  bio: string;
  photo_url: string | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClassDemo {
  id: string;
  title: string;
  topic: string;
  description: string;
  teacher_id: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CourseLead {
  id: string;
  course_id: string | null;
  course_title_snapshot: string;
  course_price_snapshot: number;
  student_name: string;
  polytechnic: string;
  polytechnic_roll: string;
  department: string;
  semester: string | null;
  phone: string;
  whatsapp_number: string;
  email: string | null;
  lead_status: LeadStatus;
  payment_status: PaymentStatus;
  enrollment_status: EnrollmentStatus;
  group_access_status: GroupAccessStatus;
  admin_notes: string | null;
  idempotency_key: string;
  is_likely_duplicate: boolean;
  created_at: string;
  updated_at: string;
  last_contacted_at: string | null;
  enrolled_at: string | null;
}

export interface Payment {
  id: string;
  lead_id: string;
  method: PaymentMethod;
  amount: number;
  transaction_id_normalized: string | null;
  sender_phone: string | null;
  status: PaymentAttemptStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  whatsapp_number: string | null;
  helpline_number: string | null;
  support_email: string | null;
  location_address: string | null;
  map_url: string | null;
  facebook_page_url: string | null;
  bkash_instructions: string | null;
  nagad_instructions: string | null;
  updated_at: string;
}

export interface InquiryInput {
  student_name: string;
  polytechnic: string;
  polytechnic_roll: string;
  department: string;
  semester: string;
  phone: string;
  whatsapp_number: string;
  whatsapp_same_as_phone: boolean;
  email: string;
  course_id: string;
  website: string;
}

export type InquiryResult =
  | { ok: true; prototype: true }
  | { ok: false; fieldErrors: Record<string, string> };
