import { useEffect, useRef, useState } from "react";
import * as L from "leaflet";

const UGM: L.LatLngTuple = [-7.7713, 110.3775];
const pin = L.divIcon({ className: "map-pin", iconSize: [14, 14], iconAnchor: [7, 7] });

export default function LeafletDemo() {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const layer = useRef<L.LayerGroup | null>(null);
  const [points, setPoints] = useState<L.LatLngTuple[]>([UGM]);

  // buat peta sekali
  useEffect(() => {
    const m = L.map(el.current!).setView(UGM, 15);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }).addTo(m);
    layer.current = L.layerGroup().addTo(m);
    m.on("click", (e) => setPoints((p) => [...p, [e.latlng.lat, e.latlng.lng]]));
    map.current = m;
    return () => {
      m.remove();
      map.current = null;
      layer.current = null;
    };
  }, []);

  // gambar ulang marker dan lintasan setiap titik berubah
  useEffect(() => {
    const g = layer.current;
    if (!g) return;
    g.clearLayers();
    points.forEach((p, i) => {
      L.marker(p, { icon: pin })
        .bindPopup(`Titik ${i + 1}: ${p[0].toFixed(5)}, ${p[1].toFixed(5)}`)
        .addTo(g);
    });
    if (points.length > 1) {
      L.polyline(points, { color: "#000000", weight: 2, dashArray: "6 6" }).addTo(g);
    }
  }, [points]);

  const meters = points.reduce(
    (sum, p, i) => (i === 0 ? 0 : sum + L.latLng(points[i - 1]).distanceTo(L.latLng(p))),
    0,
  );

  return (
    <div className="space-y-4">
      <div ref={el} className="relative z-0 isolate h-96 w-full border border-ink" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="m-0 text-sm">
          {points.length} titik, total jarak <strong>{(meters / 1000).toFixed(2)} km</strong>
        </p>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            setPoints([UGM]);
            map.current?.setView(UGM, 15);
          }}
        >
          Reset lintasan
        </button>
      </div>
    </div>
  );
}