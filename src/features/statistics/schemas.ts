import { z } from "zod";

export const STATISTIC_DATA_TYPES = [
  { value: "historical_observation", label: "Historical Observation" },
  { value: "current_estimate", label: "Current Estimate" },
  { value: "projection", label: "Projection" },
] as const;

export const statisticSchema = z.object({
  id: z.string().uuid("Invalid statistic ID.").optional(),
  pillar_id: z.string().uuid("Select an environmental pillar."),
  reference_id: z
    .string()
    .uuid("A verified scientific reference is mandatory for every statistic."),
  indicator: z
    .string()
    .trim()
    .min(3, "Indicator name must be at least 3 characters.")
    .max(240, "Indicator name must be 240 characters or fewer."),
  value: z.coerce
    .number()
    .refine((val) => Number.isFinite(val), {
      message: "Value must be a valid finite number.",
    }),
  unit: z
    .string()
    .trim()
    .min(1, "Unit of measurement is required.")
    .max(80, "Unit must be 80 characters or fewer."),
  geographic_scope: z
    .string()
    .trim()
    .min(2, "Geographic scope is required.")
    .max(160, "Geographic scope must be 160 characters or fewer."),
  measurement_year: z.coerce
    .number()
    .int("Measurement year must be a whole integer.")
    .min(1800, "Measurement year must be 1800 or later.")
    .max(2150, "Measurement year must be 2150 or earlier."),
  publication_date: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v && v.length > 0 ? v : null))
    .refine((v) => v === null || /^\d{4}-\d{2}-\d{2}$/.test(v), {
      message: "Publication date must use YYYY-MM-DD format.",
    }),
  methodology: z
    .string()
    .trim()
    .max(2000, "Methodology must be 2000 characters or fewer.")
    .optional()
    .transform((v) => (v && v.length > 0 ? v : null)),
  limitations: z
    .string()
    .trim()
    .max(2000, "Limitations must be 2000 characters or fewer.")
    .optional()
    .transform((v) => (v && v.length > 0 ? v : null)),
  data_type: z.enum(["historical_observation", "current_estimate", "projection"]),
  status: z.enum(["draft", "published", "archived"]),
});

export type StatisticFormInput = z.input<typeof statisticSchema>;
