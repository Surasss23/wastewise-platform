"use client";

import { useState } from "react";
import {
  Activity, Bell, CalendarDays, ChevronDown, CircleHelp, ClipboardList,
  House, Leaf, MapPinned, Menu, MessageSquareText, Recycle, Search, Settings2,
  ShieldCheck, X, MapPin
} from "lucide-react";
import { WasteAnalyzer } from "@/components/waste-analyzer";

const nav = [
  { label: "Overview", href: "#overview", icon: House },
  { label: "Report an issue", href: "#report", icon: ClipboardList },
  { label: "Collection schedule", href: "#schedule", icon: CalendarDays },
  { label: "Community", href: "#community", icon: MessageSquareText },
  { label: "Waste map", href: "#map", icon: MapPinned },
  { label: "Recycling directory", href: "#recycling", icon: Recycle }
];

function SectionTitle({ eyebrow, title, action }: { eyebrow: string; title: string; action?: string }) {
  return <div className="mb-4 flex items-end justify-between gap-3"><div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-moss">{eyebrow}</p><h2 className="mt-1 text-lg font-semibold tracking-tight">{title}</h2></div>{action && <span className="text-xs text-muted">{action}</span>}</div>;
}

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [reportType, setReportType] = useState("Missed collection");
  const [reportText, setReportText] = useState("");
  const [reportSent, setReportSent] = useState(false);
  const [communityFilter, setCommunityFilter] = useState("All updates");

  function submitReport(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setReportSent(true);
    setReportText("");
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <a href="#overview" className="flex items-center gap-3 px-6 py-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-white"><Leaf size={19}/></span>
        <span><span className="block text-[17px] font-bold tracking-tight">wastewise</span><span className="block text-[10px] tracking-[0.12em] text-muted">CLEANER, TOGETHER</span></span>
      </a>
      <div className="px-4"><div className="rounded-xl border border-line bg-canvas p-3"><p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Your locality</p><button className="mt-1 flex w-full items-center justify-between text-sm font-semibold"><span className="flex items-center gap-2"><MapPin size={14} className="text-moss"/> Hyderabad pilot</span><ChevronDown size={15} className="text-muted"/></button><p className="mt-1 text-[11px] text-muted">Locality setup coming next</p></div></div>
      <p className="px-6 pb-2 pt-7 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9AA39B]">Workspace</p>
      <nav className="space-y-1 px-3">{nav.map(({ label, href, icon: Icon }, i) => <a key={label} onClick={() => setMobileOpen(false)} href={href} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] transition ${i === 0 ? "bg-moss-soft font-semibold text-ink" : "text-muted hover:bg-canvas hover:text-ink"}`}><Icon size={17} strokeWidth={1.8}/>{label}</a>)}</nav>
      <div className="mt-auto border-t border-line p-4"><div className="flex items-center gap-3 rounded-xl p-2"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E9EDE8] text-xs font-bold text-moss">WW</span><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">Neighbourhood member</p><p className="text-[10px] text-muted">Guest preview</p></div><Settings2 size={16} className="text-muted"/></div><p className="px-2 pt-2 text-[10px] leading-4 text-muted">Sign-in and role permissions will be enabled with Supabase.</p></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-canvas">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[252px] border-r border-line bg-white lg:block">{sidebar}</aside>
      {mobileOpen && <div className="fixed inset-0 z-50 lg:hidden"><button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="absolute inset-0 bg-black/30"/><aside className="absolute inset-y-0 left-0 w-[285px] bg-white shadow-xl">{sidebar}<button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="absolute right-4 top-6 text-muted"><X size={19}/></button></aside></div>}
      <main className="lg:pl-[252px]">
        <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-line bg-white/90 px-4 backdrop-blur sm:px-7">
          <div className="flex items-center gap-3"><button aria-label="Open menu" onClick={() => setMobileOpen(true)} className="rounded-lg p-2 hover:bg-canvas lg:hidden"><Menu size={19}/></button><div><p className="text-xs text-muted">Thursday, 12 November 2026</p><p className="text-sm font-semibold">Neighbourhood overview</p></div></div>
          <div className="flex items-center gap-2"><span className="hidden items-center gap-2 rounded-full border border-line px-3 py-2 text-xs text-muted sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-[#9BA69D]"/> Preview environment</span><button aria-label="Notifications" className="relative rounded-lg border border-line p-2 text-muted"><Bell size={17}/><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-moss"/></button><span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-[10px] font-semibold text-white">G</span></div>
        </header>

        <div className="mx-auto max-w-[1440px] px-4 py-7 sm:px-7 sm:py-9">
          <section id="overview" className="scroll-mt-24">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-moss">Community dashboard</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-[38px]">A cleaner block starts here.</h1><p className="mt-2 max-w-xl text-sm leading-6 text-muted">Report local waste issues, learn how to sort better, and keep your neighbourhood in the loop.</p></div><a href="#report" className="inline-flex w-fit items-center gap-2 rounded-lg bg-ink px-4 py-3 text-xs font-semibold text-white transition hover:bg-moss">Report an issue <ClipboardList size={15}/></a></div>
            <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[{label:"Open community reports",value:"—",note:"Live after setup",icon:ClipboardList},{label:"Collection reliability",value:"—",note:"Needs verified schedules",icon:Activity},{label:"Active neighbourhoods",value:"01",note:"Hyderabad pilot",icon:MapPinned},{label:"Waste diverted",value:"—",note:"Tracked after verification",icon:Leaf}].map(({label,value,note,icon:Icon})=><article key={label} className="rounded-2xl border border-line bg-white p-4"><div className="flex items-center justify-between"><span className="text-xs text-muted">{label}</span><Icon size={17} className="text-moss"/></div><p className="mt-4 text-2xl font-semibold tracking-tight">{value}</p><p className="mt-1 text-[11px] text-muted">{note}</p></article>)}
            </div>
          </section>

          <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(310px,0.8fr)]">
            <div className="space-y-5">
              <WasteAnalyzer/>
              <section id="report" className="scroll-mt-24 rounded-2xl border border-line bg-white p-5 shadow-soft sm:p-6">
                <SectionTitle eyebrow="Community action" title="Report a waste issue" action="Preview form"/>
                {reportSent && <div role="status" className="mb-4 rounded-lg border border-[#DCE7DC] bg-[#F1F6F1] p-3 text-xs text-[#45634D]">Your report has been captured in this preview. Connect Supabase to submit it to the community queue.</div>}
                <form onSubmit={submitReport} className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2"><label className="text-xs font-medium text-muted">Issue type<select value={reportType} onChange={e=>setReportType(e.target.value)} className="mt-2 w-full rounded-lg border border-line bg-white px-3 py-3 text-sm text-ink outline-none focus:border-moss"><option>Missed collection</option><option>Garbage pile / hotspot</option><option>Overflowing bin</option><option>Illegal dumping</option><option>Segregation concern</option></select></label><label className="text-xs font-medium text-muted">Locality / landmark<input required placeholder="e.g. Street, apartment or landmark" className="mt-2 w-full rounded-lg border border-line px-3 py-3 text-sm text-ink outline-none focus:border-moss"/></label></div>
                  <label className="block text-xs font-medium text-muted">What happened?<textarea required value={reportText} onChange={e=>setReportText(e.target.value)} rows={3} placeholder="Add useful details so the right person can act..." className="mt-2 w-full resize-y rounded-lg border border-line px-3 py-3 text-sm text-ink outline-none focus:border-moss"/></label>
                  <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-[11px] text-muted">Photo upload, GPS pin and anonymous reporting arrive with backend setup.</p><button className="rounded-lg bg-moss px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#45634D]">Save preview report</button></div>
                </form>
              </section>
              <section id="community" className="scroll-mt-24 rounded-2xl border border-line bg-white p-5 shadow-soft sm:p-6">
                <SectionTitle eyebrow="Neighbourhood pulse" title="Community updates" action="Sample content"/>
                <div className="mb-4 flex flex-wrap gap-2">{["All updates","Reports","Recycling","Tips"].map(filter=><button key={filter} onClick={()=>setCommunityFilter(filter)} className={`rounded-full px-3 py-2 text-xs ${communityFilter===filter?"bg-ink text-white":"border border-line text-muted hover:text-ink"}`}>{filter}</button>)}</div>
                <div className="space-y-3">{[
                  {type:"Reports",title:"Keep the lane near the market clear",body:"A reminder to keep household waste tied and separated before collection.",time:"Community note",tag:"Street cleanliness",initial:"RK"},
                  {type:"Recycling",title:"Separate clean cardboard",body:"Flatten dry cardboard and keep it away from food waste so it can be recovered.",time:"WasteWise guide",tag:"Dry waste",initial:"WW"},
                  {type:"Tips",title:"Small change: keep a wet-waste container",body:"A covered kitchen container can make daily segregation easier and cleaner.",time:"WasteWise guide",tag:"Daily habit",initial:"AM"}
                ].filter(post=>communityFilter==="All updates"||post.type===communityFilter).map(post=><article key={post.title} className="flex gap-3 rounded-xl border border-line p-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-canvas text-[10px] font-bold text-moss">{post.initial}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-semibold">{post.title}</h3><span className="rounded-full bg-canvas px-2 py-1 text-[10px] text-muted">{post.tag}</span></div><p className="mt-1 text-xs leading-5 text-muted">{post.body}</p><p className="mt-2 text-[10px] text-[#9AA39B]">{post.time}</p></div></article>)}</div>
                <p className="mt-3 text-[11px] text-muted">Posting, comments, reactions and moderation will be enabled after sign-in and database setup.</p>
              </section>
            </div>

            <div className="space-y-5">
              <section id="schedule" className="scroll-mt-24 rounded-2xl border border-line bg-white p-5 shadow-soft">
                <SectionTitle eyebrow="Plan ahead" title="Collection schedule"/>
                <div className="rounded-xl bg-canvas p-4"><div className="flex items-center justify-between"><span className="text-xs font-semibold">Your collection calendar</span><CalendarDays size={17} className="text-moss"/></div><p className="mt-3 text-2xl font-semibold">Not configured</p><p className="mt-1 text-xs leading-5 text-muted">A verified locality manager must publish collection days and available pickup slots.</p></div>
                <div className="mt-4 space-y-3 text-xs"><div className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-moss"/><span className="text-muted">Wet / dry waste schedules</span><span className="ml-auto text-[10px] text-muted">Pending</span></div><div className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-[#B4A38C]"/><span className="text-muted">Missed pickup reporting</span><span className="ml-auto text-[10px] text-muted">Planned</span></div></div>
              </section>
              <section id="map" className="scroll-mt-24 overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
                <div className="p-5 pb-3"><SectionTitle eyebrow="See what is happening" title="Waste map"/></div>
                <div className="relative flex h-[210px] items-center justify-center overflow-hidden bg-[#E9EDE8]">
                  <div className="absolute inset-0 opacity-50" style={{backgroundImage:"linear-gradient(35deg, transparent 46%, #CAD3CA 47%, #CAD3CA 49%, transparent 50%),linear-gradient(120deg, transparent 45%, #D2DAD1 46%, #D2DAD1 48%, transparent 49%)",backgroundSize:"85px 70px"}}/>
                  <div className="relative flex flex-col items-center rounded-xl border border-white/70 bg-white/90 px-4 py-3 text-center shadow-soft"><MapPinned size={22} className="text-moss"/><p className="mt-2 text-xs font-semibold">Local map is not connected</p><p className="mt-1 text-[10px] text-muted">OpenStreetMap layer will be added</p></div>
                </div>
                <div className="flex items-center justify-between p-4"><span className="text-xs text-muted">Reports · collection points · recyclers</span><span className="rounded-full bg-canvas px-2 py-1 text-[10px] text-muted">Coming next</span></div>
              </section>
              <section id="recycling" className="scroll-mt-24 rounded-2xl border border-line bg-white p-5 shadow-soft">
                <SectionTitle eyebrow="Give materials another life" title="Recycling directory"/>
                <div className="flex gap-3 rounded-xl bg-canvas p-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-moss"><Recycle size={18}/></span><div><p className="text-xs font-semibold">Verified local partners</p><p className="mt-1 text-[11px] leading-5 text-muted">Recycler and e-waste partner listings will appear here after verification.</p></div></div>
                <p className="mt-3 text-[11px] text-muted">No unverified addresses or opening hours are displayed.</p>
              </section>
              <div className="rounded-2xl border border-[#DFE7DF] bg-[#EFF3EF] p-5"><div className="flex items-center gap-2 text-moss"><ShieldCheck size={17}/><p className="text-xs font-semibold">Built around trust</p></div><p className="mt-2 text-xs leading-5 text-[#657168]">Reports and collection updates should be verified. WasteWise will not claim municipal affiliation or promise pickups without an authorised local partner.</p></div>
            </div>
          </div>
          <footer className="mt-9 flex flex-col justify-between gap-2 border-t border-line py-5 text-[10px] text-muted sm:flex-row"><span>© 2026 WasteWise · Community-first waste management</span><span>Hyderabad pilot · Built for cleaner neighbourhoods</span></footer>
        </div>
      </main>
    </div>
  );
}
