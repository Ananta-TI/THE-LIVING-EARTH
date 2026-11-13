import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  readonly title: string;
  readonly description?: string;
  readonly actionLabel?: string;
  readonly actionHref?: string;
  readonly align?: "left" | "center";
  readonly tone?: "light" | "dark";
  readonly headingId?: string;
  readonly className?: string;
}

export function SectionHeading({
  title,
  description,
  actionLabel,
  actionHref,
  align = "left",
  tone = "light",
  headingId,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center sm:text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl space-y-2.5", align === "center" && "mx-auto")}>
        <h2
          id={headingId}
          className={cn(
            "font-heading text-3xl font-medium tracking-tight sm:text-4xl",
            tone === "dark" ? "text-earth-ivory" : "text-foreground",
          )}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={cn(
              "text-base leading-relaxed",
              tone === "dark" ? "text-earth-ivory/80" : "text-muted-foreground",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>

      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className={cn(
            "group inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-semibold underline-offset-4 transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2",
            tone === "dark"
              ? "text-earth-sage hover:text-earth-ivory focus-visible:outline-earth-sage"
              : "text-primary hover:text-primary/80 focus-visible:outline-ring",
          )}
        >
          <span>{actionLabel}</span>
          <ArrowRight
            className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none"
            aria-hidden="true"
          />
        </Link>
      ) : null}
    </div>
  );
}
