"use client";

import { useState, useTransition } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { saveCaseStudyAction } from "@/features/case-studies/actions";
import type { CaseStudyFormLookups, CaseStudyRow } from "@/features/case-studies/queries";
import { slugify } from "@/lib/utils/slug";

interface CaseStudyFormProps {
  readonly lookups: CaseStudyFormLookups;
  readonly initialData?: CaseStudyRow;
  readonly initialReferenceIds?: readonly string[];
}

export function CaseStudyForm({
  lookups,
  initialData,
  initialReferenceIds = [],
}: CaseStudyFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initialData));
  const [pillarId, setPillarId] = useState(
    initialData?.pillar_id ?? lookups.pillars[0]?.id ?? "",
  );
  const [summary, setSummary] = useState(initialData?.summary ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [country, setCountry] = useState(initialData?.country ?? "");
  const [region, setRegion] = useState(initialData?.region ?? "");
  const [latitude, setLatitude] = useState(
    initialData?.latitude !== null && initialData?.latitude !== undefined
      ? String(initialData.latitude)
      : "",
  );
  const [longitude, setLongitude] = useState(
    initialData?.longitude !== null && initialData?.longitude !== undefined
      ? String(initialData.longitude)
      : "",
  );
  const [organization, setOrganization] = useState(initialData?.organization ?? "");
  const [startDate, setStartDate] = useState(initialData?.start_date ?? "");
  const [endDate, setEndDate] = useState(initialData?.end_date ?? "");
  const [coverImagePath, setCoverImagePath] = useState(initialData?.cover_image_path ?? "");
  const [status, setStatus] = useState<EditorialStatus>(initialData?.status ?? "draft");
  const [publishedAt, setPublishedAt] = useState(
    initialData?.published_at ? initialData.published_at.slice(0, 10) : "",
  );
  const [selectedRefIds, setSelectedRefIds] = useState<string[]>([...initialReferenceIds]);

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
      const result = await saveCaseStudyAction({
        id: initialData?.id,
        pillar_id: pillarId,
        title,
        slug,
        summary,
        content,
        country,
        region,
        latitude,
        longitude,
        cover_image_path: coverImagePath || undefined,
        organization,
        start_date: startDate,
        end_date: endDate,
        status,
        published_at: publishedAt || undefined,
        reference_ids: selectedRefIds,
      });

      if (!result.ok) {
        setError(result.error ?? "Unable to save case study.");
        return;
      }

      router.push("/admin/case-studies");
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
              <CardTitle className="font-heading text-xl">Case Study Narrative</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <FormField id="cs-title" label="Title" required>
                <Input
                  id="cs-title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                />
              </FormField>

              <FormField id="cs-slug" label="URL Slug" required>
                <Input
                  id="cs-slug"
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(e.target.value);
                  }}
                  className="font-mono text-sm"
                  required
                />
              </FormField>

              <FormField id="cs-summary" label="Summary" required>
                <Textarea
                  id="cs-summary"
                  rows={3}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  required
                />
              </FormField>

              <FormField id="cs-content" label="Field Documentation (Markdown)" required>
                <MarkdownEditor
                  id="cs-content"
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
              <CardDescription>Link authoritative sources verifying this case study.</CardDescription>
            </CardHeader>
            <CardContent>
              {lookups.references.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No scientific references registered yet.
                </p>
              ) : (
                <div className="max-h-56 space-y-2 overflow-y-auto rounded-lg border border-border p-3">
                  {lookups.references.map((ref) => (
                    <label
                      key={ref.id}
                      className="flex cursor-pointer items-start gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-muted/50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedRefIds.includes(ref.id)}
                        onChange={() => toggleReference(ref.id)}
                        className="mt-1 size-4 accent-primary"
                      />
                      <span>
                        <span className="font-medium text-foreground">{ref.title}</span>
                        <span className="block text-xs text-muted-foreground">
                          {ref.organization}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-xl">Publishing &amp; Pillar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField id="cs-status" label="Status" required>
                <StatusSelect
                  id="cs-status"
                  value={status}
                  onValueChange={setStatus}
                  disabled={isPending}
                />
              </FormField>

              <FormField id="cs-published" label="Publish Date">
                <Input
                  id="cs-published"
                  type="date"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                />
              </FormField>

              <FormField id="cs-pillar" label="Environmental Pillar" required>
                <Select value={pillarId} onValueChange={setPillarId}>
                  <SelectTrigger id="cs-pillar" className="h-10 w-full">
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-xl">Location &amp; Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField id="cs-country" label="Country" required>
                <Input
                  id="cs-country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g., Indonesia"
                  required
                />
              </FormField>

              <FormField id="cs-region" label="Region / Ecosystem">
                <Input
                  id="cs-region"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="e.g., Central Kalimantan"
                />
              </FormField>

              <div className="grid gap-3 sm:grid-cols-2">
                <FormField id="cs-lat" label="Latitude" description="-90 to 90">
                  <Input
                    id="cs-lat"
                    type="number"
                    step="any"
                    min={-90}
                    max={90}
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                  />
                </FormField>
                <FormField id="cs-lng" label="Longitude" description="-180 to 180">
                  <Input
                    id="cs-lng"
                    type="number"
                    step="any"
                    min={-180}
                    max={180}
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                  />
                </FormField>
              </div>

              <FormField id="cs-org" label="Lead Organization">
                <Input
                  id="cs-org"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                />
              </FormField>

              <div className="grid gap-3 sm:grid-cols-2">
                <FormField id="cs-start" label="Start Date">
                  <Input
                    id="cs-start"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </FormField>
                <FormField id="cs-end" label="End Date">
                  <Input
                    id="cs-end"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </FormField>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-xl">Cover Image</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField id="cs-cover" label="Case Study Cover Asset">
                <ImageUpload
                  id="cs-cover"
                  bucket="case-study-images"
                  value={coverImagePath}
                  onChange={setCoverImagePath}
                  disabled={isPending}
                />
              </FormField>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
        <Button asChild type="button" variant="outline" className="gap-1.5">
          <Link href="/admin/case-studies">
            <ArrowLeft className="size-4" aria-hidden="true" />
            <span>Back to Case Studies</span>
          </Link>
        </Button>

        <Button type="submit" disabled={isPending} className="gap-2">
          {isPending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Save className="size-4" aria-hidden="true" />
          )}
          <span>{isPending ? "Saving..." : initialData ? "Update Case Study" : "Save Case Study"}</span>
        </Button>
      </div>
    </form>
  );
}
