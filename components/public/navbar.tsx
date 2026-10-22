"use client";

import { LogoMark } from "@/components/ui/logo-mark";
import { PrototypeMark } from "@/components/ui/prototype-mark";
import { cn } from "@/lib/cn";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/#mentors", label: "Mentors" },
  { href: "/#demos", label: "Class Demos" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4 pointer-events-none">
      <nav
        className={cn(
          "pointer-events-auto inline-flex items-center rounded-full backdrop-blur-md border border-white/10 bg-[#141414]/90 px-2 py-1.5 sm:px-2.5 sm:py-2 transition-all duration-300",
          scrolled ? "shadow-xl shadow-black/40 border-white/15" : "shadow-md shadow-black/10",
        )}
        aria-label="Primary"
      >
        <LogoMark />

        {/* Divider (hidden on very small screens) */}
        <div className="hidden sm:block w-px h-5 bg-[#1f1f1f] mx-1 shrink-0" />

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1 sm:gap-1.5">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : link.href === "/courses"
                  ? pathname.startsWith("/courses")
                  : false;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-colors cursor-pointer whitespace-nowrap",
                  active
                    ? "bg-[#1f1f1f]/50 text-[#f5f5f5] font-medium"
                    : "text-[#878787] hover:text-[#f5f5f5] hover:bg-[#1f1f1f]/50",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Prototype label */}
        <div className="mx-2 hidden lg:block">
          <PrototypeMark compact />
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-5 bg-[#1f1f1f] mx-1 shrink-0" />

        {/* Right CTA Button matching demo front */}
        <Link
          href="/courses"
          className="relative group text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 cursor-pointer transition-all shrink-0"
        >
          <span className="absolute -inset-[1.5px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative z-10 flex items-center gap-1 text-[#f5f5f5] group-hover:text-white font-medium bg-[#141414] rounded-full px-3 py-1 -mx-2 -my-0.5">
            <span>ভর্তি সম্পর্কে জানুন</span>
            <span className="text-[11px] opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200">
              ↗
            </span>
          </span>
        </Link>

        {/* Mobile menu trigger */}
        <button
          type="button"
          className="ml-1 flex items-center justify-center w-8 h-8 rounded-full text-[#878787] hover:text-[#f5f5f5] hover:bg-[#1f1f1f] md:hidden cursor-pointer"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label="Toggle navigation menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {open ? (
        <div
          id="mobile-nav"
          className="pointer-events-auto absolute top-20 left-4 right-4 rounded-3xl border border-white/10 bg-[#141414]/95 p-5 shadow-2xl backdrop-blur-xl md:hidden"
        >
          <div className="mb-4 pb-3 border-b border-[#1f1f1f] flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-[#878787]">Menu</span>
            <PrototypeMark compact />
          </div>
          <div className="flex flex-col gap-1.5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-full px-4 py-3 text-sm text-[#878787] hover:bg-[#1f1f1f]/60 hover:text-[#f5f5f5] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/courses"
              onClick={() => setOpen(false)}
              className="mt-3 rounded-full bg-[#f5f5f5] px-4 py-3 text-center text-sm font-medium text-[#0a0a0a] hover:bg-white transition-colors"
            >
              ভর্তি সম্পর্কে জানুন ↗
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
