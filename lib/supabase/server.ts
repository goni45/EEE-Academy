import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://nvbbijdrnkvnroschvbb.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52YmJpamRybmt2bnJvc2NodmJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1OTQ5ODcsImV4cCI6MjEwODE3MDk4N30.DiVvs_BrbU67-Zv4PsW9o2EsVXU3WkoNZiz2W94J0ro";

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // If called from a Server Component, this might fail, which is safe to ignore
          // if handled in middleware or route handlers.
        }
      },
    },
  });
}
