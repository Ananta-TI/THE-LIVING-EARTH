import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { PublicArticleCard } from "@/features/public/queries";
import { formatDateTime } from "@/lib/utils/format";
import { resolveEditorialImageUrl } from "@/lib/utils/media-url";
import { estimateReadingTimeMinutes } from "@/lib/utils/reading-time";

interface ArticleCardProps {
  readonly article: PublicArticleCard;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const imageSrc = resolveEditorialImageUrl(article.cover_image_path, {
    pillarSlug: article.pillarSlug,
  });
  const readingMinutes = estimateReadingTimeMinutes(article.content);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xs transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-primary/45 hover:shadow-sm motion-reduce:transform-none">
      <Link
        href={`/stories/${article.slug}`}
        className="relative aspect-[16/10] w-full overflow-hidden bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <Image
          src={imageSrc}
          alt={article.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:transform-none"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
        />
        <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center rounded-full bg-black/55 px-2.5 py-0.5 text-[11px] font-medium text-earth-ivory">
            {article.pillarName}
          </span>
          {article.topicName ? (
            <span className="inline-flex items-center rounded-full bg-black/45 px-2.5 py-0.5 text-[10px] font-medium text-earth-ivory/90">
              {article.topicName}
            </span>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col justify-between gap-4 p-5 sm:p-6">
        <div className="space-y-2.5">
          <h3 className="font-heading text-xl leading-snug font-medium text-foreground sm:text-[22px]">
            <Link
              href={`/stories/${article.slug}`}
              className="transition-colors duration-200 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {article.title}
            </Link>
          </h3>

          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {article.excerpt}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/70 pt-3.5 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-2.5">
            {article.published_at ? (
              <time dateTime={article.published_at}>{formatDateTime(article.published_at)}</time>
            ) : null}
            {readingMinutes ? (
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3.5" aria-hidden="true" />
                <span>{readingMinutes} min read</span>
              </span>
            ) : null}
          </div>

          <Link
            href={`/stories/${article.slug}`}
            className="group/read inline-flex items-center gap-1 text-xs font-medium text-primary underline-offset-4 hover:underline"
          >
            <span>Read more</span>
            <ArrowRight
              className="size-3 transition-transform duration-200 group-hover/read:translate-x-1 motion-reduce:transform-none"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
