// Public-facing read layer for the showcase. Database-only, same honest
// empty-state approach as resources.ts.

import { createClient } from "@/lib/supabase/server";

export type ShowcaseItem = {
  id: string;
  title: string;
  description: string | null;
  media_url: string | null;
  project: { slug: string; name: string } | null;
};

export async function getShowcaseItems(): Promise<ShowcaseItem[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("showcases")
      .select("id, title, description, media_url, project:projects(slug, name)")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data as unknown as ShowcaseItem[];
  } catch {
    return [];
  }
}
