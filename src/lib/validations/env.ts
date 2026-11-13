import { z } from "zod";

function isLegacyServiceRoleJwt(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 3 || !token.startsWith("eyJ")) {
    return false;
  }

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const json =
      typeof atob === "function"
        ? atob(padded)
        : Buffer.from(padded, "base64").toString("utf8");
    const payload: unknown = JSON.parse(json);
    if (
      typeof payload === "object" &&
      payload !== null &&
      "role" in payload &&
      (payload as { role?: unknown }).role === "service_role"
    ) {
      return true;
    }
  } catch {
    return false;
  }

  return false;
}

function isValidSupabasePublicKeyFormat(token: string): boolean {
  if (/^sb_publishable_[A-Za-z0-9_-]+$/.test(token)) {
    return true;
  }
  return /^eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(token);
}

const supabasePublicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .trim()
    .url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL")
    .refine(
      (val) =>
        val.startsWith("https://") ||
        val.startsWith("http://localhost:") ||
        val.startsWith("http://127.0.0.1:"),
      "NEXT_PUBLIC_SUPABASE_URL must use HTTPS (or localhost for local development)"
    ),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .trim()
    .min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required")
    .refine(
      (val) => !val.startsWith("sb_secret_") && !isLegacyServiceRoleJwt(val),
      "NEXT_PUBLIC_SUPABASE_ANON_KEY must not contain a secret or service-role key"
    )
    .refine(
      isValidSupabasePublicKeyFormat,
      "NEXT_PUBLIC_SUPABASE_ANON_KEY must be a valid Supabase publishable (sb_publishable_...) or anon JWT key"
    ),
});

export type SupabasePublicEnv = z.infer<typeof supabasePublicEnvSchema>;

export type SupabaseEnvResult =
  | {
      readonly configured: true;
      readonly url: string;
      readonly anonKey: string;
    }
  | {
      readonly configured: false;
      readonly missing: readonly string[];
      readonly issues: readonly string[];
    };

/**
 * Validates public Supabase environment variables without throwing during
 * unconfigured local builds or static prerendering. Rejects secret/service-role
 * keys and malformed key prefixes without logging credential values.
 */
export function getSupabasePublicEnv(): SupabaseEnvResult {
  const raw = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  };

  const parsed = supabasePublicEnvSchema.safeParse(raw);

  if (parsed.success) {
    return {
      configured: true,
      url: parsed.data.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: parsed.data.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    };
  }

  const missing: string[] = [];
  if (!raw.NEXT_PUBLIC_SUPABASE_URL.trim()) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL");
  }
  if (!raw.NEXT_PUBLIC_SUPABASE_ANON_KEY.trim()) {
    missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return {
    configured: false,
    missing,
    issues: parsed.error.issues.map((issue) => issue.message),
  };
}

export function isSupabaseConfigured(): boolean {
  return getSupabasePublicEnv().configured;
}

export function requireSupabasePublicEnv(): { url: string; anonKey: string } {
  const result = getSupabasePublicEnv();
  if (!result.configured) {
    throw new Error(
      `Supabase is not configured securely. ${
        result.missing.length > 0
          ? `Missing: ${result.missing.join(", ")}.`
          : `Issues: ${result.issues.join("; ")}.`
      } Copy .env.example to .env.local and provide a valid Supabase publishable/anon key.`
    );
  }
  return { url: result.url, anonKey: result.anonKey };
}
