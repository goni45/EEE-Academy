"use client";

import { motion } from "framer-motion";

const items = [
  {
    n: "01",
    title: "Semester Courses",
    copy: "Structured support for relevant Diploma semester and board examinations.",
    detail: "বোর্ড পরীক্ষার সিলেবাসভিত্তিক লাইভ ক্লাস ও নিয়মিত ডাউট ক্লিয়ারিং সেশন।",
  },
  {
    n: "02",
    title: "DUET Admission",
    copy: "Preparation for candidates pursuing DUET admission.",
    detail: "ডিপ্লোমা শিক্ষার্থীদের জন্য নিবিড় ডুয়েট অ্যাডমিশন স্পেশাল মেন্টরশিপ।",
  },
  {
    n: "03",
    title: "Job Preparation",
    copy: "Preparation pathways for government and private job examinations.",
    detail: "সরকারি ও বেসরকারি প্রতিষ্ঠানসমূহের টেকনিক্যাল পরীক্ষা প্রস্তুতি গাইডলাইন।",
  },
];

export function LearningPathways() {
  return (
    <section className="bg-[#0a0a0a] py-16 md:py-24 border-t border-[#1f1f1f] relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {items.map((item, idx) => (
            <motion.div
              key={item.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col p-6 sm:p-8 rounded-3xl bg-[#141414]/40 border border-[#1f1f1f] relative group hover:border-[#878787]/40 transition-all duration-300"
            >
              {/* Subtle top indicator line */}
              <div className="w-8 h-[2px] bg-[#1f1f1f] group-hover:bg-[#4E85BF] transition-colors mb-6" />

              {/* Number */}
              <div className="text-5xl sm:text-6xl md:text-7xl font-display italic text-[#f5f5f5] tabular-nums mb-3 tracking-tight">
                {item.n}
              </div>

              {/* Label */}
              <h3 className="text-lg sm:text-xl text-[#f5f5f5] font-medium mb-2">
                {item.title}
              </h3>

              {/* Copy */}
              <p className="text-xs sm:text-sm text-[#878787] leading-relaxed font-light mb-2">
                {item.copy}
              </p>

              {/* Bengali detail */}
              <p className="text-xs text-[#89AACC] font-light mt-auto pt-2 border-t border-[#1f1f1f]/60">
                {item.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
