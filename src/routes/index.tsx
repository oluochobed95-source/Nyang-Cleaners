import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Mascot } from "@/components/Mascot";
import { NyangIcon, type NyangIconName } from "@/components/NyangIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { I18nProvider, useT } from "@/lib/i18n";
import { APP_VERSION, BRANCHES, SERVICES, estimate, kes } from "@/lib/catalog";
import { FAQ } from "@/lib/faq";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nyang Cleaners | Laundry, carpets & home help in Kenya" },
      { name: "description", content: "We pick up, we sparkle, we deliver. Laundry, carpet, sofa, office and home help across Nairobi, Kisumu, Eldoret, Nakuru and Mombasa." },
      { property: "og:title", content: "Nyang Cleaners" },
      { property: "og:description", content: "Laundry, carpets and home help, picked up and delivered across Kenya." },
    ],
  }),
  component: () => (<I18nProvider><Landing /></I18nProvider>),
});

const RING: NyangIconName[] = ["laundry", "carpet", "vacuum", "seats", "office"];

function Landing() {
  const { t, lang, setLang } = useT();
  const [origin, setOrigin] = useState("https://nyang.co.ke");
  useEffect(() => setOrigin(window.location.origin), []);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="/" className="flex items-center gap-2 font-display text-xl font-extrabold text-primary">
            <Mascot simple className="size-9" /> Nyang Cleaners
          </a>
          <div className="flex items-center gap-2">
            <button onClick={() => setLang(lang === "en" ? "sw" : "en")} className="rounded-full border px-3 py-1 text-sm font-semibold">
              {lang === "en" ? "Kiswahili" : "English"}
            </button>
            <Button asChild size="sm" className="hidden rounded-full sm:inline-flex"><a href="#estimate">{t.book}</a></Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-hero">
        {[10, 25, 45, 65, 82, 92].map((l, i) => (
          <span key={l} className="animate-bubble absolute bottom-10 rounded-full border-2 border-accent/60 bg-background/60"
            style={{ left: `${l}%`, width: 14 + (i % 3) * 10, height: 14 + (i % 3) * 10, animationDelay: `${i * 1.1}s` }} />
        ))}
        <div className="relative mx-auto max-w-6xl px-4 pb-28 pt-10 text-center">
          <p className="font-display text-lg font-bold text-accent-foreground/70">{t.tagline}</p>
          <h1 className="mx-auto mt-2 max-w-3xl font-display text-4xl font-extrabold leading-tight text-foreground md:text-6xl">{t.headline}</h1>

          <div className="relative mx-auto mt-6 flex max-w-xl flex-col items-center">
            <Mascot className="h-72 w-auto md:h-96" />
            {/* desktop ring */}
            <div className="pointer-events-none absolute inset-0 hidden md:block">
              {RING.map((n, i) => {
                const pos = [["-8%", "10%"], ["-14%", "55%"], ["92%", "8%"], ["98%", "52%"], ["44%", "-6%"]][i];
                return (
                  <a key={n} href="#services" className="pointer-events-auto animate-bob absolute flex size-20 flex-col items-center justify-center rounded-3xl bg-card text-primary shadow-soft transition hover:scale-110"
                    style={{ left: pos[0], top: pos[1], animationDelay: `${i * 0.4}s` }}>
                    <NyangIcon name={n} className="size-9" />
                    <span className="mt-1 text-[10px] font-bold text-foreground">{t.s[n as keyof typeof t.s]}</span>
                  </a>
                );
              })}
            </div>
          </div>
          {/* mobile row */}
          <div className="-mx-4 mt-4 flex gap-3 overflow-x-auto px-4 pb-2 md:hidden">
            {RING.map((n) => (
              <a key={n} href="#services" className="flex min-w-24 flex-col items-center rounded-2xl bg-card p-3 text-primary shadow-soft">
                <NyangIcon name={n} className="size-8" /><span className="mt-1 text-xs font-bold text-foreground">{t.s[n as keyof typeof t.s]}</span>
              </a>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="rounded-full px-8 font-bold shadow-soft"><a href="#estimate">{t.book}</a></Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8 font-bold"><a href="#track">{t.track}</a></Button>
          </div>

          <div className="absolute right-4 top-6 hidden w-36 rounded-2xl bg-card p-3 text-center shadow-soft lg:block">
            <QRCodeSVG value={`${origin}/`} size={112} fgColor="#0B2A5B" className="mx-auto" />
            <p className="mt-2 text-xs font-semibold">{t.scan}</p>
          </div>
        </div>
        <svg viewBox="0 0 1440 120" className="absolute bottom-0 w-full text-background" preserveAspectRatio="none">
          <path fill="currentColor" d="M0 60c240 50 480 50 720 0s480-50 720 0v60H0z" />
        </svg>
      </section>

      <Estimator />

      {/* HOW */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center font-display text-3xl font-extrabold">{t.how}</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {(["clock", "rider", "parcel"] as NyangIconName[]).map((ic, i) => (
            <div key={ic} className="rounded-3xl bg-secondary p-6">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-primary font-display text-lg font-bold text-primary-foreground">{i + 1}</span>
                <NyangIcon name={ic} className="size-8 text-primary" />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold">{t.steps[i]}</h3>
              <p className="mt-1 text-muted-foreground">{t.stepsBody[i]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="bg-secondary/60 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center font-display text-3xl font-extrabold">{t.services}</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
            {SERVICES.map((s) => (
              <a key={s.id} href="#estimate" className="rounded-3xl bg-card p-6 shadow-soft transition hover:-translate-y-1">
                <NyangIcon name={s.icon} className="size-12 text-primary" />
                <h3 className="mt-3 font-display text-xl font-bold">{t.s[s.id as keyof typeof t.s]}</h3>
                <p className="text-sm text-muted-foreground">From {kes(s.options[0].price)} / {s.unit}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CITIES */}
      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h2 className="font-display text-3xl font-extrabold">{t.cities}</h2>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {BRANCHES.map((b) => (
            <span key={b.id} className="flex items-center gap-2 rounded-full border-2 border-primary/20 px-5 py-2 font-semibold">
              <NyangIcon name="pin" className="size-5 text-primary" />{b.city}
            </span>
          ))}
        </div>
      </section>

      {/* TRACK */}
      <section id="track" className="mx-auto max-w-3xl px-4 pb-16">
        <div className="rounded-3xl bg-deep p-8 text-primary-foreground">
          <h2 className="flex items-center gap-2 font-display text-2xl font-extrabold"><NyangIcon name="tag" className="size-7" />{t.trackTitle}</h2>
          <form className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]" onSubmit={(e) => { e.preventDefault(); alert("Order tracking goes live with ordering in the next phase."); }}>
            <Input required placeholder="Order number" className="bg-background text-foreground" />
            <Input required placeholder="Phone (07...)" className="bg-background text-foreground" />
            <Button variant="secondary" className="font-bold">{t.track}</Button>
          </form>
        </div>
      </section>

      {/* PAY + APP */}
      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-16 md:grid-cols-2">
        <div className="flex items-center gap-4 rounded-3xl bg-secondary p-6">
          <NyangIcon name="wallet" className="size-12 shrink-0 text-primary" /><p className="font-semibold">{t.pay}</p>
        </div>
        <div className="flex items-center gap-4 rounded-3xl border-2 border-primary/20 p-6">
          <QRCodeSVG value={`${origin}/get-app`} size={96} fgColor="#0B2A5B" />
          <div>
            <h3 className="font-display text-xl font-bold">{t.getApp}</h3>
            <p className="text-sm text-muted-foreground">{t.getAppBody}</p>
            <Link to="/get-app" className="mt-2 inline-block font-bold text-primary underline">nyang/get-app</Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 pb-20">
        <h2 className="text-center font-display text-3xl font-extrabold">{t.faq}</h2>
        <Accordion type="single" collapsible className="mt-6">
          {FAQ.map((f, i) => (
            <AccordionItem key={i} value={`f${i}`}>
              <AccordionTrigger className="text-left font-semibold">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <footer className="bg-deep py-10 text-primary-foreground">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 text-sm">
          <span className="flex items-center gap-2 font-display text-lg font-bold"><Mascot simple className="size-8" /> Nyang Cleaners</span>
          <span className="opacity-80">Become a housekeeper · Partner agencies · Privacy · Terms</span>
          <span className="opacity-60">v{APP_VERSION}</span>
        </div>
      </footer>
    </div>
  );
}

function Estimator() {
  const { t } = useT();
  const [sid, setSid] = useState("laundry");
  const service = SERVICES.find((s) => s.id === sid)!;
  const [opt, setOpt] = useState(service.options[0].id);
  const [qty, setQty] = useState(3);
  const [city, setCity] = useState("nbo");
  const [express, setExpress] = useState(false);
  const branch = BRANCHES.find((b) => b.id === city)!;
  const r = useMemo(() => estimate(service, opt, qty, branch, express), [service, opt, qty, branch, express]);
  const sel = "h-11 w-full rounded-xl border bg-background px-3 font-semibold";

  return (
    <section id="estimate" className="mx-auto -mt-16 max-w-4xl px-4 relative z-10">
      <div className="rounded-3xl bg-card p-6 shadow-soft md:p-8">
        <h2 className="font-display text-2xl font-extrabold">{t.estimator}</h2>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {SERVICES.map((s) => (
            <button key={s.id} onClick={() => { setSid(s.id); setOpt(s.options[0].id); setQty(s.min ?? 1); }}
              className={`flex shrink-0 items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-bold transition ${sid === s.id ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
              <NyangIcon name={s.icon} className="size-5" />{t.s[s.id as keyof typeof t.s]}
            </button>
          ))}
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <select className={sel} value={opt} onChange={(e) => setOpt(e.target.value)}>
            {service.options.map((o) => <option key={o.id} value={o.id}>{o.label} · {kes(o.price)}</option>)}
          </select>
          <label className="flex items-center gap-2">
            <Input type="number" min={service.min ?? 1} value={qty} onChange={(e) => setQty(Number(e.target.value) || 1)} className="h-11 rounded-xl" />
            <span className="text-sm font-semibold text-muted-foreground">{service.unit}</span>
          </label>
          <select className={sel} value={city} onChange={(e) => setCity(e.target.value)}>
            {BRANCHES.map((b) => <option key={b.id} value={b.id}>{b.city}</option>)}
          </select>
        </div>
        {sid === "laundry" && (
          <label className="mt-3 flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={express} onChange={(e) => setExpress(e.target.checked)} className="size-4 accent-primary" /> Express (24h, +50%)
          </label>
        )}
        <div className="mt-5 flex flex-wrap items-end justify-between gap-4 rounded-2xl bg-secondary p-4">
          <div className="text-sm text-muted-foreground">
            <div>Service ({r.qty} {service.unit}): {kes(r.base)}</div>
            {r.expressFee > 0 && <div>Express: {kes(r.expressFee)}</div>}
            {r.delivery > 0 && <div>Pickup & delivery (≤2 km): {kes(r.delivery)}</div>}
            {service.min && <div className="text-xs">Minimum {service.min} {service.unit}. Final weight confirmed at pickup.</div>}
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold uppercase text-muted-foreground">Estimated total</div>
            <div className="font-display text-3xl font-extrabold text-primary">{kes(r.total)}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
