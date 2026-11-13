-- =============================================================================
-- Seed Data for THE LIVING EARTH
-- Seeds the 5 environmental pillars, 5 topics, 3 verified scientific references,
-- 3 verified environmental statistics, 6 published articles, 3 published case
-- studies, reference join records, and default site settings.
-- Fully idempotent (safe to run multiple times).
-- =============================================================================

BEGIN;

-- 1. PILLARS (5 Core Environmental Domains)
INSERT INTO public.pillars (id, name, slug, description, cover_image_path, display_order, is_active)
VALUES
  (
    '00000000-0000-4000-8000-000000000001',
    'Climate & Atmosphere',
    'climate-atmosphere',
    'Understanding our changing climate—from rising global temperatures and atmospheric carbon to extreme weather and cryosphere shifts.',
    '/images/pillar-climate.jpg',
    1,
    true
  ),
  (
    '00000000-0000-4000-8000-000000000002',
    'Oceans & Water',
    'oceans-water',
    'Marine ecosystems, coral reefs, ocean heat absorption, carbonate chemistry, and global freshwater watershed security.',
    '/images/sea-turtle.jpg',
    2,
    true
  ),
  (
    '00000000-0000-4000-8000-000000000003',
    'Forests & Biodiversity',
    'forests-biodiversity',
    'Primary rainforests, boreal carbon sinks, wildlife corridors, and the living web of terrestrial biodiversity.',
    '/images/pillar-forests.jpg',
    3,
    true
  ),
  (
    '00000000-0000-4000-8000-000000000004',
    'Pollution & Human Impact',
    'pollution-human-impact',
    'Air quality, industrial emissions, plastic polymers, and human extraction footprints across land and water.',
    '/images/pillar-pollution.jpg',
    4,
    true
  ),
  (
    '00000000-0000-4000-8000-000000000005',
    'Solutions & Restoration',
    'solutions-restoration',
    'Renewable energy transitions, mangrove and forest restoration, circular material systems, and community stewardship.',
    '/images/pillar-solutions.jpg',
    5,
    true
  )
ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  cover_image_path = EXCLUDED.cover_image_path,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active;

-- 2. TOPICS
INSERT INTO public.topics (id, pillar_id, name, slug, description, display_order, is_active)
VALUES
  (
    '00000000-0000-4000-8001-000000000001',
    '00000000-0000-4000-8000-000000000001',
    'Rising Temperatures',
    'rising-temperatures',
    'Global surface warming anomalies and regional heatwave intensification.',
    1,
    true
  ),
  (
    '00000000-0000-4000-8001-000000000002',
    '00000000-0000-4000-8000-000000000001',
    'Extreme Weather',
    'extreme-weather',
    'Shifts in monsoon reliability, severe droughts, and cyclonic rainfall.',
    2,
    true
  ),
  (
    '00000000-0000-4000-8001-000000000003',
    '00000000-0000-4000-8000-000000000001',
    'Sea Level Rise',
    'sea-level-rise',
    'Thermal ocean expansion and cryosphere ice-sheet mass loss.',
    3,
    true
  ),
  (
    '00000000-0000-4000-8001-000000000004',
    '00000000-0000-4000-8000-000000000002',
    'Coral Reefs & Blue Carbon',
    'coral-reefs-blue-carbon',
    'Tropical reef thermal resilience, seagrass meadows, and mangrove nurseries.',
    1,
    true
  ),
  (
    '00000000-0000-4000-8001-000000000005',
    '00000000-0000-4000-8000-000000000003',
    'Primary Forest Conservation',
    'primary-forest-conservation',
    'Old-growth canopy retention, biodiversity corridors, and watershed protection.',
    1,
    true
  )
ON CONFLICT (pillar_id, slug) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active;

