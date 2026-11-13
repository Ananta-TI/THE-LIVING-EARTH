"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSupabasePublicEnv } from "@/lib/validations/env";
import { loginSchema } from "@/features/auth/schemas";

export interface AuthActionState {
  readonly error?: string;
}

function sanitizeNextPath(rawNext: string | undefined): string {
  if (!rawNext || !rawNext.startsWith("/admin") || rawNext.startsWith("/admin/login")) {
    return "/admin";
  }
  if (rawNext.includes("//") || rawNext.includes("\\")) {
    return "/admin";
  }
  return rawNext;
}

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const env = getSupabasePublicEnv();
  if (!env.configured) {
    return {
      error:
        "Supabase public environment variables are not validly configured yet. Please check your configuration.",
    };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next")?.toString(),
  });

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return {
      error: firstIssue?.message ?? "Please provide valid sign-in credentials.",
    };
  }

  const supabase = await createClient();
  const { data, error: signInError } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (signInError || !data.user) {
    return {
      error: "Invalid email or password, or your account cannot be verified.",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", data.user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (profileError || !profile) {
    await supabase.auth.signOut();
    return {
      error: "Your account does not have administrator access to THE LIVING EARTH CMS.",
    };
  }

  redirect(sanitizeNextPath(parsed.data.next));
}

export async function logoutAction(): Promise<void> {
  const env = getSupabasePublicEnv();
  if (env.configured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login?signedOut=1");
}
