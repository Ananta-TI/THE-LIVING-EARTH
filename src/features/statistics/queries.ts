import "server-only";

import { requireAdmin } from "@/features/auth/dal";
import type { Database } from "@/types/database";

export type StatisticRow = Database["public"]["Tables"]["statistics"]["Row"];

export interface StatisticListItem extends StatisticRow {
  readonly pillarName: string;
  readonly referenceTitle: string;
  readonly referenceOrganization: string;
}

export interface StatisticFormLookups {
  readonly pillars: readonly { id: string; name: string }[];
  readonly references: readonly { id: string; title: string; organization: string }[];
}

export async function getStatisticLookups(): Promise<
  | { readonly ok: true; readonly data: StatisticFormLookups }
  | { readonly ok: false; readonly error: string }
> {
  const { supabase } = await requireAdmin();
  const [pillarsRes, refsRes] = await Promise.all([
    supabase.from("pillars").select("id, name").order("display_order", { ascending: true }),
    supabase.from("references").select("id, title, organization").order("title", { ascending: true }),
  ]);

  const firstError = pillarsRes.error ?? refsRes.error;
  if (firstError) {
    return { ok: false, error: `Failed to load lookups: ${firstError.message}` };
  }

  return {
    ok: true,
    data: {
      pillars: pillarsRes.data ?? [],
      references: refsRes.data ?? [],
    },
  };
}

export async function getStatisticsList(): Promise<
  | {
      readonly ok: true;
      readonly data: {
        readonly items: readonly StatisticListItem[];
        readonly pillars: readonly { id: string; name: string }[];
      };
    }
  | { readonly ok: false; readonly error: string }
> {
  const { supabase } = await requireAdmin();
  const [statsRes, pillarsRes] = await Promise.all([
    supabase
      .from("statistics")
      .select("*, pillars(name), references(title, organization)")
      .order("measurement_year", { ascending: false })
      .order("updated_at", { ascending: false }),
    supabase.from("pillars").select("id, name").order("display_order", { ascending: true }),
  ]);

  const firstError = statsRes.error ?? pillarsRes.error;
  if (firstError) {
    return { ok: false, error: `Failed to load statistics: ${firstError.message}` };
  }

  const items: StatisticListItem[] = (statsRes.data ?? []).map((row) => {
    const pillarObj = row.pillars as { name?: string } | null;
    const refObj = row.references as { title?: string; organization?: string } | null;
    return {
      ...row,
      pillarName: pillarObj?.name ?? "Unassigned",
      referenceTitle: refObj?.title ?? "Missing reference",
      referenceOrganization: refObj?.organization ?? "",
    };
  });

  return {
    ok: true,
    data: {
      items,
      pillars: pillarsRes.data ?? [],
    },
  };
}

export async function getStatisticForEdit(id: string): Promise<
  | {
      readonly ok: true;
      readonly data: {
        readonly statistic: StatisticRow;
        readonly lookups: StatisticFormLookups;
      };
    }
  | { readonly ok: false; readonly error: string }
> {
  const { supabase } = await requireAdmin();
  const [statRes, lookupsRes] = await Promise.all([
    supabase.from("statistics").select("*").eq("id", id).maybeSingle(),
    getStatisticLookups(),
  ]);

  if (statRes.error) {
    return { ok: false, error: `Failed to load statistic: ${statRes.error.message}` };
  }
  if (!statRes.data) {
    return { ok: false, error: "Statistic record not found." };
  }
  if (!lookupsRes.ok) {
    return lookupsRes;
  }

  return {
    ok: true,
    data: {
      statistic: statRes.data,
      lookups: lookupsRes.data,
    },
  };
}
