// Public-facing read layer for practices. Same fallback pattern as tracks.ts
// — the live `practices` table has many more fields than the local seed
// (instructions, output requirements, quality criteria, a related resource),
// so the public type is the richer shape; local fallback rows simply leave
// those fields undefined, and the detail page already handles that.

import { createClient } from "@/lib/supabase/server";
import { practices as fallbackPractices } from "@/lib/data/practices";

export type Practice = {
  slug: string;
  name: string;
  skill?: string | null;
  level?: string | null;
  duration_minutes?: number | null;
  instructions?: string | null;
  output_requirements?: string | null;
  quality_criteria?: string | null;
  related_resource?: { slug: string; title: string } | null;
};

export async function getPractices(): Promise<Practice[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("practices")
      .select(
        "slug, name, skill, level, duration_minutes, instructions, output_requirements, quality_criteria, related_resource:resources(slug, title)"
      )
      .order("name");

    if (error || !data || data.length === 0) return fallbackPractices;
    return data as unknown as Practice[];
  } catch {
    return fallbackPractices;
  }
}

export async function getPracticeBySlug(slug: string): Promise<Practice | undefined> {
  const practices = await getPractices();
  return practices.find((p) => p.slug === slug);
}
