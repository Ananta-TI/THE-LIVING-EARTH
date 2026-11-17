import siteSettings from "@/data/site-settings.json";

export interface NavItem {
  readonly label: string;
  readonly href: string;
  readonly description: string;
}

/** A link inside a header dropdown. */
export interface NavMenuLink {
  readonly label: string;
  readonly href: string;
  readonly description: string;
}

/** A header dropdown: a top-level trigger plus the links it reveals. */
export interface NavMenuItem extends NavItem {
  readonly links: readonly NavMenuLink[];
}

export const SITE_CONFIG = {
  name: "THE LIVING EARTH",
  tagline: "A Journey Through Our Changing Planet",
  description:
    "An editorial environmental knowledge and storytelling platform dedicated to exploring global ecological challenges, verified scientific data, and conservation solutions.",
  locale: "en-US",
  contactEmail:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ||
    siteSettings.general.contact_email ||
    siteSettings.site_identity.contactEmail ||
    "editorial@thelivingearth.org",
} as const;

export function getSiteBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured && /^https?:\/\//i.test(configured)) {
    return configured.replace(/\/+$/, "");
  }

  const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProductionUrl) {
    return `https://${vercelProductionUrl.replace(/^https?:\/\//i, "").replace(/\/+$/, "")}`;
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    return `https://${vercelUrl.replace(/^https?:\/\//i, "").replace(/\/+$/, "")}`;
  }

  return "http://localhost:3000";
}

/**
 * Header navigation.
 *
 * Home, About and Contact stay as top-level links. The four content sections
 * are gathered into two dropdowns so the bar does not have to fit seven
 * destinations, which is what previously forced the desktop nav to wait until
 * the `xl` breakpoint.
 */
export const MAIN_NAV_ITEMS: readonly (NavItem | NavMenuItem)[] = [
  {
    label: "Home",
    href: "/",
    description: "Editorial overview of our changing planet",
  },
  {
    label: "About",
    href: "/about",
    description: "Vision, mission, editorial principles, and approach",
  },
  {
    label: "Explore",
    href: "/explore",
    description: "Five thematic environmental knowledge pillars",
    links: [
      {
        label: "All domains",
        href: "/explore",
        description: "The five pillars as one reading instrument",
      },
      {
        label: "Climate & Atmosphere",
        href: "/explore/climate-atmosphere",
        description: "Warming trends, atmospheric carbon, and extreme weather",
      },
      {
        label: "Oceans & Water",
        href: "/explore/oceans-water",
        description: "Marine heat, coral reefs, and freshwater security",
      },
      {
        label: "Forests & Biodiversity",
        href: "/explore/forests-biodiversity",
        description: "Primary forests, carbon sinks, and wildlife corridors",
      },
      {
        label: "Pollution & Human Impact",
        href: "/explore/pollution-human-impact",
        description: "Air quality, waste streams, and extraction footprints",
      },
      {
        label: "Solutions & Restoration",
        href: "/explore/solutions-restoration",
        description: "Conservation, restoration, and practical action",
      },
    ],
  },
  {
    label: "Field Notes",
    href: "/stories",
    description: "Reporting, case studies, and measured planetary conditions",
    links: [
      {
        label: "Stories",
        href: "/stories",
        description: "Published editorial essays and environmental reporting",
      },
      {
        label: "Our Planet",
        href: "/our-planet",
        description: "Global conditions, verified indicators, and case studies",
      },
      {
        label: "Solutions",
        href: "/solutions",
        description: "Evidence-based conservation and restoration frameworks",
      },
    ],
  },
  {
    label: "Contact",
    href: "/contact",
    description: "Reader inquiries, collaboration, and data correction reports",
  },
] as const;

/** Narrows a header nav entry to the dropdown form. */
export function isNavMenuItem(item: NavItem | NavMenuItem): item is NavMenuItem {
  return "links" in item && item.links.length > 0;
}

export const SUPPORTING_NAV_ITEMS: readonly NavItem[] = [
  {
    label: "Editorial Approach",
    href: "/about#approach",
    description: "How we combine storytelling with scientific attribution",
  },
  {
    label: "Verified Data & Sources",
    href: "/our-planet#sources",
    description: "Primary scientific references cited across published data",
  },
  {
    label: "Practical Solutions",
    href: "/solutions",
    description: "Conservation, restoration, and sustainable action frameworks",
  },
  {
    label: "Submit a Data Inquiry",
    href: "/contact",
    description: "Contact the editorial desk or report a factual correction",
  },
] as const;
