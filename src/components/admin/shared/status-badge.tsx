import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusVariant =
  | "draft"
  | "published"
  | "archived"
  | "unread"
  | "read"
  | "replied"
  | "active"
  | "inactive"
  | "historical_observation"
  | "current_estimate"
  | "projection";

const STATUS_STYLES: Record<StatusVariant, { label: string; className: string }> = {
  published: {
    label: "Published",
    className: "border-primary/30 bg-primary/10 text-primary",
  },
  draft: {
    label: "Draft",
    className: "border-amber-600/30 bg-amber-500/10 text-amber-800 dark:text-amber-300",
  },
  archived: {
    label: "Archived",
    className: "border-border bg-muted text-muted-foreground",
  },
  unread: {
    label: "Unread",
    className: "border-primary/40 bg-primary text-primary-foreground",
  },
  read: {
    label: "Read",
    className: "border-border bg-secondary text-secondary-foreground",
  },
  replied: {
    label: "Replied",
    className: "border-emerald-600/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300",
  },
  active: {
    label: "Active",
    className: "border-primary/30 bg-primary/10 text-primary",
  },
  inactive: {
    label: "Inactive",
    className: "border-border bg-muted text-muted-foreground",
  },
  historical_observation: {
    label: "Historical Observation",
    className: "border-border bg-secondary/70 text-secondary-foreground",
  },
  current_estimate: {
    label: "Current Estimate",
    className: "border-primary/30 bg-primary/10 text-primary",
  },
  projection: {
    label: "Projection",
    className: "border-sky-600/30 bg-sky-500/10 text-sky-800 dark:text-sky-300",
  },
};

interface StatusBadgeProps {
  readonly status: string;
  readonly className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const meta = STATUS_STYLES[status as StatusVariant] ?? {
    label: status.replace(/_/g, " "),
    className: "border-border bg-muted text-muted-foreground",
  };

  return (
    <Badge
      variant="outline"
      className={cn("font-medium capitalize", meta.className, className)}
    >
      {meta.label}
    </Badge>
  );
}
