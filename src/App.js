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

// ICONE DINAMICHE
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

// DECOLLI MIGLIORATI
const decolli = [
  { nome: "Pian Munè", lat: 44.6845, lng: 7.045, esposizione: "S", quota: 1500 },
  { nome: "Malanotte", lat: 44.724, lng: 7.269, esposizione: "S", quota: 1350 },
  { nome: "Piossasco", lat: 44.989, lng: 7.462, esposizione: "S", quota: 1100 },
  { nome: "Cavallaria", lat: 45.441, lng: 7.880, esposizione: "S", quota: 1300 }
];

export default function App() {
  const [meteo, setMeteo] = useState({});
  const [selected, setSelected] = useState(null);

  const getMeteo = async (lat, lng) => {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&hourly=temperature_2m,windspeed_10m`
    );
    const data = await res.json();
    return data;
  };

  useEffect(() => {
    decolli.forEach(async (d) => {
      const m = await getMeteo(d.lat, d.lng);
      setMeteo((prev) => ({ ...prev, [d.nome]: m }));
    });
  }, []);

  const calcolaTermiche = (temp) => {
    if (temp > 25) return { valore: "forti", m: "4-6 m/s", quota: "2500m" };
    if (temp > 18) return { valore: "medie", m: "2-4 m/s", quota: "1800m" };
    return { valore: "deboli", m: "1-2 m/s", quota: "1200m" };
  };

  const valuta = (vento) => {
    if (vento < 15) return "TOP";
    if (vento < 25) return "OK";
    return "NO";
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* MAPPA */}
      <MapContainer center={[44.8, 7.3]} zoom={9} style={{ flex: 3 }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {decolli.map((d, i) => {
          const vento = meteo[d.nome]?.current_weather?.windspeed || 0;
          const stato = valuta(vento);

          return (
            <Marker
              key={i}
              position={[d.lat, d.lng]}
              icon={getIcon(stato)}
              eventHandlers={{
                click: () => setSelected(d.nome)
              }}
            />
          );
        })}
      </MapContainer>

      {/* PANNELLO */}
      <div style={{
        flex: 1,
        background: "#111",
        color: "white",
        padding: "20px"
      }}>
        {selected ? (
          <>
            <h2>{selected}</h2>

            {meteo[selected] && (() => {
              const m = meteo[selected].current_weather;
              const termiche = calcolaTermiche(m.temperature);

              return (
                <>
                  <p>🌡️ {m.temperature}°C</p>
                  <p>💨 {m.windspeed} km/h</p>
                  <p>🧭 {m.winddirection}°</p>

                  <hr />

                  <h3>🔥 Termiche</h3>
                  <p>Intensità: {termiche.valore}</p>
                  <p>Velocità: {termiche.m}</p>
                  <p>Quota: {termiche.quota}</p>
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