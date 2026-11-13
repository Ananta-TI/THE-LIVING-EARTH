/**
 * Converts an arbitrary title into a URL-safe lowercase kebab-case slug
 * compatible with the database `^[a-z0-9]+(?:-[a-z0-9]+)*$` check constraints.
 */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export const KEBAB_SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
