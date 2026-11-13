import type { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface PageHeroBannerProps {
  readonly title: string;
  readonly description: string;
  readonly eyebrow?: string;
  readonly imageSrc?: string;
  readonly imageAlt?: string;
  readonly align?: "left" | "center";
  readonly compact?: boolean;
  readonly children?: ReactNode;
}

export function PageHeroBanner({
  title,
  description,
  eyebrow,
  imageSrc = "/images/hero-planet.jpg",
  imageAlt = "Atmospheric misty mountain forest landscape representing THE LIVING EARTH",
  align = "left",
  compact = false,
  children,
}: PageHeroBannerProps) {
  return (
    <section
      aria-labelledby="page-hero-title"
      className="relative isolate overflow-hidden border-b border-border bg-earth-deep-forest text-earth-ivory"
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-earth-deep-forest/65 via-earth-deep-forest/70 to-earth-deep-forest/90"
      />

      <div
        className={cn(
          "relative mx-auto flex max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8",
          compact ? "min-h-[15rem] py-12 sm:min-h-[18rem] sm:py-16" : "min-h-[18rem] py-16 sm:min-h-[21rem] sm:py-20",
          align === "center" ? "items-center text-center" : "items-start text-left",
        )}
      >
        <div className={cn("space-y-4", align === "center" ? "max-w-2xl" : "max-w-3xl")}>
          {eyebrow ? (
            <p className="inline-flex items-center rounded-full border border-earth-sage/40 bg-earth-deep-forest/65 px-3.5 py-1 text-xs font-medium tracking-wide text-earth-soft-sage backdrop-blur-xs">
              {eyebrow}
            </p>
          ) : null}

          <h1
            id="page-hero-title"
            className="font-heading text-3xl leading-[1.12] font-medium tracking-tight text-earth-ivory sm:text-5xl"
          >
            {title}
          </h1>

          <p className="text-base leading-relaxed text-earth-ivory/88 sm:text-lg">
            {description}
          </p>

          {children ? <div className="pt-2">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}
