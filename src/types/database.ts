/**
 * PROVISIONAL TypeScript database types for THE LIVING EARTH.
 *
 * IMPORTANT: No local Docker/Supabase instance or linked remote database was
 * executed during Phase 2 setup. These types mirror the SQL migrations in
 * `supabase/migrations/20261113000100..20261113000800` and are NOT CLI-generated.
 *
 * Regenerate authoritative types after applying migrations:
 *   npx supabase gen types typescript --local > src/types/database.ts
 * or against a linked project:
 *   npx supabase gen types typescript --project-id <project-ref> > src/types/database.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ContentStatus = "draft" | "published" | "archived";
export type ProfileRole = "admin";
export type ReferenceSourceType =
  | "scientific_journal"
  | "research_report"
  | "government_data"
  | "international_organization"
  | "institutional_report"
  | "other";
export type StatisticDataType =
  | "historical_observation"
  | "current_estimate"
  | "projection";
export type ContactSubmissionStatus = "unread" | "read" | "replied" | "archived";
export type StorageBucketName =
  | "article-images"
  | "case-study-images"
  | "pillar-images"
  | "site-assets";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          avatar_url: string | null;
          role: ProfileRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          avatar_url?: string | null;
          role: ProfileRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          avatar_url?: string | null;
          role?: ProfileRole;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      pillars: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          cover_image_path: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description: string;
          cover_image_path?: string | null;
          display_order: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          cover_image_path?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      topics: {
        Row: {
          id: string;
          pillar_id: string;
          name: string;
          slug: string;
          description: string;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          pillar_id: string;
          name: string;
          slug: string;
          description: string;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          pillar_id?: string;
          name?: string;
          slug?: string;
          description?: string;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "topics_pillar_id_fkey";
            columns: ["pillar_id"];
            isOneToOne: false;
            referencedRelation: "pillars";
            referencedColumns: ["id"];
          },
        ];
      };
      articles: {
        Row: {
          id: string;
          pillar_id: string;
          topic_id: string | null;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          cover_image_path: string | null;
          author_id: string | null;
          status: ContentStatus;
          featured: boolean;
          seo_title: string | null;
          seo_description: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          pillar_id: string;
          topic_id?: string | null;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          cover_image_path?: string | null;
          author_id?: string | null;
          status?: ContentStatus;
          featured?: boolean;
          seo_title?: string | null;
          seo_description?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          pillar_id?: string;
          topic_id?: string | null;
          title?: string;
          slug?: string;
          excerpt?: string;
          content?: string;
          cover_image_path?: string | null;
          author_id?: string | null;
          status?: ContentStatus;
          featured?: boolean;
          seo_title?: string | null;
          seo_description?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "articles_pillar_id_fkey";
            columns: ["pillar_id"];
            isOneToOne: false;
            referencedRelation: "pillars";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "articles_topic_matches_pillar_fk";
            columns: ["topic_id", "pillar_id"];
            isOneToOne: false;
            referencedRelation: "topics";
            referencedColumns: ["id", "pillar_id"];
          },
          {
            foreignKeyName: "articles_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      case_studies: {
        Row: {
          id: string;
          pillar_id: string;
          title: string;
          slug: string;
          summary: string;
          content: string;
          country: string;
          region: string | null;
          latitude: number | null;
          longitude: number | null;
          cover_image_path: string | null;
          organization: string | null;
          start_date: string | null;
          end_date: string | null;
          status: ContentStatus;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          pillar_id: string;
          title: string;
          slug: string;
          summary: string;
          content: string;
          country: string;
          region?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          cover_image_path?: string | null;
          organization?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          status?: ContentStatus;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          pillar_id?: string;
          title?: string;
          slug?: string;
          summary?: string;
          content?: string;
          country?: string;
          region?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          cover_image_path?: string | null;
          organization?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          status?: ContentStatus;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "case_studies_pillar_id_fkey";
            columns: ["pillar_id"];
            isOneToOne: false;
            referencedRelation: "pillars";
            referencedColumns: ["id"];
          },
        ];
      };
      references: {
        Row: {
          id: string;
          title: string;
          organization: string;
          source_type: ReferenceSourceType;
          author: string | null;
          publication_date: string | null;
          source_url: string;
          accessed_at: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          organization: string;
          source_type: ReferenceSourceType;
          author?: string | null;
          publication_date?: string | null;
          source_url: string;
          accessed_at?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          organization?: string;
          source_type?: ReferenceSourceType;
          author?: string | null;
          publication_date?: string | null;
          source_url?: string;
          accessed_at?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      article_references: {
        Row: {
          article_id: string;
          reference_id: string;
          created_at: string;
        };
        Insert: {
          article_id: string;
          reference_id: string;
          created_at?: string;
        };
        Update: {
          article_id?: string;
          reference_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "article_references_article_id_fkey";
            columns: ["article_id"];
            isOneToOne: false;
            referencedRelation: "articles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "article_references_reference_id_fkey";
            columns: ["reference_id"];
            isOneToOne: false;
            referencedRelation: "references";
            referencedColumns: ["id"];
          },
        ];
      };
      case_study_references: {
        Row: {
          case_study_id: string;
          reference_id: string;
          created_at: string;
        };
        Insert: {
          case_study_id: string;
          reference_id: string;
          created_at?: string;
        };
        Update: {
          case_study_id?: string;
          reference_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "case_study_references_case_study_id_fkey";
            columns: ["case_study_id"];
            isOneToOne: false;
            referencedRelation: "case_studies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "case_study_references_reference_id_fkey";
            columns: ["reference_id"];
            isOneToOne: false;
            referencedRelation: "references";
            referencedColumns: ["id"];
          },
        ];
      };
      statistics: {
        Row: {
          id: string;
          pillar_id: string;
          reference_id: string;
          indicator: string;
          value: number;
          unit: string;
          geographic_scope: string;
          measurement_year: number;
          publication_date: string | null;
          methodology: string | null;
          limitations: string | null;
          data_type: StatisticDataType;
          status: ContentStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          pillar_id: string;
          reference_id: string;
          indicator: string;
          value: number;
          unit: string;
          geographic_scope: string;
          measurement_year: number;
          publication_date?: string | null;
          methodology?: string | null;
          limitations?: string | null;
          data_type: StatisticDataType;
          status?: ContentStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          pillar_id?: string;
          reference_id?: string;
          indicator?: string;
          value?: number;
          unit?: string;
          geographic_scope?: string;
          measurement_year?: number;
          publication_date?: string | null;
          methodology?: string | null;
          limitations?: string | null;
          data_type?: StatisticDataType;
          status?: ContentStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "statistics_pillar_id_fkey";
            columns: ["pillar_id"];
            isOneToOne: false;
            referencedRelation: "pillars";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "statistics_reference_id_fkey";
            columns: ["reference_id"];
            isOneToOne: false;
            referencedRelation: "references";
            referencedColumns: ["id"];
          },
        ];
      };
      media_assets: {
        Row: {
          id: string;
          file_name: string;
          storage_bucket: StorageBucketName;
          storage_path: string;
          mime_type: string;
          file_size: number;
          alt_text: string | null;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          file_name: string;
          storage_bucket: StorageBucketName;
          storage_path: string;
          mime_type: string;
          file_size: number;
          alt_text?: string | null;
          uploaded_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          file_name?: string;
          storage_bucket?: StorageBucketName;
          storage_path?: string;
          mime_type?: string;
          file_size?: number;
          alt_text?: string | null;
          uploaded_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "media_assets_uploaded_by_fkey";
            columns: ["uploaded_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      contact_submissions: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          status: ContactSubmissionStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          status?: ContactSubmissionStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          subject?: string;
          message?: string;
          status?: ContactSubmissionStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          id: string;
          setting_key: string;
          setting_value: Json;
          description: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          setting_key: string;
          setting_value?: Json;
          description?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          setting_key?: string;
          setting_value?: Json;
          description?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "site_settings_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
