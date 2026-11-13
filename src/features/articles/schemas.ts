import { z } from "zod";
import { KEBAB_SLUG_REGEX } from "@/lib/utils/slug";

export const articleSchema = z.object({
  id: z.string().uuid("Invalid article ID.").optional(),
  pillar_id: z.string().uuid("Select an environmental pillar."),
  topic_id: z
    .string()
    .optional()
    .transform((v) => (v && v.length > 0 && v !== "none" ? v : null))
    .refine((v) => v === null || z.string().uuid().safeParse(v).success, {
      message: "Invalid topic selection.",
    }),
  title: z
    .string()
    .trim()
    .min(3, "Article title must be at least 3 characters.")
    .max(200, "Article title must be 200 characters or fewer."),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters.")
    .max(200, "Slug must be 200 characters or fewer.")
    .regex(KEBAB_SLUG_REGEX, "Slug must use lowercase letters, numbers, and hyphens only."),
  excerpt: z
    .string()
    .trim()
    .min(1, "Excerpt is required.")
    .max(600, "Excerpt must be 600 characters or fewer."),
  content: z
    .string()
    .trim()
    .min(1, "Article content cannot be empty."),
  cover_image_path: z
    .string()
    .trim()
    .max(500, "Cover image path is too long.")
    .optional()
    .transform((v) => (v && v.length > 0 ? v : null)),
  status: z.enum(["draft", "published", "archived"]),
  featured: z.boolean(),
  seo_title: z
    .string()
    .trim()
    .max(160, "SEO title must be 160 characters or fewer.")
    .optional()
    .transform((v) => (v && v.length > 0 ? v : null)),
  seo_description: z
    .string()
    .trim()
    .max(320, "SEO description must be 320 characters or fewer.")
    .optional()
    .transform((v) => (v && v.length > 0 ? v : null)),
  published_at: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v && v.length > 0 ? v : null)),
  reference_ids: z.array(z.string().uuid()).default([]),
});

export type ArticleFormInput = z.infer<typeof articleSchema>;
