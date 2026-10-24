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
    locations: {
      nav: "Locations", title: "Nyang Cleaners locations", intro: "Nairobi · Kisumu · Eldoret · Nakuru · Mombasa",
      city: "Choose your city", center: "Approximate city center", disclaimer: "These pins mark city centers, not cleaning depots. Our team will confirm availability at your pickup address.",
      map: "Pickup location map", all: "All cities", current: "Use my location", locating: "Finding your location…", reset: "Clear pickup pin",
      pickup: "Pickup location", noPin: "No pickup location selected", landmark: "Landmark", building: "Building / estate", floor: "Floor", notes: "Gate / access notes",
      send: "Send location on WhatsApp", confirm: "Availability confirmed by our team", locationError: "Your location could not be found. Check location permissions or choose a pin on the map.",
      tileError: "Map tiles could not load. Check your connection; your selected location is still available.", home: "Home", details: "Pickup address", pinRequired: "Choose a pickup location first.",
    },
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
    locations: {
      nav: "Maeneo", title: "Maeneo ya Nyang Cleaners", intro: "Nairobi · Kisumu · Eldoret · Nakuru · Mombasa",
      city: "Chagua jiji lako", center: "Makadirio ya katikati ya jiji", disclaimer: "Alama hizi zinaonyesha katikati ya miji, si vituo vya kusafisha. Timu yetu itathibitisha kama huduma inapatikana katika anwani yako.",
      map: "Ramani ya mahali pa kuchukua", all: "Miji yote", current: "Tumia mahali nilipo", locating: "Tunatafuta mahali ulipo…", reset: "Ondoa alama ya kuchukua",
      pickup: "Mahali pa kuchukua", noPin: "Mahali pa kuchukua hapajachaguliwa", landmark: "Alama ya karibu", building: "Jengo / mtaa", floor: "Ghorofa", notes: "Maelezo ya lango / kuingia",
      send: "Tuma eneo kwa WhatsApp", confirm: "Timu yetu itathibitisha upatikanaji", locationError: "Hatukuweza kupata mahali ulipo. Angalia ruhusa za eneo au chagua eneo kwenye ramani.",
      tileError: "Ramani haikupakia. Angalia muunganisho wako; eneo ulilochagua bado linapatikana.", home: "Nyumbani", details: "Anwani ya kuchukua", pinRequired: "Chagua mahali pa kuchukua kwanza.",
    },
    s: { laundry: "Nguo", carpet: "Zulia", vacuum: "Godoro", seats: "Viti na sofa", office: "Ofisi", housekeeping: "Msaidizi wa nyumbani" },
  },
};

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: typeof dict.en }>({ lang: "en", setLang: () => {}, t: dict.en });
export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  return <Ctx.Provider value={{ lang, setLang, t: dict[lang] }}>{children}</Ctx.Provider>;
}
export const useT = () => useContext(Ctx);
