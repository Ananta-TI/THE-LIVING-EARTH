import Image from "next/image";
import Link from "next/link";
import { resolveEditorialImageUrl } from "@/lib/utils/media-url";

interface PillarLedgerItem {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly description: string;
  readonly cover_image_path?: string | null;
  readonly topics?: readonly { readonly id: string; readonly name: string }[];
  readonly publishedArticlesCount?: number;
}

interface PillarLedgerProps {
  readonly pillars: readonly PillarLedgerItem[];
}

function LedgerImage({
  src,
  name,
}: {
  readonly src: string;
  readonly name: string;
}) {
  return (
    <div className="relative aspect-4/3 w-full overflow-hidden bg-secondary lg:aspect-3/4">
      <Image
        src={src}
        alt={`${name} environmental domain`}
        fill
        sizes="(max-width: 1024px) 100vw, 30vw"
        className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/row:scale-[1.035] motion-reduce:transform-none"
      />
    </div>
  );
}

/**
 * Domain ledger: each planetary domain is a full-width row with a large ordinal,
 * a photographic plate, the domain name as the headline, and its indexed topics
 * hanging in a right-hand column. Seq 100+ staggered so the ordinals read as a
 * continuous record rather than five identical cards.
 */
export function PillarLedger({ pillars }: PillarLedgerProps) {
  return (
    <ol className="border-t border-border">
      {pillars.map((pillar, index) => {
        const imageSrc = resolveEditorialImageUrl(pillar.cover_image_path, {
          pillarSlug: pillar.slug,
        });
        const topics = pillar.topics ?? [];
        const ordinal = index === 0 ? "001" : `0${index * 2 + 1}`;

        return (
          <li key={pillar.id} className="border-b border-border">
            <Link
              href={`/explore/${pillar.slug}`}
              aria-label={`Open the ${pillar.name} domain`}
              className="group/row grid gap-6 py-8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring lg:grid-cols-12 lg:gap-10 lg:py-10"
            >
              <div className="flex items-start gap-4 lg:col-span-7 lg:gap-8">
                <span className="w-8 shrink-0 pt-1 font-mono text-[11px] text-earth-muted tabular-nums sm:w-10">
                  {ordinal}
                </span>

                <div className="w-[7.5rem] shrink-0 sm:w-[16rem] lg:w-[13rem]">
                  <LedgerImage src={imageSrc} name={pillar.name} />
                </div>

                <div className="min-w-0 flex-1 pt-1">
                  <h3 className="font-heading text-2xl leading-tight tracking-[-0.015em] text-foreground transition-colors duration-200 group-hover/row:text-primary sm:text-[1.9rem]">
                    {pillar.name}
                  </h3>
                  <p className="mt-3 max-w-[46ch] text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                    {pillar.description}
                  </p>

                  <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] tracking-[0.12em] text-earth-muted">
                    <span>
                      {pillar.publishedArticlesCount ?? 0} published{" "}
                      {(pillar.publishedArticlesCount ?? 0) === 1 ? "note" : "notes"}
                    </span>
                    {topics.length > 0 ? (
                      <>
                        <span className="text-border">/</span>
                        <span>
                          {topics.length} indexed {topics.length === 1 ? "topic" : "topics"}
                        </span>
                      </>
                    ) : null}
                  </p>

                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">
                    <span>Open domain</span>
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/row:translate-x-1 motion-reduce:transform-none"
                    >
                      &rarr;
                    </span>
                  </span>
                </div>
              </div>

              {topics.length > 0 ? (
                <div className="lg:col-span-5 lg:pl-2">
                  <p className="font-mono text-[10px] tracking-[0.12em] text-earth-muted">
                    Indexed topics
                  </p>
                  <ul className="mt-3">
                    {topics.map((topic) => (
                      <li
                        key={topic.id}
                        className="border-b border-border/60 py-2.5 text-[13px] text-foreground/80 last:border-b-0"
                      >
                        {topic.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
