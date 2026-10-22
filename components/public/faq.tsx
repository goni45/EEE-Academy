"use client";

import { Em, SectionHeader } from "@/components/ui/section-header";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const items = [
  {
    q: "How do I choose a course?",
    bnQ: "আমি কীভাবে সঠিক কোর্স বেছে নেব?",
    a: "Browse the catalogue by semester, DUET admission, or job preparation. Open a course to read its details, then start an inquiry if admission is open.",
  },
  {
    q: "Do I need to create a student account?",
    bnQ: "কোর্সে অংশ নিতে কি স্টুডেন্ট অ্যাকাউন্ট খুলতে হবে?",
    a: "No. The MVP has no student login. You submit an inquiry form without creating an account.",
  },
  {
    q: "How do I contact the academy after submitting an inquiry?",
    bnQ: "ফর্ম জমা দেওয়ার পর একাডেমির সাথে কীভাবে যোগাযোগ করব?",
    a: "After the backend is connected, a saved inquiry will prepare a WhatsApp message for you to send manually. This preview does not send messages.",
  },
  {
    q: "Which payment methods does the academy support?",
    bnQ: "কোর্সের ফি কীভাবে পরিশোধ করতে হবে?",
    a: "Manual bKash and Nagad instructions, verified by an admin. No payment gateway is included. Receiving numbers are not configured in this preview.",
  },
  {
    q: "How is payment verified?",
    bnQ: "পেমেন্ট কীভাবে ভেরিফাই করা হয়?",
    a: "An admin checks the receiving account. A screenshot or claim alone is not proof that funds were received.",
  },
  {
    q: "When will I be added to the private Facebook group?",
    bnQ: "প্রাইভেট ফেসবুক গ্রুপে কখন যুক্ত করা হবে?",
    a: "After payment verification and enrollment confirmation, an admin adds the student manually. Group access is not automatic.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-[#0a0a0a] py-16 md:py-24 border-t border-[#1f1f1f]/60">
      <div className="mx-auto max-w-[900px] px-6">
        <SectionHeader
          eyebrow="COMMON QUESTIONS"
          heading={
            <>
              Before you <Em>begin.</Em>
            </>
          }
          description="ভর্তি এবং ক্লাস সংক্রান্ত সাধারণ কিছু প্রশ্নের উত্তর।"
        />
        <div className="divide-y divide-[#1f1f1f] border-y border-[#1f1f1f]">
          {items.map((item, index) => {
            const expanded = open === index;
            return (
              <div key={item.q} className="group">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 py-5 sm:py-6 text-left cursor-pointer transition-colors"
                  aria-expanded={expanded}
                  onClick={() => setOpen(expanded ? null : index)}
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-base sm:text-lg text-[#f5f5f5] group-hover:text-white font-medium transition-colors">
                      {item.q}
                    </span>
                    <span className="text-xs text-[#89AACC] font-light">
                      {item.bnQ}
                    </span>
                  </div>
                  <span className={`w-8 h-8 rounded-full border border-[#1f1f1f] flex items-center justify-center text-sm font-mono shrink-0 transition-all ${
                    expanded ? "bg-[#f5f5f5] text-[#0a0a0a] border-white" : "text-[#878787] group-hover:border-[#4E85BF] group-hover:text-[#f5f5f5]"
                  }`}>
                    {expanded ? "−" : "+"}
                  </span>
                </button>
                <AnimatePresence>
                  {expanded ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-sm leading-relaxed text-[#878787] font-light max-w-2xl">
                        {item.a}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
