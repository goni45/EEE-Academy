"use client";

import { AdminGate } from "@/components/admin/gate";
import { AdminNotice } from "@/components/admin/notice";
import { AdminSidebar } from "@/components/admin/sidebar";
import { usePathname } from "next/navigation";

export function AdminChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <AdminGate>
      <div className="flex min-h-dvh flex-col bg-bg md:flex-row">
        <AdminSidebar />
        <div className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <AdminNotice />
          {children}
        </div>
      </div>
    </AdminGate>
  );
}
