import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/PageHeader";
import ShowcaseForm from "@/components/ShowcaseForm";
import { createShowcase } from "../actions";

export const metadata = { title: "Add showcase item — Stage Master" };

export default async function NewShowcasePage() {
  const supabase = createClient();
  const { data: projects } = await supabase.from("projects").select("id, name").order("name");

  return (
    <>
      <PageHeader eyebrow="Admin" title="Add showcase item" />
      <div className="mx-auto max-w-[640px] px-5 py-10 md:px-14">
        <ShowcaseForm action={createShowcase} projects={projects ?? []} />
      </div>
    </>
  );
}
