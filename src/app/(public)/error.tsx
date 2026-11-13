"use client";

import Link from "next/link";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PublicErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function PublicError({ reset }: PublicErrorProps) {
  return (
    <div className="mx-auto flex min-h-[55vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
      <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/12 text-destructive">
        <AlertCircle className="size-6" aria-hidden="true" />
      </span>
      <h1 className="font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
        Unable to load this section
      </h1>
      <p className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground">
        An unexpected issue interrupted loading this page. Please retry or return to the main showcase.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button type="button" onClick={reset} className="gap-2">
          <RotateCcw className="size-4" aria-hidden="true" />
          <span>Try Again</span>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}
