import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/PageHeader";
import TrackForm from "@/components/TrackForm";
import { updateTrack, deleteTrack } from "../actions";

export const metadata = { title: "Edit track — Stage Master" };

export default async function EditTrackPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: track } = await supabase.from("tracks").select("*").eq("id", params.id).single();

  if (!track) return notFound();

  const updateWithId = updateTrack.bind(null, params.id);

  return (
    <>
      <PageHeader eyebrow="Admin" title={track.name} />
      <div className="mx-auto max-w-[640px] px-5 py-10 md:px-14">
        <TrackForm action={updateWithId} track={track} />

        <form action={deleteTrack} className="mt-10 border-t border-rule pt-6">
          <input type="hidden" name="id" value={track.id} />
          <button type="submit" className="text-[14px] text-red-700 underline underline-offset-4">
            Delete this track
          </button>
        </form>
      </div>
    </>
  );
}
