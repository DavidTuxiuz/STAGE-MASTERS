import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/PageHeader";
import ResourceForm from "@/components/ResourceForm";
import { updateResource, deleteResource } from "../actions";

export const metadata = { title: "Edit resource — Stage Master" };

export default async function EditResourcePage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const [{ data: resource }, { data: tracks }] = await Promise.all([
    supabase.from("resources").select("*").eq("id", params.id).single(),
    supabase.from("tracks").select("id, name").order("index"),
  ]);

  if (!resource) return notFound();

  const updateWithId = updateResource.bind(null, params.id);

  return (
    <>
      <PageHeader eyebrow="Admin" title={resource.title} />
      <div className="mx-auto max-w-[720px] px-5 py-10 md:px-14">
        <ResourceForm action={updateWithId} tracks={tracks ?? []} resource={resource} />

        <form action={deleteResource} className="mt-10 border-t border-rule pt-6">
          <input type="hidden" name="id" value={resource.id} />
          <button type="submit" className="text-[14px] text-red-700 underline underline-offset-4">
            Delete this resource
          </button>
        </form>
      </div>
    </>
  );
}
