export const ALLOWED_MEDIA_BUCKETS = [
  "article-images",
  "case-study-images",
  "pillar-images",
  "site-assets",
] as const;

export type MediaBucketName = (typeof ALLOWED_MEDIA_BUCKETS)[number];

export const MAX_MEDIA_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MiB

export function isAllowedMediaBucket(value: string): value is MediaBucketName {
  return (ALLOWED_MEDIA_BUCKETS as readonly string[]).includes(value);
}

export interface DetectedImageFormat {
  readonly mimeType: "image/jpeg" | "image/png" | "image/webp" | "image/avif" | "image/svg+xml";
  readonly extension: "jpg" | "png" | "webp" | "avif" | "svg";
}

function isSafeSvgText(rawText: string): boolean {
  const lower = rawText.toLowerCase();
  if (!lower.includes("<svg")) return false;
  if (
    lower.includes("<script") ||
    lower.includes("javascript:") ||
    lower.includes("<foreignobject") ||
    /\son[a-z]+\s*=/i.test(rawText)
  ) {
    return false;
  }
  return true;
}

/**
 * Inspects file magic bytes to verify the true file format instead of trusting client headers.
 */
export function detectValidatedImageFormat(
  bytes: Uint8Array,
  bucket: MediaBucketName,
): DetectedImageFormat | null {
  if (bytes.length < 12) {
    return null;
  }

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { mimeType: "image/jpeg", extension: "jpg" };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return { mimeType: "image/png", extension: "png" };
  }

  // WebP: RIFF....WEBP
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return { mimeType: "image/webp", extension: "webp" };
  }

  // AVIF: ....ftypavif / ....ftypavis
  const ftyp = String.fromCharCode(bytes[4], bytes[5], bytes[6], bytes[7]);
  if (ftyp === "ftyp") {
    const headerSlice = String.fromCharCode(...bytes.slice(8, Math.min(bytes.length, 32)));
    if (headerSlice.includes("avif") || headerSlice.includes("avis")) {
      return { mimeType: "image/avif", extension: "avif" };
    }
  }

  // SVG allowed strictly in `site-assets` after active-content checks
  if (bucket === "site-assets") {
    const text = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
    if (isSafeSvgText(text)) {
      return { mimeType: "image/svg+xml", extension: "svg" };
    }
  }

  return null;
}

export function sanitizeBaseFilename(originalName: string): string {
  const withoutExt = originalName.replace(/\.[^.]+$/, "");
  const cleaned = withoutExt
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return cleaned || "asset";
}
