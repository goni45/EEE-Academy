"use client";

import { HeroVideo } from "@/components/public/hero-video";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const roles = ["সেমিস্টার প্রস্তুতি", "DUET ভর্তি প্রস্তুতি", "চাকরির প্রস্তুতি"];

export function Hero() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    if (reduced || !rootRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      tl.fromTo(
        ".name-reveal",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.1 },
      );

      tl.fromTo(
        ".blur-in",
        { opacity: 0, filter: "blur(10px)", y: 20 },
        { opacity: 1, filter: "blur(0px)", y: 0, duration: 1, stagger: 0.1 },
        0.3,
      );
    }, rootRef);
    return () => ctx.revert();
  }, [reduced]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setRoleIndex((index) => (index + 1) % roles.length);
    }, 2000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      ref={rootRef}
      id="hero"
      className="relative w-full min-h-screen flex flex-col justify-center items-center overflow-hidden bg-[#0a0a0a] px-6 text-center select-none"
    >
      <HeroVideo />

      {/* Hero Content (centered, z-10) */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center pt-24 pb-20">
        {/* Eyebrow */}
        <p className="blur-in text-xs text-[#878787] uppercase tracking-[0.3em] mb-8 font-medium">
          DIPLOMA EEE • LEARN WITH CONFIDENCE
        </p>

        {/* Heading Reveal */}
        <h1 className="name-reveal text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display italic leading-[1] tracking-tight text-[#f5f5f5] mb-6">
          পলিটেকনিক EEE পড়াশোনায় প্রস্তুতি হোক আরও গোছানো
        </h1>

        {/* Rotating study-focus line */}
        <div className="blur-in text-base sm:text-lg md:text-xl text-[#878787] font-light mb-4">
          <span>প্রস্তুতি হোক </span>
          <span
            key={roleIndex}
            className="font-display italic text-[#f5f5f5] animate-role-fade-in inline-block text-lg sm:text-xl md:text-2xl px-1"
          >
            {roles[roleIndex]}
          </span>
          <span>-এর জন্য</span>
        </div>

        {/* Description */}
        <p className="blur-in text-sm md:text-base text-[#878787] max-w-md mb-12 leading-relaxed font-light">
          নিজের সেমিস্টারের কোর্স দেখুন, শিক্ষকদের সঙ্গে পরিচিত হন এবং বাস্তব ক্লাস ডেমো দেখে পড়ানোর ধরন বুঝে নিন।
        </p>

        {/* CTA Buttons matching demo front */}
        <div className="blur-in inline-flex flex-wrap justify-center items-center gap-4">
          {/* Primary CTA: Solid light button with hover dark swap and accent gradient border */}
          <Link
            href="/courses"
            className="group relative rounded-full text-sm font-medium px-7 py-3.5 transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden"
          >
            <span className="absolute inset-0 rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 block rounded-full bg-[#f5f5f5] text-[#0a0a0a] group-hover:bg-[#0a0a0a] group-hover:text-[#f5f5f5] px-7 py-3.5 -mx-7 -my-3.5 transition-colors duration-300">
              সব কোর্স দেখুন
            </span>
          </Link>

          {/* Secondary CTA: Dark button with border-2 and hover accent gradient border */}
          <Link
            href="/#demos"
            className="group relative rounded-full text-sm font-medium px-7 py-3.5 transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            <span className="absolute inset-0 rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 block rounded-full border-2 border-[#1f1f1f] bg-[#0a0a0a] text-[#f5f5f5] group-hover:border-transparent px-7 py-3.5 -mx-7 -my-3.5 transition-all duration-300">
              ক্লাস ডেমো দেখুন
            </span>
          </Link>
        </div>
      </div>

      {/* Scroll Indicator matching demo front */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-10">
        <span className="text-[10px] text-[#878787] uppercase tracking-[0.2em] font-medium">
          SCROLL
        </span>
        <div className="relative w-px h-10 bg-[#1f1f1f] overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-[#f5f5f5] animate-scroll-down" />
        </div>
      </div>
    </section>
  );
}
