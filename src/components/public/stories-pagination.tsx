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
      <p className="font-mono text-[10px] tracking-[0.12em] text-earth-muted tabular-nums">
        PAGE {page} OF {totalPages}
      </p>

      <div className="flex flex-wrap items-center gap-5">
        {hasPrev ? (
          <Link
            href={buildPageHref(page - 1, search, pillarSlug)}
            className="inline-flex min-h-8 items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            <ChevronLeft className="size-3.5" aria-hidden="true" />
            <span>Newer</span>
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className="inline-flex min-h-8 items-center gap-1.5 text-sm text-muted-foreground/45"
          >
            <ChevronLeft className="size-3.5" aria-hidden="true" />
            <span>Newer</span>
          </span>
        )}

        <ol className="flex flex-wrap items-center gap-3">
          {pages.map((pageNum) => {
            const isCurrent = pageNum === page;
            return (
              <li key={pageNum}>
                <Link
                  href={buildPageHref(pageNum, search, pillarSlug)}
                  aria-current={isCurrent ? "page" : undefined}
                  className={cn(
                    "font-mono text-[11px] tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
                    isCurrent
                      ? "text-foreground underline decoration-primary decoration-2 underline-offset-[6px]"
                      : "text-earth-muted hover:text-foreground",
                  )}
                >
                  {String(pageNum).padStart(2, "0")}
                </Link>
              </li>
            );
          })}
        </ol>

        {hasNext ? (
          <Link
            href={buildPageHref(page + 1, search, pillarSlug)}
            className="inline-flex min-h-8 items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            <span>Older</span>
            <ChevronRight className="size-3.5" aria-hidden="true" />
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className="inline-flex min-h-8 items-center gap-1.5 text-sm text-muted-foreground/45"
          >
            <span>Older</span>
            <ChevronRight className="size-3.5" aria-hidden="true" />
          </span>
        )}
      </div>
    </nav>
  );
}
