// Public-facing read layer for resources. Resources are database-only
// content — there's no meaningful local placeholder for them (unlike
// tracks), so this returns an empty array rather than fake data when
// Supabase isn't connected or nothing is published yet. See app/resources
// for how that empty state reads to a visitor.

import { createClient } from "@/lib/supabase/server";

export type Resource = {
  slug: string;
  title: string;
  author: string | null;
  institution: string | null;
  topic: string | null;
  level: string | null;
  format: string | null;
  source: string | null;
  url: string | null;
  file_url: string | null;
  license_status: string | null;
  description: string | null;
  stage_master_use: string | null;
  track: { slug: string; name: string } | null;
};

export async function getResources(): Promise<Resource[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("resources")
      .select(
        "slug, title, author, institution, topic, level, format, source, url, file_url, license_status, description, stage_master_use, track:tracks(slug, name)"
      )
      .eq("status", "published")
      .order("updated_at", { ascending: false });

    if (error || !data) return [];
    return data as unknown as Resource[];
  } catch {
    return [];
  }
}

export async function getResourceBySlug(slug: string): Promise<Resource | undefined> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("resources")
      .select(
        "slug, title, author, institution, topic, level, format, source, url, file_url, license_status, description, stage_master_use, track:tracks(slug, name)"
      )
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (error || !data) return undefined;
    return data as unknown as Resource;
  } catch {
    return undefined;
  }
}
