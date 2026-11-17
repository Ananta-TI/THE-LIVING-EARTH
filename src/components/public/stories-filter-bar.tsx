"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface StoriesFilterBarProps {
  readonly pillars: readonly {
    readonly id: string;
    readonly name: string;
    readonly slug: string;
  }[];
  readonly initialQuery: string;
  readonly initialPillarSlug: string;
  readonly totalCount: number;
}

const SHORT_PILLAR_LABELS: Record<string, string> = {
  "climate-atmosphere": "Climate",
  "oceans-water": "Oceans",
  "forests-biodiversity": "Forests",
  "pollution-human-impact": "Pollution",
  "solutions-restoration": "Restoration",
};

function buildStoriesHref(query: string, pillarSlug: string): string {
  const params = new URLSearchParams();
  const trimmed = query.trim();
  if (trimmed) params.set("q", trimmed);
  if (pillarSlug) params.set("pillar", pillarSlug);
  const qs = params.toString();
  return qs ? `/stories?${qs}` : "/stories";
}

/**
 * Archive index bar: domain filters as a plain text row, a hairline search
 * field, and a running count. No pill chips, no button block.
 */
export function StoriesFilterBar({
  pillars,
  initialQuery,
  initialPillarSlug,
  totalCount,
}: StoriesFilterBarProps) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState(initialQuery);

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(buildStoriesHref(searchValue, initialPillarSlug));
  }

  function handlePillarSelect(slug: string) {
    router.push(buildStoriesHref(searchValue, slug));
  }

  const hasFilters = Boolean(initialQuery.trim() || initialPillarSlug);

  return (
    <div className="border-t border-border pt-6">
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
        <div
          role="group"
          aria-label="Filter notes by environmental domain"
          className="flex flex-wrap items-center gap-x-6 gap-y-1 lg:col-span-7"
        >
          <button
            type="button"
            onClick={() => handlePillarSelect("")}
            aria-pressed={initialPillarSlug === ""}
            className={cn(
              "min-h-8 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
              initialPillarSlug === ""
                ? "font-medium text-foreground underline decoration-primary decoration-2 underline-offset-[6px]"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            All
          </button>

          {pillars.map((pillar) => {
            const active = initialPillarSlug === pillar.slug;
            const shortLabel = SHORT_PILLAR_LABELS[pillar.slug] ?? pillar.name;
            return (
              <button
                key={pillar.id}
                type="button"
                onClick={() => handlePillarSelect(pillar.slug)}
                aria-pressed={active}
                title={pillar.name}
                className={cn(
                  "min-h-8 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
                  active
                    ? "font-medium text-foreground underline decoration-primary decoration-2 underline-offset-[6px]"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {shortLabel}
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-5">
          <form
            onSubmit={handleSearchSubmit}
            role="search"
            aria-label="Search published notes"
            className="flex items-center gap-3 border-b border-border pb-2 focus-within:border-primary"
          >
            <label htmlFor="stories-search-input" className="sr-only">
              Search notes
            </label>
            <Search className="size-3.5 shrink-0 text-earth-muted" aria-hidden="true" />
            <input
              id="stories-search-input"
              type="search"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search the archive"
              className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-earth-muted focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 font-mono text-[10px] tracking-[0.12em] text-earth-muted transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              SEARCH
            </button>
            {hasFilters ? (
              <button
                type="button"
                onClick={() => {
                  setSearchValue("");
                  router.push("/stories");
                }}
                className="shrink-0 font-mono text-[10px] tracking-[0.12em] text-earth-muted transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                CLEAR
              </button>
            ) : null}
          </form>

          <p className="mt-3 font-mono text-[10px] tracking-[0.12em] text-earth-muted" aria-live="polite">
            <span className="tabular-nums">{totalCount}</span>
            {totalCount === 1 ? " NOTE ON FILE" : " NOTES ON FILE"}
          </p>
        </div>
      </div>
    </div>
  );
}
