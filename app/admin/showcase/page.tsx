import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/PageHeader";

export const metadata = { title: "Admin — Showcase — Stage Master" };
export const dynamic = "force-dynamic";

export default async function AdminShowcasePage() {
  const supabase = createClient();
  const { data: items, error } = await supabase
    .from("showcases")
    .select("id, title, status, projects(name)")
    .order("created_at", { ascending: false });

  return (
    <>
      <PageHeader eyebrow="Admin" title="Showcase" lede="Finished work selected for the public showcase." />
      <div className="mx-auto max-w-[1120px] px-5 py-8 md:px-14">
        <Link
          href="/admin/showcase/new"
          className="inline-block bg-ink px-5 py-3 text-[14.5px] font-medium text-paper hover:opacity-80"
        >
          Add showcase item
        </Link>

        {error && (
          <p className="mt-8 text-[14.5px] text-red-700">
            Couldn&rsquo;t load showcase items: {error.message}. Have you run supabase/schema.sql
            and added your project&rsquo;s credentials to .env.local?
          </p>
        )}

        {!error && items?.length === 0 && <p className="mt-8 text-slate">Nothing yet — add the first item.</p>}

        {!error && items && items.length > 0 && (
          <div className="mt-8 border-t border-rule">
            {items.map((item: any) => (
              <Link
                key={item.id}
                href={`/admin/showcase/${item.id}`}
                className="flex items-center justify-between border-b border-rule py-4 hover:text-brass"
              >
                <div>
                  <p className="font-serif text-[17px]">{item.title}</p>
                  <p className="text-[13px] text-slate">{item.projects?.name ?? "No project"}</p>
                </div>
                <span className="text-[12.5px] uppercase tracking-wide text-slate">{item.status}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
