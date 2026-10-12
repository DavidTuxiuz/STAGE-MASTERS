// Real access control: no session -> /login. Session but wrong role -> a
// plain "not authorized" message rather than a redirect loop. The actual
// enforcement for writes is the RLS policies in supabase/schema.sql — this
// check is for UX (showing the right screen), not the security boundary
// itself, per README.md "Adding real admin auth".

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";

const ALLOWED_ROLES = ["admin", "resource_person", "team_lead"];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?error=Sign in to access the admin area.");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, display_name")
    .eq("id", user.id)
    .single();

  if (!profile || !ALLOWED_ROLES.includes(profile.role)) {
    return (
      <main className="mx-auto max-w-[720px] px-5 py-20 md:px-14">
        <p className="mb-2 font-serif text-[24px]">Not authorized</p>
        <p className="text-slate">
          {user.email} is signed in but doesn&rsquo;t have an admin role yet.
          Ask an existing admin to update your role in the profiles table.
        </p>
        <div className="mt-6">
          <SignOutButton />
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="flex items-center justify-between border-b border-rule bg-paper-2 px-5 py-3 text-[13.5px] md:px-14">
        <span>
          Signed in as {profile.display_name ?? user.email} ({profile.role})
        </span>
        <SignOutButton />
      </div>
      {children}
    </main>
  );
}
