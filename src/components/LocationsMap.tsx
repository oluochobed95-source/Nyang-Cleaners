import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import { CircleMarker, MapContainer, Marker, Popup, TileLayer, Tooltip, useMap, useMapEvents } from "react-leaflet";
import { BRANCHES } from "@/lib/catalog";
import { mapTileProvider, type LocationPin } from "@/lib/locations";
import { useT } from "@/lib/i18n";

type Props = {
  city: string;
  pin: LocationPin | null;
  view: { mode: "city" | "all" | "pin"; revision: number };
  onCity: (id: string) => void;
  onPin: (pin: LocationPin) => void;
};

function MapEvents({ city, pin, view, onPin }: Props) {
  const map = useMap();
  useMapEvents({ click: (e) => onPin({ lat: e.latlng.lat, lng: e.latlng.lng }) });
  useEffect(() => {
    const branch = BRANCHES.find((b) => b.id === city);
    if (view.mode === "all") {
      map.fitBounds(BRANCHES.map((b) => [b.lat, b.lng] as [number, number]), { padding: [45, 45], maxZoom: 7 });
    } else if (view.mode === "pin" && pin) {
      map.setView([pin.lat, pin.lng], 15);
    } else if (branch) {
      map.setView([branch.lat, branch.lng], 12);
    }
  }, [city, map, view]);
  return null;
}

export default function LocationsMap(props: Props) {
  const { t } = useT();
  const [tileError, setTileError] = useState(false);
  const provider = mapTileProvider();
  const icon = useMemo(() => L.divIcon({ className: "pickup-marker", html: '<span class="pickup-marker-dot"></span>', iconSize: [32, 42], iconAnchor: [16, 42] }), []);
  return (
    <div className="relative h-full w-full">
      <MapContainer center={[-1.2921, 36.8219]} zoom={12} className="h-full w-full" scrollWheelZoom>
        <TileLayer url={provider.url} attribution={provider.attribution} eventHandlers={{ tileerror: () => setTileError(true), tileload: () => setTileError(false) }} />
        <MapEvents {...props} />
        {BRANCHES.map((b) => (
          <CircleMarker key={b.id} center={[b.lat, b.lng]} radius={props.city === b.id ? 10 : 7} pathOptions={{ className: "branch-map-point" }} eventHandlers={{ click: (e) => { L.DomEvent.stopPropagation(e.originalEvent); props.onCity(b.id); } }}>
            <Tooltip direction="top" offset={[0, -10]} permanent>{b.city}</Tooltip>
            <Popup><strong>{b.city}</strong><br />{t.locations.center}</Popup>
          </CircleMarker>
        ))}
        {props.pin && <Marker position={[props.pin.lat, props.pin.lng]} icon={icon} draggable eventHandlers={{ dragend: (e) => { const point = e.target.getLatLng(); props.onPin({ lat: point.lat, lng: point.lng }); } }}><Tooltip>{t.locations.pickup}</Tooltip></Marker>}
      </MapContainer>
      {tileError && <div role="status" className="absolute bottom-8 left-4 right-4 z-[1000] rounded-lg border bg-background px-3 py-2 text-sm text-foreground">{t.locations.tileError}</div>}
    </div>
  );
}