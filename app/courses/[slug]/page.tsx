"use client";

import { Footer } from "@/components/public/footer";
import { InquiryModal } from "@/components/public/inquiry-form";
import { Navbar } from "@/components/public/navbar";
import { SampleHint } from "@/components/ui/prototype-mark";
import { Em } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { categoryLabel, fetchPublicCourseBySlug, getPublicCourseBySlug, getPublishedTeachers } from "@/lib/data";
import { formatTaka, getDisplayPrice } from "@/lib/pricing";
import type { Course } from "@/lib/types";
import { CheckCircle2, Clock, Globe, GraduationCap, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [course, setCourse] = useState<Course | null>(() => getPublicCourseBySlug(slug));
  const [open, setOpen] = useState(false);
  const teachers = getPublishedTeachers();

  useEffect(() => {
    async function loadLiveCourse() {
      const live = await fetchPublicCourseBySlug(slug);
      if (live) setCourse(live);
    }
    loadLiveCourse();
  }, [slug]);

  if (!course) {
    return (
      <>
        <Navbar />
        <main id="main" className="flex min-h-dvh items-center justify-center px-6 pt-28">
          <div className="text-center">
            <h1 className="text-3xl text-text-primary font-serif">Course not found</h1>
            <p className="mt-3 text-sm text-muted">This slug is not in the course catalogue.</p>
            <Link
              href="/courses"
              className="mt-6 inline-block rounded-full border border-stroke bg-surface px-6 py-2.5 text-sm text-text-primary hover:border-[#89AACC]"
            >
              Back to courses
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const price = getDisplayPrice(course);

  return (
    <>
      <Navbar />
      <main id="main" className="bg-bg pt-28 pb-20">
        <div className="mx-auto max-w-[960px] px-6 md:px-10">
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-muted hover:text-text-primary transition"
          >
            ← সকল কোর্স ক্যাটালগ
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <StatusBadge label={categoryLabel(course.category)} />
            {course.semester ? <StatusBadge label={course.semester} /> : null}
            <StatusBadge
              label={course.admission_open ? "ভর্তি চলছে (Open)" : "ভর্তি বন্ধ (Closed)"}
              tone={course.admission_open ? "open" : "closed"}
            />
          </div>

          <h1 className="mt-6 text-3xl md:text-5xl lg:text-6xl text-text-primary font-normal leading-tight">
            {course.title}
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{course.description}</p>

          {/* Pricing Card */}
          <div className="mt-8 flex flex-wrap items-baseline gap-3 rounded-2xl border border-stroke bg-surface/50 p-6">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-semibold text-text-primary tabular-nums">
                {formatTaka(price.current)}
              </span>
              {price.hasDiscount && price.original ? (
                <span className="text-lg text-muted line-through tabular-nums">
                  {formatTaka(price.original)}
                </span>
              ) : null}
            </div>
            <SampleHint>Sample price</SampleHint>
            <div className="w-full sm:w-auto sm:ml-auto mt-4 sm:mt-0">
              {course.admission_open ? (
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="w-full sm:w-auto text-center rounded-full bg-text-primary px-7 py-3 text-sm font-medium text-bg transition hover:scale-[1.03] hover:bg-white accent-gradient-border cursor-pointer"
                >
                  কোর্সটিতে ভর্তি হোন ↗
                </button>
              ) : (
                <span className="inline-block w-full sm:w-auto text-center rounded-full border border-stroke bg-bg px-5 py-2 text-xs text-muted">
                  বর্তমানে এই ব্যাচে ভর্তি বন্ধ
                </span>
              )}
            </div>
          </div>

          {/* Key Meta attributes */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-2xl border border-stroke bg-surface/30 p-4">
              <Clock className="h-5 w-5 text-[#89AACC]" />
              <div>
                <span className="block text-xs uppercase tracking-wider text-muted">সময়সীমা</span>
                <span className="text-sm font-medium text-text-primary">{course.duration}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-stroke bg-surface/30 p-4">
              <Globe className="h-5 w-5 text-[#89AACC]" />
              <div>
                <span className="block text-xs uppercase tracking-wider text-muted">ক্লাস ফরম্যাট</span>
                <span className="text-sm font-medium text-text-primary">{course.delivery_format}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-stroke bg-surface/30 p-4">
              <GraduationCap className="h-5 w-5 text-[#89AACC]" />
              <div>
                <span className="block text-xs uppercase tracking-wider text-muted">বিভাগ</span>
                <span className="text-sm font-medium text-text-primary">{course.department} ডিপার্টমেন্ট</span>
              </div>
            </div>
          </div>

          {/* Features */}
          {course.features.length > 0 ? (
            <section className="mt-14">
              <h2 className="text-2xl text-text-primary">
                কোর্সে যা যা <Em>পাচ্ছেন।</Em>
              </h2>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {course.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-3 rounded-2xl border border-stroke bg-surface/20 p-4 text-sm text-text-primary/90"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#89AACC] mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {/* Syllabus */}
          {course.syllabus.length > 0 ? (
            <section className="mt-14">
              <h2 className="text-2xl text-text-primary">
                কোর্স সিলেবাস ও <Em>টপিকস।</Em>
              </h2>
              <div className="mt-5 space-y-2.5">
                {course.syllabus.map((item, idx) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 rounded-2xl border border-stroke bg-surface/20 px-5 py-3.5 text-sm text-text-primary/90"
                  >
                    <span className="font-mono text-xs text-[#89AACC]">
                      Module {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {/* Mentors */}
          {teachers.length > 0 ? (
            <section className="mt-14">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl text-text-primary">
                    কোর্স <Em>শিক্ষকমণ্ডলী।</Em>
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    একাডেমির সংশ্লিষ্ট বিষয়ভিত্তিক মেন্টরদের পরিচিতি।
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {teachers.slice(0, 2).map((teacher) => (
                  <div
                    key={teacher.id}
                    className="flex items-start gap-4 rounded-3xl border border-stroke bg-surface/40 p-5"
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-stroke bg-bg text-lg font-serif italic text-[#89AACC]">
                      {teacher.name.charAt(0)}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-medium text-text-primary">{teacher.name}</h3>
                      <p className="text-xs text-[#89AACC] flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        {teacher.institution_or_batch}
                      </p>
                      <p className="text-xs text-muted">{teacher.qualifications}</p>
                      <p className="text-xs text-muted/80 line-clamp-2 mt-1">{teacher.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {/* Bottom Admission CTA */}
          <div className="mt-16 rounded-3xl border border-stroke bg-surface/60 p-8 text-center space-y-4">
            <h2 className="text-2xl text-text-primary">ভর্তির প্রস্তুতি শুরু করুন আজই</h2>
            <p className="mx-auto max-w-md text-sm text-muted">
              ইনকোয়ারি ফর্ম পূরণ করে একাডেমির অফিসিয়াল হোয়াটসঅ্যাপে মেসেজ পাঠিয়ে পেমেন্ট ও ব্যাচ শিডিউল জেনে নিন।
            </p>
            {course.admission_open ? (
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-block rounded-full bg-text-primary px-8 py-3.5 text-sm font-medium text-bg transition hover:scale-[1.03] hover:bg-white accent-gradient-border"
              >
                আবেদন ফর্ম পূরণ করুন ↗
              </button>
            ) : (
              <p className="text-sm text-muted">বর্তমানে এই কোর্সে ভর্তি বন্ধ রয়েছে।</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <InquiryModal open={open} course={course} onClose={() => setOpen(false)} />
    </>
  );
}
