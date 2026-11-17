import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { resolveEditorialImageUrl } from "@/lib/utils/media-url";

interface PillarCardProps {
  readonly slug: string;
  readonly name: string;
  readonly description: string;
  readonly coverImagePath?: string | null;
  readonly topics?: readonly { readonly id: string; readonly name: string }[];
  readonly articlesCount?: number;
  readonly variant?: "portrait" | "circular";
}

export function PillarCard({
  slug,
  name,
  description,
  coverImagePath,
  variant = "portrait",
}: PillarCardProps) {
  const imageSrc = resolveEditorialImageUrl(coverImagePath, {
    pillarSlug: slug,
  });

  if (variant === "circular") {
    return (
      <Link
        href={`/explore/${slug}`}
        className="group flex flex-col items-center rounded-xl p-4 text-center transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transform-none"
      >
        <div className="relative size-28 overflow-hidden rounded-full border-4 border-card shadow-sm ring-1 ring-border transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-hover:ring-primary/35 motion-reduce:transform-none sm:size-32">
          <Image
            src={imageSrc}
            alt={`${name} environmental pillar`}
            fill
            sizes="128px"
            className="object-cover"
          />
        </div>
        <h3 className="mt-4 font-heading text-lg font-medium text-foreground transition-colors duration-200 group-hover:text-primary">
          {name}
        </h3>
        <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary">
          <span>Explore</span>
          <ArrowRight
            className="size-3 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none"
            aria-hidden="true"
          />
        </span>
      </Link>
    );
  }

  return (
    <article className="group relative flex min-h-[21.5rem] flex-col justify-end overflow-hidden rounded-xl border border-border/60 bg-earth-deep-forest text-earth-ivory shadow-xs transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-earth-sage/60 hover:shadow-sm motion-reduce:transform-none">
      <Link
        href={`/explore/${slug}`}
        aria-label={`Explore ${name}`}
        className="absolute inset-0 z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-earth-soft-sage"
      >
        <span className="sr-only">Explore {name}</span>
      </Link>

      <Image
        src={imageSrc}
        alt={`${name} environmental pillar visual`}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
        className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] motion-reduce:transform-none"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent transition-opacity duration-300 group-hover:opacity-90"
      />

      <div className="pointer-events-none relative z-20 flex flex-col gap-2.5 p-5">
        <h3 className="font-heading text-xl leading-snug font-medium text-earth-ivory">
          {name}
        </h3>

        <p className="line-clamp-2 text-xs leading-relaxed text-earth-ivory/82">
          {description}
        </p>

        <span className="mt-1 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-earth-ivory underline-offset-4 group-hover:underline">
          <span>Explore</span>
          <ArrowRight
            className="size-3.5 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none"
            aria-hidden="true"
          />
        </span>
      </div>
    </article>
  );
}
