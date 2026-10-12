import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/PageHeader";
import ProjectForm from "@/components/ProjectForm";
import { updateProject, deleteProject } from "../actions";

export const metadata = { title: "Edit project — Stage Master" };

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const [{ data: project }, { data: tracks }, { data: links }] = await Promise.all([
    supabase.from("projects").select("*").eq("id", params.id).single(),
    supabase.from("tracks").select("id, name").order("index"),
    supabase.from("project_tracks").select("track_id").eq("project_id", params.id),
  ]);

  if (!project) return notFound();

  const updateWithId = updateProject.bind(null, params.id);
  const selectedTrackIds = (links ?? []).map((l) => l.track_id);

  return (
    <>
      <PageHeader eyebrow="Admin" title={project.name} />
      <div className="mx-auto max-w-[760px] px-5 py-10 md:px-14">
        <ProjectForm
          action={updateWithId}
          tracks={tracks ?? []}
          project={project}
          selectedTrackIds={selectedTrackIds}
        />

        <form action={deleteProject} className="mt-10 border-t border-rule pt-6">
          <input type="hidden" name="id" value={project.id} />
          <button type="submit" className="text-[14px] text-red-700 underline underline-offset-4">
            Delete this project
          </button>
        </form>
      </div>
    </>
  );
}
