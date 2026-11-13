"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";

type CursorVariant = "default" | "interactive" | "card" | "text";

interface ClickBurst {
  readonly id: number;
  readonly x: number;
  readonly y: number;
}

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], summary, label[for], [data-cursor="pointer"]';
const TEXT_INPUT_SELECTOR =
  'input, textarea, select, [contenteditable="true"], [contenteditable=""]';
const CARD_SELECTOR = "article";
const POINTER_MEDIA_QUERY = "(pointer: fine) and (hover: hover)";

function subscribePointerSupport(callback: () => void) {
  const query = window.matchMedia(POINTER_MEDIA_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getPointerSnapshot() {
  return window.matchMedia(POINTER_MEDIA_QUERY).matches;
}

function getPointerServerSnapshot() {
  return false;
}

/**
 * Cute botanical desktop cursor companion ("Si Tunas"):
 * - Zero-lag crisp core seed dot synced directly to mouse coordinates.
 * - Trailing organic ring with a cheerful twin-leaf sprout that tilts into movement,
 *   winks periodically when resting, hops warmly over buttons/cards, and releases a
 *   tiny petal burst on click.
 * Automatically disabled on touch devices, text inputs, and prefers-reduced-motion.
 */
export function LivingEarthCursor() {
  const prefersReduced = useReducedMotion();
  const hasFinePointer = useSyncExternalStore(
    subscribePointerSupport,
    getPointerSnapshot,
    getPointerServerSnapshot,
  );
  const enabled = hasFinePointer && !prefersReduced;
  const [visible, setVisible] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [isPressed, setIsPressed] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [bursts, setBursts] = useState<readonly ClickBurst[]>([]);

  // Zero-lag raw pointer coordinates
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  // Soft spring follower for the outer ring and cute sprout buddy
  const trailX = useSpring(rawX, { stiffness: 280, damping: 24, mass: 0.45 });
  const trailY = useSpring(rawY, { stiffness: 280, damping: 24, mass: 0.45 });

  // Gentle breeze tilt derived from horizontal pointer velocity
  const velX = useVelocity(trailX);
  const breezeRotate = useTransform(velX, [-1400, 0, 1400], [-20, 0, 20]);

  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove("custom-cursor-active");
      return;
    }

    let blinkTimeoutId: number | undefined;
    const blinkIntervalId = window.setInterval(() => {
      setIsBlinking(true);
      blinkTimeoutId = window.setTimeout(() => setIsBlinking(false), 140);
    }, 4200);

    const resolveTargetVariant = (target: EventTarget | null): CursorVariant => {
      if (!(target instanceof Element)) return "default";
      if (target.closest(TEXT_INPUT_SELECTOR)) return "text";
      if (target.closest(INTERACTIVE_SELECTOR)) return "interactive";
      if (target.closest(CARD_SELECTOR)) return "card";
      return "default";
    };

    const handleMouseMove = (event: MouseEvent) => {
      rawX.set(event.clientX);
      rawY.set(event.clientY);

      if (!document.documentElement.classList.contains("custom-cursor-active")) {
        document.documentElement.classList.add("custom-cursor-active");
      }

      setVisible(true);
      setVariant(resolveTargetVariant(event.target));
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    const handleMouseDown = (event: MouseEvent) => {
      setIsPressed(true);
      const targetVariant = resolveTargetVariant(event.target);
      if (targetVariant === "text") return;

      const id = Date.now() + Math.random();
      setBursts((prev) => [...prev.slice(-4), { id, x: event.clientX, y: event.clientY }]);
      window.setTimeout(() => {
        setBursts((prev) => prev.filter((item) => item.id !== id));
      }, 620);
    };

    const handleMouseUp = () => {
      setIsPressed(false);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("blur", handleMouseLeave);
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });

    return () => {
      window.clearInterval(blinkIntervalId);
      if (blinkTimeoutId !== undefined) window.clearTimeout(blinkTimeoutId);
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("blur", handleMouseLeave);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [enabled, rawX, rawY]);

  if (!enabled) return null;

  const isTextInput = variant === "text";
  const isInteractive = variant === "interactive";
  const isCard = variant === "card";

  const ringSize = isInteractive ? 40 : isCard ? 36 : 28;
  const sproutHappy = isInteractive || isCard;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none"
    >
      {/* Click botanical ripple & tiny floating leaf particles */}
      <AnimatePresence>
        {bursts.map((burst) => (
          <motion.div
            key={burst.id}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.58, ease: "easeOut" }}
            style={{ left: burst.x, top: burst.y }}
            className="fixed -translate-x-1/2 -translate-y-1/2"
          >
            {/* Soft outward ripple */}
            <motion.span
              initial={{ scale: 0.3, opacity: 0.65 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="block size-7 rounded-full border border-earth-forest/65"
            />
            {/* Three cute mini leaf sparks */}
            {[
              { x: -15, y: -18, r: -35 },
              { x: 16, y: -14, r: 30 },
              { x: 2, y: -22, r: 8 },
            ].map((leaf, idx) => (
              <motion.svg
                key={idx}
                viewBox="0 0 12 12"
                initial={{ x: 0, y: 0, scale: 0.4, opacity: 0.95, rotate: 0 }}
                animate={{
                  x: leaf.x,
                  y: leaf.y,
                  scale: 1,
                  opacity: 0,
                  rotate: leaf.r,
                }}
                transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
                className="fixed top-1/2 left-1/2 -mt-1.5 -ml-1.5 size-3 text-earth-forest"
                fill="currentColor"
              >
                <path d="M2 10C2 5 5.5 2 10 2C10 6.5 7 10 2 10Z" />
              </motion.svg>
            ))}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Trailing botanical ring + cute twin-leaf sprout companion */}
      <motion.div
        style={{
          x: trailX,
          y: trailY,
        }}
        animate={{
          opacity: visible && !isTextInput ? 1 : 0,
          scale: isPressed ? 0.84 : 1,
        }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          animate={{
            width: ringSize,
            height: ringSize,
            backgroundColor: isInteractive
              ? "rgba(36, 74, 56, 0.14)"
              : isCard
                ? "rgba(166, 181, 155, 0.16)"
                : "rgba(36, 74, 56, 0.04)",
            borderColor: isInteractive
              ? "rgba(36, 74, 56, 0.6)"
              : "rgba(36, 74, 56, 0.32)",
          }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex items-center justify-center rounded-full border shadow-[0_0_0_1px_rgba(247,245,239,0.4)]"
        >
          {/* Cute Sprout Buddy perched on top-right rim of the ring */}
          <motion.div
            animate={{
              y: sproutHappy ? -3 : 0,
              scale: sproutHappy ? 1.16 : 1,
              rotate: isPressed ? -16 : sproutHappy ? -8 : 0,
            }}
            transition={{ type: "spring", stiffness: 360, damping: 20 }}
            className="absolute -top-3.5 -right-2.5 flex items-center justify-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.22)]"
          >
            <motion.svg
              style={{ rotate: breezeRotate }}
              width="24"
              height="24"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Crisp ivory halo stroke so the cute sprout reads cleanly over dark hero photos & cream backgrounds */}
              <path
                d="M14 23V13M14 14C14 9.5 17.5 6 22.5 5.8C22.2 10.8 18.8 14 14 14ZM14 15.5C14 11.2 10.5 7.8 5.5 7.8C5.8 12.6 9.2 15.5 14 15.5Z"
                stroke="#f7f5ef"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Left & right leaves filled */}
              <path
                d="M14 14C14 9.5 17.5 6 22.5 5.8C22.2 10.8 18.8 14 14 14Z"
                fill="#4d8b65"
                stroke="#172f25"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <path
                d="M14 15.5C14 11.2 10.5 7.8 5.5 7.8C5.8 12.6 9.2 15.5 14 15.5Z"
                fill="#6ca77d"
                stroke="#172f25"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              {/* Tiny cute bud face on a round sprout head at base of leaves */}
              <circle
                cx="14"
                cy="19.5"
                r="4.3"
                fill="#dce5d7"
                stroke="#172f25"
                strokeWidth="1.2"
              />
              {/* Left & right blinking cute eyes */}
              <ellipse
                cx="12.4"
                cy="19.3"
                rx="0.65"
                ry={isBlinking ? 0.15 : 0.75}
                fill="#172f25"
              />
              <ellipse
                cx="15.6"
                cy="19.3"
                rx="0.65"
                ry={isBlinking ? 0.15 : 0.75}
                fill="#172f25"
              />
              {/* Happy tiny smile (deepens on interactive hover!) */}
              <path
                d={sproutHappy ? "M12.6 20.7C13.3 21.6 14.7 21.6 15.4 20.7" : "M13 20.7C13.6 21.2 14.4 21.2 15 20.7"}
                stroke="#172f25"
                strokeWidth="1"
                strokeLinecap="round"
              />
            </motion.svg>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Zero-lag precision core dot right at pointer tip */}
      <motion.div
        style={{
          x: rawX,
          y: rawY,
        }}
        animate={{
          opacity: visible && !isTextInput ? 1 : 0,
          scale: isPressed ? 0.75 : isInteractive ? 1.25 : 1,
        }}
        transition={{ duration: 0.12 }}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2"
      >
        <span className="block size-2 rounded-full border border-earth-ivory bg-earth-deep-forest shadow-[0_1px_2px_rgba(0,0,0,0.3)]" />
      </motion.div>
    </div>
  );
}
