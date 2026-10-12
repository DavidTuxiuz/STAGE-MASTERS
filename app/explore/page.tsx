import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import TrackList from "@/components/TrackList";
import { getTracks } from "@/lib/content/tracks";

export const metadata = { title: "Explore — Stage Master" };
export const dynamic = "force-dynamic";

export default async function ExplorePage() {
  const tracks = await getTracks();

  return (
    <main>
      <PageHeader
        eyebrow="Explore"
        title="Find out what you're drawn to"
        lede="Eight tracks, interconnected rather than isolated. Open one to see what it covers, then follow it through to learn and practise."
      />
      <div className="mx-auto max-w-[1120px] px-5 py-14 md:px-14">
        <TrackList tracks={tracks} />
        <p className="mt-8 text-[14.5px] text-slate">
          Not sure yet? That&rsquo;s what Discover is for — try a{" "}
          <Link href="/practice" className="underline underline-offset-4">
            practice challenge
          </Link>{" "}
          in a couple of tracks before committing.
        </p>
      </div>
    </main>
  );
}
