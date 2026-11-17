import Image from "next/image";
import Link from "next/link";
import { getNoteFragment, getNoteStandfirst } from "@/lib/utils/field-notes";
import { formatDateTime } from "@/lib/utils/format";
import { estimateReadingTimeMinutes } from "@/lib/utils/reading-time";
import { resolveEditorialImageUrl } from "@/lib/utils/media-url";

interface StoryLedgerItem {
  readonly id: string;
  readonly title: string;
  readonly slug: string;
  readonly excerpt: string;
  readonly content: string;
  readonly cover_image_path: string | null;
  readonly pillarSlug: string;
  readonly published_at: string | null;
  readonly pillarName: string;
  readonly topicName: string | null;
}

interface StoryLedgerProps {
  readonly articles: readonly StoryLedgerItem[];
  readonly startIndex?: number;
}

/**
 * Reading order for the story archive: one hairline row per note with the
 * ordinal, the standfirst, and a single metadata line. No card chrome, no
 * duplicated call-to-action links.
 *
 * Each row also carries its cover photograph. It is revealed on hover by
 * expanding from a hairline to full height and easing back in on leave, so the
 * archive stays a quiet index until the reader points at something. Entirely
 * CSS driven: the row is server-rendered and the reveal costs only `opacity`
 * and `clip-path`, with the image loaded lazily.
 */
export function StoryLedger({ articles, startIndex = 0 }: StoryLedgerProps) {
  return (
    <ol className="border-t border-border">
      {articles.map((article, index) => {
        const standfirst = getNoteStandfirst(article.slug) || article.excerpt;
        const fragment = getNoteFragment(article.slug);
        const minutes = estimateReadingTimeMinutes(article.content);
        const coverSrc = resolveEditorialImageUrl(article.cover_image_path, {
          pillarSlug: article.pillarSlug,
        });

        return (
          <li key={article.id} className="border-b border-border">
            <Link
              href={`/stories/${article.slug}`}
              className="group/row grid gap-x-8 gap-y-4 py-8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring lg:grid-cols-12 lg:py-9"
            >
              <div className="lg:col-span-8">
                <p className="font-mono text-[10px] tracking-[0.12em] text-earth-muted tabular-nums">
                  {String(startIndex + index + 1).padStart(3, "0")}
                </p>

                <h3 className="mt-3 max-w-[26ch] font-heading text-2xl leading-tight tracking-[-0.015em] text-foreground transition-colors duration-300 group-hover/row:text-primary sm:text-[1.95rem]">
                  {article.title}
                </h3>

                <p className="mt-3 max-w-[64ch] text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                  {standfirst}
                </p>

                {fragment ? (
                  <p className="mt-3 max-w-[58ch] border-l border-primary/35 pl-4 text-[13px] leading-relaxed text-foreground/65 italic">
                    {fragment}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-5 lg:col-span-4">
                {/* The reveal: a hairline that grows into the photograph where a
                    real pointer can hover. Touch devices get the plate outright
                    rather than a hairline they can never expand. */}
                <div
                  aria-hidden="true"
                  className="relative h-44 overflow-hidden rounded-lg bg-muted transition-[height,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover-capable:h-[3px] hover-capable:opacity-0 hover-capable:group-hover/row:h-44 hover-capable:group-hover/row:opacity-100 hover-capable:group-focus-visible/row:h-44 hover-capable:group-focus-visible/row:opacity-100 motion-reduce:transition-none"
                >
                  <Image
                    src={coverSrc}
                    alt=""
                    fill
                    loading="lazy"
                    sizes="(min-width: 1024px) 380px, 100vw"
                    className="scale-105 object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/row:scale-100 motion-reduce:transition-none"
                  />
                </div>

                <dl className="flex flex-wrap items-baseline gap-x-6 gap-y-2 lg:flex-col lg:gap-y-2.5">
                  <div className="flex items-baseline gap-2">
                    <dt className="sr-only">Domain</dt>
                    <dd className="font-mono text-[10px] tracking-[0.12em] text-earth-muted">
                      {article.pillarName}
                    </dd>
                  </div>
                  {article.topicName ? (
                    <div className="flex items-baseline gap-2">
                      <dt className="sr-only">Topic</dt>
                      <dd className="font-mono text-[10px] tracking-[0.12em] text-earth-muted">
                        {article.topicName}
                      </dd>
                    </div>
                  ) : null}
                  <div className="flex items-baseline gap-2">
                    <dt className="sr-only">Published</dt>
                    <dd className="font-mono text-[10px] tracking-[0.12em] text-earth-muted tabular-nums">
                      {article.published_at ? formatDateTime(article.published_at) : "Unpublished"}
                    </dd>
                  </div>
                  {minutes ? (
                    <div className="flex items-baseline gap-2">
                      <dt className="sr-only">Reading time</dt>
                      <dd className="font-mono text-[10px] tracking-[0.12em] text-earth-muted tabular-nums">
                        {minutes} min
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </div>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
