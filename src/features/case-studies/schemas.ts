import { z } from "zod";
import { KEBAB_SLUG_REGEX } from "@/lib/utils/slug";

const optionalNumberField = (min: number, max: number, label: string) =>
  z
    .string()
    .trim()
    .optional()
    .transform((val) => {
      if (!val) return null;
      const num = Number(val);
      return Number.isFinite(num) ? num : Number.NaN;
    })
    .refine((val) => val === null || (!Number.isNaN(val) && val >= min && val <= max), {
      message: `${label} must be a valid number between ${min} and ${max}.`,
    });

export const caseStudySchema = z
  .object({
    id: z.string().uuid("Invalid case study ID.").optional(),
    pillar_id: z.string().uuid("Select an environmental pillar."),
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters.")
      .max(200, "Title must be 200 characters or fewer."),
    slug: z
      .string()
      .trim()
      .min(2, "Slug must be at least 2 characters.")
      .max(200, "Slug must be 200 characters or fewer.")
      .regex(KEBAB_SLUG_REGEX, "Slug must use lowercase letters, numbers, and hyphens only."),
    summary: z
      .string()
      .trim()
      .min(1, "Summary is required.")
      .max(800, "Summary must be 800 characters or fewer."),
    content: z.string().trim().min(1, "Case study content cannot be empty."),
    country: z
      .string()
      .trim()
      .min(2, "Country is required.")
      .max(120, "Country must be 120 characters or fewer."),
    region: z
      .string()
      .trim()
      .max(160, "Region must be 160 characters or fewer.")
      .optional()
      .transform((v) => (v && v.length > 0 ? v : null)),
    latitude: optionalNumberField(-90, 90, "Latitude"),
    longitude: optionalNumberField(-180, 180, "Longitude"),
    cover_image_path: z
      .string()
      .trim()
      .max(500, "Image path is too long.")
      .optional()
      .transform((v) => (v && v.length > 0 ? v : null)),
    organization: z
      .string()
      .trim()
      .max(200, "Organization must be 200 characters or fewer.")
      .optional()
      .transform((v) => (v && v.length > 0 ? v : null)),
    start_date: z
      .string()
      .trim()
      .optional()
      .transform((v) => (v && v.length > 0 ? v : null))
      .refine((v) => v === null || /^\d{4}-\d{2}-\d{2}$/.test(v), {
        message: "Start date must use YYYY-MM-DD format.",
      }),
    end_date: z
      .string()
      .trim()
      .optional()
      .transform((v) => (v && v.length > 0 ? v : null))
      .refine((v) => v === null || /^\d{4}-\d{2}-\d{2}$/.test(v), {
        message: "End date must use YYYY-MM-DD format.",
      }),
    status: z.enum(["draft", "published", "archived"]),
    published_at: z
      .string()
      .trim()
      .optional()
      .transform((v) => (v && v.length > 0 ? v : null)),
    reference_ids: z.array(z.string().uuid()).default([]),
  })
  .superRefine((data, ctx) => {
    const hasLat = data.latitude !== null;
    const hasLng = data.longitude !== null;
    if (hasLat !== hasLng) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Latitude and longitude must either both be provided or both be left blank.",
        path: ["latitude"],
      });
    }
    if (data.start_date && data.end_date && data.end_date < data.start_date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date cannot be earlier than start date.",
        path: ["end_date"],
      });
    }
  });

export type CaseStudyFormInput = z.input<typeof caseStudySchema>;
