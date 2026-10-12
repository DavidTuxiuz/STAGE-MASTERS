import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/PageHeader";
import ProjectForm from "@/components/ProjectForm";
import { createProject } from "../actions";

export const metadata = { title: "Add project — Stage Master" };

export default async function NewProjectPage() {
  const supabase = createClient();
  const { data: tracks } = await supabase.from("tracks").select("id, name").order("index");

  return (
    <>
      <PageHeader eyebrow="Admin" title="Add project" />
      <div className="mx-auto max-w-[760px] px-5 py-10 md:px-14">
        <ProjectForm action={createProject} tracks={tracks ?? []} />
      </div>
    </>
  );
}
