"use client";

import { Em, SectionHeader } from "@/components/ui/section-header";
import { useState } from "react";

const items = [
  {
    q: "How do I choose a course?",
    a: "Browse the catalogue by semester, DUET admission, or job preparation. Open a course to read its details, then start an inquiry if admission is open.",
  },
  {
    q: "Do I need to create a student account?",
    a: "No. The MVP has no student login. You submit an inquiry form without creating an account.",
  },
  {
    q: "How do I contact the academy after submitting an inquiry?",
    a: "After the backend is connected, a saved inquiry will prepare a WhatsApp message for you to send manually. This preview does not send messages.",
  },
  {
    q: "Which payment methods does the academy support?",
    a: "Manual bKash and Nagad instructions, verified by an admin. No payment gateway is included. Receiving numbers are not configured in this preview.",
  },
  {
    q: "How is payment verified?",
    a: "An admin checks the receiving account. A screenshot or claim alone is not proof that funds were received.",
  },
  {
    q: "When will I be added to the private Facebook group?",
    a: "After payment verification and enrollment confirmation, an admin adds the student manually. Group access is not automatic.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-bg py-16 md:py-24">
      <div className="mx-auto max-w-[900px] px-6">
        <SectionHeader
          eyebrow="COMMON QUESTIONS"
          heading={
            <>
              Before you <Em>begin.</Em>
            </>
          }
        />
        <div className="divide-y divide-stroke border-y border-stroke">
          {items.map((item, index) => {
            const expanded = open === index;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  aria-expanded={expanded}
                  onClick={() => setOpen(expanded ? null : index)}
                >
                  <span className="text-text-primary">{item.q}</span>
                  <span className="text-muted">{expanded ? "–" : "+"}</span>
                </button>
                {expanded ? (
                  <p className="pb-5 text-sm leading-relaxed text-muted">{item.a}</p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
