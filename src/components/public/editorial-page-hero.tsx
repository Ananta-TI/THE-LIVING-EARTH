import Image from "next/image";
import type { ReactNode } from "react";

interface EditorialPageHeroProps {
  /** Running order marker, e.g. "Section 02". */
  readonly index?: string;
  readonly context?: string;
  readonly title: string;
  readonly standfirst: string;
  readonly imageSrc: string;
  /** Reuses the same photographic plate across sections of one page. */
  readonly imageAlt?: string;
  readonly children?: ReactNode;
}

/**
 * Shared page opener for every route below home: full-bleed photographic plate
 * with an attribution-style caption line, the page title on the left, and the
 * standfirst hanging in the right column. Deliberately no eyebrow chip, no
 * rounded card, no centered stack.
 */
export function EditorialPageHero({
  index,
  context,
  title,
  standfirst,
  imageSrc,
  imageAlt = "",
  children,
}: EditorialPageHeroProps) {
  return (
    <section
      aria-labelledby="page-hero-title"
      className="relative isolate overflow-hidden bg-earth-deep-forest text-earth-ivory"
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
        className="absolute inset-0 bg-gradient-to-b from-black/72 via-black/58 to-black/78"
      />

      <div className="relative mx-auto flex min-h-[34rem] w-full max-w-[1400px] flex-col justify-end px-4 pt-36 pb-12 sm:min-h-[38rem] sm:px-6 sm:pt-40 sm:pb-14 lg:min-h-[42rem] lg:px-10 lg:pt-44 lg:pb-16">
        {index || context ? (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] tracking-[0.14em] text-earth-sage">
            {index ? <span className="tabular-nums">{index}</span> : null}
            {index && context ? <span className="text-earth-sage/50">/</span> : null}
            {context ? <span>{context}</span> : null}
          </div>
        ) : null}

        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <h1
            id="page-hero-title"
            className="font-heading text-[2.4rem] leading-[1.02] tracking-[-0.02em] text-earth-ivory lg:col-span-7 sm:text-5xl lg:text-[3.6rem]"
          >
            {title}
          </h1>

          <div className="lg:col-span-5 lg:pt-2">
            <p className="max-w-[46ch] text-base leading-relaxed text-earth-ivory/85">
              {standfirst}
            </p>
            {children ? <div className="mt-6">{children}</div> : null}
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-earth-ivory/25"
      />
    </section>
  );
}
