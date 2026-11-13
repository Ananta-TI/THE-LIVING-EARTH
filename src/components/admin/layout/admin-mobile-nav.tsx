"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Leaf, Menu, X } from "lucide-react";
import { ADMIN_NAV_ITEMS, SITE_CONFIG } from "@/config/site";
import { ADMIN_NAV_ICONS, isNavItemActive } from "@/components/admin/layout/admin-nav-config";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface AdminMobileNavProps {
  readonly unreadMessagesCount?: number;
}

export function AdminMobileNav({ unreadMessagesCount = 0 }: AdminMobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Open admin navigation menu"
          className="size-10 lg:hidden"
        >
          {open ? <X className="size-4" aria-hidden="true" /> : <Menu className="size-4" aria-hidden="true" />}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-heading text-lg">
            <Leaf className="size-4 text-primary" aria-hidden="true" />
            <span>{SITE_CONFIG.name} CMS</span>
          </DialogTitle>
        </DialogHeader>
        <nav aria-label="Mobile CMS Navigation" className="mt-2 space-y-1">
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = ADMIN_NAV_ICONS[item.href];
            const active = isNavItemActive(pathname, item.href);
            const showUnread = item.href === "/admin/messages" && unreadMessagesCount > 0;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted",
                )}
              >
                <span className="flex items-center gap-2.5">
                  {Icon ? <Icon className="size-4 shrink-0" aria-hidden="true" /> : null}
                  <span>{item.label}</span>
                </span>
                {showUnread ? (
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-medium text-primary">
                    {unreadMessagesCount}
                  </span>
                ) : null}
              </Link>
            );
          })}
          <div className="mt-4 border-t border-border pt-3">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center justify-between rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <span>View Public Site</span>
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </nav>
      </DialogContent>
    </Dialog>
  );
}
