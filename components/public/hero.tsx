"use client";

import { HeroVideo } from "@/components/public/hero-video";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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
      gsap.fromTo(
        ".name-reveal",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.1, ease: "power3.out" },
      );
      gsap.fromTo(
        ".blur-in",
        { opacity: 0, y: 20, filter: "blur(10px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1,
          stagger: 0.1,
          delay: 0.3,
          ease: "power3.out",
        },
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
      className="relative flex min-h-dvh items-center justify-center overflow-hidden px-6"
    >
      <HeroVideo />
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        <p className="blur-in mb-8 text-xs uppercase tracking-[0.3em] text-muted">
          DIPLOMA EEE • LEARN WITH CONFIDENCE
        </p>
        <h1 className="name-reveal max-w-5xl text-3xl leading-tight text-text-primary sm:text-5xl md:text-6xl lg:text-7xl">
          পলিটেকনিক EEE পড়াশোনায় প্রস্তুতি হোক আরও গোছানো
        </h1>
        <div className="mt-6 h-8 overflow-hidden font-display italic text-lg text-text-primary md:text-2xl" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.p
              key={roles[roleIndex]}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {roles[roleIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
        <p className="blur-in mt-8 mb-12 max-w-md text-sm leading-relaxed text-muted md:text-base">
          নিজের সেমিস্টারের কোর্স দেখুন, শিক্ষকদের সঙ্গে পরিচিত হন এবং বাস্তব ক্লাস ডেমো দেখে পড়ানোর ধরন বুঝে নিন।
        </p>
        <div className="blur-in flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/courses"
            className="rounded-full bg-text-primary px-7 py-3.5 text-sm text-bg transition-transform hover:scale-[1.04] hover:bg-bg hover:text-text-primary accent-gradient-border"
          >
            সব কোর্স দেখুন
          </Link>
          <Link
            href="/#demos"
            className="rounded-full border-2 border-stroke bg-bg px-7 py-3.5 text-sm text-text-primary transition-transform hover:scale-[1.04] accent-gradient-border"
          >
            ক্লাস ডেমো দেখুন
          </Link>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3">
        <span className="text-xs uppercase tracking-[0.2em] text-muted">SCROLL</span>
        <span className="relative h-10 w-px overflow-hidden bg-stroke">
          <span className="absolute inset-x-0 h-4 bg-text-primary animate-scroll-down" />
        </span>
      </div>
    </section>
  );
}
