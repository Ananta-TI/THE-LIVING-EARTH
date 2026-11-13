export type PillarSlug =
  | "climate-atmosphere"
  | "oceans-water"
  | "forests-biodiversity"
  | "pollution-human-impact"
  | "solutions-restoration";

export interface ContentPillar {
  readonly order: number;
  readonly code: string;
  readonly slug: PillarSlug;
  readonly title: string;
  readonly subtitle: string;
  readonly href: string;
}

export const CONTENT_PILLARS: readonly ContentPillar[] = [
  {
    order: 1,
    code: "01",
    slug: "climate-atmosphere",
    title: "Climate & Atmosphere",
    subtitle: "Earth's climate system, atmospheric dynamics, and long-term warming trends",
    href: "/explore/climate-atmosphere",
  },
  {
    order: 2,
    code: "02",
    slug: "oceans-water",
    title: "Oceans & Water",
    subtitle: "Marine ecosystems, coral reefs, freshwater cycles, and global water security",
    href: "/explore/oceans-water",
  },
  {
    order: 3,
    code: "03",
    slug: "forests-biodiversity",
    title: "Forests & Biodiversity",
    subtitle: "Primary forests, land-cover balance, and terrestrial biodiversity habitats",
    href: "/explore/forests-biodiversity",
  },
  {
    order: 4,
    code: "04",
    slug: "pollution-human-impact",
    title: "Pollution & Human Impact",
    subtitle: "Air quality, plastic & electronic waste, and human footprints on ecosystems",
    href: "/explore/pollution-human-impact",
  },
  {
    order: 5,
    code: "05",
    slug: "solutions-restoration",
    title: "Solutions & Restoration",
    subtitle: "Evidence-based conservation, ecosystem restoration, and sustainable living",
    href: "/explore/solutions-restoration",
  },
] as const;
