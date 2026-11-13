"use server";

import { revalidatePath } from "next/cache";
import { verifyAdminAction } from "@/features/auth/dal";
import { referenceSchema, type ReferenceFormInput } from "@/features/references/schemas";
import { errorResult, successResult, type ActionResult } from "@/lib/utils/action-result";

export async function saveReferenceAction(
  input: ReferenceFormInput,
): Promise<ActionResult<{ id: string }>> {
  const auth = await verifyAdminAction();
  if (!auth.ok) {
    return errorResult(auth.error);
  }

  const parsed = referenceSchema.safeParse(input);
  if (!parsed.success) {
    return errorResult(parsed.error.issues[0]?.message ?? "Invalid reference fields.");
  }

  const {
    id,
    title,
    organization,
    source_type,
    author,
    publication_date,
    source_url,
    accessed_at,
    notes,
  } = parsed.data;

  let dupQuery = auth.supabase
    .from("references")
    .select("id")
    .eq("title", title)
    .eq("source_url", source_url);

  if (id) {
    dupQuery = dupQuery.neq("id", id);
  }

  const { data: duplicate } = await dupQuery.maybeSingle();
  if (duplicate) {
    return errorResult(
      "A reference with this exact title and source URL already exists.",
    );
  }

  const normalizedAccessedAt = accessed_at
    ? new Date(`${accessed_at}T00:00:00.000Z`).toISOString()
    : new Date().toISOString();

  if (id) {
    const { error } = await auth.supabase
      .from("references")
      .update({
        title,
        organization,
        source_type,
        author,
        publication_date,
        source_url,
        accessed_at: normalizedAccessedAt,
        notes,
      })
      .eq("id", id);

    if (error) {
      return errorResult(`Failed to update reference: ${error.message}`);
    }

    revalidatePath("/admin/references");
    revalidatePath(`/admin/references/${id}/edit`);
    return successResult("Scientific reference updated.", { id });
  }

  const { data: inserted, error } = await auth.supabase
    .from("references")
    .insert({
      title,
      organization,
      source_type,
      author,
      publication_date,
      source_url,
      accessed_at: normalizedAccessedAt,
      notes,
    })
    .select("id")
    .single();

  if (error || !inserted) {
    return errorResult(`Failed to create reference: ${error?.message ?? "Unknown error"}`);
  }

  revalidatePath("/admin/references");
  revalidatePath("/admin");
  return successResult("Scientific reference created.", { id: inserted.id });
}

export async function deleteReferenceAction(id: string): Promise<ActionResult> {
  const auth = await verifyAdminAction();
  if (!auth.ok) {
    return errorResult(auth.error);
  }

  const [artRes, csRes, statRes] = await Promise.all([
    auth.supabase
      .from("article_references")
      .select("*", { count: "exact", head: true })
      .eq("reference_id", id),
    auth.supabase
      .from("case_study_references")
      .select("*", { count: "exact", head: true })
      .eq("reference_id", id),
    auth.supabase
      .from("statistics")
      .select("*", { count: "exact", head: true })
      .eq("reference_id", id),
  ]);

  const totalRefs = (artRes.count ?? 0) + (csRes.count ?? 0) + (statRes.count ?? 0);
  if (totalRefs > 0) {
    return errorResult(
      `Cannot delete this reference because it is currently cited by ${artRes.count ?? 0} article(s), ${csRes.count ?? 0} case study(ies), and ${statRes.count ?? 0} statistic(s).`,
    );
  }

  const { error } = await auth.supabase.from("references").delete().eq("id", id);
  if (error) {
    return errorResult(`Failed to delete reference: ${error.message}`);
  }

  revalidatePath("/admin/references");
  revalidatePath("/admin");
  return successResult("Reference deleted.");
}
