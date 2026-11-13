"use server";

import { revalidatePath } from "next/cache";
import { verifyAdminAction } from "@/features/auth/dal";
import { topicSchema, type TopicFormInput } from "@/features/topics/schemas";
import { errorResult, successResult, type ActionResult } from "@/lib/utils/action-result";

export async function saveTopicAction(input: TopicFormInput): Promise<ActionResult> {
  const auth = await verifyAdminAction();
  if (!auth.ok) {
    return errorResult(auth.error);
  }

  const parsed = topicSchema.safeParse(input);
  if (!parsed.success) {
    return errorResult(parsed.error.issues[0]?.message ?? "Invalid topic fields.");
  }

  const { id, pillar_id, name, slug, description, display_order, is_active } = parsed.data;

  let conflictQuery = auth.supabase
    .from("topics")
    .select("id")
    .eq("pillar_id", pillar_id)
    .eq("slug", slug);

  if (id) {
    conflictQuery = conflictQuery.neq("id", id);
  }

  const { data: conflict } = await conflictQuery.maybeSingle();
  if (conflict) {
    return errorResult(
      `Slug "${slug}" already exists under the selected pillar. Choose a different slug.`,
    );
  }

  if (id) {
    const { data: linkedArticles } = await auth.supabase
      .from("articles")
      .select("id, pillar_id")
      .eq("topic_id", id)
      .neq("pillar_id", pillar_id)
      .limit(1);

    if (linkedArticles && linkedArticles.length > 0) {
      return errorResult(
        "Cannot move this topic to another pillar because articles under the previous pillar still reference it.",
      );
    }

    const { error } = await auth.supabase
      .from("topics")
      .update({
        pillar_id,
        name,
        slug,
        description,
        display_order,
        is_active,
      })
      .eq("id", id);

    if (error) {
      return errorResult(`Failed to update topic: ${error.message}`);
    }

    revalidatePath("/admin/topics");
    revalidatePath("/admin/pillars");
    return successResult("Topic updated.");
  }

  const { error } = await auth.supabase.from("topics").insert({
    pillar_id,
    name,
    slug,
    description,
    display_order,
    is_active,
  });

  if (error) {
    return errorResult(`Failed to create topic: ${error.message}`);
  }

  revalidatePath("/admin/topics");
  revalidatePath("/admin/pillars");
  return successResult("Topic created.");
}

export async function toggleTopicActiveAction(
  id: string,
  isActive: boolean,
): Promise<ActionResult> {
  const auth = await verifyAdminAction();
  if (!auth.ok) {
    return errorResult(auth.error);
  }

  const { error } = await auth.supabase
    .from("topics")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) {
    return errorResult(`Failed to update topic status: ${error.message}`);
  }

  revalidatePath("/admin/topics");
  return successResult(`Topic marked as ${isActive ? "active" : "inactive"}.`);
}

export async function deleteTopicAction(id: string): Promise<ActionResult> {
  const auth = await verifyAdminAction();
  if (!auth.ok) {
    return errorResult(auth.error);
  }

  const { count } = await auth.supabase
    .from("articles")
    .select("*", { count: "exact", head: true })
    .eq("topic_id", id);

  if ((count ?? 0) > 0) {
    return errorResult(
      `Cannot delete this topic because ${count} article(s) reference it. Reassign or remove those references first.`,
    );
  }

  const { error } = await auth.supabase.from("topics").delete().eq("id", id);
  if (error) {
    return errorResult(`Failed to delete topic: ${error.message}`);
  }

  revalidatePath("/admin/topics");
  revalidatePath("/admin/pillars");
  return successResult("Topic deleted.");
}
