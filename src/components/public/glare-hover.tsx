"use client";

import GlareHoverImpl from "@/components/GlareHover";
import { cn } from "@/lib/utils";

const Glare = GlareHoverImpl as unknown as React.ComponentType<Record<string, unknown>>;

export interface GlareHoverProps {
  readonly children: React.ReactNode;
  readonly glareColor?: string;
  readonly glareOpacity?: number;
  readonly glareAngle?: number;
  readonly glareSize?: number;
  readonly softness?: number;
  readonly variant?: "streak" | "twin" | "sheen";
  readonly blendMode?: string;
  readonly rimGlint?: boolean;
  readonly mode?: "hover" | "click" | "loop" | "follow";
  readonly transitionDuration?: number;
  readonly interval?: number;
  readonly playOnce?: boolean;
  /** Sweep once when the element first scrolls into view. */
  readonly intro?: boolean;
  readonly borderRadius?: string;
  readonly borderColor?: string;
  readonly className?: string;
  readonly style?: React.CSSProperties;
}

/**
 * Thin glare/sheen layer over any child, from the React Bits registry.
 *
 * On this site it is applied to small editorial imagery — pillar plates, case
 * study thumbnails, and the restoration pathway stills — so the images catch
 * light on hover instead of sitting inert. `intro` is disabled by default here
 * because a page-wide burst of auto-sweeping images is noise, not signal.
 */
export function GlareHover({
  children,
  glareColor = "#f7f5ef",
  glareOpacity = 0.28,
  glareAngle = -45,
  glareSize = 26,
  softness = 0.65,
  variant = "streak",
  blendMode = "screen",
  rimGlint = false,
  mode = "hover",
  transitionDuration = 700,
  interval = 3,
  playOnce = false,
  intro = false,
  borderRadius = "0px",
  borderColor = "transparent",
  className,
  style,
}: GlareHoverProps) {
  return (
    <Glare
      glareColor={glareColor}
      glareOpacity={glareOpacity}
      glareAngle={glareAngle}
      glareSize={glareSize}
      softness={softness}
      variant={variant}
      blendMode={blendMode}
      rimGlint={rimGlint}
      mode={mode}
      transitionDuration={transitionDuration}
      interval={interval}
      playOnce={playOnce}
      intro={intro}
      borderRadius={borderRadius}
      borderColor={borderColor}
      className={cn("block w-full border-0", className)}
      style={{ width: "100%", height: "100%", ...style }}
    >
      {children}
    </Glare>
  );
}
