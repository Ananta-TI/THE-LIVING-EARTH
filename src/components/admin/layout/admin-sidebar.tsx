"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, LogOut, ShieldCheck } from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { ADMIN_NAV_ITEMS, SITE_CONFIG } from "@/config/site";
import { ADMIN_NAV_ICONS, isNavItemActive } from "@/components/admin/layout/admin-nav-config";
import { logoutAction } from "@/features/auth/actions";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  readonly unreadMessagesCount?: number;
}

export function AdminSidebar({ unreadMessagesCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex lg:w-64 lg:shrink-0 lg:flex-col">
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
        <Link
          href="/admin"
          className="inline-flex min-h-11 items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring"
        >
          <BrandLogo tone="dark" subtitle="Editorial CMS" compact />
        </Link>
      </div>

      {/* Admin Profile Header matching Screen 10 */}
      <div className="flex items-center gap-3 border-b border-sidebar-border/80 px-5 py-3.5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-earth-forest text-earth-ivory ring-1 ring-earth-sage/35">
          <ShieldCheck className="size-4 text-earth-soft-sage" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-earth-ivory">Admin</p>
          <p className="truncate text-[11px] text-earth-sage">Administrator</p>
        </div>
      </div>

      <nav aria-label="CMS Navigation" className="flex-1 overflow-y-auto p-3.5">
        <ul className="space-y-1">
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = ADMIN_NAV_ICONS[item.href];
            const active = isNavItemActive(pathname, item.href);
            const showUnread = item.href === "/admin/messages" && unreadMessagesCount > 0;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-10 items-center justify-between gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring",
                    active
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-xs ring-1 ring-earth-sage/25"
                      : "text-sidebar-foreground/85 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <span className="flex items-center gap-2.5 truncate">
                    {Icon ? <Icon className="size-4 shrink-0" aria-hidden="true" /> : null}
                    <span className="truncate">{item.label}</span>
                  </span>
                  {showUnread ? (
                    <span
                      className={cn(
                        "rounded-lg px-2 py-0.5 text-[11px] font-medium tabular-nums",
                        active
                          ? "bg-earth-ivory text-earth-deep-forest"
                          : "bg-earth-sage/25 text-earth-ivory",
                      )}
                    >
                      {unreadMessagesCount}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="space-y-1.5 border-t border-sidebar-border p-3.5">
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex min-h-10 w-full items-center gap-2.5 rounded-xl px-3.5 py-2 text-sm font-medium text-sidebar-foreground/85 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring"
          >
            <LogOut className="size-4 shrink-0" aria-hidden="true" />
            <span>Logout</span>
          </button>
        </form>

        <Link
          href="/"
          className="flex min-h-10 items-center justify-between gap-2 rounded-xl px-3.5 py-2 text-xs font-medium text-earth-sage transition-colors hover:bg-sidebar-accent hover:text-earth-ivory focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring"
        >
          <span className="truncate">View {SITE_CONFIG.name}</span>
          <ArrowUpRight className="size-3.5 shrink-0" aria-hidden="true" />
        </Link>
      </div>
    </aside>
  );
}
