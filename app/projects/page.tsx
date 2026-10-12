import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { getProjects } from "@/lib/content/projects";

export const metadata = { title: "Projects — Stage Master" };
export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main>
      <PageHeader
        eyebrow="Create"
        title="Learn through creation"
        lede="Projects create real outputs and combine specializations the way real productions do."
      />
      <div className="mx-auto max-w-[1120px] px-5 py-14 md:px-14">
        <div className="grid gap-10 md:grid-cols-2">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="block border border-rule bg-paper-2 p-8 transition-opacity hover:opacity-90"
            >
              <h3 className="mb-2.5 font-serif text-[21px]">{project.name}</h3>
              {project.purpose && <p className="text-[14.5px] text-slate">{project.purpose}</p>}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
