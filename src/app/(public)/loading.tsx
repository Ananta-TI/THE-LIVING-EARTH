import { LoadingState } from "@/components/public/loading-state";

export default function PublicLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <LoadingState label="Loading editorial content..." />
    </div>
  );
}
