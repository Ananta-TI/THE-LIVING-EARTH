---
name: nextjs-frontend-architecture
description: Use this skill when creating, organizing, refactoring, debugging, or extending Next.js App Router routes, layouts, Server/Client Component boundaries, structured content loaders, TypeScript types, Zod validation, shadcn/ui integration, or Supabase integration in THE LIVING EARTH.
---

# Next.js Frontend Architecture

## Purpose

Maintain a modular, type-safe, secure, and performant **Next.js App Router** architecture for **THE LIVING EARTH** (*A Journey Through Our Changing Planet*) that cleanly separates content, domain logic, and UI across public editorial routes, validated contact workflows, and optional Supabase-backed extensions.

## When to Use

- Creating or structuring App Router routes, layouts, `loading.tsx`, `error.tsx`, `not-found.tsx`, `sitemap.ts`, `robots.ts`, and metadata (`generateMetadata`).
- Designing Server Component vs. Client Component (`'use client'`) boundaries and isolating client-side interactivity (`Motion`, `Recharts`, filters, search, forms).
- Modeling TypeScript domain entities (pillars, topics, articles, case studies, statistics, references, media assets, glossary terms) and enforcing `Content Status Gate` (`Verified` vs. `Needs Verification`).
- Implementing Zod validation, Server Actions, Route Handlers (e.g., `Contact` form submission with zero-cost spam protection), `shadcn/ui` primitives, or Supabase integration.

*Do not use this skill for aesthetic design choices (use `frontend-design`), responsive CSS rules (use `responsive-design`), or scientific data rules (use `environmental-data-visualization`).*

## Responsibilities

- Enforce Next.js App Router conventions, Server-first rendering, and feature-oriented modularity.
- Keep content separated from presentation (`static structured content` for MVP, plus clean adapter boundaries for Supabase persistence where needed).
- Enforce strict TypeScript, server-side Zod validation, `Content Status Gate` filtering, and secret/credential hygiene.

## Implementation Guidelines

1. **Server Components by default**: Author `page.tsx`, `layout.tsx`, and content-loading views as React Server Components. Push `'use client'` strictly to small interactive leaf components (navigation drawer, `Kajian Lanjut` toggle, search/filter bar, Motion wrappers, Recharts charts, `Contact` form).
2. **Strict server/client isolation**: Guard server-only modules with `import 'server-only'` when accessing server secrets, file-system content, or privileged Supabase clients. Never expose `SUPABASE_SERVICE_ROLE_KEY` or server-only credentials to Client Components or `NEXT_PUBLIC_*` env vars.
3. **Canonical Information Architecture & 3-click routing**: Structure routes cleanly around the 7 canonical top-level destinations (`/`, `/about`, `/explore`, `/stories`, `/our-planet`, `/solutions`, `/contact`) plus supporting routes (`/about/metodologi`, `/about/glosarium`, `/about/kredit-lisensi`, `/stories/[slug]`, `/our-planet/studi-kasus/[slug]`). Route Pillar 05 (*Solutions & Restoration*) canonically to `/solutions` without creating a duplicate pillar page.
4. **Content-presentation separation & Content Status Gate (FR-039)**: Keep structured content (articles, case studies, statistics, references, glossary, media license records) separate from React UI components. Centralize selector helpers that **filter out** any item with `status !== 'Verified'` (or missing source/period/license) at the data-access boundary so unverified content never renders publicly.
5. **Thin pages & reusable domain modules**: Keep `app/**/page.tsx` concise—load validated domain data, generate SEO/Open Graph/structured metadata (`generateMetadata`), and compose focused feature components alongside shared `components/ui` (`shadcn/ui`) and `lib/` utilities.
6. **Strict TypeScript without `any`**: Define explicit types for all entities (`Pillar`, `Topic`, `Article` with `IntiCerita`/`KajianLanjut`, `CaseStudy`, `Statistic`, `Reference`, `MediaAsset`, `GlossaryTerm`, `ContactSubmission`). Use `unknown` + Zod parsing instead of `any`.
7. **Server-side Zod validation & Contact protection**: Validate all dynamic route params, search queries, Server Actions, and Route Handlers on the server using **Zod**. For `Contact` submissions (including optional `Koreksi data` link/note fields), implement server-side validation, zero-cost spam protection (honeypot + lightweight rate limiting), and safe error/success responses without losing form state on failure.
8. **Centralized Supabase & environment helpers**: When Supabase is used (e.g., storing contact/correction submissions or future CMS extensions), centralize browser, server-cookie, and server-only clients in `lib/supabase/` with explicit env validation rather than scattering raw `process.env` reads.
9. **Resilient route boundaries & performance**: Provide `loading.tsx`, `error.tsx`, and `not-found.tsx` (linking back to `/`, `/stories`, and search), optimize images via `next/image`, limit loaded fonts (`next/font`, 1–2 families), and avoid unnecessary dependencies outside the approved stack.

## Project-Specific Rules

- **MVP Scope Discipline**: Support the static structured content workflow cleanly out of the box without forcing user accounts, bookmarks, donations, marketplaces, or unrequested full CMS dashboards onto MVP routes; keep data loaders abstracted behind typed repository functions so Supabase migration remains seamless if enabled later.
- **No Empty Content Stubs**: Only generate links for topics, solution categories, and case-study sections that have verified content; return `notFound()` for unknown/unverified slugs.
- **Approved Stack Only**: Use Next.js App Router, React, TypeScript, Tailwind CSS, `shadcn/ui`, `lucide-react`, `motion`, `recharts`, `@supabase/*`, and `zod`.

## Workflow

1. **Define route & data contract**: Confirm the App Router path, SEO metadata needs, and Server/Client component split.
2. **Model types & Zod schemas**: Define or update strict TypeScript interfaces and Zod validation schemas in centralized domain modules.
3. **Implement gated data access**: Build centralized loaders/actions that enforce `Verified`-only filtering (`Content Status Gate`) and clean error handling.
4. **Compose thin routes & leaf clients**: Wire Server Component pages to reusable UI components and minimal `'use client'` leaves, plus `loading.tsx`/`error.tsx`/`not-found.tsx`.
5. **Run technical verification**: Execute `tsc --noEmit`, ESLint, and `next build` (when project is initialized) and verify no server secrets or unverified data leak to client bundles.

## Quality Checklist

- [ ] Routes, layouts, metadata, and `loading.tsx`/`error.tsx`/`not-found.tsx` follow App Router conventions and canonical sitemap structure.
- [ ] Components default to React Server Components; `'use client'` is strictly limited to interactive leaves.
- [ ] `Content Status Gate` filters out `Needs Verification` / unverified assets at the data boundary.
- [ ] Zero `SUPABASE_SERVICE_ROLE_KEY` or server-only imports appear in client code.
- [ ] Strict TypeScript checks pass with zero `any` leaks.
- [ ] Contact form and dynamic inputs validate with Zod on both client and server (with spam protection and non-lossy error states).
- [ ] Business logic and data queries are centralized, reusable, and free of duplication.
- [ ] Application lints and builds cleanly without unused dependencies.

## Constraints

- Do not mark `layout.tsx` or top-level `page.tsx` files `'use client'` merely for a nested animation, chart, or menu.
- Do not bypass `Content Status Gate` filtering or expose `Needs Verification` entries in public routes or client search indices.
- Do not trust client-side checks for server mutations or embed secrets in `NEXT_PUBLIC_*` variables.
- Do not introduce unapproved packages or premature MVP out-of-scope systems (accounts, payments, real-time telemetry).
