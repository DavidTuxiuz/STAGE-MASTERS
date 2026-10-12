import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/PageHeader";
import ResourceForm from "@/components/ResourceForm";
import { createResource } from "../actions";

export const metadata = { title: "Add resource — Stage Master" };

export default async function NewResourcePage() {
  const supabase = createClient();
  const { data: tracks } = await supabase.from("tracks").select("id, name").order("index");

  return (
    <>
      <PageHeader eyebrow="Admin" title="Add resource" />
      <div className="mx-auto max-w-[720px] px-5 py-10 md:px-14">
        <ResourceForm action={createResource} tracks={tracks ?? []} />
      </div>
    </>
  );
}
