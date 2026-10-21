import { Footer } from "@/components/public/footer";
import { Navbar } from "@/components/public/navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How EEE Academy intends to use inquiry contact data.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="mx-auto max-w-[720px] px-6 pt-32 pb-20">
        <h1 className="text-4xl text-text-primary">Privacy Policy</h1>
        <p className="mt-6 text-sm leading-relaxed text-muted">
          EEE Academy collects inquiry details — name, institute, roll, department, phone, WhatsApp,
          and optional email — so staff can respond to course questions and manage enrollment. Contact
          data is restricted to authorized admins. This page is a placeholder until legal review. No
          student accounts exist in the MVP.
        </p>
      </main>
      <Footer />
    </>
  );
}
