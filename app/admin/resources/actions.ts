"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Turns "" from an empty optional field into null, so we don't write
// empty strings into columns that should be genuinely empty.
function orNull(value: FormDataEntryValue | null): string | null {
  const str = (value as string | null)?.trim();
  return str ? str : null;
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Uploads to the `resources` Storage bucket (see supabase/schema.sql) and
// returns its public URL, or null if no file was chosen. RLS on
// storage.objects (is_staff()) is the real enforcement here — this function
// doesn't check permissions itself, it relies on the authenticated request.
async function uploadFileIfPresent(
  supabase: ReturnType<typeof createClient>,
  formData: FormData
): Promise<string | null> {
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return null;

  const path = `${crypto.randomUUID()}-${file.name}`;
  const { error } = await supabase.storage
    .from("resources")
    .upload(path, file, { contentType: file.type || undefined });

  if (error) throw new Error(`File upload failed: ${error.message}`);

  const { data } = supabase.storage.from("resources").getPublicUrl(path);
  return data.publicUrl;
}

export async function createResource(formData: FormData) {
  const supabase = createClient();

  const title = (formData.get("title") as string)?.trim();
  if (!title) throw new Error("Title is required.");

  const file_url = await uploadFileIfPresent(supabase, formData);

  const { error } = await supabase.from("resources").insert({
    slug: slugify(title),
    title,
    author: orNull(formData.get("author")),
    institution: orNull(formData.get("institution")),
    track_id: orNull(formData.get("track_id")),
    topic: orNull(formData.get("topic")),
    level: orNull(formData.get("level")),
    format: orNull(formData.get("format")),
    source: orNull(formData.get("source")),
    url: orNull(formData.get("url")),
    file_url,
    license_status: orNull(formData.get("license_status")),
    description: orNull(formData.get("description")),
    stage_master_use: orNull(formData.get("stage_master_use")),
    status: (formData.get("status") as string) || "draft",
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/resources");
  redirect("/admin/resources");
}

export async function updateResource(id: string, formData: FormData) {
  const supabase = createClient();

  const title = (formData.get("title") as string)?.trim();
  if (!title) throw new Error("Title is required.");

  // Only touch file_url if a new file was actually chosen — otherwise leave
  // whatever's already stored alone rather than clearing it.
  const newFileUrl = await uploadFileIfPresent(supabase, formData);

  const { error } = await supabase
    .from("resources")
    .update({
      title,
      author: orNull(formData.get("author")),
      institution: orNull(formData.get("institution")),
      track_id: orNull(formData.get("track_id")),
      topic: orNull(formData.get("topic")),
      level: orNull(formData.get("level")),
      format: orNull(formData.get("format")),
      source: orNull(formData.get("source")),
      url: orNull(formData.get("url")),
      ...(newFileUrl ? { file_url: newFileUrl } : {}),
      license_status: orNull(formData.get("license_status")),
      description: orNull(formData.get("description")),
      stage_master_use: orNull(formData.get("stage_master_use")),
      status: (formData.get("status") as string) || "draft",
      updated_at: new Date().toISOString(),
      reviewed_at:
        formData.get("status") === "approved" || formData.get("status") === "published"
          ? new Date().toISOString()
          : undefined,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/resources");
  redirect("/admin/resources");
}

export async function deleteResource(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = createClient();

  const { data: existing } = await supabase
    .from("resources")
    .select("file_url")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("resources").delete().eq("id", id);
  if (error) throw new Error(error.message);

  if (existing?.file_url) {
    const path = existing.file_url.split("/resources/").pop();
    if (path) await supabase.storage.from("resources").remove([path]);
  }

  revalidatePath("/admin/resources");
  redirect("/admin/resources");
}
