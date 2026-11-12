"use client";

import { useMemo, useState } from "react";
import { AlertCircle, ArrowUpRight, BatteryFull, Leaf, Package, Recycle, Search, ShieldAlert, Sparkles, Trash2 } from "lucide-react";
import { findWasteGuide } from "@/lib/waste-guide";

const categoryStyles: Record<string, string> = {
  "Wet waste": "bg-[#EAF0EA] text-[#45634D]",
  "Dry waste": "bg-[#EAF1F7] text-[#426783]",
  "Sanitary waste": "bg-[#F8F0E7] text-[#946A3F]",
  "Special care": "bg-[#F2EDF5] text-[#705A83]"
};

const disposal: Record<string, { title: string; instruction: string; bin: string; tone: string; icon: typeof Trash2; symbol: string }> = {
  "Wet waste": { title: "Wet waste bin", instruction: "Put it with food scraps and other biodegradable waste. Keep it separate from dry waste.", bin: "Green", tone: "green", icon: Leaf, symbol: "WET" },
  "Dry waste": { title: "Dry waste bin", instruction: "Keep it clean and dry. Place it with recyclable dry waste where your local collector accepts it.", bin: "Blue", tone: "blue", icon: Recycle, symbol: "DRY" },
  "Sanitary waste": { title: "Separate sanitary waste", instruction: "Wrap it securely before disposal. Do not put it loose into either recycling or wet waste.", bin: "Wrapped separately", tone: "amber", icon: Package, symbol: "WRAP" },
  "Special care": { title: "Special collection point", instruction: "Do not put this in a regular household bin. Take it to an authorised take-back or collection point.", bin: "Special drop-off", tone: "violet", icon: ShieldAlert, symbol: "SAFE" }
};

function DisposalVisual({ category }: { category: string }) {
  const item = disposal[category] ?? disposal["Special care"];
  const Icon = item.icon;
  const palette = item.tone === "green"
    ? { bg: "bg-[#EAF2E8]", body: "bg-[#6E9870]", lid: "bg-[#557C58]", text: "text-[#45634D]", border: "border-[#D7E6D5]" }
    : item.tone === "blue"
    ? { bg: "bg-[#EAF1F7]", body: "bg-[#6E91AD]", lid: "bg-[#4F7594]", text: "text-[#426783]", border: "border-[#D8E5EF]" }
    : item.tone === "amber"
    ? { bg: "bg-[#F8F0E7]", body: "bg-[#B58A5B]", lid: "bg-[#956D43]", text: "text-[#946A3F]", border: "border-[#EEE0CE]" }
    : { bg: "bg-[#F2EDF5]", body: "bg-[#88739B]", lid: "bg-[#6D587F]", text: "text-[#705A83]", border: "border-[#E5DDEC]" };

  return (
    <div className={`flex items-center gap-4 rounded-xl border ${palette.border} ${palette.bg} p-4`}>
      <div className="flex h-[92px] w-[82px] shrink-0 flex-col items-center justify-end">
        <div className={`z-10 mb-[-2px] h-2 w-[58px] rounded-t-md ${palette.lid}`}/>
        <div className={`relative flex h-[64px] w-[49px] flex-col items-center justify-center rounded-b-lg ${palette.body} shadow-sm`}>
          <div className="absolute left-2 top-2 h-[48px] w-px bg-white/20"/>
          <Trash2 size={22} className="text-white"/>
          <span className="mt-1 text-[7px] font-bold tracking-[0.13em] text-white">{item.symbol}</span>
        </div>
        <div className="mt-1 h-1 w-[58px] rounded-full bg-black/10"/>
      </div>
      <div className="min-w-0">
        <p className={`text-[9px] font-bold uppercase tracking-[0.15em] ${palette.text}`}>Where should it go?</p>
        <h4 className="mt-1 text-sm font-semibold text-[#344237]">{item.title}</h4>
        <p className="mt-1 text-[11px] leading-5 text-[#68766A]">{item.instruction}</p>
        <div className={`mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/75 px-2.5 py-1 text-[9px] font-semibold ${palette.text}`}><Icon size={11}/>{item.bin}</div>
      </div>
    </div>
  );
}

