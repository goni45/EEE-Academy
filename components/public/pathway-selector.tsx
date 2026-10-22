import Link from "next/link";

const pathways = [
  { href: "/courses?category=semester", label: "সেমিস্টার কোর্স · Semester Support" },
  { href: "/courses?category=duet_admission", label: "ডুয়েট ভর্তি · DUET Admission" },
  { href: "/courses?category=job_prep", label: "চাকরির প্রস্তুতি · Job Preparation" },
];

export function PathwaySelector() {
  return (
    <section className="bg-[#0a0a0a] py-8 md:py-12 border-b border-[#1f1f1f]/50">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-3.5 px-6">
        {pathways.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group relative rounded-full text-xs sm:text-sm font-medium px-5 py-2.5 transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            <span className="absolute inset-0 rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-2 rounded-full border border-[#1f1f1f] bg-[#141414]/90 text-[#878787] group-hover:text-[#f5f5f5] group-hover:border-transparent px-5 py-2.5 -mx-5 -my-2.5 backdrop-blur-md transition-all">
              <span>{item.label}</span>
              <span className="text-xs opacity-60 group-hover:translate-x-0.5 transition-transform">↗</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
