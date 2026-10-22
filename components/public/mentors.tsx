import { EmptyState } from "@/components/ui/empty-state";
import { SampleHint } from "@/components/ui/prototype-mark";
import { Em, SectionHeader } from "@/components/ui/section-header";
import { fetchPublishedTeachers } from "@/lib/data";

const mentorImages = [
  "/images/work_human_perspective_1792603992650.jpg",
  "/images/exploration_glass_refraction_1792604010449.jpg",
];

export async function Mentors() {
  const teachers = await fetchPublishedTeachers();

  return (
    <section id="mentors" className="bg-[#0a0a0a] py-16 md:py-24 border-t border-[#1f1f1f]/50">
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
            {teachers.map((teacher, index) => {
              const imageSrc = teacher.photo_url || mentorImages[index % mentorImages.length];
              return (
                <article
                  key={teacher.id}
                  className="relative bg-[#141414] border border-[#1f1f1f] rounded-3xl overflow-hidden group hover:border-[#878787]/40 transition-all duration-300 p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center"
                >
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 border border-[#1f1f1f] bg-[#0a0a0a]">
                    <img
                      src={imageSrc}
                      alt={teacher.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 halftone-overlay opacity-20 pointer-events-none" />
                  </div>
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-[#89AACC] uppercase tracking-wider block">
                        {teacher.institution_or_batch}
                      </span>
                      <SampleHint />
                    </div>
                    <h3 className="text-xl sm:text-2xl text-[#f5f5f5] font-medium truncate">
                      {teacher.name}
                    </h3>
                    <p className="font-display italic text-[#f5f5f5] text-lg">
                      {teacher.expertise}
                    </p>
                    <p className="text-xs text-[#878787] font-mono">
                      {teacher.qualifications}
                    </p>
                    <p className="text-xs sm:text-sm leading-relaxed text-[#878787] font-light pt-1">
                      {teacher.bio}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
