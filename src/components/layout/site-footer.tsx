import Link from "next/link";
import { Compass, Globe2, Mail, Sprout } from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { SITE_CONFIG } from "@/config/site";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Explore", href: "/explore" },
  { label: "Stories", href: "/stories" },
] as const;

const RESOURCE_LINKS = [
  { label: "Our Planet", href: "/our-planet" },
  { label: "Solutions", href: "/solutions" },
  { label: "Sources & Citations", href: "/our-planet#sources" },
  { label: "Contact", href: "/contact" },
] as const;

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 pt-14 pb-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-5">
            <Link
              href="/"
              className="inline-flex items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <BrandLogo tone="light" />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              {SITE_CONFIG.description}
            </p>
          </div>

          <div className="lg:col-span-2">
            <h2 className="font-sans text-xs font-semibold tracking-wider text-earth-deep-forest uppercase">
              Quick Links
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {QUICK_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-9 items-center text-muted-foreground transition-colors hover:text-earth-forest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h2 className="font-sans text-xs font-semibold tracking-wider text-earth-deep-forest uppercase">
              Resources
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {RESOURCE_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-9 items-center text-muted-foreground transition-colors hover:text-earth-forest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="font-sans text-xs font-semibold tracking-wider text-earth-deep-forest uppercase">
              Explore &amp; Connect
            </h2>
            <div className="mt-4 flex items-center gap-2.5">
              <Link
                href="/explore"
                aria-label="Explore environmental pillars"
                className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-earth-forest transition-colors hover:bg-earth-forest hover:text-earth-ivory focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <Compass className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/our-planet"
                aria-label="Our Planet environmental overview"
                className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-earth-forest transition-colors hover:bg-earth-forest hover:text-earth-ivory focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <Globe2 className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/solutions"
                aria-label="Conservation and restoration solutions"
                className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-earth-forest transition-colors hover:bg-earth-forest hover:text-earth-ivory focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <Sprout className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/contact"
                aria-label="Contact THE LIVING EARTH editorial desk"
                className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-earth-forest transition-colors hover:bg-earth-forest hover:text-earth-ivory focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <Mail className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-border/80 pt-6 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
          <p>© {SITE_CONFIG.name}. All rights reserved.</p>
          <p>{SITE_CONFIG.tagline}</p>
        </div>
      </div>

      {/* Signature misty alpine & evergreen forest treeline silhouette */}
      <div
        aria-hidden="true"
        className="h-24 w-full bg-cover bg-bottom bg-no-repeat sm:h-32"
        style={{ backgroundImage: "url('/images/footer-forest.svg')" }}
      />
    </footer>
  );
}