-- 3. VERIFIED SCIENTIFIC REFERENCES
INSERT INTO public.references (
  id,
  title,
  organization,
  source_type,
  author,
  publication_date,
  source_url,
  notes
)
VALUES
  (
    '00000000-0000-4000-8002-000000000001',
    'Climate Change 2023: Synthesis Report (Sixth Assessment Report)',
    'Intergovernmental Panel on Climate Change (IPCC)',
    'international_organization',
    'IPCC Core Writing Team',
    '2023-03-20',
    'https://www.ipcc.ch/report/ar6/syr/',
    'Primary reference for global mean surface temperature rise (~1.1-1.2°C above 1850-1900).'
  ),
  (
    '00000000-0000-4000-8002-000000000002',
    'Ocean Acidification: Saturation State & Surface pH Observations',
    'National Oceanic and Atmospheric Administration (NOAA PMEL)',
    'government_data',
    'NOAA Pacific Marine Environmental Laboratory',
    '2023-06-15',
    'https://www.pmel.noaa.gov/co2/story/What+is+Ocean+Acidification%3F',
    'Verified marine carbonate chemistry indicator (~30% increase in surface ocean acidity).'
  ),
  (
    '00000000-0000-4000-8002-000000000003',
    'Global Forest Resources Assessment (FRA): Forest Extent and Changes',
    'Food and Agriculture Organization of the United Nations (FAO)',
    'international_organization',
    'FAO Forestry Division',
    '2022-05-02',
    'https://www.fao.org/forest-resources-assessment/en/',
    'Global terrestrial forest cover benchmark (~31% of global land area).'
  )
ON CONFLICT (title, source_url) DO UPDATE
SET
  organization = EXCLUDED.organization,
  source_type = EXCLUDED.source_type,
  author = EXCLUDED.author,
  publication_date = EXCLUDED.publication_date,
  notes = EXCLUDED.notes;

-- 4. VERIFIED ENVIRONMENTAL STATISTICS
INSERT INTO public.statistics (
  id,
  pillar_id,
  reference_id,
  indicator,
  value,
  unit,
  geographic_scope,
  measurement_year,
  publication_date,
  methodology,
  limitations,
  data_type,
  status
)
VALUES
  (
    '00000000-0000-4000-8003-000000000001',
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8002-000000000001',
    'Global Temp Rise',
    1.2,
    '°C',
    'Global Mean Surface',
    2023,
    '2023-03-20',
    'Observed human-induced warming of global mean surface temperature relative to the 1850-1900 pre-industrial baseline.',
    'Decadal averaging across land and marine surface temperature stations.',
    'historical_observation',
    'published'
  ),
  (
    '00000000-0000-4000-8003-000000000002',
    '00000000-0000-4000-8000-000000000002',
    '00000000-0000-4000-8002-000000000002',
    'Ocean Acidification',
    30,
    '%',
    'Global Surface Oceans',
    2023,
    '2023-06-15',
    'Approximate percentage increase in surface ocean acidity (hydrogen ion concentration) since the industrial era.',
    'Calculated from ~0.1 pH unit decline across open-ocean time-series stations.',
    'historical_observation',
    'published'
  ),
  (
    '00000000-0000-4000-8003-000000000003',
    '00000000-0000-4000-8000-000000000003',
    '00000000-0000-4000-8002-000000000003',
    'Global Forest Cover',
    31,
    '%',
    'Global Land Area',
    2022,
    '2022-05-02',
    'Share of Earth total land surface covered by forest ecosystems (~4.06 billion hectares).',
    'Includes primary, naturally regenerating, and planted forest area.',
    'current_estimate',
    'published'
  )
ON CONFLICT (id) DO UPDATE
SET
  indicator = EXCLUDED.indicator,
  value = EXCLUDED.value,
  unit = EXCLUDED.unit,
  geographic_scope = EXCLUDED.geographic_scope,
  measurement_year = EXCLUDED.measurement_year,
  methodology = EXCLUDED.methodology,
  limitations = EXCLUDED.limitations,
  data_type = EXCLUDED.data_type,
  status = EXCLUDED.status;

