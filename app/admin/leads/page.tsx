"use client";

import { StatusBadge } from "@/components/ui/status-badge";
import { getLeads } from "@/lib/data";
import type { CourseLead, EnrollmentStatus, GroupAccessStatus, LeadStatus, PaymentStatus } from "@/lib/types";
import { useMemo, useState } from "react";

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
  const [dialog, setDialog] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return rows.filter((lead) =>
      [lead.student_name, lead.polytechnic, lead.course_title_snapshot, lead.polytechnic_roll]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [rows, query]);

  function patch(id: string, update: Partial<CourseLead>) {
    setRows((current) => current.map((lead) => (lead.id === id ? { ...lead, ...update } : lead)));
  }

  return (
    <div>
      <h1 className="text-3xl text-text-primary">Leads</h1>
      <p className="mt-2 text-sm text-muted">
        Status edits stay in this browser session only. They are not saved to a server.
      </p>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search sample leads"
        className="mt-6 w-full max-w-md rounded-full border border-stroke bg-surface px-4 py-3 text-sm"
      />
      {filtered.length === 0 ? (
        <p className="mt-8 text-sm text-muted">No sample leads match this filter.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-3xl border border-stroke">
          <table className="min-w-[1100px] w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.12em] text-muted">
              <tr>
                {[
                  "Submitted",
                  "Student",
                  "Institute",
                  "Course",
                  "Phone",
                  "Lead",
                  "Payment",
                  "Enrollment",
                  "Group",
                  "Actions",
                ].map((heading) => (
                  <th key={heading} className="px-3 py-3 font-medium">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead.id} className="border-t border-stroke align-top">
                  <td className="px-3 py-3 text-muted">
                    {new Date(lead.created_at).toLocaleString()}
                  </td>
                  <td className="px-3 py-3">
                    {lead.student_name}
                    {lead.is_likely_duplicate ? (
                      <StatusBadge label="Possible duplicate" />
                    ) : null}
                  </td>
                  <td className="px-3 py-3 text-muted">
                    {lead.polytechnic}
                    <br />
                    {lead.polytechnic_roll}
                  </td>
                  <td className="px-3 py-3">{lead.course_title_snapshot}</td>
                  <td className="px-3 py-3 text-muted">{lead.phone}</td>
                  <td className="px-3 py-3">
                    <select
                      value={lead.lead_status}
                      onChange={(e) => patch(lead.id, { lead_status: e.target.value as LeadStatus })}
                      className="rounded-full border border-stroke bg-bg px-2 py-1"
                    >
                      {leadStatuses.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-3">
                    <select
                      value={lead.payment_status}
                      onChange={(e) =>
                        patch(lead.id, { payment_status: e.target.value as PaymentStatus })
                      }
                      className="rounded-full border border-stroke bg-bg px-2 py-1"
                    >
                      {paymentStatuses.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-3">
                    <select
                      value={lead.enrollment_status}
                      onChange={(e) =>
                        patch(lead.id, { enrollment_status: e.target.value as EnrollmentStatus })
                      }
                      className="rounded-full border border-stroke bg-bg px-2 py-1"
                    >
                      {enrollmentStatuses.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-3">
                    <select
                      value={lead.group_access_status}
                      onChange={(e) =>
                        patch(lead.id, { group_access_status: e.target.value as GroupAccessStatus })
                      }
                      className="rounded-full border border-stroke bg-bg px-2 py-1"
                    >
                      {groupStatuses.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-3">
                    <button
                      type="button"
                      className="text-muted"
                      onClick={() => setDialog(lead.id)}
                    >
                      Call / WhatsApp
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {dialog ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div role="dialog" className="max-w-md rounded-3xl border border-stroke bg-surface p-6">
            <p className="text-text-primary">Sample contact</p>
            <p className="mt-2 text-sm text-muted">
              Real call/WhatsApp will be enabled when production data is connected. Fake numbers are
              not used as tel or WhatsApp links.
            </p>
            <button
              type="button"
              className="mt-4 text-sm text-text-primary"
              onClick={() => setDialog(null)}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
