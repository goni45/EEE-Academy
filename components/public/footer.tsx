"use client";

import { LogoMark } from "@/components/ui/logo-mark";
import gsap from "gsap";
import Link from "next/link";
import { useEffect, useRef } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/#mentors", label: "Mentors" },
  { href: "/#demos", label: "Class Demos" },
  { href: "/#contact", label: "Contact" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

export function Footer() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !marqueeRef.current) return;
    const tween = gsap.to(marqueeRef.current, {
      xPercent: -50,
      duration: 40,
      ease: "none",
      repeat: -1,
    });
    return () => {
      tween.kill();
    };
  }, []);

  return (
    <footer id="contact" className="overflow-hidden bg-bg pt-16 md:pt-20 pb-8 md:pb-12">
      <div className="relative mx-auto max-w-[1400px] px-6">
        <div className="overflow-hidden">
          <div
            ref={marqueeRef}
            className="flex w-max gap-8 whitespace-nowrap font-display italic text-5xl text-text-primary/80 md:text-8xl"
            aria-hidden
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <span key={index}>LEARN • PREPARE • BUILD YOUR FUTURE •</span>
            ))}
          </div>
        </div>
        <div className="mt-12 flex justify-center">
          <Link
            href="/courses"
            className="rounded-full bg-surface px-7 py-3.5 text-sm text-text-primary accent-gradient-border"
          >
            ভর্তি সম্পর্কে জানতে যোগাযোগ করুন ↗
          </Link>
        </div>
        <p className="mt-4 text-center text-xs text-muted">
          Contact details will be configured later. Official numbers are not set in this preview.
        </p>
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-stroke pt-8 md:flex-row">
          <div className="flex items-center gap-3">
            <LogoMark />
            <p className="text-xs uppercase tracking-[0.2em] text-muted">EEE Academy</p>
          </div>
          <nav className="flex flex-wrap justify-center gap-4 text-xs text-muted">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-text-primary">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
