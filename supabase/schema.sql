-- Stage Master V1 schema
-- Core entities per the build brief, section 7. Run this in the Supabase SQL
-- editor (or via `supabase db push` if you're using the CLI) after creating
-- your project. Row Level Security (RLS) is enabled on every table; the
-- policies below are a starting point, not a finished security review.

create extension if not exists "uuid-ossp";

-- ---------- USERS ----------
-- Supabase Auth already creates auth.users. This table holds the app-specific
-- profile data and role.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'student' check (role in ('student', 'resource_person', 'team_lead', 'admin')),
  created_at timestamptz not null default now()
);

-- Automatically create a profiles row when someone signs up, defaulting to
-- 'student'. Without this, auth.users and public.profiles can drift apart —
-- someone could authenticate but have no role row, which the admin layout
-- treats as "not authorized" rather than crashing.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- To make someone an admin after they've signed in once:
--   update public.profiles set role = 'admin' where id = '<their-user-id>';

-- ---------- CONTENT STATE ----------
-- Shared by resources, lessons, projects, showcase items.
-- draft -> review -> approved -> published -> archived

-- ---------- TRACKS ----------
create table public.tracks (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  index int not null,
  name text not null,
  description text not null,
  created_at timestamptz not null default now()
);

-- ---------- MODULES ----------
create table public.modules (
  id uuid primary key default uuid_generate_v4(),
  track_id uuid not null references public.tracks(id) on delete cascade,
  slug text not null,
  name text not null,
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  unique (track_id, slug)
);

