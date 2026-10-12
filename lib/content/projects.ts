// Public-facing read layer for projects. Only shows status = 'published'
// rows from the real `projects` table, with their participating tracks via
// the project_tracks junction. Falls back to one hardcoded sample project
// (the brief's "Campus Talk Show" example) only when nothing is published
// yet, so the page is never empty before real content exists.

import { createClient } from "@/lib/supabase/server";

export type Project = {
  slug: string;
  name: string;
  purpose?: string | null;
  brief?: string | null;
  objective?: string | null;
  audience?: string | null;
  output?: string | null;
  workflow?: string | null;
  quality_criteria?: string | null;
  tracks?: string[];
};

const sampleProject: Project = {
  slug: "campus-talk-show",
  name: "Campus Talk Show",
  purpose:
    "Needs a host, researcher, camera crew, photographer, editor, designer, content lead, technical crew and performers — one production, every specialization.",
  tracks: [
    "Presentation & Performance",
    "Visual Media",
    "Video & Post-Production",
    "Journalism & Campus Media",
    "Digital Content & Social Media",
    "Event & Technical Production",
    "Performing Arts",
  ],
};

export async function getProjects(): Promise<Project[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("slug, name, purpose, project_tracks(tracks(name))")
      .eq("status", "published")
      .order("name");

    if (error || !data || data.length === 0) return [sampleProject];

    return data.map((p: any) => ({
      slug: p.slug,
      name: p.name,
      purpose: p.purpose,
      tracks: (p.project_tracks ?? []).map((pt: any) => pt.tracks?.name).filter(Boolean),
    }));
  } catch {
    return [sampleProject];
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  if (slug === sampleProject.slug) {
    // Always let the sample resolve even if real published projects exist,
    // so its own detail page never 404s once real content is added.
    const projects = await getProjects();
    return projects.find((p) => p.slug === slug) ?? sampleProject;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("projects")
      .select(
        "slug, name, purpose, brief, objective, audience, output, workflow, quality_criteria, project_tracks(tracks(name))"
      )
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (error || !data) return undefined;

    return {
      slug: data.slug,
      name: data.name,
      purpose: data.purpose,
      brief: data.brief,
      objective: data.objective,
      audience: data.audience,
      output: data.output,
      workflow: data.workflow,
      quality_criteria: data.quality_criteria,
      tracks: (data.project_tracks ?? []).map((pt: any) => pt.tracks?.name).filter(Boolean),
    };
  } catch {
    return undefined;
  }
}
