// Development-only sample data. Not verified academy information.
import type { Teacher } from "@/lib/types";

export const mockTeachers: Teacher[] = [
  {
    id: "teacher-1",
    name: "Sample Mentor A",
    qualifications: "Sample qualification placeholder",
    institution_or_batch: "Sample affiliation",
    expertise: "Electrical circuits",
    bio: "Sample mentor biography for layout preview. Qualifications are placeholders, not verified claims.",
    photo_url: null,
    display_order: 1,
    is_published: true,
    created_at: "2026-08-01T00:00:00.000Z",
    updated_at: "2026-10-01T00:00:00.000Z",
  },
  {
    id: "teacher-2",
    name: "Sample Mentor B",
    qualifications: "Sample qualification placeholder",
    institution_or_batch: "Sample affiliation",
    expertise: "Electronics and machines",
    bio: "Sample mentor biography for layout preview. Do not treat this as a real instructor profile.",
    photo_url: null,
    display_order: 2,
    is_published: true,
    created_at: "2026-08-01T00:00:00.000Z",
    updated_at: "2026-10-01T00:00:00.000Z",
  },
  {
    id: "teacher-3",
    name: "Unpublished Mentor",
    qualifications: "Hidden in public views",
    institution_or_batch: "Sample",
    expertise: "Power systems",
    bio: "Unpublished sample used to verify is_published filtering.",
    photo_url: null,
    display_order: 3,
    is_published: false,
    created_at: "2026-08-01T00:00:00.000Z",
    updated_at: "2026-10-01T00:00:00.000Z",
  },
];
