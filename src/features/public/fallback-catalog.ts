import type {
  ArticleRow,
  CaseStudyRow,
  ExplorePillarItem,
  PillarRow,
  PublicArticleCard,
  PublicCaseStudyCard,
  PublicStatisticWithSource,
  ReferenceRow,
  TopicRow,
} from "@/features/public/queries";

export const FALLBACK_PILLARS: readonly PillarRow[] = [
  {
    id: "pillar-climate-atmosphere",
    name: "Climate & Atmosphere",
    slug: "climate-atmosphere",
    description:
      "Understanding our changing climate—from rising global temperatures and atmospheric carbon to extreme weather and cryosphere shifts.",
    cover_image_path: "/images/pillar-climate.jpg",
    display_order: 1,
    is_active: true,
    created_at: "2025-01-10T00:00:00Z",
    updated_at: "2025-04-24T00:00:00Z",
  },
  {
    id: "pillar-oceans-water",
    name: "Oceans & Water",
    slug: "oceans-water",
    description:
      "Marine ecosystems, coral reefs, ocean heat absorption, carbonate chemistry, and global freshwater watershed security.",
    cover_image_path: "/images/sea-turtle.jpg",
    display_order: 2,
    is_active: true,
    created_at: "2025-01-10T00:00:00Z",
    updated_at: "2025-04-24T00:00:00Z",
  },
  {
    id: "pillar-forests-biodiversity",
    name: "Forests & Biodiversity",
    slug: "forests-biodiversity",
    description:
      "Primary rainforests, boreal carbon sinks, wildlife corridors, and the living web of terrestrial biodiversity.",
    cover_image_path: "/images/pillar-forests.jpg",
    display_order: 3,
    is_active: true,
    created_at: "2025-01-10T00:00:00Z",
    updated_at: "2025-04-24T00:00:00Z",
  },
  {
    id: "pillar-pollution-human-impact",
    name: "Pollution & Human Impact",
    slug: "pollution-human-impact",
    description:
      "Air quality, industrial emissions, plastic polymers, and human extraction footprints across land and water.",
    cover_image_path: "/images/pillar-pollution.jpg",
    display_order: 4,
    is_active: true,
    created_at: "2025-01-10T00:00:00Z",
    updated_at: "2025-04-24T00:00:00Z",
  },
  {
    id: "pillar-solutions-restoration",
    name: "Solutions & Restoration",
    slug: "solutions-restoration",
    description:
      "Renewable energy transitions, mangrove and forest restoration, circular material systems, and community stewardship.",
    cover_image_path: "/images/pillar-solutions.jpg",
    display_order: 5,
    is_active: true,
    created_at: "2025-01-10T00:00:00Z",
    updated_at: "2025-04-24T00:00:00Z",
  },
];

export const FALLBACK_TOPICS: readonly TopicRow[] = [
  {
    id: "topic-rising-temperatures",
    pillar_id: "pillar-climate-atmosphere",
    name: "Rising Temperatures",
    slug: "rising-temperatures",
    description: "Global surface warming anomalies and regional heatwave intensification.",
    display_order: 1,
    is_active: true,
    created_at: "2025-01-10T00:00:00Z",
    updated_at: "2025-04-24T00:00:00Z",
  },
  {
    id: "topic-extreme-weather",
    pillar_id: "pillar-climate-atmosphere",
    name: "Extreme Weather",
    slug: "extreme-weather",
    description: "Shifts in monsoon reliability, severe droughts, and cyclonic rainfall.",
    display_order: 2,
    is_active: true,
    created_at: "2025-01-10T00:00:00Z",
    updated_at: "2025-04-24T00:00:00Z",
  },
  {
    id: "topic-sea-level-rise",
    pillar_id: "pillar-climate-atmosphere",
    name: "Sea Level Rise",
    slug: "sea-level-rise",
    description: "Thermal ocean expansion and cryosphere ice-sheet mass loss.",
    display_order: 3,
    is_active: true,
    created_at: "2025-01-10T00:00:00Z",
    updated_at: "2025-04-24T00:00:00Z",
  },
  {
    id: "topic-coral-reefs",
    pillar_id: "pillar-oceans-water",
    name: "Coral Reefs & Blue Carbon",
    slug: "coral-reefs-blue-carbon",
    description: "Tropical reef thermal resilience, seagrass meadows, and mangrove nurseries.",
    display_order: 1,
    is_active: true,
    created_at: "2025-01-10T00:00:00Z",
    updated_at: "2025-04-24T00:00:00Z",
  },
  {
    id: "topic-primary-forests",
    pillar_id: "pillar-forests-biodiversity",
    name: "Primary Forest Conservation",
    slug: "primary-forest-conservation",
    description: "Old-growth canopy retention, biodiversity corridors, and watershed protection.",
    display_order: 1,
    is_active: true,
    created_at: "2025-01-10T00:00:00Z",
    updated_at: "2025-04-24T00:00:00Z",
  },
];

