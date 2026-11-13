"use server";

import { headers } from "next/headers";
import { contactSubmissionSchema } from "@/features/contact/schemas";
import { createClient } from "@/lib/supabase/server";
import { getSupabasePublicEnv } from "@/lib/validations/env";
import { errorResult, successResult, type ActionResult } from "@/lib/utils/action-result";

const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_SUBMISSIONS_PER_WINDOW = 5;
const ipHistory = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (ipHistory.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);

  if (timestamps.length >= MAX_SUBMISSIONS_PER_WINDOW) {
    ipHistory.set(ip, timestamps);
    return true;
  }

  timestamps.push(now);
  if (ipHistory.size > 500) {
    const oldestKey = ipHistory.keys().next().value;
    if (oldestKey) ipHistory.delete(oldestKey);
  }
  ipHistory.set(ip, timestamps);
  return false;
}

export async function submitContactAction(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string;
  renderedAt?: number;
}): Promise<ActionResult> {
  const parsed = contactSubmissionSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return errorResult(
      parsed.error.issues[0]?.message ?? "Please review the highlighted fields.",
      fieldErrors,
    );
  }

  // Honeypot trap: silently succeed to avoid teaching automated bots
  if (parsed.data.website && parsed.data.website.trim().length > 0) {
    return successResult("Your message has been received.");
  }

  // Minimum human interaction dwell check (>= 1.2s)
  if (parsed.data.renderedAt && Date.now() - parsed.data.renderedAt < 1200) {
    return errorResult("Please take a moment to review your message before submitting.");
  }

  const hdrs = await headers();
  const forwarded = hdrs.get("x-forwarded-for");
  const clientIp = forwarded?.split(",")[0]?.trim() || hdrs.get("x-real-ip") || "unknown";

  if (isRateLimited(clientIp)) {
    return errorResult(
      "Too many submissions received recently from your connection. Please wait a few minutes and try again.",
    );
  }

  const env = getSupabasePublicEnv();
  if (!env.configured) {
    return errorResult(
      "The contact service is temporarily unconfigured. Please try again later.",
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_submissions").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject,
    message: parsed.data.message,
    status: "unread",
  });

  if (error) {
    return errorResult(
      "Unable to deliver your message right now. Your text has been preserved—please try again.",
    );
  }

  return successResult(
    "Thank you for reaching out. Your message has been sent to THE LIVING EARTH editorial desk.",
  );
}
