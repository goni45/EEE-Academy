"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { mockCourses } from "@/lib/mock/courses";
import { mockSettings } from "@/lib/mock/settings";
import type { InquiryInput } from "@/lib/types";

export interface ServerInquiryResponse {
  ok: boolean;
  leadId?: string;
  courseTitle?: string;
  coursePrice?: number;
  courseFee?: number;
  whatsappUrl?: string;
  whatsappMessage?: string;
  fieldErrors?: Record<string, string>;
  serverError?: string;
  isMockFallback?: boolean;
}

function normalizeBdPhone(phone: string): string {
  const cleaned = phone.replace(/[\s-]/g, "");
  if (cleaned.startsWith("+880")) return cleaned;
  if (cleaned.startsWith("880")) return `+${cleaned}`;
  if (cleaned.startsWith("01")) return `+88${cleaned}`;
  return cleaned;
}

function normalizeWaNumber(phone: string): string {
  const cleaned = phone.replace(/[+\s-]/g, "");
  if (cleaned.startsWith("01")) return `88${cleaned}`;
  return cleaned;
}

export async function submitInquiryAction(
  payload: InquiryInput
): Promise<ServerInquiryResponse> {
  const fieldErrors: Record<string, string> = {};

  // Honeypot check
  if (payload.website && payload.website.trim()) {
    return { ok: false, serverError: "Submission rejected." };
  }

  // Field validations
  if (!payload.student_name || !payload.student_name.trim()) {
    fieldErrors.student_name = "শিক্ষার্থীর পূর্ণ নাম লিখুন।";
  }
  if (!payload.polytechnic || !payload.polytechnic.trim()) {
    fieldErrors.polytechnic = "পলিটেকনিক বা ইনস্টিটিউটের নাম লিখুন।";
  }
  if (!payload.polytechnic_roll || !payload.polytechnic_roll.trim()) {
    fieldErrors.polytechnic_roll = "পলিটেকনিক রোল নম্বর লিখুন।";
  }
  if (!payload.department || !payload.department.trim()) {
    fieldErrors.department = "ডিপার্টমেন্টের নাম লিখুন।";
  }
  if (!payload.phone || !payload.phone.trim()) {
    fieldErrors.phone = "সচল মোবাইল নম্বর লিখুন।";
  } else {
    const digits = payload.phone.replace(/[\s-]/g, "");
    if (!/^(?:\+?8801|01)\d{9}$/.test(digits)) {
      fieldErrors.phone = "সঠিক বাংলাদেশী মোবাইল নম্বর লিখুন (যেমন: 01XXXXXXXXX)।";
    }
  }

  const effectiveWhatsapp = payload.whatsapp_same_as_phone
    ? payload.phone
    : payload.whatsapp_number;

  if (!effectiveWhatsapp || !effectiveWhatsapp.trim()) {
    fieldErrors.whatsapp_number = "হোয়াটসঅ্যাপ নম্বর লিখুন।";
  }

  if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email.trim())) {
    fieldErrors.email = "সঠিক ইমেইল এড্রেস লিখুন অথবা খালি রাখুন।";
  }

  if (!payload.course_id) {
    fieldErrors.course_id = "একটি কোর্স নির্বাচন করুন।";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  const supabase = createAdminClient();

  // 1. Fetch Course from Supabase
  let courseTitle = "";
  let courseFee = 0;

  try {
    const { data: courseData, error: courseError } = await supabase
      .from("courses")
      .select("id, title, regular_price, discount_price, is_active, admission_open")
      .eq("id", payload.course_id)
      .maybeSingle();

    if (!courseError && courseData) {
      if (!courseData.is_active) {
        return { ok: false, fieldErrors: { course_id: "এই কোর্সটি বর্তমানে সক্রিয় নয়।" } };
      }
      if (!courseData.admission_open) {
        return { ok: false, fieldErrors: { course_id: "এই কোর্সে বর্তমানে ভর্তি বন্ধ রয়েছে।" } };
      }
      courseTitle = courseData.title;
      courseFee =
        courseData.discount_price !== null && courseData.discount_price >= 0
          ? Number(courseData.discount_price)
          : Number(courseData.regular_price);
    } else {
      // Fallback to mock course if table not created or record not found
      const mock = mockCourses.find((c) => c.id === payload.course_id);
      if (mock) {
        if (!mock.is_active || !mock.admission_open) {
          return { ok: false, fieldErrors: { course_id: "এই কোর্সে ভর্তি বন্ধ।" } };
        }
        courseTitle = mock.title;
        courseFee = mock.discount_price ?? mock.regular_price;
      } else {
        return { ok: false, fieldErrors: { course_id: "নির্বাচিত কোর্সটি পাওয়া যায়নি।" } };
      }
    }
  } catch {
    const mock = mockCourses.find((c) => c.id === payload.course_id);
    if (mock) {
      courseTitle = mock.title;
      courseFee = mock.discount_price ?? mock.regular_price;
    } else {
      return { ok: false, serverError: "কোর্স লোড করতে সমস্যা হয়েছে।" };
    }
  }

  // 2. Fetch Academy Official WhatsApp Number
  let officialWhatsapp = "8801700000000";
  try {
    const { data: settings } = await supabase
      .from("site_settings")
      .select("whatsapp_number")
      .limit(1)
      .maybeSingle();

    if (settings?.whatsapp_number) {
      officialWhatsapp = normalizeWaNumber(settings.whatsapp_number);
    } else if (mockSettings.whatsapp_number) {
      officialWhatsapp = normalizeWaNumber(mockSettings.whatsapp_number);
    }
  } catch {
    if (mockSettings.whatsapp_number) {
      officialWhatsapp = normalizeWaNumber(mockSettings.whatsapp_number);
    }
  }

  // 3. Normalization and Idempotency Key
  const normalizedPhone = normalizeBdPhone(payload.phone);
  const normalizedWa = normalizeBdPhone(effectiveWhatsapp);
  const idempotencyKey = `lead_${normalizedPhone}_${payload.course_id}_${new Date().toISOString().slice(0, 10)}`;

  let leadId = `lead-${Date.now()}`;
  let isMockFallback = false;

  // 4. Insert into course_leads in Supabase
  try {
    const { data: insertedLead, error: insertError } = await supabase
      .from("course_leads")
      .upsert(
        {
          course_id: payload.course_id,
          course_title_snapshot: courseTitle,
          course_price_snapshot: courseFee,
          student_name: payload.student_name.trim(),
          polytechnic: payload.polytechnic.trim(),
          polytechnic_roll: payload.polytechnic_roll.trim(),
          department: payload.department.trim(),
          semester: payload.semester?.trim() || null,
          phone: normalizedPhone,
          whatsapp_number: normalizedWa,
          email: payload.email?.trim() || null,
          lead_status: "pending",
          payment_status: "not_submitted",
          enrollment_status: "not_enrolled",
          group_access_status: "not_added",
          idempotency_key: idempotencyKey,
        },
        { onConflict: "idempotency_key" }
      )
      .select("id")
      .single();

    if (insertError) {
      console.warn("Supabase lead insertion notice (using local leadId):", insertError.message);
      isMockFallback = true;
    } else if (insertedLead) {
      leadId = insertedLead.id;
    }
  } catch (err) {
    console.warn("Supabase connection notice:", err);
    isMockFallback = true;
  }

  // 5. Build WhatsApp Message & URL
  const whatsappMessage = `আসসালামু আলাইকুম EEE Academy,
আমি ${payload.student_name.trim()}। আমি আপনাদের "${courseTitle}" কোর্সে ভর্তি হতে আগ্রহী।

কোর্সের ফি: ৳${courseFee}
পলিটেকনিক: ${payload.polytechnic.trim()}
রোল নম্বর: ${payload.polytechnic_roll.trim()}
ডিপার্টমেন্ট: ${payload.department.trim()}
সেমিস্টার: ${payload.semester?.trim() || "N/A"}
মোবাইল: ${normalizedPhone}
হোয়াটসঅ্যাপ: ${normalizedWa}

অনুগ্রহ করে আমাকে পেমেন্ট করার নিয়ম ও ভর্তির পরবর্তী নির্দেশনা জানিয়ে সাহায্য করবেন। ধন্যবাদ।`;

  const whatsappUrl = `https://wa.me/${officialWhatsapp}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return {
    ok: true,
    leadId,
    courseTitle,
    courseFee,
    whatsappUrl,
    whatsappMessage,
    isMockFallback,
  };
}
