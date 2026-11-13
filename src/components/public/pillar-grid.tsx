import { PillarCard } from "@/components/public/pillar-card";

export interface PillarGridItem {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly description: string;
  readonly cover_image_path?: string | null;
  readonly topics?: readonly { readonly id: string; readonly name: string }[];
  readonly publishedArticlesCount?: number;
}

interface PillarGridProps {
  readonly pillars: readonly PillarGridItem[];
  readonly variant?: "portrait" | "circular";
}

export function PillarGrid({ pillars, variant = "portrait" }: PillarGridProps) {
  return (
    <div
      className={
        variant === "circular"
          ? "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
          : "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
      }
    >
      {pillars.map((pillar) => (
        <PillarCard
          key={pillar.id}
          slug={pillar.slug}
          name={pillar.name}
          description={pillar.description}
          coverImagePath={pillar.cover_image_path}
          topics={pillar.topics}
          articlesCount={pillar.publishedArticlesCount}
          variant={variant}
        />
      ))}
    </div>
  );
}
