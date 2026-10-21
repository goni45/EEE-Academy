"use client";

import { StatusBadge } from "@/components/ui/status-badge";
import { mockCourses } from "@/lib/mock/courses";
import { formatTaka, getDisplayPrice } from "@/lib/pricing";
import type { Course, CourseCategory } from "@/lib/types";
import { useState } from "react";

export default function AdminCoursesPage() {
  const [rows, setRows] = useState<Course[]>(() =>
    [...mockCourses].sort((a, b) => a.order_index - b.order_index),
  );
  const [editing, setEditing] = useState<Course | null>(null);

  function save(course: Course) {
    setRows((current) => {
      const exists = current.some((item) => item.id === course.id);
      if (exists) return current.map((item) => (item.id === course.id ? course : item));
      return [...current, course];
    });
    setEditing(null);
  }

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl text-text-primary">Course Management</h1>
          <p className="mt-1 text-sm text-muted">
            Create, edit, archive courses and configure fees and syllabus for students.
          </p>
        </div>
        <button
          type="button"
          className="rounded-full bg-text-primary px-5 py-2.5 text-sm font-medium text-bg hover:bg-white self-start"
          onClick={() =>
            setEditing({
              id: `course-${Date.now()}`,
              title: "",
              slug: "",
              description: "",
              department: "EEE",
              category: "semester",
              semester: "",
              regular_price: 3000,
              discount_price: null,
              features: ["সাপ্তাহিক লাইভ ক্লাস", "সলভ ক্লাস ও রিভিশন", "লেকচার শিট PDF"],
              syllabus: ["অধ্যায় ১: বেসিক সার্কিট অ্যানালাইসিস", "অধ্যায় ২: এসি থিওরি"],
              duration: "৪ মাস",
              delivery_format: "লাইভ অনলাইন ক্লাস ও রেকর্ডেড",
              is_active: true,
              admission_open: true,
              order_index: rows.length + 1,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
          }
        >
          + Add New Course
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-3xl border border-stroke bg-surface/30">
        <table className="min-w-[950px] w-full text-left text-sm">
          <thead className="border-b border-stroke bg-surface/60 text-xs uppercase tracking-[0.12em] text-muted">
            <tr>
              {["Course Title", "Category / Semester", "Fees", "Admission", "Status", "Order", "Actions"].map(
                (heading) => (
                  <th key={heading} className="px-4 py-3.5 font-medium">
                    {heading}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-stroke/60">
            {rows.map((course) => {
              const price = getDisplayPrice(course);
              return (
                <tr key={course.id} className="transition hover:bg-surface/50">
                  <td className="px-4 py-3.5 font-medium text-text-primary">
                    <p>{course.title || "Untitled Course"}</p>
                    <p className="text-xs text-muted font-mono">/courses/{course.slug}</p>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-muted">
                    <span className="capitalize">{course.category.replace("_", " ")}</span>
                    {course.semester ? ` · ${course.semester}` : ""}
                  </td>
                  <td className="px-4 py-3.5 tabular-nums">
                    <span className="font-semibold text-text-primary">{formatTaka(price.current)}</span>
                    {price.hasDiscount && price.original ? (
                      <span className="ml-2 text-xs text-muted line-through">
                        {formatTaka(price.original)}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge
                      label={course.admission_open ? "Open" : "Closed"}
                      tone={course.admission_open ? "open" : "closed"}
                    />
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        course.is_active ? "text-emerald-400 bg-emerald-950/40" : "text-neutral-400 bg-neutral-900"
                      }`}
                    >
                      {course.is_active ? "Active" : "Archived"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-muted tabular-nums">#{course.order_index}</td>
                  <td className="px-4 py-3.5">
                    <button
                      type="button"
                      className="rounded-full border border-stroke bg-bg px-3 py-1 text-xs text-text-primary hover:border-[#89AACC]"
                      onClick={() => setEditing(course)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {editing ? (
        <CourseEditor course={editing} onClose={() => setEditing(null)} onSave={save} />
      ) : null}
    </div>
  );
}

function CourseEditor({
  course,
  onClose,
  onSave,
}: {
  course: Course;
  onClose: () => void;
  onSave: (course: Course) => void;
}) {
  const [draft, setDraft] = useState<Course>(course);
  const [featuresText, setFeaturesText] = useState(draft.features.join("\n"));
  const [syllabusText, setSyllabusText] = useState(draft.syllabus.join("\n"));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <form
        className="max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-stroke bg-surface p-6 shadow-2xl space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          onSave({
            ...draft,
            features: featuresText.split("\n").map((f) => f.trim()).filter(Boolean),
            syllabus: syllabusText.split("\n").map((s) => s.trim()).filter(Boolean),
            updated_at: new Date().toISOString(),
          });
        }}
      >
        <div className="flex items-center justify-between border-b border-stroke pb-3">
          <h2 className="text-xl font-semibold text-text-primary">
            {course.title ? "Edit Course" : "New Course"}
          </h2>
          <button type="button" onClick={onClose} className="text-sm text-muted hover:text-text-primary">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="block text-xs font-medium text-text-primary">
            Course Title *
            <input
              required
              className="mt-1 w-full rounded-2xl border border-stroke bg-bg px-3.5 py-2 text-sm focus:border-[#89AACC] focus:outline-none"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
          </label>
          <label className="block text-xs font-medium text-text-primary">
            URL Slug *
            <input
              required
              className="mt-1 w-full rounded-2xl border border-stroke bg-bg px-3.5 py-2 text-sm focus:border-[#89AACC] focus:outline-none font-mono"
              value={draft.slug}
              onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
            />
          </label>
        </div>

        <label className="block text-xs font-medium text-text-primary">
          Description
          <textarea
            rows={2}
            className="mt-1 w-full rounded-2xl border border-stroke bg-bg px-3.5 py-2 text-sm focus:border-[#89AACC] focus:outline-none"
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          />
        </label>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <label className="block text-xs font-medium text-text-primary">
            Category
            <select
              className="mt-1 w-full rounded-2xl border border-stroke bg-bg px-3 py-2 text-sm focus:border-[#89AACC] focus:outline-none"
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value as CourseCategory })}
            >
              <option value="semester">Semester</option>
              <option value="duet_admission">DUET Admission</option>
              <option value="job_prep">Job Prep</option>
            </select>
          </label>
          <label className="block text-xs font-medium text-text-primary">
            Semester (if applicable)
            <input
              placeholder="e.g. 5th Semester"
              className="mt-1 w-full rounded-2xl border border-stroke bg-bg px-3.5 py-2 text-sm focus:border-[#89AACC] focus:outline-none"
              value={draft.semester ?? ""}
              onChange={(e) => setDraft({ ...draft, semester: e.target.value })}
            />
          </label>
          <label className="block text-xs font-medium text-text-primary">
            Department
            <input
              className="mt-1 w-full rounded-2xl border border-stroke bg-bg px-3.5 py-2 text-sm focus:border-[#89AACC] focus:outline-none"
              value={draft.department}
              onChange={(e) => setDraft({ ...draft, department: e.target.value })}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="block text-xs font-medium text-text-primary">
            Regular Price (BDT) *
            <input
              type="number"
              min={0}
              required
              className="mt-1 w-full rounded-2xl border border-stroke bg-bg px-3.5 py-2 text-sm tabular-nums focus:border-[#89AACC] focus:outline-none"
              value={draft.regular_price}
              onChange={(e) => setDraft({ ...draft, regular_price: Number(e.target.value) })}
            />
          </label>
          <label className="block text-xs font-medium text-text-primary">
            Discount Price (Leave empty if none)
            <input
              type="number"
              min={0}
              className="mt-1 w-full rounded-2xl border border-stroke bg-bg px-3.5 py-2 text-sm tabular-nums focus:border-[#89AACC] focus:outline-none"
              value={draft.discount_price ?? ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  discount_price: e.target.value === "" ? null : Number(e.target.value),
                })
              }
            />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="block text-xs font-medium text-text-primary">
            Duration
            <input
              placeholder="e.g. ৪ মাস / ৩ মাস"
              className="mt-1 w-full rounded-2xl border border-stroke bg-bg px-3.5 py-2 text-sm focus:border-[#89AACC] focus:outline-none"
              value={draft.duration}
              onChange={(e) => setDraft({ ...draft, duration: e.target.value })}
            />
          </label>
          <label className="block text-xs font-medium text-text-primary">
            Delivery Format
            <input
              placeholder="e.g. লাইভ ক্লাস ও রেকর্ডেড ব্যাকআপ"
              className="mt-1 w-full rounded-2xl border border-stroke bg-bg px-3.5 py-2 text-sm focus:border-[#89AACC] focus:outline-none"
              value={draft.delivery_format}
              onChange={(e) => setDraft({ ...draft, delivery_format: e.target.value })}
            />
          </label>
        </div>

        <label className="block text-xs font-medium text-text-primary">
          Features (One per line)
          <textarea
            rows={3}
            placeholder="সাপ্তাহিক লাইভ ক্লাস&#10;লেকচার শিট PDF"
            className="mt-1 w-full rounded-2xl border border-stroke bg-bg px-3.5 py-2 text-sm focus:border-[#89AACC] focus:outline-none"
            value={featuresText}
            onChange={(e) => setFeaturesText(e.target.value)}
          />
        </label>

        <label className="block text-xs font-medium text-text-primary">
          Syllabus Modules (One per line)
          <textarea
            rows={3}
            placeholder="মডিউল ০১: বেসিক সার্কিট&#10;মডিউল ০২: ডিসি মেশিন"
            className="mt-1 w-full rounded-2xl border border-stroke bg-bg px-3.5 py-2 text-sm focus:border-[#89AACC] focus:outline-none"
            value={syllabusText}
            onChange={(e) => setSyllabusText(e.target.value)}
          />
        </label>

        <div className="flex flex-wrap gap-6 pt-1">
          <label className="flex items-center gap-2 text-xs font-medium text-text-primary cursor-pointer">
            <input
              type="checkbox"
              checked={draft.admission_open}
              onChange={(e) => setDraft({ ...draft, admission_open: e.target.checked })}
              className="rounded"
            />
            Admission Open
          </label>
          <label className="flex items-center gap-2 text-xs font-medium text-text-primary cursor-pointer">
            <input
              type="checkbox"
              checked={draft.is_active}
              onChange={(e) => setDraft({ ...draft, is_active: e.target.checked })}
              className="rounded"
            />
            Active (Display in catalogue)
          </label>
        </div>

        <div className="flex justify-end gap-3 border-t border-stroke pt-4">
          <button
            type="button"
            className="rounded-full border border-stroke bg-bg px-5 py-2 text-sm text-muted hover:text-text-primary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-full bg-text-primary px-6 py-2 text-sm font-medium text-bg hover:bg-white"
          >
            Save Course
          </button>
        </div>
      </form>
    </div>
  );
}
