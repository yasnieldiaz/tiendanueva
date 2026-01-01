"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon in Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface ContactMapProps {
  popupText?: string;
}

export default function ContactMap({ popupText = "DronePartss - ul. Smolna 14, 44-200 Rybnik" }: ContactMapProps) {
  // Rybnik, ul. Smolna 14 coordinates
  const position: [number, number] = [50.0971, 18.5463];

  useEffect(() => {
    // Force Leaflet to recalculate map size after mount
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-lg border border-neutral-200">
      <MapContainer
        center={position}
        zoom={16}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={icon}>
          <Popup>
            <div className="text-center">
              <strong className="text-blue-600">DronePartss</strong>
              <br />
              <span className="text-neutral-600">ul. Smolna 14</span>
              <br />
              <span className="text-neutral-600">44-200 Rybnik, Polska</span>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
