// Development-only sample data. Not verified academy information.
import type { ClassDemo } from "@/lib/types";

export const mockDemos: ClassDemo[] = [
  {
    id: "demo-1",
    title: "Circuit analysis walkthrough",
    topic: "Kirchhoff’s laws",
    description: "Sample class demo card. Video playback is a local placeholder in this preview.",
    teacher_id: "teacher-1",
    video_url: null,
    thumbnail_url: null,
    display_order: 1,
    is_published: true,
    created_at: "2026-09-01T00:00:00.000Z",
    updated_at: "2026-10-01T00:00:00.000Z",
  },
  {
    id: "demo-2",
    title: "Transformer basics",
    topic: "Electrical machines",
    description: "Sample class demo card for layout preview.",
    teacher_id: "teacher-2",
    video_url: null,
    thumbnail_url: null,
    display_order: 2,
    is_published: true,
    created_at: "2026-09-10T00:00:00.000Z",
    updated_at: "2026-10-01T00:00:00.000Z",
  },
  {
    id: "demo-3",
    title: "Unpublished demo",
    topic: "Hidden",
    description: "Should not appear on public pages.",
    teacher_id: null,
    video_url: null,
    thumbnail_url: null,
    display_order: 3,
    is_published: false,
    created_at: "2026-09-12T00:00:00.000Z",
    updated_at: "2026-10-01T00:00:00.000Z",
  },
];
