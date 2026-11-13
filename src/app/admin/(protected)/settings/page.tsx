import { SettingsManager } from "@/components/admin/settings/settings-manager";
import { ErrorState } from "@/components/admin/shared/error-state";
import { PageHeader } from "@/components/admin/shared/page-header";
import { getSiteSettingsBundle } from "@/features/settings/queries";

export default async function AdminSettingsPage() {
  const result = await getSiteSettingsBundle();

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Website Settings"
        description="Configure public platform identity, social media links, default SEO metadata, and footer statements."
      />
      {result.ok ? (
        <SettingsManager initialSettings={result.data} />
      ) : (
        <ErrorState message={result.error} retryHref="/admin" />
      )}
    </div>
  );
}
