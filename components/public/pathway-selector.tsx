import Link from "next/link";

const pathways = [
  { href: "/courses?category=semester", label: "Semester" },
  { href: "/courses?category=duet_admission", label: "DUET admission" },
  { href: "/courses?category=job_prep", label: "Job preparation" },
];

export function PathwaySelector() {
  return (
    <section className="bg-bg py-8 md:py-10">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-3 px-6">
        {pathways.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-full border border-stroke bg-surface px-5 py-2.5 text-sm text-muted transition hover:text-text-primary accent-gradient-border"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
