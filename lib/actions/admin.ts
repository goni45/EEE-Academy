"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type {
  EnrollmentStatus,
  GroupAccessStatus,
  LeadStatus,
  PaymentStatus,
  SiteSettings,
} from "@/lib/types";

// Update Lead Status & Notes
export async function updateLeadStatusAction(
  leadId: string,
  updates: {
    lead_status?: LeadStatus;
    payment_status?: PaymentStatus;
    enrollment_status?: EnrollmentStatus;
    group_access_status?: GroupAccessStatus;
    admin_notes?: string;
  }
) {
  const supabase = createAdminClient();
  try {
    const payload: Record<string, unknown> = { ...updates };
    if (updates.lead_status === "contacted") {
      payload.last_contacted_at = new Date().toISOString();
    }
    if (updates.enrollment_status === "active") {
      payload.enrolled_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("course_leads")
      .update(payload)
      .eq("id", leadId)
      .select()
      .single();

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidatePath("/admin/leads");
    revalidatePath("/admin");
    return { ok: true, data };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Update failed";
    return { ok: false, error: message };
  }
}

// Add/Update Payment Verification
export async function recordPaymentAction(payment: {
  lead_id: string;
  method: "bkash" | "nagad" | "other_manual";
  amount: number;
  transaction_id_normalized?: string;
  sender_phone?: string;
  status: "submitted" | "verified" | "rejected";
  rejection_reason?: string;
}) {
  const supabase = createAdminClient();
  try {
    const { data, error } = await supabase
      .from("payments")
      .insert({
        lead_id: payment.lead_id,
        method: payment.method,
        amount: payment.amount,
        transaction_id_normalized: payment.transaction_id_normalized || null,
        sender_phone: payment.sender_phone || null,
        status: payment.status,
        reviewed_at: new Date().toISOString(),
        rejection_reason: payment.rejection_reason || null,
      })
      .select()
      .single();

    if (error) {
      return { ok: false, error: error.message };
    }

    // Sync status to lead
    await supabase
      .from("course_leads")
      .update({ payment_status: payment.status })
      .eq("id", payment.lead_id);

    revalidatePath("/admin/leads");
    revalidatePath("/admin");
    return { ok: true, data };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Payment record failed";
    return { ok: false, error: message };
  }
}

// Save Operational Site Settings
export async function updateSiteSettingsAction(settings: Partial<SiteSettings>) {
  const supabase = createAdminClient();
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .upsert(
        {
          id: settings.id || "00000000-0000-0000-0000-000000000001",
          whatsapp_number: settings.whatsapp_number,
          helpline_number: settings.helpline_number,
          messenger_url: settings.messenger_url,
          support_email: settings.support_email,
          location_address: settings.location_address,
          facebook_page_url: settings.facebook_page_url,
          bkash_instructions: settings.bkash_instructions,
          nagad_instructions: settings.nagad_instructions,
        },
        { onConflict: "id" }
      )
      .select()
      .single();

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/settings");
    return { ok: true, data };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Settings update failed";
    return { ok: false, error: message };
  }
}

