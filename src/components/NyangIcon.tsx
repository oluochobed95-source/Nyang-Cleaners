// Single source of truth for Nyang service icons. Used on every surface.
// Two-tone: stroke = currentColor (blue), fill accent = sky/aqua.
import type { ReactNode } from "react";

export type NyangIconName =
  | "laundry" | "carpet" | "vacuum" | "seats" | "office" | "housekeeping"
  | "rider" | "coupon" | "wallet" | "star" | "pin" | "qr" | "tag" | "parcel" | "clock";

const A = "var(--accent)";

const paths: Record<NyangIconName, ReactNode> = {
  laundry: (<>
    <path d="M9 4l3 2 3-2 5 3-2 4-2-1v10H8V10l-2 1-2-4z" fill={A} fillOpacity=".35" />
    <path d="M9 4l3 2 3-2 5 3-2 4-2-1v10H8V10l-2 1-2-4z" />
  </>),
  carpet: (<>
    <rect x="3" y="6" width="14" height="12" rx="1.5" fill={A} fillOpacity=".35" />
    <rect x="3" y="6" width="14" height="12" rx="1.5" />
    <circle cx="19" cy="12" r="2.5" /><path d="M17 9.5v5" /><path d="M6 10h8M6 14h8" />
  </>),
  vacuum: (<>
    <rect x="11" y="13" width="9" height="6" rx="3" fill={A} fillOpacity=".35" />
    <rect x="11" y="13" width="9" height="6" rx="3" />
    <path d="M14 13L7 4H4" /><path d="M7 4v3" /><circle cx="13" cy="20" r=".5" /><circle cx="18" cy="20" r=".5" />
  </>),
  seats: (<>
    <path d="M5 11V8a3 3 0 013-3h8a3 3 0 013 3v3" />
    <path d="M3 12a2 2 0 014 0v2h10v-2a2 2 0 014 0v5H3z" fill={A} fillOpacity=".35" />
    <path d="M3 12a2 2 0 014 0v2h10v-2a2 2 0 014 0v5H3z" /><path d="M5 17v2M19 17v2" />
  </>),
  office: (<>
    <rect x="5" y="3" width="14" height="18" rx="1.5" fill={A} fillOpacity=".35" />
    <rect x="5" y="3" width="14" height="18" rx="1.5" />
    <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M11 21v-3h2v3" />
  </>),
  housekeeping: (<>
    <path d="M4 11l8-7 8 7v9H4z" fill={A} fillOpacity=".35" /><path d="M4 11l8-7 8 7v9H4z" />
    <path d="M14 9l-4 6M8 15h4l1 4H7z" />
  </>),
  rider: (<>
    <circle cx="6" cy="17" r="3" /><circle cx="18" cy="17" r="3" />
    <path d="M6 17l4-6h5l3 6M10 11L8 7H6M15 11l1-3h2" />
    <rect x="11" y="5" width="4" height="4" rx="1" fill={A} fillOpacity=".5" />
  </>),
  coupon: (<>
    <path d="M3 8a2 2 0 002-2h14a2 2 0 002 2v2a2 2 0 000 4v2a2 2 0 00-2 2H5a2 2 0 00-2-2v-2a2 2 0 000-4z" fill={A} fillOpacity=".35" />
    <path d="M3 8a2 2 0 002-2h14a2 2 0 002 2v2a2 2 0 000 4v2a2 2 0 00-2 2H5a2 2 0 00-2-2v-2a2 2 0 000-4z" />
    <path d="M9 15l6-6" /><circle cx="9.5" cy="9.5" r=".8" /><circle cx="14.5" cy="14.5" r=".8" />
  </>),
  wallet: (<>
    <rect x="3" y="6" width="18" height="13" rx="2" fill={A} fillOpacity=".35" />
    <rect x="3" y="6" width="18" height="13" rx="2" /><path d="M16 12h5v4h-5a2 2 0 010-4zM5 6l10-3 1 3" />
  </>),
  star: (<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" fill={A} fillOpacity=".45" />),
  pin: (<>
    <path d="M12 21s7-6.2 7-11.5A7 7 0 005 9.5C5 14.8 12 21 12 21z" fill={A} fillOpacity=".35" />
    <path d="M12 21s7-6.2 7-11.5A7 7 0 005 9.5C5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" />
  </>),
  qr: (<>
    <rect x="3" y="3" width="7" height="7" rx="1" fill={A} fillOpacity=".35" /><rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
    <path d="M14 14h3v3M21 14v.01M14 21h3M20 18v3" />
  </>),
  tag: (<>
    <path d="M3 12V4h8l10 10-8 8z" fill={A} fillOpacity=".35" /><path d="M3 12V4h8l10 10-8 8z" /><circle cx="7.5" cy="8.5" r="1.5" />
  </>),
  parcel: (<>
    <path d="M6 8h12l-1 13H7z" fill={A} fillOpacity=".35" /><path d="M6 8h12l-1 13H7z" /><path d="M9 8V6a3 3 0 016 0v2" />
  </>),
  clock: (<>
    <circle cx="12" cy="12" r="9" fill={A} fillOpacity=".35" /><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
  </>),
};

export function NyangIcon({ name, className = "size-6", title }: { name: NyangIconName; className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      {paths[name]}
    </svg>
  );
}