-- 5. PUBLISHED ARTICLES
INSERT INTO public.articles (
  id,
  pillar_id,
  topic_id,
  title,
  slug,
  excerpt,
  content,
  cover_image_path,
  status,
  featured,
  seo_title,
  seo_description,
  published_at
)
VALUES
  (
    '00000000-0000-4000-8004-000000000001',
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8001-000000000001',
    'The Urgent Need for Climate Action',
    'the-urgent-need-for-climate-action',
    'How rising atmospheric greenhouse concentrations are reshaping global weather patterns—and why every fraction of a degree matters for living ecosystems.',
    E'## Understanding the Pace of Planetary Warming\n\nEarth''s climate system is governed by a delicate radiative balance. As concentrations of carbon dioxide, methane, and nitrous oxide continue to accumulate in the atmosphere, outgoing infrared energy is trapped within the lower troposphere, raising global mean temperatures to roughly **1.2°C above pre-industrial baselines**.\n\n### Key Ecological Pressures\n\n- **Shifting Hydrological Regimes:** Warmer air holds approximately 7% more water vapor per degree Celsius, intensifying downpours in wet regions while accelerating soil moisture evaporation across semi-arid agricultural belts.\n- **Cryosphere Retreat:** Mountain glaciers in the Alps, Andes, and Himalayas are losing mass at historic rates.\n- **Compound Extremes:** Heatwaves increasingly coincide with prolonged drought, stressing primary forest canopies.\n\n> "Every increment of global warming avoided reduces the frequency and intensity of extreme heat, heavy precipitation, and ecological disruption." — IPCC Sixth Assessment Synthesis\n\n### Pathways Forward\n\nStabilizing global temperatures requires rapid structural decarbonization of energy, transport, and industry alongside large-scale protection and restoration of natural carbon sinks.',
    '/images/pillar-forests.jpg',
    'published',
    true,
    'The Urgent Need for Climate Action | THE LIVING EARTH',
    'Explore the scientific evidence behind global warming and the systemic pathways required to stabilize Earth''s climate.',
    '2025-04-24T08:00:00Z'
  ),
  (
    '00000000-0000-4000-8004-000000000002',
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8001-000000000001',
    'Climate Change Accelerates Global Warming',
    'climate-change-accelerates-global-warming',
    'Satellite observations and ocean buoys confirm how Earth''s energy imbalance drives record surface temperatures and shifting climate zones.',
    E'## Tracking Planetary Energy Imbalance\n\nModern satellite radiometers and autonomous Argo ocean floats provide an unprecedented view of Earth''s climate system. Over 90% of excess heat trapped by greenhouse gases is absorbed by the world''s oceans, while the remainder warms the atmosphere, land surface, and cryosphere.\n\n### What the Observations Show\n\n1. **Multi-Decadal Warming Trend:** Each of the last four decades has been successively warmer at Earth''s surface than any preceding decade since 1850.\n2. **Amplified Polar Warming:** Arctic surface temperatures are rising more than twice as fast as the global average due to sea-ice albedo feedbacks.\n3. ** Actionable Mitigation:** Rapid deployment of solar, wind, grid storage, and methane leak abatement can slow the rate of near-term warming.',
    '/images/earth-globe.jpg',
    'published',
    true,
    NULL,
    NULL,
    '2025-04-20T08:00:00Z'
  ),
  (
    '00000000-0000-4000-8004-000000000003',
    '00000000-0000-4000-8000-000000000002',
    '00000000-0000-4000-8001-000000000004',
    'Melting Glaciers Threaten Water Supply',
    'melting-glaciers-threaten-water-supply',
    'Retreating mountain glaciers alter seasonal river flows, challenging freshwater security for downstream ecosystems and communities.',
    E'## Mountain Water Towers Under Thermal Stress\n\nHigh-altitude glaciers store winter precipitation as snow and ice, releasing cool meltwater during dry summer months when rivers, irrigated farmlands, and freshwater ecosystems need it most.\n\n### Observable Changes Across Alpine Basins\n\nField measurements across major mountain ranges document accelerating glacier terminus retreat and thinning ice thickness. Over multi-decade horizons, diminished ice volume leads to reduced dry-season baseflow.\n\n### Protecting Downstream Watersheds\n\n- **High-Altitude Monitoring:** Expanding automated meteorological and mass-balance stations.\n- **Wetland Conservation:** Preserving high-mountain wetlands and forested headwaters that sponge and slowly release rainfall.\n- **Water-Use Efficiency:** Upgrading municipal and agricultural irrigation networks in snowmelt-dependent valleys.',
    '/images/pillar-climate.jpg',
    'published',
    true,
    NULL,
    NULL,
    '2025-04-16T08:00:00Z'
  ),
  (
    '00000000-0000-4000-8004-000000000004',
    '00000000-0000-4000-8000-000000000003',
    '00000000-0000-4000-8001-000000000005',
    'Protecting Biodiversity in Tropical Forests',
    'protecting-biodiversity-in-tropical-forests',
    'Why safeguarding intact primary rainforest canopies and wildlife corridors is essential for planetary carbon stability and species survival.',
    E'## Why Intact Tropical Canopies Are Irreplaceable\n\nTropical rainforests harbor more than half of Earth''s terrestrial species while cycling vast quantities of moisture back into the atmosphere through evapotranspiration.\n\n### Beyond Simple Tree Counts\n\nEcological research consistently shows that intact primary forests store significantly more stable carbon and support far richer trophic webs than young monoculture plantations.\n\n### Community-Led Forest Stewardship\n\nDurable conservation pairs satellite deforestation monitoring with legal recognition of Indigenous and local community territories, wildlife corridor reconnection, and native-species ecological restoration.',
    '/images/hero-planet.jpg',
    'published',
    true,
    NULL,
    NULL,
    '2025-04-12T08:00:00Z'
  ),
  (
    '00000000-0000-4000-8004-000000000005',
    '00000000-0000-4000-8000-000000000005',
    NULL,
    'Restoring Coastal Mangroves for Climate Resilience',
    'restoring-coastal-mangroves-for-resilience',
    'Community-led mangrove rehabilitation across Indonesian coastlines buffers storm surge, revives fisheries, and locks carbon in coastal sediments.',
    E'## Blue Carbon Along Tropical Coastlines\n\nMangrove ecosystems thrive at the boundary between land and sea. Their dense root systems slow incoming tidal currents, trap organic sediment, and protect coastal villages from erosion and extreme storm surge.\n\n### Ecological Restoration vs. Monoculture Planting\n\nSuccessful projects restore natural tidal hydrology first—reopening blocked estuarine channels so buoyant native mangrove propagules can establish across their natural intertidal zones.',
    '/images/mangrove-coastal.jpg',
    'published',
    false,
    NULL,
    NULL,
    '2025-04-08T08:00:00Z'
  ),
  (
    '00000000-0000-4000-8004-000000000006',
    '00000000-0000-4000-8000-000000000004',
    NULL,
    'Clean Air & The Global Renewable Transition',
    'clean-air-and-the-global-renewable-transition',
    'Phasing out coal and industrial combustion immediately reduces urban fine particulate pollution while bending the curve on greenhouse emissions.',
    E'## Co-Benefits of Clean Electrification\n\nTransitioning power grids and urban transport away from fossil fuel combustion delivers immediate public-health benefits alongside long-term climate stabilization by cutting fine particulate matter (PM2.5) and nitrogen oxides.',
    '/images/solar-wind.jpg',
    'published',
    false,
    NULL,
    NULL,
    '2025-04-02T08:00:00Z'
  )
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  cover_image_path = EXCLUDED.cover_image_path,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured,
  published_at = EXCLUDED.published_at;

