import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/PageHeader";
import PracticeForm from "@/components/PracticeForm";
import { createPractice } from "../actions";

export const metadata = { title: "Add practice — Stage Master" };

export default async function NewPracticePage() {
  const supabase = createClient();
  const { data: resources } = await supabase.from("resources").select("id, title").order("title");

  return (
    <>
      <PageHeader eyebrow="Admin" title="Add practice" />
      <div className="mx-auto max-w-[720px] px-5 py-10 md:px-14">
        <PracticeForm action={createPractice} resources={resources ?? []} />
      </div>
    </>
  );
}
