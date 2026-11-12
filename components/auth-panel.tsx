"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { LogIn, LogOut, UserRound, X } from "lucide-react";

export function AuthPanel() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const supabase = createClient();

  useEffect(() => {
    if (!supabase) return;
    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (alive) setSession(data.session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    return () => {
      alive = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setMessage("");
    const result = mode === "signin"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/auth/callback" }
        });
    setBusy(false);
    if (result.error) {
      setMessage(result.error.message);
      return;
    }
    if (mode === "signup" && !result.data.session) {
      setMessage("Account created. Check your email to confirm your address, then sign in.");
    } else {
      setMessage("You're signed in.");
      setOpen(false);
    }
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setMessage("You have signed out.");
  }

  if (!supabase) {
    return <span className="hidden rounded-lg border border-line px-3 py-2 text-xs text-muted sm:inline">Supabase setup needed</span>;
  }

  return (
    <>
      {session ? (
        <div className="flex items-center gap-2">
          <span className="hidden max-w-[170px] truncate text-xs text-muted sm:block">{session.user.email}</span>
          <button onClick={signOut} className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-xs font-medium text-ink hover:bg-canvas">
            <LogOut size={14}/> <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      ) : (
        <button onClick={() => { setOpen(true); setMessage(""); }} className="inline-flex items-center gap-2 rounded-lg bg-ink px-3 py-2 text-xs font-semibold text-white hover:bg-moss">
          <LogIn size={14}/> Sign in
        </button>
      )}
      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/40 p-4" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setOpen(false); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="auth-title" className="w-full max-w-[420px] rounded-2xl border border-line bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-moss-soft text-moss"><UserRound size={18}/></span><h2 id="auth-title" className="mt-4 text-xl font-semibold tracking-tight">{mode === "signin" ? "Welcome back" : "Create your account"}</h2><p className="mt-1 text-sm text-muted">Join your neighbourhood on WasteWise.</p></div>
              <button aria-label="Close" onClick={() => setOpen(false)} className="rounded-lg p-2 text-muted hover:bg-canvas"><X size={18}/></button>
            </div>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <label className="block text-xs font-medium text-muted">Email address<input required type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} className="mt-2 w-full rounded-lg border border-line px-3 py-3 text-sm text-ink outline-none focus:border-moss"/></label>
              <label className="block text-xs font-medium text-muted">Password<input required minLength={8} type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} value={password} onChange={event => setPassword(event.target.value)} className="mt-2 w-full rounded-lg border border-line px-3 py-3 text-sm text-ink outline-none focus:border-moss"/><span className="mt-1 block text-[10px] text-muted">At least 8 characters.</span></label>
              {message && <p role="status" className="rounded-lg bg-canvas p-3 text-xs leading-5 text-muted">{message}</p>}
              <button disabled={busy} className="w-full rounded-lg bg-ink px-4 py-3 text-sm font-semibold text-white hover:bg-moss disabled:opacity-60">{busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}</button>
            </form>
            <p className="mt-5 text-center text-xs text-muted">{mode === "signin" ? "New to WasteWise?" : "Already have an account?"} <button onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setMessage(""); }} className="font-semibold text-moss hover:underline">{mode === "signin" ? "Create an account" : "Sign in"}</button></p>
            <p className="mt-4 text-[10px] leading-4 text-muted">Your account is created through Supabase authentication. Locality membership and permissions are assigned separately.</p>
          </section>
        </div>
      )}
    </>
  );
}
