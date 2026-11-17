---
name: environmental-data-visualization
description: Use this skill when presenting environmental statistics, Statistic Cards, scientific indicators, Recharts visualizations (line, area, bar, comparison, donut), timelines, or geographic data summaries in THE LIVING EARTH.
---

# Environmental Data Visualization

## Purpose

Translate verified scientific data into accurate, transparent, scannable, and editorial-grade `Statistic Card` components and **Recharts** visualizations for **THE LIVING EARTH** (*A Journey Through Our Changing Planet*), ensuring strict scientific integrity and reader comprehension.

## When to Use

- Building or updating Recharts visualizations (line, area, bar, comparison, donut charts), `Statistic Card` components, timelines, or geographic data summaries (`Home`, pillar pages, `Stories` articles, `Our Planet`, `Solutions`).
- Rendering environmental metrics, projections, comparisons, or case-study evidence across the five pillars.
- Formatting chart axes, tooltips, legends, epistemic claim labels, methodology caveats, and source citations.

*Do not use this skill for general visual layout/typography (use `frontend-design`), screen-reader table/keyboard mechanics (use `accessibility-ux`), or static JSON content-loading architecture (use `nextjs-frontend-architecture`).*

## Responsibilities

- Enforce strict scientific integrity: zero fabricated statistics, `Content Status Gate` compliance (`Verified` only), explicit units, separated measurement vs. publication dates, and honest distinction between observed facts, projections, and modeled estimates.
- Build restrained, mobile-friendly Recharts charts (`3–5` clear charts with simple purposeful interactivity for MVP) with honest scales and non-color differentiators.
- Pair every figure or visualization with plain-language Indonesian takeaways and limitations so students, educators, and general readers interpret data accurately.

## Implementation Guidelines

1. **Zero invented numbers & Content Status Gate**: Never fabricate, guess, or synthesize placeholder statistics as real data. Render **only** statistics with `status === 'Verified'`. Any item marked `Needs Verification` or missing source/period metadata must be withheld from public display (never filled with mock numbers).
2. **Prioritize authoritative sources (Tier 1–2)**: Rely on verified primary scientific and institutional sources such as **UNEP**, **NASA**, **WMO**, **IPCC**, **WWF**, **IUCN**, UN agencies, peer-reviewed literature, and national agencies; Tier 3 secondary sources serve only as context checked against Tier 1–2.
3. **Complete Statistic Card & dataset schema**: Model and display applicable metadata for every important statistic:
   - `id` (e.g., `S01`–`S26`), `indicator`, `value`, `unit`
   - `geographicScope` (e.g., `Global`, `Amazon Basin`, `Indonesia`)
   - `measurementYear` / `dataPeriod` (distinct from `publicationDate`)
   - `sourceOrganization` & `sourceUrl`
   - `claimType`: `Fakta` (observed measurement), `Proyeksi` (model scenario + assumptions), or `Interpretasi`
   - `methodology` & `limitations` (`catatan keterbatasan`)
4. **Domain-specific scientific guardrails**:
   - **Projections**: Always label modeled projections explicitly as `Proyeksi` right beside the figure and state the underlying scenario/assumptions.
   - **Forest data**: Never merge or equate **Global Forest Watch (GFW)** *tree cover loss* (`forest loss`) with **FAO** *deforestation* (`deforestasi`).
   - **Living Planet Index (LPI)**: Never describe LPI percentages as "% of species extinct"—explain clearly that LPI tracks average population size trends of monitored vertebrate populations.
   - **Modeled mortality**: Present pollution-related mortality statistics as **modeled estimates**, and never compare incompatible methodological editions as a single continuous trend.
5. **Honest chart scales & comparisons**:
   - Bar and magnitude area charts **must** start the Y-axis at `0`.
   - Line charts showing subtle anomalies (e.g., global temperature anomaly relative to `1850–1900` or atmospheric CO₂ ppm) may use a cropped range *only* when clearly labeled with the reference baseline.
   - Avoid misleading dual Y-axes and never imply causation from purely correlational plots.
