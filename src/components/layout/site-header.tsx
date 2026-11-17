"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  BookOpen,
  Compass,
  Globe2,
  House,
  Info,
  Mail,
  Sprout,
  type LucideIcon,
} from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { MAIN_NAV_ITEMS } from "@/config/site";
import { cn } from "@/lib/utils";

const NAV_ICONS: Readonly<Record<string, LucideIcon>> = {
  "/": House,
  "/about": Info,
  "/explore": Compass,
  "/stories": BookOpen,
  "/our-planet": Globe2,
  "/solutions": Sprout,
  "/contact": Mail,
};

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  const isHome = pathname === "/";
  const hasFloatingSurface = isScrolled || mobileMenuOpen;
  const isLightSurface = hasFloatingSurface || !isHome;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    const handlePopState = () => {
      setMobileMenuOpen(false);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        toggleButtonRef.current?.focus();
      }
    };

    const desktopQuery = window.matchMedia("(min-width: 1280px)");
    const handleDesktopViewport = () => {
      if (desktopQuery.matches) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    desktopQuery.addEventListener("change", handleDesktopViewport);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      desktopQuery.removeEventListener("change", handleDesktopViewport);
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Keeps content clear of the fixed header on every route except the home hero. */}
      {!isHome ? <div aria-hidden="true" className="h-[4.875rem]" /> : null}

      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex w-full justify-center">
        {/* Readability scrim over the photographic home hero. */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-earth-deep-forest/60 via-earth-deep-forest/25 to-transparent transition-opacity duration-500 motion-reduce:transition-none",
            isLightSurface ? "opacity-0" : "opacity-100",
          )}
        />

        <div
          className={cn(
            "pointer-events-auto relative flex w-full flex-col transition-all duration-500 ease-in-out motion-reduce:transition-none",
            hasFloatingSurface
              ? "mt-3 w-[94%] max-w-[1220px] rounded-3xl border border-white/60 bg-background/90 shadow-[0_18px_50px_-24px_rgba(23,47,37,0.45)] backdrop-blur-2xl backdrop-saturate-150 xl:rounded-full"
              : "mt-0 max-w-full border border-transparent bg-transparent",
          )}
        >
          <div className="relative z-10 mx-auto w-full max-w-[1400px]">
            <div
              className={cn(
                "flex w-full items-center justify-between gap-3 transition-all duration-500 ease-in-out motion-reduce:transition-none",
                hasFloatingSurface
                  ? "px-5 py-2.5 lg:px-7"
                  : "px-4 py-4 sm:px-6 lg:px-10",
              )}
            >
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="THE LIVING EARTH — Home"
                className={cn(
                  "group flex shrink-0 items-center rounded-full py-1 transition-opacity duration-300 hover:opacity-90 focus-visible:ring-2 focus-visible:outline-none motion-reduce:transition-none",
                  isLightSurface
                    ? "focus-visible:ring-primary"
                    : "focus-visible:ring-earth-sage",
                )}
              >
                <BrandLogo tone={isLightSurface ? "light" : "dark"} compact subtitle="" />
              </Link>

              <nav
                aria-label="Primary navigation"
                className="hidden items-center gap-1 xl:flex"
              >
                {MAIN_NAV_ITEMS.map((item) => {
                  const active = isActivePath(pathname, item.href);
                  const Icon = NAV_ICONS[item.href] ?? Compass;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group relative flex items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-bold transition-colors duration-300 focus-visible:ring-2 focus-visible:outline-none motion-reduce:transition-none",
                        isLightSurface
                          ? "focus-visible:ring-primary"
                          : "focus-visible:ring-earth-sage",
                        active
                          ? isLightSurface
                            ? "text-primary"
                            : "text-earth-ivory"
                          : isLightSurface
                            ? "text-foreground/70 hover:text-primary"
                            : "text-earth-ivory/75 hover:text-earth-ivory",
                      )}
                    >
                      <Icon
                        size={14}
                        aria-hidden="true"
                        className={cn(
                          "transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none",
                          active
                            ? isLightSurface
                              ? "text-primary"
                              : "text-earth-ivory"
                            : isLightSurface
                              ? "opacity-55 group-hover:text-primary"
                              : "opacity-70",
                        )}
                      />
                      <span>{item.label}</span>
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute -bottom-1 left-1/2 h-[2px] -translate-x-1/2 rounded-full transition-all duration-300 motion-reduce:transition-none",
                          active ? "w-6" : "w-0 group-hover:w-6",
                          isLightSurface ? "bg-primary" : "bg-earth-sage",
                        )}
                      />
                    </Link>
                  );
                })}
              </nav>

              <div className="hidden shrink-0 items-center xl:flex">
                <Link
                  href="/our-planet"
                  className={cn(
                    "group/cta inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-bold shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:scale-95 focus-visible:ring-2 focus-visible:outline-none motion-reduce:transform-none motion-reduce:transition-none",
                    isLightSurface
                      ? "bg-primary text-primary-foreground hover:bg-earth-deep-forest focus-visible:ring-primary"
                      : "bg-earth-ivory text-earth-deep-forest hover:bg-white focus-visible:ring-earth-sage",
                  )}
                >
                  <span>Explore Our Planet</span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className={cn(
                      "size-4 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 motion-reduce:transform-none",
                      isLightSurface ? "text-earth-soft-sage" : "text-earth-forest",
                    )}
                  />
                </Link>
              </div>

              <div className="flex items-center xl:hidden">
                <button
                  ref={toggleButtonRef}
                  type="button"
                  onClick={() => setMobileMenuOpen((prev) => !prev)}
                  aria-expanded={mobileMenuOpen}
                  aria-controls="mobile-primary-nav"
                  aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                  className={cn(
                    "flex h-10 w-10 flex-col items-center justify-center space-y-1.5 rounded-full border shadow-sm backdrop-blur-md transition-colors duration-300 focus-visible:ring-2 focus-visible:outline-none motion-reduce:transition-none",
                    isLightSurface
                      ? "border-border bg-background/70 text-foreground hover:bg-background focus-visible:ring-primary"
                      : "border-white/25 bg-earth-deep-forest/35 text-earth-ivory hover:bg-earth-deep-forest/55 focus-visible:ring-earth-sage",
                  )}
                >
                  <span
                    className={cn(
                      "block h-[2px] w-5 rounded-full bg-current transition-all duration-300 motion-reduce:transition-none",
                      mobileMenuOpen && "translate-y-[8px] rotate-45",
                    )}
                  />
                  <span
                    className={cn(
                      "block h-[2px] w-5 rounded-full bg-current transition-all duration-300 motion-reduce:transition-none",
                      mobileMenuOpen ? "opacity-0" : "opacity-100",
                    )}
                  />
                  <span
                    className={cn(
                      "block h-[2px] w-5 rounded-full bg-current transition-all duration-300 motion-reduce:transition-none",
                      mobileMenuOpen && "-translate-y-[8px] -rotate-45",
                    )}
                  />
                </button>
              </div>
            </div>

            <nav
              id="mobile-primary-nav"
              aria-label="Mobile navigation"
              aria-hidden={!mobileMenuOpen}
              inert={!mobileMenuOpen}
              className={cn(
                "grid overflow-hidden transition-all duration-500 ease-in-out motion-reduce:transition-none xl:hidden",
                mobileMenuOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="min-h-0">
                <div className="mt-1 flex max-h-[calc(100dvh-7rem)] flex-col overflow-y-auto overscroll-contain px-5 pb-6 sm:px-6">
                  <div className="mb-2 h-px w-full bg-border/70" />

                  {MAIN_NAV_ITEMS.map((item) => {
                    const active = isActivePath(pathname, item.href);
                    const Icon = NAV_ICONS[item.href] ?? Compass;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-3 border-b border-border/60 py-3 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none motion-reduce:transition-none",
                          active
                            ? "font-bold text-primary"
                            : "text-foreground/75 hover:text-primary",
                        )}
                      >
                        <Icon
                          size={14}
                          aria-hidden="true"
                          className={active ? "text-primary" : "opacity-60"}
                        />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}

                  <Link
                    href="/our-planet"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-lg transition active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none motion-reduce:transform-none"
                  >
                    <span>Explore Our Planet</span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 text-earth-soft-sage"
                    />
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
