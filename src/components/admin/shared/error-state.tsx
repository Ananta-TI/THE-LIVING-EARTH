import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  readonly title?: string;
  readonly message: string;
  readonly retryHref?: string;
  readonly retryLabel?: string;
}

export function ErrorState({
  title = "Unable to load data",
  message,
  retryHref,
  retryLabel = "Back to Dashboard",
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-4 rounded-xl border border-destructive/40 bg-destructive/5 p-6"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive">
          <AlertCircle className="size-4" aria-hidden="true" />
        </span>
        <div className="space-y-1">
          <h2 className="font-heading text-lg font-medium text-foreground">{title}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{message}</p>
        </div>
      </div>
      {retryHref ? (
        <Button asChild variant="outline" size="sm">
          <Link href={retryHref}>{retryLabel}</Link>
        </Button>
      ) : null}
    </div>
  );
}
