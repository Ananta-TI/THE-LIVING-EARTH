import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Compass, Globe2, Mail, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/public/breadcrumbs";
import { ContactForm } from "@/components/public/contact-form";
import { PageHeroBanner } from "@/components/public/page-hero-banner";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach THE LIVING EARTH editorial desk for questions, educational inquiries, scientific source suggestions, or conservation feedback.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      <PageHeroBanner
        eyebrow="Reader & Research Correspondence"
        title="Get in Touch"
        description="Have questions, dataset suggestions, or want to collaborate? We'd love to hear from you."
        imageSrc="/images/hero-planet.jpg"
        imageAlt="Misty green valley representing THE LIVING EARTH correspondence"
      >
        <Breadcrumbs tone="dark" items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      </PageHeroBanner>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Left Editorial Contact Cards matching Mockup Screen 9 */}
          <aside aria-label="Editorial contact notes" className="space-y-6 lg:col-span-5">
            <div className="rounded-3xl border border-border bg-card p-7 shadow-2xs">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-earth-forest text-earth-ivory">
                    <Globe2 className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="font-heading text-lg font-medium text-foreground">
                      Our Focus
                    </h2>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      A living planet, documented globally—from regional watersheds and coral reefs
                      to global climate indicators.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 border-t border-border/70 pt-5">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-earth-forest text-earth-ivory">
                    <Mail className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="font-heading text-lg font-medium text-foreground">
                      Editorial Desk
                    </h2>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      Write to us about educational inquiries, scientific source corrections, or
                      documented regional case studies.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 border-t border-border/70 pt-5">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-earth-forest text-earth-ivory">
                    <ShieldCheck className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="font-heading text-lg font-medium text-foreground">
                      Privacy &amp; Handling
                    </h2>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      Messages are stored securely for editorial review only and are never
                      displayed publicly or shared with third parties.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-7 shadow-2xs">
              <h2 className="font-heading text-xl font-medium text-foreground">
                Quick Navigation
              </h2>
              <div className="mt-4 flex flex-col gap-3 text-sm font-medium">
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-2 text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <Compass className="size-4" aria-hidden="true" />
                  <span>Explore Five Environmental Pillars</span>
                </Link>
                <Link
                  href="/stories"
                  className="inline-flex items-center gap-2 text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <BookOpen className="size-4" aria-hidden="true" />
                  <span>Read Published Stories</span>
                </Link>
              </div>
            </div>
          </aside>

          {/* Right Form Card */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  );
}
