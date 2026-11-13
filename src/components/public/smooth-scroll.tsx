"use client";

import { useEffect } from "react";

function findScrollableAncestor(element: Element | null): HTMLElement | null {
  let current: Element | null = element;
  while (current && current !== document.documentElement && current !== document.body) {
    if (current instanceof HTMLElement) {
      const style = window.getComputedStyle(current);
      const overflowY = style.overflowY;
      const isScrollable =
        (overflowY === "auto" || overflowY === "scroll") &&
        current.scrollHeight > current.clientHeight + 2;
      if (isScrollable) {
        return current;
      }
      if (current.getAttribute("role") === "dialog") {
        return current;
      }
    }
    current = current.parentElement;
  }
  return null;
}

function normalizeWheelDelta(event: WheelEvent): number {
  if (event.deltaMode === 1) {
    return event.deltaY * 32;
  }
  if (event.deltaMode === 2) {
    return event.deltaY * window.innerHeight * 0.85;
  }
  return event.deltaY;
}

/**
 * Provides gentle, inertia-damped wheel scrolling on desktop viewports while
 * preserving native scrolling for nested containers, zoom gestures, keyboard
 * navigation, scrollbar dragging, and prefers-reduced-motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedQuery.matches) return;

    let currentY = window.scrollY;
    let targetY = window.scrollY;
    let rafId: number | null = null;
    let lastTime = 0;
    let isStepping = false;

    const getMaxScroll = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    const stopAnimation = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      isStepping = false;
      lastTime = 0;
    };

    const step = (now: number) => {
      if (!lastTime) lastTime = now;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const maxScroll = getMaxScroll();
      targetY = Math.max(0, Math.min(targetY, maxScroll));

      const diff = targetY - currentY;
      if (Math.abs(diff) < 0.45) {
        isStepping = true;
        window.scrollTo({ top: targetY, behavior: "instant" });
        currentY = targetY;
        stopAnimation();
        return;
      }

      // Frame-rate independent exponential smoothing
      const alpha = 1 - Math.exp(-10.5 * dt);
      currentY += diff * alpha;

      isStepping = true;
      window.scrollTo({ top: currentY, behavior: "instant" });
      isStepping = false;

      rafId = requestAnimationFrame(step);
    };

    const handleWheel = (event: WheelEvent) => {
      if (reducedQuery.matches) return;
      if (event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.defaultPrevented) return;

      const target = event.target instanceof Element ? event.target : null;
      if (target && findScrollableAncestor(target)) {
        return;
      }

      // Allow native fast inertia on high-resolution trackpad gestures unless discrete/moderate
      const delta = normalizeWheelDelta(event);
      if (delta === 0) return;

      event.preventDefault();

      if (rafId === null) {
        currentY = window.scrollY;
        targetY = window.scrollY;
      }

      targetY = Math.max(0, Math.min(targetY + delta, getMaxScroll()));

      if (rafId === null) {
        lastTime = 0;
        rafId = requestAnimationFrame(step);
      }
    };

    const handleNativeScroll = () => {
      if (isStepping) return;
      // Sync external scrolls (anchor links, scrollbar drag, PageDown, focus-scroll)
      if (rafId === null) {
        currentY = window.scrollY;
        targetY = window.scrollY;
      }
    };

    const handleInterrupt = () => {
      stopAnimation();
      currentY = window.scrollY;
      targetY = window.scrollY;
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "PageDown" ||
        event.key === "PageUp" ||
        event.key === "Home" ||
        event.key === "End" ||
        event.key === "ArrowDown" ||
        event.key === "ArrowUp"
      ) {
        handleInterrupt();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("scroll", handleNativeScroll, { passive: true });
    window.addEventListener("pointerdown", handleInterrupt, { passive: true });
    window.addEventListener("keydown", handleKeyDown, { passive: true });
    window.addEventListener("hashchange", handleInterrupt, { passive: true });
    window.addEventListener("popstate", handleInterrupt, { passive: true });

    return () => {
      stopAnimation();
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleNativeScroll);
      window.removeEventListener("pointerdown", handleInterrupt);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("hashchange", handleInterrupt);
      window.removeEventListener("popstate", handleInterrupt);
    };
  }, []);

  return null;
}
