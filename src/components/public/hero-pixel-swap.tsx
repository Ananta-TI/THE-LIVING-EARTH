"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import PixelSwapImpl from "@/components/PixelSwap";

interface HeroPlateProps {
  readonly imageSrc: string;
  readonly alt?: string;
  /** Painted on the very first render so the hero is never empty. */
  readonly firstSrc: string;
}

const Swap = PixelSwapImpl as unknown as React.ComponentType<Record<string, unknown>>;

/**
 * One photographed layer.
 *
 * `key` is deliberately part of the element so that changing the source mounts
 * a brand-new `<img>` node rather than mutating `src` on the existing one.
 * `next/image` keeps the old bitmap on screen while swapping `src` in place,
 * which made every domain change render the *previous* photograph even though
 * the markup already pointed at the new one.
 */
function Frame({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      key={src}
      src={src}
      alt={alt}
      fill
      sizes="100vw"
      priority
      className="object-cover object-center"
    />
  );
}

/**
 * Hero image transition.
 *
 * Modelled directly on the library's own example: PixelSwap stays mounted for
 * the whole life of the hero and both frames are always present, so no
 * teardown happens between domains (a remount briefly dropped the image and let
 * the section's dark green background show through as a flicker).
 *
 * `intro` plays a pixel-grid wipe once on mount and wipes **layer 0**, so
 * `firstContent` is the photograph being revealed and `secondContent` is what
 * stands behind it. Publishing a new pair of sources therefore replays the wipe
 * with the outgoing domain underneath.
 *
 * Both frames are preloaded and decoded before being published, otherwise the
 * wipe reveals a half-loaded image.
 */
export function HeroPixelSwap({ imageSrc, alt = "", firstSrc }: HeroPlateProps) {
  const currentRef = useRef(firstSrc);
  const replayRef = useRef<(() => void) | null>(null);
  const [plate, setPlate] = useState({
    incoming: firstSrc,
    behind: firstSrc,
  });

  useEffect(() => {
    if (currentRef.current === imageSrc) return undefined;

    const behind = currentRef.current;
    currentRef.current = imageSrc;

    let cancelled = false;
    const incoming = new window.Image();
    const outgoing = new window.Image();
    incoming.src = imageSrc;
    outgoing.src = behind;

    const publish = () => {
      if (cancelled) return;
      setPlate({ incoming: imageSrc, behind });
      // Replay the wipe against the outgoing frame now that both are decoded.
      replayRef.current?.();
    };

    const ready = [incoming, outgoing].every((image) => image.complete);
    if (ready) {
      publish();
    } else {
      let left = 2;
      const settle = () => {
        left -= 1;
        if (left <= 0) publish();
      };
      incoming.addEventListener("load", settle, { once: true });
      incoming.addEventListener("error", settle, { once: true });
      outgoing.addEventListener("load", settle, { once: true });
      outgoing.addEventListener("error", settle, { once: true });
      return () => {
        cancelled = true;
        incoming.removeEventListener("load", settle);
        incoming.removeEventListener("error", settle);
        outgoing.removeEventListener("load", settle);
        outgoing.removeEventListener("error", settle);
      };
    }

    return () => {
      cancelled = true;
    };
  }, [imageSrc]);

  return (
    <Swap
      key="hero-plate"
      firstContent={<Frame src={plate.incoming} alt={alt} />}
      secondContent={<Frame src={plate.behind} alt="" />}
      replayRef={replayRef}
      /* `pointer` starts the wipe at the cursor, but the hero is decorative and
         the cursor sits on the rail to the right, which pushed the wipe into
         one corner and read as "no effect". `center` always expands from the
         middle so the transition is equally visible wherever the cursor is.
         `duration` is the stagger between tiles and `pixelDuration` is how fast
         one tile grows. The tile count comes from `pixelSize` against a 1440px
         hero (~45 tiles at 160), so the two together decide whether the pass
         reads as a sweep or as a few lonely squares. */
      pattern="center"
      pixelSize={110}
      pixelRadius={0}
      gap={0}
      pixelScale={0}
      pixelSpin={0}
      duration={620}
      pixelDuration={200}
      randomness={0.25}
      bounce={0.45}
      trigger="hover"
      intro
      /* The domain rail is the real control; the plate is decorative, so it must
         not become a tab stop that steals focus and swaps the image by itself. */
      focusable={false}
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ borderRadius: 0, aspectRatio: "auto", height: "100%" }}
    />
  );
}
