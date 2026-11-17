"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import PixelSwapImpl from "@/components/PixelSwap";

interface HeroPlateProps {
  readonly imageSrc: string;
  readonly alt?: string;
  /** Stable identity of the current frame; changing it replays the wipe. */
  readonly frameKey: string;
  /** Painted on the very first render so the hero is never empty. */
  readonly firstSrc: string;
}

const Swap = PixelSwapImpl as unknown as React.ComponentType<Record<string, unknown>>;

function Frame({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
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
 * PixelSwap runs fully uncontrolled, exactly like the library's own example:
 * `intro` plays a pixel-grid wipe on mount and there is no `active` prop, so
 * nothing fights the component's internal state.
 *
 * Two behaviours drive the wiring here:
 *
 * 1. In `intro` mode PixelSwap wipes **layer 0** (`engine.mode === 'intro'`, its
 *    frame loop targets index 0). So `firstContent` is the *incoming*
 *    photograph being revealed, and `secondContent` is the frame left standing
 *    behind it. Getting this backwards makes the wipe dissolve into the old
 *    image — which is why the swap used to look like a hard cut.
 *
 * 2. `intro` only fires once per mount, so each domain change mounts a fresh
 *    instance via the `key`. The incoming image is decoded first, otherwise the
 *    wipe reveals a half-loaded frame.
 */
export function HeroPixelSwap({ imageSrc, alt = "", frameKey, firstSrc }: HeroPlateProps) {
  const previousRef = useRef(imageSrc);
  const [plate, setPlate] = useState({ behind: firstSrc, src: imageSrc });

  useEffect(() => {
    if (previousRef.current === imageSrc) return undefined;

    const behind = previousRef.current;
    previousRef.current = imageSrc;

    let cancelled = false;
    const image = new window.Image();
    image.src = imageSrc;

    const start = () => {
      if (cancelled) return;
      setPlate({ behind, src: imageSrc });
    };

    if (image.complete) {
      start();
    } else {
      image.addEventListener("load", start, { once: true });
      image.addEventListener("error", start, { once: true });
    }

    return () => {
      cancelled = true;
      image.removeEventListener("load", start);
      image.removeEventListener("error", start);
    };
  }, [imageSrc]);

  return (
    <Swap
      key={`${frameKey}-${plate.behind}`}
      firstContent={<Frame src={plate.src} alt={alt} />}
      secondContent={<Frame src={plate.behind} alt="" />}
      pattern="random"
      pixelSize={72}
      pixelRadius={4}
      gap={1}
      pixelScale={0.1}
      pixelSpin={0}
      duration={520}
      pixelDuration={460}
      randomness={0.35}
      bounce={0.3}
      trigger="hover"
      intro
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ borderRadius: 0, aspectRatio: "auto", height: "100%" }}
    />
  );
}
