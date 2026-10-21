import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "gradient";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-text-primary text-bg hover:bg-bg hover:text-text-primary accent-gradient-border",
  secondary:
    "bg-bg text-text-primary border-2 border-stroke hover:border-transparent accent-gradient-border",
  ghost: "bg-transparent text-muted hover:text-text-primary hover:bg-stroke/50",
  gradient:
    "bg-surface text-text-primary accent-gradient-border hover:scale-[1.03]",
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-full text-sm px-7 py-3.5 font-medium transition-transform duration-200 hover:scale-[1.03] disabled:opacity-50 disabled:pointer-events-none disabled:hover:scale-100 cursor-pointer",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
