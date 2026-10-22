import { createContext, useContext, useState, type ReactNode } from "react";

type Lang = "en" | "sw";
const dict = {
  en: {
    tagline: "We pick up, we sparkle, we deliver.",
    headline: "Fresh laundry & spotless homes, delivered.",
    book: "Book a service", track: "Track my order",
    whatsapp: "Order on WhatsApp",
    scan: "Scan to open on your phone",
    estimator: "Instant price estimate", how: "How it works",
    steps: ["Book in a minute", "We pick up", "We deliver, sparkling"],
    stepsBody: ["Choose a service and your pickup time.", "A rider collects from your door.", "Cleaned, folded and returned on time."],
    services: "Our services", cities: "Where we work", reviews: "What customers say",
    pay: "Pay by M-Pesa now, or pay on delivery. We always confirm your exact total before delivery.",
    getApp: "Get the Nyang app", getAppBody: "Installs in seconds, uses very little data.",
    faq: "Questions", trackTitle: "Track your order",
    s: { laundry: "Laundry", carpet: "Carpet", vacuum: "Mattress vacuum", seats: "Seats & sofas", office: "Office", housekeeping: "Home Help" },
  },
  sw: {
    tagline: "Tunachukua, tunasafisha, tunaleta.",
    headline: "Nguo safi na nyumba safi, tunakuletea.",
    book: "Agiza huduma", track: "Fuatilia oda yangu",
    whatsapp: "Agiza kwa WhatsApp",
    scan: "Changanua kufungua kwa simu",
    estimator: "Bei ya papo hapo", how: "Inavyofanya kazi",
    steps: ["Agiza kwa dakika moja", "Tunachukua", "Tunaleta, safi kabisa"],
    stepsBody: ["Chagua huduma na muda wa kuchukua.", "Mpanda pikipiki anachukua mlangoni.", "Zimesafishwa, zimekunjwa na kurudishwa kwa wakati."],
    services: "Huduma zetu", cities: "Tunapofanya kazi", reviews: "Wateja wanasema",
    pay: "Lipa kwa M-Pesa sasa, au ulipe ukipokea. Tunathibitisha jumla kamili kabla ya kuleta.",
    getApp: "Pata programu ya Nyang", getAppBody: "Inasakinishwa kwa sekunde, data kidogo sana.",
    faq: "Maswali", trackTitle: "Fuatilia oda yako",
    s: { laundry: "Nguo", carpet: "Zulia", vacuum: "Godoro", seats: "Viti na sofa", office: "Ofisi", housekeeping: "Msaidizi wa nyumbani" },
  },
};

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: typeof dict.en }>({ lang: "en", setLang: () => {}, t: dict.en });
export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  return <Ctx.Provider value={{ lang, setLang, t: dict[lang] }}>{children}</Ctx.Provider>;
}
export const useT = () => useContext(Ctx);
