import { mockCourses } from "@/lib/mock/courses";
import { mockDemos } from "@/lib/mock/demos";
import { mockLeads } from "@/lib/mock/leads";
import { mockPayments } from "@/lib/mock/payments";
import { mockSettings } from "@/lib/mock/settings";
import { mockTeachers } from "@/lib/mock/teachers";
import type {
  ClassDemo,
  Course,
  CourseCategory,
  CourseLead,
  InquiryInput,
  InquiryResult,
  Payment,
  SiteSettings,
  Teacher,
} from "@/lib/types";
import { getDisplayPrice } from "@/lib/pricing";

export interface CourseFilters {
  category?: CourseCategory | "all";
  semester?: string | "all";
}

export function getPublicCourses(filters: CourseFilters = {}): Course[] {
  return mockCourses
    .filter((course) => course.is_active)
    .filter((course) => {
      if (!filters.category || filters.category === "all") return true;
      return course.category === filters.category;
    })
    .filter((course) => {
      if (!filters.semester || filters.semester === "all") return true;
      return course.semester === filters.semester;
    })
    .sort((a, b) => a.order_index - b.order_index);
}

export function getFeaturedCourses(): Course[] {
  return getPublicCourses().slice(0, 4);
}

export function getPublicCourseBySlug(slug: string): Course | null {
  return mockCourses.find((course) => course.slug === slug && course.is_active) ?? null;
}

export function getCourseById(id: string): Course | null {
  return mockCourses.find((course) => course.id === id) ?? null;
}

export function getPublishedTeachers(): Teacher[] {
  return mockTeachers
    .filter((teacher) => teacher.is_published)
    .sort((a, b) => a.display_order - b.display_order);
}

export function getAllTeachers(): Teacher[] {
  return [...mockTeachers].sort((a, b) => a.display_order - b.display_order);
}

export function getTeacherById(id: string): Teacher | null {
  return mockTeachers.find((teacher) => teacher.id === id) ?? null;
}

export function getPublishedDemos(): ClassDemo[] {
  return mockDemos
    .filter((demo) => demo.is_published)
    .sort((a, b) => a.display_order - b.display_order);
}

export function getAllDemos(): ClassDemo[] {
  return [...mockDemos].sort((a, b) => a.display_order - b.display_order);
}

export function getPublicSettings(): SiteSettings {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("eee_academy_site_settings");
      if (stored) {
        return { ...mockSettings, ...JSON.parse(stored) };
      }
    } catch {}
  }
  return mockSettings;
}

export function saveSettings(settings: SiteSettings): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("eee_academy_site_settings", JSON.stringify(settings));
      window.dispatchEvent(new Event("eee_settings_updated"));
    } catch {}
  }
}

