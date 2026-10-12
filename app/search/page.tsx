"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { tracks } from "@/lib/data/tracks";
import { practices } from "@/lib/data/practices";

// Client-side search over local data for now. Once resources, lessons and
// projects live in Supabase, replace this with a real query (e.g. Postgres
// full-text search) in a server action or route handler.

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const trackResults = q ? tracks.filter((t) => t.name.toLowerCase().includes(q)) : [];
  const practiceResults = q ? practices.filter((p) => p.name.toLowerCase().includes(q)) : [];

  return (
    <main>
      <PageHeader eyebrow="Search" title="Search Stage Master" />
      <div className="mx-auto max-w-[1120px] px-5 py-10 md:px-14">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tracks, practice, resources, projects..."
          className="w-full border-b border-rule bg-transparent py-3 font-serif text-[22px] outline-none placeholder:text-slate"
        />

        {q && trackResults.length === 0 && practiceResults.length === 0 && (
          <p className="mt-8 text-slate">No matches for &ldquo;{query}&rdquo;.</p>
        )}

        {trackResults.length > 0 && (
          <div className="mt-8">
            <p className="mb-2 text-[14px] text-slate">Tracks</p>
            {trackResults.map((t) => (
              <a key={t.slug} href={`/explore/${t.slug}`} className="block border-b border-rule py-3 hover:text-brass">
                {t.name}
              </a>
            ))}
          </div>
        )}

        {practiceResults.length > 0 && (
          <div className="mt-8">
            <p className="mb-2 text-[14px] text-slate">Practice</p>
            {practiceResults.map((p) => (
              <a key={p.slug} href={`/practice/${p.slug}`} className="block border-b border-rule py-3 hover:text-brass">
                {p.name}
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
