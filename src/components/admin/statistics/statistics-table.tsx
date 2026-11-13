"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Archive, BarChart3, Edit3, Trash2 } from "lucide-react";
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
import { archiveStatisticAction, deleteStatisticAction } from "@/features/statistics/actions";
import type { StatisticListItem } from "@/features/statistics/queries";
import { STATISTIC_DATA_TYPES } from "@/features/statistics/schemas";
import { formatNumber } from "@/lib/utils/format";

interface StatisticsTableProps {
  readonly items: readonly StatisticListItem[];
  readonly pillars: readonly { id: string; name: string }[];
}

export function StatisticsTable({ items, pillars }: StatisticsTableProps) {
  const [search, setSearch] = useState("");
  const [pillarFilter, setPillarFilter] = useState("all");
  const [dataTypeFilter, setDataTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [feedback, setFeedback] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      if (pillarFilter !== "all" && item.pillar_id !== pillarFilter) return false;
      if (dataTypeFilter !== "all" && item.data_type !== dataTypeFilter) return false;
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (!q) return true;
      return (
        item.indicator.toLowerCase().includes(q) ||
        item.geographic_scope.toLowerCase().includes(q) ||
        item.referenceTitle.toLowerCase().includes(q) ||
        String(item.measurement_year).includes(q)
      );
    });
  }, [items, search, pillarFilter, dataTypeFilter, statusFilter]);

  function handleArchive(id: string) {
    setFeedback(null);
    startTransition(async () => {
      const res = await archiveStatisticAction(id);
      setFeedback({
        type: res.ok ? "ok" : "error",
        text: res.ok ? (res.message ?? "Archived.") : (res.error ?? "Archive failed."),
      });
    });
  }

  async function handleDelete(id: string) {
    setFeedback(null);
    const res = await deleteStatisticAction(id);
    setFeedback({
      type: res.ok ? "ok" : "error",
      text: res.ok ? (res.message ?? "Deleted.") : (res.error ?? "Delete failed."),
    });
  }

  const columns: readonly DataTableColumn<StatisticListItem>[] = [
    {
      key: "indicator",
      header: "Indicator",
      render: (row) => (
        <div className="max-w-md space-y-0.5">
          <Link
            href={`/admin/statistics/${row.id}/edit`}
            className="block font-medium text-foreground hover:text-primary hover:underline"
          >
            {row.indicator}
          </Link>
          <p className="text-xs text-muted-foreground">
            {row.pillarName} · {row.geographic_scope}
          </p>
        </div>
      ),
    },
    {
      key: "value",
      header: "Measurement",
      render: (row) => (
        <div className="text-sm">
          <span className="font-medium text-foreground tabular-nums">
            {formatNumber(row.value)}
          </span>{" "}
          <span className="text-xs text-muted-foreground">{row.unit}</span>
          <p className="text-xs text-muted-foreground tabular-nums">Year: {row.measurement_year}</p>
        </div>
      ),
    },
    {
      key: "data_type",
      header: "Data Type",
      render: (row) => <StatusBadge status={row.data_type} />,
    },
    {
      key: "reference",
      header: "Source",
      render: (row) => (
        <span className="block max-w-xs truncate text-xs text-muted-foreground">
          {row.referenceTitle}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button asChild variant="outline" size="sm">
            <Link href={`/admin/statistics/${row.id}/edit`}>
              <Edit3 className="size-3.5" aria-hidden="true" />
              <span>Edit</span>
            </Link>
          </Button>
          {row.status !== "archived" ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={isPending}
              onClick={() => handleArchive(row.id)}
              aria-label={`Archive statistic ${row.indicator}`}
              className="size-9 text-muted-foreground hover:text-foreground"
            >
              <Archive className="size-4" aria-hidden="true" />
            </Button>
          ) : null}
          <ConfirmDialog
            title={`Delete "${row.indicator}"?`}
            description="Consider archiving historical datasets instead of deleting them if they are needed for longitudinal comparison."
            confirmLabel="Delete Statistic"
            onConfirm={() => handleDelete(row.id)}
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Delete statistic ${row.indicator}`}
              className="size-9 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </Button>
          </ConfirmDialog>
        </div>
      ),
    },
  ];

  const hasFilters = Boolean(
    search.trim() ||
      pillarFilter !== "all" ||
      dataTypeFilter !== "all" ||
      statusFilter !== "all",
  );

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
        searchPlaceholder="Search indicator, scope, year, or source..."
        searchLabel="Search statistics"
        hasActiveFilters={hasFilters}
        onReset={() => {
          setSearch("");
          setPillarFilter("all");
          setDataTypeFilter("all");
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

            <Select value={dataTypeFilter} onValueChange={setDataTypeFilter}>
              <SelectTrigger aria-label="Filter by data type" className="h-10 w-44">
                <SelectValue placeholder="All data types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Data Types</SelectItem>
                {STATISTIC_DATA_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
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
          icon={BarChart3}
          title={
            items.length === 0 ? "No environmental statistics recorded" : "No matching statistics"
          }
          description={
            items.length === 0
              ? "Add verified scientific indicators backed by authoritative references, measurement years, and methodology notes."
              : "Adjust your search or filter selections."
          }
          actionLabel={items.length === 0 ? "Add Statistic" : undefined}
          actionHref={items.length === 0 ? "/admin/statistics/create" : undefined}
          onResetFilters={
            hasFilters
              ? () => {
                  setSearch("");
                  setPillarFilter("all");
                  setDataTypeFilter("all");
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
