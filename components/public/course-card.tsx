"use client";

import { SampleHint } from "@/components/ui/prototype-mark";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/cn";
import { categoryLabel } from "@/lib/data";
import { formatTaka, getDisplayPrice } from "@/lib/pricing";
import type { Course } from "@/lib/types";
import Link from "next/link";

const spans = ["md:col-span-7", "md:col-span-5", "md:col-span-5", "md:col-span-7"];

const courseImages = [
  "/images/work_automotive_motion_1792603991229.jpg",
  "/images/work_urban_architecture_1792603991572.jpg",
  "/images/work_human_perspective_1792603992650.jpg",
  "/images/work_brand_identity_1792603992871.jpg",
];

export function CourseCard({
  course,
  index = 0,
  variant = "bento",
}: {
  course: Course;
  index?: number;
  variant?: "bento" | "directory";
}) {
  const price = getDisplayPrice(course);
  const imageSrc = courseImages[index % courseImages.length];

  return (
    <Link
      href={`/courses/${course.slug}`}
      className={cn(
        "relative bg-[#141414] border border-[#1f1f1f] rounded-3xl overflow-hidden group cursor-pointer transition-colors hover:border-[#878787]/40 flex flex-col justify-end p-6 sm:p-8",
        variant === "bento"
          ? `${spans[index % spans.length]} min-h-[340px] md:min-h-[420px]`
          : "col-span-1 min-h-[320px] md:min-h-[380px]",
      )}
    >
      {/* Background Image with object-cover group-hover:scale-105 */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={imageSrc}
          alt={course.title}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Subtle vignette scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/15" />
      </div>

      {/* Halftone Overlay: radial-gradient at 4x4px, opacity-20 mix-blend-multiply */}
      <div className="absolute inset-0 halftone-overlay opacity-20 mix-blend-multiply pointer-events-none" />

      {/* Hover backdrop blur overlay: bg-bg/70 opacity-0->1 + backdrop-blur-lg */}
      <div className="absolute inset-0 bg-[#0a0a0a]/70 opacity-0 group-hover:opacity-100 backdrop-blur-lg transition-all duration-300 pointer-events-none" />

      {/* Permanent Card Meta (visible normally, slightly muted on hover) */}
      <div className="relative z-10 transition-opacity duration-300 group-hover:opacity-20 flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <StatusBadge label={categoryLabel(course.category)} tone="neutral" />
          {course.semester ? <StatusBadge label={course.semester} /> : null}
          <StatusBadge
            label={course.admission_open ? "Admission open" : "Admission closed"}
            tone={course.admission_open ? "open" : "closed"}
          />
        </div>

        <h3 className="text-2xl sm:text-3xl font-display italic text-[#f5f5f5] leading-tight">
          {course.title}
        </h3>

        <p className="line-clamp-2 text-xs sm:text-sm text-[#878787] font-light max-w-md">
          {course.description}
        </p>

        <div className="flex items-center gap-2 pt-2 text-sm text-[#f5f5f5] font-mono">
          <span className="tabular-nums text-base font-semibold">{formatTaka(price.current)}</span>
          {price.hasDiscount && price.original ? (
            <span className="text-muted line-through tabular-nums text-xs">
              {formatTaka(price.original)}
            </span>
          ) : null}
          <SampleHint>Sample price</SampleHint>
        </div>
      </div>

      {/* Hover label: pill with animated gradient border, white bg, "View Course — *Title* ↗" */}
      <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
        <div className="relative p-[1.5px] rounded-full accent-gradient-border shadow-2xl transform scale-95 group-hover:scale-100 transition-transform duration-300">
          <div className="bg-white text-black px-6 py-2.5 rounded-full flex items-center gap-2 text-xs font-semibold tracking-wide shadow-md">
            <span>View Course —</span>
            <span className="font-display italic text-sm">{course.title} ↗</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
