"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import PageHeader from "@/components/PageHeader";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setStatus(error ? "error" : "sent");
  }

  return (
    <main>
      <PageHeader
        eyebrow="Admin"
        title="Sign in"
        lede="Enter your email and we'll send a sign-in link. No password to remember."
      />
      <div className="mx-auto max-w-[440px] px-5 py-14 md:px-14">
        {status === "sent" ? (
          <p className="text-slate">
            Check <strong className="text-ink">{email}</strong> for a sign-in
            link. You can close this tab.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-[14px] text-slate">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-rule bg-transparent px-4 py-3 outline-none focus-visible:border-brass"
                placeholder="you@stagemaster.org"
              />
            </div>
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full bg-ink px-6 py-3.5 text-[15px] font-medium text-paper transition-opacity hover:opacity-80 disabled:opacity-50"
            >
              {status === "sending" ? "Sending link..." : "Send sign-in link"}
            </button>
            {(status === "error" || urlError) && (
              <p className="text-[14px] text-red-700">
                {urlError ?? "Something went wrong sending the link. Try again."}
              </p>
            )}
          </form>
        )}
      </div>
    </main>
  );
}
