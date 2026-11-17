import Image from "next/image";
import Link from "next/link";
import type { PublicArticleCard } from "@/features/public/queries";
import { getNoteFragment, getNoteStandfirst } from "@/lib/utils/field-notes";
import { formatDateTime } from "@/lib/utils/format";
import { resolveEditorialImageUrl } from "@/lib/utils/media-url";
import { estimateReadingTimeMinutes } from "@/lib/utils/reading-time";

interface FeatureNoteProps {
  readonly article: PublicArticleCard;
  readonly sequence: string;
}

/**
 * Lead field note: asymmetric 12-column split with the photograph set as a
 * plate rather than a card, and the article's standfirst pulled verbatim.
 */
export function FeatureNote({ article, sequence }: FeatureNoteProps) {
  const imageSrc = resolveEditorialImageUrl(article.cover_image_path, {
    pillarSlug: article.pillarSlug,
  });
  const minutes = estimateReadingTimeMinutes(article.content);
  const standfirst = getNoteStandfirst(article.slug);
  const fragment = getNoteFragment(article.slug);

  const facts = [
    { label: "Domain", value: article.pillarName },
    { label: "Subject", value: article.topicName ?? "Field survey" },
    { label: "Published", value: formatDateTime(article.published_at) },
    { label: "Reading", value: minutes ? `${minutes} minutes` : "—" },
  ];

  return (
    <article className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-7">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-earth-muted">
          <span className="tabular-nums">{sequence}</span>
          <span className="text-border">—</span>
          <span>Lead note</span>
          <span className="text-border">/</span>
          <span>{article.pillarName}</span>
        </div>

        <h3 className="mt-5 font-heading text-[2rem] leading-[1.08] tracking-[-0.015em] text-foreground sm:text-[2.6rem]">
          <Link
            href={`/stories/${article.slug}`}
            className="transition-colors duration-200 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            {article.title}
          </Link>
        </h3>

        <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-foreground/85">
          {standfirst || article.excerpt}
        </p>

        {fragment ? (
          <blockquote className="mt-8 border-l-2 border-primary/35 pl-5">
            <p className="font-heading text-xl leading-snug text-foreground/80 italic sm:text-2xl">
              {fragment}
            </p>
            <footer className="mt-3 font-mono text-[10px] tracking-[0.12em] text-earth-muted">
              Extract &middot; {article.pillarName}
            </footer>
          </blockquote>
        ) : null}

        <Link
          href={`/stories/${article.slug}`}
          className="group/read mt-9 inline-flex items-center gap-2 border-b border-foreground/25 pb-1.5 text-sm font-medium text-foreground transition-colors duration-200 hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <span>Read the full note</span>
          <span
            aria-hidden="true"
            className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/read:translate-x-1 motion-reduce:transform-none"
          >
            &rarr;
          </span>
        </Link>
      </div>

      <figure className="lg:col-span-5">
        <Link
          href={`/stories/${article.slug}`}
          className="group/plate block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <div className="relative aspect-4/5 w-full overflow-hidden bg-secondary">
            <Image
              src={imageSrc}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 34vw"
              className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/plate:scale-[1.035] motion-reduce:transform-none"
            />
          </div>
        </Link>

        <dl className="mt-6 border-t border-border">
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="flex items-baseline justify-between gap-6 border-b border-border/70 py-2.5"
            >
              <dt className="font-mono text-[10px] tracking-[0.1em] text-earth-muted">
                {fact.label}
              </dt>
              <dd className="text-right text-[13px] text-foreground/85">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </figure>
    </article>
  );
}
