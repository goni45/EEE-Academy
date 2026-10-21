import { EmptyState } from "@/components/ui/empty-state";
import { SampleHint } from "@/components/ui/prototype-mark";
import { Em, SectionHeader } from "@/components/ui/section-header";
import { getPublishedTeachers } from "@/lib/data";

export function Mentors() {
  const teachers = getPublishedTeachers();

  return (
    <section id="mentors" className="bg-bg py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SectionHeader
          eyebrow="MEET YOUR MENTORS"
          heading={
            <>
              Learn with <Em>guidance.</Em>
            </>
          }
          description="শিক্ষকদের পরিচিতি ও বিষয়ভিত্তিক দক্ষতা দেখে আপনার শেখার যাত্রা শুরু করুন।"
        />
        {teachers.length === 0 ? (
          <EmptyState
            title="No published mentors yet"
            description="Teacher profiles will appear here when they are published."
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {teachers.map((teacher) => (
              <article
                key={teacher.id}
                className="overflow-hidden rounded-3xl border border-stroke bg-surface"
              >
                <div className="aspect-[4/3] bg-[linear-gradient(180deg,#161616,#0c0c0c)]" />
                <div className="space-y-2 p-6">
                  <h3 className="text-2xl text-text-primary">
                    {teacher.name}
                    <SampleHint />
                  </h3>
                  <p className="text-sm text-muted">{teacher.qualifications}</p>
                  <p className="font-display italic text-text-primary">{teacher.expertise}</p>
                  <p className="text-sm leading-relaxed text-muted">{teacher.bio}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
