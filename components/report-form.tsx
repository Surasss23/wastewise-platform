"use client";

import { useEffect, useState } from "react";
import { Camera, CheckCircle2, Loader2, MapPin, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const categories = [
  { value: "overflowing_bin", label: "Overflowing bin" },
  { value: "missed_collection", label: "Missed collection" },
  { value: "garbage_hotspot", label: "Garbage hotspot" },
  { value: "illegal_dumping", label: "Illegal dumping" },
  { value: "segregation", label: "Segregation concern" }
] as const;

export function ReportForm() {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [localityId, setLocalityId] = useState<string | null>(null);
  const [membership, setMembership] = useState<"loading" | "verified" | "unverified" | "signed_out" | "unavailable">("loading");
  const [category, setCategory] = useState<(typeof categories)[number]["value"]>("overflowing_bin");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setMembership("unavailable");
      return;
    }
    let alive = true;
    supabase.auth.getUser().then(async ({ data }) => {
      if (!alive) return;
      if (!data.user) {
        setMembership("signed_out");
        return;
      }
      setUserId(data.user.id);
      const { data: locality } = await supabase.from("localities").select("id").eq("name", "Panjagutta").eq("city", "Hyderabad").eq("is_active", true).maybeSingle();
      if (!alive || !locality) {
        setMembership("unavailable");
        return;
      }
      setLocalityId(locality.id);
      const { data: member, error } = await supabase.from("locality_memberships").select("verified_at").eq("locality_id", locality.id).eq("user_id", data.user.id).maybeSingle();
      if (!alive) return;
      setMembership(!error && member?.verified_at ? "verified" : "unverified");
    });
    return () => { alive = false; };
  }, [supabase]);

  function locateMe() {
    if (!navigator.geolocation) {
      setMessage("Location is not supported by this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setCoordinates({ latitude: coords.latitude, longitude: coords.longitude });
        setMessage("Location added. You can still edit the nearby landmark.");
      },
      () => setMessage("Location permission was not granted. You can submit an address instead."),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !userId || !localityId || membership !== "verified") return;
    setBusy(true);
    setMessage("");
    const { data: report, error } = await supabase.from("waste_reports").insert({
      locality_id: localityId,
      reporter_id: userId,
      category,
      title: title.trim(),
      description: description.trim(),
      address_label: address.trim() || null,
      latitude: coordinates?.latitude ?? null,
      longitude: coordinates?.longitude ?? null,
      status: "submitted"
    }).select("id").single();

    if (error || !report) {
      setBusy(false);
      setMessage(error?.message.includes("row-level security")
        ? "Your Panjagutta membership must be verified before a report can be submitted."
        : "The report could not be saved. Please try again.");
      return;
    }

    if (photo) {
      const safeName = photo.name.toLowerCase().replace(/[^a-z0-9.-]+/g, "-");
      const storagePath = `${report.id}/${crypto.randomUUID()}-${safeName}`;
      const { error: uploadError } = await supabase.storage.from("report-media").upload(storagePath, photo, { contentType: photo.type, upsert: false });
      if (!uploadError) {
        const { error: mediaError } = await supabase.from("report_media").insert({
          report_id: report.id,
          uploaded_by: userId,
          storage_path: storagePath,
          media_kind: "photo",
          stage: "report"
        });
        if (mediaError) setMessage("Your report was saved, but its photo could not be attached. You can still track the report.");
      } else {
        setMessage("Your report was saved, but the photo upload failed. You can still track the report.");
      }
    }

    setSubmittedId(report.id);
    setTitle("");
    setDescription("");
    setAddress("");
    setPhoto(null);
    setCoordinates(null);
    setBusy(false);
    if (!photo) setMessage("Your report has been submitted successfully.");
  }

  const fieldClass = "mt-2 w-full rounded-xl border border-[#E1E7DE] bg-white px-3 py-3 text-[12px] font-normal text-[#344237] outline-none placeholder:text-[#A2AAA1] focus:border-[#829681]";

  return (
    <div className="rounded-[22px] border border-[#E3E9E1] bg-[#FBFCFA] p-5 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <div><p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#819081]">Resident report</p><h3 className="mt-1 text-[17px] font-semibold">What needs attention?</h3></div>
        <span className="rounded-full bg-[#EEF2EC] px-3 py-1.5 text-[9px] font-medium text-[#6C806D]">Panjagutta pilot</span>
      </div>
      {membership === "loading" && <p className="mt-6 text-xs text-[#788378]">Checking account and locality access…</p>}
      {membership === "signed_out" && <div className="mt-5 rounded-xl bg-[#F0F3EE] p-4 text-xs leading-6 text-[#68766A]">Sign in using the button at the top of the page to submit a report. Reports are available only to verified locality residents.</div>}
      {membership === "unavailable" && <div className="mt-5 rounded-xl bg-[#F0F3EE] p-4 text-xs leading-6 text-[#68766A]">The reporting service is not configured yet. Please try again later.</div>}
      {membership === "unverified" && <div className="mt-5 rounded-xl bg-[#F0F3EE] p-4 text-xs leading-6 text-[#68766A]">Resident access to Panjagutta must be verified before submitting reports. Use the locality access request above; a manager must approve it first.</div>}
      {membership === "verified" && (
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-[10px] font-semibold text-[#657165]">Issue type<select value={category} onChange={e => setCategory(e.target.value as typeof category)} className={fieldClass}>{categories.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
            <label className="text-[10px] font-semibold text-[#657165]">Short title<input required maxLength={100} value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Waste piling near the bus stop" className={fieldClass}/></label>
          </div>
          <label className="block text-[10px] font-semibold text-[#657165]">What happened?<textarea required minLength={10} maxLength={2000} rows={4} value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the issue and any nearby landmark…" className={fieldClass}/></label>
          <label className="block text-[10px] font-semibold text-[#657165]">Nearby address or landmark <span className="font-normal text-[#929B91]">(optional)</span><input maxLength={240} value={address} onChange={e => setAddress(e.target.value)} placeholder="Street, building or landmark" className={fieldClass}/></label>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={locateMe} className="inline-flex items-center gap-2 rounded-xl border border-[#DDE4DA] bg-white px-3 py-2.5 text-[10px] font-semibold text-[#596B5B]"><MapPin size={14}/> {coordinates ? "Location added" : "Use my location"}</button>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#DDE4DA] bg-white px-3 py-2.5 text-[10px] font-semibold text-[#596B5B]"><Camera size={14}/>{photo ? "Change photo" : "Add photo"}<input type="file" accept="image/jpeg,image/png,image/webp,image/heic" className="sr-only" onChange={e => setPhoto(e.target.files?.[0] ?? null)}/></label>
            {photo && <span className="max-w-[180px] truncate text-[10px] text-[#718071]">{photo.name}</span>}
          </div>
          {photo && photo.size > 10 * 1024 * 1024 && <p className="text-[10px] text-red-700">Photo must be smaller than 10 MB.</p>}
          {message && <p role="status" className="rounded-xl border border-[#DDE7DB] bg-[#F0F5EF] p-3 text-[10px] leading-5 text-[#5E755F]">{message}</p>}
          {submittedId && <p className="flex items-center gap-2 text-[10px] font-medium text-[#5E755F]"><CheckCircle2 size={14}/> Reference: {submittedId.slice(0, 8).toUpperCase()}</p>}
          <div className="flex flex-col justify-between gap-3 border-t border-[#E7EBE5] pt-4 sm:flex-row sm:items-center"><p className="max-w-[260px] text-[9px] leading-4 text-[#929B91]">Your report is visible only according to locality access rules. Location is optional.</p><button type="submit" disabled={busy || !title.trim() || description.trim().length < 10 || Boolean(photo && photo.size > 10 * 1024 * 1024)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#26392C] px-5 py-3 text-[11px] font-semibold text-white transition hover:bg-[#3B5741] disabled:cursor-not-allowed disabled:opacity-50">{busy ? <Loader2 size={14} className="animate-spin"/> : <Send size={14}/>} {busy ? "Submitting…" : "Submit report"}</button></div>
        </form>
      )}
    </div>
  );
}
