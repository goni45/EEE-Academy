"use client";

import { Button } from "@/components/ui/button";
import { SampleHint } from "@/components/ui/prototype-mark";
import { getPublicCourses } from "@/lib/data";
import { submitInquiryAction, type ServerInquiryResponse } from "@/lib/actions/inquiry";
import { formatTaka, getDisplayPrice } from "@/lib/pricing";
import type { Course, InquiryInput } from "@/lib/types";
import { Check, Copy, ExternalLink, MessageCircle, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";

const empty: InquiryInput = {
  student_name: "",
  polytechnic: "",
  polytechnic_roll: "",
  department: "EEE",
  semester: "",
  phone: "",
  whatsapp_number: "",
  whatsapp_same_as_phone: true,
  email: "",
  course_id: "",
  website: "",
};

export function InquiryForm({
  course,
  onClose,
}: {
  course?: Course | null;
  onClose?: () => void;
}) {
  const courses = useMemo(
    () => getPublicCourses().filter((item) => item.admission_open),
    [],
  );
  const [values, setValues] = useState<InquiryInput>({
    ...empty,
    course_id: course?.id ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [confirmedData, setConfirmedData] = useState<ServerInquiryResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const selected =
    courses.find((item) => item.id === values.course_id) ?? course ?? null;
  const price = selected ? getDisplayPrice(selected) : null;

  function update<K extends keyof InquiryInput>(key: K, value: InquiryInput[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setErrors({});
    setGeneralError(null);
    setPending(true);

    // Pre-open blank tab synchronously on click to avoid browser popup blockers
    let waWindow: Window | null = null;
    try {
      waWindow = window.open("", "_blank");
    } catch {
      // Ignored if blocked
    }

    try {
      const result = await submitInquiryAction(values);
      setPending(false);

      if (!result.ok) {
        waWindow?.close();
        if (result.fieldErrors) {
          setErrors(result.fieldErrors);
          const first = Object.keys(result.fieldErrors)[0];
          document.getElementById(first)?.focus();
        } else if (result.serverError) {
          setGeneralError(result.serverError);
        }
        return;
      }

      setConfirmedData(result);

      // Attempt popup navigation
      if (result.whatsappUrl && waWindow) {
        waWindow.location.href = result.whatsappUrl;
      }
    } catch {
      waWindow?.close();
      setPending(false);
      setGeneralError("একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। দয়া করে আবার চেষ্টা করুন।");
    }
  }

  function copyWhatsAppMessage() {
    if (!confirmedData?.whatsappMessage) return;
    navigator.clipboard.writeText(confirmedData.whatsappMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  if (confirmedData) {
    return (
      <div className="space-y-5" role="status">
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-400">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20">
            <Check className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">ইনকোয়ারি ডাটাবেজে সংরক্ষিত হয়েছে!</h3>
            <p className="text-xs text-muted">
              আইডি: <span className="font-mono text-emerald-400">{confirmedData.leadId}</span>
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-stroke bg-bg/60 p-4 space-y-2 text-sm">
          <div className="flex justify-between items-center text-xs text-muted">
            <span>নির্বাচিত কোর্স:</span>
            <span className="text-text-primary font-medium">{confirmedData.courseTitle}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-muted">
            <span>কোর্স ফি:</span>
            <span className="text-text-primary font-bold">৳{confirmedData.courseFee?.toLocaleString()}</span>
          </div>
          <p className="text-xs leading-relaxed text-muted pt-2 border-t border-stroke/60">
            আপনার আবেদনটি ডাটাবেজে সফলভাবে যুক্ত হয়েছে। ভর্তির পরবর্তী ধাপ এবং বিকাশ/নগদ পেমেন্ট ইন্সট্রাকশন পেতে নিচের বাটনে ক্লিক করে হোয়াটসঅ্যাপে মেসেজটি পাঠিয়ে দিন।
          </p>
        </div>

        <div className="space-y-2.5">
          {confirmedData.whatsappUrl ? (
            <a
              href={confirmedData.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 font-medium text-black transition hover:bg-[#20ba59] shadow-lg shadow-[#25D366]/20"
            >
              <MessageCircle className="h-5 w-5" />
              <span>হোয়াটসঅ্যাপে মেসেজ পাঠান</span>
              <ExternalLink className="h-4 w-4 ml-0.5 opacity-80" />
            </a>
          ) : null}

          <button
            type="button"
            onClick={copyWhatsAppMessage}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-stroke bg-surface px-4 py-2.5 text-xs text-text-primary transition hover:border-[#89AACC] hover:bg-bg"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400">মেসেজ কপি করা হয়েছে!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-muted" />
                <span>মেসেজ টেক্সট কপি করুন (বিকল্প অপশন)</span>
              </>
            )}
          </button>

          {onClose ? (
            <Button variant="ghost" onClick={onClose} className="w-full text-xs text-muted">
              বন্ধ করুন
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <Field id="student_name" label="Student full name" error={errors.student_name} required>
        <input
          id="student_name"
          value={values.student_name}
          onChange={(e) => update("student_name", e.target.value)}
          className="field"
          autoComplete="name"
        />
      </Field>
      <Field id="polytechnic" label="Polytechnic / institute" error={errors.polytechnic} required>
        <input
          id="polytechnic"
          value={values.polytechnic}
          onChange={(e) => update("polytechnic", e.target.value)}
          className="field"
        />
      </Field>
      <Field id="polytechnic_roll" label="Polytechnic roll number" error={errors.polytechnic_roll} required>
        <input
          id="polytechnic_roll"
          value={values.polytechnic_roll}
          onChange={(e) => update("polytechnic_roll", e.target.value)}
          className="field"
        />
      </Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field id="department" label="Department" error={errors.department} required>
          <input
            id="department"
            value={values.department}
            onChange={(e) => update("department", e.target.value)}
            className="field"
          />
        </Field>
        <Field id="semester" label="Semester / study level">
          <input
            id="semester"
            value={values.semester}
            onChange={(e) => update("semester", e.target.value)}
            className="field"
          />
        </Field>
      </div>
      <Field id="phone" label="Contact phone" error={errors.phone} required>
        <input
          id="phone"
          value={values.phone}
          onChange={(e) => update("phone", e.target.value)}
          className="field"
          inputMode="tel"
          autoComplete="tel"
        />
      </Field>
      <label className="flex items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          checked={values.whatsapp_same_as_phone}
          onChange={(e) => update("whatsapp_same_as_phone", e.target.checked)}
        />
        WhatsApp number is the same as phone
      </label>
      {!values.whatsapp_same_as_phone ? (
        <Field id="whatsapp_number" label="WhatsApp number" error={errors.whatsapp_number} required>
          <input
            id="whatsapp_number"
            value={values.whatsapp_number}
            onChange={(e) => update("whatsapp_number", e.target.value)}
            className="field"
            inputMode="tel"
          />
        </Field>
      ) : null}
      <Field id="email" label="Email (optional)" error={errors.email}>
        <input
          id="email"
          type="email"
          value={values.email}
          onChange={(e) => update("email", e.target.value)}
          className="field"
          autoComplete="email"
        />
      </Field>
      <Field id="course_id" label="Selected course" error={errors.course_id} required>
        <select
          id="course_id"
          value={values.course_id}
          onChange={(e) => update("course_id", e.target.value)}
          className="field"
        >
          <option value="">Select a course</option>
          {courses.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>
      </Field>
      {selected && price ? (
        <div className="rounded-2xl border border-stroke bg-bg px-4 py-3 text-sm text-muted">
          <p>
            {selected.title}
            {selected.semester ? ` · ${selected.semester}` : ""}
          </p>
          <p className="text-text-primary">
            {formatTaka(price.current)}
            {price.hasDiscount && price.original ? (
              <span className="ml-2 line-through text-muted">{formatTaka(price.original)}</span>
            ) : null}
            <SampleHint>Sample price</SampleHint>
          </p>
        </div>
      ) : null}
      <div className="hidden" aria-hidden>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(e) => update("website", e.target.value)}
        />
      </div>
      {generalError ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
          {generalError}
        </div>
      ) : null}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "প্রসেসিং হচ্ছে…" : "সাবমিট করুন ও হোয়াটসঅ্যাপে যান"}
      </Button>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  required,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm text-text-primary">
        {label}
        {required ? <span className="text-muted"> *</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-xs text-[#c9d7e6]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function InquiryModal({
  open,
  course,
  onClose,
}: {
  open: boolean;
  course?: Course | null;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    // Auto-focus first input
    const timer = setTimeout(() => {
      const firstInput = dialogRef.current?.querySelector<HTMLInputElement>("input:not([type=hidden]), select");
      firstInput?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/75 backdrop-blur-sm p-4 md:items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="inquiry-title"
        className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-3xl border border-stroke bg-surface p-6 shadow-2xl transition-all"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">ভর্তি সংক্রান্ত তথ্য</p>
            <h2 id="inquiry-title" className="mt-1 text-2xl text-text-primary">
              আপনার তথ্য প্রদান করুন
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-stroke bg-bg text-muted transition hover:border-[#89AACC] hover:text-text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <InquiryForm course={course} onClose={onClose} />
      </div>
    </div>
  );
}