export const FALLBACK_REFERENCES: readonly ReferenceRow[] = [
  {
    id: "ref-ipcc-ar6",
    title: "Climate Change 2023: Synthesis Report (Sixth Assessment Report)",
    organization: "Intergovernmental Panel on Climate Change (IPCC)",
    author: "IPCC Core Writing Team",
    publication_date: "2023-03-20",
    source_type: "international_organization",
    source_url: "https://www.ipcc.ch/report/ar6/syr/",
    accessed_at: "2025-04-24",
    notes: "Primary reference for global mean surface temperature rise (~1.1–1.2°C above 1850–1900).",
    created_at: "2025-01-10T00:00:00Z",
    updated_at: "2025-04-24T00:00:00Z",
  },
  {
    id: "ref-noaa-acidification",
    title: "Ocean Acidification: Saturation State & Surface pH Observations",
    organization: "National Oceanic and Atmospheric Administration (NOAA PMEL)",
    author: "NOAA Pacific Marine Environmental Laboratory",
    publication_date: "2023-06-15",
    source_type: "government_data",
    source_url: "https://www.pmel.noaa.gov/co2/story/What+is+Ocean+Acidification%3F",
    accessed_at: "2025-04-24",
    notes: "Verified marine carbonate chemistry indicator (~30% increase in surface acidity).",
    created_at: "2025-01-10T00:00:00Z",
    updated_at: "2025-04-24T00:00:00Z",
  },
  {
    id: "ref-fao-fra",
    title: "Global Forest Resources Assessment (FRA): Forest Extent and Changes",
    organization: "Food and Agriculture Organization of the United Nations (FAO)",
    author: "FAO Forestry Division",
    publication_date: "2022-05-02",
    source_type: "international_organization",
    source_url: "https://www.fao.org/forest-resources-assessment/en/",
    accessed_at: "2025-04-24",
    notes: "Global terrestrial forest cover benchmark (~31% of global land area).",
    created_at: "2025-01-10T00:00:00Z",
    updated_at: "2025-04-24T00:00:00Z",
  },
];

