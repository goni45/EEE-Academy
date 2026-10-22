"use client";

import { ImageUploadField } from "@/components/admin/image-upload-field";
import { fetchPublishedTeachers, getAllTeachers } from "@/lib/data";
import { upsertTeacherAction } from "@/lib/actions/admin";
import type { Teacher } from "@/lib/types";
import { useEffect, useState } from "react";

const teacherPhotoPresets = [
  { label: "Perspective / Mentor A", url: "/images/work_human_perspective_1792603992650.jpg" },
  { label: "Refraction / Mentor B", url: "/images/exploration_glass_refraction_1792604010449.jpg" },
  { label: "Modern / Editorial", url: "/images/journal_typography_editorial_1792604009966.jpg" },
];

export default function AdminTeachersPage() {
  const [rows, setRows] = useState<Teacher[]>(() => getAllTeachers());
  const [editing, setEditing] = useState<Teacher | null>(null);

  useEffect(() => {
    async function loadLive() {
      const live = await fetchPublishedTeachers();
      if (live && live.length > 0) {
        setRows(live);
      }
    }
    loadLive();
  }, []);

  async function save(teacher: Teacher) {
    setRows((current) => {
      const exists = current.some((item) => item.id === teacher.id);
      if (exists) return current.map((item) => (item.id === teacher.id ? teacher : item));
      return [...current, teacher];
    });

    const res = await upsertTeacherAction(teacher);
    if (res.ok && res.data) {
      setRows((current) => current.map((item) => (item.id === teacher.id ? res.data! : item)));
    }
    setEditing(null);
  }

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl text-text-primary">Teacher & Mentor Profiles</h1>
          <p className="mt-1 text-sm text-muted">
            Manage teacher credentials, photos, verified affiliations, expertise, and publication status.
          </p>
        </div>
        <button
          type="button"
          className="rounded-full bg-text-primary px-5 py-2.5 text-sm font-medium text-bg hover:bg-white self-start"
          onClick={() =>
            setEditing({
              id: `teacher-${Date.now()}`,
              name: "",
              qualifications: "",
              institution_or_batch: "",
              expertise: "",
              bio: "",
              photo_url: null,
              display_order: rows.length + 1,
              is_published: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
          }
        >
          + Add New Teacher
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-3xl border border-stroke bg-surface/30">
        <table className="min-w-[900px] w-full text-left text-sm">
          <thead className="border-b border-stroke bg-surface/60 text-xs uppercase tracking-[0.12em] text-muted">
            <tr>
              {["Photo", "Teacher Name", "Institution / Batch", "Expertise", "Status", "Order", "Actions"].map(
                (heading) => (
                  <th key={heading} className="px-4 py-3.5 font-medium">
                    {heading}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-stroke/60">
            {rows.map((teacher) => (
              <tr key={teacher.id} className="transition hover:bg-surface/50">
                <td className="px-4 py-3.5">
                  <div className="relative h-11 w-11 overflow-hidden rounded-full border border-stroke bg-bg/80">
                    <img
                      src={teacher.photo_url || "/images/work_human_perspective_1792603992650.jpg"}
                      alt={teacher.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </td>
                <td className="px-4 py-3.5 font-medium text-text-primary">
                  <p>{teacher.name || "Untitled Profile"}</p>
                  <p className="text-xs text-muted">{teacher.qualifications}</p>
                </td>
                <td className="px-4 py-3.5 text-xs text-muted">{teacher.institution_or_batch}</td>
                <td className="px-4 py-3.5 text-xs text-text-primary/90">{teacher.expertise}</td>
                <td className="px-4 py-3.5">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      teacher.is_published
                        ? "text-emerald-400 bg-emerald-950/40"
                        : "text-neutral-400 bg-neutral-900"
                    }`}
                  >
                    {teacher.is_published ? "Published" : "Hidden"}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-xs text-muted tabular-nums">#{teacher.display_order}</td>
                <td className="px-4 py-3.5">
                  <button
                    type="button"
                    className="rounded-full border border-stroke bg-bg px-3 py-1 text-xs text-text-primary hover:border-[#89AACC]"
                    onClick={() => setEditing(teacher)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
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
                {editing.name ? "Edit Teacher Profile" : "New Teacher"}
              </h2>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="text-sm text-muted hover:text-text-primary"
              >
                ✕
              </button>
            </div>

            {/* Mentor Profile Photo Upload */}
            <ImageUploadField
              label="Mentor Profile Photo"
              value={editing.photo_url}
              onChange={(url) => setEditing({ ...editing, photo_url: url })}
              folder="teachers"
              aspectRatio="square"
              presets={teacherPhotoPresets}
              hint="মেন্টরের পোর্ট্রেট ছবি আপলোড করুন অথবা প্রিসেট বেছে নিন।"
            />

            <label className="block text-xs font-medium text-text-primary">
              Teacher Name *
              <input
                required
                className="mt-1 w-full rounded-2xl border border-stroke bg-bg px-3.5 py-2 text-sm focus:border-[#89AACC] focus:outline-none"
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              />
            </label>

            <label className="block text-xs font-medium text-text-primary">
              Qualifications *
              <input
                required
                placeholder="e.g. B.Sc in EEE (DUET), Diploma in EEE"
                className="mt-1 w-full rounded-2xl border border-stroke bg-bg px-3.5 py-2 text-sm focus:border-[#89AACC] focus:outline-none"
                value={editing.qualifications}
                onChange={(e) => setEditing({ ...editing, qualifications: e.target.value })}
              />
            </label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block text-xs font-medium text-text-primary">
                Institution / Batch
                <input
                  placeholder="e.g. DUET '18 Batch"
                  className="mt-1 w-full rounded-2xl border border-stroke bg-bg px-3.5 py-2 text-sm focus:border-[#89AACC] focus:outline-none"
                  value={editing.institution_or_batch}
                  onChange={(e) => setEditing({ ...editing, institution_or_batch: e.target.value })}
                />
              </label>
              <label className="block text-xs font-medium text-text-primary">
                Subject Expertise
                <input
                  placeholder="e.g. AC Machines, Power System"
                  className="mt-1 w-full rounded-2xl border border-stroke bg-bg px-3.5 py-2 text-sm focus:border-[#89AACC] focus:outline-none"
                  value={editing.expertise}
                  onChange={(e) => setEditing({ ...editing, expertise: e.target.value })}
                />
              </label>
            </div>

            <label className="block text-xs font-medium text-text-primary">
              Short Bio
              <textarea
                rows={3}
                placeholder="Brief mentor background and teaching focus"
                className="mt-1 w-full rounded-2xl border border-stroke bg-bg px-3.5 py-2 text-sm focus:border-[#89AACC] focus:outline-none"
                value={editing.bio}
                onChange={(e) => setEditing({ ...editing, bio: e.target.value })}
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
                Save Teacher
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
