"use client";

import { useCallback, useEffect, useState } from "react";
import { MessageCircle, Send, RefreshCw } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Post = { id: string; title: string; body: string; post_type: string; created_at: string; author_id: string | null };

export function CommunityFeed() {
  const supabase = createClient();
  const [posts, setPosts] = useState<Post[]>([]);
  const [localityId, setLocalityId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("Loading community updates…");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!supabase) { setStatus("Supabase is not configured."); return; }
    const { data: auth } = await supabase.auth.getUser();
    const uid = auth.user?.id ?? null;
    setUserId(uid);
    if (!uid) { setStatus("Sign in to view locality community updates."); return; }
    const { data: locality } = await supabase.from("localities").select("id").eq("name", "Panjagutta").eq("city", "Hyderabad").eq("is_active", true).maybeSingle();
    if (!locality) { setStatus("The Panjagutta pilot locality is not available in the database."); return; }
    setLocalityId(locality.id);
    const { data: membership } = await supabase.from("locality_memberships").select("verified_at").eq("locality_id", locality.id).eq("user_id", uid).maybeSingle();
    const isVerified = Boolean(membership?.verified_at);
    setVerified(isVerified);
    if (!isVerified) { setPosts([]); setStatus("Community posts are available to verified Panjagutta members."); return; }
    const { data, error } = await supabase.from("community_posts").select("id,title,body,post_type,created_at,author_id").eq("locality_id", locality.id).eq("is_published", true).order("created_at", { ascending: false }).limit(30);
    if (error) { setStatus("Could not load community updates. Check database access."); return; }
    setPosts((data ?? []) as Post[]);
    setStatus(data?.length ? "" : "No community posts yet. Start with a useful local update.");
  }, [supabase]);

  useEffect(() => { void load(); }, [load]);

  async function publish(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !userId || !localityId || !verified || !title.trim() || !body.trim()) return;
    setBusy(true);
    const { error } = await supabase.from("community_posts").insert({ locality_id: localityId, author_id: userId, post_type: "update", title: title.trim(), body: body.trim(), is_published: true });
    setBusy(false);
    if (error) { setStatus("Your post could not be published. Please try again."); return; }
    setTitle(""); setBody(""); setStatus("Your update was published."); await load();
  }

  return <section className="rounded-2xl border border-[#E2E8DF] bg-white p-5 sm:p-6">
    <div className="flex items-center justify-between gap-3"><div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#819081]">Local voices</p><h3 className="mt-1 text-lg font-semibold tracking-tight text-[#26352A]">Community feed</h3></div><button type="button" onClick={() => void load()} className="rounded-lg border border-[#E1E7DE] p-2 text-[#6B7C6B]" aria-label="Refresh feed"><RefreshCw size={14}/></button></div>
    {verified && <form onSubmit={publish} className="mt-5 space-y-3 rounded-xl bg-[#F6F8F4] p-4">
      <input value={title} onChange={e => setTitle(e.target.value)} maxLength={100} required placeholder="Give your update a title" className="w-full rounded-lg border border-[#E1E7DE] bg-white px-3 py-2.5 text-xs outline-none focus:border-[#829681]"/>
      <textarea value={body} onChange={e => setBody(e.target.value)} maxLength={1500} required rows={3} placeholder="Share a useful neighbourhood update, tip or observation…" className="w-full resize-y rounded-lg border border-[#E1E7DE] bg-white px-3 py-2.5 text-xs outline-none focus:border-[#829681]"/>
      <div className="flex justify-end"><button disabled={busy} className="inline-flex items-center gap-2 rounded-lg bg-[#26392C] px-4 py-2.5 text-[10px] font-semibold text-white disabled:opacity-50"><Send size={13}/>{busy ? "Publishing…" : "Publish update"}</button></div>
    </form>}
    {status && <p role="status" className="mt-4 rounded-lg bg-[#F5F7F3] p-3 text-[11px] leading-5 text-[#778378]">{status}</p>}
    <div className="mt-4 space-y-3">{posts.map(post => <article key={post.id} className="rounded-xl border border-[#E9EDE7] p-4"><div className="flex items-center justify-between gap-2"><span className="rounded-full bg-[#EEF3EC] px-2.5 py-1 text-[9px] font-semibold capitalize text-[#657B65]">{post.post_type}</span><time className="text-[9px] text-[#929B91]">{new Date(post.created_at).toLocaleString()}</time></div><h4 className="mt-3 text-sm font-semibold text-[#344237]">{post.title}</h4><p className="mt-2 whitespace-pre-wrap text-xs leading-6 text-[#718071]">{post.body}</p></article>)}</div>
    <p className="mt-4 flex items-center gap-2 text-[9px] leading-4 text-[#9AA39A]"><MessageCircle size={12}/> Posts are limited by Supabase locality membership and row-level security.</p>
  </section>;
}
