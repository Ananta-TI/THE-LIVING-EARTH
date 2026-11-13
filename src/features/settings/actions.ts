"use server";

import { revalidatePath } from "next/cache";
import { verifyAdminAction } from "@/features/auth/dal";
import {
  allSiteSettingsSchema,
  type SiteSettingsBundle,
} from "@/features/settings/schemas";
import { errorResult, successResult, type ActionResult } from "@/lib/utils/action-result";
import type { Json } from "@/types/database";

const SETTING_DESCRIPTIONS: Record<keyof SiteSettingsBundle, string> = {
  general: "Platform name, editorial tagline, public overview, and contact email.",
  social_media: "Official public social media profile URLs.",
  seo_defaults: "Default metadata title, description, and OpenGraph image asset.",
  footer: "Footer mission summary, verification statement, and copyright line.",
};

export async function saveSiteSettingsAction(
  input: SiteSettingsBundle,
): Promise<ActionResult> {
  const auth = await verifyAdminAction();
  if (!auth.ok) {
    return errorResult(auth.error);
  }

  const parsed = allSiteSettingsSchema.safeParse(input);
  if (!parsed.success) {
    return errorResult(parsed.error.issues[0]?.message ?? "Invalid website settings.");
  }

  const entries = (Object.keys(parsed.data) as (keyof SiteSettingsBundle)[]).map((key) => ({
    setting_key: key,
    setting_value: parsed.data[key] as unknown as Json,
    description: SETTING_DESCRIPTIONS[key],
    updated_by: auth.user.id,
  }));

  const { error } = await auth.supabase
    .from("site_settings")
    .upsert(entries, { onConflict: "setting_key" });

  if (error) {
    return errorResult(`Failed to save website settings: ${error.message}`);
  }

  revalidatePath("/admin/settings");
  return successResult("Website settings saved cleanly.");
}
