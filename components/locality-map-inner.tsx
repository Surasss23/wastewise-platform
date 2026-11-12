"use client";

import { useState } from "react";
import { CircleMarker, MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { LocateFixed, MapPin } from "lucide-react";

const center: [number, number] = [17.426, 78.451];

function ClickToSelect({ onSelect }: { onSelect: (point: [number, number]) => void }) {
  useMapEvents({ click(event) { onSelect([event.latlng.lat, event.latlng.lng]); } });
  return null;
}

function Recenter({ point }: { point: [number, number] }) {
  const map = requireMap();
  map.setView(point, Math.max(map.getZoom(), 15));
  return null;
}

function requireMap() {
  return L.DomUtil.get("wastewise-map") ? (window as Window & { __wastewiseMap?: L.Map }).__wastewiseMap : undefined;
}

export default function LocalityMapInner() {
  const [point, setPoint] = useState<[number, number] | null>(null);
  const [centerPoint, setCenterPoint] = useState<[number, number]>(center);
  const [notice, setNotice] = useState("Map is centred on the proposed Panjagutta pilot area. Select a point or use your location.");
  function locate() {
    if (!navigator.geolocation) { setNotice("This browser does not support location."); return; }
    setNotice("Requesting your location…");
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const next: [number, number] = [coords.latitude, coords.longitude];
      setCenterPoint(next); setPoint(next); setNotice("Your current location is selected for this session.");
    }, () => setNotice("Location permission was unavailable. You can still select a point on the map."), { enableHighAccuracy: true, timeout: 10000 });
  }
  return <div className="overflow-hidden rounded-2xl border border-[#E1E7DE] bg-white">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8ECE6] p-4">
      <div><p className="text-xs font-semibold text-[#344237]">Panjagutta neighbourhood map</p><p className="mt-1 text-[10px] text-[#879187]">Tap the map to place a temporary pin.</p></div>
      <button type="button" onClick={locate} className="inline-flex items-center gap-2 rounded-lg border border-[#DDE4DA] px-3 py-2 text-[10px] font-semibold text-[#526B55]"><LocateFixed size={14}/> Use my location</button>
    </div>
    <MapContainer id="wastewise-map" center={centerPoint} zoom={14} scrollWheelZoom className="h-[360px] w-full">
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
      <ClickToSelect onSelect={setPoint}/>
      <CircleMarker center={center} radius={8} pathOptions={{ color: "#526B55", fillColor: "#819981", fillOpacity: 0.85 }}><></></CircleMarker>
      {point && <CircleMarker center={point} radius={9} pathOptions={{ color: "#9B633C", fillColor: "#D5A17A", fillOpacity: 0.95 }}/>}
    </MapContainer>
    <div className="flex items-start gap-2 p-3 text-[10px] leading-5 text-[#778378]"><MapPin size={14} className="mt-0.5 shrink-0 text-[#718D70]"/><span>{notice}{point ? ` Selected: ${point[0].toFixed(5)}, ${point[1].toFixed(5)}` : ""}</span></div>
  </div>;
}