-- 6. PUBLISHED CASE STUDIES
INSERT INTO public.case_studies (
  id,
  pillar_id,
  title,
  slug,
  summary,
  content,
  country,
  region,
  latitude,
  longitude,
  cover_image_path,
  organization,
  start_date,
  status,
  published_at
)
VALUES
  (
    '00000000-0000-4000-8005-000000000001',
    '00000000-0000-4000-8000-000000000002',
    'Mangrove Restoration in Coastal Indonesia',
    'mangrove-restoration-in-coastal-indonesia',
    'Nature-based hydrological rehabilitation and community stewardship rebuilding resilient blue-carbon coastlines across Indonesia.',
    E'## Overview\n\nIndonesia holds the largest extent of mangrove ecosystems on Earth, spanning coastal estuaries across Java, Sumatra, Kalimantan, Sulawesi, and Papua. Mangrove forests are among the planet''s most productive **blue carbon** ecosystems, storing up to four times more carbon per hectare in their waterlogged soils than terrestrial tropical forests.\n\n## The Solution\n\nWorking alongside coastal villages and ecological researchers, restoration teams shifted toward **hydrological mangrove rehabilitation**:\n\n- **Restoring Natural Tidal Flow:** Re-opening blocked estuarine channels and constructing permeable brushwood sediment traps.\n- **Multi-Species Native Zoning:** Matching *Rhizophora*, *Avicennia*, and *Sonneratia* species to their natural intertidal salinity zones.\n- **Community Silvofishery Stewardship:** Integrating sustainable crab and fish cultivation within protected mangrove buffers.\n\n## Results\n\nRestored mangrove corridors across northern Java and Kalimantan have measurably dampened wave energy, stabilized accreting mudflats, and revived juvenile fish and crustacean populations.',
    'Indonesia',
    'Coastal Java & Kalimantan',
    -6.872200,
    110.508900,
    '/images/mangrove-coastal.jpg',
    'Coastal Blue Carbon & Community Restoration Network',
    '2021-03-01',
    'published',
    '2025-04-18T00:00:00Z'
  ),
  (
    '00000000-0000-4000-8005-000000000002',
    '00000000-0000-4000-8000-000000000001',
    'Alpine Glacier & Headwater Conservation',
    'alpine-glacier-headwater-conservation',
    'High-altitude cryosphere tracking and watershed adaptation protecting downstream freshwater supply.',
    E'## Overview\n\nAlpine glaciers regulate seasonal river discharge across central Europe. High-resolution mass-balance monitoring paired with headwater wetland conservation helps downstream municipalities adapt to shifting snowmelt timing.',
    'Switzerland',
    'Central Alps',
    46.547500,
    8.029400,
    '/images/pillar-climate.jpg',
    'Alpine Cryosphere & Watershed Observatory',
    '2020-06-01',
    'published',
    '2025-04-10T00:00:00Z'
  ),
  (
    '00000000-0000-4000-8005-000000000003',
    '00000000-0000-4000-8000-000000000003',
    'Tropical Peatland & Canopy Reconnection',
    'tropical-peatland-canopy-reconnection',
    'Rewetting drained peat domes and reconnecting fragmented rainforest corridors for endangered wildlife.',
    E'## Overview\n\nTropical peat-swamp forests store millennia of carbon in waterlogged organic soils. Blocking drainage canals and replanting native dipterocarp species reduces wildfire risk and restores arboreal wildlife corridors.',
    'Indonesia',
    'Central Kalimantan',
    -2.208300,
    113.916700,
    '/images/pillar-forests.jpg',
    'Borneo Peatland & Biodiversity Initiative',
    '2021-09-01',
    'published',
    '2025-04-04T00:00:00Z'
  )
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  country = EXCLUDED.country,
  region = EXCLUDED.region,
  cover_image_path = EXCLUDED.cover_image_path,
  organization = EXCLUDED.organization,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

