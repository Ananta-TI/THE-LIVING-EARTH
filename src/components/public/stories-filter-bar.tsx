"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  "solutions-restoration": "Solutions",
};

function buildStoriesHref(query: string, pillarSlug: string): string {
  const params = new URLSearchParams();
  const trimmed = query.trim();
  if (trimmed) params.set("q", trimmed);
  if (pillarSlug) params.set("pillar", pillarSlug);
  const qs = params.toString();
  return qs ? `/stories?${qs}` : "/stories";
}

export function StoriesFilterBar({
  pillars,
  initialQuery,
  initialPillarSlug,
  totalCount,
}: StoriesFilterBarProps) {
  const router = useRouter();
  const prefersReduced = useReducedMotion();
  const [searchValue, setSearchValue] = useState(initialQuery);

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(buildStoriesHref(searchValue, initialPillarSlug));
  }

  function handlePillarSelect(slug: string) {
    router.push(buildStoriesHref(searchValue, slug));
  }

  function handleReset() {
    setSearchValue("");
    router.push("/stories");
  }

  const hasFilters = Boolean(initialQuery.trim() || initialPillarSlug);

  return (
    <div className="space-y-4">
      {/* Horizontal Category Underline Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border">
        <div
          role="group"
          aria-label="Filter stories by environmental pillar"
          className="flex flex-wrap items-center gap-5 sm:gap-7"
        >
          <button
            type="button"
            onClick={() => handlePillarSelect("")}
            aria-pressed={initialPillarSlug === ""}
            className={cn(
              "relative inline-flex min-h-11 items-center px-1 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              initialPillarSlug === ""
                ? "font-medium text-primary"
                : "font-medium text-muted-foreground hover:text-foreground",
            )}
          >
            <span>All</span>
            {initialPillarSlug === "" ? (
              prefersReduced ? (
                <span className="absolute right-0 -bottom-px left-0 h-0.5 bg-primary" />
              ) : (
                <motion.span
                  layoutId="stories-pillar-underline"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  className="absolute right-0 -bottom-px left-0 h-0.5 bg-primary"
                />
              )
            ) : null}
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
                  "relative inline-flex min-h-11 items-center px-1 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  active
                    ? "font-medium text-primary"
                    : "font-medium text-muted-foreground hover:text-foreground",
                )}
              >
                <span>{shortLabel}</span>
                {active ? (
                  prefersReduced ? (
                    <span className="absolute right-0 -bottom-px left-0 h-0.5 bg-primary" />
                  ) : (
                    <motion.span
                      layoutId="stories-pillar-underline"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                      className="absolute right-0 -bottom-px left-0 h-0.5 bg-primary"
                    />
                  )
                ) : null}
              </button>
            );
          })}
        </div>

        <p className="text-xs font-medium text-muted-foreground" aria-live="polite">
          {totalCount === 1 ? "1 article" : `${totalCount} articles`}
        </p>
      </div>

      {/* Rounded Full-Width Search Input */}
      <form
        onSubmit={handleSearchSubmit}
        role="search"
        aria-label="Filter published stories"
        className="flex w-full flex-col gap-2.5 sm:flex-row"
      >
        <label htmlFor="stories-search-input" className="sr-only">
          Search articles
        </label>
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="stories-search-input"
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search articles"
            className="h-11 rounded-lg border-border bg-card pr-4 pl-11 text-sm shadow-2xs transition-colors focus:border-primary"
          />
        </div>
        <Button
          type="submit"
          className="h-11 rounded-lg px-6 transition-[background-color,transform] active:scale-[0.98]"
        >
          Search
        </Button>
        {hasFilters ? (
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="h-11 gap-1.5 rounded-lg px-4 transition-[background-color,transform] active:scale-[0.98]"
          >
            <X className="size-4" aria-hidden="true" />
            <span>Reset</span>
          </Button>
        ) : null}
      </form>
    </div>
  );
}
