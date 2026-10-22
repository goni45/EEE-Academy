"use client";

import { LogoMark } from "@/components/ui/logo-mark";
import gsap from "gsap";
import Hls from "hls.js";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

const MARQUEE_TEXT = "LEARN • PREPARE • BUILD YOUR FUTURE • ";
const REPEATED_MARQUEE = Array(8).fill(MARQUEE_TEXT).join("");

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
  const videoRef = useRef<HTMLVideoElement>(null);

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

  // Background Video Init (HLS flipped vertically with scale-y-[-1])
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const hlsSource = "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8";
    let hlsInstance: Hls | null = null;

    if (Hls.isSupported()) {
      const instance = new Hls({ enableWorker: true, lowLatencyMode: true });
      hlsInstance = instance;
      instance.loadSource(hlsSource);
      instance.attachMedia(video);
      instance.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = hlsSource;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch(() => {});
      });
    }

    return () => {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    };
  }, []);

  return (
    <footer
      id="contact"
      className="relative bg-[#0a0a0a] pt-16 md:pt-20 pb-8 md:pb-12 overflow-hidden border-t border-[#1f1f1f]"
    >
      {/* Background Video: flipped vertically (scale-y-[-1]) + heavier overlay: bg-black/60 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover -translate-x-1/2 -translate-y-1/2 scale-y-[-1] opacity-50"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 flex flex-col items-center text-center">
        {/* Marquee Banner matching demo front */}
        <div className="w-full overflow-hidden whitespace-nowrap py-6 mb-12 select-none border-y border-[#1f1f1f]/80">
          <div
            ref={marqueeRef}
            className="inline-flex text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display italic tracking-widest text-[#f5f5f5]/30 uppercase"
          >
            <span>{REPEATED_MARQUEE}</span>
            <span>{REPEATED_MARQUEE}</span>
          </div>
        </div>

        {/* CTA Heading */}
        <div className="max-w-2xl mb-8">
          <p className="text-xs text-[#878787] uppercase tracking-[0.3em] font-medium mb-3">
            কোর্স ভর্তি ও প্রস্তুতি
          </p>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display italic text-[#f5f5f5] leading-tight">
            ভর্তি ও পড়াশোনা সংক্রান্ত যেকোনো প্রয়োজনে
          </h2>
          <p className="text-sm md:text-base text-[#878787] mt-4 font-light max-w-md mx-auto">
            আপনার সেমিস্টার, ডুয়েট ভর্তি অথবা সরকারি ও বেসরকারি চাকরির পরীক্ষার প্রস্তুতি শুরু হোক আজই।
          </p>
        </div>

        {/* Action CTA Button with gradient hover border ring */}
        <div className="mb-14">
          <Link
            href="/courses"
            className="group relative rounded-full text-base sm:text-lg font-medium px-8 sm:px-10 py-4 transition-all duration-300 hover:scale-105 inline-flex items-center gap-3 cursor-pointer"
          >
            {/* Gradient border on hover */}
            <span className="absolute inset-0 rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-3 rounded-full border border-[#1f1f1f] bg-[#141414] text-[#f5f5f5] group-hover:border-transparent px-8 sm:px-10 py-4 -mx-8 sm:-mx-10 -my-4 transition-all duration-300 shadow-xl">
              <span>ভর্তি সম্পর্কে জানতে যোগাযোগ করুন</span>
              <ArrowUpRight
                size={18}
                className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200"
              />
            </span>
          </Link>
        </div>

        <p className="text-xs text-[#878787] font-light mb-12">
          Contact details will be configured later. Official helpline numbers will be connected in Phase 2.
        </p>

        {/* Divider */}
        <div className="w-full h-px bg-[#1f1f1f] mb-8" />

        {/* Footer Bar */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#878787]">
          {/* Status: Green pulsing dot + "নতুন ব্যাচে ভর্তি চলছে" */}
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="font-medium text-[#f5f5f5]/80">নতুন ব্যাচে ভর্তি চলছে</span>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap items-center justify-center gap-5 font-medium">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Copyright & Location */}
          <div className="flex items-center gap-2 font-mono text-[11px] text-[#878787]">
            <LogoMark />
            <span>© 2026 EEE Academy</span>
            <span>·</span>
            <span>Dhaka, BD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
