"use server";

import { revalidatePath } from "next/cache";
import { verifyAdminAction } from "@/features/auth/dal";
import { updatePillarSchema, type UpdatePillarInput } from "@/features/pillars/schemas";
import { errorResult, successResult, type ActionResult } from "@/lib/utils/action-result";

export async function updatePillarAction(
  input: UpdatePillarInput,
): Promise<ActionResult> {
  const auth = await verifyAdminAction();
  if (!auth.ok) {
    return errorResult(auth.error);
  }

  const parsed = updatePillarSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] = issue.message;
    }
    return errorResult(parsed.error.issues[0]?.message ?? "Invalid pillar values.", fieldErrors);
  }

  const { id, name, description, cover_image_path, display_order, is_active } = parsed.data;

  const { data: orderConflict } = await auth.supabase
    .from("pillars")
    .select("id, name")
    .eq("display_order", display_order)
    .neq("id", id)
    .maybeSingle();

  if (orderConflict) {
    return errorResult(
      `Display order ${display_order} is already assigned to "${orderConflict.name}". Choose a unique order.`,
      { display_order: "Display order must be unique across pillars." },
    );
  }

  const { error } = await auth.supabase
    .from("pillars")
    .update({
      name,
      description,
      cover_image_path,
      display_order,
      is_active,
    })
    .eq("id", id);

  if (error) {
    return errorResult(`Failed to update pillar: ${error.message}`);
  }

  revalidatePath("/admin/pillars");
  revalidatePath("/admin");
  return successResult("Environmental pillar updated.");
}

export async function togglePillarActiveAction(
  id: string,
  isActive: boolean,
): Promise<ActionResult> {
  const auth = await verifyAdminAction();
  if (!auth.ok) {
    return errorResult(auth.error);
  }

  const { error } = await auth.supabase
    .from("pillars")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) {
    return errorResult(`Failed to update pillar status: ${error.message}`);
  }

  revalidatePath("/admin/pillars");
  revalidatePath("/admin");
  return successResult(`Pillar marked as ${isActive ? "active" : "inactive"}.`);
}
