// Shared header for every non-home page: answers "where am I / what is this"
// per the brief's UX principle, without repeating markup on every page.

export default function PageHeader({
  eyebrow,
  title,
  lede,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
}) {
  return (
    <div className="border-b border-rule py-14 md:py-20">
      <div className="mx-auto max-w-[1120px] px-5 md:px-14">
        {eyebrow && <p className="mb-3 text-[14.5px] text-slate">{eyebrow}</p>}
        <h1 className="max-w-[720px] font-serif text-[clamp(32px,5vw,52px)] leading-[1.05]">
          {title}
        </h1>
        {lede && <p className="mt-5 max-w-[560px] text-slate">{lede}</p>}
      </div>
    </div>
  );
}
