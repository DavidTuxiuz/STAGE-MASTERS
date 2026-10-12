import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { getTracks } from "@/lib/content/tracks";

export const metadata = { title: "Learn — Stage Master" };
export const dynamic = "force-dynamic";

export default async function LearnPage() {
  const tracks = await getTracks();

  return (
    <main>
      <PageHeader
        eyebrow="Learn"
        title="Learning is connected to application"
        lede="A resource isn't automatically a Stage Master lesson — content here links out to practice and real work. Pick a track to see its modules and lessons."
      />
      <div className="mx-auto max-w-[1120px] border-t border-rule px-5 py-4 md:px-14">
        {tracks.map((t) => (
          <Link
            key={t.slug}
            href={`/learn/${t.slug}`}
            className="block border-b border-rule py-5 font-serif text-[19px] hover:text-brass"
          >
            {t.name}
          </Link>
        ))}
      </div>
    </main>
  );
}