function isUuid(id?: string): boolean {
  if (!id) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

// -------------------------------------------------------------
// Course Management Actions
// -------------------------------------------------------------
import type { Course, Teacher, ClassDemo } from "@/lib/types";
import { normalizeCourse } from "@/lib/data";

export async function upsertCourseAction(course: Partial<Course>) {
  const supabase = createAdminClient();
  try {
    // Preserve image_url in features array as well (failsafe against missing column)
    const baseFeatures = (course.features || []).filter((f) => !f.startsWith("img:"));
    if (course.image_url) {
      baseFeatures.push(`img:${course.image_url}`);
    }

    const payload: Record<string, unknown> = {
      title: course.title,
      slug: course.slug || course.title?.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-"),
      description: course.description || "",
      department: course.department || "EEE",
      category: course.category || "semester",
      semester: course.semester || null,
      regular_price: Number(course.regular_price) || 0,
      discount_price: course.discount_price !== null && course.discount_price !== undefined ? Number(course.discount_price) : null,
      features: baseFeatures,
      syllabus: course.syllabus || [],
      duration: course.duration || "12 weeks",
      delivery_format: course.delivery_format || "Live online classes",
      is_active: course.is_active ?? true,
      admission_open: course.admission_open ?? true,
      order_index: course.order_index ?? 0,
    };

    if (isUuid(course.id)) {
      payload.id = course.id;
    }

    // Attempt upsert with native image_url first
    let { data, error } = await supabase
      .from("courses")
      .upsert({ ...payload, image_url: course.image_url || null }, { onConflict: "slug" })
      .select()
      .single();

    // If image_url column doesn't exist yet, retry without it (features still safely keeps img:<url>)
    if (error && (error.code === "42703" || error.message.includes("image_url"))) {
      const retry = await supabase
        .from("courses")
        .upsert(payload, { onConflict: "slug" })
        .select()
        .single();
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/courses");
    revalidatePath("/admin/courses");
    return { ok: true, data: normalizeCourse(data) };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Course save failed";
    return { ok: false, error: message };
  }
}

export async function deleteCourseAction(id: string) {
  const supabase = createAdminClient();
  try {
    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/");
    revalidatePath("/courses");
    revalidatePath("/admin/courses");
    return { ok: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Delete failed";
    return { ok: false, error: message };
  }
}

// -------------------------------------------------------------
// Teacher Management Actions
// -------------------------------------------------------------
export async function upsertTeacherAction(teacher: Partial<Teacher>) {
  const supabase = createAdminClient();
  try {
    const payload: Record<string, unknown> = {
      name: teacher.name,
      qualifications: teacher.qualifications || "",
      institution_or_batch: teacher.institution_or_batch || "",
      expertise: teacher.expertise || "",
      bio: teacher.bio || "",
      photo_url: teacher.photo_url || null,
      display_order: teacher.display_order ?? 0,
      is_published: teacher.is_published ?? true,
    };

    if (isUuid(teacher.id)) {
      payload.id = teacher.id;
    }

    const { data, error } = await supabase
      .from("teachers")
      .upsert(payload)
      .select()
      .single();

    if (error) return { ok: false, error: error.message };
    revalidatePath("/");
    revalidatePath("/admin/teachers");
    return { ok: true, data: data as Teacher };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Teacher save failed";
    return { ok: false, error: message };
  }
}

export async function deleteTeacherAction(id: string) {
  const supabase = createAdminClient();
  try {
    const { error } = await supabase.from("teachers").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/");
    revalidatePath("/admin/teachers");
    return { ok: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Delete failed";
    return { ok: false, error: message };
  }
}

// -------------------------------------------------------------
// Class Demo Management Actions
// -------------------------------------------------------------
export async function upsertDemoAction(demo: Partial<ClassDemo>) {
  const supabase = createAdminClient();
  try {
    const payload: Record<string, unknown> = {
      title: demo.title,
      topic: demo.topic || "",
      description: demo.description || "",
      teacher_id: isUuid(demo.teacher_id || "") ? demo.teacher_id : null,
      video_url: demo.video_url || null,
      thumbnail_url: demo.thumbnail_url || null,
      display_order: demo.display_order ?? 0,
      is_published: demo.is_published ?? true,
    };

    if (isUuid(demo.id)) {
      payload.id = demo.id;
    }

    const { data, error } = await supabase
      .from("class_demos")
      .upsert(payload)
      .select()
      .single();

    if (error) return { ok: false, error: error.message };
    revalidatePath("/");
    revalidatePath("/admin/demos");
    return { ok: true, data: data as ClassDemo };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Demo save failed";
    return { ok: false, error: message };
  }
}

export async function deleteDemoAction(id: string) {
  const supabase = createAdminClient();
  try {
    const { error } = await supabase.from("class_demos").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/");
    revalidatePath("/admin/demos");
    return { ok: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Delete failed";
    return { ok: false, error: message };
  }
}

// -------------------------------------------------------------
// Admin Overview Real-Time Counters
// -------------------------------------------------------------
export async function getAdminOverviewStatsAction() {
  const supabase = createAdminClient();
  try {
    const { data: leads, error } = await supabase
      .from("course_leads")
      .select("lead_status, payment_status, enrollment_status");

    if (error || !leads) {
      return {
        pendingLeads: 0,
        contactedLeads: 0,
        submittedPayments: 0,
        verifiedPayments: 0,
        activeEnrollments: 0,
      };
    }

    return {
      pendingLeads: leads.filter((l) => l.lead_status === "pending").length,
      contactedLeads: leads.filter((l) => l.lead_status === "contacted").length,
      submittedPayments: leads.filter((l) => l.payment_status === "submitted").length,
      verifiedPayments: leads.filter((l) => l.payment_status === "verified").length,
      activeEnrollments: leads.filter((l) => l.enrollment_status === "active").length,
    };
  } catch {
    return {
      pendingLeads: 0,
      contactedLeads: 0,
      submittedPayments: 0,
      verifiedPayments: 0,
      activeEnrollments: 0,
    };
  }
}
