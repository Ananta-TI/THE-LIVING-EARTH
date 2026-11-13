"use server";

import { revalidatePath } from "next/cache";
import { verifyAdminAction } from "@/features/auth/dal";
import { caseStudySchema, type CaseStudyFormInput } from "@/features/case-studies/schemas";
import { errorResult, successResult, type ActionResult } from "@/lib/utils/action-result";

export async function saveCaseStudyAction(
  input: CaseStudyFormInput,
): Promise<ActionResult<{ id: string }>> {
  const auth = await verifyAdminAction();
  if (!auth.ok) {
    return errorResult(auth.error);
  }

  const parsed = caseStudySchema.safeParse(input);
  if (!parsed.success) {
    return errorResult(parsed.error.issues[0]?.message ?? "Invalid case study fields.");
  }

  const {
    id,
    pillar_id,
    title,
    slug,
    summary,
    content,
    country,
    region,
    latitude,
    longitude,
    cover_image_path,
    organization,
    start_date,
    end_date,
    status,
    published_at,
    reference_ids,
  } = parsed.data;

  let slugQuery = auth.supabase.from("case_studies").select("id").eq("slug", slug);
  if (id) {
    slugQuery = slugQuery.neq("id", id);
  }
  const { data: slugConflict } = await slugQuery.maybeSingle();
  if (slugConflict) {
    return errorResult(`The slug "${slug}" is already used by another case study.`);
  }

  let existingPublishedAt: string | null = null;
  if (id) {
    const { data: existing } = await auth.supabase
      .from("case_studies")
      .select("published_at")
      .eq("id", id)
      .maybeSingle();
    existingPublishedAt = existing?.published_at ?? null;
  }

  let resolvedPublishedAt: string | null = published_at
    ? new Date(`${published_at}T00:00:00.000Z`).toISOString()
    : existingPublishedAt;

  if (status === "published" && !resolvedPublishedAt) {
    resolvedPublishedAt = new Date().toISOString();
  }

  let savedId = id;

  if (id) {
    const { error } = await auth.supabase
      .from("case_studies")
      .update({
        pillar_id,
        title,
        slug,
        summary,
        content,
        country,
        region,
        latitude,
        longitude,
        cover_image_path,
        organization,
        start_date,
        end_date,
        status,
        published_at: resolvedPublishedAt,
      })
      .eq("id", id);

    if (error) {
      return errorResult(`Failed to update case study: ${error.message}`);
    }
  } else {
    const { data: inserted, error } = await auth.supabase
      .from("case_studies")
      .insert({
        pillar_id,
        title,
        slug,
        summary,
        content,
        country,
        region,
        latitude,
        longitude,
        cover_image_path,
        organization,
        start_date,
        end_date,
        status,
        published_at: resolvedPublishedAt,
      })
      .select("id")
      .single();

    if (error || !inserted) {
      return errorResult(`Failed to create case study: ${error?.message ?? "Unknown error"}`);
    }
    savedId = inserted.id;
  }

  if (savedId) {
    const uniqueRefs = Array.from(new Set(reference_ids));
    const { error: deleteLinksError } = await auth.supabase
      .from("case_study_references")
      .delete()
      .eq("case_study_id", savedId);

    if (deleteLinksError) {
      return errorResult(
        `Case study saved, but failed to update linked references: ${deleteLinksError.message}`,
      );
    }

    if (uniqueRefs.length > 0) {
      const { error: insertLinksError } = await auth.supabase
        .from("case_study_references")
        .insert(
          uniqueRefs.map((reference_id) => ({
            case_study_id: savedId!,
            reference_id,
          })),
        );

      if (insertLinksError) {
        return errorResult(
          `Case study saved, but failed to attach references: ${insertLinksError.message}`,
        );
      }
    }
  }

  revalidatePath("/admin/case-studies");
  revalidatePath("/admin");
  if (savedId) {
    revalidatePath(`/admin/case-studies/${savedId}/edit`);
  }

  return successResult(id ? "Case study updated." : "Case study created.", { id: savedId! });
}

export async function deleteCaseStudyAction(id: string): Promise<ActionResult> {
  const auth = await verifyAdminAction();
  if (!auth.ok) {
    return errorResult(auth.error);
  }

  const { error } = await auth.supabase.from("case_studies").delete().eq("id", id);
  if (error) {
    return errorResult(`Failed to delete case study: ${error.message}`);
  }

  revalidatePath("/admin/case-studies");
  revalidatePath("/admin");
  return successResult("Case study deleted.");
}
