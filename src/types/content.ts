import type { PillarSlug } from "@/lib/constants/pillars";

export type VerificationStatus = "Draft" | "Verified" | "Needs Verification" | "Published";

export type ClaimType = "Fakta" | "Proyeksi" | "Interpretasi";

export type SourceTier = "Tier 1" | "Tier 2" | "Tier 3";

export type SolutionEvidenceLevel =
  | "Terbukti efektif"
  | "Terbukti sebagian"
  | "Masih diuji"
  | "Potensial";

export interface SourceReference {
  readonly id: string;
  readonly organization: string;
  readonly title: string;
  readonly year: number;
  readonly url?: string;
  readonly tier: SourceTier;
}

export interface EnvironmentalStatistic {
  readonly id: string;
  readonly pillar: PillarSlug;
  readonly indicator: string;
  readonly value: string;
  readonly unit: string;
  readonly geographicScope: string;
  readonly dataPeriod: string;
  readonly publicationDate: string;
  readonly sourceOrganization: string;
  readonly sourceUrl?: string;
  readonly claimType: ClaimType;
  readonly limitations: string;
  readonly status: Extract<VerificationStatus, "Verified" | "Needs Verification">;
}
