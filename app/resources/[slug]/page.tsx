import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import { getResourceBySlug } from "@/lib/content/resources";

export const dynamic = "force-dynamic";

export default async function ResourcePage({ params }: { params: { slug: string } }) {
  const resource = await getResourceBySlug(params.slug);
  if (!resource) return notFound();

  const meta = [resource.author, resource.institution].filter(Boolean).join(" · ");

  return (
    <main>
      <PageHeader eyebrow={resource.track?.name ?? "Resource"} title={resource.title} lede={meta || undefined} />
      <div className="mx-auto max-w-[1120px] space-y-8 px-5 py-14 md:px-14">
        {resource.description && (
          <section>
            <h2 className="mb-2 font-serif text-[20px]">Description</h2>
            <p className="max-w-[640px] text-slate">{resource.description}</p>
          </section>
        )}

        {resource.stage_master_use && (
          <section>
            <h2 className="mb-2 font-serif text-[20px]">Why Stage Master uses this</h2>
            <p className="max-w-[640px] text-slate">{resource.stage_master_use}</p>
          </section>
        )}

        <section className="flex flex-wrap gap-6 border-t border-rule pt-6 text-[14.5px]">
          {resource.level && (
            <div>
              <p className="text-slate">Level</p>
              <p>{resource.level}</p>
            </div>
          )}
          {resource.format && (
            <div>
              <p className="text-slate">Format</p>
              <p>{resource.format}</p>
            </div>
          )}
          {resource.license_status && (
            <div>
              <p className="text-slate">License / access</p>
              <p>{resource.license_status}</p>
            </div>
          )}
        </section>

        <section className="flex flex-wrap gap-5">
          {resource.url && (
            <a href={resource.url} target="_blank" rel="noreferrer" className="underline underline-offset-4">
              View source
            </a>
          )}
          {resource.file_url && (
            <a href={resource.file_url} target="_blank" rel="noreferrer" className="underline underline-offset-4">
              View file
            </a>
          )}
        </section>
      </div>
    </main>
  );
}
