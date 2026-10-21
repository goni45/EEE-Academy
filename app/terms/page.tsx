import { Footer } from "@/components/public/footer";
import { Navbar } from "@/components/public/navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "EEE Academy terms placeholder for the frontend preview.",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="mx-auto max-w-[720px] px-6 pt-32 pb-20">
        <h1 className="text-4xl text-text-primary">Terms of Service</h1>
        <p className="mt-6 text-sm leading-relaxed text-muted">
          Submitting an inquiry does not confirm payment, enrollment, or Facebook group access. Those
          steps remain manual admin actions after a future backend is connected. This document is a
          placeholder and not a complete legal agreement.
        </p>
      </main>
      <Footer />
    </>
  );
}
