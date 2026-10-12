import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { getPractices } from "@/lib/content/practices";

export const metadata = { title: "Practise — Stage Master" };
export const dynamic = "force-dynamic";

export default async function PracticePage() {
  const practices = await getPractices();

  return (
    <main>
      <PageHeader
        eyebrow="Practise"
        title="Don't just learn it. Do it."
        lede="Short, specific challenges with a clear output and quality criteria. This is how ability actually gets built."
      />
      <div className="mx-auto max-w-[1120px] border-t border-rule px-5 py-4 md:px-14">
        {practices.map((p) => (
          <Link
            key={p.slug}
            href={`/practice/${p.slug}`}
            className="block border-b border-rule py-5 font-serif text-[19px] hover:text-brass"
          >
            {p.name}
          </Link>
        ))}
      </div>
    </main>
  );
}
