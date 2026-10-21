import { Em } from "@/components/ui/section-header";

const items = [
  {
    n: "01",
    title: "Semester Courses",
    copy: "Structured support for relevant Diploma semester and board examinations.",
  },
  {
    n: "02",
    title: "DUET Admission",
    copy: "Preparation for candidates pursuing DUET admission.",
  },
  {
    n: "03",
    title: "Job Preparation",
    copy: "Preparation pathways for government and private job examinations.",
  },
];

export function LearningPathways() {
  return (
    <section className="bg-bg py-16 md:py-24">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 px-6 md:grid-cols-3 md:px-10">
        {items.map((item, index) => (
          <article
            key={item.n}
            className={index < 2 ? "border-b border-stroke pb-10 md:border-b-0 md:border-r md:pr-8" : ""}
          >
            <p className="font-display italic text-6xl text-text-primary md:text-7xl">{item.n}</p>
            <h3 className="mt-4 text-2xl text-text-primary">
              {item.title.split(" ").slice(0, -1).join(" ")}{" "}
              <Em>{item.title.split(" ").slice(-1)}</Em>
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{item.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
