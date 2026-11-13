import { ExternalLink, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { PublicStatisticWithSource } from "@/features/public/queries";
import { formatDateTime, formatNumber } from "@/lib/utils/format";

const DATA_TYPE_META: Record<
  PublicStatisticWithSource["data_type"],
  { readonly label: string; readonly className: string }
> = {
  historical_observation: {
    label: "Historical Observation",
    className: "border-border bg-secondary text-secondary-foreground",
  },
  current_estimate: {
    label: "Current Estimate",
    className: "border-primary/30 bg-primary/10 text-primary",
  },
  projection: {
    label: "Projection",
    className: "border-amber-700/30 bg-amber-500/10 text-amber-900 dark:text-amber-300",
  },
};

interface StatisticCardProps {
  readonly statistic: PublicStatisticWithSource;
}

export function StatisticCard({ statistic }: StatisticCardProps) {
  const typeMeta = DATA_TYPE_META[statistic.data_type];

  return (
    <article className="flex h-full flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-6">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge variant="outline" className={typeMeta.className}>
            {typeMeta.label}
          </Badge>
          <span className="text-xs font-medium text-muted-foreground">
            {statistic.pillarName}
          </span>
        </div>

        <h3 className="font-heading text-lg leading-snug font-medium text-foreground">
          {statistic.indicator}
        </h3>

        <div className="flex flex-wrap items-baseline gap-2 pt-1">
          <span className="font-heading text-3xl font-semibold tracking-tight text-primary tabular-nums sm:text-4xl">
            {formatNumber(statistic.value)}
          </span>
          <span className="text-sm font-medium text-muted-foreground">{statistic.unit}</span>
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-border/70 pt-3 text-xs">
          <div>
            <dt className="text-muted-foreground">Geographic Scope</dt>
            <dd className="font-medium text-foreground">{statistic.geographic_scope}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Measurement Year</dt>
            <dd className="font-medium text-foreground tabular-nums">
              {statistic.measurement_year}
            </dd>
          </div>
          {statistic.publication_date ? (
            <div className="col-span-2">
              <dt className="text-muted-foreground">Source Publication Date</dt>
              <dd className="font-medium text-foreground">
                {formatDateTime(statistic.publication_date)}
              </dd>
            </div>
          ) : null}
        </dl>
      </div>

      <div className="space-y-2.5 border-t border-border/70 pt-3.5 text-xs">
        {statistic.reference ? (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-medium text-foreground">
              Source: {statistic.reference.organization}
            </span>
            <a
              href={statistic.reference.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"
            >
              <span>View Citation</span>
              <ExternalLink className="size-3" aria-hidden="true" />
            </a>
          </div>
        ) : null}

        {statistic.methodology || statistic.limitations ? (
          <details className="rounded-lg border border-border/70 bg-muted/30 px-3 py-2">
            <summary className="inline-flex cursor-pointer items-center gap-1.5 font-medium text-muted-foreground hover:text-foreground">
              <Info className="size-3.5 shrink-0" aria-hidden="true" />
              <span>Methodology &amp; Limitations</span>
            </summary>
            <div className="mt-2 space-y-2 leading-relaxed text-muted-foreground">
              {statistic.methodology ? (
                <p>
                  <strong className="text-foreground">Methodology:</strong> {statistic.methodology}
                </p>
              ) : null}
              {statistic.limitations ? (
                <p>
                  <strong className="text-foreground">Limitations:</strong> {statistic.limitations}
                </p>
              ) : null}
            </div>
          </details>
        ) : null}
      </div>
    </article>
  );
}
