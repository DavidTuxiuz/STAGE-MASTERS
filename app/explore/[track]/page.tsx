import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Button from "@/components/Button";
import { getTrackBySlug } from "@/lib/content/tracks";

export const dynamic = "force-dynamic";

export default async function TrackPage({ params }: { params: { track: string } }) {
  const track = await getTrackBySlug(params.track);
  if (!track) return notFound();

  return (
    <main>
      <PageHeader
        eyebrow={`Track ${String(track.index).padStart(2, "0")}`}
        title={track.name}
        lede={track.description}
      />
      <div className="mx-auto max-w-[1120px] space-y-3 px-5 py-14 text-slate md:px-14">
        {/* Phase 2/6: who it's for, learning path, practice, projects,
            resources, competencies and productions get populated here once
            the corresponding Supabase tables have content. */}
        <p>Learning path, practice and related projects for this track are coming as content is added.</p>
        <Button href="/practice">Try a related practice</Button>
      </div>
    </main>
  );
}
