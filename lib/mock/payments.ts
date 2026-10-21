// Development-only sample data. Not verified academy information.
import type { Payment } from "@/lib/types";

export const mockPayments: Payment[] = [
  {
    id: "pay-1",
    lead_id: "lead-2",
    method: "bkash",
    amount: 8000,
    transaction_id_normalized: "SAMPLETXN001",
    sender_phone: "01YYYYYYYYY",
    status: "submitted",
    reviewed_by: null,
    reviewed_at: null,
    rejection_reason: null,
    created_at: "2026-10-17T12:00:00.000Z",
  },
  {
    id: "pay-2",
    lead_id: "lead-3",
    method: "nagad",
    amount: 5000,
    transaction_id_normalized: "SAMPLETXN002",
    sender_phone: "01ZZZZZZZZZ",
    status: "verified",
    reviewed_by: "sample-admin",
    reviewed_at: "2026-10-14T09:00:00.000Z",
    rejection_reason: null,
    created_at: "2026-10-13T18:00:00.000Z",
  },
];
