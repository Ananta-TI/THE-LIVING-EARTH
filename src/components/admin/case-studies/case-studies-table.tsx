"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Edit3, Globe2, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/shared/confirm-dialog";
import { StatusBadge } from "@/components/admin/shared/status-badge";
import { DataTable, type DataTableColumn } from "@/components/admin/tables/data-table";
import { TableEmptyState } from "@/components/admin/tables/table-empty-state";
import { TableToolbar } from "@/components/admin/tables/table-toolbar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deleteCaseStudyAction } from "@/features/case-studies/actions";
import type { CaseStudyListItem } from "@/features/case-studies/queries";
import { formatDateTime } from "@/lib/utils/format";

interface CaseStudiesTableProps {
  readonly items: readonly CaseStudyListItem[];
  readonly pillars: readonly { id: string; name: string }[];
}

export function CaseStudiesTable({ items, pillars }: CaseStudiesTableProps) {
  const [search, setSearch] = useState("");
  const [pillarFilter, setPillarFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [feedback, setFeedback] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      if (pillarFilter !== "all" && item.pillar_id !== pillarFilter) return false;
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.country.toLowerCase().includes(q) ||
        (item.region?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [items, search, pillarFilter, statusFilter]);

  async function handleDelete(id: string) {
    setFeedback(null);
    const result = await deleteCaseStudyAction(id);
    setFeedback({
      type: result.ok ? "ok" : "error",
      text: result.ok ? (result.message ?? "Deleted.") : (result.error ?? "Delete failed."),
    });
  }

  const columns: readonly DataTableColumn<CaseStudyListItem>[] = [
    {
      key: "title",
      header: "Case Study",
      render: (row) => (
        <div className="max-w-md space-y-0.5">
          <Link
            href={`/admin/case-studies/${row.id}/edit`}
            className="block font-medium text-foreground hover:text-primary hover:underline"
          >
            {row.title}
          </Link>
          <p className="font-mono text-xs text-muted-foreground">{row.slug}</p>
        </div>
      ),
    },
    {
      key: "location",
      header: "Location",
      render: (row) => (
        <div className="text-xs">
          <p className="font-medium text-foreground">{row.country}</p>
          <p className="text-muted-foreground">{row.region ?? "—"}</p>
        </div>
      ),
    },
    {
      key: "pillar",
      header: "Pillar",
      render: (row) => <span className="text-xs">{row.pillarName}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "updated",
      header: "Updated",
      render: (row) => (
        <span className="text-xs text-muted-foreground tabular-nums">
          {formatDateTime(row.updated_at)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button asChild variant="outline" size="sm">
            <Link href={`/admin/case-studies/${row.id}/edit`}>
              <Edit3 className="size-3.5" aria-hidden="true" />
              <span>Edit</span>
            </Link>
          </Button>
          <ConfirmDialog
            title={`Delete "${row.title}"?`}
            description="This permanently removes the case study while keeping linked scientific references in the library."
            confirmLabel="Delete Case Study"
            onConfirm={() => handleDelete(row.id)}
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Delete case study ${row.title}`}
              className="size-9 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </Button>
          </ConfirmDialog>
        </div>
      ),
    },
  ];

  const hasFilters = Boolean(search.trim() || pillarFilter !== "all" || statusFilter !== "all");

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
        searchPlaceholder="Search title, country, or region..."
        searchLabel="Search case studies"
        hasActiveFilters={hasFilters}
        onReset={() => {
          setSearch("");
          setPillarFilter("all");
          setStatusFilter("all");
        }}
        filters={
          <>
            <Select value={pillarFilter} onValueChange={setPillarFilter}>
              <SelectTrigger aria-label="Filter by pillar" className="h-10 w-44">
                <SelectValue placeholder="All pillars" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Pillars</SelectItem>
                {pillars.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger aria-label="Filter by status" className="h-10 w-36">
                <SelectValue placeholder="All status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
      />

      {filtered.length === 0 ? (
        <TableEmptyState
          icon={Globe2}
          title={
            items.length === 0 ? "No case studies documented yet" : "No matching case studies"
          }
          description={
            items.length === 0
              ? "Document real-world ecological challenges, conservation sites, and restoration initiatives around the world."
              : "Adjust your search or status filter."
          }
          actionLabel={items.length === 0 ? "Create Case Study" : undefined}
          actionHref={items.length === 0 ? "/admin/case-studies/create" : undefined}
          onResetFilters={
            hasFilters
              ? () => {
                  setSearch("");
                  setPillarFilter("all");
                  setStatusFilter("all");
                }
              : undefined
          }
        />
      ) : (
        <DataTable data={filtered} columns={columns} getRowKey={(row) => row.id} />
      )}
    </div>
  );
}
