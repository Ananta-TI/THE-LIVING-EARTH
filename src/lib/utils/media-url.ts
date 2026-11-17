const PILLAR_FALLBACK_IMAGES: Record<string, string> = {
  "climate-atmosphere": "/images/pillar-climate.jpg",
  "oceans-water": "/images/sea-turtle.jpg",
  "forests-biodiversity": "/images/pillar-forests.jpg",
  "pollution-human-impact": "/images/pillar-pollution.jpg",
  "solutions-restoration": "/images/pillar-solutions.jpg",
};

export function getPillarFallbackImage(slug?: string | null): string {
  if (slug && PILLAR_FALLBACK_IMAGES[slug]) {
    return PILLAR_FALLBACK_IMAGES[slug];
  }
  return "/images/hero-planet.jpg";
}

/**
 * Resolves a JSON `cover_image_path` into a public image URL.
 *
 * Editorial JSON stores local paths such as `/images/pillar-forests.jpg`.
 * Absolute HTTP(S) URLs are also supported for future external assets.
 * Missing or legacy values fall back to a pillar image.
 */
export function resolveEditorialImageUrl(
  rawPath: string | null | undefined,
  options?: {
    readonly pillarSlug?: string | null;
  },
): string {
  const trimmed = rawPath?.trim();
  if (!trimmed) {
    return getPillarFallbackImage(options?.pillarSlug);
  }

  if (trimmed.startsWith("/") || /^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return getPillarFallbackImage(options?.pillarSlug);
}