export function WasteAnalyzer() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => findWasteGuide(query), [query]);

  return (
    <section id="guide" className="rounded-2xl border border-line bg-white p-5 shadow-soft sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-moss"><Sparkles size={14}/> Waste guide</div>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">Not sure where it belongs?</h2>
          <p className="mt-1 text-sm text-muted">Search an item and we will show you the right way to sort it.</p>
        </div>
        <span className="hidden rounded-full bg-canvas px-3 py-1 text-[11px] text-muted sm:inline-flex">Simple sorting guide</span>
      </div>
      <div className="mt-5 flex items-center gap-3 rounded-xl border border-line bg-[#FBFCFA] px-4 py-3 focus-within:border-moss">
        <Search size={18} className="shrink-0 text-muted"/>
        <input aria-label="Search waste item" value={query} onChange={e => setQuery(e.target.value)} placeholder="Try: battery, apple, plastic bottle..." className="w-full bg-transparent text-sm outline-none placeholder:text-[#A0A8A1]"/>
        {query && <button onClick={() => setQuery("")} className="text-xs text-muted hover:text-ink">Clear</button>}
      </div>
      {query ? (
        <div className="mt-4 space-y-3">
          {results.length ? results.map(item => (
            <article key={item.name} className="rounded-xl border border-line p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2"><h3 className="font-semibold">{item.name}</h3>{item.name.toLowerCase().includes("battery") && <BatteryFull size={17} className="text-[#705A83]"/>}</div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${categoryStyles[item.category]}`}>{item.category}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted">{item.reason}</p>
              <DisposalVisual category={item.category}/>
              <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                <div><p className="text-xs font-semibold uppercase tracking-wide text-muted">Prepare it</p><p className="mt-1 leading-5">{item.preparation}</p></div>
                <div><p className="text-xs font-semibold uppercase tracking-wide text-muted">Where it goes</p><p className="mt-1 leading-5">{item.destination}</p></div>
              </div>
              {item.category === "Special care" && <p className="mt-3 flex items-start gap-2 rounded-lg bg-[#F6F1F7] p-3 text-[11px] leading-5 text-[#705A83]"><ShieldAlert size={14} className="mt-0.5 shrink-0"/>Keep batteries and electronics out of regular wet and dry bins. Use an authorised collection or take-back point.</p>}
            </article>
          )) : <p className="rounded-xl bg-canvas p-4 text-sm text-muted">No exact match yet. Try a broader item name or check local collection instructions.</p>}
          <p className="flex items-start gap-2 text-xs leading-5 text-muted"><AlertCircle size={14} className="mt-0.5 shrink-0"/>Bin colours and collection systems can vary by area. Follow your local waste collector's instructions where they differ.</p>
        </div>
      ) : (
        <div className="mt-4">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-[#8A968A]">Try a common item</p>
          <div className="flex flex-wrap gap-2">
            {["Apple core", "Plastic bottle", "Plastic wrapper", "Banana peel", "Used battery", "Sanitary pad"].map(item => <button key={item} onClick={() => setQuery(item)} className="rounded-full border border-line px-3 py-2 text-xs text-muted transition hover:border-moss hover:text-ink">{item}</button>)}
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {Object.entries(disposal).map(([category, item]) => {
              const Icon = item.icon;
              return <div key={category} className="flex items-center gap-2 rounded-lg bg-[#F7F8F5] px-3 py-2.5"><Icon size={15} className="text-[#718071]"/><span className="text-[10px] font-medium text-[#657165]">{category}</span><span className="ml-auto text-[9px] text-[#929B91]">{item.bin}</span></div>;
            })}
          </div>
        </div>
      )}
      <a href="#recycling" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-moss hover:underline">Explore recycling options <ArrowUpRight size={15}/></a>
    </section>
  );
}
