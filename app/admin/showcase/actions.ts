"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function orNull(value: FormDataEntryValue | null): string | null {
  const str = (value as string | null)?.trim();
  return str ? str : null;
}

export async function createShowcase(formData: FormData) {
  const supabase = createClient();

  const title = (formData.get("title") as string)?.trim();
  if (!title) throw new Error("Title is required.");

  const { error } = await supabase.from("showcases").insert({
    title,
    project_id: orNull(formData.get("project_id")),
    description: orNull(formData.get("description")),
    media_url: orNull(formData.get("media_url")),
    status: (formData.get("status") as string) || "draft",
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/showcase");
  revalidatePath("/showcase");
  redirect("/admin/showcase");
}

export async function updateShowcase(id: string, formData: FormData) {
  const supabase = createClient();

  const title = (formData.get("title") as string)?.trim();
  if (!title) throw new Error("Title is required.");

  const { error } = await supabase
    .from("showcases")
    .update({
      title,
      project_id: orNull(formData.get("project_id")),
      description: orNull(formData.get("description")),
      media_url: orNull(formData.get("media_url")),
      status: (formData.get("status") as string) || "draft",
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/showcase");
  revalidatePath("/showcase");
  redirect("/admin/showcase");
}

export async function deleteShowcase(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = createClient();

  const { error } = await supabase.from("showcases").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/showcase");
  revalidatePath("/showcase");
  redirect("/admin/showcase");
}
