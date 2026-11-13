export function LoadingState({
  rows = 3,
  label = "Loading environmental content",
}: {
  readonly rows?: number;
  readonly label?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="space-y-3">
        <div className="h-9 w-64 animate-pulse rounded-lg bg-muted" />
        <div className="h-5 w-full max-w-xl animate-pulse rounded-md bg-muted/70" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-72 animate-pulse rounded-2xl border border-border bg-card" />
        ))}
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}
