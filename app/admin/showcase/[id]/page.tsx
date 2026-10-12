import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/PageHeader";
import ShowcaseForm from "@/components/ShowcaseForm";
import { updateShowcase, deleteShowcase } from "../actions";

export const metadata = { title: "Edit showcase item — Stage Master" };

export default async function EditShowcasePage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const [{ data: showcase }, { data: projects }] = await Promise.all([
    supabase.from("showcases").select("*").eq("id", params.id).single(),
    supabase.from("projects").select("id, name").order("name"),
  ]);

  if (!showcase) return notFound();

  const updateWithId = updateShowcase.bind(null, params.id);

  return (
    <>
      <PageHeader eyebrow="Admin" title={showcase.title} />
      <div className="mx-auto max-w-[640px] px-5 py-10 md:px-14">
        <ShowcaseForm action={updateWithId} projects={projects ?? []} showcase={showcase} />

        <form action={deleteShowcase} className="mt-10 border-t border-rule pt-6">
          <input type="hidden" name="id" value={showcase.id} />
          <button type="submit" className="text-[14px] text-red-700 underline underline-offset-4">
            Delete this showcase item
          </button>
        </form>
      </div>
    </>
  );
}
