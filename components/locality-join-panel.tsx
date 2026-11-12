"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Clock3, MapPin, ShieldCheck } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

type MembershipState = "loading" | "signed_out" | "not_requested" | "pending" | "verified" | "error";

export function LocalityJoinPanel() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [state, setState] = useState<MembershipState>(supabase ? "loading" : "error");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const loadMembership = useCallback(async (activeUser: User | null) => {
    if (!supabase) {
      setState("error");
      setMessage("Supabase is not configured yet.");
      return;
    }
    if (!activeUser) {
      setState("signed_out");
      return;
    }
    const { data: locality, error: localityError } = await supabase
      .from("localities")
      .select("id")
      .eq("name", "Panjagutta")
      .eq("city", "Hyderabad")
      .eq("is_active", true)
      .maybeSingle();

    if (localityError || !locality) {
      setState("error");
      setMessage("The Panjagutta pilot locality is not available yet. Please try again later.");
      return;
    }

    const { data: membership, error } = await supabase
      .from("locality_memberships")
      .select("verified_at")
      .eq("locality_id", locality.id)
      .eq("user_id", activeUser.id)
      .maybeSingle();

    if (error) {
      setState("error");
      setMessage("We couldn't check your membership. Please refresh and try again.");
      return;
    }
    setState(!membership ? "not_requested" : membership.verified_at ? "verified" : "pending");
  }, [supabase]);

  useEffect(() => {
    if (!supabase) return;
    let alive = true;
    supabase.auth.getUser().then(({ data }) => {
      if (alive) setUser(data.user);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      // Keep this callback synchronous: Supabase auth callbacks share an internal
      // lock, so database queries must run in a separate effect.
      if (alive) setUser(session?.user ?? null);
    });
    return () => {
      alive = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    void loadMembership(user);
  }, [user, loadMembership]);

  async function requestAccess() {
    if (!supabase || !user) {
      setMessage("Please sign in first, then request locality access.");
      return;
    }
    setBusy(true);
    setMessage("");
    const { data: locality, error: localityError } = await supabase
      .from("localities")
      .select("id")
      .eq("name", "Panjagutta")
      .eq("city", "Hyderabad")
      .eq("is_active", true)
      .single();

    if (localityError || !locality) {
      setBusy(false);
      setMessage("The Panjagutta pilot locality could not be found.");
      return;
    }

    const { error } = await supabase.from("locality_memberships").insert({
      locality_id: locality.id,
      user_id: user.id,
      membership_role: "resident"
    });
    setBusy(false);
    if (error) {
      if (error.code === "23505") {
        await loadMembership(user);
        return;
      }
      setMessage(error.message.includes("row-level security")
        ? "Membership requests are not enabled yet. Apply the latest Supabase membership migration."
        : "Your request could not be submitted. Please try again.");
      return;
    }
    setState("pending");
    setMessage("Your request has been submitted. A locality administrator must verify it before resident features are enabled.");
  }

  return (
    <div className="mt-7 rounded-[18px] border border-[#E1E8DE] bg-[#F8FAF7] p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF0E8] text-[#637A64]"><MapPin size={17}/></span>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-semibold text-[#354437]">Join the Panjagutta pilot</p>
          <p className="mt-1 text-[10px] leading-5 text-[#7D897E]">Request resident access. Membership is reviewed separately to keep locality information trustworthy.</p>
        </div>
      </div>
      {state === "loading" && <p className="mt-4 text-[10px] text-[#7D897E]">Checking your membership…</p>}
      {state === "signed_out" && <p className="mt-4 text-[10px] leading-5 text-[#7D897E]">Sign in or create an account using the button at the top of the page, then return here to request access.</p>}
      {state === "not_requested" && <button type="button" onClick={requestAccess} disabled={busy} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#26392C] px-4 py-3 text-[10px] font-semibold text-white transition hover:bg-[#3B5741] disabled:opacity-60">{busy ? "Submitting…" : "Request resident access"} <ShieldCheck size={14}/></button>}
      {state === "pending" && <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#E9E1CE] bg-[#FAF7EF] px-3 py-3 text-[10px] text-[#806C45]"><Clock3 size={15}/> Membership pending verification</div>}
      {state === "verified" && <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#DCE8DA] bg-[#F0F5EF] px-3 py-3 text-[10px] text-[#5D775D]"><CheckCircle2 size={15}/> Your Panjagutta membership is verified</div>}
      {message && <p role="status" className="mt-3 text-[10px] leading-5 text-[#788478]">{message}</p>}
      <p className="mt-3 text-[9px] leading-4 text-[#98A198]">Requesting access does not grant manager, collector or administrator permissions.</p>
    </div>
  );
}