export const FALLBACK_STATISTICS: readonly PublicStatisticWithSource[] = [
  {
    id: "stat-global-temp-rise",
    pillar_id: "pillar-climate-atmosphere",
    indicator: "Global Temp Rise",
    value: 1.2,
    unit: "°C",
    measurement_year: 2023,
    publication_date: "2023-03-20",
    geographic_scope: "Global Mean Surface",
    data_type: "historical_observation",
    methodology:
      "Observed human-induced warming of global mean surface temperature relative to the 1850–1900 pre-industrial baseline.",
    limitations: "Decadal averaging across land and marine surface temperature stations.",
    reference_id: "ref-ipcc-ar6",
    status: "published",
    created_at: "2025-01-10T00:00:00Z",
    updated_at: "2025-04-24T00:00:00Z",
    pillarName: "Climate & Atmosphere",
    pillarSlug: "climate-atmosphere",
    reference: FALLBACK_REFERENCES[0]!,
  },
  {
    id: "stat-ocean-acidification",
    pillar_id: "pillar-oceans-water",
    indicator: "Ocean Acidification",
    value: 30,
    unit: "%",
    measurement_year: 2023,
    publication_date: "2023-06-15",
    geographic_scope: "Global Surface Oceans",
    data_type: "historical_observation",
    methodology:
      "Approximate percentage increase in surface ocean acidity (hydrogen ion concentration) since the beginning of the industrial era.",
    limitations: "Calculated from ~0.1 pH unit decline across open-ocean time-series stations.",
    reference_id: "ref-noaa-acidification",
    status: "published",
    created_at: "2025-01-10T00:00:00Z",
    updated_at: "2025-04-24T00:00:00Z",
    pillarName: "Oceans & Water",
    pillarSlug: "oceans-water",
    reference: FALLBACK_REFERENCES[1]!,
  },
  {
    id: "stat-forest-cover",
    pillar_id: "pillar-forests-biodiversity",
    indicator: "Global Forest Cover",
    value: 31,
    unit: "%",
    measurement_year: 2022,
    publication_date: "2022-05-02",
    geographic_scope: "Global Land Area",
    data_type: "current_estimate",
    methodology:
      "Share of Earth's total land surface covered by forest ecosystems (~4.06 billion hectares), vital for carbon storage and terrestrial biodiversity.",
    limitations: "Includes primary, naturally regenerating, and planted forest area.",
    reference_id: "ref-fao-fra",
    status: "published",
    created_at: "2025-01-10T00:00:00Z",
    updated_at: "2025-04-24T00:00:00Z",
    pillarName: "Forests & Biodiversity",
    pillarSlug: "forests-biodiversity",
    reference: FALLBACK_REFERENCES[2]!,
  },
];

const ARTICLE_BODY_CLIMATE_ACTION = `## Understanding the Pace of Planetary Warming

Earth's climate system is governed by a delicate radiative balance. As concentrations of carbon dioxide, methane, and nitrous oxide continue to accumulate in the atmosphere, outgoing infrared energy is trapped within the lower troposphere, raising global mean temperatures to roughly **1.2°C above pre-industrial baselines**.

While a single degree may sound modest in daily weather terms, across planetary oceans, ice sheets, and continental watersheds it represents an enormous addition of thermal energy.

### Key Ecological Pressures

- **Shifting Hydrological Regimes:** Warmer air holds approximately 7% more water vapor per degree Celsius, intensifying downpours in wet regions while accelerating soil moisture evaporation across semi-arid agricultural belts.
- **Cryosphere Retreat:** Mountain glaciers in the Alps, Andes, and Himalayas—which act as natural seasonal water towers for hundreds of millions of people—are losing mass at historic rates.
- **Compound Extremes:** Heatwaves increasingly coincide with prolonged drought, stressing primary forest canopies and elevating wildfire risk.

> "Every increment of global warming avoided reduces the frequency and intensity of extreme heat, heavy precipitation, and ecological disruption." — IPCC Sixth Assessment Synthesis

### Pathways Forward

Stabilizing global temperatures requires a dual commitment: rapid structural decarbonization of energy, transport, and industry alongside large-scale protection and restoration of natural carbon sinks—including primary forests, peatlands, and coastal blue-carbon ecosystems.`;

const ARTICLE_BODY_GLACIERS = `## Mountain Water Towers Under Thermal Stress

High-altitude glaciers store winter precipitation as snow and ice, releasing cool meltwater during dry summer months when rivers, irrigated farmlands, and freshwater ecosystems need it most.

### Observable Changes Across Alpine Basins

Field measurements across major mountain ranges document accelerating glacier terminus retreat and thinning ice thickness. In the short term, rapid melt can temporarily swell seasonal runoff and increase glacial lake outburst flood hazards. Over multi-decade horizons, however, diminished ice volume leads to reduced dry-season baseflow.

### Protecting Downstream Watersheds

1. **High-Altitude Monitoring:** Expanding automated meteorological and mass-balance stations to improve seasonal water forecasting.
2. **Wetland & Páramo Conservation:** Preserving high-mountain wetlands and forested headwaters that sponge and slowly release rainfall.
3. **Water-Use Efficiency:** Upgrading municipal and agricultural irrigation networks in snowmelt-dependent valleys.`;

