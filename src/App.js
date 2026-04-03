import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// ICONE
const iconGreen = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const iconOrange = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// DECOLLI (CORRETTI MEGLIO)
const decolli = [
  { nome: "Malanotte", lat: 44.724, lng: 7.269, quota: 1350, livello: "medio" },
  { nome: "Iretta", lat: 44.4805, lng: 7.388, quota: 1100, livello: "facile" },
  { nome: "Martiniana Po", lat: 44.6275, lng: 7.2555, quota: 900, livello: "facile" },
  { nome: "Pian Munè", lat: 44.684, lng: 7.048, quota: 1500, livello: "medio" },
  { nome: "Montoso", lat: 44.744, lng: 7.249, quota: 1600, livello: "medio" },
  { nome: "Roletto", lat: 44.918, lng: 7.332, quota: 800, livello: "facile" },
  { nome: "Piossasco", lat: 44.989, lng: 7.462, quota: 1100, livello: "medio" },
  { nome: "Avigliana Truccetti", lat: 45.082, lng: 7.382, quota: 700, livello: "facile" },
  { nome: "Val della Torre", lat: 45.150, lng: 7.455, quota: 900, livello: "facile" },
  { nome: "Rocca Canavese", lat: 45.305, lng: 7.576, quota: 1200, livello: "medio" },
  { nome: "Santa Elisabetta", lat: 45.358, lng: 7.698, quota: 1400, livello: "medio" },

  // 🔴 CORRETTO (non più su Ivrea città)
  { nome: "Cavallaria", lat: 45.441, lng: 7.880, quota: 1300, livello: "medio" }
];

export default function App() {
  const [meteo, setMeteo] = useState({});

  const getMeteo = async (lat, lng) => {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`
    );
    const data = await res.json();
    return data.current_weather;
  };

  useEffect(() => {
    decolli.forEach(async (d) => {
      const m = await getMeteo(d.lat, d.lng);
      setMeteo((prev) => ({ ...prev, [d.nome]: m }));
    });
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer center={[44.9, 7.3]} zoom={9} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {decolli.map((d, i) => (
          <Marker
            key={i}
            position={[d.lat, d.lng]}
            icon={d.livello === "facile" ? iconGreen : iconOrange}
          >
            <Popup>
              <div style={{ fontSize: "14px" }}>
                <strong>{d.nome}</strong>

                <p>Quota: {d.quota} m</p>

                {meteo[d.nome] && (
                  <>
                    <p>Temp: {meteo[d.nome].temperature}°C</p>
                    <p>Vento: {meteo[d.nome].windspeed} km/h</p>
                  </>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}