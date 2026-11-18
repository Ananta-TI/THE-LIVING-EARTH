"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Ambient film plate behind the site footer.
 *
 * The clip is decorative, so it is muted, looped, and inline. Readers who ask
 * for reduced motion get the still first frame instead of a moving background,
 * and playback is paused while the tab is hidden so it does not burn battery in
 * the background.
 */
export function FooterVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [allowMotion, setAllowMotion] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setAllowMotion(!reduced.matches);
    sync();
    reduced.addEventListener("change", sync);
    return () => reduced.removeEventListener("change", sync);
  }, []);

  // Only play while the footer is on screen.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "120px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const shouldPlay = allowMotion && inView && !document.hidden;
    if (shouldPlay) {
      video.play().catch(() => {
        // Autoplay can be refused; the poster frame remains, which is fine.
      });
    } else {
      video.pause();
    }
  }, [allowMotion, inView]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVisibility = () => {
      if (document.hidden) video.pause();
      else if (allowMotion && inView) video.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [allowMotion, inView]);

  return (
    <video
      ref={videoRef}
      aria-hidden="true"
      muted
      loop
      playsInline
      preload="metadata"
      poster="/video/footer-poster.jpg"
      tabIndex={-1}
      className="absolute inset-0 h-full w-full object-cover"
    >
      {/* WebM first: Chromium builds without proprietary codecs cannot decode
          H.264, and VP9 is supported everywhere modern. Safari falls through to
          the MP4 source. */}
      <source src="/video/scene-optimized.webm" type="video/webm" />
      <source src="/video/scene-optimized.mp4" type="video/mp4" />
    </video>
  );
}