const ARTICLE_BODY_FORESTS = `## Why Intact Tropical Canopies Are Irreplaceable

Tropical rainforests harbor more than half of Earth's terrestrial species while cycling vast quantities of moisture back into the atmosphere through evapotranspiration—generating the "flying rivers" that sustain continental rainfall.

### Beyond Simple Tree Counts

Ecological research consistently shows that intact primary forests store significantly more stable carbon and support far richer trophic webs than young monoculture plantations. When old-growth canopy is fragmented into isolated patches, edge drying and windthrow degrade habitat quality deep inside the remaining forest.

### Community-Led Forest Stewardship

Durable conservation pairs satellite deforestation monitoring with legal recognition of Indigenous and local community territories, wildlife corridor reconnection, and native-species ecological restoration.`;

export const FALLBACK_ARTICLES_FULL: readonly (ArticleRow & {
  readonly pillarName: string;
  readonly pillarSlug: string;
  readonly topicName: string | null;
})[] = [
  {
    id: "art-urgent-climate-action",
    pillar_id: "pillar-climate-atmosphere",
    topic_id: "topic-rising-temperatures",
    title: "The Urgent Need for Climate Action",
    slug: "the-urgent-need-for-climate-action",
    excerpt:
      "How rising atmospheric greenhouse concentrations are reshaping global weather patterns—and why every fraction of a degree matters for living ecosystems.",
    content: ARTICLE_BODY_CLIMATE_ACTION,
    cover_image_path: "/images/pillar-forests.jpg",
    author_id: null,
    status: "published",
    featured: true,
    seo_title: "The Urgent Need for Climate Action | THE LIVING EARTH",
    seo_description:
      "Explore the scientific evidence behind global warming and the systemic pathways required to stabilize Earth's climate.",
    published_at: "2025-04-24T08:00:00Z",
    created_at: "2025-04-24T08:00:00Z",
    updated_at: "2025-04-24T08:00:00Z",
    pillarName: "Climate & Atmosphere",
    pillarSlug: "climate-atmosphere",
    topicName: "Rising Temperatures",
  },
  {
    id: "art-climate-accelerates",
    pillar_id: "pillar-climate-atmosphere",
    topic_id: "topic-rising-temperatures",
    title: "Climate Change Accelerates Global Warming",
    slug: "climate-change-accelerates-global-warming",
    excerpt:
      "Satellite observations and ocean buoys confirm how Earth's energy imbalance drives record surface temperatures and shifting climate zones.",
    content: ARTICLE_BODY_CLIMATE_ACTION,
    cover_image_path: "/images/earth-globe.jpg",
    author_id: null,
    status: "published",
    featured: true,
    seo_title: null,
    seo_description: null,
    published_at: "2025-04-20T08:00:00Z",
    created_at: "2025-04-20T08:00:00Z",
    updated_at: "2025-04-20T08:00:00Z",
    pillarName: "Climate & Atmosphere",
    pillarSlug: "climate-atmosphere",
    topicName: "Rising Temperatures",
  },
  {
    id: "art-melting-glaciers",
    pillar_id: "pillar-oceans-water",
    topic_id: "topic-coral-reefs",
    title: "Melting Glaciers Threaten Water Supply",
    slug: "melting-glaciers-threaten-water-supply",
    excerpt:
      "Retreating mountain glaciers alter seasonal river flows, challenging freshwater security for downstream ecosystems and communities.",
    content: ARTICLE_BODY_GLACIERS,
    cover_image_path: "/images/pillar-climate.jpg",
    author_id: null,
    status: "published",
    featured: true,
    seo_title: null,
    seo_description: null,
    published_at: "2025-04-16T08:00:00Z",
    created_at: "2025-04-16T08:00:00Z",
    updated_at: "2025-04-16T08:00:00Z",
    pillarName: "Oceans & Water",
    pillarSlug: "oceans-water",
    topicName: "Coral Reefs & Blue Carbon",
  },
  {
    id: "art-protecting-biodiversity",
    pillar_id: "pillar-forests-biodiversity",
    topic_id: "topic-primary-forests",
    title: "Protecting Biodiversity in Tropical Forests",
    slug: "protecting-biodiversity-in-tropical-forests",
    excerpt:
      "Why safeguarding intact primary rainforest canopies and wildlife corridors is essential for planetary carbon stability and species survival.",
    content: ARTICLE_BODY_FORESTS,
    cover_image_path: "/images/hero-planet.jpg",
    author_id: null,
    status: "published",
    featured: true,
    seo_title: null,
    seo_description: null,
    published_at: "2025-04-12T08:00:00Z",
    created_at: "2025-04-12T08:00:00Z",
    updated_at: "2025-04-12T08:00:00Z",
    pillarName: "Forests & Biodiversity",
    pillarSlug: "forests-biodiversity",
    topicName: "Primary Forest Conservation",
  },
  {
    id: "art-coastal-mangroves",
    pillar_id: "pillar-solutions-restoration",
    topic_id: null,
    title: "Restoring Coastal Mangroves for Climate Resilience",
    slug: "restoring-coastal-mangroves-for-resilience",
    excerpt:
      "Community-led mangrove rehabilitation across Indonesian coastlines buffers storm surge, revives fisheries, and locks carbon in coastal sediments.",
    content: ARTICLE_BODY_FORESTS,
    cover_image_path: "/images/mangrove-coastal.jpg",
    author_id: null,
    status: "published",
    featured: false,
    seo_title: null,
    seo_description: null,
    published_at: "2025-04-08T08:00:00Z",
    created_at: "2025-04-08T08:00:00Z",
    updated_at: "2025-04-08T08:00:00Z",
    pillarName: "Solutions & Restoration",
    pillarSlug: "solutions-restoration",
    topicName: null,
  },
  {
    id: "art-renewable-transition",
    pillar_id: "pillar-pollution-human-impact",
    topic_id: null,
    title: "Clean Air & The Global Renewable Transition",
    slug: "clean-air-and-the-global-renewable-transition",
    excerpt:
      "Phasing out coal and industrial combustion immediately reduces urban fine particulate pollution while bending the curve on greenhouse emissions.",
    content: ARTICLE_BODY_CLIMATE_ACTION,
    cover_image_path: "/images/solar-wind.jpg",
    author_id: null,
    status: "published",
    featured: false,
    seo_title: null,
    seo_description: null,
    published_at: "2025-04-02T08:00:00Z",
    created_at: "2025-04-02T08:00:00Z",
    updated_at: "2025-04-02T08:00:00Z",
    pillarName: "Pollution & Human Impact",
    pillarSlug: "pollution-human-impact",
    topicName: null,
  },
];

