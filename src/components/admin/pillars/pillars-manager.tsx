"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Edit3, Eye, Layers, Lock } from "lucide-react";
import { FormField } from "@/components/admin/forms/form-field";
import { ImageUpload } from "@/components/admin/forms/image-upload";
import { StatusBadge } from "@/components/admin/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { togglePillarActiveAction, updatePillarAction } from "@/features/pillars/actions";
import type { PillarWithRelations } from "@/features/pillars/queries";

interface PillarsManagerProps {
  readonly pillars: readonly PillarWithRelations[];
}

export function PillarsManager({ pillars }: PillarsManagerProps) {
  const [editing, setEditing] = useState<PillarWithRelations | null>(null);
  const [inspecting, setInspecting] = useState<PillarWithRelations | null>(null);
  const [feedback, setFeedback] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coverImagePath, setCoverImagePath] = useState("");
  const [displayOrder, setDisplayOrder] = useState("1");
  const [isActive, setIsActive] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  function openEdit(pillar: PillarWithRelations) {
    setEditing(pillar);
    setName(pillar.name);
    setDescription(pillar.description);
    setCoverImagePath(pillar.cover_image_path ?? "");
    setDisplayOrder(String(pillar.display_order));
    setIsActive(pillar.is_active);
    setFormError(null);
  }

  function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    setFormError(null);

    startTransition(async () => {
      const result = await updatePillarAction({
        id: editing.id,
        name,
        description,
        cover_image_path: coverImagePath || null,
        display_order: Number(displayOrder),
        is_active: isActive,
      });

      if (!result.ok) {
        setFormError(result.error ?? "Unable to update pillar.");
        return;
      }

      setEditing(null);
      setFeedback({ type: "ok", text: result.message ?? "Pillar updated." });
    });
  }

  function handleToggleActive(pillar: PillarWithRelations, nextValue: boolean) {
    setFeedback(null);
    startTransition(async () => {
      const result = await togglePillarActiveAction(pillar.id, nextValue);
      setFeedback({
        type: result.ok ? "ok" : "error",
        text: result.ok ? (result.message ?? "Updated.") : (result.error ?? "Update failed."),
      });
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2.5 rounded-xl border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
        <Lock className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
        <p>
          The five core environmental pillars represent THE LIVING EARTH&apos;s permanent editorial
          architecture. Slugs are locked to preserve URL stability, and core pillars cannot be
          deleted while referenced by platform content.
        </p>
      </div>

      {feedback ? (
        <div
          role={feedback.type === "error" ? "alert" : "status"}
          className={
            feedback.type === "error"
              ? "rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2.5 text-sm text-destructive"
              : "rounded-lg border border-primary/30 bg-primary/10 px-4 py-2.5 text-sm text-primary"
          }
        >
          {feedback.text}
        </div>
      ) : null}

      <div className="grid gap-4">
        {pillars.map((pillar) => (
          <Card key={pillar.id} className="border-border bg-card">
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-xs font-semibold text-primary">
                    Order #{pillar.display_order}
                  </span>
                  <StatusBadge status={pillar.is_active ? "active" : "inactive"} />
                  <span className="font-mono text-xs text-muted-foreground">{pillar.slug}</span>
                </div>
                <CardTitle className="font-heading text-xl">{pillar.name}</CardTitle>
                <CardDescription className="max-w-3xl text-sm leading-relaxed">
                  {pillar.description}
                </CardDescription>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5">
                  <span className="text-xs font-medium text-muted-foreground">Active</span>
                  <Switch
                    checked={pillar.is_active}
                    disabled={isPending}
                    aria-label={`Toggle ${pillar.name} active status`}
                    onCheckedChange={(checked) => handleToggleActive(pillar, checked)}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setInspecting(pillar)}
                  className="gap-1.5"
                >
                  <Eye className="size-3.5" aria-hidden="true" />
                  <span>Related</span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => openEdit(pillar)}
                  className="gap-1.5"
                >
                  <Edit3 className="size-3.5" aria-hidden="true" />
                  <span>Edit</span>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="flex flex-wrap items-center gap-4 border-t border-border/60 pt-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                <Layers className="size-3.5 text-primary" aria-hidden="true" />
                {pillar.topicsCount} Topics
              </span>
              <span>{pillar.articlesCount} Articles</span>
              <span>{pillar.caseStudiesCount} Case Studies</span>
              <span>{pillar.statisticsCount} Statistics</span>
              {pillar.cover_image_path ? (
                <span className="truncate font-mono text-[11px] text-primary">
                  Cover: {pillar.cover_image_path}
                </span>
              ) : (
                <span className="italic">No cover image assigned</span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={Boolean(editing)} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">
              Edit Pillar: {editing?.name}
            </DialogTitle>
            <DialogDescription>
              Update editorial description, display sequence, cover image, or visibility status.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4">
            {formError ? (
              <p
                role="alert"
                className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive"
              >
                {formError}
              </p>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-4">
              <FormField id="pillar-name" label="Name" required className="sm:col-span-3">
                <Input
                  id="pillar-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </FormField>

              <FormField id="pillar-order" label="Display Order" required>
                <Input
                  id="pillar-order"
                  type="number"
                  min={1}
                  max={100}
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                  required
                />
              </FormField>
            </div>

            <FormField id="pillar-description" label="Description" required>
              <Textarea
                id="pillar-description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </FormField>

            <FormField
              id="pillar-cover"
              label="Cover Image"
              description="Upload an editorial image to the pillar-images bucket or enter a stored URL."
            >
              <ImageUpload
                id="pillar-cover"
                bucket="pillar-images"
                value={coverImagePath}
                onChange={setCoverImagePath}
                disabled={isPending}
              />
            </FormField>

            <div className="flex items-center justify-between rounded-lg border border-border px-3.5 py-2.5">
              <div>
                <p className="text-sm font-medium text-foreground">Active Pillar</p>
                <p className="text-xs text-muted-foreground">
                  Controls whether this pillar appears in active editorial workflows.
                </p>
              </div>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(inspecting)} onOpenChange={(open) => !open && setInspecting(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">
              {inspecting?.name} — Related Content
            </DialogTitle>
            <DialogDescription>
              Topics and recent articles currently linked to this environmental pillar.
            </DialogDescription>
          </DialogHeader>

          {inspecting ? (
            <div className="space-y-5 text-sm">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">
                    Topics ({inspecting.topicsCount})
                  </h3>
                  <Link href="/admin/topics" className="text-xs font-medium text-primary hover:underline">
                    Manage topics
                  </Link>
                </div>
                {inspecting.relatedTopics.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No topics created under this pillar yet.</p>
                ) : (
                  <ul className="space-y-1.5">
                    {inspecting.relatedTopics.map((topic) => (
                      <li
                        key={topic.id}
                        className="flex items-center justify-between rounded-md border border-border px-3 py-1.5 text-xs"
                      >
                        <span>{topic.name}</span>
                        <StatusBadge status={topic.is_active ? "active" : "inactive"} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">
                    Articles ({inspecting.articlesCount})
                  </h3>
                  <Link href="/admin/articles" className="text-xs font-medium text-primary hover:underline">
                    View all articles
                  </Link>
                </div>
                {inspecting.relatedArticles.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No articles assigned to this pillar yet.</p>
                ) : (
                  <ul className="space-y-1.5">
                    {inspecting.relatedArticles.map((article) => (
                      <li
                        key={article.id}
                        className="flex items-center justify-between gap-2 rounded-md border border-border px-3 py-1.5 text-xs"
                      >
                        <Link
                          href={`/admin/articles/${article.id}/edit`}
                          className="truncate font-medium text-foreground hover:text-primary hover:underline"
                        >
                          {article.title}
                        </Link>
                        <StatusBadge status={article.status} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
