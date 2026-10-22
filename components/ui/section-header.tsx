"use client";

import { cn } from "@/lib/cn";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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
      className={cn("mb-12 md:mb-16", className)}
      initial={reduced ? false : { opacity: 0, y: 30 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-[#1f1f1f]" />
            <span className="text-xs text-[#878787] uppercase tracking-[0.3em] font-medium">
              {eyebrow}
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl text-[#f5f5f5] tracking-tight leading-none">
            {heading}
          </h2>
          {description ? (
            <p className="text-sm md:text-base text-[#878787] max-w-lg mt-3 font-light">
              {description}
            </p>
          ) : null}
        </div>
        {cta ? (
          <div className="hidden md:inline-flex shrink-0">
            <Link
              href={cta.href}
              className="group relative rounded-full text-xs font-medium px-5 py-2.5 transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <span className="absolute inset-0 rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center gap-2 rounded-full border border-[#1f1f1f] bg-[#141414] text-[#f5f5f5] group-hover:border-transparent px-5 py-2.5 -mx-5 -my-2.5 transition-all">
                <span>{cta.label}</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}

export function Em({ children }: { children: ReactNode }) {
  return <span className="font-display italic text-[#f5f5f5]">{children}</span>;
}
