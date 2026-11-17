import type { ReactNode } from "react";
import { AnimatedContent } from "@/components/public/animated-content";

interface EditorialSectionProps {
  readonly id?: string;
  readonly index?: string;
  readonly title: string;
  readonly lede?: string;
  /** Right-hand column of the section header; use for a single inline link. */
  readonly aside?: ReactNode;
  readonly children: ReactNode;
  readonly className?: string;
  readonly headingId?: string;
}

/**
 * Shared section frame: numbered marker, serif title, optional lede in a second
 * column, and a hairline rule that spans the full measure. Replaces the
 * left-aligned `SectionHeading` + `View all` pattern.
 */
export function EditorialSection({
  id,
  index,
  title,
  lede,
  aside,
  children,
  className,
  headingId,
}: EditorialSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={className ?? "scroll-mt-28"}
    >
      <header className="grid gap-4 border-t border-border pt-6 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          {index ? (
            <p className="mb-3 font-mono text-[10px] tracking-[0.14em] text-earth-muted tabular-nums">
              {index}
            </p>
          ) : null}
          <h2
            id={headingId}
            className="font-heading text-[1.75rem] leading-tight tracking-[-0.015em] text-foreground sm:text-[2.1rem]"
          >
            {title}
          </h2>
        </div>

        {lede || aside ? (
          <div className="lg:col-span-6 lg:pt-1">
            {lede ? (
              <p className="max-w-[58ch] text-[15px] leading-relaxed text-muted-foreground">
                {lede}
              </p>
            ) : null}
            {aside ? <div className={lede ? "mt-4" : undefined}>{aside}</div> : null}
          </div>
        ) : null}
      </header>

      <div className="mt-10">
        <AnimatedContent distance={24} duration={0.75} threshold={0.05} stagger={0.06}>
          {children}
        </AnimatedContent>
      </div>
    </section>
  );
}
