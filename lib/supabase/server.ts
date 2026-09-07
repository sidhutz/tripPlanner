import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client used by the API routes.
 *
 * Key selection:
 *   1. SUPABASE_SERVICE_ROLE_KEY  — preferred when present (full access, server-only).
 *   2. NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (anon) — fallback.
 *
 * The fallback is safe because every write goes through a `security definer`
 * RPC function. Row Level Security is enabled on all tables with no public
 * policies, so the anon role cannot read or write tables directly — it can
 * only call the two submit_* functions that are explicitly granted to it.
 */
export type SupabaseConfigResult =
  | { ok: true; client: SupabaseClient; usingServiceRole: boolean }
  | { ok: false; reason: string };

export function getSupabaseServerClient(): SupabaseConfigResult {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const key = serviceRoleKey || publishableKey;

  if (!url || !key) {
    return {
      ok: false,
      reason:
        "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or SUPABASE_SERVICE_ROLE_KEY) in .env.local",
    };
  }

  return {
    ok: true,
    usingServiceRole: Boolean(serviceRoleKey),
    client: createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    }),
  };
}
