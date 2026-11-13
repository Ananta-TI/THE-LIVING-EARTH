import { Suspense } from "react";
import type { Metadata } from "next";
import {
  Droplets,
  Flame,
  Leaf,
  Recycle,
  RefreshCw,
  Shield,
  ShoppingBag,
  Sprout,
  Sun,
  Users,
} from "lucide-react";
import { ArticleCard } from "@/components/public/article-card";
import { Breadcrumbs } from "@/components/public/breadcrumbs";
import { CaseStudyCard } from "@/components/public/case-study-card";
import { CTASection } from "@/components/public/cta-section";
import { LoadingState } from "@/components/public/loading-state";
import { MotionReveal } from "@/components/public/motion-reveal";
import { PageHeroBanner } from "@/components/public/page-hero-banner";
import { SectionHeading } from "@/components/public/section-heading";
import { getPillarDetailBySlug } from "@/features/public/queries";

export const metadata: Metadata = {
  title: "Solutions & Restoration",
  description:
    "Explore grounded climate action, renewable energy transitions, forest and marine conservation, circular economy practices, ecosystem restoration, and community participation.",
  alternates: {
    canonical: "/solutions",
  },
};

const SOLUTIONS_AREAS = [
  {
    title: "Climate Action",
    tag: "Mitigation & Adaptation",
    description:
      "Cutting fossil emissions alongside heat-resilient urban planning and early-warning watershed infrastructure.",
    icon: Flame,
  },
  {
    title: "Renewable Energy",
    tag: "Clean Electrification",
    description:
      "Scaling solar, wind, geothermal, grid-scale storage, and electrified public transit across power systems.",
    icon: Sun,
  },
  {
    title: "Forest Conservation",
    tag: "Canopy Protection",
    description:
      "Protecting intact old-growth forests and Indigenous stewardship territories that hold irreplaceable carbon.",
    icon: Shield,
  },
  {
    title: "Marine Conservation",
    tag: "Ocean Sanctuaries",
    description:
      "Enforcing marine protected areas, sustainable fisheries governance, and reduced coastal nutrient runoff.",
    icon: Droplets,
  },
  {
    title: "Waste Reduction",
    tag: "Upstream Prevention",
    description:
      "Eliminating unnecessary single-use packaging, curbing food loss, and prioritizing durable design upstream.",
    icon: Recycle,
  },
  {
    title: "Circular Economy",
    tag: "Material Recovery",
    description:
      "Standardizing repairability, modular hardware, packaging reuse, and high-purity material recovery.",
    icon: RefreshCw,
  },
  {
    title: "Ecosystem Restoration",
    tag: "Rewilding & Rewetting",
    description:
      "Rewetting drained peatlands, removing obsolete river barriers, and replanting native mangrove belts.",
    icon: Sprout,
  },
  {
    title: "Sustainable Consumption",
    tag: "Everyday Stewardship",
    description:
      "Emphasizing resource-light diets where appropriate, extending appliance lifespans, and low-carbon mobility.",
    icon: ShoppingBag,
  },
  {
    title: "Biodiversity Protection",
    tag: "Habitat Corridors",
    description:
      "Linking fragmented habitats through wildlife corridors, riparian wetlands, and native plant buffers.",
    icon: Leaf,
  },
  {
    title: "Community Participation",
    tag: "Civic Science",
    description:
      "Engaging neighborhood watershed monitors, municipal canopy programs, and civic land-use planning.",
    icon: Users,
  },
] as const;

async function PublishedRestorationRecords() {
  const result = await getPillarDetailBySlug("solutions-restoration");
  if (result.status !== "ok" || !result.data) {
    return null;
  }

  const { articles, caseStudies } = result.data;
  if (articles.length === 0 && caseStudies.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="solutions-published-heading"
      className="mt-16 border-t border-border pt-14"
    >
      <SectionHeading
        headingId="solutions-published-heading"
        title="Published Restoration Stories & Case Studies"
        description="Verified reporting and field documentation tagged under Solutions & Restoration."
        actionLabel="Explore Pillar"
        actionHref="/explore/solutions-restoration"
      />

      {articles.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : null}

      {caseStudies.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((cs) => (
            <CaseStudyCard key={cs.id} caseStudy={cs} />
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default function SolutionsPage() {
  return (
    <>
      <PageHeroBanner
        eyebrow="Stewardship & Recovery"
        title="Solutions for a Greener Tomorrow"
        description="Small actions, big impact—evidence-based conservation, clean energy, and ecological restoration."
        imageSrc="/images/pillar-solutions.jpg"
        imageAlt="Young green sprout emerging from dark fertile soil"
      >
        <Breadcrumbs tone="dark" items={[{ label: "Home", href: "/" }, { label: "Solutions" }]} />
      </PageHeroBanner>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Clean Centered White Card Grid matching Screen 8 */}
        <section aria-labelledby="solutions-framework-heading">
          <SectionHeading
            headingId="solutions-framework-heading"
            title="Pathways for Ecological Recovery"
            description="Durable environmental recovery pairs systemic policy and clean infrastructure with measurable local restoration."
            align="center"
          />

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SOLUTIONS_AREAS.map((area, idx) => {
              const Icon = area.icon;
              return (
                <MotionReveal key={area.title} delay={(idx % 4) * 0.05}>
                  <article className="group flex h-full flex-col items-center justify-between rounded-xl border border-border bg-card p-6 text-center shadow-2xs transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-primary/45 hover:shadow-sm motion-reduce:transform-none">
                    <div className="flex flex-col items-center">
                      <span className="flex size-13 items-center justify-center rounded-lg bg-secondary text-primary transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-6 motion-reduce:transform-none">
                        <Icon className="size-6" aria-hidden="true" />
                      </span>

                      <h2 className="mt-4 font-heading text-xl font-medium text-foreground">
                        {area.title}
                      </h2>

                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                        {area.description}
                      </p>
                    </div>

                    <span className="mt-5 inline-flex items-center rounded-full bg-secondary/70 px-3 py-1 text-[11px] font-medium text-primary">
                      {area.tag}
                    </span>
                  </article>
                </MotionReveal>
              );
            })}
          </div>
        </section>

        <Suspense fallback={<LoadingState label="Loading published restoration dispatches..." />}>
          <PublishedRestorationRecords />
        </Suspense>

        <div className="mt-16">
          <CTASection
            title="Together, we can make a difference."
            description="Share a verified conservation case study, educational resource, or research inquiry with our editorial desk."
            primaryLabel="Take Action"
            primaryHref="/contact"
            secondaryLabel="Explore Our Planet"
            secondaryHref="/our-planet"
          />
        </div>
      </div>
    </>
  );
}
