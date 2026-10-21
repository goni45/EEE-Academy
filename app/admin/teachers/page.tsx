"use client";

import { getAllTeachers } from "@/lib/data";
import type { Teacher } from "@/lib/types";
import { useState } from "react";

export default function AdminTeachersPage() {
  const [rows, setRows] = useState<Teacher[]>(() => getAllTeachers());
  const [editing, setEditing] = useState<Teacher | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-text-primary">Teachers</h1>
          <p className="mt-2 text-sm text-muted">Local prototype. Unpublished profiles stay off public pages.</p>
        </div>
        <button
          type="button"
          className="rounded-full bg-text-primary px-4 py-2 text-sm text-bg"
          onClick={() =>
            setEditing({
              id: `local-teacher-${Date.now()}`,
              name: "",
              qualifications: "",
              institution_or_batch: "",
              expertise: "",
              bio: "",
              photo_url: null,
              display_order: rows.length + 1,
              is_published: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
          }
        >
          New teacher
        </button>
      </div>
      <ul className="mt-6 divide-y divide-stroke rounded-3xl border border-stroke">
        {rows.map((teacher) => (
          <li key={teacher.id} className="flex items-center justify-between px-4 py-3 text-sm">
            <span>
              {teacher.name || "Untitled"}
              <span className="ml-2 text-muted">{teacher.is_published ? "Published" : "Hidden"}</span>
            </span>
            <button type="button" className="text-muted" onClick={() => setEditing(teacher)}>
              Edit
            </button>
          </li>
        ))}
      </ul>
      {editing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <form
            className="w-full max-w-lg space-y-3 rounded-3xl border border-stroke bg-surface p-6"
            onSubmit={(event) => {
              event.preventDefault();
              setRows((current) => {
                const exists = current.some((item) => item.id === editing.id);
                if (exists) return current.map((item) => (item.id === editing.id ? editing : item));
                return [...current, editing];
              });
              setEditing(null);
            }}
          >
            <label className="block text-sm">
              Name
              <input
                className="mt-1 w-full rounded-full border border-stroke bg-bg px-4 py-2"
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              />
            </label>
            <label className="block text-sm">
              Qualifications
              <input
                className="mt-1 w-full rounded-full border border-stroke bg-bg px-4 py-2"
                value={editing.qualifications}
                onChange={(e) => setEditing({ ...editing, qualifications: e.target.value })}
              />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editing.is_published}
                onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })}
              />
              Published
            </label>
            <div className="flex gap-3">
              <button type="submit" className="rounded-full bg-text-primary px-4 py-2 text-sm text-bg">
                Save locally
              </button>
              <button type="button" className="text-sm text-muted" onClick={() => setEditing(null)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
