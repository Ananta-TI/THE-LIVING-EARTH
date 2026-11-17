import type { Metadata } from "next";
import { ExploreInteractiveView } from "@/components/public/explore-interactive-view";

export const metadata: Metadata = {
  title: "Explore Environmental Pillars",
  description:
    "Discover the five interconnected environmental pillars of THE LIVING EARTH: Climate & Atmosphere, Oceans & Water, Forests & Biodiversity, Pollution & Human Impact, and Solutions & Restoration.",
  alternates: {
    canonical: "/explore",
  },
};

export default function ExplorePage() {
  return <ExploreInteractiveView />;
}