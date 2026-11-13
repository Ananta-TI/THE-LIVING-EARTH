"use client";

import type { ReactNode } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TableToolbarProps {
  readonly searchValue: string;
  readonly onSearchChange: (value: string) => void;
  readonly searchPlaceholder?: string;
  readonly searchLabel?: string;
  readonly filters?: ReactNode;
  readonly onReset?: () => void;
  readonly hasActiveFilters?: boolean;
}

export function TableToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  searchLabel = "Search records",
  filters,
  onReset,
  hasActiveFilters = false,
}: TableToolbarProps) {
  return (
    <div className="mb-4 flex flex-col gap-3 rounded-xl border border-border bg-card p-3.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="relative min-w-0 flex-1 sm:max-w-xs">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchLabel}
          className="h-10 pl-9"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {filters}
        {hasActiveFilters && onReset ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-10 gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <X className="size-3.5" aria-hidden="true" />
            <span>Clear</span>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
