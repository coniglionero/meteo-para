import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// FIX ICONE (IMPORTANTISSIMO per Vercel)
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// ICONE COLORATE
const iconFacile = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const iconMedio = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const iconDifficile = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// DECOLLI REALI
const decolli = [
  { nome: "Malanotte", localita: "Bagnolo Piemonte", lat: 44.722, lng: 7.270, quota: 1350, livello: "medio" },
  { nome: "Iretta", localita: "Villar San Costanzo", lat: 44.480, lng: 7.390, quota: 1100, livello: "facile" },
  { nome: "Martiniana Po", localita: "Martiniana Po", lat: 44.627, lng: 7.255, quota: 900, livello: "facile" },
  { nome: "Pian Munè", localita: "Paesana", lat: 44.683, lng: 7.050, quota: 1500, livello: "medio" },
  { nome: "Montoso", localita: "Bagnolo Piemonte", lat: 44.745, lng: 7.251, quota: 1600, livello: "medio" },
  { nome: "Roletto", localita: "Roletto", lat: 44.918, lng: 7.333, quota: 800, livello: "facile" },
  { nome: "Piossasco", localita: "Monte San Giorgio", lat: 44.988, lng: 7.464, quota: 1100, livello: "medio" },
  { nome: "Truccetti", localita: "Avigliana", lat: 45.083, lng: 7.383, quota: 700, livello: "facile" },
  { nome: "Val della Torre", localita: "Val della Torre", lat: 45.151, lng: 7.456, quota: 900, livello: "facile" },
  { nome: "Rocca Canavese", localita: "Rocca Canavese", lat: 45.306, lng: 7.577, quota: 1200, livello: "medio" },
  { nome: "Santa Elisabetta", localita: "Canavese", lat: 45.360, lng: 7.700, quota: 1400, livello: "medio" },
  { nome: "Cavallaria", localita: "Ivrea", lat: 45.4545, lng: 7.8768, quota: 1300, livello: "medio" }
];

export default function App() {
  const [meteo, setMeteo] = useState({});

  // PRENDE METEO REALE
  const getMeteo = async (lat, lng) => {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`
    );
    const data = await res.json();
    return data.current_weather;
  };

  // CARICA METEO
  useEffect(() => {
    decolli.forEach(async (d) => {
      const m = await getMeteo(d.lat, d.lng);
      setMeteo((prev) => ({ ...prev, [d.nome]: m }));
    });
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer center={[44.8, 7.3]} zoom={9} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {decolli.map((d, i) => (
          <Marker
            key={i}
            position={[d.lat, d.lng]}
            icon={
              d.livello === "facile"
                ? iconFacile
                : d.livello === "medio"
                ? iconMedio
                : iconDifficile
            }
          >
            <Popup>
              <div style={{ minWidth: "200px" }}>
                <h3>{d.nome}</h3>
                <p>📍 {d.localita}</p>
                <p>⛰️ {d.quota} m</p>
                <p>🎚️ {d.livello}</p>

                {meteo[d.nome] && (
                  <>
                    <p>🌡️ {meteo[d.nome].temperature}°C</p>
                    <p>💨 {meteo[d.nome].windspeed} km/h</p>
                  </>
                )}

                <button
                  onClick={() =>
                    window.open(
                      `https://www.meteo-parapente.com/#${d.lat},${d.lng},11`,
                      "_blank"
                    )
                  }
                >
                  Apri Meteo
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}