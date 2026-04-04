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

// ICONA DINAMICA
const getIcon = (stato) => {
  let color = "blue";

  if (stato === "OK") color = "green";
  if (stato === "ATTENZIONE") color = "orange";
  if (stato === "NO") color = "red";

  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
};

// DECOLLI CON ESPOSIZIONE
const decolli = [
  { nome: "Malanotte", lat: 44.724, lng: 7.269, quota: 1350, esposizione: "S" },
  { nome: "Iretta", lat: 44.4805, lng: 7.388, quota: 1100, esposizione: "E" },
  { nome: "Martiniana Po", lat: 44.6275, lng: 7.2555, quota: 900, esposizione: "S" },
  { nome: "Pian Munè", lat: 44.684, lng: 7.048, quota: 1500, esposizione: "S" },
  { nome: "Montoso", lat: 44.744, lng: 7.249, quota: 1600, esposizione: "S" },
  { nome: "Roletto", lat: 44.918, lng: 7.332, quota: 800, esposizione: "E" },
  { nome: "Piossasco", lat: 44.989, lng: 7.462, quota: 1100, esposizione: "S" },
  { nome: "Avigliana", lat: 45.082, lng: 7.382, quota: 700, esposizione: "E" },
  { nome: "Val della Torre", lat: 45.150, lng: 7.455, quota: 900, esposizione: "E" },
  { nome: "Rocca Canavese", lat: 45.305, lng: 7.576, quota: 1200, esposizione: "S" },
  { nome: "Cavallaria", lat: 45.441, lng: 7.880, quota: 1300, esposizione: "S" }
];

// CONVERSIONE DIREZIONE VENTO
const getDirezioneCardinale = (deg) => {
  if (deg >= 45 && deg < 135) return "E";
  if (deg >= 135 && deg < 225) return "S";
  if (deg >= 225 && deg < 315) return "W";
  return "N";
};

// LOGICA VOLO REALE
const valutaVolo = (vento, dirVento, esposizione) => {
  const dir = getDirezioneCardinale(dirVento);

  if (vento > 25) return "NO";

  if (dir === esposizione && vento <= 20) return "OK";

  if (vento <= 15) return "ATTENZIONE";

  return "NO";
};

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
    <div style={{ height: "100vh" }}>
      <MapContainer center={[44.9, 7.3]} zoom={9} style={{ height: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {decolli.map((d, i) => {
          const m = meteo[d.nome];
          const stato = m
            ? valutaVolo(m.windspeed, m.winddirection, d.esposizione)
            : "ATTENZIONE";

          return (
            <Marker key={i} position={[d.lat, d.lng]} icon={getIcon(stato)}>
              <Popup>
                <div style={{ fontFamily: "Arial" }}>
                  <h3>{d.nome}</h3>
                  <p>⛰️ {d.quota} m</p>
                  <p>🧭 Esp: {d.esposizione}</p>

                  {m && (
                    <>
                      <p>🌡️ {m.temperature}°C</p>
                      <p>💨 {m.windspeed} km/h</p>
                      <p>🧭 {m.winddirection}°</p>
                      <p><b>Stato: {stato}</b></p>
                    </>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}