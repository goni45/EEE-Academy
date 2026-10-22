"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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
    copy: "After the inquiry is saved, open the prepared WhatsApp message and send it manually.",
  },
  {
    n: "04",
    title: "Complete enrollment",
    copy: "Pay through the academy’s manual bKash/Nagad method. Admin verifies payment and adds student to private group.",
  },
];

const cards = [
  {
    id: "step-1",
    step: "Step 01",
    title: "Course Selection",
    image: "/images/exploration_abstract_sculpture_1792603992253.jpg",
    rotation: "rotate-[-4deg]",
  },
  {
    id: "step-2",
    step: "Step 02",
    title: "Student Details",
    image: "/images/exploration_kinetic_light_1792604010286.jpg",
    rotation: "rotate-[3deg]",
  },
  {
    id: "step-3",
    step: "Step 03",
    title: "WhatsApp Message",
    image: "/images/exploration_glass_refraction_1792604010449.jpg",
    rotation: "rotate-[-5deg]",
  },
  {
    id: "step-4",
    step: "Step 04",
    title: "Private Group Access",
    image: "/images/work_brand_identity_1792603992871.jpg",
    rotation: "rotate-[4deg]",
  },
];

export function EnrollmentJourney() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const centerContentRef = useRef<HTMLDivElement>(null);
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    if (reduce || mobile || !sectionRef.current || !centerContentRef.current || !col1Ref.current || !col2Ref.current) return;

    const section = sectionRef.current;
    const center = centerContentRef.current;
    const col1 = col1Ref.current;
    const col2 = col2Ref.current;

    const ctx = gsap.context(() => {
      // Pin center content through the 300vh scroll
      ScrollTrigger.create({
        trigger: section,
        pin: center,
        start: "top top",
        end: "bottom bottom",
        pinSpacing: false,
      });

      // Parallax Column 1
      gsap.fromTo(
        col1,
        { y: 80 },
        {
          y: -400,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2,
          },
        },
      );

      // Parallax Column 2
      gsap.fromTo(
        col2,
        { y: 250 },
        {
          y: -700,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.8,
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const col1Items = cards.filter((_, idx) => idx % 2 === 0);
  const col2Items = cards.filter((_, idx) => idx % 2 === 1);

  return (
    <section
      ref={sectionRef}
      id="enrollment"
      className="relative min-h-auto md:min-h-[300vh] bg-[#0a0a0a] overflow-hidden border-t border-[#1f1f1f]"
    >
      {/* Background subtle blue glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4E85BF]/5 blur-[140px] rounded-full pointer-events-none" />

      {/* Layer 1: Pinned Center Content */}
      <div
        ref={centerContentRef}
        className="w-full min-h-screen flex flex-col items-center justify-center pointer-events-none z-10 px-6 py-20 text-center"
      >
        <div className="pointer-events-auto max-w-lg mx-auto flex flex-col items-center">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-[#1f1f1f]" />
            <span className="text-xs text-[#878787] uppercase tracking-[0.3em] font-medium">
              YOUR LEARNING JOURNEY
            </span>
            <span className="w-8 h-px bg-[#1f1f1f]" />
          </div>

          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl text-[#f5f5f5] tracking-tight leading-none mb-4">
            <span>A clearer path to </span>
            <span className="font-display italic">your next step.</span>
          </h2>

          {/* Subtext */}
          <p className="text-sm md:text-base text-[#878787] font-light mb-8 max-w-sm">
            কোর্স নির্বাচন থেকে ভর্তি নিশ্চিত করা পর্যন্ত প্রতিটি ধাপ সহজভাবে বুঝে নিন।
          </p>

          {/* CTA Button matching demo front */}
          <Link
            href="/courses"
            className="group relative rounded-full text-xs font-medium px-6 py-3 transition-all duration-300 hover:scale-105 cursor-pointer inline-flex items-center gap-2 mb-8"
          >
            <span className="absolute inset-0 rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-2 rounded-full border border-[#1f1f1f] bg-[#141414]/90 text-[#f5f5f5] group-hover:border-transparent px-6 py-3 -mx-6 -my-3 backdrop-blur-md transition-all">
              <span>কোর্স বেছে নিন</span>
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </Link>

          {/* Interactive Step Switcher */}
          <div className="w-full flex flex-col gap-2.5 text-left border-t border-[#1f1f1f]/80 pt-6">
            {steps.map((step, idx) => (
              <div
                key={step.n}
                onClick={() => setActiveStep(idx)}
                className={`p-3 rounded-2xl cursor-pointer transition-all ${
                  activeStep === idx
                    ? "bg-[#141414] border border-[#1f1f1f]"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[#89AACC]">{step.n}</span>
                  <span className="font-display italic text-base text-[#f5f5f5]">{step.title}</span>
                </div>
                {activeStep === idx ? (
                  <p className="mt-1 text-xs text-[#878787] font-light leading-relaxed pl-6">
                    {step.copy}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Layer 2: Parallax Floating Columns (Desktop only) */}
      <div className="hidden md:flex absolute inset-0 z-20 pointer-events-none justify-center px-6">
        <div className="w-full max-w-[1400px] grid grid-cols-2 gap-8 sm:gap-16 md:gap-40 pt-36">
          {/* Column 1 */}
          <div ref={col1Ref} className="flex flex-col gap-28 sm:gap-40 items-center md:items-start pointer-events-auto">
            {col1Items.map((item) => (
              <div
                key={item.id}
                className={`relative group cursor-pointer w-full max-w-[280px] sm:max-w-[320px] aspect-square rounded-3xl bg-[#141414] border border-[#1f1f1f] overflow-hidden p-3 transition-transform duration-500 hover:scale-105 ${item.rotation} hover:rotate-0 hover:border-[#89AACC]/40 shadow-2xl`}
              >
                <div className="w-full h-full rounded-2xl overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 halftone-overlay opacity-20 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#89AACC]">
                      {item.step}
                    </span>
                    <h4 className="text-sm font-display italic text-white truncate">
                      {item.title}
                    </h4>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Column 2 */}
          <div ref={col2Ref} className="flex flex-col gap-28 sm:gap-40 items-center md:items-end pointer-events-auto">
            {col2Items.map((item) => (
              <div
                key={item.id}
                className={`relative group cursor-pointer w-full max-w-[280px] sm:max-w-[320px] aspect-square rounded-3xl bg-[#141414] border border-[#1f1f1f] overflow-hidden p-3 transition-transform duration-500 hover:scale-105 ${item.rotation} hover:rotate-0 hover:border-[#89AACC]/40 shadow-2xl`}
              >
                <div className="w-full h-full rounded-2xl overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 halftone-overlay opacity-20 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#89AACC]">
                      {item.step}
                    </span>
                    <h4 className="text-sm font-display italic text-white truncate">
                      {item.title}
                    </h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
