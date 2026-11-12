"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Leaf, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup" | "reset";

export function AuthPage() {
  const supabase = createClient();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/");
    });
  }, [supabase, router, searchParams]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) {
      setError("Authentication is not configured. Add the Supabase project URL and publishable key to your deployment environment.");
      return;
    }
    setBusy(true);
    setError("");
    setMessage("");
    try {
      if (mode === "signin") {
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw authError;
        router.replace(searchParams.get("next") || "/");
        router.refresh();
      } else if (mode === "signup") {
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/auth/callback" }
        });
        if (authError) throw authError;
        if (data.session) {
          router.replace("/");
          router.refresh();
        } else {
          setMessage("Account created. Check your inbox for the confirmation link, then return here to sign in.");
        }
      } else {
        const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + "/auth/callback?next=/reset-password"
        });
        if (authError) throw authError;
        setMessage("If an account exists for this email, a password reset link has been sent.");
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const heading = mode === "signin" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset your password";

  return (
    <main className="min-h-screen bg-[#F7F8F5] px-4 py-8 text-[#202820] sm:grid sm:place-items-center">
      <div className="mx-auto w-full max-w-[440px]">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-xs font-medium text-[#68766A] hover:text-[#26392C]"><ArrowLeft size={14}/> Back to WasteWise</Link>
        <section className="rounded-[24px] border border-[#E2E8DF] bg-white p-6 shadow-[0_18px_60px_rgba(37,53,40,0.07)] sm:p-9">
          <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#26392C] text-white"><Leaf size={21}/></div>
          <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#809080]">WasteWise account</p>
          <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.055em]">{heading}</h1>
          <p className="mt-2 text-[12px] leading-6 text-[#7B867B]">{mode === "reset" ? "Enter the email address linked to your account." : "Sign in to take part in your neighbourhood."}</p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            <label className="block text-[11px] font-semibold text-[#5F6D60]">Email address
              <input required type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="mt-2 w-full rounded-xl border border-[#E1E7DE] bg-white px-3.5 py-3.5 text-sm text-[#344237] outline-none focus:border-[#829681]"/>
            </label>
            {mode !== "reset" && <label className="block text-[11px] font-semibold text-[#5F6D60]">Password
              <input required minLength={8} type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" className="mt-2 w-full rounded-xl border border-[#E1E7DE] bg-white px-3.5 py-3.5 text-sm text-[#344237] outline-none focus:border-[#829681]"/>
            </label>}
            {error && <p role="alert" className="rounded-xl border border-red-100 bg-red-50 p-3 text-[11px] leading-5 text-red-700">{error}</p>}
            {message && <p role="status" className="rounded-xl border border-[#DDE7DB] bg-[#F0F5EF] p-3 text-[11px] leading-5 text-[#5E755F]">{message}</p>}
            <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#26392C] px-4 py-3.5 text-[12px] font-semibold text-white transition hover:bg-[#3B5741] disabled:opacity-60">{busy && <Loader2 size={14} className="animate-spin"/>}{busy ? "Please wait…" : mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}</button>
          </form>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-[11px]">
            {mode === "signin" ? <><button onClick={() => { setMode("signup"); setMessage(""); setError(""); }} className="font-semibold text-[#526B55] hover:underline">Create an account</button><button onClick={() => { setMode("reset"); setMessage(""); setError(""); }} className="text-[#788478] hover:underline">Forgot password?</button></> : <button onClick={() => { setMode("signin"); setMessage(""); setError(""); }} className="font-semibold text-[#526B55] hover:underline">Back to sign in</button>}
          </div>
          <p className="mt-7 border-t border-[#EDF0EB] pt-5 text-[10px] leading-5 text-[#929B91]">Creating an account does not automatically verify your locality membership or grant operational permissions.</p>
        </section>
      </div>
    </main>
  );
}
