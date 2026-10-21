"use client";

import { Footer } from "@/components/public/footer";
import { InquiryModal } from "@/components/public/inquiry-form";
import { Navbar } from "@/components/public/navbar";
import { SampleHint } from "@/components/ui/prototype-mark";
import { Em } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { categoryLabel, getPublicCourseBySlug, getPublishedTeachers } from "@/lib/data";
import { formatTaka, getDisplayPrice } from "@/lib/pricing";
import Link from "next/link";
import { use, useState } from "react";

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const course = getPublicCourseBySlug(slug);
  const [open, setOpen] = useState(false);
  const teachers = getPublishedTeachers();

  if (!course) {
    return (
      <>
        <Navbar />
        <main id="main" className="flex min-h-dvh items-center justify-center px-6 pt-28">
          <div className="text-center">
            <h1 className="text-3xl text-text-primary">Course not found</h1>
            <p className="mt-3 text-sm text-muted">This slug is not in the sample catalogue.</p>
            <Link href="/courses" className="mt-6 inline-block text-sm text-text-primary">
              Back to courses
            </Link>
          </div>
        </main>
      </>
    );
  }

  const price = getDisplayPrice(course);

  return (
    <>
      <Navbar />
      <main id="main" className="bg-bg pt-28 pb-20">
        <div className="mx-auto max-w-[900px] px-6 md:px-10">
          <Link href="/courses" className="text-sm text-muted hover:text-text-primary">
            ← Courses
          </Link>
          <div className="mt-6 flex flex-wrap gap-2">
            <StatusBadge label={categoryLabel(course.category)} />
            {course.semester ? <StatusBadge label={course.semester} /> : null}
            <StatusBadge
              label={course.admission_open ? "Admission open" : "Admission closed"}
              tone={course.admission_open ? "open" : "closed"}
            />
          </div>
          <h1 className="mt-6 text-4xl text-text-primary md:text-6xl">{course.title}</h1>
          <p className="mt-4 max-w-2xl text-muted">{course.description}</p>
          <p className="mt-6 text-2xl text-text-primary">
            {formatTaka(price.current)}
            {price.hasDiscount && price.original ? (
              <span className="ml-3 text-lg text-muted line-through">{formatTaka(price.original)}</span>
            ) : null}
            <SampleHint>Sample price</SampleHint>
          </p>
          <dl className="mt-8 grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            <div>
              <dt className="text-muted">Duration</dt>
              <dd className="text-text-primary">{course.duration}</dd>
            </div>
            <div>
              <dt className="text-muted">Delivery</dt>
              <dd className="text-text-primary">{course.delivery_format}</dd>
            </div>
            <div>
              <dt className="text-muted">Department</dt>
              <dd className="text-text-primary">{course.department}</dd>
            </div>
          </dl>
          {course.features.length > 0 ? (
            <section className="mt-12">
              <h2 className="text-2xl text-text-primary">
                What you <Em>get.</Em>
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                {course.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </section>
          ) : null}
          {course.syllabus.length > 0 ? (
            <section className="mt-12">
              <h2 className="text-2xl text-text-primary">Syllabus</h2>
              <ol className="mt-4 space-y-2 text-sm text-muted">
                {course.syllabus.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </section>
          ) : null}
          {teachers.length > 0 ? (
            <section className="mt-12">
              <h2 className="text-2xl text-text-primary">Mentors</h2>
              <p className="mt-2 text-sm text-muted">
                Published sample mentors associated with the academy catalogue.
              </p>
            </section>
          ) : null}
          <div className="mt-12">
            {course.admission_open ? (
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="rounded-full bg-text-primary px-7 py-3.5 text-sm text-bg"
              >
                Start inquiry
              </button>
            ) : (
              <p className="text-sm text-muted">Admission is closed. This course cannot accept new inquiries.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <InquiryModal open={open} course={course} onClose={() => setOpen(false)} />
    </>
  );
}
