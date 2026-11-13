import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertTriangle, ArrowLeft, CheckCircle2, Leaf, LogOut, ShieldAlert } from "lucide-react";
import { AdminLoginForm } from "@/components/admin/auth/login-form";
import { LoadingState } from "@/components/admin/shared/loading-state";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SITE_CONFIG } from "@/config/site";
import { logoutAction } from "@/features/auth/actions";
import { getAuthStatus } from "@/features/auth/dal";

interface LoginSearchParams {
  readonly error?: string;
  readonly next?: string;
  readonly signedOut?: string;
}

async function AdminLoginContent({
  searchParams,
}: {
  readonly searchParams: Promise<LoginSearchParams>;
}) {
  const [params, auth] = await Promise.all([searchParams, getAuthStatus()]);

  if (auth.status === "authenticated") {
    redirect("/admin");
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="flex flex-col items-center space-y-2 text-center">
        <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
          <Leaf className="size-5" aria-hidden="true" />
        </span>
        <h1 className="font-heading text-3xl font-medium tracking-tight text-foreground">
          {SITE_CONFIG.name}
        </h1>
        <p className="text-sm text-muted-foreground">
          Editorial &amp; Scientific Content Management System
        </p>
      </div>

      {auth.status === "unconfigured" ? (
        <Card className="border-amber-600/30 bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading text-lg text-amber-800 dark:text-amber-300">
              <AlertTriangle className="size-5 shrink-0" aria-hidden="true" />
              <span>Supabase Configuration Required</span>
            </CardTitle>
            <CardDescription>
              Authentication cannot initialize until public Supabase environment variables are
              validly configured.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Check{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
                .env.local
              </code>{" "}
              and ensure these variables contain valid public values:{" "}
              <span className="font-mono text-xs font-medium text-foreground">
                {auth.missing.join(", ")}
              </span>
              .
            </p>
            <AdminLoginForm disabled />
          </CardContent>
        </Card>
      ) : auth.status === "forbidden" ? (
        <Card className="border-destructive/40 bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading text-lg text-destructive">
              <ShieldAlert className="size-5 shrink-0" aria-hidden="true" />
              <span>Access Denied</span>
            </CardTitle>
            <CardDescription>
              You are signed in as{" "}
              <span className="font-medium text-foreground">{auth.user.email}</span>, which does
              not have an administrator profile in{" "}
              <code className="font-mono text-xs">public.profiles</code>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={logoutAction}>
              <Button type="submit" variant="outline" className="w-full gap-2">
                <LogOut className="size-4" aria-hidden="true" />
                <span>Sign Out &amp; Switch Account</span>
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="font-heading text-xl">Administrator Sign In</CardTitle>
            <CardDescription>
              Sign in with your Supabase administrator credentials to manage articles, scientific
              statistics, case studies, and media.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {params.signedOut === "1" ? (
              <div
                role="status"
                className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3.5 py-2.5 text-sm text-primary"
              >
                <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
                <span>You have signed out cleanly.</span>
              </div>
            ) : null}

            {params.error === "forbidden" ? (
              <div
                role="alert"
                className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive"
              >
                <ShieldAlert className="size-4 shrink-0" aria-hidden="true" />
                <span>Administrator authorization is required to access the CMS.</span>
              </div>
            ) : null}

            <AdminLoginForm nextPath={params.next} />
          </CardContent>
        </Card>
      )}

      <div className="text-center">
        <Link
          href="/"
          className="inline-flex min-h-10 items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          <span>Back to Public Website</span>
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage({
  searchParams,
}: {
  readonly searchParams: Promise<LoginSearchParams>;
}) {
  return (
    <main
      id="main-content"
      className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12"
    >
      <Suspense
        fallback={
          <div className="w-full max-w-md">
            <LoadingState label="Checking authentication status..." rows={3} />
          </div>
        }
      >
        <AdminLoginContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
