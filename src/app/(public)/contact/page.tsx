import type { Metadata } from "next";
import { ContactInteractiveView } from "@/components/public/contact-interactive-view";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach THE LIVING EARTH editorial desk for questions, educational inquiries, scientific source suggestions, or conservation feedback.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return <ContactInteractiveView />;
}