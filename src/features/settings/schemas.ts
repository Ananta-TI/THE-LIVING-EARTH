import { z } from "zod";

const optionalHttpsUrl = z
  .string()
  .trim()
  .max(400, "URL is too long.")
  .refine((val) => !val || /^https?:\/\//i.test(val), {
    message: "URL must start with http:// or https://.",
  });

export const generalSettingsSchema = z.object({
  site_name: z
    .string()
    .trim()
    .min(2, "Site name is required.")
    .max(120, "Site name is too long."),
  tagline: z
    .string()
    .trim()
    .min(2, "Tagline is required.")
    .max(200, "Tagline is too long."),
  description: z
    .string()
    .trim()
    .min(1, "Platform description is required.")
    .max(500, "Description must be 500 characters or fewer."),
  contact_email: z
    .string()
    .trim()
    .email("Enter a valid public contact email.")
    .or(z.literal("")),
});

export const socialSettingsSchema = z.object({
  instagram_url: optionalHttpsUrl,
  youtube_url: optionalHttpsUrl,
  x_url: optionalHttpsUrl,
  linkedin_url: optionalHttpsUrl,
});

export const seoSettingsSchema = z.object({
  default_title: z
    .string()
    .trim()
    .min(2, "Default SEO title is required.")
    .max(160, "Default SEO title must be 160 characters or fewer."),
  default_description: z
    .string()
    .trim()
    .min(1, "Default SEO description is required.")
    .max(320, "Default SEO description must be 320 characters or fewer."),
  og_image_path: z.string().trim().max(500, "OG image path is too long."),
});

export const footerSettingsSchema = z.object({
  mission_statement: z
    .string()
    .trim()
    .min(1, "Footer mission statement is required.")
    .max(500, "Mission statement must be 500 characters or fewer."),
  methodology_note: z
    .string()
    .trim()
    .max(400, "Methodology note must be 400 characters or fewer."),
  copyright_text: z
    .string()
    .trim()
    .min(1, "Copyright text is required.")
    .max(200, "Copyright text is too long."),
});

export const allSiteSettingsSchema = z.object({
  general: generalSettingsSchema,
  social_media: socialSettingsSchema,
  seo_defaults: seoSettingsSchema,
  footer: footerSettingsSchema,
});

export type SiteSettingsBundle = z.infer<typeof allSiteSettingsSchema>;

export const DEFAULT_SITE_SETTINGS: SiteSettingsBundle = {
  general: {
    site_name: "THE LIVING EARTH",
    tagline: "A Journey Through Our Changing Planet",
    description:
      "An environmental knowledge and storytelling platform dedicated to ecological awareness, verified scientific data, and conservation.",
    contact_email: "",
  },
  social_media: {
    instagram_url: "",
    youtube_url: "",
    x_url: "",
    linkedin_url: "",
  },
  seo_defaults: {
    default_title: "THE LIVING EARTH — A Journey Through Our Changing Planet",
    default_description:
      "Explore climate, oceans, forests, biodiversity, human impact, and environmental restoration through verified science and storytelling.",
    og_image_path: "",
  },
  footer: {
    mission_statement:
      "Helping people understand our changing planet through verified scientific information, environmental storytelling, and real-world conservation.",
    methodology_note:
      "All published statistics cite primary scientific journals, international agencies, or official monitoring datasets.",
    copyright_text: "© THE LIVING EARTH",
  },
};
