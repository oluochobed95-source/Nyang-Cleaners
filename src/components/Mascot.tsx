// "Nyang" the crocodile: upright, smiling, soap + bubbles in one hand, folded towel in the other.
export function Mascot({ className = "", simple = false }: { className?: string; simple?: boolean }) {
  if (simple) {
    return (
      <svg viewBox="0 0 64 64" className={className} aria-label="Nyang">
        <ellipse cx="32" cy="36" rx="24" ry="22" fill="var(--croc)" />
        <ellipse cx="32" cy="44" rx="15" ry="11" fill="white" />
        <circle cx="22" cy="20" r="7" fill="white" /><circle cx="42" cy="20" r="7" fill="white" />
        <circle cx="23" cy="21" r="3.5" fill="var(--foreground)" /><circle cx="41" cy="21" r="3.5" fill="var(--foreground)" />
        <path d="M18 34q14 10 28 0" stroke="var(--croc-dark)" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 320 380" className={className} role="img" aria-label="Nyang the crocodile holding soap and a towel">
      {/* tail */}
      <path d="M190 300 q70 10 90 60 q-50 -10 -90 -30z" fill="var(--croc-dark)" />
      {/* legs */}
      <rect x="112" y="300" width="34" height="56" rx="16" fill="var(--croc)" />
      <rect x="174" y="300" width="34" height="56" rx="16" fill="var(--croc)" />
      <ellipse cx="126" cy="358" rx="24" ry="10" fill="var(--croc-dark)" />
      <ellipse cx="194" cy="358" rx="24" ry="10" fill="var(--croc-dark)" />
      {/* body */}
      <ellipse cx="160" cy="250" rx="82" ry="90" fill="var(--croc)" />
      <ellipse cx="160" cy="262" rx="52" ry="68" fill="white" />
      <path d="M118 236h84M114 262h92M118 288h84" stroke="var(--secondary)" strokeWidth="4" strokeLinecap="round" />
      {/* back ridges */}
      <path d="M88 200l-12-10 16-2zM82 240l-14-6 15-6z" fill="var(--croc-dark)" />
      {/* head + snout */}
      <ellipse cx="160" cy="130" rx="78" ry="62" fill="var(--croc)" />
      <path d="M92 140 q68 54 136 0 q-4 40 -68 46 q-64 -6 -68 -46z" fill="var(--croc-dark)" />
      <path d="M100 142 q60 40 120 0" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M112 150l6 8 6-6 6 8 6-6 6 8 6-6 6 8 6-6 6 8 6-6 6 8 6-6 6 6" stroke="white" strokeWidth="3" fill="none" strokeLinejoin="round" />
      <circle cx="140" cy="122" r="3" fill="var(--croc-dark)" /><circle cx="180" cy="122" r="3" fill="var(--croc-dark)" />
      {/* eyes */}
      <circle cx="122" cy="78" r="24" fill="var(--croc)" /><circle cx="198" cy="78" r="24" fill="var(--croc)" />
      <circle cx="122" cy="78" r="16" fill="white" /><circle cx="198" cy="78" r="16" fill="white" />
      <circle cx="125" cy="80" r="8" fill="var(--foreground)" /><circle cx="195" cy="80" r="8" fill="var(--foreground)" />
      <circle cx="128" cy="76" r="3" fill="white" /><circle cx="198" cy="76" r="3" fill="white" />
      <ellipse cx="104" cy="118" rx="10" ry="6" fill="oklch(0.8 0.1 20)" opacity=".5" />
      <ellipse cx="216" cy="118" rx="10" ry="6" fill="oklch(0.8 0.1 20)" opacity=".5" />
      {/* left arm + soap */}
      <path d="M92 220 q-40 -10 -46 -50" stroke="var(--croc)" strokeWidth="26" fill="none" strokeLinecap="round" />
      <rect x="18" y="140" width="56" height="34" rx="12" fill="oklch(0.9 0.08 215)" stroke="var(--primary)" strokeWidth="3" />
      <text x="46" y="162" textAnchor="middle" fontSize="12" fontWeight="800" fill="var(--primary)" fontFamily="Baloo 2, sans-serif">SOAP</text>
      <circle cx="46" cy="176" r="12" fill="var(--croc)" />
      <g fill="white" stroke="var(--accent)" strokeWidth="2" opacity=".9">
        <circle cx="30" cy="120" r="10" /><circle cx="56" cy="108" r="7" /><circle cx="40" cy="92" r="5" />
      </g>
      {/* right arm + folded towel */}
      <path d="M228 220 q40 -10 46 -46" stroke="var(--croc)" strokeWidth="26" fill="none" strokeLinecap="round" />
      <rect x="240" y="140" width="70" height="16" rx="6" fill="var(--primary)" />
      <rect x="240" y="154" width="70" height="16" rx="6" fill="oklch(0.85 0.08 245)" />
      <rect x="240" y="168" width="70" height="16" rx="6" fill="var(--primary)" />
      <path d="M248 148h54M248 176h54" stroke="white" strokeWidth="2" strokeDasharray="4 4" />
      <circle cx="274" cy="180" r="12" fill="var(--croc)" />
    </svg>
  );
}