-- 7. ARTICLE & CASE STUDY REFERENCE LINKS
INSERT INTO public.article_references (article_id, reference_id)
VALUES
  ('00000000-0000-4000-8004-000000000001', '00000000-0000-4000-8002-000000000001'),
  ('00000000-0000-4000-8004-000000000002', '00000000-0000-4000-8002-000000000001'),
  ('00000000-0000-4000-8004-000000000003', '00000000-0000-4000-8002-000000000002'),
  ('00000000-0000-4000-8004-000000000004', '00000000-0000-4000-8002-000000000003')
ON CONFLICT (article_id, reference_id) DO NOTHING;

INSERT INTO public.case_study_references (case_study_id, reference_id)
VALUES
  ('00000000-0000-4000-8005-000000000001', '00000000-0000-4000-8002-000000000002'),
  ('00000000-0000-4000-8005-000000000002', '00000000-0000-4000-8002-000000000001'),
  ('00000000-0000-4000-8005-000000000003', '00000000-0000-4000-8002-000000000003')
ON CONFLICT (case_study_id, reference_id) DO NOTHING;

-- 8. DEFAULT SITE SETTINGS
INSERT INTO public.site_settings (setting_key, setting_value, description)
VALUES
  (
    'site_identity',
    '{"siteTitle":"THE LIVING EARTH","tagline":"A Journey Through Our Changing Planet","contactEmail":"editorial@thelivingearth.org","featuredHeroSlug":"the-urgent-need-for-climate-action"}'::jsonb,
    'Core editorial identity and contact metadata for THE LIVING EARTH.'
  )
ON CONFLICT (setting_key) DO UPDATE
SET
  setting_value = EXCLUDED.setting_value,
  description = EXCLUDED.description;

COMMIT;
