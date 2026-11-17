export type ContentStatus = "draft" | "published" | "archived";

export type StatisticDataType =
  | "historical_observation"
  | "current_estimate"
  | "projection";

export type ReferenceSourceType =
  | "scientific_journal"
  | "research_report"
  | "government_data"
  | "international_organization"
  | "institutional_report"
  | "other";

export interface PillarRecord {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly description: string;
  readonly cover_image_path: string | null;
  readonly display_order: number;
  readonly is_active: boolean;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface TopicRecord {
  readonly id: string;
  readonly pillar_id: string;
  readonly name: string;
  readonly slug: string;
  readonly description: string;
  readonly display_order: number;
  readonly is_active: boolean;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface ReferenceRecord {
  readonly id: string;
  readonly title: string;
  readonly organization: string;
  readonly source_type: ReferenceSourceType;
  readonly author: string | null;
  readonly publication_date: string | null;
  readonly source_url: string;
  readonly accessed_at: string;
  readonly notes: string | null;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface ArticleRecord {
  readonly id: string;
  readonly pillar_id: string;
  readonly topic_id: string | null;
  readonly title: string;
  readonly slug: string;
  readonly excerpt: string;
  readonly content: string;
  readonly cover_image_path: string | null;
  readonly author_id: string | null;
  readonly status: ContentStatus;
  readonly featured: boolean;
  readonly seo_title: string | null;
  readonly seo_description: string | null;
  readonly published_at: string | null;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface CaseStudyRecord {
  readonly id: string;
  readonly pillar_id: string;
  readonly title: string;
  readonly slug: string;
  readonly summary: string;
  readonly content: string;
  readonly country: string;
  readonly region: string | null;
  readonly latitude: number | null;
  readonly longitude: number | null;
  readonly cover_image_path: string | null;
  readonly organization: string | null;
  readonly start_date: string | null;
  readonly end_date: string | null;
  readonly status: ContentStatus;
  readonly published_at: string | null;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface StatisticRecord {
  readonly id: string;
  readonly pillar_id: string;
  readonly reference_id: string;
  readonly indicator: string;
  readonly unit: string;
  readonly geographic_scope: string;
  readonly value: number;
  readonly measurement_year: number;
  readonly publication_date: string | null;
  readonly methodology: string | null;
  readonly limitations: string | null;
  readonly data_type: StatisticDataType;
  readonly status: ContentStatus;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface ArticleReferenceRecord {
  readonly article_id: string;
  readonly reference_id: string;
}

export interface CaseStudyReferenceRecord {
  readonly case_study_id: string;
  readonly reference_id: string;
}

export interface SiteSettingsRecord {
  readonly general: {
    readonly site_name: string;
    readonly tagline: string;
    readonly description: string;
    readonly contact_email: string;
  };
  readonly social_media: {
    readonly instagram_url: string;
    readonly youtube_url: string;
    readonly x_url: string;
    readonly linkedin_url: string;
  };
  readonly seo_defaults: {
    readonly default_title: string;
    readonly default_description: string;
    readonly og_image_path: string;
  };
  readonly footer: {
    readonly mission_statement: string;
    readonly methodology_note: string;
    readonly copyright_text: string;
  };
  readonly site_identity: {
    readonly siteTitle: string;
    readonly tagline: string;
    readonly contactEmail: string;
    readonly featuredHeroSlug: string;
  };
}
