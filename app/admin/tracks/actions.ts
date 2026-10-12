"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function orNull(value: FormDataEntryValue | null): string | null {
  const str = (value as string | null)?.trim();
  return str ? str : null;
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createTrack(formData: FormData) {
  const supabase = createClient();

  const name = (formData.get("name") as string)?.trim();
  if (!name) throw new Error("Name is required.");

  const indexRaw = formData.get("index") as string;
  const index = indexRaw ? parseInt(indexRaw, 10) : null;
  if (index === null || Number.isNaN(index)) throw new Error("Index must be a number.");

  const { error } = await supabase.from("tracks").insert({
    slug: slugify(name),
    index,
    name,
    description: orNull(formData.get("description")) ?? "",
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/tracks");
  revalidatePath("/explore");
  redirect("/admin/tracks");
}

export async function updateTrack(id: string, formData: FormData) {
  const supabase = createClient();

  const name = (formData.get("name") as string)?.trim();
  if (!name) throw new Error("Name is required.");

  const indexRaw = formData.get("index") as string;
  const index = indexRaw ? parseInt(indexRaw, 10) : null;
  if (index === null || Number.isNaN(index)) throw new Error("Index must be a number.");

  const { error } = await supabase
    .from("tracks")
    .update({
      name,
      index,
      description: orNull(formData.get("description")) ?? "",
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/tracks");
  revalidatePath("/explore");
  redirect("/admin/tracks");
}

export async function deleteTrack(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = createClient();

  // Tracks are referenced by resources.track_id (nullable, no cascade), so a
  // track with resources attached can't be deleted outright — better to
  // surface that than silently orphan or cascade-delete someone's content.
  const { count } = await supabase
    .from("resources")
    .select("id", { count: "exact", head: true })
    .eq("track_id", id);

  if (count && count > 0) {
    throw new Error(
      `Can't delete: ${count} resource(s) still reference this track. Reassign or delete them first.`
    );
  }

  const { error } = await supabase.from("tracks").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/tracks");
  revalidatePath("/explore");
  redirect("/admin/tracks");
}
