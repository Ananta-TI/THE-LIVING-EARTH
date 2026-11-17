---
name: nextjs-frontend-architecture
description: Use this skill when creating, organizing, refactoring, debugging, or extending Next.js App Router routes, layouts, Server/Client Component boundaries, typed JSON content loaders, TypeScript types, Zod validation, or shadcn/ui integration in THE LIVING EARTH.
---

# Next.js Frontend Architecture

## Purpose

Maintain a modular, type-safe, secure, and performant **Next.js App Router** architecture for **THE LIVING EARTH** (*A Journey Through Our Changing Planet*) that cleanly separates static JSON content, domain logic, and UI across public editorial routes and the validated contact workflow.

## When to Use

- Creating or structuring App Router routes, layouts, `loading.tsx`, `error.tsx`, `not-found.tsx`, `sitemap.ts`, `robots.ts`, and metadata (`generateMetadata`).
- Designing Server Component vs. Client Component (`'use client'`) boundaries and isolating client-side interactivity (`Motion`, `Recharts`, filters, search, forms).
- Modeling TypeScript domain entities (pillars, topics, articles, case studies, statistics, references) and enforcing publish-status filtering.
- Implementing Zod validation for the contact form, `shadcn/ui` primitives, or JSON content loaders.

*Do not use this skill for aesthetic design choices (use `frontend-design`), responsive CSS rules (use `responsive-design`), or scientific data rules (use `environmental-data-visualization`).*

## Responsibilities

- Enforce Next.js App Router conventions, Server-first rendering, and feature-oriented modularity.
- Keep content separated from presentation: JSON files in `src/data/` are the single source of truth.
- Enforce strict TypeScript, publish-status filtering, and a stable typed query layer.

## Implementation Guidelines

1. **Server Components by default**: Author `page.tsx`, `layout.tsx`, and content-loading views as React Server Components. Push `'use client'` strictly to small interactive leaf components (navigation drawer, `Kajian Lanjut` toggle, search/filter bar, Motion wrappers, Recharts charts, `Contact` form).
2. **Static JSON content layer**: Content lives in `src/data/*.json`, typed by `src/types/content-data.ts`, and is exposed through helper selectors in `src/data/index.ts` plus `src/features/public/queries.ts`. Do not fetch content from a database or remote API.
3. **Canonical Information Architecture & 3-click routing**: Structure routes cleanly around the 7 canonical top-level destinations (`/`, `/about`, `/explore`, `/stories`, `/our-planet`, `/solutions`, `/contact`) plus supporting routes (`/explore/[slug]`, `/stories/[slug]`, `/case-studies/[slug]`). Route Pillar 05 (*Solutions & Restoration*) canonically to `/solutions` without creating a duplicate pillar page.
4. **Content-presentation separation & publish filtering**: Keep structured content separate from React UI components. Centralize selectors that **filter out** records with `status !== "published"` (articles, case studies, statistics) or `is_active !== true` (pillars, topics) at the data-access boundary so unpublished content never renders publicly.
5. **Thin pages & reusable domain modules**: Keep `app/**/page.tsx` concise—load validated domain data, generate SEO/Open Graph/structured metadata (`generateMetadata`), and compose focused feature components alongside shared `components/ui` (`shadcn/ui`) and `lib/` utilities.
6. **Strict TypeScript without `any`**: Define explicit types for all entities (`Pillar`, `Topic`, `Article`, `CaseStudy`, `Statistic`, `Reference`, `ContactSubmission`). Use `unknown` + validation instead of `any`.
7. **Validated contact workflow**: Validate the contact form on the client with Zod. The form uses a `mailto:` handoff and does not persist submissions. Keep a visible fallback email address and non-lossy form state.
8. **No credentials or runtime storage**: The site must remain fully static on Vercel. Do not introduce server secrets, database clients, authentication, or runtime file writes.
9. **Resilient route boundaries & performance**: Provide `loading.tsx`, `error.tsx`, and `not-found.tsx` (linking back to `/`, `/stories`, and search), optimize images via `next/image`, limit loaded fonts (`next/font`, 1–2 families), and avoid unnecessary dependencies outside the approved stack.
10. **Static params for dynamic routes**: Export `generateStaticParams()` on `/explore/[slug]`, `/stories/[slug]`, and `/case-studies/[slug]` so every published detail page is prerendered at build time.

## Project-Specific Rules

- **Static-first scope**: Support the JSON content workflow cleanly out of the box without user accounts, bookmarks, donations, marketplaces, or CMS dashboards. Keep data loaders behind typed query functions so the presentation layer stays stable.
- **No Empty Content Stubs**: Only generate links for topics, solution categories, and case-study sections that have verified content; return `notFound()` for unknown or unpublished slugs.
- **Approved Stack Only**: Use Next.js App Router, React, TypeScript, Tailwind CSS, `shadcn/ui`, `lucide-react`, `motion`, `recharts`, and `zod`.

## Workflow

1. **Define route & data contract**: Confirm the App Router path, SEO metadata needs, and Server/Client component split.
2. **Model types & schemas**: Define or update strict TypeScript interfaces in `src/types/content-data.ts` and JSON records in `src/data/`.
3. **Implement gated data access**: Build centralized selectors that enforce published/active-only filtering and clean fallbacks.
4. **Compose thin routes & leaf clients**: Wire Server Component pages to reusable UI components and minimal `'use client'` leaves, plus `loading.tsx`/`error.tsx`/`not-found.tsx`.
5. **Run technical verification**: Execute `tsc --noEmit`, ESLint, and `next build`, and verify unpublished content does not appear in public routes or client bundles.

## Quality Checklist

- [ ] Routes, layouts, metadata, and `loading.tsx`/`error.tsx`/`not-found.tsx` follow App Router conventions and canonical sitemap structure.
- [ ] Components default to React Server Components; `'use client'` is strictly limited to interactive leaves.
- [ ] Publish filtering excludes `draft`/`archived` records and inactive pillars/topics at the data boundary.
- [ ] No database clients, auth, server secrets, or runtime file writes appear in the codebase.
- [ ] Strict TypeScript checks pass with zero `any` leaks.
- [ ] Contact form validates with Zod and preserves user input on errors.
- [ ] Dynamic detail routes export `generateStaticParams()`.
- [ ] Business logic and data queries are centralized, reusable, and free of duplication.
- [ ] Application lints and builds cleanly without unused dependencies.

## Constraints

- Do not mark `layout.tsx` or top-level `page.tsx` files `'use client'` merely for a nested animation, chart, or menu.
- Do not bypass publish filtering or expose unpublished entries in public routes or client search indices.
- Do not introduce unapproved packages or premature MVP out-of-scope systems (accounts, payments, real-time telemetry, CMS).
