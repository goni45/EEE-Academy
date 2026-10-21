"use client";

import { SampleHint } from "@/components/ui/prototype-mark";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/cn";
import { categoryLabel } from "@/lib/data";
import { formatTaka, getDisplayPrice } from "@/lib/pricing";
import type { Course } from "@/lib/types";
import Link from "next/link";

const spans = ["md:col-span-7", "md:col-span-5", "md:col-span-5", "md:col-span-7"];

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

  return (
    <Link
      href={`/courses/${course.slug}`}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-stroke bg-surface",
        variant === "bento" ? spans[index % spans.length] : "col-span-1",
      )}
    >
      <div className={cn("relative overflow-hidden", variant === "bento" ? "aspect-[16/10]" : "aspect-[16/9]")}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#24344a,transparent_50%),linear-gradient(180deg,#111,#0a0a0a)] transition-transform duration-700 group-hover:scale-105" />
        <div className="halftone absolute inset-0 opacity-40" />
        <div className="absolute inset-0 bg-black/0 backdrop-blur-0 transition group-hover:bg-black/40 group-hover:backdrop-blur-[2px]" />
        <div className="absolute inset-0 flex items-end p-5 opacity-0 transition group-hover:opacity-100">
          <span className="rounded-full bg-black/50 px-4 py-2 text-sm text-text-primary backdrop-blur-md">
            View Course — <em className="font-display italic">{course.title}</em> ↗
          </span>
        </div>
      </div>
      <div className="space-y-3 p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge label={categoryLabel(course.category)} tone="neutral" />
          {course.semester ? <StatusBadge label={course.semester} /> : null}
          <StatusBadge
            label={course.admission_open ? "Admission open" : "Admission closed"}
            tone={course.admission_open ? "open" : "closed"}
          />
        </div>
        <h3 className="text-xl text-text-primary md:text-2xl">{course.title}</h3>
        <p className="line-clamp-2 text-sm text-muted">{course.description}</p>
        <p className="text-sm text-text-primary">
          <span className="tabular-nums">{formatTaka(price.current)}</span>
          {price.hasDiscount && price.original ? (
            <span className="ml-2 text-muted line-through tabular-nums">
              {formatTaka(price.original)}
            </span>
          ) : null}
          <SampleHint>Sample price</SampleHint>
        </p>
      </div>
    </Link>
  );
}
