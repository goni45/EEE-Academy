import { cn } from "@/lib/cn";
import Link from "next/link";

export function LogoMark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "group relative flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-300 hover:scale-110",
        className,
      )}
      aria-label="EEE Academy home"
    >
      <span
        className="absolute inset-0 rounded-full accent-gradient transition-transform duration-500 group-hover:rotate-180"
        aria-hidden
      />
      <span className="absolute inset-[2px] rounded-full bg-surface" />
      <span className="relative font-display italic text-xs text-text-primary">Ee</span>
    </Link>
  );
}
