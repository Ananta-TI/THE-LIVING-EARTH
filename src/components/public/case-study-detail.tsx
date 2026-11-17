import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface CaseStudySpecRow {
  readonly label: string;
  readonly value: string;
}

export interface CaseStudySource {
  readonly id: string;
  readonly title: string;
  readonly organization: string;
  readonly sourceTypeLabel: string;
  readonly sourceUrl: string;
  readonly meta: string;
}

/* ------------------------------------------------------------------ */
/* Opener                                                              */
/* ------------------------------------------------------------------ */

interface CaseStudyOpenerProps {
  readonly index: string;
  readonly pillarName: string;
  readonly pillarSlug: string;
  readonly title: string;
  readonly summary: string;
  readonly location: string;
  readonly imageSrc: string;
  readonly startLabel: string;
}

/**
 * Full-bleed photographic opener for a case study, using the same field-record
 * composition as the rest of the site: running order on the left, headline over
 * the plate, and a location line pinned to the bottom rule.
 */
export function CaseStudyOpener({
  index,
  pillarName,
  pillarSlug,
  title,
  summary,
  location,
  imageSrc,
  startLabel,
}: CaseStudyOpenerProps) {
  return (
    <section
      aria-labelledby="case-title"
      className="relative isolate overflow-hidden bg-earth-deep-forest text-earth-ivory"
    >
      <Image
        src={imageSrc}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/64 via-black/52 to-black/82"
      />

      <div className="relative mx-auto flex min-h-[32rem] w-full max-w-[1400px] flex-col justify-end px-4 pt-36 pb-12 sm:min-h-[36rem] sm:px-6 sm:pt-40 sm:pb-14 lg:min-h-[40rem] lg:px-10 lg:pt-44 lg:pb-16">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] tracking-[0.14em] text-earth-sage">
          <span className="tabular-nums">{index}</span>
          <span className="text-earth-sage/50">/</span>
          <Link
            href={`/explore/${pillarSlug}`}
            className="uppercase transition-colors hover:text-earth-ivory focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-earth-sage"
          >
            {pillarName}
          </Link>
          <span className="text-earth-sage/50">/</span>
          <span className="uppercase">Case study</span>
        </div>

        <div className="mt-7 grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <h1
            id="case-title"
            className="font-heading text-[2.2rem] leading-[1.04] tracking-[-0.02em] text-earth-ivory lg:col-span-7 sm:text-[2.9rem] lg:text-[3.4rem]"
          >
            {title}
          </h1>

          <p className="max-w-[46ch] text-[15px] leading-relaxed text-earth-ivory/85 lg:col-span-5 lg:pt-2">
            {summary}
          </p>
        </div>

        <div className="mt-9 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-earth-ivory/20 pt-4 font-mono text-[10px] tracking-[0.14em] text-earth-ivory/70">
          <span className="uppercase">Filed from</span>
          <span className="text-earth-ivory">{location}</span>
          <span className="text-earth-ivory/35">/</span>
          <span className="tabular-nums">{startLabel}</span>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Specification ledger                                                */
/* ------------------------------------------------------------------ */

/**
 * The measured record for one study: a hairline table rather than a card grid,
 * so the study reads as a filed document instead of a marketing panel.
 */
export function CaseStudySpecLedger({ rows }: { readonly rows: readonly CaseStudySpecRow[] }) {
  if (rows.length === 0) return null;

  return (
    <section aria-labelledby="case-spec-heading" className="border-t border-border pt-6">
      <h2
        id="case-spec-heading"
        className="font-mono text-[10px] tracking-[0.14em] text-earth-muted uppercase"
      >
        Study record
      </h2>
      <dl className="mt-5 divide-y divide-border border-y border-border">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid gap-1 py-3.5 sm:grid-cols-[minmax(0,11rem)_1fr] sm:gap-6 sm:py-4"
          >
            <dt className="font-mono text-[10px] tracking-[0.12em] text-earth-muted uppercase">
              {row.label}
            </dt>
            <dd className="text-sm leading-relaxed text-foreground">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Sources                                                             */
/* ------------------------------------------------------------------ */

/**
 * Sources as a numbered citation ledger with a hanging ordinal, matching the
 * note ledgers used elsewhere rather than boxed cards.
 */
export function CaseStudySources({
  sources,
}: {
  readonly sources: readonly CaseStudySource[];
}) {
  if (sources.length === 0) return null;

  return (
    <section aria-labelledby="case-sources-heading" className="border-t border-border pt-6">
      <div className="grid gap-4 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <h2
            id="case-sources-heading"
            className="font-heading text-[1.5rem] leading-tight tracking-[-0.015em] text-foreground"
          >
            Sources & references
          </h2>
        </div>
        <p className="max-w-[54ch] text-sm leading-relaxed text-muted-foreground lg:col-span-8 lg:pt-1">
          Documentation supporting this field record. Every figure quoted in the study
          traces back to one of these published sources.
        </p>
      </div>

      <ol className="mt-8 border-t border-border">
        {sources.map((source, index) => (
          <li
            key={source.id}
            className="grid gap-3 border-b border-border py-6 sm:grid-cols-[3rem_1fr] sm:gap-6"
          >
            <span className="font-mono text-[11px] tracking-[0.12em] text-earth-muted tabular-nums">
              [{String(index + 1).padStart(2, "0")}]
            </span>

            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[10px] tracking-[0.12em] text-earth-muted uppercase">
                <span>{source.sourceTypeLabel}</span>
                <span className="text-border">/</span>
                <span className="normal-case tracking-normal">{source.organization}</span>
              </div>

              <h3 className="font-heading text-lg leading-snug text-foreground">
                {source.title}
              </h3>

              <p className="font-mono text-[10px] tracking-[0.1em] text-earth-muted">
                {source.meta}
              </p>

              <a
                href={source.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                <span>Visit source</span>
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </a>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

interface CaseStudyFooterProps {
  readonly pillarName: string;
  readonly pillarSlug: string;
}

export function CaseStudyFooter({ pillarName, pillarSlug }: CaseStudyFooterProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
      <Link
        href="/our-planet"
        className="group inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        <span className="font-mono text-[10px] tracking-[0.14em] text-earth-muted uppercase">
          Back to
        </span>
        <span>Our Planet</span>
      </Link>

      <Link
        href={`/explore/${pillarSlug}`}
        className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        <span>Explore {pillarName}</span>
        <ArrowUpRight
          className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
          aria-hidden="true"
        />
      </Link>
    </div>
  );
}
