"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, type LucideIcon } from "lucide-react";
import type { NavMenuItem } from "@/config/site";
import { isActivePath } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";

interface NavDropdownProps {
  readonly item: NavMenuItem;
  readonly pathname: string;
  readonly isLightSurface: boolean;
  readonly active: boolean;
  readonly Icon: LucideIcon;
}

/**
 * Desktop navigation dropdown.
 *
 * Opens on hover for pointer users and on click / Enter / ArrowDown for
 * keyboard users, closing on Escape, blur, or route change. The trigger stays a
 * real link to the section landing page so the menu is a shortcut, never the
 * only way to reach the destination.
 */
export function NavDropdown({ item, pathname, isLightSurface, active, Icon }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  // Remember which route the menu was opened on. A navigation changes
  // `pathname`, which closes the menu without an effect writing state back.
  const [openedFor, setOpenedFor] = useState(pathname);
  const isOpen = open && openedFor === pathname;
  const setOpenState = (next: boolean) => {
    setOpen(next);
    if (next) setOpenedFor(pathname);
  };
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const menuId = useId();
  const closeTimer = useRef<number | undefined>(undefined);

  // A small grace period keeps the menu open while the pointer crosses the gap
  // between the trigger and the panel.
  const cancelClose = () => {
    if (closeTimer.current !== undefined) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = undefined;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpen(false), 140);
  };

  useEffect(() => () => cancelClose(), []);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="relative"
      onPointerEnter={(event) => {
        if (event.pointerType === "touch") return;
        cancelClose();
        setOpenState(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "touch") return;
        scheduleClose();
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <Link
        ref={triggerRef}
        href={item.href}
        aria-current={active ? "page" : undefined}
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setOpen(false)}
        onKeyDown={(event) => {
          if (event.key !== "ArrowDown") return;
          event.preventDefault();
          setOpenState(true);
          // The panel is `visibility: hidden` until the open state commits, and
          // hidden elements cannot take focus, so this waits for the paint after
          // the re-render before moving focus to the first item.
          window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
              containerRef.current
                ?.querySelector<HTMLAnchorElement>("[data-menu-link]")
                ?.focus();
            });
          });
        }}
        className={cn(
          "group relative flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-bold transition-colors duration-300 focus-visible:ring-2 focus-visible:outline-none motion-reduce:transition-none",
          isLightSurface ? "focus-visible:ring-primary" : "focus-visible:ring-earth-sage",
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
            "transition-opacity duration-300 motion-reduce:transition-none",
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
        <ChevronDown
          size={13}
          aria-hidden="true"
          className={cn(
            "ml-0.5 shrink-0 transition-transform duration-300 motion-reduce:transition-none",
            isOpen && "rotate-180",
          )}
        />
        <span
          aria-hidden="true"
          className={cn(
            "absolute -bottom-1 left-1/2 h-[2px] -translate-x-1/2 rounded-full transition-all duration-300 motion-reduce:transition-none",
            active || isOpen ? "w-6" : "w-0 group-hover:w-6",
            isLightSurface ? "bg-primary" : "bg-earth-sage",
          )}
        />
      </Link>

      <div
        id={menuId}
        aria-hidden={!isOpen}
        className={cn(
          "absolute left-1/2 top-[calc(100%+0.6rem)] w-[19rem] -translate-x-1/2 origin-top rounded-2xl border p-2 shadow-[0_20px_50px_-24px_rgba(23,47,37,0.45)] backdrop-blur-2xl backdrop-saturate-150 transition-all duration-200 motion-reduce:transition-none",
          isLightSurface
            ? "border-white/60 bg-background/95"
            : "border-white/30 bg-earth-deep-forest/92",
          isOpen
            ? "visible translate-y-0 scale-100 opacity-100"
            : "invisible -translate-y-1 scale-[0.98] opacity-0",
        )}
      >
        <ul className="flex flex-col">
          {item.links.map((link) => {
            const linkActive = isActivePath(pathname, link.href);

            return (
              <li key={link.href}>
                <Link
                  data-menu-link
                  href={link.href}
                  tabIndex={isOpen ? 0 : -1}
                  aria-current={linkActive ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "group/link flex flex-col gap-0.5 rounded-xl px-3 py-2.5 transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none motion-reduce:transition-none",
                    isLightSurface
                      ? "focus-visible:ring-primary"
                      : "focus-visible:ring-earth-sage",
                    linkActive
                      ? isLightSurface
                        ? "bg-primary/8"
                        : "bg-earth-ivory/10"
                      : isLightSurface
                        ? "hover:bg-primary/6"
                        : "hover:bg-earth-ivory/8",
                  )}
                >
                  <span
                    className={cn(
                      "text-[13px] font-bold",
                      linkActive
                        ? isLightSurface
                          ? "text-primary"
                          : "text-earth-ivory"
                        : isLightSurface
                          ? "text-foreground/85"
                          : "text-earth-ivory/90",
                    )}
                  >
                    {link.label}
                  </span>
                  <span
                    className={cn(
                      "text-[11.5px] leading-snug",
                      isLightSurface ? "text-muted-foreground" : "text-earth-ivory/55",
                    )}
                  >
                    {link.description}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
