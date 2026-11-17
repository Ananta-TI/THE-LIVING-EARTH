import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { EditorialPageHero } from "@/components/public/editorial-page-hero";
import { EditorialSection } from "@/components/public/editorial-section";
import { LoadingState } from "@/components/public/loading-state";
import { StoryLedger } from "@/components/public/story-ledger";
import { getPillarDetailBySlug } from "@/features/public/queries";

export const metadata: Metadata = {
  title: "Solutions & Restoration",
  description:
    "Explore grounded climate action, renewable energy transitions, forest and marine conservation, circular economy practices, ecosystem restoration, and community participation.",
  alternates: {
    canonical: "/solutions",
  },
};

const PATHWAYS = [
  {
    title: "Climate Action",
    tag: "Mitigation & adaptation",
    description:
      "Cutting fossil emissions alongside heat-resilient urban planning and early-warning watershed infrastructure.",
  },
  {
    title: "Renewable Energy",
    tag: "Clean electrification",
    description:
      "Scaling solar, wind, geothermal, grid-scale storage, and electrified public transit across power systems.",
  },
  {
    title: "Forest Conservation",
    tag: "Canopy protection",
    description:
      "Protecting intact old-growth forests and Indigenous stewardship territories that hold irreplaceable carbon.",
  },
  {
    title: "Marine Conservation",
    tag: "Ocean sanctuaries",
    description:
      "Enforcing marine protected areas, sustainable fisheries governance, and reduced coastal nutrient runoff.",
  },
  {
    title: "Waste Reduction",
    tag: "Upstream prevention",
    description:
      "Eliminating unnecessary single-use packaging, curbing food loss, and prioritizing durable design upstream.",
  },
  {
    title: "Circular Economy",
    tag: "Material recovery",
    description:
      "Standardizing repairability, modular hardware, packaging reuse, and high-purity material recovery.",
  },
  {
    title: "Ecosystem Restoration",
    tag: "Rewilding & rewetting",
    description:
      "Rewetting drained peatlands, removing obsolete river barriers, and replanting native mangrove belts.",
  },
  {
    title: "Sustainable Consumption",
    tag: "Everyday stewardship",
    description:
      "Resource-light diets where appropriate, extended appliance lifespans, and low-carbon mobility.",
  },
  {
    title: "Biodiversity Protection",
    tag: "Habitat corridors",
    description:
      "Linking fragmented habitats through wildlife corridors, riparian wetlands, and native plant buffers.",
  },
  {
    title: "Community Participation",
    tag: "Civic science",
    description:
      "Engaging neighborhood watershed monitors, municipal canopy programs, and civic land-use planning.",
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
    <EditorialSection
      className="mt-20 scroll-mt-28 sm:mt-28"
      headingId="solutions-published-heading"
      index="Section 04"
      title="Documented restoration on file"
      lede="Every note and field study tagged under Solutions & Restoration, in the order it was recorded."
      aside={
        <Link
          href="/explore/solutions-restoration"
          className="group/x inline-flex items-center gap-2 border-b border-foreground/25 pb-1 text-sm font-medium text-foreground transition-colors duration-200 hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <span>Open the domain page</span>
          <span
            aria-hidden="true"
            className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/x:translate-x-1 motion-reduce:transform-none"
          >
            &rarr;
          </span>
        </Link>
      }
    >
      {articles.length > 0 ? <StoryLedger articles={articles} /> : null}

      {caseStudies.length > 0 ? (
        <ol className="mt-10 border-t border-border">
          {caseStudies.map((caseStudy, index) => (
            <li key={caseStudy.id} className="border-b border-border">
              <Link
                href={`/case-studies/${caseStudy.slug}`}
                className="group/row grid gap-x-8 gap-y-3 py-7 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring lg:grid-cols-12"
              >
                <div className="lg:col-span-8">
                  <p className="font-mono text-[10px] tracking-[0.12em] text-earth-muted tabular-nums">
                    CS {String(index + 1).padStart(2, "0")} &middot; {caseStudy.country}
                  </p>
                  <h3 className="mt-3 max-w-[30ch] font-heading text-xl leading-snug text-foreground transition-colors duration-200 group-hover/row:text-primary sm:text-2xl">
                    {caseStudy.title}
                  </h3>
                  <p className="mt-3 line-clamp-2 max-w-[62ch] text-sm leading-relaxed text-muted-foreground">
                    {caseStudy.summary}
                  </p>
                </div>
                <dl className="lg:col-span-4 lg:pt-6">
                  <div className="flex items-baseline gap-2">
                    <dt className="sr-only">Domain</dt>
                    <dd className="font-mono text-[10px] tracking-[0.12em] text-earth-muted">
                      {caseStudy.pillarName}
                    </dd>
                  </div>
                  {caseStudy.organization ? (
                    <div className="mt-2 flex items-baseline gap-2">
                      <dt className="sr-only">Organisation</dt>
                      <dd className="font-mono text-[10px] leading-relaxed tracking-[0.12em] text-earth-muted">
                        {caseStudy.organization}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </Link>
            </li>
          ))}
        </ol>
      ) : null}
    </EditorialSection>
  );
}

export default function SolutionsPage() {
  return (
    <>
      <EditorialPageHero
        index="Section 06"
        context="Stewardship and recovery"
        title="What restoration currently looks like"
        standfirst="Ten working pathways — from grid decarbonisation to peatland rewetting — each paired with the field evidence that supports it. Nothing here is a silver bullet."
        imageSrc="/images/pillar-solutions.jpg"
        imageAlt="Young green sprout emerging from dark fertile soil"
      />

      <div className="mx-auto w-full max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
        <EditorialSection
          headingId="solutions-pathways-heading"
          index="Section 02"
          title="Pathways for ecological recovery"
          lede="Durable recovery pairs systemic policy and clean infrastructure with measurable local restoration. Each pathway below names what it addresses and where it operates."
        >
          <ol className="grid border-t border-border sm:grid-cols-2 xl:grid-cols-3">
            {PATHWAYS.map((pathway, index) => (
              <li
                key={pathway.title}
                className="border-b border-border px-0 py-5 sm:px-5 sm:[&:nth-child(2n)]:border-l xl:px-6 xl:[&:nth-child(2n)]:border-l-0 xl:[&:nth-child(3n+2)]:border-l xl:[&:nth-child(3n)]:border-l"
              >
                <p className="font-mono text-[10px] tracking-[0.12em] text-earth-muted tabular-nums">
                  {String(index + 1).padStart(2, "0")} &middot; {pathway.tag}
                </p>
                <h3 className="mt-2 font-heading text-lg leading-snug text-foreground sm:text-xl">
                  {pathway.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {pathway.description}
                </p>
              </li>
            ))}
          </ol>
        </EditorialSection>

        <Suspense fallback={<LoadingState label="Loading published restoration records..." />}>
          <PublishedRestorationRecords />
        </Suspense>

        <EditorialSection
          className="mt-20 scroll-mt-28 sm:mt-28"
          headingId="solutions-contact-heading"
          index="Section 05"
          title="Have a documented case study?"
          lede="We publish conservation work that names its site, its implementing organisation, and its measured outcome. Send us the record and the source."
          aside={
            <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
              <Link
                href="/contact"
                className="group/x inline-flex items-center gap-2 border-b border-foreground/25 pb-1 text-sm font-medium text-foreground transition-colors duration-200 hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                <span>Submit a record</span>
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/x:translate-x-1 motion-reduce:transform-none"
                >
                  &rarr;
                </span>
              </Link>
              <Link
                href="/our-planet"
                className="text-sm text-muted-foreground underline-offset-4 transition-colors duration-200 hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                See the global pressures
              </Link>
            </div>
          }
        >
          <p className="max-w-[70ch] text-[15px] leading-relaxed text-muted-foreground">
            THE LIVING EARTH does not publish restoration claims without an assigned
            implementing organisation, a location, and a measurement period. If a project is
            still in progress, we file it as a case study rather than a result.
          </p>
        </EditorialSection>
      </div>
    </>
  );
}
