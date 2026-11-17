import Link from "next/link";
import { AnimatedContent } from "@/components/public/animated-content";

interface ClosingBandProps {
  readonly pillars: readonly { readonly name: string; readonly slug: string }[];
}

/**
 * Closing band: an editorial sign-off rather than a troped CTA banner. The
 * destination list doubles as the domains not yet visited.
 */
export function ClosingBand({ pillars }: ClosingBandProps) {
  return (
    <section
      aria-labelledby="home-closing-heading"
      className="mx-auto w-full max-w-[1400px] px-4 py-20 sm:px-6 sm:py-28 lg:px-10"
    >
      <div className="grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-10">
        <AnimatedContent distance={28} duration={0.8} threshold={0.05} className="lg:col-span-7">
          <h2
            id="home-closing-heading"
            className="font-heading text-[2.2rem] leading-[1.05] tracking-[-0.02em] text-foreground sm:text-5xl lg:text-[3.6rem]"
          >
            The planet keeps a record.
            <br />
            We are learning to read it.
          </h2>

          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href="/our-planet"
              className="group/cta inline-flex items-center gap-2 border-b border-foreground/30 pb-1.5 text-sm font-medium text-foreground transition-colors duration-200 hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <span>Examine the planetary pressures</span>
              <span
                aria-hidden="true"
                className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/cta:translate-x-1 motion-reduce:transform-none"
              >
                &rarr;
              </span>
            </Link>
            <Link
              href="/solutions"
              className="text-sm text-muted-foreground underline-offset-4 transition-colors duration-200 hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              See what restoration looks like
            </Link>
          </div>
        </AnimatedContent>

        <AnimatedContent
          distance={28}
          duration={0.8}
          delay={0.1}
          threshold={0.05}
          stagger={0.06}
          className="lg:col-span-5"
        >
          <nav aria-label="Planetary domains">
          <ul className="border-t border-border">
            {pillars.map((pillar) => (
              <li key={pillar.slug} className="border-b border-border">
                <Link
                  href={`/explore/${pillar.slug}`}
                  className="group/row flex items-center justify-between gap-6 py-4 -mx-3 px-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring transition-colors duration-200 hover:bg-muted/40"
                >
                  <span className="font-heading text-lg text-foreground transition-colors duration-200 group-hover/row:text-primary">
                    {pillar.name}
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-muted-foreground transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/row:translate-x-1 group-hover/row:text-primary motion-reduce:transform-none"
                  >
                    &rarr;
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        </AnimatedContent>
      </div>
    </section>
  );
}
