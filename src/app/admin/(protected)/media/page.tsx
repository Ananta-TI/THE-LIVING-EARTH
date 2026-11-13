import { MediaLibrary } from "@/components/admin/media/media-library";
import { ErrorState } from "@/components/admin/shared/error-state";
import { PageHeader } from "@/components/admin/shared/page-header";
import { getMediaAssets } from "@/features/media/queries";

export default async function AdminMediaPage() {
  const result = await getMediaAssets();

  return (
    <div>
      <PageHeader
        title="Media Library"
        description="Upload verified editorial photography and brand assets across Supabase Storage buckets."
      />
      {result.ok ? (
        <MediaLibrary assets={result.data} />
      ) : (
        <ErrorState message={result.error} retryHref="/admin" />
      )}
    </div>
  );
}
