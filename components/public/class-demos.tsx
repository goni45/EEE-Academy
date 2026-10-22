"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { SampleHint } from "@/components/ui/prototype-mark";
import { Em, SectionHeader } from "@/components/ui/section-header";
import { getPublishedDemos, getTeacherById } from "@/lib/data";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

const demoImages = [
  "/images/journal_typography_editorial_1792604009966.jpg",
  "/images/journal_spatial_design_1792604010096.jpg",
];

export function ClassDemos() {
  const demos = getPublishedDemos();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section id="demos" className="bg-[#0a0a0a] py-16 md:py-24 border-t border-[#1f1f1f]/60 relative">
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
          <div className="flex flex-col gap-4">
            {demos.map((demo, index) => {
              const teacher = demo.teacher_id ? getTeacherById(demo.teacher_id) : null;
              const open = openId === demo.id;
              const imageSrc = demoImages[index % demoImages.length];

              return (
                <div key={demo.id} className="flex flex-col gap-2">
                  <div
                    onClick={() => setOpenId(open ? null : demo.id)}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 p-4 sm:p-5 rounded-[32px] sm:rounded-full bg-[#141414]/30 hover:bg-[#141414] border border-[#1f1f1f] hover:border-[#878787]/40 transition-all duration-300 group cursor-pointer"
                  >
                    {/* Left group: Thumbnail + Title & Topic */}
                    <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden shrink-0 border border-[#1f1f1f]">
                        <img
                          src={imageSrc}
                          alt={demo.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 halftone-overlay opacity-20 pointer-events-none" />
                      </div>

                      <div className="min-w-0 pr-2">
                        <span className="text-[11px] text-[#89AACC] uppercase tracking-wider block mb-1 font-mono">
                          {demo.topic}
                        </span>
                        <h3 className="text-base sm:text-lg md:text-xl text-[#f5f5f5] group-hover:text-white font-medium truncate transition-colors flex items-center gap-2">
                          <span>{demo.title}</span>
                          <SampleHint />
                        </h3>
                      </div>
                    </div>

                    {/* Right group: Teacher + Action pill */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1f1f1f]/60 sm:pr-4">
                      <div className="flex items-center gap-3 text-xs text-[#878787] font-mono">
                        <span>{teacher?.is_published ? teacher.name : "EEE Faculty"}</span>
                        <span>·</span>
                        <span>{open ? "Close Demo" : "Watch Demo"}</span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[#0a0a0a] border border-[#1f1f1f] flex items-center justify-center text-[#878787] group-hover:text-[#f5f5f5] group-hover:border-[#4E85BF] transition-colors">
                        <ArrowUpRight
                          size={15}
                          className={`transition-transform duration-200 ${
                            open ? "rotate-90" : "group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Expanded in-page demo player placeholder */}
                  {open ? (
                    <div className="rounded-3xl border border-[#1f1f1f] bg-[#141414] p-6 text-sm text-[#878787] flex flex-col gap-3 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs uppercase tracking-wider text-[#89AACC]">
                          Class Demo Preview · {demo.topic}
                        </span>
                        <button
                          onClick={() => setOpenId(null)}
                          className="text-xs text-muted hover:text-white cursor-pointer"
                        >
                          ✕ Close
                        </button>
                      </div>
                      <div className="relative aspect-video w-full rounded-2xl bg-[#0a0a0a] border border-[#1f1f1f] flex flex-col items-center justify-center text-center p-6 overflow-hidden">
                        <img
                          src={imageSrc}
                          alt={demo.title}
                          className="absolute inset-0 w-full h-full object-cover opacity-20 filter blur-sm"
                        />
                        <div className="relative z-10 max-w-md">
                          <p className="font-display italic text-2xl text-[#f5f5f5] mb-2">
                            {demo.title}
                          </p>
                          <p className="text-xs text-[#878787] leading-relaxed">
                            Sample class demo preview. Production video player will connect to approved streaming URLs during the backend integration phase.
                          </p>
                        </div>
                      </div>
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
