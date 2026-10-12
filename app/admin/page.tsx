import Link from "next/link";
import PageHeader from "@/components/PageHeader";

export const metadata = { title: "Admin — Stage Master" };

const sections = [
  { name: "Tracks", route: "/admin/tracks", note: "Edit the 8 specializations.", built: true },
  { name: "Modules & Lessons", route: "/admin/modules", note: "Build learning paths within a track.", built: false },
  { name: "Resources", route: "/admin/resources", note: "Add, review and publish external/internal resources.", built: true },
  { name: "Practice", route: "/admin/practice", note: "Manage practice challenges.", built: true },
  { name: "Projects", route: "/admin/projects", note: "Create and manage projects.", built: true },
  { name: "Showcase", route: "/admin/showcase", note: "Approve work for the public showcase.", built: true },
];

export default function AdminHome() {
  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Manage content"
        lede="Core content management for authorized Stage Master members — no SQL required, once this is connected to Supabase."
      />
      <div className="mx-auto max-w-[1120px] border-t border-rule px-5 py-4 md:px-14">
        {sections.map((s) => (
          <Link
            key={s.route}
            href={s.built ? s.route : "#"}
            className={`flex items-center justify-between border-b border-rule py-5 ${
              s.built ? "hover:text-brass" : "cursor-default opacity-60"
            }`}
          >
            <div>
              <p className="font-serif text-[18px]">{s.name}</p>
              <p className="text-[14px] text-slate">{s.note}</p>
            </div>
            <span className="text-[13px] text-slate">{s.built ? "Open →" : "Not yet built"}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
