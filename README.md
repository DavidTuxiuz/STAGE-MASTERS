# Stage Master — Phase 1 scaffold

This is the Phase 1 foundation from the build brief: project setup, routing,
TypeScript, Tailwind, the reusable components, a Supabase integration
boundary, and the database schema. Phase 2's public homepage is fully built;
the other public pages are real, working routes with placeholder content
where no data exists yet. Admin is a stub with no auth — see below.

## Getting it running

```bash
npm install
cp .env.example .env.local   # fill in your Supabase project's URL + anon key
npm run dev
```

The site will run without Supabase filled in — every page still renders,
because Phase 1 pages read from the local files in `lib/data/`, not from the
database yet. Search and the admin area are the only things that assume
Supabase is eventually connected.

## How the project is organized

```
app/                  Every route (Next.js App Router — one folder = one URL)
  page.tsx            Homepage: /
  explore/             /explore  and  /explore/[track]
  learn/               /learn    and  /learn/[track]
  resources/            /resources  and  /resources/[slug]
  practice/            /practice  and  /practice/[slug]
  projects/            /projects  and  /projects/[slug]
  showcase/, handbook/, about/, search/, admin/
  layout.tsx           Wraps every page: fonts, <Nav>, <Footer>
  globals.css          Design tokens (colors) + Tailwind

components/            Reusable UI: Nav, Footer, Button, PageHeader, TrackList
lib/data/              Content as typed data (tracks, practices, journey)
lib/supabase/          Supabase client setup (browser + server)
supabase/schema.sql    The full V1 database schema, ready to run in Supabase
```

Content is kept separate from presentation, as the brief asks: the 8
specializations, for example, live once in `lib/data/tracks.ts`, and every
page that lists them (`app/page.tsx`, `app/explore/page.tsx`, the dynamic
`[track]` page) imports from that one file.

## Where to change things

- **Colors** — `app/globals.css`, the `:root` block at the top (`--ink`,
  `--paper`, `--brass`, `--slate`). Tailwind classes like `bg-ink` and
  `text-brass` are wired to these automatically.
- **Fonts** — `app/layout.tsx`, the `Fraunces` (serif) and `IBM_Plex_Sans`
  (sans) imports.
- **The 8 tracks** — `lib/data/tracks.ts`. Add, remove or edit entries there
  and every page picks it up.
- **Practice challenges** — `lib/data/practices.ts`.
- **Homepage copy** — `app/page.tsx`.
- **Nav links** — `components/Nav.tsx`, the `links` array.

## Content vs. database

Every public page now reads through a small data layer in `lib/content/`
(`tracks.ts`, `practices.ts`, `projects.ts`, `resources.ts`, `showcase.ts`)
rather than importing `lib/data/` directly. Each function in that layer:

