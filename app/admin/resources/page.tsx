import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/PageHeader";

export const metadata = { title: "Admin — Resources — Stage Master" };
export const dynamic = "force-dynamic";

export default async function AdminResourcesPage() {
  const supabase = createClient();
  const { data: resources, error } = await supabase
    .from("resources")
    .select("id, title, status, track_id, file_url, updated_at, tracks(name)")
    .order("updated_at", { ascending: false });

  return (
    <>
      <PageHeader eyebrow="Admin" title="Resources" lede="Every resource in the catalog, regardless of status." />
      <div className="mx-auto max-w-[1120px] px-5 py-8 md:px-14">
        <Link
          href="/admin/resources/new"
          className="inline-block bg-ink px-5 py-3 text-[14.5px] font-medium text-paper hover:opacity-80"
        >
          Add resource
        </Link>

        {error && (
          <p className="mt-8 text-[14.5px] text-red-700">
            Couldn&rsquo;t load resources: {error.message}. Have you run supabase/schema.sql
            and added your project&rsquo;s credentials to .env.local?
          </p>
        )}

        {!error && resources?.length === 0 && (
          <p className="mt-8 text-slate">No resources yet — add the first one.</p>
        )}

        {!error && resources && resources.length > 0 && (
          <div className="mt-8 border-t border-rule">
            {resources.map((r: any) => (
              <Link
                key={r.id}
                href={`/admin/resources/${r.id}`}
                className="flex items-center justify-between border-b border-rule py-4 hover:text-brass"
              >
                <div>
                  <p className="font-serif text-[17px]">{r.title}</p>
                  <p className="text-[13px] text-slate">
                    {r.tracks?.name ?? "No track"}
                    {r.file_url ? " · has file" : ""}
                  </p>
                </div>
                <span className="text-[12.5px] uppercase tracking-wide text-slate">{r.status}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