export const FALLBACK_ARTICLE_CARDS: readonly PublicArticleCard[] = FALLBACK_ARTICLES_FULL.map(
  (a) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt,
    content: a.content,
    cover_image_path: a.cover_image_path,
    featured: a.featured,
    published_at: a.published_at,
    pillarName: a.pillarName,
    pillarSlug: a.pillarSlug,
    topicName: a.topicName,
  }),
);

const MANGROVE_CASE_STUDY_CONTENT = `## Overview

Indonesia holds the largest extent of mangrove ecosystems on Earth, spanning coastal estuaries across Java, Sumatra, Kalimantan, Sulawesi, and Papua. Over recent decades, coastal aquaculture conversion, timber extraction, and sediment disruption degraded thousands of hectares of protective mangrove belts—exposing low-lying villages to tidal flooding and shoreline erosion.

Mangrove forests are among the planet's most productive **blue carbon** ecosystems, storing up to four times more carbon per hectare in their waterlogged soils than terrestrial tropical forests while serving as essential nursery habitats for coastal fisheries.

## The Solution

Working alongside coastal villages and ecological researchers, restoration teams shifted away from monoculture planting on exposed mudflats toward **hydrological mangrove rehabilitation**:

- **Restoring Natural Tidal Flow:** Re-opening blocked estuarine channels and constructing permeable brushwood sediment traps so natural silt and buoyant mangrove propagules can re-establish.
- **Multi-Species Native Zoning:** Matching *Rhizophora*, *Avicennia*, and *Sonneratia* species to their natural intertidal salinity and inundation zones.
- **Community Silvofishery Stewardship:** Integrating sustainable crab and fish cultivation within protected mangrove buffers so local livelihoods directly benefit from intact canopy cover.

## Results

Restored mangrove corridors across northern Java and Kalimantan have measurably dampened wave energy, stabilized accreting mudflats, and revived juvenile fish and crustacean populations within three to five years of hydrological recovery.`;

