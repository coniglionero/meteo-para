import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ICONE COLORATE
const iconFacile = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const iconMedio = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const iconDifficile = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// DATI DECOLLI
const decolli = [
  { nome: "Malanotte", localita: "Bagnolo Piemonte", lat: 44.722, lng: 7.270, quota: 1350, livello: "medio", vento: "W - NW" },
  { nome: "Iretta", localita: "Villar San Costanzo", lat: 44.480, lng: 7.390, quota: 1100, livello: "facile", vento: "S - SW" },
  { nome: "Martiniana Po", localita: "Martiniana Po", lat: 44.627, lng: 7.255, quota: 900, livello: "facile", vento: "S" },
  { nome: "Pian Munè", localita: "Paesana", lat: 44.683, lng: 7.050, quota: 1500, livello: "medio", vento: "N - NW" },
  { nome: "Montoso", localita: "Bagnolo Piemonte", lat: 44.745, lng: 7.251, quota: 1600, livello: "medio", vento: "W" },
  { nome: "Roletto", localita: "Roletto", lat: 44.918, lng: 7.333, quota: 800, livello: "facile", vento: "S" },
  { nome: "Piossasco", localita: "Monte San Giorgio", lat: 44.988, lng: 7.464, quota: 1100, livello: "medio", vento: "S - SE" },
  { nome: "Truccetti", localita: "Avigliana", lat: 45.083, lng: 7.383, quota: 700, livello: "facile", vento: "S" },
  { nome: "Val della Torre", localita: "Val della Torre", lat: 45.151, lng: 7.456, quota: 900, livello: "facile", vento: "N - NE" },
  { nome: "Rocca Canavese", localita: "Rocca Canavese", lat: 45.306, lng: 7.577, quota: 1200, livello: "medio", vento: "N" },
  { nome: "Santa Elisabetta", localita: "Canavese", lat: 45.360, lng: 7.700, quota: 1400, livello: "medio", vento: "N - NW" },
  { nome: "Cavallaria", localita: "Ivrea", lat: 45.4545, lng: 7.8768, quota: 1300, livello: "medio", vento: "NE" }
];

export default function App() {
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
              <div style={{ minWidth: "180px" }}>
                <h3 style={{ margin: 0 }}>{d.nome}</h3>

                <p>📍 {d.localita}</p>
                <p>⛰️ Quota: {d.quota} m</p>
                <p>🎚️ Livello: {d.livello}</p>
                <p>🌬️ Vento: {d.vento}</p>

                <button
                  onClick={() =>
                    window.open(
                      `https://www.meteo-parapente.com/#${d.lat},${d.lng},11`,
                      "_blank"
                    )
                  }
                >
                  Meteo
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}