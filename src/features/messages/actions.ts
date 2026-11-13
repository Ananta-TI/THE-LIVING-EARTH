"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { verifyAdminAction } from "@/features/auth/dal";
import { errorResult, successResult, type ActionResult } from "@/lib/utils/action-result";

const statusSchema = z.object({
  id: z.string().uuid("Invalid message ID."),
  status: z.enum(["unread", "read", "replied", "archived"]),
});

export async function updateMessageStatusAction(input: {
  id: string;
  status: "unread" | "read" | "replied" | "archived";
}): Promise<ActionResult> {
  const auth = await verifyAdminAction();
  if (!auth.ok) {
    return errorResult(auth.error);
  }

  const parsed = statusSchema.safeParse(input);
  if (!parsed.success) {
    return errorResult("Invalid message status update.");
  }

  const { error } = await auth.supabase
    .from("contact_submissions")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id);

  if (error) {
    return errorResult(`Failed to update status: ${error.message}`);
  }

  revalidatePath("/admin/messages");
  revalidatePath(`/admin/messages/${parsed.data.id}`);
  revalidatePath("/admin");
  return successResult(`Message marked as ${parsed.data.status}.`);
}
