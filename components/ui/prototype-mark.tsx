import { isPrototypeMode } from "@/lib/prototype";

export function PrototypeMark({ compact = false }: { compact?: boolean }) {
  if (!isPrototypeMode()) return null;

  return (
    <p
      className={
        compact
          ? "text-[10px] uppercase tracking-[0.18em] text-muted"
          : "text-xs text-muted"
      }
    >
      Preview · sample data
    </p>
  );
}

export function SampleHint({ children }: { children?: string }) {
  if (!isPrototypeMode()) return null;
  return (
    <span className="ml-1 text-[10px] uppercase tracking-[0.16em] text-muted">
      {children ?? "Sample"}
    </span>
  );
}