export function getLeads(): CourseLead[] {
  return [...mockLeads].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

export function getPaymentsForLead(leadId: string): Payment[] {
  return mockPayments.filter((payment) => payment.lead_id === leadId);
}

export function getOverviewCounts() {
  const leads = getLeads();
  return {
    pendingLeads: leads.filter((lead) => lead.lead_status === "pending").length,
    contactedLeads: leads.filter((lead) => lead.lead_status === "contacted").length,
    submittedPayments: leads.filter((lead) => lead.payment_status === "submitted").length,
    verifiedPayments: leads.filter((lead) => lead.payment_status === "verified").length,
    activeEnrollments: leads.filter((lead) => lead.enrollment_status === "active").length,
  };
}

export function submitInquiry(payload: InquiryInput): InquiryResult {
  const fieldErrors: Record<string, string> = {};

  if (!payload.student_name.trim()) fieldErrors.student_name = "Enter the student full name.";
  if (!payload.polytechnic.trim()) fieldErrors.polytechnic = "Enter the polytechnic or institute name.";
  if (!payload.polytechnic_roll.trim()) fieldErrors.polytechnic_roll = "Enter the roll number.";
  if (!payload.department.trim()) fieldErrors.department = "Enter the department.";
  if (!payload.phone.trim()) fieldErrors.phone = "Enter a contact phone number.";
  if (!payload.whatsapp_same_as_phone && !payload.whatsapp_number.trim()) {
    fieldErrors.whatsapp_number = "Enter a WhatsApp number or choose same as phone.";
  }
  if (payload.website.trim()) fieldErrors.website = "Unable to submit.";

  const course = getCourseById(payload.course_id);
  if (!course || !course.is_active) {
    fieldErrors.course_id = "Select an available course.";
  } else if (!course.admission_open) {
    fieldErrors.course_id = "Admission is closed for this course.";
  }

  if (payload.phone && !isLikelyBdPhone(payload.phone)) {
    fieldErrors.phone = "Enter a valid Bangladeshi phone number.";
  }

  if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    fieldErrors.email = "Enter a valid email or leave it blank.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  void getDisplayPrice(course as Course);
  return { ok: true, prototype: true };
}

function isLikelyBdPhone(value: string) {
  const digits = value.replace(/[\s-]/g, "");
  return /^(?:\+?8801|01)\d{9}$/.test(digits);
}

export function categoryLabel(category: CourseCategory) {
  switch (category) {
    case "semester":
      return "Semester";
    case "duet_admission":
      return "DUET admission";
    case "job_prep":
      return "Job preparation";
  }
}

// -------------------------------------------------------------
// Live Supabase Async Fetchers (with graceful fallback to mocks)
// -------------------------------------------------------------
import { createClient } from "@/lib/supabase/client";

export function normalizeCourse(raw: any): Course {
  if (!raw) return raw;
  let imageUrl: string | null = raw.image_url || null;
  const rawFeatures: string[] = Array.isArray(raw.features) ? raw.features : [];
  const cleanFeatures: string[] = [];

  for (const f of rawFeatures) {
    if (typeof f === "string" && f.startsWith("img:")) {
      if (!imageUrl) {
        imageUrl = f.slice(4).trim();
      }
    } else {
      cleanFeatures.push(f);
    }
  }

  return {
    ...raw,
    image_url: imageUrl,
    features: cleanFeatures,
  };
}

export async function fetchPublicCourses(filters: CourseFilters = {}): Promise<Course[]> {
  try {
    const supabase = createClient();
    let query = supabase
      .from("courses")
      .select("*")
      .eq("is_active", true)
      .order("order_index", { ascending: true });

    if (filters.category && filters.category !== "all") {
      query = query.eq("category", filters.category);
    }
    if (filters.semester && filters.semester !== "all") {
      query = query.eq("semester", filters.semester);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data.map(normalizeCourse);
    }
  } catch (err) {
    console.warn("fetchPublicCourses notice:", err);
  }
  return getPublicCourses(filters).map(normalizeCourse);
}

export async function fetchFeaturedCourses(): Promise<Course[]> {
  const courses = await fetchPublicCourses();
  return courses.slice(0, 4);
}

export async function fetchPublicCourseBySlug(slug: string): Promise<Course | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    if (!error && data) {
      return normalizeCourse(data);
    }
  } catch (err) {
    console.warn("fetchPublicCourseBySlug notice:", err);
  }
  const fallback = getPublicCourseBySlug(slug);
  return fallback ? normalizeCourse(fallback) : null;
}

export async function fetchPublishedTeachers(): Promise<Teacher[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("teachers")
      .select("*")
      .eq("is_published", true)
      .order("display_order", { ascending: true });

    if (!error && data && data.length > 0) {
      return data as Teacher[];
    }
  } catch (err) {
    console.warn("fetchPublishedTeachers notice:", err);
  }
  return getPublishedTeachers();
}

export async function fetchPublishedDemos(): Promise<ClassDemo[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("class_demos")
      .select("*")
      .eq("is_published", true)
      .order("display_order", { ascending: true });

    if (!error && data && data.length > 0) {
      return data as ClassDemo[];
    }
  } catch (err) {
    console.warn("fetchPublishedDemos notice:", err);
  }
  return getPublishedDemos();
}

export async function fetchPublicSettings(): Promise<SiteSettings> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      return data as SiteSettings;
    }
  } catch (err) {
    console.warn("fetchPublicSettings notice:", err);
  }
  return getPublicSettings();
}

