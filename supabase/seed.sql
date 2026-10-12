-- Run this after schema.sql. Seeds the 8 specializations into the real
-- `tracks` table so admin forms (e.g. the resource form's Track dropdown)
-- have real rows to reference, matching lib/data/tracks.ts.
--
-- lib/data/tracks.ts stays as the fallback the public pages render from
-- until you're ready to switch those pages to query Supabase directly —
-- see README.md "Content vs. database".

insert into public.tracks (slug, index, name, description) values
  ('presentation-performance', 1, 'Presentation & Performance', 'Public speaking, voice and diction, storytelling, hosting, interviewing, moderation, camera presentation, improvisation, audience engagement and live presentation.'),
  ('visual-media', 2, 'Visual Media', 'Photography, camera operation, composition, lighting, portraiture, event photography, photojournalism, videography foundations, visual storytelling, mobile photography and image editing.'),
  ('video-post-production', 3, 'Video & Post-Production', 'Pre-production, cinematography, directing, interview production, editing, audio post, colour, motion graphics, short-form video, documentary workflow and delivery.'),
  ('journalism-campus-media', 4, 'Journalism & Campus Media', 'Reporting, news and feature writing, interviewing, research, verification, fact-checking, ethics, photojournalism, video journalism, multimedia and editorial workflow.'),
  ('digital-content-social-media', 5, 'Digital Content & Social Media', 'Audience, content strategy, ideation, copywriting, short-form content, platforms, community, campaigns, analytics and creator workflow.'),
  ('creative-strategy-branding', 6, 'Creative Strategy & Branding', 'Creative thinking, research, ideation, briefs, brand strategy, positioning, visual identity, design, campaigns, creative direction, pitching and portfolio.'),
  ('event-technical-production', 7, 'Event & Technical Production', 'Event production, stage management, production planning, run of show, rehearsals, sound, lighting, cueing, backstage, equipment, troubleshooting and safety.'),
  ('performing-arts', 8, 'Performing Arts', 'Theatre, acting, character, improvisation, spoken word, comedy, music performance, dance, movement, directing, rehearsal, performance creation and showcases.')
on conflict (slug) do nothing;
