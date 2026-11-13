import { cn } from "@/lib/utils";

interface LoadingStateProps {
  readonly label?: string;
  readonly rows?: number;
  readonly className?: string;
}

export function LoadingState({
  label = "Loading data...",
  rows = 5,
  className,
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={cn("space-y-4 rounded-xl border border-border bg-card p-6", className)}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="h-6 w-48 animate-pulse rounded-md bg-muted" />
        <div className="h-9 w-28 animate-pulse rounded-md bg-muted" />
      </div>
      <div className="space-y-2.5">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="h-12 w-full animate-pulse rounded-lg bg-muted/70"
          />
        ))}
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}
