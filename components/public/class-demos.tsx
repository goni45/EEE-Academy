"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { SampleHint } from "@/components/ui/prototype-mark";
import { Em, SectionHeader } from "@/components/ui/section-header";
import { getPublishedDemos, getTeacherById } from "@/lib/data";
import { useState } from "react";

export function ClassDemos() {
  const demos = getPublishedDemos();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section id="demos" className="bg-bg py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SectionHeader
          eyebrow="WATCH A CLASS"
          heading={
            <>
              See how we <Em>teach.</Em>
            </>
          }
          description="বাস্তব ক্লাস ডেমো দেখে পড়ানোর ধরন ও আলোচনার বিষয় সম্পর্কে ধারণা নিন।"
          cta={{ href: "/#demos", label: "সব ক্লাস ডেমো দেখুন ↗" }}
        />
        {demos.length === 0 ? (
          <EmptyState
            title="No class demos yet"
            description="Published demos will appear here."
          />
        ) : (
          <div className="space-y-4">
            {demos.map((demo) => {
              const teacher = demo.teacher_id ? getTeacherById(demo.teacher_id) : null;
              const open = openId === demo.id;
              return (
                <div key={demo.id}>
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : demo.id)}
                    className="flex w-full items-center gap-6 rounded-[40px] border border-stroke bg-surface/30 p-4 text-left transition hover:bg-surface sm:rounded-full"
                  >
                    <span className="h-16 w-16 shrink-0 rounded-full bg-[linear-gradient(180deg,#1c1c1c,#0d0d0d)]" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-text-primary">
                        {demo.title}
                        <SampleHint />
                      </span>
                      <span className="block text-sm text-muted">
                        {demo.topic}
                        {teacher?.is_published ? ` · ${teacher.name}` : ""}
                      </span>
                    </span>
                    <span className="pr-2 text-sm text-muted">Watch</span>
                  </button>
                  {open ? (
                    <div className="mt-3 rounded-3xl border border-stroke bg-surface px-5 py-6 text-sm text-muted">
                      Sample demo — video will play here when an approved URL is configured.
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
