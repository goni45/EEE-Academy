"use client";

import { safeGetSession } from "@/lib/safe-storage";
import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore, type ReactNode } from "react";

function subscribe() {
  return () => undefined;
}

function getSnapshot() {
  return safeGetSession("eee-admin-prototype") === "1";
}

function getServerSnapshot() {
  return false;
}

export function AdminGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const allowed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (!allowed) router.replace("/admin/login");
  }, [allowed, router]);

  if (!allowed) {
    return <p className="p-8 text-sm text-muted">Loading prototype…</p>;
  }

  return <>{children}</>;
}
