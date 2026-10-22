import { CourseCard } from "@/components/public/course-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Em, SectionHeader } from "@/components/ui/section-header";
import { fetchFeaturedCourses } from "@/lib/data";

export async function FeaturedCourses() {
  const courses = await fetchFeaturedCourses();

  return (
    <section className="bg-bg py-12 md:py-16">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SectionHeader
          eyebrow="Featured Courses"
          heading={
            <>
              Build your foundation. <Em>Prepare for what’s next.</Em>
            </>
          }
          description="আপনার সেমিস্টার, DUET ভর্তি প্রস্তুতি অথবা চাকরির প্রস্তুতির জন্য উপযুক্ত কোর্স খুঁজে নিন।"
          cta={{ href: "/courses", label: "সব কোর্স দেখুন ↗" }}
        />
        {courses.length === 0 ? (
          <EmptyState
            title="No courses to show yet"
            description="Sample catalogue records will appear here during this preview."
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-6">
            {courses.map((course, index) => (
              <CourseCard key={course.id} course={course} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
