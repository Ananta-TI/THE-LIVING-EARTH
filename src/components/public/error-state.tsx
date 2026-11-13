import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  readonly title?: string;
  readonly description: string;
  readonly actionHref?: string;
  readonly actionLabel?: string;
}

export function ErrorState({
  title = "Content temporarily unavailable",
  description,
  actionHref = "/",
  actionLabel = "Return Home",
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 sm:p-8"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive">
          <AlertCircle className="size-5" aria-hidden="true" />
        </span>
        <div className="space-y-2">
          <h2 className="font-heading text-xl font-medium text-foreground">{title}</h2>
          <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">{description}</p>
          <div className="pt-2">
            <Button asChild variant="outline" size="sm">
              <Link href={actionHref}>{actionLabel}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
