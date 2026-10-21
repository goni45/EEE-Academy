"use client";

import { StatusBadge } from "@/components/ui/status-badge";
import { getPublicCourses } from "@/lib/data";
import { mockCourses } from "@/lib/mock/courses";
import { formatTaka, getDisplayPrice } from "@/lib/pricing";
import type { Course } from "@/lib/types";
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
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl text-text-primary">Courses</h1>
          <p className="mt-2 text-sm text-muted">
            Local prototype only. Public pages still read the static mock catalogue.
          </p>
        </div>
        <button
          type="button"
          className="rounded-full bg-text-primary px-4 py-2 text-sm text-bg"
          onClick={() =>
            setEditing({
              id: `local-${Date.now()}`,
              title: "",
              slug: "",
              description: "",
              department: "EEE",
              category: "semester",
              semester: "",
              regular_price: 0,
              discount_price: null,
              features: [],
              syllabus: [],
              duration: "",
              delivery_format: "Live online classes",
              is_active: true,
              admission_open: true,
              order_index: rows.length + 1,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
          }
        >
          New course
        </button>
      </div>
      <div className="mt-6 overflow-x-auto rounded-3xl border border-stroke">
        <table className="min-w-[800px] w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-[0.12em] text-muted">
            <tr>
              {["Title", "Category", "Price", "Admission", "Active", ""].map((heading) => (
                <th key={heading} className="px-3 py-3 font-medium">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((course) => {
              const price = getDisplayPrice(course);
              return (
                <tr key={course.id} className="border-t border-stroke">
                  <td className="px-3 py-3">{course.title || "Untitled"}</td>
                  <td className="px-3 py-3 text-muted">{course.category}</td>
                  <td className="px-3 py-3 tabular-nums">{formatTaka(price.current)}</td>
                  <td className="px-3 py-3">
                    <StatusBadge
                      label={course.admission_open ? "Open" : "Closed"}
                      tone={course.admission_open ? "open" : "closed"}
                    />
                  </td>
                  <td className="px-3 py-3">{course.is_active ? "Yes" : "Archived"}</td>
                  <td className="px-3 py-3">
                    <button type="button" className="text-muted" onClick={() => setEditing(course)}>
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
        <CourseEditor
          course={editing}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      ) : null}
      <p className="mt-4 hidden">{getPublicCourses().length}</p>
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
  const [draft, setDraft] = useState(course);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <form
        className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-3xl border border-stroke bg-surface p-6 space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          onSave({ ...draft, updated_at: new Date().toISOString() });
        }}
      >
        <h2 className="text-xl text-text-primary">Edit course</h2>
        <label className="block text-sm">
          Title
          <input
            className="mt-1 w-full rounded-full border border-stroke bg-bg px-4 py-2"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          />
        </label>
        <label className="block text-sm">
          Slug
          <input
            className="mt-1 w-full rounded-full border border-stroke bg-bg px-4 py-2"
            value={draft.slug}
            onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
          />
        </label>
        <label className="block text-sm">
          Regular price
          <input
            type="number"
            className="mt-1 w-full rounded-full border border-stroke bg-bg px-4 py-2"
            value={draft.regular_price}
            onChange={(e) => setDraft({ ...draft, regular_price: Number(e.target.value) })}
          />
        </label>
        <label className="block text-sm">
          Discount price (empty = none)
          <input
            type="number"
            className="mt-1 w-full rounded-full border border-stroke bg-bg px-4 py-2"
            value={draft.discount_price ?? ""}
            onChange={(e) =>
              setDraft({
                ...draft,
                discount_price: e.target.value === "" ? null : Number(e.target.value),
              })
            }
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={draft.admission_open}
            onChange={(e) => setDraft({ ...draft, admission_open: e.target.checked })}
          />
          Admission open
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={draft.is_active}
            onChange={(e) => setDraft({ ...draft, is_active: e.target.checked })}
          />
          Active (uncheck to archive)
        </label>
        <div className="flex gap-3 pt-2">
          <button type="submit" className="rounded-full bg-text-primary px-4 py-2 text-sm text-bg">
            Save locally
          </button>
          <button type="button" className="text-sm text-muted" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
