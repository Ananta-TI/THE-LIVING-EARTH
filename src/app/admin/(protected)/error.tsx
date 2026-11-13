"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminSectionError({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin section render error:", error.message);
  }, [error]);

  return (
    <div
      role="alert"
      className="mx-auto max-w-xl rounded-xl border border-destructive/40 bg-destructive/5 p-6 space-y-4"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive">
          <AlertCircle className="size-4" aria-hidden="true" />
        </span>
        <div className="space-y-1">
          <h2 className="font-heading text-lg font-medium text-foreground">
            Something went wrong in the CMS workspace
          </h2>
          <p className="text-sm text-muted-foreground">
            {error.message || "An unexpected server or database error occurred."}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2.5">
        <Button type="button" size="sm" onClick={reset}>
          Try Again
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
