"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, Edit3, ExternalLink, Plus, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/shared/confirm-dialog";
import { DataTable, type DataTableColumn } from "@/components/admin/tables/data-table";
import { TableEmptyState } from "@/components/admin/tables/table-empty-state";
import { TableToolbar } from "@/components/admin/tables/table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deleteReferenceAction } from "@/features/references/actions";
import type { ReferenceWithUsage } from "@/features/references/queries";
import { REFERENCE_SOURCE_TYPES } from "@/features/references/schemas";
import { formatDateTime } from "@/lib/utils/format";

interface ReferencesTableProps {
  readonly references: readonly ReferenceWithUsage[];
}

export function ReferencesTable({ references }: ReferencesTableProps) {
  const [search, setSearch] = useState("");
  const [sourceTypeFilter, setSourceTypeFilter] = useState("all");
  const [feedback, setFeedback] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return references.filter((ref) => {
      if (sourceTypeFilter !== "all" && ref.source_type !== sourceTypeFilter) return false;
      if (!q) return true;
      return (
        ref.title.toLowerCase().includes(q) ||
        ref.organization.toLowerCase().includes(q) ||
        (ref.author?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [references, search, sourceTypeFilter]);

  async function handleDelete(id: string) {
    setFeedback(null);
    const result = await deleteReferenceAction(id);
    setFeedback({
      type: result.ok ? "ok" : "error",
      text: result.ok ? (result.message ?? "Deleted.") : (result.error ?? "Unable to delete."),
    });
  }

  const columns: readonly DataTableColumn<ReferenceWithUsage>[] = [
    {
      key: "title",
      header: "Source Title",
      render: (row) => (
        <div className="max-w-md space-y-0.5">
          <Link
            href={`/admin/references/${row.id}/edit`}
            className="block font-medium text-foreground hover:text-primary hover:underline"
          >
            {row.title}
          </Link>
          <p className="text-xs text-muted-foreground">
            {row.organization}
            {row.author ? ` · ${row.author}` : ""}
          </p>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (row) => {
        const label =
          REFERENCE_SOURCE_TYPES.find((t) => t.value === row.source_type)?.label ??
          row.source_type;
        return <Badge variant="outline">{label}</Badge>;
      },
    },
    {
      key: "published",
      header: "Published",
      render: (row) => (
        <span className="text-xs text-muted-foreground tabular-nums">
          {formatDateTime(row.publication_date)}
        </span>
      ),
    },
    {
      key: "usage",
      header: "Citations",
      render: (row) => (
        <span className="text-xs text-muted-foreground tabular-nums">
          {row.usageCount} ({row.articlesCount}A / {row.caseStudiesCount}C / {row.statisticsCount}S)
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button asChild variant="ghost" size="icon" className="size-9">
            <a
              href={row.source_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open source URL for ${row.title}`}
            >
              <ExternalLink className="size-4" aria-hidden="true" />
            </a>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/admin/references/${row.id}/edit`}>
              <Edit3 className="size-3.5" aria-hidden="true" />
              <span>Edit</span>
            </Link>
          </Button>
          <ConfirmDialog
            title={`Delete "${row.title}"?`}
            description={
              row.usageCount > 0
                ? `This reference is cited by ${row.usageCount} record(s) and cannot be deleted until detached.`
                : "This permanently removes the reference from the library."
            }
            confirmLabel="Delete Reference"
            triggerDisabled={row.usageCount > 0}
            onConfirm={() => handleDelete(row.id)}
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={row.usageCount > 0}
              aria-label={`Delete reference ${row.title}`}
              className="size-9 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </Button>
          </ConfirmDialog>
        </div>
      ),
    },
  ];

  const hasFilters = Boolean(search.trim() || sourceTypeFilter !== "all");

  return (
    <div className="space-y-4">
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
        searchPlaceholder="Search title, organization, or author..."
        searchLabel="Search references"
        hasActiveFilters={hasFilters}
        onReset={() => {
          setSearch("");
          setSourceTypeFilter("all");
        }}
        filters={
          <Select value={sourceTypeFilter} onValueChange={setSourceTypeFilter}>
            <SelectTrigger aria-label="Filter by source type" className="h-10 w-56">
              <SelectValue placeholder="All source types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Source Types</SelectItem>
              {REFERENCE_SOURCE_TYPES.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      {filtered.length === 0 ? (
        <TableEmptyState
          icon={BookOpen}
          title={
            references.length === 0
              ? "No scientific references registered"
              : "No matching references"
          }
          description={
            references.length === 0
              ? "Add authoritative journals, datasets, and institutional reports so articles, case studies, and statistics can cite verified sources."
              : "Try broadening your search query or source type filter."
          }
          actionLabel={references.length === 0 ? "Add Reference" : undefined}
          actionHref={references.length === 0 ? "/admin/references/create" : undefined}
          onResetFilters={
            hasFilters
              ? () => {
                  setSearch("");
                  setSourceTypeFilter("all");
                }
              : undefined
          }
        />
      ) : (
        <DataTable data={filtered} columns={columns} getRowKey={(row) => row.id} />
      )}

      <div className="flex justify-end">
        <Button asChild size="sm" className="gap-1.5">
          <Link href="/admin/references/create">
            <Plus className="size-4" aria-hidden="true" />
            <span>Add Reference</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
