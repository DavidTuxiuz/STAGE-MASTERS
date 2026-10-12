import { notFound } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { getPracticeBySlug } from "@/lib/content/practices";

export const dynamic = "force-dynamic";

export default async function PracticeDetailPage({ params }: { params: { slug: string } }) {
  const practice = await getPracticeBySlug(params.slug);
  if (!practice) return notFound();

  const hasDetail =
    practice.instructions || practice.output_requirements || practice.quality_criteria;

  return (
    <main>
      <PageHeader
        eyebrow="Practice"
        title={practice.name}
        lede={[practice.skill, practice.level, practice.duration_minutes ? `${practice.duration_minutes} min` : null]
          .filter(Boolean)
          .join(" · ") || undefined}
      />
      <div className="mx-auto max-w-[1120px] space-y-8 px-5 py-14 md:px-14">
        {!hasDetail && (
          <p className="text-slate">
            Instructions, output requirements and quality criteria for this
            practice will appear here once added.
          </p>
        )}

        {practice.instructions && (
          <section>
            <h2 className="mb-2 font-serif text-[20px]">Instructions</h2>
            <p className="max-w-[640px] text-slate">{practice.instructions}</p>
          </section>
        )}

        {practice.output_requirements && (
          <section>
            <h2 className="mb-2 font-serif text-[20px]">Output</h2>
            <p className="max-w-[640px] text-slate">{practice.output_requirements}</p>
          </section>
        )}

        {practice.quality_criteria && (
          <section>
            <h2 className="mb-2 font-serif text-[20px]">Quality criteria</h2>
            <p className="max-w-[640px] text-slate">{practice.quality_criteria}</p>
          </section>
        )}

        {practice.related_resource && (
          <section>
            <h2 className="mb-2 font-serif text-[20px]">Related resource</h2>
            <Link
              href={`/resources/${practice.related_resource.slug}`}
              className="underline underline-offset-4"
            >
              {practice.related_resource.title}
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}
