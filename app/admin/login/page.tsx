"use client";

import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/ui/logo-mark";
import { createClient } from "@/lib/supabase/client";
import { safeSetSession } from "@/lib/safe-storage";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSupabaseLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMsg(
          "লগইন ব্যর্থ হয়েছে: " +
            (error.message === "Invalid login credentials"
              ? "ভুল ইমেইল অথবা পাসওয়ার্ড।"
              : error.message)
        );
        setLoading(false);
        return;
      }

      if (data?.user) {
        // Verify role in admin_users
        const { data: adminUser, error: adminErr } = await supabase
          .from("admin_users")
          .select("role, is_active")
          .eq("user_id", data.user.id)
          .maybeSingle();

        if (adminErr || !adminUser || !adminUser.is_active) {
          setErrorMsg(
            "আপনার অ্যাকাউন্টটি সক্রিয় অ্যাডমিন হিসেবে অনুমোদিত নয়। সুপার অ্যাডমিনের সাথে যোগাযোগ করুন।"
          );
          setLoading(false);
          return;
        }

        safeSetSession("eee-admin-prototype", "1");
        router.push("/admin");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "সংযোগ করতে সমস্যা হয়েছে";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  }

  function handleDemoBypass() {
    safeSetSession("eee-admin-prototype", "1");
    router.push("/admin");
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-bg px-6">
      <div className="w-full max-w-md rounded-3xl border border-stroke bg-surface p-8 shadow-2xl">
        <LogoMark />
        <div className="mt-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-stroke/80 bg-bg px-3 py-1 text-[11px] font-medium tracking-wide text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            Supabase Auth & Admin
          </span>
        </div>
        <h1 className="mt-2 text-3xl font-display italic text-text-primary">Admin portal</h1>
        <p className="mt-2 text-xs leading-relaxed text-muted">
          Supabase এর নিবন্ধিত ইমেইল ও পাসওয়ার্ড দিয়ে অ্যাডমিন ড্যাশবোর্ডে প্রবেশ করুন।
        </p>

        {errorMsg ? (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
            {errorMsg}
          </div>
        ) : null}

        <form className="mt-6 space-y-4" onSubmit={handleSupabaseLogin}>
          <label className="block text-sm text-text-primary">
            ইমেইল
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@eeeacademy.edu.bd"
              className="mt-1 w-full rounded-2xl border border-stroke bg-bg px-4 py-2.5 text-sm focus:border-[#89AACC] focus:outline-none"
            />
          </label>
          <label className="block text-sm text-text-primary">
            পাসওয়ার্ড
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full rounded-2xl border border-stroke bg-bg px-4 py-2.5 text-sm focus:border-[#89AACC] focus:outline-none"
            />
          </label>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "ভেরিফাই করা হচ্ছে…" : "অ্যাডমিন লগইন"}
          </Button>
        </form>

        <div className="relative my-6 text-center text-xs text-muted">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stroke/60"></div>
          </div>
          <span className="relative bg-surface px-3 text-[11px] uppercase tracking-wider text-muted">অথবা</span>
        </div>

        <button
          type="button"
          onClick={handleDemoBypass}
          className="w-full rounded-2xl border border-stroke bg-bg/50 px-4 py-2.5 text-xs text-muted transition hover:border-[#89AACC] hover:text-text-primary"
        >
          ডেমো মোডে প্রবেশ করুন (Local Preview)
        </button>
      </div>
    </main>
  );
}
