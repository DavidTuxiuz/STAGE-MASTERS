import PageHeader from "@/components/PageHeader";
import { getShowcaseItems } from "@/lib/content/showcase";

export const metadata = { title: "Showcase — Stage Master" };
export const dynamic = "force-dynamic";

function isImage(url: string) {
  return /\.(png|jpe?g|gif|webp|avif|svg)$/i.test(url);
}

export default async function ShowcasePage() {
  const items = await getShowcaseItems();

  return (
    <main>
      <PageHeader
        eyebrow="Community"
        title="Selected work"
        lede="Finished productions and standout practice outputs, selected — not everything that's submitted."
      />
      <div className="mx-auto max-w-[1120px] px-5 py-14 md:px-14">
        {items.length === 0 ? (
          <p className="text-slate">Nothing published yet. Approved showcase items will appear here.</p>
        ) : (
          <div className="grid gap-10 md:grid-cols-2">
            {items.map((item) => (
              <div key={item.id} className="border border-rule bg-paper-2 p-8">
                {item.media_url && isImage(item.media_url) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.media_url}
                    alt={item.title}
                    className="mb-5 aspect-[4/3] w-full object-cover"
                  />
                )}
                <h3 className="mb-2.5 font-serif text-[21px]">{item.title}</h3>
                {item.project && <p className="mb-2 text-[13px] text-brass">{item.project.name}</p>}
                {item.description && <p className="mb-4 text-[14.5px] text-slate">{item.description}</p>}
                {item.media_url && !isImage(item.media_url) && (
                  <a
                    href={item.media_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[14.5px] underline underline-offset-4"
                  >
                    View
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
