import siteSettings from "@/data/site-settings.json";

export interface NavItem {
  readonly label: string;
  readonly href: string;
  readonly description: string;
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

export const MAIN_NAV_ITEMS: readonly NavItem[] = [
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
  },
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
    description: "Evidence-based conservation, restoration, and practical action",
  },
  {
    label: "Contact",
    href: "/contact",
    description: "Reader inquiries, collaboration, and data correction reports",
  },
] as const;

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
