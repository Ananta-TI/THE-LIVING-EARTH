"use client";

import { useMemo, useState, useTransition } from "react";
import { Edit3, Plus, Tags, Trash2 } from "lucide-react";
import { FormField } from "@/components/admin/forms/form-field";
import { ConfirmDialog } from "@/components/admin/shared/confirm-dialog";
import { StatusBadge } from "@/components/admin/shared/status-badge";
import { DataTable, type DataTableColumn } from "@/components/admin/tables/data-table";
import { TableEmptyState } from "@/components/admin/tables/table-empty-state";
import { TableToolbar } from "@/components/admin/tables/table-toolbar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  deleteTopicAction,
  saveTopicAction,
  toggleTopicActiveAction,
} from "@/features/topics/actions";
import type { TopicWithPillar } from "@/features/topics/queries";
import { slugify } from "@/lib/utils/slug";

interface TopicsManagerProps {
  readonly topics: readonly TopicWithPillar[];
  readonly pillars: readonly { id: string; name: string; display_order: number }[];
}

export function TopicsManager({ topics, pillars }: TopicsManagerProps) {
  const [search, setSearch] = useState("");
  const [pillarFilter, setPillarFilter] = useState<string>("all");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [pillarId, setPillarId] = useState(pillars[0]?.id ?? "");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState("1");
  const [isActive, setIsActive] = useState(true);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return topics.filter((topic) => {
      if (pillarFilter !== "all" && topic.pillar_id !== pillarFilter) return false;
      if (activeFilter === "active" && !topic.is_active) return false;
      if (activeFilter === "inactive" && topic.is_active) return false;
      if (!query) return true;
      return (
        topic.name.toLowerCase().includes(query) ||
        topic.slug.toLowerCase().includes(query) ||
        topic.pillarName.toLowerCase().includes(query)
      );
    });
  }, [topics, search, pillarFilter, activeFilter]);

  function openCreate() {
    setEditingId(null);
    setPillarId(pillars[0]?.id ?? "");
    setName("");
    setSlug("");
    setSlugTouched(false);
    setDescription("");
    setDisplayOrder(String(topics.length + 1));
    setIsActive(true);
    setFormError(null);
    setDialogOpen(true);
  }

  function openEdit(topic: TopicWithPillar) {
    setEditingId(topic.id);
    setPillarId(topic.pillar_id);
    setName(topic.name);
    setSlug(topic.slug);
    setSlugTouched(true);
    setDescription(topic.description);
    setDisplayOrder(String(topic.display_order));
    setIsActive(topic.is_active);
    setFormError(null);
    setDialogOpen(true);
  }

  function handleNameChange(nextName: string) {
    setName(nextName);
    if (!slugTouched) {
      setSlug(slugify(nextName));
    }
  }

  function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    startTransition(async () => {
      const result = await saveTopicAction({
        id: editingId ?? undefined,
        pillar_id: pillarId,
        name,
        slug,
        description,
        display_order: Number(displayOrder),
        is_active: isActive,
      });

      if (!result.ok) {
        setFormError(result.error ?? "Unable to save topic.");
        return;
      }

      setDialogOpen(false);
      setFeedback({ type: "ok", text: result.message ?? "Topic saved." });
    });
  }

  function handleToggle(topic: TopicWithPillar, nextValue: boolean) {
    setFeedback(null);
    startTransition(async () => {
      const result = await toggleTopicActiveAction(topic.id, nextValue);
      setFeedback({
        type: result.ok ? "ok" : "error",
        text: result.ok ? (result.message ?? "Updated.") : (result.error ?? "Update failed."),
      });
    });
  }

  async function handleDelete(id: string) {
    setFeedback(null);
    const result = await deleteTopicAction(id);
    setFeedback({
      type: result.ok ? "ok" : "error",
      text: result.ok ? (result.message ?? "Deleted.") : (result.error ?? "Unable to delete."),
    });
  }

  const columns: readonly DataTableColumn<TopicWithPillar>[] = [
    {
      key: "name",
      header: "Topic",
      render: (row) => (
        <div className="min-w-44">
          <p className="font-medium text-foreground">{row.name}</p>
          <p className="font-mono text-xs text-muted-foreground">{row.slug}</p>
        </div>
      ),
    },
    {
      key: "pillar",
      header: "Pillar",
      render: (row) => <span className="text-sm text-foreground">{row.pillarName}</span>,
    },
    {
      key: "order",
      header: "Order",
      render: (row) => <span className="font-mono text-xs tabular-nums">#{row.display_order}</span>,
    },
    {
      key: "articles",
      header: "Articles",
      render: (row) => <span className="text-sm tabular-nums">{row.articlesCount}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={row.is_active}
            disabled={isPending}
            aria-label={`Toggle ${row.name} active status`}
            onCheckedChange={(checked) => handleToggle(row, checked)}
          />
          <StatusBadge status={row.is_active ? "active" : "inactive"} />
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => openEdit(row)}>
            <Edit3 className="size-3.5" aria-hidden="true" />
            <span>Edit</span>
          </Button>
          <ConfirmDialog
            title={`Delete "${row.name}"?`}
            description={
              row.articlesCount > 0
                ? `This topic is linked to ${row.articlesCount} article(s) and cannot be deleted until reassigned.`
                : "This permanently removes the topic from its environmental pillar."
            }
            confirmLabel="Delete Topic"
            triggerDisabled={row.articlesCount > 0 || isPending}
            onConfirm={() => handleDelete(row.id)}
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={row.articlesCount > 0 || isPending}
              aria-label={`Delete topic ${row.name}`}
              className="size-9 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </Button>
          </ConfirmDialog>
        </div>
      ),
    },
  ];

  const hasFilters = Boolean(search.trim() || pillarFilter !== "all" || activeFilter !== "all");

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button type="button" size="sm" onClick={openCreate} className="gap-1.5">
          <Plus className="size-4" aria-hidden="true" />
          <span>New Topic</span>
        </Button>
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

      <TableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search topics or slugs..."
        searchLabel="Search topics"
        hasActiveFilters={hasFilters}
        onReset={() => {
          setSearch("");
          setPillarFilter("all");
          setActiveFilter("all");
        }}
        filters={
          <>
            <Select value={pillarFilter} onValueChange={setPillarFilter}>
              <SelectTrigger aria-label="Filter by pillar" className="h-10 w-48">
                <SelectValue placeholder="All pillars" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Pillars</SelectItem>
                {pillars.map((pillar) => (
                  <SelectItem key={pillar.id} value={pillar.id}>
                    {pillar.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={activeFilter} onValueChange={setActiveFilter}>
              <SelectTrigger aria-label="Filter by active state" className="h-10 w-36">
                <SelectValue placeholder="All status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
      />

      {filtered.length === 0 ? (
        <TableEmptyState
          icon={Tags}
          title={topics.length === 0 ? "No topics created yet" : "No matching topics"}
          description={
            topics.length === 0
              ? "Topics organize editorial stories into focused themes inside each environmental pillar."
              : "Try adjusting your search query or pillar filter."
          }
          onResetFilters={
            hasFilters
              ? () => {
                  setSearch("");
                  setPillarFilter("all");
                  setActiveFilter("all");
                }
              : undefined
          }
        />
      ) : (
        <DataTable data={filtered} columns={columns} getRowKey={(row) => row.id} />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">
              {editingId ? "Edit Topic" : "Create Topic"}
            </DialogTitle>
            <DialogDescription>
              Assign the topic to one environmental pillar and keep slugs unique per pillar.
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

            <FormField id="topic-pillar" label="Environmental Pillar" required>
              <Select value={pillarId} onValueChange={setPillarId}>
                <SelectTrigger id="topic-pillar" className="h-10 w-full">
                  <SelectValue placeholder="Select pillar" />
                </SelectTrigger>
                <SelectContent>
                  {pillars.map((pillar) => (
                    <SelectItem key={pillar.id} value={pillar.id}>
                      {pillar.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <div className="grid gap-4 sm:grid-cols-3">
              <FormField id="topic-name" label="Topic Name" required className="sm:col-span-2">
                <Input
                  id="topic-name"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                />
              </FormField>

              <FormField id="topic-order" label="Order" required>
                <Input
                  id="topic-order"
                  type="number"
                  min={1}
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                  required
                />
              </FormField>
            </div>

            <FormField
              id="topic-slug"
              label="Slug"
              required
              description="Lowercase kebab-case identifier (unique within the selected pillar)."
            >
              <Input
                id="topic-slug"
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(e.target.value);
                }}
                className="font-mono text-sm"
                required
              />
            </FormField>

            <FormField id="topic-description" label="Description" required>
              <Textarea
                id="topic-description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </FormField>

            <div className="flex items-center justify-between rounded-lg border border-border px-3.5 py-2.5">
              <div>
                <p className="text-sm font-medium">Active Topic</p>
                <p className="text-xs text-muted-foreground">
                  Available for assigning to new articles.
                </p>
              </div>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : editingId ? "Update Topic" : "Create Topic"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
