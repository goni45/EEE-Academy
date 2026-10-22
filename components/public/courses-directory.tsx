"use client";

import { CourseCard } from "@/components/public/course-card";
import { InquiryModal } from "@/components/public/inquiry-form";
import { EmptyState } from "@/components/ui/empty-state";
import { Em } from "@/components/ui/section-header";
import { categoryLabel, getPublicCourses } from "@/lib/data";
import type { CourseCategory } from "@/lib/types";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

const categories: Array<{ value: "all" | CourseCategory; label: string }> = [
  { value: "all", label: "All Courses" },
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
    <div className="py-8 md:py-12">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#878787] hover:text-[#f5f5f5] transition-colors font-mono uppercase tracking-wider"
        >
          <ArrowLeft size={14} />
          <span>Home</span>
        </Link>
        <span className="w-1 h-1 rounded-full bg-[#1f1f1f]" />
        <span className="text-xs text-[#878787] uppercase tracking-[0.3em] font-medium">
          Catalogue
        </span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl text-[#f5f5f5] tracking-tight leading-none">
            <span>Find the course for your </span>
            <Em>next step.</Em>
          </h1>
          <p className="text-sm md:text-base text-[#878787] max-w-xl mt-4 font-light leading-relaxed">
            আপনার প্রয়োজনীয় সেমিস্টার কোর্স, ডুয়েট ভর্তি প্রস্তুতি কিংবা টেকনিক্যাল জব প্রিপারেশনের জন্য উপযুক্ত কোর্স বেছে নিন।
          </p>
        </div>

        {/* Start Inquiry Button */}
        <button
          type="button"
          onClick={() => setInquiryOpen(true)}
          className="group relative rounded-full text-xs sm:text-sm font-medium px-6 py-3 transition-all duration-300 hover:scale-105 cursor-pointer inline-flex items-center gap-2 shrink-0 self-start md:self-auto"
        >
          <span className="absolute inset-0 rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative z-10 flex items-center gap-2 rounded-full bg-[#f5f5f5] text-[#0a0a0a] group-hover:bg-[#0a0a0a] group-hover:text-[#f5f5f5] px-6 py-3 -mx-6 -my-3 transition-colors duration-300">
            <Sparkles size={14} />
            <span>ভর্তি ইনকোয়ারি শুরু করুন</span>
          </span>
        </button>
      </div>

      {/* Category and Semester Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-[#141414]/60 border border-[#1f1f1f] backdrop-blur-md mb-10">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => {
                setCategory(item.value);
                setSemester("all");
              }}
              className={`rounded-full px-4 py-2 text-xs sm:text-sm transition-all cursor-pointer ${
                category === item.value
                  ? "bg-[#f5f5f5] text-[#0a0a0a] font-medium shadow-md"
                  : "text-[#878787] hover:text-[#f5f5f5] hover:bg-[#1f1f1f]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {semesters.length > 0 ? (
          <>
            <div className="w-full sm:w-px h-px sm:h-6 bg-[#1f1f1f] my-1 sm:my-0 sm:mx-2" />
            <div className="flex flex-wrap gap-1.5">
              {semesters.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setSemester(item === semester ? "all" : item)}
                  className={`rounded-full px-3.5 py-1.5 text-xs transition-all cursor-pointer ${
                    semester === item
                      ? "bg-[#4E85BF] text-white font-medium shadow-sm"
                      : "text-[#878787] hover:text-[#f5f5f5] hover:bg-[#1f1f1f]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </>
        ) : null}
      </div>

      {/* Course Cards Grid */}
      {courses.length === 0 ? (
        <div className="my-12">
          <EmptyState
            title="No courses match these filters"
            description="Try another category or semester. This catalogue is sample preview data."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {courses.map((course, index) => (
            <CourseCard key={course.id} course={course} index={index} variant="directory" />
          ))}
        </div>
      )}

      {/* Inquiry Modal */}
      <InquiryModal open={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </div>
  );
}
