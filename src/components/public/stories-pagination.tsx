import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StoriesPaginationProps {
  readonly page: number;
  readonly pageSize: number;
  readonly totalCount: number;
  readonly search: string;
  readonly pillarSlug: string;
}

function buildPageHref(page: number, search: string, pillarSlug: string): string {
  const params = new URLSearchParams();
  if (search.trim()) params.set("q", search.trim());
  if (pillarSlug) params.set("pillar", pillarSlug);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/stories?${qs}` : "/stories";
}

export function StoriesPagination({
  page,
  pageSize,
  totalCount,
  search,
  pillarSlug,
}: StoriesPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <nav
      aria-label="Stories pagination"
      className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6"
    >
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {hasPrev ? (
          <Link
            href={buildPageHref(page - 1, search, pillarSlug)}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            <span>Previous</span>
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-border/60 bg-muted/40 px-3.5 text-sm font-medium text-muted-foreground/70"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            <span>Previous</span>
          </span>
        )}

        <ol className="flex flex-wrap items-center gap-1.5">
          {pages.map((pageNum) => {
            const isCurrent = pageNum === page;
            return (
              <li key={pageNum}>
                <Link
                  href={buildPageHref(pageNum, search, pillarSlug)}
                  aria-current={isCurrent ? "page" : undefined}
                  className={cn(
                    "inline-flex size-10 items-center justify-center rounded-lg border text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    isCurrent
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:bg-secondary",
                  )}
                >
                  {pageNum}
                </Link>
              </li>
            );
          })}
        </ol>

        {hasNext ? (
          <Link
            href={buildPageHref(page + 1, search, pillarSlug)}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <span>Next</span>
            <ChevronRight className="size-4" aria-hidden="true" />
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-border/60 bg-muted/40 px-3.5 text-sm font-medium text-muted-foreground/70"
          >
            <span>Next</span>
            <ChevronRight className="size-4" aria-hidden="true" />
          </span>
        )}
      </div>
    </nav>
  );
}
