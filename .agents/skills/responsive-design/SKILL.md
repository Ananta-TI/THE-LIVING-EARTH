---
name: responsive-design
description: Use this skill when creating, reviewing, or modifying responsive layouts, components, navigation, typography scaling, grids, media containers, tables, or charts across desktop, laptop, tablet, and mobile viewports for THE LIVING EARTH.
---

# Responsive Design

## Purpose

Ensure every editorial page, storytelling layout, data container, and form in **THE LIVING EARTH** (*A Journey Through Our Changing Planet*) adapts cleanly across desktop, laptop, tablet, smartphone, and small mobile viewports in both portrait and landscape orientations without horizontal overflow or content loss.

## When to Use

- Designing or refactoring page layouts, editorial grids, hero compositions, or multi-column sections (`Home`, `About`, `Explore`, `Stories`, `Our Planet`, `Solutions`, `Contact`).
- Adapting the 7-item main navigation, mobile menu, breadcrumbs, pillar cards, or filter bars across screen sizes.
- Making comparison tables, `Statistic Card` grids, Recharts wrappers, static geographic maps, and forms responsive.
- Reviewing public pages for horizontal overflow, distorted media, unreadable mobile type, or cramped touch targets.

*Do not use this skill alone for visual aesthetic direction (use `frontend-design`), animation choreography (use `motion-interaction-design`), or WCAG semantic/keyboard rules (use `accessibility-ux`).*

## Responsibilities

- Define mobile-first layout structure and breakpoint adaptation across all viewport tiers:
  - Small mobile (`< 640px`, base styles, including `320px–375px`)
  - Smartphone (`sm`: `640px+`)
  - Tablet (`md`: `768px+`)
  - Laptop / Standard desktop (`lg`: `1024px+` / `xl`: `1280px+`)
  - Large desktop (`2xl`: `1536px+`)
- Prevent page-level horizontal overflow across every route, orientation, and long-content edge case.
- Keep reading measure, image proportions, and touch usability consistent from mobile to large screens.

## Implementation Guidelines

1. **Mobile-first base styles**: Author base Tailwind CSS classes for smartphone/small mobile (`320px–375px`) first, then layer standard `sm:`, `md:`, `lg:`, `xl:`, and `2xl:` overrides only where viewport width justifies a structural change. Avoid introducing unnecessary custom breakpoints.
2. **Flexible containers over fixed widths**: Use `w-full`, `max-w-*`, `min-w-0` (essential on flex and CSS Grid children), `flex-wrap`, CSS Grid (`grid-cols-*`, `minmax(...)`), and `clamp()` instead of fixed pixel widths that overflow narrow screens.
3. **Readable mobile typography & fluid spacing**: Maintain at least `16px` (`text-base`) body text on mobile so readers never need to pinch-zoom, keep long-form prose around `60–80ch` (`max-w-prose`), and scale editorial headings and section whitespace proportionally across breakpoints.
4. **Proportional media & zero layout shift**: Wrap environmental photography, before/after imagery, and static maps in explicit aspect-ratio containers (`aspect-*`) with `object-cover` (or `object-contain` for scientific diagrams) and accurate `next/image` `sizes` attributes so media never stretches or causes Cumulative Layout Shift.
5. **Responsive 7-item navigation**: Render the full horizontal 7-item navigation (`Home`, `About`, `Explore`, `Stories`, `Our Planet`, `Solutions`, `Contact`) cleanly on laptop/desktop without wrapping or clipping, and collapse it into a single-control compact mobile menu on smaller screens; ensure pillar cards, breadcrumbs, and filter chips wrap or stack cleanly.
6. **Contained scroll for wide tables & charts**: Never let wide data tables, reference matrices, or Recharts SVGs push the document wider than the viewport—wrap tables in dedicated `overflow-x-auto` containers and wrap charts in `min-w-0` responsive containers.
7. **Single-column mobile forms & touch targets**: Stack form fields (`Contact` form, filters, search inputs) in a single column on mobile and give all interactive controls touch-friendly hit areas (`>= 44x44px` with comfortable spacing) across portrait and landscape orientations.
8. **Content parity across devices**: Keep essential storytelling copy, epistemic claim labels (`Fakta` / `Proyeksi` / `Interpretasi`), `Inti Cerita` / `Kajian Lanjut` layers, and source attributions available on mobile via reflow or progressive disclosure rather than hiding them with `hidden`.

## Project-Specific Rules

- **Editorial Whitespace & Portrait/Landscape Resilience**: Preserve calm editorial margins (`px-4` to `px-6` minimum on mobile, scaling up on `md:`/`lg:`) across all five content pillars (*Climate & Atmosphere*, *Oceans & Water*, *Forests & Biodiversity*, *Pollution & Human Impact*, *Solutions & Restoration*) in both portrait and landscape mobile orientations.
- **Public Route Parity**: Optimize the seven public pages and supporting pages (`Metodologi & Sumber`, `Glosarium`, `Kredit & Lisensi`); adapt multi-column tables cleanly for tablet/mobile without horizontal page scroll.
- **Scope Boundary**: Focus strictly on layout geometry, breakpoint adaptation, media proportions, and touch sizing. Defer palette/typography choices to `frontend-design`, motion timing to `motion-interaction-design`, and focus/ARIA rules to `accessibility-ux`.

## Workflow

1. **Inspect content & edge cases**: Identify the layout's components (prose, photography, 7-item nav, `Statistic Card`, table, Recharts container, or form) and longest realistic Indonesian/scientific strings.
2. **Build the mobile-first column**: Establish single-column stacking, `>= 16px` body text, and natural reading priority on `320px–375px` viewports.
3. **Layer Tailwind breakpoints**: Add `md:` (two-column tablet grids) and `lg:`/`xl:` (editorial multi-column and horizontal nav) adjustments cleanly.
4. **Harden overflow boundaries**: Add `min-w-0` on grid/flex children, `overflow-x-auto` on wide tables, `break-words` on long URLs/citations, and explicit aspect ratios on media.
5. **Verify across viewport tiers & orientations**: Test at `360px`, `390px`, `768px`, `1024px`, `1280px`, and `1536px+` (plus mobile landscape) with real long headlines and charts.

## Quality Checklist

- [ ] Zero horizontal page overflow (`scrollWidth <= clientWidth`) across small mobile, smartphone, tablet, laptop, and desktop.
- [ ] Both portrait and landscape mobile orientations render without clipped or overlapping elements.
- [ ] All 7 primary navigation items and mobile menu work cleanly at every breakpoint.
- [ ] Body text stays `>= 16px` on mobile without requiring zoom; long headlines and references wrap cleanly.
- [ ] Photography and maps keep natural aspect ratios with zero distortion or layout shift.
- [ ] Wide tables and charts scroll or resize inside their own containers.
- [ ] Buttons, filters, and form inputs are touch-friendly on touchscreens, and no essential content or source attribution is hidden on mobile.

## Constraints

- Do not introduce custom CSS breakpoints when Tailwind's standard scale (`sm`, `md`, `lg`, `xl`, `2xl`) handles the layout.
- Do not hide essential environmental content, citations, or epistemic labels to force a compact mobile card.
- Do not apply fixed pixel widths or heights to text-bearing containers.
