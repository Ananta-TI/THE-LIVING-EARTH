"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

interface MotionRevealProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly delay?: number;
}

/**
 * Gentle GPU-composited scroll-triggered reveal with calm deceleration
 * and automatic reduced-motion fallback.
 */
export function MotionReveal({ children, className, delay = 0 }: MotionRevealProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: "some" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
