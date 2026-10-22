import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://nvbbijdrnkvnroschvbb.supabase.co";
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52YmJpamRybmt2bnJvc2NodmJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1OTQ5ODcsImV4cCI6MjEwODE3MDk4N30.DiVvs_BrbU67-Zv4PsW9o2EsVXU3WkoNZiz2W94J0ro";

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
