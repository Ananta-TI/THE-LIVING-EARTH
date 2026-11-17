import Link from "next/link";
import type { PublicStatisticWithSource } from "@/features/public/queries";
import { formatNumber } from "@/lib/utils/format";

interface FieldDataPanelProps {
  readonly statistics: readonly PublicStatisticWithSource[];
}

function reading(stat: PublicStatisticWithSource): { value: string; unit: string } {
  const isPercent = stat.unit === "%";
  return {
    value: `${isPercent ? "~" : ""}${formatNumber(stat.value)}`,
    unit: isPercent ? "%" : stat.unit,
  };
}

/**
 * Field measurements set as a dark instrument panel: oversized tabular figures
 * with their provenance hanging directly beneath, per column.
 */
export function FieldDataPanel({ statistics }: FieldDataPanelProps) {
  if (statistics.length === 0) return null;

  return (
    <section
      aria-labelledby="home-field-data-heading"
      className="relative isolate overflow-hidden bg-earth-deep-forest text-earth-ivory"
    >
      <div className="mx-auto w-full max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-earth-ivory/15 pb-6">
          <h2
            id="home-field-data-heading"
            className="max-w-xl font-heading text-3xl leading-tight tracking-[-0.015em] text-earth-ivory sm:text-4xl"
          >
            Recent measurements, straight from their sources
          </h2>
          <Link
            href="/our-planet#sources"
            className="group/src inline-flex items-center gap-2 border-b border-earth-ivory/35 pb-1 font-mono text-[11px] tracking-[0.12em] text-earth-ivory/80 transition-colors duration-200 hover:border-earth-ivory hover:text-earth-ivory focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-earth-sage"
          >
            <span>OPEN THE FULL LEDGER</span>
            <span
              aria-hidden="true"
              className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/src:translate-x-1 motion-reduce:transform-none"
            >
              &rarr;
            </span>
          </Link>
        </div>

        <ul className="grid gap-x-10 gap-y-12 pt-10 lg:grid-cols-3">
          {statistics.slice(0, 3).map((stat) => {
            const { value, unit } = reading(stat);
            const published = stat.publication_date
              ? String(new Date(stat.publication_date).getUTCFullYear())
              : String(stat.measurement_year);

            return (
              <li key={stat.id} className="min-w-0">
                <p className="flex items-baseline gap-1.5 font-heading text-[3.4rem] leading-none tracking-[-0.03em] text-earth-ivory tabular-nums sm:text-[4.2rem]">
                  <span>{value}</span>
                  <span className="font-sans text-base font-medium text-earth-sage sm:text-lg">
                    {unit}
                  </span>
                </p>

                <p className="mt-5 text-[15px] font-medium text-earth-ivory">
                  {stat.indicator}
                </p>
                <p className="mt-1.5 font-mono text-[11px] text-earth-sage/85">
                  {stat.geographic_scope} &middot; {published}
                </p>

                <p className="mt-5 border-t border-earth-ivory/15 pt-4 text-[13px] leading-relaxed text-earth-ivory/65">
                  {stat.methodology}
                </p>

                <p className="mt-3 text-[12px] leading-relaxed text-earth-sage/80">
                  {stat.reference?.organization ?? "Verified source"}
                  {stat.reference?.title ? ` — ${stat.reference.title}` : ""}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
