"use client";

import dynamic from "next/dynamic";

const LocalityMapInner = dynamic(() => import("@/components/locality-map-inner"), {
  ssr: false,
  loading: () => <div className="flex h-[360px] items-center justify-center rounded-2xl bg-[#EEF2EC] text-xs text-[#748174]">Loading neighbourhood map…</div>
});

export function LocalityMap() {
  return <LocalityMapInner />;
}
