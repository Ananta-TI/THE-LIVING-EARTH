"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, ExternalLink, Loader2, Save } from "lucide-react";
import { FormField } from "@/components/admin/forms/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { saveReferenceAction } from "@/features/references/actions";
import type { ReferenceRow } from "@/features/references/queries";
import { REFERENCE_SOURCE_TYPES } from "@/features/references/schemas";

interface ReferenceFormProps {
  readonly initialData?: ReferenceRow;
}

export function ReferenceForm({ initialData }: ReferenceFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [organization, setOrganization] = useState(initialData?.organization ?? "");
  const [sourceType, setSourceType] = useState<ReferenceRow["source_type"]>(
    initialData?.source_type ?? "scientific_journal",
  );
  const [author, setAuthor] = useState(initialData?.author ?? "");
  const [publicationDate, setPublicationDate] = useState(initialData?.publication_date ?? "");
  const [sourceUrl, setSourceUrl] = useState(initialData?.source_url ?? "");
  const [accessedAt, setAccessedAt] = useState(
    initialData?.accessed_at ? initialData.accessed_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
  );
  const [notes, setNotes] = useState(initialData?.notes ?? "");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await saveReferenceAction({
        id: initialData?.id,
        title,
        organization,
        source_type: sourceType,
        author: author || null,
        publication_date: publicationDate || null,
        source_url: sourceUrl,
        accessed_at: accessedAt || null,
        notes: notes || null,
      });

      if (!result.ok) {
        setError(result.error ?? "Unable to save reference.");
        return;
      }

      router.push("/admin/references");
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

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-xl">Citation Metadata</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <FormField id="ref-title" label="Publication / Dataset Title" required>
            <Input
              id="ref-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., AR6 Synthesis Report: Climate Change 2023"
              required
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="ref-org" label="Publishing Organization" required>
              <Input
                id="ref-org"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g., Intergovernmental Panel on Climate Change (IPCC)"
                required
              />
            </FormField>

            <FormField id="ref-type" label="Source Classification" required>
              <Select
                value={sourceType}
                onValueChange={(value) => setSourceType(value as ReferenceRow["source_type"])}
              >
                <SelectTrigger id="ref-type" className="h-10 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REFERENCE_SOURCE_TYPES.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField id="ref-author" label="Author(s)">
              <Input
                id="ref-author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Optional lead author or team"
              />
            </FormField>

            <FormField id="ref-pub-date" label="Publication Date">
              <Input
                id="ref-pub-date"
                type="date"
                value={publicationDate}
                onChange={(e) => setPublicationDate(e.target.value)}
              />
            </FormField>

            <FormField id="ref-accessed" label="Verification / Access Date">
              <Input
                id="ref-accessed"
                type="date"
                value={accessedAt}
                onChange={(e) => setAccessedAt(e.target.value)}
              />
            </FormField>
          </div>

          <FormField
            id="ref-url"
            label="Authoritative Source URL"
            required
            description="Must be an accessible http:// or https:// permalink or DOI URL."
          >
            <div className="flex gap-2">
              <Input
                id="ref-url"
                type="url"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://..."
                required
              />
              {sourceUrl.startsWith("https://") || sourceUrl.startsWith("http://") ? (
                <Button asChild type="button" variant="outline" size="icon" className="shrink-0">
                  <a
                    href={sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open source URL in new tab"
                  >
                    <ExternalLink className="size-4" aria-hidden="true" />
                  </a>
                </Button>
              ) : null}
            </div>
          </FormField>

          <FormField
            id="ref-notes"
            label="Editorial Verification Notes"
            description="Document scope caveats, methodology summaries, or version notes."
          >
            <Textarea
              id="ref-notes"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </FormField>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild type="button" variant="outline" className="gap-1.5">
          <Link href="/admin/references">
            <ArrowLeft className="size-4" aria-hidden="true" />
            <span>Back to References</span>
          </Link>
        </Button>

        <Button type="submit" disabled={isPending} className="gap-2">
          {isPending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Save className="size-4" aria-hidden="true" />
          )}
          <span>{isPending ? "Saving..." : initialData ? "Update Reference" : "Create Reference"}</span>
        </Button>
      </div>
    </form>
  );
}
