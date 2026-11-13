import { getSupabasePublicEnv } from "@/lib/validations/env";

const PILLAR_FALLBACK_IMAGES: Record<string, string> = {
  "climate-atmosphere": "/images/pillar-climate.jpg",
  "oceans-water": "/images/sea-turtle.jpg",
  "forests-biodiversity": "/images/pillar-forests.jpg",
  "pollution-human-impact": "/images/pillar-pollution.jpg",
  "solutions-restoration": "/images/pillar-solutions.jpg",
};

const KNOWN_BUCKETS = [
  "article-images",
  "case-study-images",
  "pillar-images",
  "site-assets",
] as const;

export function getPillarFallbackImage(slug?: string | null): string {
  if (slug && PILLAR_FALLBACK_IMAGES[slug]) {
    return PILLAR_FALLBACK_IMAGES[slug];
  }
  return "/images/hero-planet.jpg";
}

/**
 * Resolves a stored `cover_image_path` (full URL, bucket-prefixed path,
 * or filename inside a known bucket) into a safe image URL with a domain-matched fallback.
 */
export function resolveEditorialImageUrl(
  rawPath: string | null | undefined,
  options?: {
    readonly defaultBucket?: (typeof KNOWN_BUCKETS)[number];
    readonly pillarSlug?: string | null;
  },
): string {
  const trimmed = rawPath?.trim();
  if (!trimmed) {
    return getPillarFallbackImage(options?.pillarSlug);
  }

  if (trimmed.startsWith("https://") || trimmed.startsWith("http://") || trimmed.startsWith("/")) {
    return trimmed;
  }

  const env = getSupabasePublicEnv();
  if (!env.configured || !env.url) {
    return getPillarFallbackImage(options?.pillarSlug);
  }

  const normalized = trimmed.replace(/^\/+/, "");
  const matchedBucket = KNOWN_BUCKETS.find((bucket) => normalized.startsWith(`${bucket}/`));
  if (matchedBucket) {
    return `${env.url}/storage/v1/object/public/${normalized}`;
  }

  const bucket = options?.defaultBucket ?? "article-images";
  return `${env.url}/storage/v1/object/public/${bucket}/${normalized}`;
}
