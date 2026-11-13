"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Archive, CheckCheck, Eye, Inbox, MailCheck } from "lucide-react";
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
import { updateMessageStatusAction } from "@/features/messages/actions";
import type { ContactSubmissionRow } from "@/features/messages/queries";
import { formatDateTimeLong } from "@/lib/utils/format";

interface MessagesTableProps {
  readonly messages: readonly ContactSubmissionRow[];
}

export function MessagesTable({ messages }: MessagesTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [feedback, setFeedback] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = messages.filter((msg) => {
      if (statusFilter !== "all" && msg.status !== statusFilter) return false;
      if (!q) return true;
      return (
        msg.name.toLowerCase().includes(q) ||
        msg.email.toLowerCase().includes(q) ||
        msg.subject.toLowerCase().includes(q)
      );
    });

    if (sortOrder === "oldest") {
      return [...list].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );
    }
    return list;
  }, [messages, search, statusFilter, sortOrder]);

  function handleStatus(id: string, status: ContactSubmissionRow["status"]) {
    setFeedback(null);
    startTransition(async () => {
      const result = await updateMessageStatusAction({ id, status });
      setFeedback({
        type: result.ok ? "ok" : "error",
        text: result.ok ? (result.message ?? "Updated.") : (result.error ?? "Update failed."),
      });
    });
  }

  const columns: readonly DataTableColumn<ContactSubmissionRow>[] = [
    {
      key: "subject",
      header: "Subject & Sender",
      render: (row) => (
        <div className="max-w-md space-y-0.5">
          <Link
            href={`/admin/messages/${row.id}`}
            className="block font-medium text-foreground hover:text-primary hover:underline"
          >
            {row.subject}
          </Link>
          <p className="text-xs text-muted-foreground">
            {row.name} ({row.email})
          </p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "received",
      header: "Received",
      render: (row) => (
        <span className="text-xs text-muted-foreground tabular-nums">
          {formatDateTimeLong(row.created_at)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Button asChild variant="outline" size="sm" className="gap-1">
            <Link href={`/admin/messages/${row.id}`}>
              <Eye className="size-3.5" aria-hidden="true" />
              <span>View</span>
            </Link>
          </Button>
          {row.status === "unread" ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={isPending}
              onClick={() => handleStatus(row.id, "read")}
              aria-label={`Mark "${row.subject}" as read`}
              className="size-9"
            >
              <CheckCheck className="size-4" aria-hidden="true" />
            </Button>
          ) : null}
          {row.status !== "replied" ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={isPending}
              onClick={() => handleStatus(row.id, "replied")}
              aria-label={`Mark "${row.subject}" as replied`}
              className="size-9"
            >
              <MailCheck className="size-4" aria-hidden="true" />
            </Button>
          ) : null}
          {row.status !== "archived" ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={isPending}
              onClick={() => handleStatus(row.id, "archived")}
              aria-label={`Archive "${row.subject}"`}
              className="size-9 text-muted-foreground"
            >
              <Archive className="size-4" aria-hidden="true" />
            </Button>
          ) : null}
        </div>
      ),
    },
  ];

  const hasFilters = Boolean(search.trim() || statusFilter !== "all");

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
        searchPlaceholder="Search sender, email, or subject..."
        searchLabel="Search messages"
        hasActiveFilters={hasFilters}
        onReset={() => {
          setSearch("");
          setStatusFilter("all");
        }}
        filters={
          <>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger aria-label="Filter by message status" className="h-10 w-40">
                <SelectValue placeholder="All status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="replied">Replied</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sortOrder}
              onValueChange={(val) => setSortOrder(val as "newest" | "oldest")}
            >
              <SelectTrigger aria-label="Sort messages by date" className="h-10 w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
      />

      {filtered.length === 0 ? (
        <TableEmptyState
          icon={Inbox}
          title={messages.length === 0 ? "Inbox is empty" : "No matching messages"}
          description={
            messages.length === 0
              ? "Public reader questions, feedback, and data correction reports submitted via the Contact page will appear here."
              : "Try clearing your search or status filter."
          }
          onResetFilters={
            hasFilters
              ? () => {
                  setSearch("");
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
