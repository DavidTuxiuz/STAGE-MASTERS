// Practice challenges — see brief section 10. Real records eventually live in
// the `practices` table; this is the same kind of typed seed/fallback as tracks.ts.

export type Practice = {
  slug: string;
  name: string;
};

export const practices: Practice[] = [
  { slug: "5-minute-improvised-talk", name: "5-Minute Improvised Talk" },
  { slug: "three-frame-visual-story", name: "Three-Frame Visual Story" },
  { slug: "60-second-campus-story", name: "60-Second Campus Story" },
  { slug: "mock-student-interview", name: "Mock Student Interview" },
  { slug: "lighting-experiment", name: "Lighting Experiment" },
];

export function getPractice(slug: string): Practice | undefined {
  return practices.find((p) => p.slug === slug);
}
