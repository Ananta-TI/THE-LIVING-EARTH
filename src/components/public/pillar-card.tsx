import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Droplets, Flame, Leaf, Sprout, Wind } from "lucide-react";
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

function PillarBadgeIcon({ slug }: { readonly slug: string }) {
  switch (slug) {
    case "climate-atmosphere":
      return <Flame className="size-4" aria-hidden="true" />;
    case "oceans-water":
      return <Droplets className="size-4" aria-hidden="true" />;
    case "forests-biodiversity":
      return <Leaf className="size-4" aria-hidden="true" />;
    case "pollution-human-impact":
      return <Wind className="size-4" aria-hidden="true" />;
    default:
      return <Sprout className="size-4" aria-hidden="true" />;
  }
}

export function PillarCard({
  slug,
  name,
  description,
  coverImagePath,
  variant = "portrait",
}: PillarCardProps) {
  const imageSrc = resolveEditorialImageUrl(coverImagePath, {
    defaultBucket: "pillar-images",
    pillarSlug: slug,
  });

  if (variant === "circular") {
    return (
      <Link
        href={`/explore/${slug}`}
        className="group flex flex-col items-center rounded-2xl p-4 text-center transition-colors hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <div className="relative size-28 overflow-hidden rounded-full border-4 border-card shadow-sm ring-1 ring-border transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none sm:size-32">
          <Image
            src={imageSrc}
            alt={`${name} environmental pillar`}
            fill
            sizes="128px"
            className="object-cover"
          />
        </div>
        <h3 className="mt-4 font-heading text-lg font-medium text-foreground group-hover:text-primary">
          {name}
        </h3>
        <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary">
          <span>Explore</span>
          <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </Link>
    );
  }

  return (
    <article className="group relative flex min-h-[21.5rem] flex-col justify-end overflow-hidden rounded-2xl border border-border/60 bg-earth-deep-forest text-earth-ivory shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md motion-reduce:transform-none">
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
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transform-none"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[#0d1f17]/95 via-[#132b21]/55 to-transparent"
      />

      <div className="relative z-20 pointer-events-none flex flex-col gap-2.5 p-5">
        <span className="inline-flex size-8 items-center justify-center rounded-full bg-earth-ivory/15 text-earth-soft-sage backdrop-blur-xs">
          <PillarBadgeIcon slug={slug} />
        </span>

        <h3 className="font-heading text-xl leading-snug font-medium text-earth-ivory">
          {name}
        </h3>

        <p className="line-clamp-2 text-xs leading-relaxed text-earth-ivory/82">
          {description}
        </p>

        <span className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full border border-earth-ivory/35 bg-earth-deep-forest/70 px-3 py-1 text-xs font-medium text-earth-ivory backdrop-blur-xs transition-colors group-hover:bg-earth-ivory group-hover:text-earth-deep-forest">
          <span>Explore</span>
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </span>
      </div>
    </article>
  );
}
