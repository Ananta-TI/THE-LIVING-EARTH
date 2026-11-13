import Link from "next/link";
import { ReferenceForm } from "@/components/admin/references/reference-form";
import { ErrorState } from "@/components/admin/shared/error-state";
import { PageHeader } from "@/components/admin/shared/page-header";
import { StatusBadge } from "@/components/admin/shared/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getReferenceById } from "@/features/references/queries";

export default async function AdminReferenceEditPage({
  params,
}: {
  readonly params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getReferenceById(id);

  if (!result.ok) {
    return (
      <div className="mx-auto max-w-4xl">
        <PageHeader title="Edit Scientific Reference" />
        <ErrorState
          message={result.error}
          retryHref="/admin/references"
          retryLabel="Back to References"
        />
      </div>
    );
  }

  const { reference, linkedArticles, linkedCaseStudies, linkedStatistics } = result.data;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <PageHeader
        title="Edit Scientific Reference"
        description={reference.title}
      />

      <ReferenceForm initialData={reference} />

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-xl">Linked Content Usage</CardTitle>
          <CardDescription>
            Records currently citing this scientific reference across THE LIVING EARTH.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          <div>
            <h3 className="mb-2 text-xs font-medium text-muted-foreground">
              Articles ({linkedArticles.length})
            </h3>
            {linkedArticles.length === 0 ? (
              <p className="text-xs text-muted-foreground">None linked</p>
            ) : (
              <ul className="space-y-1.5">
                {linkedArticles.map((art) => (
                  <li key={art.id} className="flex items-center justify-between gap-2 text-xs">
                    <Link
                      href={`/admin/articles/${art.id}/edit`}
                      className="truncate font-medium text-foreground hover:text-primary hover:underline"
                    >
                      {art.title}
                    </Link>
                    <StatusBadge status={art.status} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h3 className="mb-2 text-xs font-medium text-muted-foreground">
              Case Studies ({linkedCaseStudies.length})
            </h3>
            {linkedCaseStudies.length === 0 ? (
              <p className="text-xs text-muted-foreground">None linked</p>
            ) : (
              <ul className="space-y-1.5">
                {linkedCaseStudies.map((cs) => (
                  <li key={cs.id} className="flex items-center justify-between gap-2 text-xs">
                    <Link
                      href={`/admin/case-studies/${cs.id}/edit`}
                      className="truncate font-medium text-foreground hover:text-primary hover:underline"
                    >
                      {cs.title}
                    </Link>
                    <StatusBadge status={cs.status} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h3 className="mb-2 text-xs font-medium text-muted-foreground">
              Statistics ({linkedStatistics.length})
            </h3>
            {linkedStatistics.length === 0 ? (
              <p className="text-xs text-muted-foreground">None linked</p>
            ) : (
              <ul className="space-y-1.5">
                {linkedStatistics.map((stat) => (
                  <li key={stat.id} className="text-xs">
                    <Link
                      href={`/admin/statistics/${stat.id}/edit`}
                      className="block truncate font-medium text-foreground hover:text-primary hover:underline"
                    >
                      {stat.indicator} ({stat.measurement_year})
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
