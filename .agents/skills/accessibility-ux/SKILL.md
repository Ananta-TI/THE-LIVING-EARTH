---
name: accessibility-ux
description: Use this skill when building or reviewing semantic HTML, heading hierarchy, keyboard navigation, focus states, color contrast, forms, modals/menus, alt text, reading ergonomics, chart alternatives, or loading/error/empty states in THE LIVING EARTH.
---

# Accessibility & UX

## Purpose

Ensure **THE LIVING EARTH** (*A Journey Through Our Changing Planet*) is perceivable, operable, understandable, and comfortable for all audiences—general public, students, educators, keyboard-only users, and assistive-technology users—meeting **WCAG 2.2 Level AA** across all pages and interactive flows.

## When to Use

- Structuring semantic HTML landmarks, heading hierarchies, and article/case-study layouts.
- Building or auditing the 7-item desktop nav, mobile drawer, breadcrumbs, filters, search, tabs, dialogs, or `Kajian Lanjut` disclosures.
- Implementing the `Contact` form (including `Koreksi data` conditional fields), search feedback, and validation/live announcements.
- Checking foreground/background contrast, photography overlays, reading ergonomics, `alt` text, non-color indicators, and screen-reader chart alternatives.
- Designing loading, empty, 404, and error recovery states.

*Do not use this skill for aesthetic color/font selection (use `frontend-design`) or scientific dataset verification (use `environmental-data-visualization`).*

## Responsibilities

- Enforce semantic HTML structure, sequential heading hierarchy, and full keyboard operability with visible focus.
- Guarantee WCAG 2.2 AA color contrast, descriptive `alt` text, and non-color differentiation across badges, statuses, and charts.
- Ensure clear, warm, non-alarmist Indonesian UX copy, two-layer reading comfort (`Inti Cerita` / `Kajian Lanjut`), and accessible async/form states.

## Implementation Guidelines

1. **Semantic HTML & landmarks**: Use `<header>`, `<nav aria-label="...">`, `<main id="main-content">`, `<article>`, `<section>`, `<aside>`, `<figure>`/`<figcaption>`, `<table>` with `<thead>`/`<th scope>`, and `<footer>`. Provide a visible-on-focus "Skip to main content" (*Lompat ke konten utama*) link.
2. **Logical heading hierarchy**: Enforce one `<h1>` per page followed by sequential `<h2>` → `<h3>` → `<h4>` levels without skipping levels (use CSS utility classes for visual sizing, semantic elements for structure).
3. **Descriptive `alt` text & graceful image failure**: Write meaningful `alt` text describing the subject and environmental context of informative photos and static geographic maps; mark purely decorative assets with `alt=""` and `aria-hidden="true"`. Ensure text and links remain readable if an image fails to load.
4. **WCAG 2.2 AA contrast**: Meet `>= 4.5:1` contrast for body text and labels, and `>= 3:1` for large headings, essential icons, borders, and focus indicators across warm ivory, forest green, sage green, muted earth brown, and photo overlays (apply scrims behind text over photos).
5. **Keyboard operability & visible focus**: Never suppress focus outlines without a high-contrast `focus-visible` ring. Support `Tab` order, `Enter`/`Space` on controls, `Escape` dismissal, and focus trapping/return in mobile drawers, dialogs, and popovers (via Radix/shadcn/ui primitives).
6. **Accessible names & native elements**: Use `<button>` for actions/toggles and `<a href>` for navigation. Give icon-only Lucide buttons explicit `aria-label` or `sr-only` text, mark active nav links with `aria-current="page"`, and wire `aria-expanded`/`aria-controls` on mobile menus and `Kajian Lanjut` disclosures.
7. **Accessible forms & live announcements**: Pair every input with a visible `<label htmlFor>`, mark required fields clearly, link helper/error messages via `aria-describedby`, set `aria-invalid="true"` on errors, preserve user input on validation/network failure, and announce form/search/filter updates politely via `aria-live="polite"` or `role="alert"`.
8. **Never rely on color alone**: Pair color coding with text labels, icons, patterns, or line styles across epistemic badges (`Fakta`, `Proyeksi`, `Interpretasi`), solution evidence labels (`Terbukti efektif`, `Terbukti sebagian`, `Masih diuji`, `Potensial`), chart series, and form errors.
9. **Reading ergonomics & plain Indonesian UX**: Keep article prose within `60–80ch`, generous line height (`1.6–1.75`), clear hierarchy between `Inti Cerita` (concise summary) and `Kajian Lanjut` (deep dive), descriptive link labels, and inline/linked glossary support for technical terms.
10. **Accessible charts & maps**: Every chart and static geographic map must pair visual output with an informative title, key summary, `aria-label`/`aria-describedby`, keyboard-accessible interactive controls (e.g., period toggle), and a text summary or accessible HTML data table fallback.
11. **Helpful loading, empty, and error states**: Never leave silent blank regions—use clear Indonesian status messages and recovery paths (e.g., empty search/filter suggests clearing filters and links to pillars; `404` links back to `Home`, `Stories`, and search; failed submission preserves inputs and offers retry).

## Project-Specific Rules

- **Palette Contrast Discipline**: Sage green and muted earth brown can drop below `4.5:1` on warm ivory for small text—use deep forest/charcoal ink for body prose, captions, citations, and form labels, keeping lighter sage/earth tones for surfaces, borders, or large non-text accents.
- **Calm, Dignified Tone**: Write interface labels, empty states, and sensitive environmental issue notices in warm, clear, non-alarmist Indonesian without clickbait or blame; ensure error messages explain what happened and how to proceed without false success confirmations.
- **Graceful Degradation (NFR-R2)**: Core article text, navigation links, and data tables must remain readable even when client scripts fail or load slowly.

## Workflow

1. **Outline semantic structure**: Confirm landmarks, single `<h1>`, and nested headings before styling.
2. **Select accessible primitives**: Use shadcn/ui (Radix) primitives for interactive overlays/disclosures and native `<button>`/`<a>` for actions and links.
3. **Validate contrast & non-color cues**: Check foreground/background ratios (especially ivory/sage/earth/photo overlays) and confirm status badges and charts work without color.
4. **Run keyboard-only walkthrough**: Navigate header, mobile drawer (`Escape` + focus return), filters, `Kajian Lanjut` toggle, chart controls, and `Contact` form using only keyboard.
5. **Audit screen-reader & async feedback**: Verify `alt` texts, form error bindings, live regions, chart table fallbacks, and empty/error states.

## Quality Checklist

- [ ] Landmarks (`header`, `nav`, `main`, `article`, `footer`) and skip link are present and properly labeled.
- [ ] Heading order is sequential (`h1` → `h2` → `h3`) with one `<h1>` per page.
- [ ] All interactive controls, mobile menus, disclosures, and chart toggles work via keyboard with visible `focus-visible` rings.
- [ ] Text contrast is `>= 4.5:1` (body/small UI) and `>= 3:1` (large headings/icons/focus rings).
- [ ] Informative images and static maps have descriptive `alt` text; decorative assets are hidden from assistive tech.
- [ ] Forms have visible `<label>`s, clear error text near fields, preserved input on error, and live-region announcements.
- [ ] Charts include keyboard-operable interactivity and a text or table alternative.
- [ ] Empty, loading, and `404`/error states provide clear explanation and next-step links.

## Constraints

- Do not disable pinch-zoom or strip focus outlines without a visible `focus-visible` indicator.
- Do not use clickable `<div>` or `<span>` elements where `<button>` or `<a>` belongs.
- Do not display empty placeholder sections or unexplained blank areas when filtered/unverified content is absent.
