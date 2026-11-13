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
} as const;

export function getSiteBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured && /^https?:\/\//i.test(configured)) {
    return configured.replace(/\/+$/, "");
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

export const ADMIN_NAV_ITEMS: readonly NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    description: "Editorial overview, live counts, and quick actions",
  },
  {
    label: "Articles",
    href: "/admin/articles",
    description: "Editorial stories, drafts, and published features",
  },
  {
    label: "Pillars",
    href: "/admin/pillars",
    description: "Core environmental content pillars",
  },
  {
    label: "Topics",
    href: "/admin/topics",
    description: "Subtopics and thematic taxonomy under each pillar",
  },
  {
    label: "Case Studies",
    href: "/admin/case-studies",
    description: "Global geographic environmental case studies",
  },
  {
    label: "Statistics",
    href: "/admin/statistics",
    description: "Verified scientific indicators and datasets",
  },
  {
    label: "References",
    href: "/admin/references",
    description: "Scientific citations and authoritative sources",
  },
  {
    label: "Media Library",
    href: "/admin/media",
    description: "Editorial imagery and Supabase storage assets",
  },
  {
    label: "Messages",
    href: "/admin/messages",
    description: "Public contact submissions and corrections inbox",
  },
  {
    label: "Settings",
    href: "/admin/settings",
    description: "Platform identity, SEO defaults, and footer config",
  },
] as const;