1. Tries the live Supabase table first.
2. Falls back to the local seed in `lib/data/` — but only for **tracks** and
   **practices**, where a sensible default exists. **Resources** and
   **showcase** have no fallback; they honestly show "nothing published
   yet" when Supabase isn't connected or has no rows, per the brief's
   instruction not to fake backend functionality. **Projects** falls back to
   exactly one hardcoded sample (the brief's "Campus Talk Show") so the page
   is never empty before anyone has added a real project, and that sample
   keeps its own working page at `/projects/campus-talk-show` even after
   real projects exist.

This means: **the site works with zero setup** (tracks/practices/the one
sample project render from local files), and **the moment you connect
Supabase and add content through `/admin`, the public pages switch to
showing it automatically** — no further code changes needed. Edit a track's
description in `/admin/tracks` and `/explore` shows the new text on the next
request; publish a resource in `/admin/resources` and it appears on
`/resources`.

The one page that still reads local data directly (not through
`lib/content/`) is `/search` — it's a client component doing instant local
filtering, and Supabase's server client can't be called from client-side
code. If you want the live catalog searchable, the way to do that is a
Postgres full-text search behind a route handler or server action, called
from that page.

## Connecting Supabase (required for real content, auth, and uploads)

1. Create a project at supabase.com.
2. In the SQL editor, run `supabase/schema.sql`, then `supabase/seed.sql`.
   The schema creates all 11 tables and turns on Row Level Security; the seed
   inserts the 8 real specializations into `tracks` so forms like the
   resource editor have something to pick from.
3. Copy your project URL and anon key into `.env.local` (see
   `.env.example`). Never put the service role key in a `NEXT_PUBLIC_*`
   variable or in client code — it bypasses RLS entirely.
4. `lib/supabase/client.ts` is for use in Client Components (`"use client"`
   files). `lib/supabase/server.ts` is for Server Components, Server Actions
   and Route Handlers. Both are already wired to read your `.env.local`.

## Admin auth (now real, once Supabase is connected)

`/admin` is guarded for real:

- **`middleware.ts`** refreshes the Supabase session cookie on every request
  (standard `@supabase/ssr` boilerplate — Supabase's own docs recommend this
  exact pattern).
- **`/login`** sends a magic link (passwordless — enter an email, get a
  link) via `supabase.auth.signInWithOtp`.
- **`/auth/callback`** exchanges the link's code for a session, then sends
  the visitor to `/admin`.
- **`app/admin/layout.tsx`** runs on the server, checks for a session with
  `auth.getUser()`, and looks up the caller's `role` in `public.profiles`.
  No session → redirected to `/login`. Session but wrong role → a plain "not
  authorized" screen (not a fake success state).
- **`schema.sql`** creates a `profiles` row automatically when someone signs
  up (via a trigger), defaulting to `role = 'student'`. Nobody can reach
  `/admin` until you manually promote a row:
  ```sql
  update public.profiles set role = 'admin' where id = '<their-user-id>';
  ```
  (Find the user id in Supabase → Authentication → Users after they sign in
  once.)

**Important:** the layout check is for UX — showing the right screen. The
real security boundary is Row Level Security in `schema.sql` (`is_admin()`,
`is_staff()`, and the policies that use them). Even if someone bypassed the
page entirely, RLS is what actually stops them writing to the database.
This is a starting set of policies for Phase 4, not a finished security
review — expand `is_staff()` usage to the other tables as their admin forms
get built, and consider adding an audit log before this goes to real users.

## Managing resources

`/admin/resources` is the first real content-management screen (the rest are
still the "Not yet built" list). Once you're signed in with `admin` or
`resource_person` role:

- **List** — every resource regardless of status, newest-updated first.
- **Add resource** (`/admin/resources/new`) — the form matches the fields
  from section 7 of the brief (author, institution, track, topic, level,
  format, source, url, license/access status, description, why Stage Master
  uses it, status). The slug is generated from the title automatically.
- **Edit** (`/admin/resources/[id]`) — same form, pre-filled; also has
  **Delete**.
- **File uploads** — the form has both a **URL** field (for a resource that
  lives elsewhere) and a **File** field (uploads into a `resources` Storage
  bucket). Uploading a file sets `file_url` to its public URL; choosing a
  new file on an existing resource replaces it; deleting a resource also
  removes its file from Storage. Storage access is governed by the same
  `is_staff()` policies as the database rows — see the "STORAGE" section of
  `schema.sql`.
- All three are backed by real database reads/writes via server actions in
  `app/admin/resources/actions.ts` — there's no mock data or fake success
  state. If Supabase isn't connected yet, the list page shows the actual
  error instead of pretending to load.

The same pattern (list page + shared `<Form>` component + `actions.ts` with
create/update/delete) is what to copy for Practice, Projects and Showcase in
Phase 4.

## Managing tracks

`/admin/tracks` follows the exact same pattern as Resources, scaled down —
tracks only have four fields (index, name, slug, description), no file
upload, and no status workflow (a track is just live or not). One safeguard
worth knowing: **deleting a track checks for resources that reference it
first** and refuses with a clear error if any exist, rather than silently
orphaning or cascading. Reassign or delete those resources before deleting
the track.

Editing a track here changes what `/explore` and the homepage render,
since those pages are the ones meant to eventually read from the live
`tracks` table instead of `lib/data/tracks.ts` (see "Content vs. database"
above) — today they still read the local file, so track edits in the admin
only affect `/admin/tracks` itself and the resource form's dropdown until
that switch is made.

## Managing practice, projects and showcase

All three follow the same list + form + `actions.ts` pattern as Resources
and Tracks:

- **`/admin/practice`** — skill, level, duration, instructions, output
  requirements, quality criteria, and an optional link to a resource (picked
  from a dropdown of whatever's in `/admin/resources`). Deleting checks the
  `contributions` table first and refuses if any reference the practice.
- **`/admin/projects`** — purpose, brief, objective, audience, output,
  workflow, quality criteria, status, and **which tracks participate** as a
  checkbox group. That many-to-many relationship lives in the
  `project_tracks` junction table; saving a project clears and reinserts its
  rows in one go (`syncProjectTracks` in `app/admin/projects/actions.ts`) —
  simpler and just as correct as diffing, since the junction table has no
  extra columns to preserve. Deleting a project checks `showcases` first and
  refuses if any still point to it.
- **`/admin/showcase`** — title, an optional project it belongs to,
  description, status, and a **Media URL** field. Unlike Resources, this
  does not yet support direct file upload — paste a link (including a link
  to something already uploaded via a resource) rather than attaching a
  file here. Extending it to upload into its own Storage bucket is a direct
  copy of the pattern in `app/admin/resources/actions.ts` if you want that
  later.

One schema gap this closed: `practices`, `projects`, `project_tracks` and
`showcases` had Row Level Security turned on but **no write policy** —
`project_tracks` had no policy at all, meaning nobody, not even staff, could
read or write it. `schema.sql` now has a `Staff can manage ...` policy for
each. If you ran an earlier version of `schema.sql`, re-run the new policy
statements (they're additive — safe to run again).

## What's stubbed vs. real

| Area | Status |
|---|---|
| Homepage | Fully built, reads live tracks + practices via `lib/content/`, falls back to local data with zero setup |
| Explore / Learn (index + detail) | Live from the `tracks` table, falls back to local data |
| Practice (index + detail) | Live from the `practices` table, falls back to local data |
| Resources (public page) | Live from the `resources` table, honest empty state (no fake data, no local fallback) |
| Projects (public page) | Live from the `projects` table (published only), falls back to one sample project |
| Showcase (public page) | Live from the `showcases` table, honest empty state (no fake data, no local fallback) |
| Admin → Resources | Fully real: list, create, edit, delete, file upload against Supabase |
| Admin → Tracks | Fully real: list, create, edit, delete (with a reference-check guard) against Supabase |
| Admin → Practice | Fully real: list, create, edit, delete (with a reference-check guard) against Supabase |
| Admin → Projects | Fully real: list, create, edit, delete, track multi-select against Supabase |
| Admin → Showcase | Fully real: list, create, edit, delete against Supabase (link-only media, no upload yet) |
| Admin → auth | Real: magic-link sign-in + server-side role gate |
| Search | Still local-only (client component; see "Content vs. database" above for why) |
| Admin → Modules & Lessons | Not yet built — the one admin section still on the "copy the pattern" list |
| Supabase | Schema + seed ready (includes Storage bucket + policies for all tables); client code wired; connect your own project |

**What this means in practice:** add a resource in `/admin/resources` and
set its status to "published" → it appears on `/resources` immediately,
with no redeploy or code change. Same for tracks, practices, projects and
showcase items. This is the payoff of the `lib/content/` layer added in
this pass.

## Next steps (per the brief's phase plan)

- Finish Phase 1: wire real Supabase auth into `/admin`.
- Phase 3: build out practice submission and project resource-linking.
- Phase 4: real admin CRUD forms (replace the "Not yet built" list in
  `app/admin/page.tsx`).
- Phase 6: populate real curriculum, resources and projects.
