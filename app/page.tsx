import { ClassDemos } from "@/components/public/class-demos";
import { EnrollmentJourney } from "@/components/public/enrollment-journey";
import { Faq } from "@/components/public/faq";
import { FeaturedCourses } from "@/components/public/featured-courses";
import { Footer } from "@/components/public/footer";
import { Hero } from "@/components/public/hero";
import { LearningPathways } from "@/components/public/learning-pathways";
import { Mentors } from "@/components/public/mentors";
import { Navbar } from "@/components/public/navbar";
import { PathwaySelector } from "@/components/public/pathway-selector";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <PathwaySelector />
        <FeaturedCourses />
        <Mentors />
        <ClassDemos />
        <EnrollmentJourney />
        <LearningPathways />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
