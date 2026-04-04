import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// 🎯 ICONE
const getIcon = (stato) => {
  let color = "blue";
  if (stato === "TOP") color = "green";
  if (stato === "OK") color = "orange";
  if (stato === "NO") color = "red";

  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
};

// 🧭 DECOLLI REALI (PIÙ COMPLETI)
const decolli = [
  // CUNEO
  { nome: "Malanotte", lat: 44.718, lng: 7.274, quota: 1350, esposizione: "S", zona: "Cuneo" },
  { nome: "Boves - Iretta", lat: 44.340, lng: 7.548, quota: 1100, esposizione: "E", zona: "Cuneo" },
  { nome: "Martiniana Po", lat: 44.625, lng: 7.255, quota: 900, esposizione: "S", zona: "Cuneo" },
  { nome: "Pian Munè", lat: 44.685, lng: 7.050, quota: 1500, esposizione: "S", zona: "Cuneo" },
  { nome: "Montoso", lat: 44.745, lng: 7.250, quota: 1600, esposizione: "S", zona: "Cuneo" },

  // TORINO
  { nome: "Roletto", lat: 44.918, lng: 7.330, quota: 800, esposizione: "E", zona: "Torino" },
  { nome: "Piossasco", lat: 44.990, lng: 7.460, quota: 1100, esposizione: "S", zona: "Torino" },
  { nome: "Avigliana - Truccetti", lat: 45.085, lng: 7.380, quota: 700, esposizione: "E", zona: "Torino" },
  { nome: "Val della Torre", lat: 45.150, lng: 7.455, quota: 900, esposizione: "E", zona: "Torino" },
  { nome: "Rocca Canavese", lat: 45.305, lng: 7.576, quota: 1200, esposizione: "S", zona: "Torino" },
  { nome: "Santa Elisabetta", lat: 45.360, lng: 7.700, quota: 1400, esposizione: "S", zona: "Torino" },
  { nome: "Cavallaria", lat: 45.440, lng: 7.880, quota: 1300, esposizione: "S", zona: "Torino" }
];

// 🧠 DIREZIONE VENTO
const getDir = (deg) => {
  if (deg >= 45 && deg < 135) return "E";
  if (deg >= 135 && deg < 225) return "S";
  if (deg >= 225 && deg < 315) return "W";
  return "N";
};

// 🧠 VALUTAZIONE VOLO
const valuta = (vento, dir, esp) => {
  const d = getDir(dir);

  if (vento > 30) return "NO";
  if (d === esp && vento < 20) return "TOP";
  if (vento < 15) return "OK";
  return "NO";
};

// 🔥 TERMICHE (STIMA)
const termiche = (temp) => {
  if (temp > 26) return { label: "FORTI", ms: "4-6", quota: "2500m" };
  if (temp > 20) return { label: "MEDIE", ms: "2-4", quota: "2000m" };
  return { label: "DEBOLI", ms: "1-2", quota: "1200m" };
};

export default function App() {
  const [meteo, setMeteo] = useState({});
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    decolli.forEach(async (d) => {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${d.lat}&longitude=${d.lng}&current_weather=true`
      );
      const data = await res.json();

      setMeteo(prev => ({
        ...prev,
        [d.nome]: data.current_weather
      }));
    });
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* MAPPA */}
      <MapContainer center={[44.9, 7.3]} zoom={9} style={{ flex: 3 }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {decolli.map((d, i) => {
          const m = meteo[d.nome];
          const stato = m ? valuta(m.windspeed, m.winddirection, d.esposizione) : "OK";

          return (
            <Marker
              key={i}
              position={[d.lat, d.lng]}
              icon={getIcon(stato)}
              eventHandlers={{ click: () => setSelected(d.nome) }}
            />
          );
        })}
      </MapContainer>

      {/* PANNELLO */}
      <div style={{
        flex: 1,
        background: "#0f172a",
        color: "white",
        padding: "20px",
        fontFamily: "Arial"
      }}>
        {selected ? (
          <>
            <h2>{selected}</h2>

            {meteo[selected] && (() => {
              const m = meteo[selected];
              const t = termiche(m.temperature);

              return (
                <>
                  <p>🌡️ {m.temperature}°C</p>
                  <p>💨 {m.windspeed} km/h</p>
                  <p>🧭 {m.winddirection}°</p>

                  <hr />

                  <h3>🔥 TERMICHE</h3>
                  <p>{t.label}</p>
                  <p>{t.ms} m/s</p>
                  <p>{t.quota}</p>
                </>
              );
            })()}
          </>
        ) : (
          <p>Seleziona un decollo</p>
        )}
      </div>

    </div>
  );
}