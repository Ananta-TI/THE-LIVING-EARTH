import { Suspense, type ReactNode } from "react";
import { AdminShell } from "@/components/admin/layout/admin-shell";
import { LoadingState } from "@/components/admin/shared/loading-state";
import { requireAdmin } from "@/features/auth/dal";

async function ProtectedAdminGate({ children }: { readonly children: ReactNode }) {
  const { supabase, user, profile } = await requireAdmin();

  const { count } = await supabase
    .from("contact_submissions")
    .select("*", { count: "exact", head: true })
    .eq("status", "unread");

  return (
    <AdminShell
      adminName={profile.full_name}
      adminEmail={user.email ?? undefined}
      unreadMessagesCount={count ?? 0}
    >
      {children}
    </AdminShell>
  );
}

function AdminShellSkeleton() {
  return (
    <div className="min-h-screen bg-background p-6 lg:p-10">
      <div className="mx-auto max-w-6xl">
        <LoadingState label="Verifying administrator session..." rows={6} />
      </div>
    </div>
  );
}

export default function ProtectedAdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <Suspense fallback={<AdminShellSkeleton />}>
      <ProtectedAdminGate>{children}</ProtectedAdminGate>
    </Suspense>
  );
}
