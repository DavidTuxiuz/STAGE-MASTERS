"use client";

import { useState } from "react";
import Link from "next/link";
import type { Track } from "@/lib/data/tracks";

export default function TrackList({ tracks }: { tracks: Track[] }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  return (
    <div className="border-t border-rule">
      {tracks.map((track) => {
        const isOpen = openSlug === track.slug;
        return (
          <div key={track.slug} className="border-b border-rule py-6">
            <button
              className="grid w-full grid-cols-[40px_1fr] gap-5 text-left"
              onClick={() => setOpenSlug(isOpen ? null : track.slug)}
              aria-expanded={isOpen}
            >
              <span className="pt-0.5 font-serif italic text-brass">
                {String(track.index).padStart(2, "0")}
              </span>
              <span>
                <span className="block font-serif text-[22px]">{track.name}</span>
                {isOpen && (
                  <span className="mt-2 block max-w-[640px] text-[14.5px] text-slate">
                    {track.description}
                  </span>
                )}
              </span>
            </button>
            {isOpen && (
              <Link
                href={`/explore/${track.slug}`}
                className="ml-[60px] mt-3 inline-block text-[14px] underline underline-offset-4"
              >
                View this track
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
