import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  readonly label: string;
  readonly href?: string;
}

interface BreadcrumbsProps {
  readonly items: readonly BreadcrumbItem[];
  readonly tone?: "light" | "dark";
  readonly className?: string;
}

export function Breadcrumbs({
  items,
  tone = "light",
  className,
}: BreadcrumbsProps) {
  const isDark = tone === "dark";

  return (
    <nav aria-label="Breadcrumb" className={cn(isDark ? "mb-1" : "mb-6", className)}>
      <ol
        className={cn(
          "flex flex-wrap items-center gap-1.5 text-sm",
          isDark ? "text-earth-soft-sage" : "text-muted-foreground",
        )}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="inline-flex items-center gap-1.5">
              {index > 0 ? (
                <ChevronRight className="size-3.5 shrink-0 opacity-70" aria-hidden="true" />
              ) : null}
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={cn(
                    "font-medium",
                    isDark ? "text-earth-ivory" : "text-foreground",
                  )}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
                    isDark
                      ? "hover:text-earth-ivory focus-visible:outline-earth-sage"
                      : "hover:text-foreground focus-visible:outline-ring",
                  )}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
