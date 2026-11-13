import Link from "next/link";
import { Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  readonly title: string;
  readonly description: string;
  readonly actionLabel?: string;
  readonly actionHref?: string;
  readonly secondaryLabel?: string;
  readonly secondaryHref?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  secondaryLabel,
  secondaryHref,
}: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card/70 px-6 py-12 text-center">
      <span className="mx-auto mb-3 flex size-11 items-center justify-center rounded-lg bg-secondary text-primary">
        <Sprout className="size-5" aria-hidden="true" />
      </span>
      <h3 className="font-heading text-xl font-medium text-foreground">{title}</h3>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {(actionLabel && actionHref) || (secondaryLabel && secondaryHref) ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {actionLabel && actionHref ? (
            <Button asChild size="sm">
              <Link href={actionHref}>{actionLabel}</Link>
            </Button>
          ) : null}
          {secondaryLabel && secondaryHref ? (
            <Button asChild variant="outline" size="sm">
              <Link href={secondaryHref}>{secondaryLabel}</Link>
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
