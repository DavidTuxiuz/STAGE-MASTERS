// Public-facing read layer for tracks. Tries the live `tracks` table first;
// falls back to the local lib/data/tracks.ts seed if Supabase isn't
// configured yet, the query fails, or the table is empty. This is what lets
// admin edits in /admin/tracks show up on /explore and the homepage without
// the site breaking for anyone who hasn't connected Supabase yet.

import { createClient } from "@/lib/supabase/server";
import { tracks as fallbackTracks, type Track } from "@/lib/data/tracks";

export type { Track };

export async function getTracks(): Promise<Track[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("tracks")
      .select("slug, index, name, description")
      .order("index");

    if (error || !data || data.length === 0) return fallbackTracks;
    return data;
  } catch {
    // Supabase env vars missing, or any other setup problem — fall back
    // rather than taking the page down.
    return fallbackTracks;
  }
}

export async function getTrackBySlug(slug: string): Promise<Track | undefined> {
  const tracks = await getTracks();
  return tracks.find((t) => t.slug === slug);
}
