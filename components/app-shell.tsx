"use client";

import { useState } from "react";
import {
  ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronRight, CircleHelp,
  ClipboardList, Compass, Leaf, MapPin, Menu, Recycle, ShieldCheck,
  Sparkles, Trash2, Truck, X, Sprout, Users, Waves, Workflow
} from "lucide-react";
import { AuthPanel } from "@/components/auth-panel";
import { WasteAnalyzer } from "@/components/waste-analyzer";
import { LocalityJoinPanel } from "@/components/locality-join-panel";

const areas = ["Panjagutta", "Somajiguda", "Ameerpet", "Khairatabad"];

const steps = [
  { number: "01", icon: ClipboardList, title: "Spot something. Report it.", text: "Share a waste concern with a location and a short description. Add a photo when the reporting flow is enabled." },
  { number: "02", icon: Workflow, title: "The right people follow up.", text: "Reports move through a clear status trail so residents can understand what has been received, reviewed and assigned." },
  { number: "03", icon: Sprout, title: "Build better everyday habits.", text: "Use practical sorting guidance, learn collection updates when verified, and keep useful local knowledge in one place." }
];

const features = [
  { icon: ClipboardList, title: "Issue reporting", text: "A simple, structured way to flag overflowing bins, missed collection and dumping hotspots." },
  { icon: Waves, title: "Clear status updates", text: "A visible process from submitted to resolved, with an event history for accountability." },
  { icon: CalendarDaysIcon, title: "Collection information", text: "A single place for verified schedules and pickup requests—never guessed timings." },
  { icon: Recycle, title: "Waste sorting guide", text: "Understand what belongs where and how to prepare materials before disposal." },
  { icon: MapPin, title: "Neighbourhood view", text: "Bring reports and verified services into a map-based local picture." },
  { icon: Users, title: "Community knowledge", text: "Share useful updates, practical tips and local recycling information." }
];

