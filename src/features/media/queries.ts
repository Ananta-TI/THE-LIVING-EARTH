import "server-only";

import { requireAdmin } from "@/features/auth/dal";
import type { Database } from "@/types/database";

export type MediaAssetRow = Database["public"]["Tables"]["media_assets"]["Row"];

export interface MediaAssetWithUrl extends MediaAssetRow {
  readonly publicUrl: string;
}

export async function getMediaAssets(): Promise<
  | { readonly ok: true; readonly data: readonly MediaAssetWithUrl[] }
  | { readonly ok: false; readonly error: string }
> {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("media_assets")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return {
      ok: false,
      error: `Failed to load media library: ${error.message}`,
    };
  }

  const assets: MediaAssetWithUrl[] = (data ?? []).map((row) => {
    const {
      data: { publicUrl },
    } = supabase.storage.from(row.storage_bucket).getPublicUrl(row.storage_path);
    return {
      ...row,
      publicUrl,
    };
  });

  return { ok: true, data: assets };
}
