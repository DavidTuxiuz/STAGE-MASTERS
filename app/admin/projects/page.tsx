import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/PageHeader";

export const metadata = { title: "Admin — Projects — Stage Master" };
export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const supabase = createClient();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, name, status")
    .order("name");

  return (
    <>
      <PageHeader eyebrow="Admin" title="Projects" lede="Projects that combine tracks into real productions." />
      <div className="mx-auto max-w-[1120px] px-5 py-8 md:px-14">
        <Link
          href="/admin/projects/new"
          className="inline-block bg-ink px-5 py-3 text-[14.5px] font-medium text-paper hover:opacity-80"
        >
          Add project
        </Link>

        {error && (
          <p className="mt-8 text-[14.5px] text-red-700">
            Couldn&rsquo;t load projects: {error.message}. Have you run supabase/schema.sql
            and added your project&rsquo;s credentials to .env.local?
          </p>
        )}

        {!error && projects?.length === 0 && <p className="mt-8 text-slate">No projects yet — add the first one.</p>}

        {!error && projects && projects.length > 0 && (
          <div className="mt-8 border-t border-rule">
            {projects.map((p) => (
              <Link
                key={p.id}
                href={`/admin/projects/${p.id}`}
                className="flex items-center justify-between border-b border-rule py-4 hover:text-brass"
              >
                <p className="font-serif text-[17px]">{p.name}</p>
                <span className="text-[12.5px] uppercase tracking-wide text-slate">{p.status}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
