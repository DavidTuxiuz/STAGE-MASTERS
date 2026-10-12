import PageHeader from "@/components/PageHeader";
import TrackForm from "@/components/TrackForm";
import { createTrack } from "../actions";

export const metadata = { title: "Add track — Stage Master" };

export default function NewTrackPage() {
  return (
    <>
      <PageHeader eyebrow="Admin" title="Add track" />
      <div className="mx-auto max-w-[640px] px-5 py-10 md:px-14">
        <TrackForm action={createTrack} />
      </div>
    </>
  );
}
