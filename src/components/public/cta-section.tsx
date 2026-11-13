import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CTASectionProps {
  readonly title: string;
  readonly description: string;
  readonly primaryLabel: string;
  readonly primaryHref: string;
  readonly secondaryLabel?: string;
  readonly secondaryHref?: string;
}

export function CTASection({
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: CTASectionProps) {
  return (
    <section className="group relative isolate overflow-hidden rounded-xl border border-border bg-earth-deep-forest px-6 py-12 text-earth-ivory sm:px-12 sm:py-16">
      <Image
        src="/images/hero-planet.jpg"
        alt=""
        aria-hidden="true"
        fill
        sizes="(min-width: 1280px) 1200px, 100vw"
        className="object-cover object-center opacity-35 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:transform-none"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-[#10221a]/95 via-[#172f25]/85 to-[#1b3a2c]/78"
      />

      <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
        <div className="max-w-2xl space-y-3">
          <h2 className="font-heading text-3xl font-medium tracking-tight text-earth-ivory sm:text-4xl">
            {title}
          </h2>
          <p className="text-base leading-relaxed text-earth-ivory/85">{description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            asChild
            size="lg"
            className="group/btn h-11 rounded-lg bg-earth-ivory px-6 text-earth-deep-forest transition-[background-color,transform] duration-200 hover:bg-earth-soft-sage active:scale-[0.98]"
          >
            <Link href={primaryHref} className="gap-2">
              <span>{primaryLabel}</span>
              <ArrowRight
                className="size-4 transition-transform duration-200 group-hover/btn:translate-x-1 motion-reduce:transform-none"
                aria-hidden="true"
              />
            </Link>
          </Button>
          {secondaryLabel && secondaryHref ? (
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-11 rounded-lg border-earth-ivory/40 bg-transparent px-6 text-earth-ivory transition-[background-color,border-color,transform] duration-200 hover:border-earth-ivory hover:bg-earth-ivory/15 hover:text-earth-ivory active:scale-[0.98]"
            >
              <Link href={secondaryHref}>{secondaryLabel}</Link>
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
