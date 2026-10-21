import { CoursesDirectory } from "@/components/public/courses-directory";
import { Footer } from "@/components/public/footer";
import { Navbar } from "@/components/public/navbar";
import { Suspense } from "react";

export default function CoursesPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="bg-bg pt-28 pb-20">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
          <Suspense fallback={<p className="text-sm text-muted">Loading courses…</p>}>
            <CoursesDirectory />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
