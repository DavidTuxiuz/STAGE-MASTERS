import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import { getProjectBySlug } from "@/lib/content/projects";

export const dynamic = "force-dynamic";

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);
  if (!project) return notFound();

  const fields: { label: string; value: string | null | undefined }[] = [
    { label: "Objective", value: project.objective },
    { label: "Audience", value: project.audience },
    { label: "Output", value: project.output },
    { label: "Workflow", value: project.workflow },
    { label: "Quality criteria", value: project.quality_criteria },
  ].filter((f) => f.value);

  return (
    <main>
      <PageHeader eyebrow="Project" title={project.name} lede={project.brief ?? project.purpose ?? undefined} />
      <div className="mx-auto max-w-[1120px] space-y-10 px-5 py-14 md:px-14">
        {project.tracks && project.tracks.length > 0 && (
          <section>
            <h2 className="mb-5 font-serif text-[22px]">Participating tracks</h2>
            <ul className="border-t border-rule">
              {project.tracks.map((track) => (
                <li key={track} className="border-b border-rule py-3.5 text-[15px] text-slate">
                  {track}
                </li>
              ))}
            </ul>
          </section>
        )}

        {fields.map((f) => (
          <section key={f.label}>
            <h2 className="mb-2 font-serif text-[20px]">{f.label}</h2>
            <p className="max-w-[640px] text-slate">{f.value}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
