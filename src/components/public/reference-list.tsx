import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ReferenceRow } from "@/features/public/queries";
import { formatDateTime } from "@/lib/utils/format";

const SOURCE_TYPE_LABELS: Record<ReferenceRow["source_type"], string> = {
  scientific_journal: "Scientific Journal",
  research_report: "Research Report",
  government_data: "Government Data",
  international_organization: "International Organization",
  institutional_report: "Institutional Report",
  other: "Authoritative Source",
};

interface ReferenceListProps {
  readonly references: readonly ReferenceRow[];
}

export function ReferenceList({ references }: ReferenceListProps) {
  if (references.length === 0) {
    return null;
  }

  return (
    <ol className="space-y-4">
      {references.map((ref, index) => (
        <li
          key={ref.id}
          className="rounded-xl border border-border bg-card p-5 text-sm leading-relaxed"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-medium text-primary">
                  [{index + 1}]
                </span>
                <Badge variant="outline">{SOURCE_TYPE_LABELS[ref.source_type]}</Badge>
                <span className="text-xs font-medium text-muted-foreground">
                  {ref.organization}
                </span>
              </div>
              <h3 className="font-heading text-lg font-medium text-foreground">{ref.title}</h3>
              <p className="text-xs text-muted-foreground">
                {ref.author ? `${ref.author} · ` : ""}
                {ref.publication_date
                  ? `Published ${formatDateTime(ref.publication_date)}`
                  : "Authoritative Source"}
              </p>
              {ref.notes ? (
                <p className="pt-1 text-xs leading-relaxed text-muted-foreground">{ref.notes}</p>
              ) : null}
            </div>

            <a
              href={ref.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <span>Visit Source</span>
              <ExternalLink className="size-3.5" aria-hidden="true" />
            </a>
          </div>
        </li>
      ))}
    </ol>
  );
}