6. **Observations vs. projections in Recharts**: Visually separate observed historical series from future projections (e.g., solid stroke for observed data, dashed stroke `strokeDasharray` and shaded uncertainty band for projections, plus explicit legend labels).
7. **Insight-first editorial framing**: Lead each visualization with a clear takeaway title, subtitle specifying indicator + unit + geographic scope + data period, a concise plain-language takeaway, and a guide for reading historical vs. current vs. projected data.
8. **Restrained Recharts implementation**:
   - Harmonize chart colors with **THE LIVING EARTH** palette (deep forest, sage, slate-ocean, muted earth, warm terracotta/amber reserved for threshold emphasis) and combine color with distinct dash patterns, markers, or direct labels.
   - Include at least one simple, meaningful interactive control (e.g., period/scenario selector or accessible hover/focus tooltip) and keep Recharts inside `ResponsiveContainer` + `min-w-0` wrappers with simplified mobile ticks/margins.
9. **Supported visualization types**: Line charts, area charts, bar/comparison charts, donut charts (`<= 5` clean categories; switch to horizontal bar chart if `> 5`), `Statistic Card`s, timelines, and geographic data summaries (keeping `Home` key statistics concise: `3–5` verified figures max).

## Project-Specific Rules

- **Mandatory Attribution Footer**: Every chart and `Statistic Card` must visibly separate `Periode data` from `Tanggal publikasi sumber` and display `Sumber` (organization + clickable URL when valid) alongside `Jenis klaim` and `Keterbatasan`.
- **Solution Evidence Pairing**: When presenting quantitative solution outcomes (`Solutions` / `Case Study`), pair numbers with evidence-level labels (`Terbukti efektif`, `Terbukti sebagian`, `Masih diuji`, `Potensial`) and known barriers (`Hambatan`).
- **Graceful Data Fallback**: If a chart cannot render or JS is unavailable, display the structured data table or concise text summary cleanly.

## Workflow

1. **Verify dataset & gate status**: Confirm `status === 'Verified'`, exact unit, baseline, measurement period, publication date, source URL, claim type, and limitations.
2. **Choose visualization type**: Match data shape to chart (`Line`/`Area` for trends, `Bar` for comparisons, `Donut` for `<= 5` shares, `Statistic Card` for key callouts, `Timeline` for milestones).
3. **Type data & metadata strictly**: Define typed interfaces enforcing source, period, claim type, and limitation fields so unattributed data cannot compile or render.
4. **Build the Recharts & Card UI**: Implement honest scales, solid-vs-dashed observation/projection cues, custom formatted tooltips, simple interaction, and mobile margins.
5. **Audit scientific accuracy**: Verify zero invented data, zero conflated definitions (GFW vs. FAO, LPI), clear units, and full screen-reader/mobile legibility.

## Quality Checklist

- [ ] All statistics are verified (`Verified` only); zero fabricated or `Needs Verification` figures appear.
- [ ] Every statistic displays indicator, value, exact unit, geographic scope, data period, source publication date (separated), organization, URL, claim type, and limitations.
- [ ] Projections are explicitly labeled `Proyeksi` with scenario context; LPI, GFW/FAO, and modeled mortality caveats are respected.
- [ ] Bar/magnitude axes start at zero; any non-zero anomaly baseline is clearly explained.
- [ ] Historical observations and projections are visually and textually distinct.
- [ ] Charts use restrained styling, work cleanly on mobile, include simple interactivity, and provide a plain-language takeaway + fallback.

## Constraints

- Never invent, extrapolate, or populate placeholder numbers to make charts look complete.
- Never conflate report publication year with measurement/observation period.
- Never truncate bar axes, use deceptive dual axes, or claim causation without source attribution.
- Never display statistics or solutions lacking verified source/evidence classification.
