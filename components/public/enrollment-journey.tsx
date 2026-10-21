"use client";

import { Em } from "@/components/ui/section-header";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useEffect, useRef } from "react";

const steps = [
  {
    n: "01",
    title: "Choose a course",
    copy: "Browse the catalogue and select an available course.",
  },
  {
    n: "02",
    title: "Submit your details",
    copy: "Complete the course inquiry form with the required student information.",
  },
  {
    n: "03",
    title: "Contact the academy",
    copy: "After the inquiry is saved in a later backend phase, you will send a prepared WhatsApp message manually.",
  },
  {
    n: "04",
    title: "Complete enrollment",
    copy: "Pay through the academy’s configured manual method. An admin verifies payment, confirms enrollment, and adds the student to the private Facebook group.",
  },
];

export function EnrollmentJourney() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    if (reduce || mobile || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: ".enrollment-pin",
        pinSpacing: false,
      });
      gsap.to(".parallax-left", {
        yPercent: -18,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
      gsap.to(".parallax-right", {
        yPercent: 18,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-auto bg-bg md:min-h-[300vh]">
      <div className="enrollment-pin flex min-h-dvh items-center">
        <div className="relative mx-auto flex w-full max-w-[1400px] items-center justify-center px-6">
          <div className="parallax-left pointer-events-none absolute left-6 top-16 hidden gap-8 md:grid">
            <div className="aspect-square w-[240px] max-w-[320px] rotate-[-6deg] rounded-3xl bg-[linear-gradient(180deg,#1a1a1a,#0b0b0b)]" />
            <div className="aspect-square w-[240px] max-w-[320px] rotate-[4deg] rounded-3xl bg-[linear-gradient(180deg,#202428,#0b0b0b)]" />
          </div>
          <div className="relative z-10 max-w-xl text-center">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-muted">YOUR LEARNING JOURNEY</p>
            <h2 className="text-4xl text-text-primary md:text-6xl">
              A clearer path to <Em>your next step.</Em>
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted md:text-base">
              কোর্স নির্বাচন থেকে ভর্তি নিশ্চিত করা পর্যন্ত প্রতিটি ধাপ সহজভাবে বুঝে নিন।
            </p>
            <Link
              href="/courses"
              className="mt-8 inline-flex rounded-full bg-surface px-7 py-3.5 text-sm accent-gradient-border"
            >
              কোর্স বেছে নিন ↗
            </Link>
            <ol className="mt-10 space-y-5 text-left">
              {steps.map((step) => (
                <li key={step.n}>
                  <p className="font-display italic text-2xl text-text-primary">
                    {step.n} — {step.title}
                  </p>
                  <p className="mt-1 text-sm text-muted">{step.copy}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="parallax-right pointer-events-none absolute right-6 top-24 hidden md:block">
            <div className="aspect-square w-[240px] max-w-[320px] rotate-[7deg] rounded-3xl bg-[linear-gradient(180deg,#18202b,#0b0b0b)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
