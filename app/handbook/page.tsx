import PageHeader from "@/components/PageHeader";

export const metadata = { title: "Handbook — Stage Master" };

export default function HandbookPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Handbook"
        title="How Stage Master works"
        lede="The development journey, the competency ladder, and how the whole system fits together."
      />
      <div className="mx-auto max-w-[1120px] px-5 py-14 text-slate md:px-14">
        <p>Handbook content goes here.</p>
      </div>
    </main>
  );
}
