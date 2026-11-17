import type { Metadata } from "next";
import { AboutInteractiveView } from "@/components/public/about-interactive-view";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about THE LIVING EARTH—our vision, mission, scientific values, editorial approach, and five environmental pillars.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return <AboutInteractiveView />;
}