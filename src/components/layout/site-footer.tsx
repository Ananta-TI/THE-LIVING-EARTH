import Link from "next/link";
import { Compass, Globe2, Mail, Sprout } from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { FooterVideo } from "@/components/layout/footer-video";
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

const SOCIAL_LINKS = [
  { label: "Explore environmental pillars", href: "/explore", Icon: Compass },
  { label: "Our Planet environmental overview", href: "/our-planet", Icon: Globe2 },
  { label: "Conservation and restoration solutions", href: "/solutions", Icon: Sprout },
  { label: "Contact THE LIVING EARTH editorial desk", href: "/contact", Icon: Mail },
] as const;

/**
 * Site footer.
 *
 * The ambient film plate runs behind a deep-forest scrim so the type keeps its
 * contrast, and the top edge fades into the page above rather than cutting hard
 * across the moving image.
 */
export function SiteFooter() {
  return (
    <footer className="relative isolate overflow-hidden bg-earth-deep-forest text-earth-ivory">
      <FooterVideo />

      {/* Legibility stack: flat scrim, then a lift at the top and bottom. */}
      <div aria-hidden="true" className="absolute inset-0 bg-earth-deep-forest/85" />
      <div
        aria-hidden="true"
        className="absolute inset-0 "
      />

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 pt-16 pb-10 sm:px-6 sm:pt-20 lg:px-10">
        {/* Sign-off line, set large so the footer reads as an ending. */}
        <div className="grid gap-8 border-b border-earth-ivory/15 pb-12 lg:grid-cols-12 lg:items-end">
          <p className="font-heading text-[2rem] leading-[1.06] tracking-[-0.02em] text-earth-ivory lg:col-span-7 sm:text-4xl lg:text-[2.9rem]">
            The record stays open.
            <br />
            <span className="text-earth-sage">Every figure keeps its source.</span>
          </p>
          <p className="max-w-md text-sm leading-relaxed text-earth-ivory/65 lg:col-span-5 lg:pb-1">
            {SITE_CONFIG.description}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-5">
            <Link
              href="/"
              className="group/logo inline-flex items-center rounded-md transition-opacity duration-300 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-earth-sage"
            >
              <BrandLogo tone="dark" subtitle="" />
            </Link>

            <p className="max-w-sm font-mono text-[10px] leading-relaxed tracking-[0.12em] text-earth-ivory/45 uppercase">
              {SITE_CONFIG.tagline}
            </p>

            <div className="flex items-center gap-2.5 pt-1">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <Link
                  key={href}
                  href={href}
                  aria-label={label}
                  className="inline-flex size-10 items-center justify-center rounded-full border border-earth-ivory/25 bg-earth-ivory/5 text-earth-ivory/80 backdrop-blur-sm transition-[background-color,color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-earth-sage hover:bg-earth-sage hover:text-earth-deep-forest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-earth-sage motion-reduce:transform-none"
                >
                  <Icon className="size-4" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>

          <nav aria-label="Quick links" className="lg:col-span-2">
            <h2 className="font-mono text-[10px] tracking-[0.16em] text-earth-sage uppercase">
              Quick Links
            </h2>
            <ul className="mt-4 space-y-1">
              {QUICK_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-9 items-center text-sm text-earth-ivory/65 transition-[color,transform] duration-200 hover:translate-x-1 hover:text-earth-ivory focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-earth-sage motion-reduce:transform-none"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Resources" className="lg:col-span-3">
            <h2 className="font-mono text-[10px] tracking-[0.16em] text-earth-sage uppercase">
              Resources
            </h2>
            <ul className="mt-4 space-y-1">
              {RESOURCE_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-9 items-center text-sm text-earth-ivory/65 transition-[color,transform] duration-200 hover:translate-x-1 hover:text-earth-ivory focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-earth-sage motion-reduce:transform-none"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <h2 className="font-mono text-[10px] tracking-[0.16em] text-earth-sage uppercase">
              Status
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-earth-sage shadow-[0_0_0_3px_rgba(122,158,126,0.18)]"
                />
                <dt className="sr-only">Publication status</dt>
                <dd className="text-earth-ivory/65">Publishing</dd>
              </div>
              <div>
                <dt className="sr-only">Archive scope</dt>
                <dd className="font-mono text-[10px] leading-relaxed tracking-[0.1em] text-earth-ivory/45 uppercase">
                  Five domains
                  <br />
                  Open corrections
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-earth-ivory/15 pt-6 text-center sm:flex-row sm:text-left">
          <p className="font-mono text-[10px] tracking-[0.12em] text-earth-ivory/50">
            © {SITE_CONFIG.name}. All rights reserved.
          </p>
          <p className="font-mono text-[10px] tracking-[0.12em] text-earth-ivory/40 uppercase">
            {SITE_CONFIG.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}