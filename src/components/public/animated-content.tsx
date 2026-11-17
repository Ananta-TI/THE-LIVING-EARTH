"use client";

import AnimatedContentImpl from "@/components/AnimatedContent";

export interface AnimatedContentProps {
  readonly children: React.ReactNode;
  /** Pixel offset the content travels from. */
  readonly distance?: number;
  readonly direction?: "vertical" | "horizontal";
  readonly reverse?: boolean;
  readonly duration?: number;
  readonly ease?: string;
  readonly initialOpacity?: number;
  readonly animateOpacity?: boolean;
  readonly scale?: number;
  readonly blur?: number;
  readonly rotate?: number;
  readonly threshold?: number;
  readonly delay?: number;
  /** Stagger direct children instead of animating the wrapper as one block. */
  readonly stagger?: number;
  readonly staggerFrom?: "start" | "end" | "center" | "edges" | "random";
  /** "scroll" (default) or "mount" for above-the-fold content. */
  readonly trigger?: "scroll" | "mount";
  readonly once?: boolean;
  readonly className?: string;
}

const Impl = AnimatedContentImpl as unknown as React.ComponentType<
  Record<string, unknown>
>;

/**
 * Scroll/mount reveal backed by GSAP + ScrollTrigger (React Bits registry).
 *
 * Content is prefixed `invisible` by the vendor component and revealed inside
 * its layout effect, which keeps it out of the accessibility tree until the
 * animation is wired up. Because a JS failure would otherwise strand the
 * content, the vendor file patches in a fail-safe reveal.
 */
export function AnimatedContent({
  children,
  distance = 28,
  direction = "vertical",
  reverse = false,
  duration = 0.7,
  ease = "power3.out",
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  blur = 0,
  rotate = 0,
  threshold = 0.1,
  delay = 0,
  stagger = 0,
  staggerFrom = "start",
  trigger = "scroll",
  once = true,
  className,
}: AnimatedContentProps) {
  return (
    <Impl
      container={null}
      distance={distance}
      direction={direction}
      reverse={reverse}
      duration={duration}
      ease={ease}
      initialOpacity={initialOpacity}
      animateOpacity={animateOpacity}
      scale={scale}
      blur={blur}
      rotate={rotate}
      threshold={threshold}
      delay={delay}
      stagger={stagger}
      staggerFrom={staggerFrom}
      trigger={trigger}
      once={once}
      className={className}
    >
      {children}
    </Impl>
  );
}
