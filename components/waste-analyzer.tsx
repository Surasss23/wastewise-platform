"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Search, Sparkles, AlertCircle } from "lucide-react";
import { findWasteGuide } from "@/lib/waste-guide";

const categoryStyles: Record<string, string> = {
  "Wet waste": "bg-[#EAF0EA] text-[#45634D]",
  "Dry waste": "bg-[#EEF0ED] text-[#4D5B51]",
  "Sanitary waste": "bg-[#F4EEE7] text-[#806448]",
  "Special care": "bg-[#F0EDF4] text-[#695A7C]"
};

export function WasteAnalyzer() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => findWasteGuide(query), [query]);

  return (
    <section id="guide" className="rounded-2xl border border-line bg-white p-5 shadow-soft sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-moss"><Sparkles size={14}/> Waste guide</div>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">Not sure where it belongs?</h2>
          <p className="mt-1 text-sm text-muted">Search an item to get simple sorting and disposal guidance.</p>
        </div>
        <span className="hidden rounded-full bg-canvas px-3 py-1 text-[11px] text-muted sm:inline-flex">Curated starter guide</span>
      </div>
      <div className="mt-5 flex items-center gap-3 rounded-xl border border-line bg-[#FBFCFA] px-4 py-3 focus-within:border-moss">
        <Search size={18} className="shrink-0 text-muted"/>
        <input aria-label="Search waste item" value={query} onChange={e => setQuery(e.target.value)} placeholder="Try: plastic bottle, battery, banana peel..." className="w-full bg-transparent text-sm outline-none placeholder:text-[#A0A8A1]"/>
        {query && <button onClick={() => setQuery("")} className="text-xs text-muted hover:text-ink">Clear</button>}
      </div>
      {query ? (
        <div className="mt-4 space-y-3">
          {results.length ? results.map(item => (
            <article key={item.name} className="rounded-xl border border-line p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold">{item.name}</h3>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${categoryStyles[item.category]}`}>{item.category}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted">{item.reason}</p>
              <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                <div><p className="text-xs font-semibold uppercase tracking-wide text-muted">Prepare it</p><p className="mt-1 leading-5">{item.preparation}</p></div>
                <div><p className="text-xs font-semibold uppercase tracking-wide text-muted">Where it goes</p><p className="mt-1 leading-5">{item.destination}</p></div>
              </div>
            </article>
          )) : <p className="rounded-xl bg-canvas p-4 text-sm text-muted">No exact match yet. Try a broader item name or check local collection instructions.</p>}
          <p className="flex items-start gap-2 text-xs leading-5 text-muted"><AlertCircle size={14} className="mt-0.5 shrink-0"/> Guidance can vary by locality and material condition. When unsure, confirm with your authorised waste collector.</p>
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          {["Plastic bottle", "Banana peel", "Used battery", "Sanitary pad"].map(item => <button key={item} onClick={() => setQuery(item)} className="rounded-full border border-line px-3 py-2 text-xs text-muted transition hover:border-moss hover:text-ink">{item}</button>)}
        </div>
      )}
      <a href="#recycling" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-moss hover:underline">Explore recycling options <ArrowUpRight size={15}/></a>
    </section>
  );
}
