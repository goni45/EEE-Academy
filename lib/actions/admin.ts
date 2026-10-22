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
