import PageHeader from "@/components/PageHeader";

export const metadata = { title: "About — Stage Master" };

export default function AboutPage() {
  return (
    <main>
      <PageHeader
        eyebrow="About"
        title="Discover. Develop. Create."
        lede="Stage Master Society is a student creative-development and production ecosystem — not a social network, course marketplace, admin portal or AI chatbot."
      />
      <div className="mx-auto max-w-[1120px] px-5 py-14 text-slate md:px-14">
        <p>
          The platform belongs to the Stage Master ecosystem, not to one
          individual, and is built to be transferable to future leadership.
        </p>
      </div>
    </main>
  );
}
