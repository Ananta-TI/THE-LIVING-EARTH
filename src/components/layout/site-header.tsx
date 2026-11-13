"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import { ArrowRight, Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { Button } from "@/components/ui/button";
import { MAIN_NAV_ITEMS } from "@/config/site";
import { cn } from "@/lib/utils";

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const prefersReduced = useReducedMotion();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  const { scrollY, scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    restDelta: 0.001,
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    const nextScrolled = latest > 18;
    setIsScrolled((prev) => (prev === nextScrolled ? prev : nextScrolled));
  });

  useEffect(() => {
    if (!mobileMenuOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        toggleButtonRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <motion.header
      initial={prefersReduced ? false : { opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "sticky top-0 z-40 border-b transition-[background-color,border-color,box-shadow] duration-300",
        isScrolled
          ? "border-border bg-background/95 shadow-[0_6px_20px_-14px_rgba(23,47,37,0.28)]"
          : "border-border/60 bg-background/88",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-[4.25rem] lg:px-8">
        <Link
          href="/"
          onClick={() => setMobileMenuOpen(false)}
          className="group/logo inline-flex min-h-11 items-center rounded-md py-1 transition-opacity hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <BrandLogo tone="light" compact />
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden lg:block"
          onMouseLeave={() => setHoveredHref(null)}
        >
          <ul className="flex items-center gap-0.5">
            {MAIN_NAV_ITEMS.map((item) => {
              const active = isActivePath(pathname, item.href);
              const hovered = hoveredHref === item.href;

              return (
                <li
                  key={item.href}
                  onMouseEnter={() => setHoveredHref(item.href)}
                  className="relative"
                >
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onFocus={() => setHoveredHref(item.href)}
                    onBlur={() => setHoveredHref(null)}
                    className={cn(
                      "relative z-10 inline-flex min-h-10 items-center rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                      active
                        ? "text-earth-deep-forest"
                        : "text-foreground/75 hover:text-earth-deep-forest",
                    )}
                  >
                    {hovered && !prefersReduced ? (
                      <motion.span
                        layoutId="header-nav-hover"
                        transition={{ type: "spring", stiffness: 420, damping: 32 }}
                        aria-hidden="true"
                        className="absolute inset-0 -z-10 rounded-lg bg-secondary/80"
                      />
                    ) : null}

                    {active && !prefersReduced ? (
                      <motion.span
                        layoutId="header-nav-active-pill"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        aria-hidden="true"
                        className="absolute inset-0 -z-20 rounded-lg bg-secondary"
                      />
                    ) : active ? (
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 -z-20 rounded-lg bg-secondary"
                      />
                    ) : null}

                    <span>{item.label}</span>

                    {active && !prefersReduced ? (
                      <motion.span
                        layoutId="header-nav-active-bar"
                        transition={{ type: "spring", stiffness: 420, damping: 32 }}
                        aria-hidden="true"
                        className="absolute right-3.5 bottom-1 left-3.5 h-0.5 rounded-full bg-earth-forest"
                      />
                    ) : active ? (
                      <span
                        aria-hidden="true"
                        className="absolute right-3.5 bottom-1 left-3.5 h-0.5 rounded-full bg-earth-forest"
                      />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2.5">
          <Button
            asChild
            size="sm"
            className="group/cta hidden h-10 rounded-lg bg-earth-forest px-4.5 text-xs font-medium text-earth-ivory shadow-xs transition-[background-color,transform] duration-200 hover:bg-earth-deep-forest active:scale-[0.98] sm:inline-flex"
          >
            <Link href="/our-planet" className="gap-1.5">
              <span>Explore Our Planet</span>
              <ArrowRight
                className="size-3.5 transition-transform duration-200 group-hover/cta:translate-x-0.5 motion-reduce:transform-none"
                aria-hidden="true"
              />
            </Link>
          </Button>

          <button
            ref={toggleButtonRef}
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-primary-nav"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="inline-flex size-11 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-[background-color,transform] duration-200 hover:bg-secondary active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:hidden"
          >
            {mobileMenuOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Subtle Scroll Progress Line Along Bottom Edge of Header */}
      {!prefersReduced ? (
        <motion.div
          aria-hidden="true"
          style={{ scaleX: smoothProgress }}
          className="pointer-events-none h-[2px] w-full origin-left bg-earth-forest/75"
        />
      ) : null}

      <AnimatePresence>
        {mobileMenuOpen ? (
          <motion.nav
            id="mobile-primary-nav"
            aria-label="Mobile navigation"
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-border bg-card px-4 py-4 sm:px-6 lg:hidden"
          >
            <ul className="flex flex-col gap-1">
              {MAIN_NAV_ITEMS.map((item, idx) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <motion.li
                    key={item.href}
                    initial={prefersReduced ? false : { opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.2,
                      delay: prefersReduced ? 0 : idx * 0.025,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex min-h-11 flex-col justify-center rounded-xl px-3.5 py-2.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                        active
                          ? "bg-secondary text-earth-deep-forest"
                          : "text-foreground hover:bg-muted/70",
                      )}
                    >
                      <span className="text-sm font-medium">{item.label}</span>
                      <span className="text-xs text-muted-foreground">{item.description}</span>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
            <div className="mt-3 border-t border-border pt-3">
              <Button
                asChild
                className="h-11 w-full rounded-lg bg-earth-forest text-earth-ivory hover:bg-earth-deep-forest"
              >
                <Link
                  href="/our-planet"
                  onClick={() => setMobileMenuOpen(false)}
                  className="justify-center gap-2"
                >
                  <span>Explore Our Planet</span>
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
