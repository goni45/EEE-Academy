"use client";

import { LogoMark } from "@/components/ui/logo-mark";
import { PrototypeMark } from "@/components/ui/prototype-mark";
import { cn } from "@/lib/cn";
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
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4">
      <nav
        className={cn(
          "inline-flex max-w-full items-center rounded-full border border-white/10 bg-surface/90 px-2 py-2 backdrop-blur-md",
          scrolled && "shadow-[0_12px_40px_rgba(0,0,0,0.45)]",
        )}
        aria-label="Primary"
      >
        <LogoMark />
        <div className="mx-2 hidden items-center md:flex">
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
                  "rounded-full px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm transition-colors",
                  active
                    ? "bg-stroke/50 text-text-primary"
                    : "text-muted hover:bg-stroke/50 hover:text-text-primary",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
        <div className="mx-2 hidden lg:block">
          <PrototypeMark compact />
        </div>
        <Link
          href="/courses"
          className="ml-1 hidden rounded-full bg-surface px-4 py-2 text-xs text-text-primary accent-gradient-border sm:inline-flex sm:text-sm"
        >
          ভর্তি সম্পর্কে জানুন ↗
        </Link>
        <button
          type="button"
          className="ml-1 rounded-full px-3 py-2 text-xs text-muted md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          Menu
        </button>
      </nav>
      {open ? (
        <div
          id="mobile-nav"
          className="absolute top-20 left-4 right-4 rounded-3xl border border-white/10 bg-surface/95 p-4 backdrop-blur-md md:hidden"
        >
          <div className="mb-3">
            <PrototypeMark compact />
          </div>
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-full px-4 py-3 text-sm text-muted hover:bg-stroke/50 hover:text-text-primary"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/courses"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-text-primary px-4 py-3 text-center text-sm text-bg"
            >
              ভর্তি সম্পর্কে জানুন ↗
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
