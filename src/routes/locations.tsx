import { ClientOnly, createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import { LocateFixed, MapPin, Maximize, MessageCircle, RotateCcw } from "lucide-react";
import { Mascot } from "@/components/Mascot";
import { NyangIcon } from "@/components/NyangIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BRANCHES } from "@/lib/catalog";
import { I18nProvider, useT } from "@/lib/i18n";
import { locationRequestLink, validPin, type LocationPin, type PickupAddress } from "@/lib/locations";

const LocationsMap = lazy(() => import("@/components/LocationsMap"));

export const Route = createFileRoute("/locations")({
  validateSearch: (search: Record<string, unknown>) => ({ city: typeof search.city === "string" && BRANCHES.some((b) => b.id === search.city) ? search.city : "nbo" }),
  head: () => ({ meta: [
    { title: "Locations & pickup address | Nyang Cleaners" },
    { name: "description", content: "Find Nyang Cleaners cities in Kenya and share your pickup pin and address with our team on WhatsApp." },
    { property: "og:title", content: "Nyang Cleaners locations & pickup" },
    { property: "og:description", content: "Explore Nairobi, Kisumu, Eldoret, Nakuru and Mombasa and share your pickup location." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: LocationsPage,
});

function LocationsPage() { return <I18nProvider><Locations /></I18nProvider>; }

function Locations() {
  const { t, lang, setLang } = useT();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const city = search.city;
  const branch = BRANCHES.find((b) => b.id === city) ?? BRANCHES[0];
  const [pin, setPin] = useState<LocationPin | null>(null);
  const [view, setView] = useState<{ mode: "city" | "all" | "pin"; revision: number }>({ mode: "city", revision: 0 });
  const [address, setAddress] = useState<PickupAddress>({ landmark: "", building: "", floor: "", notes: "" });
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState(false);
  const changeView = (mode: "city" | "all" | "pin") => setView((old) => ({ mode, revision: old.revision + 1 }));
  function selectCity(id: string) {
    void navigate({ search: { city: id }, replace: true });
    changeView("city");
    // An address belongs to its selected city; never carry it into another city.
    if (id !== city) { setPin(null); setAddress({ landmark: "", building: "", floor: "", notes: "" }); setError(false); }
  }
  function locate() {
    setError(false);
    if (!navigator.geolocation) { setError(true); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition((result) => {
      const next = { lat: result.coords.latitude, lng: result.coords.longitude };
      setLocating(false);
      if (!validPin(next)) { setError(true); return; }
      setPin(next); changeView("pin");
    }, () => { setLocating(false); setError(true); }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 });
  }
  if (!branch) return null;
  const loading = <div className="flex h-full items-center justify-center bg-secondary text-muted-foreground"><MapPin className="size-8 animate-pulse" aria-label={t.locations.map} /></div>;
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-extrabold text-primary"><Mascot simple className="size-9" />Nyang Cleaners</Link>
          <nav className="flex items-center gap-2"><Button asChild variant="ghost"><Link to="/">{t.locations.home}</Link></Button><Button variant="outline" onClick={() => setLang(lang === "en" ? "sw" : "en")}>{lang === "en" ? "Kiswahili" : "English"}</Button></nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 md:py-10">
        <h1 className="font-display text-3xl font-extrabold md:text-4xl">{t.locations.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t.locations.intro}</p>
        <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section className="min-w-0" aria-label={t.locations.map}>
            <div className="mb-3 flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => changeView("all")}><Maximize />{t.locations.all}</Button>
              <Button variant="secondary" disabled={locating} onClick={locate}><LocateFixed />{locating ? t.locations.locating : t.locations.current}</Button>
              {pin && <Button variant="ghost" size="icon" title={t.locations.reset} aria-label={t.locations.reset} onClick={() => { setPin(null); changeView("city"); }}><RotateCcw /></Button>}
            </div>
            {error && <p role="alert" className="mb-3 text-sm text-destructive">{t.locations.locationError}</p>}
            <div className="location-map-frame overflow-hidden rounded-lg border">
              <ClientOnly fallback={loading}><Suspense fallback={loading}><LocationsMap city={city} pin={pin} view={view} onCity={selectCity} onPin={setPin} /></Suspense></ClientOnly>
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{t.locations.disclaimer}</p>
          </section>
          <section className="min-w-0" aria-label={t.locations.details}>
            <label htmlFor="branch-city" className="text-sm font-bold">{t.locations.city}</label>
            <select id="branch-city" className="mt-2 h-11 w-full rounded-md border bg-background px-3 font-semibold" value={city} onChange={(e) => selectCity(e.target.value)}>{BRANCHES.map((b) => <option key={b.id} value={b.id}>{b.city}</option>)}</select>
            <div className="mt-5 border-b pb-5">
              <h2 className="flex items-center gap-2 font-display text-2xl font-bold"><NyangIcon name="pin" className="size-6 text-primary" />{branch.city}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t.locations.center}</p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">{branch.lat.toFixed(4)}, {branch.lng.toFixed(4)}</p>
            </div>
            <div className="py-5" aria-live="polite">
              <h3 className="text-sm font-bold">{t.locations.pickup}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{pin ? `${pin.lat.toFixed(6)}, ${pin.lng.toFixed(6)}` : t.locations.noPin}</p>
            </div>
            <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); if (pin) window.open(locationRequestLink(branch, pin, address), "_blank", "noopener,noreferrer"); }}>
              {(["landmark", "building", "floor", "notes"] as const).map((field) => <div key={field}><label htmlFor={`pickup-${field}`} className="text-sm font-semibold">{t.locations[field]}</label><Input id={`pickup-${field}`} className="mt-1 h-10" maxLength={field === "notes" ? 500 : 160} value={address[field]} onChange={(e) => setAddress((old) => ({ ...old, [field]: e.target.value }))} /></div>)}
              <Button type="submit" disabled={!pin} className="h-auto min-h-11 w-full whitespace-normal py-3"><MessageCircle />{t.locations.send}</Button>
              <p className="text-center text-xs text-muted-foreground">{pin ? t.locations.confirm : t.locations.pinRequired}</p>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}