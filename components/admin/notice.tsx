import { PrototypeMark } from "@/components/ui/prototype-mark";

export function AdminNotice() {
  return (
    <div className="mb-6 rounded-2xl border border-stroke bg-surface px-4 py-3">
      <PrototypeMark />
      <p className="mt-1 text-sm text-muted">
        Admin screens are an interface prototype. Login, edits, and status changes are local only
        and are not authenticated, authorized, or persisted. Real security lands in Phase 2.
      </p>
    </div>
  );
}
