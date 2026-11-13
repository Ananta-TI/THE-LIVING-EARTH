"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, Loader2, Save } from "lucide-react";
import { MarkdownEditor } from "@/components/admin/editor/markdown-editor";
import { FormField } from "@/components/admin/forms/form-field";
import { ImageUpload } from "@/components/admin/forms/image-upload";
import { StatusSelect, type EditorialStatus } from "@/components/admin/forms/status-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { saveArticleAction } from "@/features/articles/actions";
import type { ArticleFormLookups, ArticleRow } from "@/features/articles/queries";
import { slugify } from "@/lib/utils/slug";

interface ArticleFormProps {
  readonly lookups: ArticleFormLookups;
  readonly initialData?: ArticleRow;
  readonly initialReferenceIds?: readonly string[];
}

export function ArticleForm({
  lookups,
  initialData,
  initialReferenceIds = [],
}: ArticleFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initialData));
  const [pillarId, setPillarId] = useState(
    initialData?.pillar_id ?? lookups.pillars[0]?.id ?? "",
  );
  const [topicId, setTopicId] = useState(initialData?.topic_id ?? "none");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [coverImagePath, setCoverImagePath] = useState(initialData?.cover_image_path ?? "");
  const [status, setStatus] = useState<EditorialStatus>(initialData?.status ?? "draft");
  const [featured, setFeatured] = useState(initialData?.featured ?? false);
  const [publishedAt, setPublishedAt] = useState(
    initialData?.published_at ? initialData.published_at.slice(0, 10) : "",
  );
  const [seoTitle, setSeoTitle] = useState(initialData?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(initialData?.seo_description ?? "");
  const [selectedRefIds, setSelectedRefIds] = useState<string[]>([...initialReferenceIds]);

  const availableTopics = useMemo(
    () => lookups.topics.filter((t) => t.pillar_id === pillarId),
    [lookups.topics, pillarId],
  );

  function handlePillarChange(nextPillarId: string) {
    setPillarId(nextPillarId);
    const topicStillValid = lookups.topics.some(
      (t) => t.id === topicId && t.pillar_id === nextPillarId,
    );
    if (!topicStillValid) {
      setTopicId("none");
    }
  }

  function handleTitleChange(nextTitle: string) {
    setTitle(nextTitle);
    if (!slugTouched) {
      setSlug(slugify(nextTitle));
    }
  }

  function toggleReference(refId: string) {
    setSelectedRefIds((prev) =>
      prev.includes(refId) ? prev.filter((id) => id !== refId) : [...prev, refId],
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await saveArticleAction({
        id: initialData?.id,
        pillar_id: pillarId,
        topic_id: topicId === "none" ? null : topicId,
        title,
        slug,
        excerpt,
        content,
        cover_image_path: coverImagePath || null,
        status,
        featured,
        seo_title: seoTitle || null,
        seo_description: seoDescription || null,
        published_at: publishedAt || null,
        reference_ids: selectedRefIds,
      });

      if (!result.ok) {
        setError(result.error ?? "Unable to save article.");
        return;
      }

      router.push("/admin/articles");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error ? (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-xl">Editorial Content</CardTitle>
              <CardDescription>
                Author the story headline, summary excerpt, and Markdown body.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <FormField id="article-title" label="Article Title" required>
                <Input
                  id="article-title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g., How Peatland Restoration Slows Tropical Carbon Release"
                  required
                />
              </FormField>

              <FormField
                id="article-slug"
                label="URL Slug"
                required
                description="Must be unique across all articles (lowercase kebab-case)."
              >
                <Input
                  id="article-slug"
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(e.target.value);
                  }}
                  className="font-mono text-sm"
                  required
                />
              </FormField>

              <FormField
                id="article-excerpt"
                label="Editorial Excerpt"
                required
                description="Concise summary displayed in editorial listings and story headers."
              >
                <Textarea
                  id="article-excerpt"
                  rows={3}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  required
                />
              </FormField>

              <FormField id="article-content" label="Story Body (Markdown)" required>
                <MarkdownEditor
                  id="article-content"
                  value={content}
                  onChange={setContent}
                  disabled={isPending}
                />
              </FormField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-xl">Scientific References</CardTitle>
              <CardDescription>
                Attach verified publications supporting claims made in this article.{" "}
                <Link href="/admin/references/create" className="text-primary hover:underline">
                  Add a new reference
                </Link>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {lookups.references.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No scientific references registered yet.
                </p>
              ) : (
                <div className="max-h-60 space-y-2 overflow-y-auto rounded-lg border border-border p-3">
                  {lookups.references.map((ref) => {
                    const checked = selectedRefIds.includes(ref.id);
                    return (
                      <label
                        key={ref.id}
                        className="flex cursor-pointer items-start gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-muted/50"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleReference(ref.id)}
                          className="mt-1 size-4 accent-primary"
                        />
                        <span className="leading-snug">
                          <span className="font-medium text-foreground">{ref.title}</span>
                          <span className="block text-xs text-muted-foreground">
                            {ref.organization}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-xl">Publishing &amp; Taxonomy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField id="article-status" label="Editorial Status" required>
                <StatusSelect
                  id="article-status"
                  value={status}
                  onValueChange={setStatus}
                  disabled={isPending}
                />
              </FormField>

              <FormField
                id="article-published-at"
                label="Publish Date"
                description="Automatically populated when published if left blank."
              >
                <Input
                  id="article-published-at"
                  type="date"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                />
              </FormField>

              <div className="flex items-center justify-between rounded-lg border border-border px-3.5 py-2.5">
                <div>
                  <p className="text-sm font-medium">Featured Story</p>
                  <p className="text-xs text-muted-foreground">
                    Highlight on editorial showcases.
                  </p>
                </div>
                <Switch checked={featured} onCheckedChange={setFeatured} />
              </div>

              <FormField id="article-pillar" label="Environmental Pillar" required>
                <Select value={pillarId} onValueChange={handlePillarChange}>
                  <SelectTrigger id="article-pillar" className="h-10 w-full">
                    <SelectValue placeholder="Select pillar" />
                  </SelectTrigger>
                  <SelectContent>
                    {lookups.pillars.map((pillar) => (
                      <SelectItem key={pillar.id} value={pillar.id}>
                        {pillar.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField id="article-topic" label="Topic (Optional)">
                <Select value={topicId} onValueChange={setTopicId}>
                  <SelectTrigger id="article-topic" className="h-10 w-full">
                    <SelectValue placeholder="No topic assigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No topic assigned</SelectItem>
                    {availableTopics.map((topic) => (
                      <SelectItem key={topic.id} value={topic.id}>
                        {topic.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-xl">Cover Image</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField id="article-cover" label="Article Cover Asset">
                <ImageUpload
                  id="article-cover"
                  bucket="article-images"
                  value={coverImagePath}
                  onChange={setCoverImagePath}
                  disabled={isPending}
                />
              </FormField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-xl">SEO Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField id="article-seo-title" label="SEO Title" description="Max 160 characters.">
                <Input
                  id="article-seo-title"
                  maxLength={160}
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                />
              </FormField>

              <FormField
                id="article-seo-desc"
                label="SEO Description"
                description="Max 320 characters."
              >
                <Textarea
                  id="article-seo-desc"
                  rows={3}
                  maxLength={320}
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                />
              </FormField>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
        <Button asChild type="button" variant="outline" className="gap-1.5">
          <Link href="/admin/articles">
            <ArrowLeft className="size-4" aria-hidden="true" />
            <span>Back to Articles</span>
          </Link>
        </Button>

        <Button type="submit" disabled={isPending} className="gap-2">
          {isPending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Save className="size-4" aria-hidden="true" />
          )}
          <span>{isPending ? "Saving..." : initialData ? "Update Article" : "Save Article"}</span>
        </Button>
      </div>
    </form>
  );
}
