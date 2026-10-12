import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/PageHeader";

export const metadata = { title: "Admin — Tracks — Stage Master" };
export const dynamic = "force-dynamic";

export default async function AdminTracksPage() {
  const supabase = createClient();
  const { data: tracks, error } = await supabase
    .from("tracks")
    .select("id, index, name")
    .order("index");

  return (
    <>
      <PageHeader eyebrow="Admin" title="Tracks" lede="The 8 specializations. Edit copy here or add a new one." />
      <div className="mx-auto max-w-[1120px] px-5 py-8 md:px-14">
        <Link
          href="/admin/tracks/new"
          className="inline-block bg-ink px-5 py-3 text-[14.5px] font-medium text-paper hover:opacity-80"
        >
          Add track
        </Link>

        {error && (
          <p className="mt-8 text-[14.5px] text-red-700">
            Couldn&rsquo;t load tracks: {error.message}. Have you run supabase/schema.sql
            and supabase/seed.sql, and added your project&rsquo;s credentials to .env.local?
          </p>
        )}

        {!error && tracks?.length === 0 && (
          <p className="mt-8 text-slate">No tracks yet — run supabase/seed.sql, or add one manually.</p>
        )}

        {!error && tracks && tracks.length > 0 && (
          <div className="mt-8 border-t border-rule">
            {tracks.map((t) => (
              <Link
                key={t.id}
                href={`/admin/tracks/${t.id}`}
                className="flex items-center gap-5 border-b border-rule py-4 hover:text-brass"
              >
                <span className="font-serif italic text-brass">{String(t.index).padStart(2, "0")}</span>
                <span className="font-serif text-[17px]">{t.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
