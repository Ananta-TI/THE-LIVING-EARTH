---
name: motion-interaction-design
description: Use this skill when implementing or reviewing animations, page/section transitions, scroll-triggered reveals, hover states, micro-interactions, or motion-based storytelling using Motion for React and CSS/Tailwind transitions in THE LIVING EARTH.
---

# Motion & Interaction Design

## Purpose

Design and implement subtle, lightweight, purposeful motion for **THE LIVING EARTH** (*A Journey Through Our Changing Planet*) that enriches editorial storytelling and interactive clarity while preserving fast mobile performance, calm reading, and reduced-motion accessibility.

## When to Use

- Implementing restrained entrance sequences for `Home` hero sections, featured stories, or editorial chapters.
- Adding purposeful scroll-triggered reveals or before/after visual comparisons (e.g., satellite imagery or ecosystem restoration transitions).
- Crafting subtle hover states for imagery, pillar cards, story links, or navigation controls.
- Animating interactive UI transitions (mobile drawer, `Kajian Lanjut` disclosure, filter states, Recharts updates, modals/dialogs).

*Do not use this skill for static aesthetic styling (use `frontend-design`), responsive grid geometry (use `responsive-design`), or chart accuracy (use `environmental-data-visualization`).*

## Responsibilities

- Choreograph restrained, nature-editorial motion using **Motion for React** (`motion/react`), CSS transitions, Tailwind transition utilities, and `IntersectionObserver` where appropriate.
- Ensure animations are lightweight, non-blocking (above-the-fold content never waits on animation), and strictly respect `prefers-reduced-motion`.
- Maintain 60fps mobile performance without layout shifts or distracting motion during long-form reading.

## Implementation Guidelines

1. **Purpose over decoration**: Animate only when motion communicates hierarchy, reveals narrative sequence, guides spatial orientation (e.g., opening `Kajian Lanjut` or mobile nav), or confirms user action. Skip decorative motion that serves no user goal.
2. **Non-blocking first paint**: Keep above-the-fold text, hero headlines, and key verified statistics immediately readable without forcing users to wait for multi-second intro animations.
3. **GPU-composited properties only**: Animate `transform` (`translate`, `scale`) and `opacity` (plus lightweight `clip-path` where composited). Never animate layout-triggering properties (`width`, `height`, `top`, `left`, `margin`, `padding`).
4. **One orchestrated moment over scattered motion**: Use a single restrained hero or chapter transition rather than applying identical fade-and-slide-up triggers to every card, stat, and paragraph on the page.
5. **Restrained scroll storytelling**: Use `whileInView` (`viewport={{ once: true, amount: "some" }}`) or `IntersectionObserver` sparingly when narrative pacing or visual evidence comparison benefits. Avoid heavy multi-layer parallax that degrades mobile scrolling or causes motion sickness.
6. **Calm hover & micro-interactions**: Keep hover feedback grounded (`180ms–300ms`, natural deceleration such as `cubic-bezier(0.22, 1, 0.36, 1)`): gentle image scale (`1.02–1.03`) inside `overflow-hidden`, crisp border/underline transitions, and clear active/disabled feedback on filters and forms.
7. **Respect `prefers-reduced-motion` everywhere**: Wrap Motion trees in `<MotionConfig reducedMotion="user">`, pair CSS transitions with Tailwind `motion-reduce:` variants, and use `useReducedMotion()` so users with reduced-motion enabled experience instant or minimal opacity transitions with zero spatial movement.
8. **Smooth data & disclosure transitions**: Keep Recharts series transitions and `Inti Cerita` ↔ `Kajian Lanjut` expansions crisp (`250ms–450ms`) so readers track state changes without losing their reading position.
9. **Isolate client motion boundaries**: Confine `motion/react` wrappers to small `'use client'` leaf components so parent Next.js Server Components stay server-rendered and bundle weight stays low (targeting mobile Lighthouse performance `>= 80`).

## Project-Specific Rules

- **Nature-Editorial Calm**: Avoid bouncy springs, continuous ambient loops, pulsing badges, or flashy SaaS/tech transitions; **THE LIVING EARTH** has a documentary, contemplative tone across its five pillars.
- **High-Value Storytelling Uses**:
  - Restrained `Home` hero entrance and featured story reveal.
  - Interactive before/after environmental imagery comparisons when supported by verified visual assets.
  - Smooth mobile navigation drawer, filter chip updates, and in-page `Kajian Lanjut` expansion.
  - Lightweight Recharts state transitions when toggling timeframes or indicators.
- **Zero Extra Animation Packages**: Use only `motion`, CSS transitions, Tailwind CSS, and native `IntersectionObserver`.

## Workflow

1. **Identify the motion job**: Define whether the transition clarifies a state change, guides navigation, or paces a key storytelling moment.
2. **Pick the lightest mechanism**: Use Tailwind/CSS transitions for hover, focus, and simple state changes; use `motion/react` for `AnimatePresence` unmounts, orchestrated hero reveals, or controlled scroll reveals.
3. **Add reduced-motion & compositing safeguards**: Restrict animated properties to `transform`/`opacity` and test with `prefers-reduced-motion: reduce` enabled.
4. **Verify mobile performance & stability**: Confirm `0` Cumulative Layout Shift, instant content legibility, and smooth frame rates on throttled mobile emulation.

## Quality Checklist

- [ ] Every animation serves a clear communication, navigation, or storytelling purpose.
- [ ] Core above-the-fold text and statistics are immediately legible without waiting on animations.
- [ ] Transitions feel calm, restrained, and documentary—no continuous loops or distracting motion while reading.
- [ ] `prefers-reduced-motion` disables or minimizes motion across both Motion components and CSS transitions.
- [ ] Only `transform` and `opacity` animate, producing zero layout shift.
- [ ] Bundle impact is minimal and mobile scrolling stays smooth.

## Constraints

- Do not hide critical content at `opacity: 0` if JavaScript fails or is slow to hydrate; ensure graceful fallback visibility.
- Do not add heavy parallax, continuous background animations, or extra animation libraries (GSAP, Lottie, etc.).
- Do not obstruct reading flow or keyboard navigation with animated overlays or scroll-hijacking.