-- ---------- LESSONS ----------
create table public.lessons (
  id uuid primary key default uuid_generate_v4(),
  module_id uuid not null references public.modules(id) on delete cascade,
  slug text not null,
  title text not null,
  objectives text,
  content text,
  status text not null default 'draft' check (status in ('draft', 'review', 'approved', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (module_id, slug)
);

-- ---------- RESOURCES ----------
-- Fields per section 7 of the brief.
create table public.resources (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  author text,
  institution text,
  track_id uuid references public.tracks(id),
  module_id uuid references public.modules(id),
  topic text,
  level text check (level in ('beginner', 'intermediate', 'advanced')),
  format text, -- e.g. article, video, template, tool
  source text,
  url text, -- external link, when the resource lives elsewhere
  file_url text, -- public URL of a file uploaded to the `resources` Storage bucket
  license_status text, -- e.g. "public domain", "used with permission", "fair use — attribution required"
  description text,
  stage_master_use text, -- why Stage Master uses this resource
  status text not null default 'draft' check (status in ('draft', 'review', 'approved', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  reviewed_at timestamptz
);

-- ---------- PRACTICES ----------
create table public.practices (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  skill text,
  level text,
  duration_minutes int,
  instructions text,
  output_requirements text,
  quality_criteria text,
  related_lesson_id uuid references public.lessons(id),
  related_resource_id uuid references public.resources(id),
  created_at timestamptz not null default now()
);

-- ---------- PROJECTS ----------
create table public.projects (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  purpose text,
  brief text,
  objective text,
  audience text,
  output text,
  workflow text,
  quality_criteria text,
  status text not null default 'draft' check (status in ('draft', 'review', 'approved', 'published', 'archived')),
  created_at timestamptz not null default now()
);

-- Many-to-many: which tracks participate in a project
create table public.project_tracks (
  project_id uuid not null references public.projects(id) on delete cascade,
  track_id uuid not null references public.tracks(id) on delete cascade,
  primary key (project_id, track_id)
);

-- ---------- COMPETENCIES ----------
create table public.competencies (
  id uuid primary key default uuid_generate_v4(),
  track_id uuid not null references public.tracks(id) on delete cascade,
  name text not null,
  ladder_stage text not null check (ladder_stage in ('aware', 'assisted', 'independent', 'resource_person', 'team_lead'))
);

-- ---------- SHOWCASES ----------
create table public.showcases (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.projects(id),
  title text not null,
  description text,
  media_url text,
  status text not null default 'draft' check (status in ('draft', 'review', 'approved', 'published', 'archived')),
  created_at timestamptz not null default now()
);

-- ---------- CONTRIBUTIONS ----------
-- Who did what, on which project/lesson/practice/resource — how competence
-- eventually gets evidenced instead of just claimed.
create table public.contributions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  project_id uuid references public.projects(id),
  practice_id uuid references public.practices(id),
  role text,
  description text,
  created_at timestamptz not null default now()
);

-- ---------- ROW LEVEL SECURITY ----------
alter table public.profiles enable row level security;
alter table public.tracks enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.resources enable row level security;
alter table public.practices enable row level security;
alter table public.projects enable row level security;
alter table public.project_tracks enable row level security;
alter table public.competencies enable row level security;
alter table public.showcases enable row level security;
alter table public.contributions enable row level security;

-- Everyone can read their own profile (needed for the admin role check).
create policy "Users can read own profile" on public.profiles for select
  using (auth.uid() = id);

-- A policy that queries `profiles` from within a `profiles` policy causes
-- infinite recursion in Postgres RLS, so admin-wide profile reads go through
-- this security-definer function instead (it runs with the function
-- owner's privileges, bypassing RLS internally, but only ever returns a
-- boolean).
create function public.is_admin()
returns boolean as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$ language sql security definer stable;

create policy "Admins can read all profiles" on public.profiles for select
  using (public.is_admin());

-- Public read of published content
create policy "Published tracks are public" on public.tracks for select using (true);
create policy "Published resources are public" on public.resources for select using (status = 'published');
create policy "Published lessons are public" on public.lessons for select using (status = 'published');
create policy "Published projects are public" on public.projects for select using (status = 'published');
create policy "Published showcases are public" on public.showcases for select using (status = 'published');

-- Writes: restricted to admins/resource persons via a security-definer
-- function (see public.is_admin() above) rather than a direct subquery on
-- profiles, for the same recursion reason. This is a starting policy for
-- Phase 4's admin CRUD — expand it per-table as those forms get built.
create function public.is_staff()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'resource_person')
  );
$$ language sql security definer stable;

create policy "Staff can manage resources" on public.resources for all
  using (public.is_staff())
  with check (public.is_staff());

create policy "Staff can manage tracks" on public.tracks for all
  using (public.is_staff())
  with check (public.is_staff());

-- practices has no public-read policy yet (the public /practice page still
-- reads lib/data/practices.ts, not this table — see README "Content vs.
-- database"), so staff need their own read+write policy to use /admin/practice.
create policy "Staff can manage practices" on public.practices for all
  using (public.is_staff())
  with check (public.is_staff());

create policy "Staff can manage projects" on public.projects for all
  using (public.is_staff())
  with check (public.is_staff());

-- project_tracks had no policy of any kind, which under RLS means nobody —
-- not even staff — could read or write it. This is what lets the Projects
-- admin form save its track checkboxes.
create policy "Staff can manage project_tracks" on public.project_tracks for all
  using (public.is_staff())
  with check (public.is_staff());

create policy "Staff can manage showcases" on public.showcases for all
  using (public.is_staff())
  with check (public.is_staff());

-- ---------- STORAGE (uploaded files) ----------
-- The `resources` bucket holds files members upload through the admin
-- resource form (posters, documents, images, etc.). It's public-read so the
-- same public URL can be stored in resources.file_url and used directly —
-- writes are restricted to staff.

insert into storage.buckets (id, name, public)
values ('resources', 'resources', true)
on conflict (id) do nothing;

create policy "Public can view resource files" on storage.objects
  for select using (bucket_id = 'resources');

create policy "Staff can upload resource files" on storage.objects
  for insert with check (bucket_id = 'resources' and public.is_staff());

create policy "Staff can update resource files" on storage.objects
  for update using (bucket_id = 'resources' and public.is_staff());

create policy "Staff can delete resource files" on storage.objects
  for delete using (bucket_id = 'resources' and public.is_staff());
