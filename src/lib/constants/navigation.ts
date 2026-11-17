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

/**
 * True when a dropdown should read as active, i.e. when the current route is
 * one of its links. Siblings such as `/our-planet` and `/solutions` live inside
 * the same menu as `/stories`, so matching only the trigger href would leave the
 * menu looking inactive while one of its children is open.
 */
export function isActiveNavGroup(
  pathname: string,
  item: { readonly href: string; readonly links?: readonly { readonly href: string }[] },
): boolean {
  if (isActivePath(pathname, item.href)) return true;
  return (item.links ?? []).some((link) => isActivePath(pathname, link.href));
}
