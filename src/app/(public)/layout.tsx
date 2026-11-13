import { Suspense, type ReactNode } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LivingEarthCursor } from "@/components/public/living-earth-cursor";
import { SmoothScroll } from "@/components/public/smooth-scroll";

export default function PublicLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <SmoothScroll />
      <LivingEarthCursor />
      <Suspense
        fallback={
          <header
            aria-hidden="true"
            className="sticky top-0 z-40 h-16 border-b border-border/80 bg-background/95 lg:h-[4.25rem]"
          />
        }
      >
        <SiteHeader />
      </Suspense>
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
