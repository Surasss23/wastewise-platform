"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { LogOut, Mail } from "lucide-react";
export function AuthPanel() {
 const [session,setSession]=useState<Session|null>(null); const supabase=createClient();
 useEffect(()=>{if(!supabase)return;let active=true;supabase.auth.getSession().then(({data})=>{if(active)setSession(data.session)});const {data:listener}=supabase.auth.onAuthStateChange((_event,next)=>setSession(next));return()=>{active=false;listener.subscription.unsubscribe()}},[supabase]);
 if(session)return <div className="flex h-10 items-center gap-3 rounded-xl border border-[#DDE4DA] bg-white px-3"><span className="hidden max-w-[180px] truncate text-xs text-[#647164] sm:block">{session.user.email}</span><Link href="/app" className="text-xs font-semibold text-[#526B55]">Workspace</Link><button onClick={()=>void supabase?.auth.signOut()} aria-label="Sign out" className="text-[#718071] hover:text-[#26392C]"><LogOut size={15}/></button></div>;
 return <Link href="/login" className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#26392C] px-4 text-xs font-semibold text-white transition hover:bg-[#3B5741]"><Mail size={14}/> Sign in</Link>;
}