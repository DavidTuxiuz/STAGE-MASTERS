import Link from "next/link";
import Button from "@/components/Button";
import TrackList from "@/components/TrackList";
import { getTracks } from "@/lib/content/tracks";
import { getPractices } from "@/lib/content/practices";
import { developmentJourney } from "@/lib/data/journey";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const tracks = await getTracks();
  const practices = await getPractices();
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-[520px] w-[520px] rounded-full opacity-[0.16]"
          style={{
            background:
              "radial-gradient(circle at center, var(--brass) 0%, transparent 68%)",
          }}
        />
        <div className="mx-auto max-w-[1120px] px-5 py-16 md:px-14 md:py-28">
          <p className="mb-5 max-w-[420px] text-[14.5px] text-slate">
            A student creative-development and production ecosystem
          </p>
          <h1 className="max-w-[900px] font-serif text-[clamp(52px,9vw,108px)] leading-[0.96] tracking-tight">
            Stage Master
          </h1>
          <p className="mt-7 max-w-[540px] text-[clamp(17px,2vw,20px)] text-slate">
            Discover. Develop. Create. Building the people who will build the stage.
          </p>
          <div className="mt-9 flex flex-wrap gap-3.5">
            <Button href="/explore">Explore the tracks</Button>
            <Button href="/practice" variant="ghost">
              See what practice looks like
            </Button>
          </div>
        </div>
      </section>

      <hr className="border-t border-rule" />

      {/* Big idea */}
      <section className="mx-auto max-w-[1120px] px-5 py-16 md:px-14 md:py-24">
        <p className="max-w-[820px] font-serif text-[clamp(28px,4.2vw,44px)] leading-[1.3]">
          Stage Master isn&rsquo;t a course library or a dashboard. It&rsquo;s where
          students <em className="italic text-brass">discover</em> ability,{" "}
          <em className="italic text-brass">develop</em> it deliberately, and{" "}
          <em className="italic text-brass">create</em> real work — then help
          develop the next person.
        </p>
      </section>

      {/* Where do you fit */}
      <section className="mx-auto max-w-[1120px] px-5 py-16 md:px-14 md:py-24">
        <h2 className="font-serif text-[clamp(28px,3.5vw,38px)]">Where do you fit?</h2>
        <p className="mb-11 mt-3 max-w-[560px] text-slate">
          Everyone enters somewhere. Most people move through all three.
        </p>
        <div className="grid border-t border-rule md:grid-cols-3">
          {[
            {
              label: "Discover",
              body: "Find out what you're drawn to across performance, media, production and strategy — before committing to a track.",
            },
            {
              label: "Develop",
              body: "Learn the craft, then practise it deliberately. Ability is built through repetition, not attendance.",
            },
            {
              label: "Create",
              body: "Put skills into real productions alongside other tracks, and put finished work in front of an audience.",
            },
          ].map((fit, i) => (
            <div
              key={fit.label}
              className={`border-rule py-8 pr-7 ${i < 2 ? "md:border-r" : ""} border-b md:border-b-0`}
            >
              <p className="mb-2.5 font-serif italic text-[20px] text-brass">{fit.label}</p>
              <p className="text-[15px] text-slate">{fit.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Eight specializations */}
      <section id="explore" className="mx-auto max-w-[1120px] px-5 py-16 md:px-14 md:py-24">
        <h2 className="font-serif text-[clamp(28px,3.5vw,38px)]">Eight specializations</h2>
        <p className="mb-11 mt-3 max-w-[560px] text-slate">
          The tracks are interconnected, not isolated departments — real
          productions combine several.
        </p>
        <TrackList tracks={tracks} />
      </section>

      {/* Development journey */}
      <section className="mx-auto max-w-[1120px] px-5 py-16 md:px-14 md:py-24">
        <h2 className="font-serif text-[clamp(28px,3.5vw,38px)]">The development journey</h2>
        <p className="mb-9 mt-3 max-w-[560px] text-slate">
          Competence is evidenced by demonstrated ability, not attendance.
        </p>
        <div className="overflow-x-auto border-t border-rule pt-9">
          <div className="flex min-w-[640px]">
            {developmentJourney.map((step, i) => (
              <div key={step} className="relative flex-1 pr-4">
                {i < developmentJourney.length - 1 && (
                  <span className="absolute left-4 right-[-16px] top-[3px] h-px bg-rule" />
                )}
                <span className="mb-3.5 block h-2 w-2 rounded-full bg-brass" />
                <p className="font-serif text-[16.5px]">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Practice philosophy */}
      <section id="practice" className="mx-auto max-w-[1120px] px-5 py-16 md:px-14 md:py-24">
        <div className="grid gap-14 md:grid-cols-[1.1fr_1fr]">
          <div>
            <h2 className="font-serif text-[clamp(28px,3.5vw,38px)]">
              Don&rsquo;t just learn it. Do it.
            </h2>
            <p className="mt-3 max-w-[520px] text-slate">
              Practice is a first-class part of the platform, not an
              afterthought — short, specific challenges with a clear output
              and quality criteria.
            </p>
          </div>
          <ul className="border-t border-rule">
            {practices.map((p) => (
              <li key={p.slug} className="border-b border-rule py-4 text-[15px]">
                <Link href={`/practice/${p.slug}`} className="hover:underline">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Projects / showcase */}
      <section className="mx-auto max-w-[1120px] px-5 py-16 md:px-14 md:py-24">
        <h2 className="font-serif text-[clamp(28px,3.5vw,38px)]">Learn through creation</h2>
        <p className="mb-9 mt-3 max-w-[560px] text-slate">
          Projects combine tracks the way real productions do.
        </p>
        <div className="grid gap-10 md:grid-cols-2">
          <div className="border border-rule bg-paper-2 p-8">
            <span className="mb-3.5 inline-block border border-brass px-2.5 py-0.5 text-[12.5px] text-brass">
              Project
            </span>
            <h3 className="mb-2.5 font-serif text-[21px]">Campus Talk Show</h3>
            <p className="mb-4.5 text-[14.5px] text-slate">
              Needs a host, researcher, camera crew, photographer, editor,
              designer, content lead, technical crew and performers — one
              production, every specialization.
            </p>
            <Link href="/projects" className="text-[14.5px] underline underline-offset-4">
              View project brief
            </Link>
          </div>
          <div className="border border-rule bg-paper-2 p-8">
            <span className="mb-3.5 inline-block border border-brass px-2.5 py-0.5 text-[12.5px] text-brass">
              Showcase
            </span>
            <h3 className="mb-2.5 font-serif text-[21px]">Selected work</h3>
            <p className="mb-4.5 text-[14.5px] text-slate">
              Finished productions and standout practice outputs, selected —
              not everything that&rsquo;s submitted.
            </p>
            <Link href="/showcase" className="text-[14.5px] underline underline-offset-4">
              View the showcase
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-y border-rule">
        <div className="mx-auto max-w-[1120px] px-5 py-16 md:px-14 md:py-24">
          <h2 className="mb-7 max-w-[760px] font-serif text-[clamp(32px,5vw,54px)] leading-[1.1]">
            Find your track, do the work, put something real in front of
            people.
          </h2>
          <Button href="/explore">Start with Discover</Button>
        </div>
      </section>
    </main>
  );
}
