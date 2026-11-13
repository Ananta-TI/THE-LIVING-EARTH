import { z } from "zod";
import { KEBAB_SLUG_REGEX } from "@/lib/utils/slug";

export const topicSchema = z.object({
  id: z.string().uuid("Invalid topic ID.").optional(),
  pillar_id: z.string().uuid("Select a valid environmental pillar."),
  name: z
    .string()
    .trim()
    .min(2, "Topic name must be at least 2 characters.")
    .max(120, "Topic name must be 120 characters or fewer."),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters.")
    .max(120, "Slug must be 120 characters or fewer.")
    .regex(KEBAB_SLUG_REGEX, "Slug must use lowercase letters, numbers, and hyphens only."),
  description: z
    .string()
    .trim()
    .min(1, "Description is required.")
    .max(2000, "Description must be 2000 characters or fewer."),
  display_order: z.coerce
    .number()
    .int("Display order must be a whole number.")
    .min(1, "Display order must be at least 1.")
    .max(9999, "Display order is too large."),
  is_active: z.boolean(),
});

export type TopicFormInput = z.infer<typeof topicSchema>;
