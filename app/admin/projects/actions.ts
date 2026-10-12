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

// Checkbox groups show up in FormData as repeated entries under one name.
function getTrackIds(formData: FormData): string[] {
  return formData.getAll("track_ids").map(String).filter(Boolean);
}

async function syncProjectTracks(
  supabase: ReturnType<typeof createClient>,
  projectId: string,
  trackIds: string[]
) {
  // Simplest correct approach: clear and reinsert. project_tracks is a thin
  // junction table with no extra columns, so there's nothing to preserve by
  // diffing instead.
  await supabase.from("project_tracks").delete().eq("project_id", projectId);
  if (trackIds.length > 0) {
    await supabase
      .from("project_tracks")
      .insert(trackIds.map((track_id) => ({ project_id: projectId, track_id })));
  }
}

export async function createProject(formData: FormData) {
  const supabase = createClient();

  const name = (formData.get("name") as string)?.trim();
  if (!name) throw new Error("Name is required.");

  const { data, error } = await supabase
    .from("projects")
    .insert({
      slug: slugify(name),
      name,
      purpose: orNull(formData.get("purpose")),
      brief: orNull(formData.get("brief")),
      objective: orNull(formData.get("objective")),
      audience: orNull(formData.get("audience")),
      output: orNull(formData.get("output")),
      workflow: orNull(formData.get("workflow")),
      quality_criteria: orNull(formData.get("quality_criteria")),
      status: (formData.get("status") as string) || "draft",
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  await syncProjectTracks(supabase, data.id, getTrackIds(formData));

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  redirect("/admin/projects");
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = createClient();

  const name = (formData.get("name") as string)?.trim();
  if (!name) throw new Error("Name is required.");

  const { error } = await supabase
    .from("projects")
    .update({
      name,
      purpose: orNull(formData.get("purpose")),
      brief: orNull(formData.get("brief")),
      objective: orNull(formData.get("objective")),
      audience: orNull(formData.get("audience")),
      output: orNull(formData.get("output")),
      workflow: orNull(formData.get("workflow")),
      quality_criteria: orNull(formData.get("quality_criteria")),
      status: (formData.get("status") as string) || "draft",
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  await syncProjectTracks(supabase, id, getTrackIds(formData));

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  redirect("/admin/projects");
}

export async function deleteProject(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = createClient();

  // project_tracks cascades on delete, but showcases.project_id does not —
  // check for those before deleting, same guard pattern as Tracks.
  const { count } = await supabase
    .from("showcases")
    .select("id", { count: "exact", head: true })
    .eq("project_id", id);

  if (count && count > 0) {
    throw new Error(`Can't delete: ${count} showcase item(s) still reference this project.`);
  }

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  redirect("/admin/projects");
}
