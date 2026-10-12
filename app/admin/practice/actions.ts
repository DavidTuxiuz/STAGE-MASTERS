"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function orNull(value: FormDataEntryValue | null): string | null {
  const str = (value as string | null)?.trim();
  return str ? str : null;
}

function intOrNull(value: FormDataEntryValue | null): number | null {
  const str = (value as string | null)?.trim();
  if (!str) return null;
  const n = parseInt(str, 10);
  return Number.isNaN(n) ? null : n;
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createPractice(formData: FormData) {
  const supabase = createClient();

  const name = (formData.get("name") as string)?.trim();
  if (!name) throw new Error("Name is required.");

  const { error } = await supabase.from("practices").insert({
    slug: slugify(name),
    name,
    skill: orNull(formData.get("skill")),
    level: orNull(formData.get("level")),
    duration_minutes: intOrNull(formData.get("duration_minutes")),
    instructions: orNull(formData.get("instructions")),
    output_requirements: orNull(formData.get("output_requirements")),
    quality_criteria: orNull(formData.get("quality_criteria")),
    related_resource_id: orNull(formData.get("related_resource_id")),
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/practice");
  revalidatePath("/practice");
  redirect("/admin/practice");
}

export async function updatePractice(id: string, formData: FormData) {
  const supabase = createClient();

  const name = (formData.get("name") as string)?.trim();
  if (!name) throw new Error("Name is required.");

  const { error } = await supabase
    .from("practices")
    .update({
      name,
      skill: orNull(formData.get("skill")),
      level: orNull(formData.get("level")),
      duration_minutes: intOrNull(formData.get("duration_minutes")),
      instructions: orNull(formData.get("instructions")),
      output_requirements: orNull(formData.get("output_requirements")),
      quality_criteria: orNull(formData.get("quality_criteria")),
      related_resource_id: orNull(formData.get("related_resource_id")),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/practice");
  revalidatePath("/practice");
  redirect("/admin/practice");
}

export async function deletePractice(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = createClient();

  const { count } = await supabase
    .from("contributions")
    .select("id", { count: "exact", head: true })
    .eq("practice_id", id);

  if (count && count > 0) {
    throw new Error(
      `Can't delete: ${count} contribution(s) still reference this practice.`
    );
  }

  const { error } = await supabase.from("practices").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/practice");
  revalidatePath("/practice");
  redirect("/admin/practice");
}
