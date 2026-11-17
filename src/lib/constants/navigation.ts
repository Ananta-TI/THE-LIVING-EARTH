// Pages with a dark page hero that the fixed header overlays.
export const HERO_PAGE_PATHS = [
  "/",
  "/about",
  "/explore",
  "/stories",
  "/our-planet",
  "/solutions",
  "/contact",
] as const;

const HERO_PAGE_SET: ReadonlySet<string> = new Set(HERO_PAGE_PATHS);

/**
 * Returns true for routes whose first section is a full-bleed, dark page hero
 * (`HeroSection` or `PageHeroBanner`), including pillar detail pages.
 * Detail pages that open on a light breadcrumb area are excluded.
 */
export function hasDarkPageHero(pathname: string): boolean {
  return HERO_PAGE_SET.has(pathname) || pathname.startsWith("/explore/");
}

export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
