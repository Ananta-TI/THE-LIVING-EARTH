import { z } from "zod";

export const updatePillarSchema = z.object({
  id: z.string().uuid("Invalid pillar identifier."),
  name: z
    .string()
    .trim()
    .min(2, "Pillar name must be at least 2 characters.")
    .max(120, "Pillar name must be 120 characters or fewer."),
  description: z
    .string()
    .trim()
    .min(1, "Description is required.")
    .max(2000, "Description must be 2000 characters or fewer."),
  cover_image_path: z
    .string()
    .trim()
    .max(500, "Image path is too long.")
    .optional()
    .transform((v) => (v && v.length > 0 ? v : null)),
  display_order: z.coerce
    .number()
    .int("Display order must be a whole number.")
    .min(1, "Display order must be at least 1.")
    .max(100, "Display order must be 100 or less."),
  is_active: z.boolean(),
});

export type UpdatePillarInput = z.infer<typeof updatePillarSchema>;
