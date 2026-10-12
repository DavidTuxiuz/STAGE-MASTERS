import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import { getTrackBySlug } from "@/lib/content/tracks";

export const dynamic = "force-dynamic";

export default async function LearnTrackPage({ params }: { params: { track: string } }) {
  const track = await getTrackBySlug(params.track);
  if (!track) return notFound();

  return (
    <main>
      <PageHeader eyebrow="Learn" title={track.name} lede="Modules and lessons for this track." />
      <div className="mx-auto max-w-[1120px] px-5 py-14 text-slate md:px-14">
        <p>No modules published yet. This is where lessons for {track.name} will appear once added in the admin.</p>
      </div>
    </main>
  );
}
