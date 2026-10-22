import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "gradient";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

export function Button({
  className,
  variant = "primary",
  type = "button",
  children,
  ...props
}: ButtonProps) {
  if (variant === "primary") {
    return (
      <button
        type={type}
        className={cn(
          "group relative inline-flex items-center justify-center rounded-full text-sm font-medium px-7 py-3.5 transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden disabled:opacity-50 disabled:pointer-events-none disabled:hover:scale-100",
          className,
        )}
        {...props}
      >
        <span className="absolute inset-0 rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="relative z-10 block rounded-full bg-[#f5f5f5] text-[#0a0a0a] group-hover:bg-[#0a0a0a] group-hover:text-[#f5f5f5] px-7 py-3.5 -mx-7 -my-3.5 transition-colors duration-300">
          {children}
        </span>
      </button>
    );
  }

  if (variant === "secondary") {
    return (
      <button
        type={type}
        className={cn(
          "group relative inline-flex items-center justify-center rounded-full text-sm font-medium px-7 py-3.5 transition-all duration-300 hover:scale-105 cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:hover:scale-100",
          className,
        )}
        {...props}
      >
        <span className="absolute inset-0 rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="relative z-10 block rounded-full border-2 border-[#1f1f1f] bg-[#0a0a0a] text-[#f5f5f5] group-hover:border-transparent px-7 py-3.5 -mx-7 -my-3.5 transition-all duration-300">
          {children}
        </span>
      </button>
    );
  }

  if (variant === "gradient") {
    return (
      <button
        type={type}
        className={cn(
          "group relative inline-flex items-center justify-center rounded-full text-xs sm:text-sm font-medium px-5 py-2.5 transition-all duration-300 hover:scale-105 cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:hover:scale-100",
          className,
        )}
        {...props}
      >
        <span className="absolute inset-0 rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="relative z-10 flex items-center gap-2 rounded-full border border-[#1f1f1f] bg-[#141414] text-[#f5f5f5] group-hover:border-transparent px-5 py-2.5 -mx-5 -my-2.5 transition-all">
          {children}
        </span>
      </button>
    );
  }

  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-full text-sm px-5 py-2 text-muted hover:text-text-primary hover:bg-[#1f1f1f]/50 transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