function CalendarDaysIcon({ className }: { className?: string }) {
  return <Compass className={className} size={19} strokeWidth={1.7}/>;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#718273]">{children}</p>;
}

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeArea, setActiveArea] = useState("Panjagutta");
  const [issueType, setIssueType] = useState("Overflowing bin");
  const [issueNote, setIssueNote] = useState("");
  const [previewMessage, setPreviewMessage] = useState("");

  function submitPreview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPreviewMessage("This is a demonstration only. Sign-in, locality verification and the live reporting workflow are the next activation steps.");
    setIssueNote("");
  }

  const links = [
    ["How it works", "#how-it-works"],
    ["What you can do", "#features"],
    ["Waste guide", "#waste-guide"],
    ["Pilot area", "#pilot"]
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#F7F8F5] text-[#202820]">
      <header className="relative z-40 border-b border-[#E6E9E3] bg-[#F7F8F5]/95 backdrop-blur">
        <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between px-5 sm:px-8">
          <a href="#top" className="flex items-center gap-3" aria-label="WasteWise home">
            <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#24362A] text-[#E8F0E7]"><Leaf size={20} strokeWidth={1.8}/></span>
            <span><span className="block text-[17px] font-semibold tracking-[-0.04em]">wastewise<span className="text-[#849483]">.</span></span><span className="mt-0.5 block text-[9px] font-medium uppercase tracking-[0.19em] text-[#89938A]">Better habits. Cleaner places.</span></span>
          </a>
          <nav className="hidden items-center gap-8 lg:flex">
            {links.map(([label, href]) => <a key={label} href={href} className="text-[12px] font-medium text-[#68736A] transition hover:text-[#24362A]">{label}</a>)}
          </nav>
          <div className="hidden items-center gap-3 sm:flex">
            <span className="hidden rounded-full border border-[#DDE4DB] px-3 py-2 text-[10px] font-medium text-[#68736A] xl:inline-flex"><span className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-[#8DA18C]"/> Hyderabad pilot concept</span>
            <AuthPanel/>
          </div>
          <button aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)} className="rounded-xl border border-[#E2E7E0] p-2.5 text-[#344337] lg:hidden">{menuOpen ? <X size={18}/> : <Menu size={18}/>}</button>
        </div>
        {menuOpen && <div className="absolute left-0 right-0 top-full border-b border-[#E6E9E3] bg-[#F7F8F5] p-5 shadow-lg lg:hidden"><nav className="mx-auto flex max-w-[1240px] flex-col gap-4">{links.map(([label, href]) => <a key={label} href={href} onClick={() => setMenuOpen(false)} className="text-sm text-[#536156]">{label}</a>)}<div className="pt-1"><AuthPanel/></div></nav></div>}
      </header>

      <section id="top" className="relative">
        <div className="pointer-events-none absolute -right-40 -top-44 h-[560px] w-[560px] rounded-full border border-[#E7EBE4]"/>
        <div className="pointer-events-none absolute -right-16 -top-20 h-[390px] w-[390px] rounded-full border border-[#E7EBE4]"/>
        <div className="mx-auto grid max-w-[1240px] gap-14 px-5 pb-20 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-[1.04fr_0.96fr] lg:items-center lg:gap-10 lg:pb-28">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#DDE5DB] bg-white/70 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#637564]"><span className="h-1.5 w-1.5 rounded-full bg-[#819981]"/> A neighbourhood-first platform</div>
            <h1 className="mt-7 max-w-[650px] text-[43px] font-semibold leading-[1.06] tracking-[-0.065em] sm:text-[58px] lg:text-[68px]">Waste is a shared problem.<br/><span className="text-[#7B8E7B]">Let’s make it</span> a shared effort.</h1>
            <p className="mt-6 max-w-[510px] text-[14px] leading-7 text-[#6C776D] sm:text-[15px]">WasteWise brings neighbourhood reporting, practical waste-sorting guidance and verified local updates into one calm, useful place.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#report" className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#26392C] px-5 py-3.5 text-[12px] font-semibold text-white shadow-[0_8px_22px_rgba(35,55,41,0.12)] transition hover:-translate-y-0.5 hover:bg-[#3B5741]">Explore the platform <ArrowUpRight size={15}/></a>
              <a href="#how-it-works" className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#DDE3DA] bg-white/70 px-5 py-3.5 text-[12px] font-semibold text-[#47564A] transition hover:bg-white">See how it works <ArrowDown size={14}/></a>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[#E5E9E2] pt-6 text-[10px] font-medium text-[#89938A]"><span className="flex items-center gap-2"><ShieldCheck size={14}/> Community-led</span><span className="flex items-center gap-2"><Leaf size={14}/> Practical by design</span><span className="flex items-center gap-2"><Compass size={14}/> Starting in Hyderabad</span></div>
          </div>
          <div className="relative z-10 mx-auto w-full max-w-[540px]">
            <div className="absolute -inset-5 rounded-[34px] bg-[#E9EEE7] blur-2xl"/>
            <div className="relative rounded-[26px] border border-[#E1E7DE] bg-white p-4 shadow-[0_24px_80px_rgba(37,53,40,0.10)] sm:p-5">
              <div className="flex items-center justify-between border-b border-[#EEF0EC] px-1 pb-4"><div><p className="text-[10px] font-medium text-[#879187]">WASTEWISE / LOCAL VIEW</p><p className="mt-1 text-[14px] font-semibold tracking-tight">Neighbourhood snapshot</p></div><span className="rounded-full bg-[#F0F4EF] px-3 py-1.5 text-[9px] font-semibold text-[#657C66]">Pilot concept</span></div>
              <div className="mt-4 rounded-[18px] bg-[#F1F4EF] p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3"><div><p className="text-[10px] text-[#7D887D]">PILOT AREA</p><p className="mt-1 text-[20px] font-semibold tracking-[-0.04em]">Panjagutta, Hyderabad</p><p className="mt-1 text-[10px] text-[#849084]">Proposed neighbourhood coverage</p></div><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#607760]"><MapPin size={17}/></span></div>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-[#E5EAE2] bg-white p-3"><p className="text-[9px] text-[#8A958A]">REPORTS</p><p className="mt-2 text-[22px] font-semibold">—</p><p className="mt-0.5 text-[9px] text-[#8A958A]">Awaiting live data</p></div>
                  <div className="rounded-xl border border-[#E5EAE2] bg-white p-3"><p className="text-[9px] text-[#8A958A]">COLLECTION</p><p className="mt-2 text-[22px] font-semibold">—</p><p className="mt-0.5 text-[9px] text-[#8A958A]">Schedule not verified</p></div>
                </div>
                <div className="mt-3 rounded-xl border border-[#E5EAE2] bg-white p-3.5"><div className="flex items-center justify-between"><p className="text-[10px] font-semibold">Pilot neighbourhoods</p><span className="text-[9px] text-[#929B91]">Planned coverage</span></div><div className="mt-3 flex flex-wrap gap-1.5">{areas.map(area=><span key={area} className="rounded-full bg-[#F0F4EF] px-2.5 py-1.5 text-[9px] font-medium text-[#607460]">{area}</span>)}</div></div>
              </div>
              <div className="mt-4 flex items-center justify-between px-1"><div className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EDF2EB] text-[#6B806B]"><Sprout size={14}/></span><span className="text-[10px] text-[#7B867C]">Small actions. Visible progress.</span></div><span className="text-[9px] font-medium text-[#8B968C]">01 / 04</span></div>
            </div>
            <p className="relative mt-4 text-center text-[9px] text-[#9AA39A]">Illustrative interface · No live municipal data connected yet</p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-y border-[#E6EAE4] bg-white">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 lg:py-24">
          <div className="max-w-[620px]"><SectionLabel>A simple process</SectionLabel><h2 className="mt-4 text-[32px] font-semibold leading-tight tracking-[-0.055em] sm:text-[42px]">From noticing a problem<br className="hidden sm:block"/> to making progress.</h2><p className="mt-4 text-[13px] leading-7 text-[#748075]">A useful waste system should make the next step obvious—for residents, local teams and community partners.</p></div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">{steps.map((step,index)=>{const Icon=step.icon;return <article key={step.number} className="relative rounded-[20px] border border-[#E7EBE5] bg-[#FBFCFA] p-6 sm:p-7"><div className="flex items-center justify-between"><span className="text-[11px] font-semibold tracking-[0.15em] text-[#98A398]">{step.number} / 03</span><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF0E8] text-[#617761]"><Icon size={19} strokeWidth={1.7}/></span></div><h3 className="mt-8 text-[17px] font-semibold tracking-tight">{step.title}</h3><p className="mt-3 text-[12px] leading-6 text-[#778278]">{step.text}</p>{index<2&&<div className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 items-center justify-center rounded-full border border-[#E7EBE5] bg-white text-[#829082] md:flex"><ChevronRight size={13}/></div>}</article>})}</div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 lg:py-24">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><SectionLabel>One connected neighbourhood toolkit</SectionLabel><h2 className="mt-4 max-w-[600px] text-[32px] font-semibold leading-tight tracking-[-0.055em] sm:text-[42px]">The right tools for<br/>everyday waste challenges.</h2></div><p className="max-w-[330px] text-[12px] leading-6 text-[#788378]">Designed around clear information, responsible reporting and local participation—not another noisy social feed.</p></div>
        <div className="mt-11 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{features.map(({icon:Icon,title,text})=><article key={title} className="group rounded-[18px] border border-[#E4E9E2] bg-white p-6 transition hover:-translate-y-1 hover:border-[#C8D4C7] hover:shadow-[0_16px_36px_rgba(40,57,43,0.06)]"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF3EC] text-[#637A64] transition group-hover:bg-[#E2EBDD]"><Icon size={18} strokeWidth={1.7}/></span><h3 className="mt-6 text-[14px] font-semibold">{title}</h3><p className="mt-2 text-[11px] leading-6 text-[#788378]">{text}</p></article>)}</div>
      </section>

      <section id="waste-guide" className="border-y border-[#E6EAE4] bg-[#EDF1EA]">
        <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:py-24">
          <div><SectionLabel>Learn before you throw</SectionLabel><h2 className="mt-4 text-[32px] font-semibold leading-tight tracking-[-0.055em] sm:text-[42px]">Better sorting<br/>starts with one question.</h2><p className="mt-4 max-w-[390px] text-[12px] leading-7 text-[#718071]">Look up common household items and get simple preparation guidance. The starter guide is curated; it is not an AI diagnosis or a substitute for local collection rules.</p><div className="mt-7 flex items-center gap-2 text-[10px] font-medium text-[#6C806D]"><Check size={14}/> No paid AI service required for this guide</div></div>
          <div className="rounded-[22px] border border-[#DDE5DA] bg-white p-3 shadow-[0_20px_55px_rgba(45,65,48,0.07)] sm:p-5"><WasteAnalyzer/></div>
        </div>
      </section>

      <section id="pilot" className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div><SectionLabel>Where we begin</SectionLabel><h2 className="mt-4 text-[32px] font-semibold leading-tight tracking-[-0.055em] sm:text-[42px]">Start close.<br/><span className="text-[#7C907C]">Grow with trust.</span></h2><p className="mt-4 max-w-[490px] text-[12px] leading-7 text-[#778278]">WasteWise is planned to begin around Panjagutta, with nearby neighbourhoods considered for phased coverage. Boundaries, local contacts, collection schedules and recycling partners will be added only after verification.</p><div className="mt-7 flex flex-wrap gap-2">{areas.map(area=><span key={area} className="rounded-full border border-[#DDE4DA] bg-white px-3.5 py-2 text-[10px] font-medium text-[#637364]">{area}</span>)}</div><p className="mt-4 text-[10px] leading-5 text-[#929B91]">Proposed pilot areas only. This is not a statement of GHMC service coverage or municipal partnership.</p></div>
          <div className="rounded-[22px] border border-[#E3E9E1] bg-white p-6 sm:p-8"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EDF2EB] text-[#637A64]"><MapPin size={18}/></span><div><p className="text-[13px] font-semibold">Panjagutta pilot zone</p><p className="mt-1 text-[10px] text-[#899489]">Hyderabad · Telangana</p></div></div><div className="mt-7 space-y-4">{[{label:"Locality onboarding",status:"In progress",width:"68%"},{label:"Resident reporting",status:"Next milestone",width:"24%"},{label:"Verified schedules & partners",status:"Awaiting local validation",width:"8%"}].map(item=><div key={item.label}><div className="flex items-center justify-between gap-3"><span className="text-[11px] font-medium text-[#59675A]">{item.label}</span><span className="text-[9px] text-[#899489]">{item.status}</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#EEF1EC]"><div className="h-full rounded-full bg-[#829681]" style={{width:item.width}}/></div></div>)}</div><div className="mt-7 rounded-xl bg-[#F4F6F2] p-4"><p className="text-[10px] font-semibold text-[#637364]">A note on accuracy</p><p className="mt-2 text-[10px] leading-5 text-[#7C887D]">No collection time, partner listing or resolution metric will be shown as live until it has a trusted source.</p></div><LocalityJoinPanel/></div>
        </div>
      </section>

      <section id="report" className="border-y border-[#E6EAE4] bg-white">
        <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:py-24">
          <div><SectionLabel>Take part</SectionLabel><h2 className="mt-4 text-[32px] font-semibold leading-tight tracking-[-0.055em] sm:text-[42px]">A cleaner street<br/>starts with a clear report.</h2><p className="mt-4 max-w-[400px] text-[12px] leading-7 text-[#778278]">Try the report form preview. Live submissions will be switched on after locality membership, storage and the review workflow are tested end to end.</p><div className="mt-7 space-y-3 text-[11px] text-[#718071]"><p className="flex items-center gap-2"><Check size={14} className="text-[#718D70]"/> Report categories planned</p><p className="flex items-center gap-2"><Check size={14} className="text-[#718D70]"/> Photo and location support planned</p><p className="flex items-center gap-2"><Check size={14} className="text-[#718D70]"/> Status history planned</p></div></div>
          <form onSubmit={submitPreview} className="rounded-[22px] border border-[#E3E9E1] bg-[#FBFCFA] p-5 sm:p-7">
            <div className="flex items-center justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#819081]">Report preview</p><h3 className="mt-1 text-[17px] font-semibold">What needs attention?</h3></div><span className="rounded-full bg-[#EEF2EC] px-3 py-1.5 text-[9px] font-medium text-[#6C806D]">Demo only</span></div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="text-[10px] font-semibold text-[#657165]">Area<select value={activeArea} onChange={e=>setActiveArea(e.target.value)} className="mt-2 w-full rounded-xl border border-[#E1E7DE] bg-white px-3 py-3 text-[12px] font-normal text-[#344237] outline-none focus:border-[#829681]">{areas.map(area=><option key={area}>{area}</option>)}</select></label><label className="text-[10px] font-semibold text-[#657165]">Issue type<select value={issueType} onChange={e=>setIssueType(e.target.value)} className="mt-2 w-full rounded-xl border border-[#E1E7DE] bg-white px-3 py-3 text-[12px] font-normal text-[#344237] outline-none focus:border-[#829681]"><option>Overflowing bin</option><option>Missed collection</option><option>Garbage hotspot</option><option>Illegal dumping</option><option>Segregation concern</option></select></label></div>
            <label className="mt-4 block text-[10px] font-semibold text-[#657165]">What happened?<textarea required minLength={10} value={issueNote} onChange={e=>setIssueNote(e.target.value)} rows={4} placeholder="Describe the issue and nearby landmark…" className="mt-2 w-full resize-y rounded-xl border border-[#E1E7DE] bg-white px-3 py-3 text-[12px] font-normal text-[#344237] outline-none placeholder:text-[#A2AAA1] focus:border-[#829681]"/></label>
            {previewMessage&&<p role="status" className="mt-4 rounded-xl border border-[#DDE7DB] bg-[#F0F5EF] p-3 text-[10px] leading-5 text-[#5E755F]">{previewMessage}</p>}
            <div className="mt-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><p className="max-w-[230px] text-[9px] leading-4 text-[#929B91]">Nothing is submitted or stored by this preview.</p><button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#26392C] px-5 py-3 text-[11px] font-semibold text-white transition hover:bg-[#3B5741]">Preview report <ArrowRight size={14}/></button></div>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-20 text-center sm:px-8 lg:py-24"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF0E8] text-[#637A64]"><Leaf size={21}/></span><SectionLabel>Our approach</SectionLabel><h2 className="mx-auto mt-5 max-w-[720px] text-[32px] font-semibold leading-tight tracking-[-0.055em] sm:text-[44px]">Not just cleaner streets.<br/><span className="text-[#7C907C]">A clearer way to care for them.</span></h2><p className="mx-auto mt-5 max-w-[560px] text-[12px] leading-7 text-[#778278]">WasteWise is being built as a practical community tool: transparent about what is known, careful about what is not, and focused on making local action easier.</p><a href="#top" className="mt-8 inline-flex items-center gap-2 text-[11px] font-semibold text-[#536A55] hover:text-[#26392C]">Back to top <ArrowUpRight size={14}/></a></section>

      <footer className="border-t border-[#E3E8E1] bg-[#F1F4EF]">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-8 px-5 py-9 sm:px-8 md:flex-row md:items-end md:justify-between">
          <div><a href="#top" className="flex items-center gap-2.5"><span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#26392C] text-white"><Leaf size={16}/></span><span className="text-[15px] font-semibold tracking-[-0.04em]">wastewise.</span></a><p className="mt-3 max-w-[330px] text-[10px] leading-5 text-[#859085]">A neighbourhood-first waste awareness and reporting platform. Starting with a proposed pilot around Panjagutta, Hyderabad.</p></div>
          <div className="text-left md:text-right"><p className="text-[10px] text-[#8A958A]">An independent community project</p><p className="mt-1 text-[12px] font-semibold text-[#435345]">Made by Surya Narayana</p><p className="mt-3 text-[9px] text-[#9AA39A]">© {new Date().getFullYear()} WasteWise. Built with care.</p></div>
        </div>
      </footer>
    </main>
  );
}
