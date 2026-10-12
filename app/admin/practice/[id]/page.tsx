import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/PageHeader";
import PracticeForm from "@/components/PracticeForm";
import { updatePractice, deletePractice } from "../actions";

export const metadata = { title: "Edit practice — Stage Master" };

export default async function EditPracticePage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const [{ data: practice }, { data: resources }] = await Promise.all([
    supabase.from("practices").select("*").eq("id", params.id).single(),
    supabase.from("resources").select("id, title").order("title"),
  ]);

  if (!practice) return notFound();

  const updateWithId = updatePractice.bind(null, params.id);

  return (
    <>
      <PageHeader eyebrow="Admin" title={practice.name} />
      <div className="mx-auto max-w-[720px] px-5 py-10 md:px-14">
        <PracticeForm action={updateWithId} resources={resources ?? []} practice={practice} />

        <form action={deletePractice} className="mt-10 border-t border-rule pt-6">
          <input type="hidden" name="id" value={practice.id} />
          <button type="submit" className="text-[14px] text-red-700 underline underline-offset-4">
            Delete this practice
          </button>
        </form>
      </div>
    </>
  );
}