export const FALLBACK_CASE_STUDIES_FULL: readonly (CaseStudyRow & {
  readonly pillarName: string;
  readonly pillarSlug: string;
})[] = [
  {
    id: "cs-mangrove-indonesia",
    pillar_id: "pillar-oceans-water",
    title: "Mangrove Restoration in Coastal Indonesia",
    slug: "mangrove-restoration-in-coastal-indonesia",
    summary:
      "Nature-based hydrological rehabilitation and community stewardship rebuilding resilient blue-carbon coastlines across Indonesia.",
    content: MANGROVE_CASE_STUDY_CONTENT,
    country: "Indonesia",
    region: "Coastal Java & Kalimantan",
    latitude: -6.8722,
    longitude: 110.5089,
    cover_image_path: "/images/mangrove-coastal.jpg",
    organization: "Coastal Blue Carbon & Community Restoration Network",
    start_date: "2021-03-01",
    end_date: null,
    status: "published",
    published_at: "2025-04-18T00:00:00Z",
    created_at: "2025-04-18T00:00:00Z",
    updated_at: "2025-04-18T00:00:00Z",
    pillarName: "Oceans & Water",
    pillarSlug: "oceans-water",
  },
  {
    id: "cs-alpine-glaciers",
    pillar_id: "pillar-climate-atmosphere",
    title: "Alpine Glacier & Headwater Conservation",
    slug: "alpine-glacier-headwater-conservation",
    summary:
      "High-altitude cryosphere tracking and watershed adaptation protecting downstream freshwater supply.",
    content: ARTICLE_BODY_GLACIERS,
    country: "Switzerland",
    region: "Central Alps",
    latitude: 46.5475,
    longitude: 8.0294,
    cover_image_path: "/images/pillar-climate.jpg",
    organization: "Alpine Cryosphere & Watershed Observatory",
    start_date: "2020-06-01",
    end_date: null,
    status: "published",
    published_at: "2025-04-10T00:00:00Z",
    created_at: "2025-04-10T00:00:00Z",
    updated_at: "2025-04-10T00:00:00Z",
    pillarName: "Climate & Atmosphere",
    pillarSlug: "climate-atmosphere",
  },
  {
    id: "cs-borneo-forest-corridor",
    pillar_id: "pillar-forests-biodiversity",
    title: "Tropical Peatland & Canopy Reconnection",
    slug: "tropical-peatland-canopy-reconnection",
    summary:
      "Rewetting drained peat domes and reconnecting fragmented rainforest corridors for endangered wildlife.",
    content: ARTICLE_BODY_FORESTS,
    country: "Indonesia",
    region: "Central Kalimantan",
    latitude: -2.2083,
    longitude: 113.9167,
    cover_image_path: "/images/pillar-forests.jpg",
    organization: "Borneo Peatland & Biodiversity Initiative",
    start_date: "2021-09-01",
    end_date: null,
    status: "published",
    published_at: "2025-04-04T00:00:00Z",
    created_at: "2025-04-04T00:00:00Z",
    updated_at: "2025-04-04T00:00:00Z",
    pillarName: "Forests & Biodiversity",
    pillarSlug: "forests-biodiversity",
  },
];

export const FALLBACK_CASE_STUDY_CARDS: readonly PublicCaseStudyCard[] =
  FALLBACK_CASE_STUDIES_FULL.map((c) => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
    summary: c.summary,
    country: c.country,
    region: c.region,
    latitude: c.latitude,
    longitude: c.longitude,
    cover_image_path: c.cover_image_path,
    organization: c.organization,
    start_date: c.start_date,
    end_date: c.end_date,
    published_at: c.published_at,
    pillarName: c.pillarName,
    pillarSlug: c.pillarSlug,
  }));

export const FALLBACK_EXPLORE_PILLARS: readonly ExplorePillarItem[] = FALLBACK_PILLARS.map(
  (pillar) => ({
    ...pillar,
    topics: FALLBACK_TOPICS.filter((t) => t.pillar_id === pillar.id).map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      description: t.description,
    })),
    publishedArticlesCount: FALLBACK_ARTICLES_FULL.filter((a) => a.pillar_id === pillar.id).length,
  }),
);
