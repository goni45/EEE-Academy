"use client";

import { LogoMark } from "@/components/ui/logo-mark";
import { cn } from "@/lib/cn";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/courses", label: "Courses" },
  { href: "/admin/teachers", label: "Teachers" },
  { href: "/admin/demos", label: "Demos" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="border-b border-stroke bg-surface md:min-h-dvh md:w-60 md:border-b-0 md:border-r">
      <div className="flex items-center gap-3 px-4 py-5">
        <LogoMark />
        <div>
          <p className="text-sm text-text-primary">EEE Academy</p>
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted">Admin preview</p>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible">
        {links.map((link) => {
          const active =
            link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "whitespace-nowrap rounded-full px-3 py-2 text-sm",
                active ? "bg-stroke/50 text-text-primary" : "text-muted hover:text-text-primary",
              )}
            >
              {link.label}
            </Link>
          );
        })}
        <button
          type="button"
          className="rounded-full px-3 py-2 text-left text-sm text-muted hover:text-text-primary"
          onClick={() => {
            sessionStorage.removeItem("eee-admin-prototype");
            router.push("/admin/login");
          }}
        >
          Sign out
        </button>
      </nav>
    </aside>
  );
}
