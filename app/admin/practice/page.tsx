import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/PageHeader";

export const metadata = { title: "Admin — Practice — Stage Master" };
export const dynamic = "force-dynamic";

export default async function AdminPracticePage() {
  const supabase = createClient();
  const { data: practices, error } = await supabase
    .from("practices")
    .select("id, name, skill, level")
    .order("name");

  return (
    <>
      <PageHeader eyebrow="Admin" title="Practice" lede="Practice challenges members work through." />
      <div className="mx-auto max-w-[1120px] px-5 py-8 md:px-14">
        <Link
          href="/admin/practice/new"
          className="inline-block bg-ink px-5 py-3 text-[14.5px] font-medium text-paper hover:opacity-80"
        >
          Add practice
        </Link>

        {error && (
          <p className="mt-8 text-[14.5px] text-red-700">
            Couldn&rsquo;t load practices: {error.message}. Have you run supabase/schema.sql
            and added your project&rsquo;s credentials to .env.local?
          </p>
        )}

        {!error && practices?.length === 0 && <p className="mt-8 text-slate">No practices yet — add the first one.</p>}

        {!error && practices && practices.length > 0 && (
          <div className="mt-8 border-t border-rule">
            {practices.map((p) => (
              <Link
                key={p.id}
                href={`/admin/practice/${p.id}`}
                className="flex items-center justify-between border-b border-rule py-4 hover:text-brass"
              >
                <p className="font-serif text-[17px]">{p.name}</p>
                <span className="text-[13px] text-slate">{p.level ?? "—"}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
