import type { Branch } from "@/lib/catalog";

export type LocationPin = { lat: number; lng: number };
export type PickupAddress = { landmark: string; building: string; floor: string; notes: string };

export function validPin(pin: LocationPin) {
  return Number.isFinite(pin.lat) && Number.isFinite(pin.lng) && Math.abs(pin.lat) <= 90 && Math.abs(pin.lng) <= 180;
}

export function locationRequestLink(branch: Branch, pin: LocationPin, address: PickupAddress) {
  if (!validPin(pin)) throw new Error("Invalid location");
  const lines = [
    "Hi Nyang Cleaners, please confirm pickup availability for this location.",
    `City: ${branch.city}`,
    `Pickup pin: https://www.google.com/maps?q=${pin.lat.toFixed(6)},${pin.lng.toFixed(6)}`,
    address.landmark.trim() && `Landmark: ${address.landmark.trim()}`,
    address.building.trim() && `Building: ${address.building.trim()}`,
    address.floor.trim() && `Floor: ${address.floor.trim()}`,
    address.notes.trim() && `Gate / access notes: ${address.notes.trim()}`,
  ].filter(Boolean);
  return `https://wa.me/254706460395?text=${encodeURIComponent(lines.join("\n"))}`;
}

// Public tile URLs only. Never place a private provider credential in VITE_*.
export function mapTileProvider() {
  return {
    url: import.meta.env['VITE_MAP_TILE_URL'] || "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    attribution: import.meta.env['VITE_MAP_TILE_ATTRIBUTION'] || 'Tiles &copy; Esri — Sources: Esri, HERE, Garmin, FAO, NOAA, USGS, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, and the GIS User Community',
  };
}