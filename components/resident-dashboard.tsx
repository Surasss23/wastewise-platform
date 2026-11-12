"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, LayoutDashboard, Leaf, LogOut, Map, MessageSquare, ShieldCheck } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { LocalityMap } from "@/components/locality-map";
import { ReportForm } from "@/components/report-form";
import { CommunityFeed } from "@/components/community-feed";
import { WasteAnalyzer } from "@/components/waste-analyzer";

export function ResidentDashboard() {
  const supabase = createClient();
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return;
      setSession(data.session);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => { alive = false; listener.subscription.unsubscribe(); };
  }, [supabase]);

  async function signOut() {
    await supabase?.auth.signOut();
    router.replace("/");
  }

  if (loading) return <main className="grid min-h-screen place-items-center bg-[#F7F8F5] text-sm text-[#718071]">Loading your WasteWise workspace…</main>;
  if (!supabase || !session) return <main className="grid min-h-screen place-items-center bg-[#F7F8F5] px-5 text-[#26352A]"><section className="w-full max-w-md rounded-2xl border border-[#E2E8DF] bg-white p-7 text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF0E8] text-[#637A64]"><Leaf size={22}/></span><h1 className="mt-5 text-2xl font-semibold tracking-tight">Your neighbourhood workspace</h1><p className="mt-3 text-sm leading-6 text-[#778378]">{supabase ? "Sign in to access reports, the local map and community updates." : "Connect your Supabase project URL and publishable key to enable account access."}</p><Link href="/login" className="mt-6 inline-flex rounded-xl bg-[#26392C] px-5 py-3 text-xs font-semibold text-white">Continue to sign in</Link><Link href="/" className="mt-4 block text-xs text-[#7A887A]">Back to homepage</Link></section></main>;

  return <main className="min-h-screen bg-[#F7F8F5] text-[#26352A]">
    <header className="sticky top-0 z-30 border-b border-[#E5EAE2] bg-[#F7F8F5]/95 backdrop-blur"><div className="mx-auto flex h-[68px] max-w-[1320px] items-center justify-between px-4 sm:px-7"><Link href="/" className="flex items-center gap-2.5"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#26392C] text-white"><Leaf size={18}/></span><span className="text-sm font-semibold tracking-tight">wastewise<span className="text-[#829681]">.</span><span className="ml-2 text-[9px] font-medium uppercase tracking-widest text-[#8A958A]">Resident</span></span></Link><div className="flex items-center gap-3"><span className="hidden max-w-[220px] truncate text-[10px] text-[#7B867B] sm:block">{session.user.email}</span><button onClick={signOut} className="inline-flex items-center gap-2 rounded-lg border border-[#DDE4DA] px-3 py-2 text-[10px] font-semibold text-[#596B5B]"><LogOut size={13}/> Sign out</button></div></div></header>
    <div className="mx-auto max-w-[1320px] px-4 py-8 sm:px-7 sm:py-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><Link href="/" className="inline-flex items-center gap-1 text-[10px] text-[#849084] hover:text-[#526B55]"><ArrowLeft size={12}/> Homepage</Link><p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#829182]">Panjagutta · Hyderabad</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.055em] sm:text-4xl">Your local workspace.</h1><p className="mt-2 text-sm text-[#778378]">Report issues, see the neighbourhood map and share useful updates.</p></div><div className="flex items-center gap-2 rounded-xl border border-[#E1E7DE] bg-white px-3 py-2.5 text-[10px] text-[#738173]"><ShieldCheck size={14}/> Resident access is membership-verified</div></div>
      <div className="mt-8 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]"><section className="space-y-5"><div className="flex items-center gap-2 text-xs font-semibold"><Map size={15} className="text-[#708870]"/> Neighbourhood map</div><LocalityMap/><div id="report" className="flex items-center gap-2 pt-2 text-xs font-semibold"><LayoutDashboard size={15} className="text-[#708870}"/> Report a waste concern</div><ReportForm/></section><section className="space-y-5"><CommunityFeed/><div className="rounded-2xl border border-[#E2E8DF] bg-white p-5 sm:p-6"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#819081]">Waste sorting helper</p><h3 className="mt-1 text-lg font-semibold tracking-tight">Not sure where it goes?</h3><div className="mt-4"><WasteAnalyzer/></div></div><div className="rounded-xl bg-[#EDF2EA] p-4 text-[10px] leading-5 text-[#718071]">Map pins are temporary in this version. Collection schedules, partner locations and issue markers will appear only when verified records are available.</div></section></div>
      <footer className="mt-12 border-t border-[#E4E9E2] pt-5 text-[10px] text-[#929B91]">WasteWise · Made by Surya Narayana</footer>
    </div>
  </main>;
}
