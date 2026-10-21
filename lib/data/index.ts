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
  return mockSettings;
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
