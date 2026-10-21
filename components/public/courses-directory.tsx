"use client";

import { CourseCard } from "@/components/public/course-card";
import { InquiryModal } from "@/components/public/inquiry-form";
import { EmptyState } from "@/components/ui/empty-state";
import { Em } from "@/components/ui/section-header";
import { categoryLabel, getPublicCourses } from "@/lib/data";
import type { CourseCategory } from "@/lib/types";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

const categories: Array<{ value: "all" | CourseCategory; label: string }> = [
  { value: "all", label: "All" },
  { value: "semester", label: categoryLabel("semester") },
  { value: "duet_admission", label: categoryLabel("duet_admission") },
  { value: "job_prep", label: categoryLabel("job_prep") },
];

export function CoursesDirectory() {
  const searchParams = useSearchParams();
  const initial = (searchParams.get("category") as CourseCategory | null) ?? "all";
  const [category, setCategory] = useState<"all" | CourseCategory>(
    categories.some((item) => item.value === initial) ? initial : "all",
  );
  const [semester, setSemester] = useState<"all" | string>("all");
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const courses = useMemo(
    () => getPublicCourses({ category, semester }),
    [category, semester],
  );

  const semesters = useMemo(() => {
    const values = new Set(
      getPublicCourses({ category }).map((course) => course.semester).filter(Boolean),
    );
    return Array.from(values) as string[];
  }, [category]);

  return (
    <>
      <p className="text-xs uppercase tracking-[0.3em] text-muted">Course directory</p>
      <h1 className="mt-4 max-w-3xl text-4xl text-text-primary md:text-6xl">
        Find the course for your <Em>next step.</Em>
      </h1>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/" className="text-sm text-muted hover:text-text-primary">
          Home
        </Link>
        <button
          type="button"
          onClick={() => setInquiryOpen(true)}
          className="rounded-full bg-text-primary px-5 py-2 text-sm text-bg"
        >
          Start an inquiry
        </button>
      </div>
      <div className="mt-10 flex flex-wrap gap-2">
        {categories.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => {
              setCategory(item.value);
              setSemester("all");
            }}
            className={`rounded-full px-4 py-2 text-sm ${
              category === item.value
                ? "bg-stroke/50 text-text-primary"
                : "text-muted hover:text-text-primary"
            }`}
          >
            {item.label}
          </button>
        ))}
        {semesters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setSemester(item === semester ? "all" : item)}
            className={`rounded-full px-4 py-2 text-sm ${
              semester === item
                ? "bg-stroke/50 text-text-primary"
                : "text-muted hover:text-text-primary"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      {courses.length === 0 ? (
        <div className="mt-12">
          <EmptyState
            title="No courses match these filters"
            description="Try another category or semester. This catalogue is sample preview data."
          />
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} variant="directory" />
          ))}
        </div>
      )}
      <InquiryModal open={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </>
  );
}
