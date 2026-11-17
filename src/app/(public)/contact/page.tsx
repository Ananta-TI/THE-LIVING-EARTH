import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/public/contact-form";
import { EditorialPageHero } from "@/components/public/editorial-page-hero";
import { EditorialSection } from "@/components/public/editorial-section";
import { SITE_CONFIG } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach THE LIVING EARTH editorial desk for questions, educational inquiries, scientific source suggestions, or conservation feedback.",
  alternates: {
    canonical: "/contact",
  },
};

const HANDLING_NOTES = [
  {
    label: "What reaches us",
    body: "Editorial questions, educational inquiries, dataset suggestions, documented regional case studies, and factual corrections.",
  },
  {
    label: "What we do with it",
    body: "The form prepares a message in your own email app. Your note goes straight to the editorial desk and is never stored on this website.",
  },
  {
    label: "Corrections",
    body: "If a figure on this site is wrong, send the citation. Verified corrections are republished with a note on the affected page.",
  },
] as const;

export default function ContactPage() {
  return (
    <>
      <EditorialPageHero
        index="Section 07"
        context="Correspondence"
        title="Write to the editorial desk"
        standfirst="Questions, dataset suggestions, and documented field studies are all welcome. So are corrections — especially corrections."
        imageSrc="/images/hero-planet.jpg"
        imageAlt="Misty green valley representing THE LIVING EARTH correspondence"
      >
        <a
          href={`mailto:${SITE_CONFIG.contactEmail}`}
          className="font-mono text-[11px] tracking-[0.1em] text-earth-ivory underline decoration-earth-ivory/40 underline-offset-[6px] transition-colors hover:decoration-earth-ivory focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-earth-sage"
        >
          {SITE_CONFIG.contactEmail}
        </a>
      </EditorialPageHero>

      <div className="mx-auto w-full max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
        <EditorialSection
          headingId="contact-form-heading"
          index="Section 02"
          title="Send a message"
          lede="Fill in the fields below and your email app will open with the message ready to send. Nothing is submitted to this website."
        >
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

            <aside aria-label="Handling and correspondence notes" className="lg:col-span-5">
              <dl className="border-t border-border">
                {HANDLING_NOTES.map((note) => (
                  <div key={note.label} className="border-b border-border py-6">
                    <dt className="font-mono text-[10px] tracking-[0.12em] text-earth-muted">
                      {note.label.toUpperCase()}
                    </dt>
                    <dd className="mt-3 max-w-[46ch] text-sm leading-relaxed text-muted-foreground">
                      {note.body}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="mt-10 font-mono text-[10px] tracking-[0.12em] text-earth-muted">
                ELSEWHERE ON THE RECORD
              </p>
              <ul className="mt-4 border-t border-border">
                <li className="border-b border-border">
                  <Link
                    href="/explore"
                    className="group/row flex items-center justify-between gap-6 py-4 text-sm text-foreground transition-colors duration-200 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  >
                    <span>Explore the five domains</span>
                    <span
                      aria-hidden="true"
                      className="text-muted-foreground transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/row:translate-x-1 motion-reduce:transform-none"
                    >
                      &rarr;
                    </span>
                  </Link>
                </li>
                <li className="border-b border-border">
                  <Link
                    href="/stories"
                    className="group/row flex items-center justify-between gap-6 py-4 text-sm text-foreground transition-colors duration-200 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  >
                    <span>Read the archive</span>
                    <span
                      aria-hidden="true"
                      className="text-muted-foreground transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/row:translate-x-1 motion-reduce:transform-none"
                    >
                      &rarr;
                    </span>
                  </Link>
                </li>
                <li className="border-b border-border">
                  <Link
                    href="/about#approach"
                    className="group/row flex items-center justify-between gap-6 py-4 text-sm text-foreground transition-colors duration-200 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  >
                    <span>How entries are made</span>
                    <span
                      aria-hidden="true"
                      className="text-muted-foreground transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/row:translate-x-1 motion-reduce:transform-none"
                    >
                      &rarr;
                    </span>
                  </Link>
                </li>
              </ul>
            </aside>
          </div>
        </EditorialSection>
      </div>
    </>
  );
}
