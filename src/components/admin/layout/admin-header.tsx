import { LogOut, ShieldCheck } from "lucide-react";
import { AdminBreadcrumbs } from "@/components/admin/layout/admin-breadcrumbs";
import { AdminMobileNav } from "@/components/admin/layout/admin-mobile-nav";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/features/auth/actions";

interface AdminHeaderProps {
  readonly adminName: string;
  readonly adminEmail?: string;
  readonly unreadMessagesCount?: number;
}

export function AdminHeader({
  adminName,
  adminEmail,
  unreadMessagesCount = 0,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between gap-3 border-b border-border bg-card/95 px-4 backdrop-blur-xs sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <AdminMobileNav unreadMessagesCount={unreadMessagesCount} />
        <AdminBreadcrumbs />
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 sm:flex">
          <ShieldCheck className="size-3.5 text-primary" aria-hidden="true" />
          <div className="text-left leading-tight">
            <p className="text-xs font-semibold text-foreground">{adminName}</p>
            {adminEmail ? (
              <p className="text-[11px] text-muted-foreground">{adminEmail}</p>
            ) : null}
          </div>
        </div>

        <form action={logoutAction}>
          <Button type="submit" variant="outline" size="sm" className="min-h-10 gap-1.5">
            <LogOut className="size-3.5" aria-hidden="true" />
            <span>Sign Out</span>
          </Button>
        </form>
      </div>
    </header>
  );
}
