"use client";

import { StatusBadge } from "@/components/ui/status-badge";
import { getLeads, getPaymentsForLead } from "@/lib/data";
import { formatTaka } from "@/lib/pricing";
import { createClient } from "@/lib/supabase/client";
import { updateLeadStatusAction } from "@/lib/actions/admin";
import type {
  CourseLead,
  EnrollmentStatus,
  GroupAccessStatus,
  LeadStatus,
  Payment,
  PaymentStatus,
} from "@/lib/types";
import { useEffect, useMemo, useState } from "react";

const leadStatuses: LeadStatus[] = ["pending", "contacted", "closed", "cancelled"];
const paymentStatuses: PaymentStatus[] = ["not_submitted", "submitted", "verified", "rejected"];
const enrollmentStatuses: EnrollmentStatus[] = [
  "not_enrolled",
  "pending",
  "active",
  "completed",
  "cancelled",
];
const groupStatuses: GroupAccessStatus[] = ["not_added", "added", "removed"];

export default function AdminLeadsPage() {
  const [rows, setRows] = useState<CourseLead[]>(() => getLeads());
  const [query, setQuery] = useState("");
  const [contactDialogLead, setContactDialogLead] = useState<CourseLead | null>(null);
  const [notesDialogLead, setNotesDialogLead] = useState<CourseLead | null>(null);
  const [paymentsDialogLead, setPaymentsDialogLead] = useState<CourseLead | null>(null);
  const [notesDraft, setNotesDraft] = useState("");

  useEffect(() => {
    async function loadLiveLeads() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("course_leads")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          setRows(data as CourseLead[]);
        }
      } catch (err) {
        console.warn("Using local leads fallback:", err);
      }
    }
    loadLiveLeads();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return rows.filter((lead) =>
      [lead.student_name, lead.polytechnic, lead.course_title_snapshot, lead.polytechnic_roll, lead.phone]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [rows, query]);

  function patch(id: string, update: Partial<CourseLead>) {
    setRows((current) => current.map((lead) => (lead.id === id ? { ...lead, ...update } : lead)));
    updateLeadStatusAction(id, update).catch((err) => {
      console.warn("Could not persist update to Supabase:", err);
    });
  }

  function openNotes(lead: CourseLead) {
    setNotesDialogLead(lead);
    setNotesDraft(lead.admin_notes ?? "");
  }

  function saveNotes() {
    if (notesDialogLead) {
      patch(notesDialogLead.id, { admin_notes: notesDraft });
      setNotesDialogLead(null);
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl text-text-primary">Course Inquiries & Leads</h1>
          <p className="mt-1 text-sm text-muted">
            Manage inquiries, student verification, manual bKash/Nagad payments, and group access.
          </p>
        </div>
        <div className="text-xs text-muted bg-surface/50 border border-stroke px-3 py-1.5 rounded-full self-start">
          Total: {rows.length} inquiries
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, institute, roll, or phone..."
          className="w-full max-w-md rounded-full border border-stroke bg-surface px-4 py-2.5 text-sm placeholder:text-muted/60 focus:border-[#89AACC] focus:outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 text-sm text-muted">No leads match this search filter.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-3xl border border-stroke bg-surface/30">
          <table className="min-w-[1180px] w-full text-left text-sm">
            <thead className="border-b border-stroke bg-surface/60 text-xs uppercase tracking-[0.12em] text-muted">
              <tr>
                {[
                  "Submitted",
                  "Student",
                  "Institute / Roll",
                  "Course",
                  "Phone / WhatsApp",
                  "Lead Status",
                  "Payment",
                  "Enrollment",
                  "FB Group",
                  "Actions",
                ].map((heading) => (
                  <th key={heading} className="px-3 py-3.5 font-medium">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stroke/60">
              {filtered.map((lead) => {
                const payments = getPaymentsForLead(lead.id);
                return (
                  <tr key={lead.id} className="transition hover:bg-surface/50 align-top">
                    <td className="px-3 py-3.5 text-xs text-muted whitespace-nowrap">
                      {new Date(lead.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-3 py-3.5 font-medium text-text-primary">
                      {lead.student_name}
                      {lead.is_likely_duplicate ? (
                        <div className="mt-1">
                          <StatusBadge label="Duplicate roll/phone" tone="closed" />
                        </div>
                      ) : null}
                      {lead.admin_notes ? (
                        <p className="mt-1 line-clamp-1 text-xs text-[#89AACC]">
                          Note: {lead.admin_notes}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-3 py-3.5 text-xs text-muted">
                      <span className="font-medium text-text-primary/90">{lead.polytechnic}</span>
                      <br />
                      Roll: <span className="tabular-nums">{lead.polytechnic_roll}</span>
                      {lead.department ? ` (${lead.department})` : ""}
                    </td>
                    <td className="px-3 py-3.5 text-xs">
                      <p className="font-medium text-text-primary">{lead.course_title_snapshot}</p>
                      <p className="text-muted tabular-nums">৳{lead.course_price_snapshot.toLocaleString()}</p>
                    </td>
                    <td className="px-3 py-3.5 text-xs text-muted">
                      <p className="font-mono text-text-primary">{lead.phone}</p>
                      {lead.whatsapp_number && lead.whatsapp_number !== lead.phone ? (
                        <p className="font-mono text-muted">WA: {lead.whatsapp_number}</p>
                      ) : null}
                    </td>
                    <td className="px-3 py-3.5">
                      <select
                        value={lead.lead_status}
                        onChange={(e) => patch(lead.id, { lead_status: e.target.value as LeadStatus })}
                        className="rounded-full border border-stroke bg-bg px-2.5 py-1 text-xs font-medium focus:border-[#89AACC] focus:outline-none"
                      >
                        {leadStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex flex-col gap-1.5 items-start">
                        <select
                          value={lead.payment_status}
                          onChange={(e) =>
                            patch(lead.id, { payment_status: e.target.value as PaymentStatus })
                          }
                          className="rounded-full border border-stroke bg-bg px-2.5 py-1 text-xs font-medium focus:border-[#89AACC] focus:outline-none"
                        >
                          {paymentStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => setPaymentsDialogLead(lead)}
                          className="text-[11px] text-[#89AACC] underline hover:text-[#b4d2f0]"
                        >
                          {payments.length > 0 ? `${payments.length} payment proof` : "Add/View proof"}
                        </button>
                      </div>
                    </td>
                    <td className="px-3 py-3.5">
                      <select
                        value={lead.enrollment_status}
                        onChange={(e) =>
                          patch(lead.id, { enrollment_status: e.target.value as EnrollmentStatus })
                        }
                        className="rounded-full border border-stroke bg-bg px-2.5 py-1 text-xs font-medium focus:border-[#89AACC] focus:outline-none"
                      >
                        {enrollmentStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-3.5">
                      <select
                        value={lead.group_access_status}
                        onChange={(e) =>
                          patch(lead.id, { group_access_status: e.target.value as GroupAccessStatus })
                        }
                        className="rounded-full border border-stroke bg-bg px-2.5 py-1 text-xs font-medium focus:border-[#89AACC] focus:outline-none"
                      >
                        {groupStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          className="rounded-full border border-stroke bg-bg/80 px-2.5 py-1 text-xs text-text-primary transition hover:border-[#89AACC]"
                          onClick={() => setContactDialogLead(lead)}
                        >
                          Call / WhatsApp
                        </button>
                        <button
                          type="button"
                          className="text-left text-xs text-muted hover:text-text-primary"
                          onClick={() => openNotes(lead)}
                        >
                          {lead.admin_notes ? "Edit note" : "+ Note"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Call / WhatsApp dialog */}
      {contactDialogLead ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setContactDialogLead(null)}
        >
          <div role="dialog" className="w-full max-w-md rounded-3xl border border-stroke bg-surface p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-text-primary">Contact Student</h2>
            <div className="mt-4 space-y-2.5 text-sm">
              <div>
                <span className="text-muted text-xs">Student:</span>
                <p className="font-medium text-text-primary">{contactDialogLead.student_name}</p>
              </div>
              <div>
                <span className="text-muted text-xs">Course:</span>
                <p className="text-text-primary">{contactDialogLead.course_title_snapshot}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="rounded-2xl border border-stroke bg-bg p-3">
                  <span className="text-muted text-xs block">Phone Number</span>
                  <span className="font-mono text-sm text-text-primary select-all">
                    {contactDialogLead.phone}
                  </span>
                </div>
                <div className="rounded-2xl border border-stroke bg-bg p-3">
                  <span className="text-muted text-xs block">WhatsApp</span>
                  <span className="font-mono text-sm text-text-primary select-all">
                    {contactDialogLead.whatsapp_number || contactDialogLead.phone}
                  </span>
                </div>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted/80 leading-relaxed bg-bg/50 border border-stroke/50 rounded-xl p-3">
              Prototype Note: Direct tel: and wa.me handoff is enabled when real production phone numbers are verified. Copy numbers above for manual testing.
            </p>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                className="rounded-full border border-stroke bg-bg px-4 py-2 text-sm text-text-primary hover:border-[#89AACC]"
                onClick={() => setContactDialogLead(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Notes Dialog */}
      {notesDialogLead ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setNotesDialogLead(null)}
        >
          <div role="dialog" className="w-full max-w-md rounded-3xl border border-stroke bg-surface p-6 shadow-2xl space-y-4">
            <h2 className="text-lg font-semibold text-text-primary">
              Admin Notes for {notesDialogLead.student_name}
            </h2>
            <p className="text-xs text-muted">
              Record verification notes, payment followup, or institute verification details.
            </p>
            <textarea
              rows={4}
              value={notesDraft}
              onChange={(e) => setNotesDraft(e.target.value)}
              placeholder="e.g., Contacted on WhatsApp; student sent bKash TrxID #8ABC123; waiting for bank verification."
              className="w-full rounded-2xl border border-stroke bg-bg p-3 text-sm text-text-primary focus:border-[#89AACC] focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="rounded-full border border-stroke bg-bg px-4 py-2 text-sm text-muted hover:text-text-primary"
                onClick={() => setNotesDialogLead(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-full bg-text-primary px-5 py-2 text-sm text-bg hover:bg-white"
                onClick={saveNotes}
              >
                Save note
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Payment History Dialog */}
      {paymentsDialogLead ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setPaymentsDialogLead(null)}
        >
          <div role="dialog" className="w-full max-w-lg rounded-3xl border border-stroke bg-surface p-6 shadow-2xl space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                Payment Records — {paymentsDialogLead.student_name}
              </h2>
              <p className="text-xs text-muted">
                Course: {paymentsDialogLead.course_title_snapshot} (Snapshot Fee: ৳
                {paymentsDialogLead.course_price_snapshot.toLocaleString()})
              </p>
            </div>

            {getPaymentsForLead(paymentsDialogLead.id).length === 0 ? (
              <div className="rounded-2xl border border-stroke bg-bg p-6 text-center text-sm text-muted">
                No payment submission recorded for this student yet.
              </div>
            ) : (
              <div className="space-y-3">
                {getPaymentsForLead(paymentsDialogLead.id).map((payment: Payment) => (
                  <div
                    key={payment.id}
                    className="rounded-2xl border border-stroke bg-bg p-4 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold uppercase text-text-primary text-sm">
                        {payment.method} · {formatTaka(payment.amount)}
                      </span>
                      <StatusBadge
                        label={payment.status}
                        tone={payment.status === "verified" ? "open" : payment.status === "rejected" ? "closed" : "neutral"}
                      />
                    </div>
                    {payment.transaction_id_normalized ? (
                      <p className="text-text-primary font-mono">
                        TrxID: <span className="select-all font-semibold">{payment.transaction_id_normalized}</span>
                      </p>
                    ) : null}
                    {payment.sender_phone ? (
                      <p className="text-muted font-mono">Sender phone: {payment.sender_phone}</p>
                    ) : null}
                    {payment.rejection_reason ? (
                      <p className="text-rose-400 font-medium">Rejection Reason: {payment.rejection_reason}</p>
                    ) : null}
                    <div className="text-[11px] text-muted pt-1 border-t border-stroke/60 flex justify-between">
                      <span>Submitted: {new Date(payment.created_at).toLocaleDateString()}</span>
                      {payment.reviewed_by ? <span>Reviewed by: {payment.reviewed_by}</span> : null}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                className="rounded-full border border-stroke bg-bg px-4 py-2 text-sm text-text-primary hover:border-[#89AACC]"
                onClick={() => setPaymentsDialogLead(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
