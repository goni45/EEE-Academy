"use client";

import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/ui/logo-mark";
import { PrototypeMark } from "@/components/ui/prototype-mark";
import { safeSetSession } from "@/lib/safe-storage";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main className="flex min-h-dvh items-center justify-center bg-bg px-6">
      <div className="w-full max-w-md rounded-3xl border border-stroke bg-surface p-8">
        <LogoMark />
        <p className="mt-6">
          <PrototypeMark />
        </p>
        <h1 className="mt-2 text-3xl text-text-primary">Admin login</h1>
        <p className="mt-2 text-sm text-muted">
          This screen does not verify credentials. It only demonstrates the interface.
        </p>
        <form
          className="mt-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            safeSetSession("eee-admin-prototype", "1");
            router.push("/admin");
          }}
        >
          <label className="block text-sm">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-full border border-stroke bg-bg px-4 py-3"
            />
          </label>
          <label className="block text-sm">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-full border border-stroke bg-bg px-4 py-3"
            />
          </label>
          <Button type="submit" className="w-full">
            Continue to dashboard (prototype)
          </Button>
        </form>
      </div>
    </main>
  );
}
