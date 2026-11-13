import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { PublicCaseStudyCard } from "@/features/public/queries";
import { resolveEditorialImageUrl } from "@/lib/utils/media-url";

interface CaseStudyCardProps {
  readonly caseStudy: PublicCaseStudyCard;
}

export function CaseStudyCard({ caseStudy }: CaseStudyCardProps) {
  const imageSrc = resolveEditorialImageUrl(caseStudy.cover_image_path, {
    defaultBucket: "case-study-images",
    pillarSlug: caseStudy.pillarSlug,
  });

  const locationText = caseStudy.region
    ? `${caseStudy.region}, ${caseStudy.country}`
    : caseStudy.country;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary/45">
      <Link
        href={`/case-studies/${caseStudy.slug}`}
        className="relative aspect-[16/10] w-full overflow-hidden bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <Image
          src={imageSrc}
          alt={`${caseStudy.title} — ${locationText}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
        />
      </Link>

      <div className="flex flex-1 flex-col justify-between gap-4 p-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge variant="secondary">{caseStudy.pillarName}</Badge>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <MapPin className="size-3.5 text-primary" aria-hidden="true" />
              <span>{locationText}</span>
            </span>
          </div>

          <h3 className="font-heading text-xl leading-snug font-medium text-foreground">
            <Link
              href={`/case-studies/${caseStudy.slug}`}
              className="transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {caseStudy.title}
            </Link>
          </h3>

          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {caseStudy.summary}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-border/70 pt-4 text-xs">
          <span className="truncate text-muted-foreground">
            {caseStudy.organization ?? "Documented Field Study"}
          </span>

          <Link
            href={`/case-studies/${caseStudy.slug}`}
            className="inline-flex shrink-0 items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline"
          >
            <span>Explore Case</span>
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
