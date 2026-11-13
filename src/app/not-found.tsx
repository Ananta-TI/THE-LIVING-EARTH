import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <main
      id="main-content"
      className="mx-auto flex min-h-[75vh] max-w-2xl flex-col items-start justify-center gap-5 px-4 py-16 sm:px-6"
    >
      <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
        <Compass className="size-3.5" aria-hidden="true" />
        <span>404 · Page Not Found</span>
      </span>
      <h1 className="font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
        This trail does not exist on the map.
      </h1>
      <p className="max-w-prose text-base leading-relaxed text-muted-foreground">
        The article, case study, or pillar page you requested may have moved, been unpublished, or
        entered a spelling mismatch.
      </p>
      <div className="flex flex-wrap gap-3 pt-2">
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/stories">Browse Stories</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/explore">Explore Pillars</Link>
        </Button>
      </div>
    </main>
  );
}
