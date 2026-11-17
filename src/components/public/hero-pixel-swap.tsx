"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import PixelSwapImpl from "@/components/PixelSwap";

interface HeroPixelSwapProps {
  readonly imageSrc: string;
  readonly alt?: string;
  /** Stable identity of the current frame; changing it drives the wipe. */
  readonly frameKey: string;
  /** Painted on the very first render so the hero is never empty. */
  readonly fallbackSrc: string;
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
 * PixelSwap reveals `secondContent` over `firstContent` with a pixel-grid wipe
 * driven by its `active` prop. `firstContent` is therefore the outgoing
 * photograph and `secondContent` the incoming one, so the pixels genuinely
 * break the previous domain apart instead of the image cutting.
 *
 * `active` is reset once the wipe settles so the next change can flip it again.
 */
export function HeroPixelSwap({ imageSrc, alt = "", frameKey, fallbackSrc }: HeroPixelSwapProps) {
  const previousRef = useRef(fallbackSrc);
  const [swap, setSwap] = useState({ from: fallbackSrc, active: false });

  useEffect(() => {
    const from = previousRef.current;
    previousRef.current = imageSrc;
    if (from === imageSrc) return undefined;

    setSwap({ from, active: true });
    const settled = window.setTimeout(() => {
      setSwap({ from: imageSrc, active: false });
    }, 1250);
    return () => window.clearTimeout(settled);
  }, [frameKey, imageSrc]);

  return (
    <Swap
      firstContent={<Frame src={swap.from} alt="" />}
      secondContent={<Frame src={imageSrc} alt={alt} />}
      active={swap.active}
      pattern="random"
      pixelSize={96}
      gap={2}
      pixelRadius={10}
      pixelScale={0.22}
      pixelSpin={20}
      duration={900}
      pixelDuration={700}
      randomness={0.5}
      bounce={0.4}
      trigger="click"
      intro={false}
      aspectRatio="16 / 9"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ aspectRatio: "auto" }}
    />
  );
}
