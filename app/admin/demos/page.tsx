"use client";

import { getAllDemos, getAllTeachers } from "@/lib/data";
import type { ClassDemo } from "@/lib/types";
import { useState } from "react";

export default function AdminDemosPage() {
  const [rows, setRows] = useState<ClassDemo[]>(() => getAllDemos());
  const [teachers] = useState(() => getAllTeachers());
  const [editing, setEditing] = useState<ClassDemo | null>(null);

  function save(demo: ClassDemo) {
    setRows((current) => {
      const exists = current.some((item) => item.id === demo.id);
      if (exists) return current.map((item) => (item.id === demo.id ? demo : item));
      return [...current, demo];
    });
    setEditing(null);
  }

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl text-text-primary">Class Demo Recordings</h1>
          <p className="mt-1 text-sm text-muted">
            Manage public video demos, teaching topics, and mentor assignments.
          </p>
        </div>
        <button
          type="button"
          className="rounded-full bg-text-primary px-5 py-2.5 text-sm font-medium text-bg hover:bg-white self-start"
          onClick={() =>
            setEditing({
              id: `demo-${Date.now()}`,
              title: "",
              topic: "",
              description: "",
              teacher_id: teachers[0]?.id ?? null,
              video_url: null,
              thumbnail_url: null,
              display_order: rows.length + 1,
              is_published: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
          }
        >
          + Add New Demo
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-3xl border border-stroke bg-surface/30">
        <table className="min-w-[850px] w-full text-left text-sm">
          <thead className="border-b border-stroke bg-surface/60 text-xs uppercase tracking-[0.12em] text-muted">
            <tr>
              {["Demo Title", "Topic", "Mentor", "Status", "Order", "Actions"].map((heading) => (
                <th key={heading} className="px-4 py-3.5 font-medium">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stroke/60">
            {rows.map((demo) => {
              const teacher = teachers.find((t) => t.id === demo.teacher_id);
              return (
                <tr key={demo.id} className="transition hover:bg-surface/50">
                  <td className="px-4 py-3.5 font-medium text-text-primary">
                    <p>{demo.title || "Untitled Demo"}</p>
                    <p className="text-xs text-muted line-clamp-1">{demo.description}</p>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-muted">
                    <span className="rounded-full bg-bg border border-stroke px-2.5 py-1 text-text-primary">
                      {demo.topic}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-text-primary/90">
                    {teacher ? teacher.name : "Unassigned"}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        demo.is_published
                          ? "text-emerald-400 bg-emerald-950/40"
                          : "text-neutral-400 bg-neutral-900"
                      }`}
                    >
                      {demo.is_published ? "Published" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-muted tabular-nums">#{demo.display_order}</td>
                  <td className="px-4 py-3.5">
                    <button
                      type="button"
                      className="rounded-full border border-stroke bg-bg px-3 py-1 text-xs text-text-primary hover:border-[#89AACC]"
                      onClick={() => setEditing(demo)}
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setEditing(null)}
        >
          <form
            className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-3xl border border-stroke bg-surface p-6 shadow-2xl space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              save({ ...editing, updated_at: new Date().toISOString() });
            }}
          >
            <div className="flex items-center justify-between border-b border-stroke pb-3">
              <h2 className="text-lg font-semibold text-text-primary">
                {editing.title ? "Edit Class Demo" : "New Class Demo"}
              </h2>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="text-sm text-muted hover:text-text-primary"
              >
                ✕
              </button>
            </div>

            <label className="block text-xs font-medium text-text-primary">
              Demo Title *
              <input
                required
                className="mt-1 w-full rounded-2xl border border-stroke bg-bg px-3.5 py-2 text-sm focus:border-[#89AACC] focus:outline-none"
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              />
            </label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block text-xs font-medium text-text-primary">
                Topic / Subject *
                <input
                  required
                  placeholder="e.g. AC সার্কিট রেজোন্যান্স"
                  className="mt-1 w-full rounded-2xl border border-stroke bg-bg px-3.5 py-2 text-sm focus:border-[#89AACC] focus:outline-none"
                  value={editing.topic}
                  onChange={(e) => setEditing({ ...editing, topic: e.target.value })}
                />
              </label>
              <label className="block text-xs font-medium text-text-primary">
                Assign Teacher
                <select
                  className="mt-1 w-full rounded-2xl border border-stroke bg-bg px-3 py-2 text-sm focus:border-[#89AACC] focus:outline-none"
                  value={editing.teacher_id ?? ""}
                  onChange={(e) => setEditing({ ...editing, teacher_id: e.target.value || null })}
                >
                  <option value="">No teacher</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block text-xs font-medium text-text-primary">
              Short Description
              <textarea
                rows={3}
                placeholder="Key concepts covered in this demo class"
                className="mt-1 w-full rounded-2xl border border-stroke bg-bg px-3.5 py-2 text-sm focus:border-[#89AACC] focus:outline-none"
                value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              />
            </label>

            <label className="block text-xs font-medium text-text-primary">
              Video URL (Embed or stream link)
              <input
                placeholder="https://facebook.com/... or https://..."
                className="mt-1 w-full rounded-2xl border border-stroke bg-bg px-3.5 py-2 text-sm font-mono focus:border-[#89AACC] focus:outline-none"
                value={editing.video_url ?? ""}
                onChange={(e) => setEditing({ ...editing, video_url: e.target.value || null })}
              />
            </label>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs font-medium text-text-primary cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.is_published}
                  onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })}
                  className="rounded"
                />
                Publish to public website
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-text-primary">
                Display Order:
                <input
                  type="number"
                  min={1}
                  className="w-16 rounded-xl border border-stroke bg-bg px-2 py-1 text-xs text-center"
                  value={editing.display_order}
                  onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })}
                />
              </label>
            </div>

            <div className="flex justify-end gap-3 border-t border-stroke pt-4">
              <button
                type="button"
                className="rounded-full border border-stroke bg-bg px-5 py-2 text-sm text-muted hover:text-text-primary"
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-full bg-text-primary px-6 py-2 text-sm font-medium text-bg hover:bg-white"
              >
                Save Demo
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
