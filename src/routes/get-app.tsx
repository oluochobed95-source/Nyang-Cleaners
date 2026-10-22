import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Mascot } from "@/components/Mascot";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/get-app")({
  head: () => ({
    meta: [
      { title: "Get the Nyang app | Nyang Cleaners" },
      { name: "description", content: "Install the Nyang Cleaners app in seconds. Laundry, carpets and home help, picked up and delivered." },
      { property: "og:title", content: "Get the Nyang app" },
      { property: "og:description", content: "Laundry, carpets and home help, picked up and delivered." },
    ],
  }),
  component: GetApp,
});

type Device = "android" | "ios" | "desktop";
type InstallEvent = Event & { prompt: () => Promise<void> };

function GetApp() {
  const [device, setDevice] = useState<Device>("android");
  const [prompt, setPrompt] = useState<InstallEvent | null>(null);
  const [url, setUrl] = useState("");

  useEffect(() => {
    const ua = navigator.userAgent;
    setDevice(/iPhone|iPad|iPod/i.test(ua) ? "ios" : /Android/i.test(ua) ? "android" : "desktop");
    setUrl(window.location.href);
    const h = (e: Event) => { e.preventDefault(); setPrompt(e as InstallEvent); };
    window.addEventListener("beforeinstallprompt", h);
    return () => window.removeEventListener("beforeinstallprompt", h);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center bg-hero px-5 py-10 text-center font-sans">
      <Mascot className="h-48 w-auto" />
      <h1 className="mt-4 font-display text-3xl font-extrabold">Get the Nyang app</h1>
      <p className="mt-1 max-w-sm text-muted-foreground">Laundry, carpets and home help, picked up and delivered.</p>

      {device === "desktop" && (
        <div className="mt-6 rounded-3xl bg-card p-5 shadow-soft">
          {url && <QRCodeSVG value={url} size={180} fgColor="#0B2A5B" />}
          <p className="mt-2 text-sm font-semibold">Scan with your phone camera</p>
        </div>
      )}
      {device === "android" && (
        <Button size="lg" className="mt-6 rounded-full px-10 font-bold shadow-soft"
          onClick={() => prompt ? prompt.prompt() : alert("Open your browser menu (⋮) and tap \"Add to Home screen\".")}>
          Install
        </Button>
      )}
      {device === "ios" && (
        <ol className="mt-6 max-w-sm space-y-2 rounded-3xl bg-card p-5 text-left shadow-soft">
          <li><b>1.</b> Tap the Share button at the bottom of Safari.</li>
          <li><b>2.</b> Scroll and tap <b>Add to Home Screen</b>.</li>
          <li><b>3.</b> Tap <b>Add</b>. Done!</li>
        </ol>
      )}
      <Link to="/" className="mt-8 font-semibold text-primary underline">Continue to the website</Link>
    </main>
  );
}
