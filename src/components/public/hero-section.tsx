import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  readonly headline?: string;
  readonly description?: string;
}

export function HeroSection({
  headline = "Our Planet Is Changing. Understanding It Is Where Change Begins.",
  description = "Explore documentary environmental stories, ecological field case studies, and verified planetary science across five interconnected systems.",
}: HeroSectionProps) {
  return (
    <section
      aria-labelledby="hero-headline"
      className="relative isolate overflow-hidden border-b border-border bg-earth-deep-forest text-earth-ivory"
    >
      <Image
        src="/images/hero-planet.jpg"
        alt="Misty evergreen rainforest ridges and winding river valley at dawn"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-[#0f2119]/92 via-[#172f25]/70 to-[#172f25]/30"
      />

      <div className="relative mx-auto flex min-h-[31rem] max-w-7xl flex-col justify-end px-4 py-16 sm:min-h-[36rem] sm:px-6 sm:py-20 lg:min-h-[40rem] lg:px-8 lg:py-24">
        <div className="max-w-2xl space-y-5">
          <p className="inline-flex items-center rounded-full border border-earth-sage/45 bg-earth-deep-forest/65 px-3.5 py-1 text-xs font-medium text-earth-soft-sage backdrop-blur-xs">
            A Journey Through Our Changing Planet
          </p>

          <h1
            id="hero-headline"
            className="font-heading text-4xl leading-[1.08] font-medium tracking-tight text-earth-ivory sm:text-5xl lg:text-[3.5rem]"
          >
            {headline}
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-earth-ivory/90 sm:text-lg">
            {description}
          </p>

          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <Button
              asChild
              size="lg"
              className="h-11 rounded-full bg-earth-forest px-6 text-earth-ivory shadow-sm ring-1 ring-earth-sage/40 hover:bg-earth-deep-forest"
            >
              <Link href="/our-planet" className="gap-2">
                <span>Explore Our Planet</span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-11 rounded-full border-earth-ivory/50 bg-earth-deep-forest/45 px-6 text-earth-ivory backdrop-blur-xs hover:bg-earth-ivory hover:text-earth-deep-forest"
            >
              <Link href="/stories" className="gap-2">
                <BookOpen className="size-4" aria-hidden="true" />
                <span>Discover Our Stories</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
