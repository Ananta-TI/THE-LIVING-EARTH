import { z } from "zod";

export const REFERENCE_SOURCE_TYPES = [
  { value: "scientific_journal", label: "Scientific Journal" },
  { value: "research_report", label: "Research Report" },
  { value: "government_data", label: "Government Data" },
  { value: "international_organization", label: "International Organization" },
  { value: "institutional_report", label: "Institutional Report" },
  { value: "other", label: "Other Authoritative Source" },
] as const;

export const referenceSchema = z.object({
  id: z.string().uuid("Invalid reference ID.").optional(),
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters.")
    .max(300, "Title must be 300 characters or fewer."),
  organization: z
    .string()
    .trim()
    .min(2, "Organization or publisher is required.")
    .max(200, "Organization must be 200 characters or fewer."),
  source_type: z.enum([
    "scientific_journal",
    "research_report",
    "government_data",
    "international_organization",
    "institutional_report",
    "other",
  ]),
  author: z
    .string()
    .trim()
    .max(200, "Author must be 200 characters or fewer.")
    .optional()
    .transform((v) => (v && v.length > 0 ? v : null)),
  publication_date: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v && v.length > 0 ? v : null))
    .refine((v) => v === null || /^\d{4}-\d{2}-\d{2}$/.test(v), {
      message: "Publication date must use YYYY-MM-DD format.",
    }),
  source_url: z
    .string()
    .trim()
    .url("Enter a valid source URL starting with http:// or https://.")
    .refine((val) => /^https?:\/\//i.test(val), {
      message: "Source URL must start with http:// or https://.",
    }),
  accessed_at: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v && v.length > 0 ? v : null)),
  notes: z
    .string()
    .trim()
    .max(2000, "Notes must be 2000 characters or fewer.")
    .optional()
    .transform((v) => (v && v.length > 0 ? v : null)),
});

export type ReferenceFormInput = z.infer<typeof referenceSchema>;
