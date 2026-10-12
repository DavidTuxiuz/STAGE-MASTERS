import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { getResources } from "@/lib/content/resources";

export const metadata = { title: "Resources — Stage Master" };
export const dynamic = "force-dynamic";

export default async function ResourcesPage() {
  const resources = await getResources();

  return (
    <main>
      <PageHeader
        eyebrow="Resources"
        title="Curated, not just collected"
        lede="Every resource here records its source and access status, and connects to a lesson, a practice or a project — not just a link."
      />
      <div className="mx-auto max-w-[1120px] px-5 py-14 md:px-14">
        {resources.length === 0 ? (
          <p className="text-slate">
            No resources published yet. Once content is added via the admin,
            each one will show its author, institution, track, level, format
            and why Stage Master uses it.
          </p>
        ) : (
          <div className="border-t border-rule">
            {resources.map((r) => (
              <Link
                key={r.slug}
                href={`/resources/${r.slug}`}
                className="flex items-center justify-between border-b border-rule py-5 hover:text-brass"
              >
                <div>
                  <p className="font-serif text-[18px]">{r.title}</p>
                  <p className="text-[13.5px] text-slate">
                    {[r.track?.name, r.format, r.level].filter(Boolean).join(" · ") || "Resource"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
