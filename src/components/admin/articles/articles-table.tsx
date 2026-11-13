"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Edit3, FileText, Star, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/shared/confirm-dialog";
import { StatusBadge } from "@/components/admin/shared/status-badge";
import { DataTable, type DataTableColumn } from "@/components/admin/tables/data-table";
import { TableEmptyState } from "@/components/admin/tables/table-empty-state";
import { TablePagination } from "@/components/admin/tables/table-pagination";
import { TableToolbar } from "@/components/admin/tables/table-toolbar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  deleteArticleAction,
  toggleArticleFeaturedAction,
} from "@/features/articles/actions";
import type { ArticleListItem } from "@/features/articles/queries";
import { formatDateTime } from "@/lib/utils/format";

interface ArticlesTableProps {
  readonly items: readonly ArticleListItem[];
  readonly totalCount: number;
  readonly page: number;
  readonly pageSize: number;
  readonly pillars: readonly { id: string; name: string }[];
  readonly initialFilters: {
    readonly search: string;
    readonly pillarId: string;
    readonly status: string;
    readonly featured: string;
    readonly sort: string;
  };
}

export function ArticlesTable({
  items,
  totalCount,
  page,
  pageSize,
  pillars,
  initialFilters,
}: ArticlesTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchText, setSearchText] = useState(initialFilters.search);
  const [feedback, setFeedback] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function updateQuery(overrides: Record<string, string | number | undefined>) {
    const params = new URLSearchParams();
    const merged = {
      q: searchText.trim(),
      pillar: initialFilters.pillarId,
      status: initialFilters.status,
      featured: initialFilters.featured,
      sort: initialFilters.sort,
      page: String(page),
      ...overrides,
    };

    if (merged.q) params.set("q", String(merged.q));
    if (merged.pillar && merged.pillar !== "all") params.set("pillar", String(merged.pillar));
    if (merged.status && merged.status !== "all") params.set("status", String(merged.status));
    if (merged.featured && merged.featured !== "all") {
      params.set("featured", String(merged.featured));
    }
    if (merged.sort && merged.sort !== "updated_desc") params.set("sort", String(merged.sort));
    if (merged.page && Number(merged.page) > 1) params.set("page", String(merged.page));

    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  function handleSearchChange(next: string) {
    setSearchText(next);
    updateQuery({ q: next.trim(), page: 1 });
  }

  function handleReset() {
    setSearchText("");
    router.push(pathname);
  }

  function handleToggleFeatured(item: ArticleListItem) {
    setFeedback(null);
    startTransition(async () => {
      const res = await toggleArticleFeaturedAction(item.id, !item.featured);
      setFeedback({
        type: res.ok ? "ok" : "error",
        text: res.ok ? (res.message ?? "Updated.") : (res.error ?? "Update failed."),
      });
    });
  }

  async function handleDelete(id: string) {
    setFeedback(null);
    const res = await deleteArticleAction(id);
    setFeedback({
      type: res.ok ? "ok" : "error",
      text: res.ok ? (res.message ?? "Deleted.") : (res.error ?? "Delete failed."),
    });
  }

  const columns: readonly DataTableColumn<ArticleListItem>[] = [
    {
      key: "title",
      header: "Article",
      render: (row) => (
        <div className="max-w-md space-y-0.5">
          <Link
            href={`/admin/articles/${row.id}/edit`}
            className="block font-medium text-foreground hover:text-primary hover:underline"
          >
            {row.title}
          </Link>
          <p className="font-mono text-xs text-muted-foreground">{row.slug}</p>
        </div>
      ),
    },
    {
      key: "taxonomy",
      header: "Pillar & Topic",
      render: (row) => (
        <div className="text-xs">
          <p className="font-medium text-foreground">{row.pillarName}</p>
          <p className="text-muted-foreground">{row.topicName ?? "—"}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "featured",
      header: "Featured",
      render: (row) => (
        <Button
          type="button"
          variant={row.featured ? "default" : "ghost"}
          size="sm"
          disabled={isPending}
          onClick={() => handleToggleFeatured(row)}
          aria-pressed={row.featured}
          className="h-8 gap-1 px-2.5 text-xs"
        >
          <Star className="size-3.5" aria-hidden="true" />
          <span>{row.featured ? "Featured" : "Standard"}</span>
        </Button>
      ),
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
            <Link href={`/admin/articles/${row.id}/edit`}>
              <Edit3 className="size-3.5" aria-hidden="true" />
              <span>Edit</span>
            </Link>
          </Button>
          <ConfirmDialog
            title={`Delete "${row.title}"?`}
            description="This permanently deletes the article and its citation links. Referenced scientific publications in the library remain intact."
            confirmLabel="Delete Article"
            onConfirm={() => handleDelete(row.id)}
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Delete article ${row.title}`}
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
    initialFilters.search ||
      initialFilters.pillarId !== "all" ||
      initialFilters.status !== "all" ||
      initialFilters.featured !== "all",
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
        searchValue={searchText}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search article titles or slugs..."
        searchLabel="Search articles"
        hasActiveFilters={hasFilters}
        onReset={handleReset}
        filters={
          <>
            <Select
              value={initialFilters.pillarId}
              onValueChange={(value) => updateQuery({ pillar: value, page: 1 })}
            >
              <SelectTrigger aria-label="Filter by pillar" className="h-10 w-44">
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

            <Select
              value={initialFilters.status}
              onValueChange={(value) => updateQuery({ status: value, page: 1 })}
            >
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

            <Select
              value={initialFilters.featured}
              onValueChange={(value) => updateQuery({ featured: value, page: 1 })}
            >
              <SelectTrigger aria-label="Filter by featured state" className="h-10 w-36">
                <SelectValue placeholder="Featured" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stories</SelectItem>
                <SelectItem value="featured">Featured Only</SelectItem>
                <SelectItem value="standard">Standard Only</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={initialFilters.sort}
              onValueChange={(value) => updateQuery({ sort: value, page: 1 })}
            >
              <SelectTrigger aria-label="Sort articles" className="h-10 w-40">
                <SelectValue placeholder="Sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated_desc">Recently Updated</SelectItem>
                <SelectItem value="created_desc">Newest Created</SelectItem>
                <SelectItem value="title_asc">Title A–Z</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
      />

      {items.length === 0 ? (
        <TableEmptyState
          icon={FileText}
          title={hasFilters ? "No articles match your filters" : "No articles created yet"}
          description={
            hasFilters
              ? "Try clearing filters or broadening your search."
              : "Start authoring environmental narratives and scientific explainers for THE LIVING EARTH."
          }
          actionLabel={hasFilters ? undefined : "Create Article"}
          actionHref={hasFilters ? undefined : "/admin/articles/create"}
          onResetFilters={hasFilters ? handleReset : undefined}
        />
      ) : (
        <>
          <DataTable data={items} columns={columns} getRowKey={(row) => row.id} />
          <TablePagination
            page={page}
            pageSize={pageSize}
            totalCount={totalCount}
            onPageChange={(nextPage) => updateQuery({ page: nextPage })}
          />
        </>
      )}
    </div>
  );
}
