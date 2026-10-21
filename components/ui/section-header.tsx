"use client";

import { cn } from "@/lib/cn";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow: string;
  heading: ReactNode;
  description?: string;
  cta?: { href: string; label: string };
  className?: string;
}

export function SectionHeader({
  eyebrow,
  heading,
  description,
  cta,
  className,
}: SectionHeaderProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={cn("mb-10 md:mb-14", className)}
      initial={reduced ? false : { opacity: 0, y: 30 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted">
            <span className="hidden h-px w-10 bg-stroke sm:block" />
            {eyebrow}
          </p>
          <h2 className="max-w-3xl text-3xl leading-tight text-text-primary md:text-5xl">
            {heading}
          </h2>
          {description ? (
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted md:text-base">
              {description}
            </p>
          ) : null}
        </div>
        {cta ? (
          <Link
            href={cta.href}
            className="hidden shrink-0 rounded-full bg-surface px-5 py-2.5 text-sm text-text-primary accent-gradient-border md:inline-flex"
          >
            {cta.label}
          </Link>
        ) : null}
      </div>
    </motion.div>
  );
}

export function Em({ children }: { children: ReactNode }) {
  return <em className="font-display not-italic italic">{children}</em>;
}
