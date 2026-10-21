import { StatusBadge } from "@/components/ui/status-badge";
import { getLeads, getOverviewCounts } from "@/lib/data";

export default function AdminOverviewPage() {
  const counts = getOverviewCounts();
  const recent = getLeads().slice(0, 5);

  const metrics = [
    { label: "Pending leads", value: counts.pendingLeads },
    { label: "Contacted leads", value: counts.contactedLeads },
    { label: "Payments submitted", value: counts.submittedPayments },
    { label: "Payments verified", value: counts.verifiedPayments },
    { label: "Active enrollments", value: counts.activeEnrollments },
  ];

  return (
    <div>
      <h1 className="text-3xl text-text-primary">Overview</h1>
      <p className="mt-2 text-sm text-muted">Counts are derived from sample lead records.</p>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => (
          <article key={metric.label} className="rounded-3xl border border-stroke bg-surface p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">{metric.label}</p>
            <p className="mt-3 font-display italic text-4xl tabular-nums">{metric.value}</p>
          </article>
        ))}
      </div>
      <h2 className="mt-10 text-xl text-text-primary">Recent activity</h2>
      <ul className="mt-4 divide-y divide-stroke rounded-3xl border border-stroke">
        {recent.map((lead) => (
          <li key={lead.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
            <span>{lead.student_name}</span>
            <span className="text-muted">{lead.course_title_snapshot}</span>
            <StatusBadge label={lead.lead_status} />
          </li>
        ))}
      </ul>
    </div>
  );
}
