"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { verifyAdminAction } from "@/features/auth/dal";
import { errorResult, successResult, type ActionResult } from "@/lib/utils/action-result";

const updateAltSchema = z.object({
  id: z.string().uuid("Invalid media asset ID."),
  alt_text: z
    .string()
    .trim()
    .max(300, "Alt text must be 300 characters or fewer.")
    .transform((v) => (v.length > 0 ? v : null)),
});

export async function updateMediaAltTextAction(input: {
  id: string;
  alt_text: string;
}): Promise<ActionResult> {
  const auth = await verifyAdminAction();
  if (!auth.ok) {
    return errorResult(auth.error);
  }

  const parsed = updateAltSchema.safeParse(input);
  if (!parsed.success) {
    return errorResult(parsed.error.issues[0]?.message ?? "Invalid alt text.");
  }

  const { error } = await auth.supabase
    .from("media_assets")
    .update({ alt_text: parsed.data.alt_text })
    .eq("id", parsed.data.id);

  if (error) {
    return errorResult(`Failed to update alt text: ${error.message}`);
  }

  revalidatePath("/admin/media");
  return successResult("Alt text updated.");
}

export async function deleteMediaAssetAction(id: string): Promise<ActionResult> {
  const auth = await verifyAdminAction();
  if (!auth.ok) {
    return errorResult(auth.error);
  }

  const { data: asset, error: fetchError } = await auth.supabase
    .from("media_assets")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !asset) {
    return errorResult("Media asset could not be found.");
  }

  const {
    data: { publicUrl },
  } = auth.supabase.storage.from(asset.storage_bucket).getPublicUrl(asset.storage_path);

  const [pillarsRes, articlesRes, csRes, settingsRes] = await Promise.all([
    auth.supabase.from("pillars").select("id, cover_image_path"),
    auth.supabase.from("articles").select("id, cover_image_path"),
    auth.supabase.from("case_studies").select("id, cover_image_path"),
    auth.supabase.from("site_settings").select("setting_key, setting_value"),
  ]);

  const matchesAsset = (candidate: string | null | undefined) => {
    if (!candidate) return false;
    return candidate.includes(asset.storage_path) || candidate === publicUrl;
  };

  const usedInPillars = (pillarsRes.data ?? []).some((r) => matchesAsset(r.cover_image_path));
  const usedInArticles = (articlesRes.data ?? []).some((r) => matchesAsset(r.cover_image_path));
  const usedInCaseStudies = (csRes.data ?? []).some((r) => matchesAsset(r.cover_image_path));
  const usedInSettings = (settingsRes.data ?? []).some((r) =>
    JSON.stringify(r.setting_value).includes(asset.storage_path),
  );

  if (usedInPillars || usedInArticles || usedInCaseStudies || usedInSettings) {
    return errorResult(
      "Cannot delete this media asset because it is still referenced by active pillars, articles, case studies, or site settings.",
    );
  }

  const { error: storageError } = await auth.supabase.storage
    .from(asset.storage_bucket)
    .remove([asset.storage_path]);

  if (storageError) {
    return errorResult(`Failed to remove object from storage: ${storageError.message}`);
  }

  const { error: dbDeleteError } = await auth.supabase
    .from("media_assets")
    .delete()
    .eq("id", id);

  if (dbDeleteError) {
    return errorResult(`Storage object removed, but metadata delete failed: ${dbDeleteError.message}`);
  }

  revalidatePath("/admin/media");
  revalidatePath("/admin");
  return successResult("Media asset deleted.");
}
