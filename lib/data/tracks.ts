// Content lives here, separate from presentation, per the Stage Master build brief
// ("Keep content separate from presentation"). In Phase 4/6 this moves into the
// `tracks` table in Supabase — see supabase/schema.sql — and this file becomes a
// typed fallback / seed source instead of the source of truth.

export type Track = {
  slug: string;
  index: number;
  name: string;
  description: string;
};

export const tracks: Track[] = [
  {
    slug: "presentation-performance",
    index: 1,
    name: "Presentation & Performance",
    description:
      "Public speaking, voice and diction, storytelling, hosting, interviewing, moderation, camera presentation, improvisation, audience engagement and live presentation.",
  },
  {
    slug: "visual-media",
    index: 2,
    name: "Visual Media",
    description:
      "Photography, camera operation, composition, lighting, portraiture, event photography, photojournalism, videography foundations, visual storytelling, mobile photography and image editing.",
  },
  {
    slug: "video-post-production",
    index: 3,
    name: "Video & Post-Production",
    description:
      "Pre-production, cinematography, directing, interview production, editing, audio post, colour, motion graphics, short-form video, documentary workflow and delivery.",
  },
  {
    slug: "journalism-campus-media",
    index: 4,
    name: "Journalism & Campus Media",
    description:
      "Reporting, news and feature writing, interviewing, research, verification, fact-checking, ethics, photojournalism, video journalism, multimedia and editorial workflow.",
  },
  {
    slug: "digital-content-social-media",
    index: 5,
    name: "Digital Content & Social Media",
    description:
      "Audience, content strategy, ideation, copywriting, short-form content, platforms, community, campaigns, analytics and creator workflow.",
  },
  {
    slug: "creative-strategy-branding",
    index: 6,
    name: "Creative Strategy & Branding",
    description:
      "Creative thinking, research, ideation, briefs, brand strategy, positioning, visual identity, design, campaigns, creative direction, pitching and portfolio.",
  },
  {
    slug: "event-technical-production",
    index: 7,
    name: "Event & Technical Production",
    description:
      "Event production, stage management, production planning, run of show, rehearsals, sound, lighting, cueing, backstage, equipment, troubleshooting and safety.",
  },
  {
    slug: "performing-arts",
    index: 8,
    name: "Performing Arts",
    description:
      "Theatre, acting, character, improvisation, spoken word, comedy, music performance, dance, movement, directing, rehearsal, performance creation and showcases.",
  },
];

export function getTrack(slug: string): Track | undefined {
  return tracks.find((t) => t.slug === slug);
}
