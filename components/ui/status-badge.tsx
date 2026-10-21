import { cn } from "@/lib/cn";

export function StatusBadge({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: "neutral" | "open" | "closed" | "pending" | "success" | "danger";
}) {
  const tones = {
    neutral: "border-stroke text-muted",
    open: "border-[#4E85BF]/40 text-[#89AACC]",
    closed: "border-stroke text-muted",
    pending: "border-white/20 text-text-primary",
    success: "border-[#4E85BF]/40 text-[#89AACC]",
    danger: "border-white/20 text-muted",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-[0.14em]",
        tones[tone],
      )}
    >
      {label}
    </span>
  );
}
