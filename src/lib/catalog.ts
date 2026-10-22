// Seed catalog (KES). Will move to the database so admin can edit it.
import type { NyangIconName } from "@/components/NyangIcon";

export const APP_VERSION = "0.1.0";

export type Branch = { id: string; city: string; lat: number; lng: number; multiplier: number };
export const BRANCHES: Branch[] = [
  { id: "nbo", city: "Nairobi", lat: -1.2921, lng: 36.8219, multiplier: 1 },
  { id: "ksm", city: "Kisumu", lat: -0.0917, lng: 34.768, multiplier: 1 },
  { id: "eld", city: "Eldoret", lat: 0.5143, lng: 35.2698, multiplier: 1 },
  { id: "nak", city: "Nakuru", lat: -0.3031, lng: 36.08, multiplier: 1 },
  { id: "mba", city: "Mombasa", lat: -4.0435, lng: 39.6682, multiplier: 1 },
];

export type Option = { id: string; label: string; price: number };
export type Service = { id: string; icon: NyangIconName; unit: string; min?: number; options: Option[] };

export const SERVICES: Service[] = [
  { id: "laundry", icon: "laundry", unit: "kg", min: 3, options: [
    { id: "fold", label: "Wash & Fold", price: 250 },
    { id: "iron", label: "Wash & Iron", price: 350 },
    { id: "premium", label: "Premium / Delicates", price: 500 },
  ] },
  { id: "carpet", icon: "carpet", unit: "pc", options: [
    { id: "s", label: "Up to 4x6 ft", price: 1000 }, { id: "m", label: "Up to 6x9 ft", price: 1500 },
    { id: "l", label: "Up to 8x10 ft", price: 2000 }, { id: "xl", label: "Up to 9x12 ft", price: 2500 },
    { id: "xxl", label: "Larger than 9x12 ft", price: 3000 },
  ] },
  { id: "vacuum", icon: "vacuum", unit: "pc", options: [
    { id: "single", label: "Single mattress", price: 800 }, { id: "double", label: "Double mattress", price: 1200 },
    { id: "king", label: "King / Queen mattress", price: 2000 },
  ] },
  { id: "seats", icon: "seats", unit: "pc", options: [
    { id: "chair", label: "Dining / office chair", price: 500 }, { id: "arm", label: "Armchair", price: 1000 },
    { id: "s2", label: "2-seater sofa", price: 2000 }, { id: "s3", label: "3-seater sofa", price: 2800 },
    { id: "s5", label: "5-seater sofa", price: 3500 }, { id: "l", label: "L-shaped sofa", price: 4000 },
  ] },
  { id: "office", icon: "office", unit: "sqm", options: [
    { id: "general", label: "General clean (min 3,000)", price: 40 },
    { id: "deep", label: "Deep clean (min 6,000)", price: 80 },
  ] },
  { id: "housekeeping", icon: "housekeeping", unit: "visit", options: [
    { id: "1br", label: "Studio / 1BR", price: 2500 }, { id: "2br", label: "2BR", price: 3500 },
    { id: "3br", label: "3BR", price: 4500 }, { id: "4br", label: "4BR", price: 6000 }, { id: "5br", label: "5BR+", price: 8000 },
  ] },
];

const OFFICE_MIN: Record<string, number> = { general: 3000, deep: 6000 };

export function estimate(service: Service, optionId: string, qty: number, branch: Branch, express = false) {
  const opt = service.options.find((o) => o.id === optionId) ?? service.options[0];
  const q = Math.max(qty, service.min ?? 1);
  let base = opt.price * q * branch.multiplier;
  if (service.id === "office") base = Math.max(base, OFFICE_MIN[opt.id] ?? 0);
  const expressFee = express && service.id === "laundry" ? base * 0.5 : 0;
  const delivery = service.id === "laundry" ? 200 : 0;
  return { base: Math.round(base), expressFee: Math.round(expressFee), delivery, total: Math.round(base + expressFee + delivery), qty: q };
}

export const kes = (n: number) => `KES ${n.toLocaleString("en-KE")}`;
