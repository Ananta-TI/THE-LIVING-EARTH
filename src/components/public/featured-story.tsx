import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PublicArticleCard } from "@/features/public/queries";
import { formatDateTime } from "@/lib/utils/format";
import { resolveEditorialImageUrl } from "@/lib/utils/media-url";
import { estimateReadingTimeMinutes } from "@/lib/utils/reading-time";

interface FeaturedStoryProps {
  readonly article: PublicArticleCard;
}

export function FeaturedStory({ article }: FeaturedStoryProps) {
  const imageSrc = resolveEditorialImageUrl(article.cover_image_path, {
    defaultBucket: "article-images",
    pillarSlug: article.pillarSlug,
  });
  const readingMinutes = estimateReadingTimeMinutes(article.content);

  return (
    <article className="grid overflow-hidden rounded-3xl border border-border bg-earth-deep-forest text-earth-ivory shadow-sm lg:grid-cols-12">
      <Link
        href={`/stories/${article.slug}`}
        className="relative aspect-[16/10] w-full overflow-hidden bg-muted lg:col-span-7 lg:aspect-auto lg:min-h-[22rem]"
      >
        <Image
          src={imageSrc}
          alt={article.title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="object-cover transition-transform duration-300 ease-out hover:scale-[1.02] motion-reduce:transform-none"
        />
      </Link>

      <div className="flex flex-col justify-between gap-6 p-6 sm:p-8 lg:col-span-5 lg:p-10">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-earth-forest text-earth-ivory ring-1 ring-earth-sage/35">
              Featured Story
            </Badge>
            <Badge variant="outline" className="border-earth-sage/40 text-earth-soft-sage">
              {article.pillarName}
            </Badge>
          </div>

          <h2 className="font-heading text-2xl leading-snug font-medium text-earth-ivory sm:text-3xl">
            <Link
              href={`/stories/${article.slug}`}
              className="transition-colors hover:text-earth-soft-sage focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-earth-sage"
            >
              {article.title}
            </Link>
          </h2>

          <p className="text-base leading-relaxed text-earth-ivory/82">{article.excerpt}</p>
        </div>

        <div className="space-y-4 border-t border-earth-sage/25 pt-4">
          <div className="flex flex-wrap items-center gap-4 text-xs text-earth-sage">
            {article.published_at ? (
              <time dateTime={article.published_at}>
                {formatDateTime(article.published_at)}
              </time>
            ) : null}
            {readingMinutes ? (
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3.5" aria-hidden="true" />
                <span>{readingMinutes} min read</span>
              </span>
            ) : null}
          </div>

          <Button
            asChild
            className="h-11 rounded-full bg-earth-ivory px-6 text-earth-deep-forest hover:bg-earth-soft-sage"
          >
            <Link href={`/stories/${article.slug}`} className="gap-2">
              <span>Read Full Story</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
