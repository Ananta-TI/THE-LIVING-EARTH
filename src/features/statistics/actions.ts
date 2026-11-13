"use server";

import { revalidatePath } from "next/cache";
import { verifyAdminAction } from "@/features/auth/dal";
import { statisticSchema, type StatisticFormInput } from "@/features/statistics/schemas";
import { errorResult, successResult, type ActionResult } from "@/lib/utils/action-result";

export async function saveStatisticAction(
  input: StatisticFormInput,
): Promise<ActionResult<{ id: string }>> {
  const auth = await verifyAdminAction();
  if (!auth.ok) {
    return errorResult(auth.error);
  }

  const parsed = statisticSchema.safeParse(input);
  if (!parsed.success) {
    return errorResult(parsed.error.issues[0]?.message ?? "Invalid statistic fields.");
  }

  const {
    id,
    pillar_id,
    reference_id,
    indicator,
    value,
    unit,
    geographic_scope,
    measurement_year,
    publication_date,
    methodology,
    limitations,
    data_type,
    status,
  } = parsed.data;

  const { data: refExists } = await auth.supabase
    .from("references")
    .select("id")
    .eq("id", reference_id)
    .maybeSingle();

  if (!refExists) {
    return errorResult("Selected scientific reference could not be found.");
  }

  if (id) {
    const { error } = await auth.supabase
      .from("statistics")
      .update({
        pillar_id,
        reference_id,
        indicator,
        value,
        unit,
        geographic_scope,
        measurement_year,
        publication_date,
        methodology,
        limitations,
        data_type,
        status,
      })
      .eq("id", id);

    if (error) {
      return errorResult(`Failed to update statistic: ${error.message}`);
    }

    revalidatePath("/admin/statistics");
    revalidatePath(`/admin/statistics/${id}/edit`);
    revalidatePath("/admin");
    return successResult("Statistic updated.", { id });
  }

  const { data: inserted, error } = await auth.supabase
    .from("statistics")
    .insert({
      pillar_id,
      reference_id,
      indicator,
      value,
      unit,
      geographic_scope,
      measurement_year,
      publication_date,
      methodology,
      limitations,
      data_type,
      status,
    })
    .select("id")
    .single();

  if (error || !inserted) {
    return errorResult(`Failed to create statistic: ${error?.message ?? "Unknown error"}`);
  }

  revalidatePath("/admin/statistics");
  revalidatePath("/admin");
  return successResult("Statistic created.", { id: inserted.id });
}

export async function archiveStatisticAction(id: string): Promise<ActionResult> {
  const auth = await verifyAdminAction();
  if (!auth.ok) {
    return errorResult(auth.error);
  }

  const { error } = await auth.supabase
    .from("statistics")
    .update({ status: "archived" })
    .eq("id", id);

  if (error) {
    return errorResult(`Failed to archive statistic: ${error.message}`);
  }

  revalidatePath("/admin/statistics");
  revalidatePath("/admin");
  return successResult("Statistic archived.");
}

export async function deleteStatisticAction(id: string): Promise<ActionResult> {
  const auth = await verifyAdminAction();
  if (!auth.ok) {
    return errorResult(auth.error);
  }

  const { error } = await auth.supabase.from("statistics").delete().eq("id", id);
  if (error) {
    return errorResult(`Failed to delete statistic: ${error.message}`);
  }

  revalidatePath("/admin/statistics");
  revalidatePath("/admin");
  return successResult("Statistic deleted.");
}
