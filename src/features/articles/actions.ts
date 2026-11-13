"use server";

import { revalidatePath } from "next/cache";
import { verifyAdminAction } from "@/features/auth/dal";
import { articleSchema, type ArticleFormInput } from "@/features/articles/schemas";
import { errorResult, successResult, type ActionResult } from "@/lib/utils/action-result";

export async function saveArticleAction(
  input: ArticleFormInput,
): Promise<ActionResult<{ id: string }>> {
  const auth = await verifyAdminAction();
  if (!auth.ok) {
    return errorResult(auth.error);
  }

  const parsed = articleSchema.safeParse(input);
  if (!parsed.success) {
    return errorResult(parsed.error.issues[0]?.message ?? "Invalid article fields.");
  }

  const {
    id,
    pillar_id,
    topic_id,
    title,
    slug,
    excerpt,
    content,
    cover_image_path,
    status,
    featured,
    seo_title,
    seo_description,
    published_at,
    reference_ids,
  } = parsed.data;

  if (topic_id) {
    const { data: topicCheck } = await auth.supabase
      .from("topics")
      .select("id, pillar_id")
      .eq("id", topic_id)
      .maybeSingle();

    if (!topicCheck || topicCheck.pillar_id !== pillar_id) {
      return errorResult("Selected topic does not belong to the selected environmental pillar.");
    }
  }

  let slugQuery = auth.supabase.from("articles").select("id").eq("slug", slug);
  if (id) {
    slugQuery = slugQuery.neq("id", id);
  }
  const { data: slugConflict } = await slugQuery.maybeSingle();
  if (slugConflict) {
    return errorResult(`The slug "${slug}" is already used by another article.`);
  }

  let existingPublishedAt: string | null = null;
  if (id) {
    const { data: existing } = await auth.supabase
      .from("articles")
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
      .from("articles")
      .update({
        pillar_id,
        topic_id,
        title,
        slug,
        excerpt,
        content,
        cover_image_path,
        status,
        featured,
        seo_title,
        seo_description,
        published_at: resolvedPublishedAt,
      })
      .eq("id", id);

    if (error) {
      return errorResult(`Failed to update article: ${error.message}`);
    }
  } else {
    const { data: inserted, error } = await auth.supabase
      .from("articles")
      .insert({
        pillar_id,
        topic_id,
        title,
        slug,
        excerpt,
        content,
        cover_image_path,
        author_id: auth.user.id,
        status,
        featured,
        seo_title,
        seo_description,
        published_at: resolvedPublishedAt,
      })
      .select("id")
      .single();

    if (error || !inserted) {
      return errorResult(`Failed to create article: ${error?.message ?? "Unknown error"}`);
    }
    savedId = inserted.id;
  }

  if (savedId) {
    const uniqueRefs = Array.from(new Set(reference_ids));
    const { error: deleteLinksError } = await auth.supabase
      .from("article_references")
      .delete()
      .eq("article_id", savedId);

    if (deleteLinksError) {
      return errorResult(
        `Article saved, but failed to update linked references: ${deleteLinksError.message}`,
      );
    }

    if (uniqueRefs.length > 0) {
      const { error: insertLinksError } = await auth.supabase
        .from("article_references")
        .insert(
          uniqueRefs.map((reference_id) => ({
            article_id: savedId!,
            reference_id,
          })),
        );

      if (insertLinksError) {
        return errorResult(
          `Article saved, but failed to attach selected references: ${insertLinksError.message}`,
        );
      }
    }
  }

  revalidatePath("/admin/articles");
  revalidatePath("/admin");
  if (savedId) {
    revalidatePath(`/admin/articles/${savedId}/edit`);
  }

  return successResult(id ? "Article updated." : "Article created.", {
    id: savedId!,
  });
}

export async function toggleArticleFeaturedAction(
  id: string,
  featured: boolean,
): Promise<ActionResult> {
  const auth = await verifyAdminAction();
  if (!auth.ok) {
    return errorResult(auth.error);
  }

  const { error } = await auth.supabase
    .from("articles")
    .update({ featured })
    .eq("id", id);

  if (error) {
    return errorResult(`Failed to update featured flag: ${error.message}`);
  }

  revalidatePath("/admin/articles");
  return successResult(featured ? "Article marked as featured." : "Article removed from featured.");
}

export async function deleteArticleAction(id: string): Promise<ActionResult> {
  const auth = await verifyAdminAction();
  if (!auth.ok) {
    return errorResult(auth.error);
  }

  const { error } = await auth.supabase.from("articles").delete().eq("id", id);
  if (error) {
    return errorResult(`Failed to delete article: ${error.message}`);
  }

  revalidatePath("/admin/articles");
  revalidatePath("/admin");
  return successResult("Article deleted. Linked scientific references remain intact.");
}
