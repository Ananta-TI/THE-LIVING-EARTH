import "server-only";

import { requireAdmin } from "@/features/auth/dal";
import {
  allSiteSettingsSchema,
  DEFAULT_SITE_SETTINGS,
  type SiteSettingsBundle,
} from "@/features/settings/schemas";

export async function getSiteSettingsBundle(): Promise<
  | { readonly ok: true; readonly data: SiteSettingsBundle }
  | { readonly ok: false; readonly error: string }
> {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("site_settings")
    .select("setting_key, setting_value");

  if (error) {
    return {
      ok: false,
      error: `Failed to load website settings: ${error.message}`,
    };
  }

  const byKey = new Map<string, unknown>();
  for (const row of data ?? []) {
    byKey.set(row.setting_key, row.setting_value);
  }

  const mergedCandidate = {
    general: {
      ...DEFAULT_SITE_SETTINGS.general,
      ...(typeof byKey.get("general") === "object" && byKey.get("general") !== null
        ? (byKey.get("general") as Record<string, unknown>)
        : {}),
    },
    social_media: {
      ...DEFAULT_SITE_SETTINGS.social_media,
      ...(typeof byKey.get("social_media") === "object" && byKey.get("social_media") !== null
        ? (byKey.get("social_media") as Record<string, unknown>)
        : {}),
    },
    seo_defaults: {
      ...DEFAULT_SITE_SETTINGS.seo_defaults,
      ...(typeof byKey.get("seo_defaults") === "object" && byKey.get("seo_defaults") !== null
        ? (byKey.get("seo_defaults") as Record<string, unknown>)
        : {}),
    },
    footer: {
      ...DEFAULT_SITE_SETTINGS.footer,
      ...(typeof byKey.get("footer") === "object" && byKey.get("footer") !== null
        ? (byKey.get("footer") as Record<string, unknown>)
        : {}),
    },
  };

  const parsed = allSiteSettingsSchema.safeParse(mergedCandidate);
  return {
    ok: true,
    data: parsed.success ? parsed.data : DEFAULT_SITE_SETTINGS,
  };
}
