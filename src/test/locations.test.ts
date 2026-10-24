import { describe, expect, it } from "vitest";
import { BRANCHES } from "@/lib/catalog";
import { locationRequestLink, validPin } from "@/lib/locations";

describe("Customer location requests", () => {
  it("keeps the five supplied approximate city centers", () => {
    expect(BRANCHES.map(({ city, lat, lng }) => ({ city, lat, lng }))).toEqual([
      { city: "Nairobi", lat: -1.2921, lng: 36.8219 }, { city: "Kisumu", lat: -0.0917, lng: 34.768 },
      { city: "Eldoret", lat: 0.5143, lng: 35.2698 }, { city: "Nakuru", lat: -0.3031, lng: 36.08 },
      { city: "Mombasa", lat: -4.0435, lng: 39.6682 },
    ]);
  });
  it("hands the actual pickup pin and address to the owner's WhatsApp line", () => {
    const branch = BRANCHES.find((b) => b.id === "ksm");
    if (!branch) throw new Error("Missing Kisumu");
    const url = new URL(locationRequestLink(branch, { lat: -0.1, lng: 34.78 }, { landmark: "Market", building: "Lake House", floor: "2", notes: "Blue gate" }));
    expect(url.pathname).toBe("/254706460395");
    expect(url.searchParams.get("text")).toContain("https://www.google.com/maps?q=-0.100000,34.780000");
    expect(url.searchParams.get("text")).toContain("City: Kisumu");
    expect(url.searchParams.get("text")).toContain("Gate / access notes: Blue gate");
  });
  it("rejects invalid geographical coordinates", () => {
    expect(validPin({ lat: 91, lng: 34 })).toBe(false);
    expect(validPin({ lat: -1, lng: NaN })).toBe(false);
    expect(validPin({ lat: -1.2921, lng: 36.8219 })).toBe(true);
  });
});