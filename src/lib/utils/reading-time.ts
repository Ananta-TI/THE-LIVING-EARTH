/**
 * Reliably estimates reading time in minutes from Markdown prose.
 * Returns `null` when text is too brief (< 30 words) to compute a meaningful estimate.
 */
export function estimateReadingTimeMinutes(markdown: string | null | undefined): number | null {
  if (!markdown) return null;
  const plain = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#>*_~|-]+/g, " ")
    .trim();

  if (!plain) return null;
  const words = plain.split(/\s+/).filter(Boolean).length;
  if (words < 30) return null;

  return Math.max(1, Math.ceil(words / 200));
}
