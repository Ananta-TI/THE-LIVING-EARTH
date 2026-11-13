import type { ReactNode } from "react";
import { AdminHeader } from "@/components/admin/layout/admin-header";
import { AdminSidebar } from "@/components/admin/layout/admin-sidebar";

interface AdminShellProps {
  readonly adminName: string;
  readonly adminEmail?: string;
  readonly unreadMessagesCount?: number;
  readonly children: ReactNode;
}

export function AdminShell({
  adminName,
  adminEmail,
  unreadMessagesCount = 0,
  children,
}: AdminShellProps) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AdminSidebar unreadMessagesCount={unreadMessagesCount} />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader
          adminName={adminName}
          adminEmail={adminEmail}
          unreadMessagesCount={unreadMessagesCount}
        />

        <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
