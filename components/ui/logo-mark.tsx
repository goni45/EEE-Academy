import { cn } from "@/lib/cn";
import Link from "next/link";

export function LogoMark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "group relative w-9 h-9 rounded-full p-[1.5px] transition-transform duration-300 hover:scale-110 flex items-center justify-center shrink-0",
        className,
      )}
      aria-label="EEE Academy home"
    >
      <div className="absolute inset-0 rounded-full accent-gradient transition-all duration-500 group-hover:rotate-180" />
      <div className="relative w-full h-full rounded-full bg-[#0a0a0a] flex items-center justify-center text-[#f5f5f5] font-display italic text-[12px] tracking-wider leading-none select-none">
        EEE
      </div>
    </Link>
  );
}
