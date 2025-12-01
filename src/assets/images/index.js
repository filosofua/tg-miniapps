const encode = (svg) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const grainDefs = `
  <filter id="grain" x="-10" y="-10" width="760" height="440">
    <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" result="noise" />
    <feColorMatrix in="noise" type="saturate" values="0" />
    <feBlend in="SourceGraphic" in2="noise" mode="overlay" />
  </filter>
`;

const neonLines = (palette) => `
  <g stroke="${palette.neon}" stroke-width="4" opacity="0.8">
    <path d="M12 40 H240" />
    <path d="M720 70 H440" />
    <path d="M60 380 H320" />
  </g>
`;

const panel = (title, subtitle, palette) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 420" fill="none">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="${palette.bg0}" offset="0" />
      <stop stop-color="${palette.bg1}" offset="0.55" />
      <stop stop-color="${palette.bg2}" offset="1" />
    </linearGradient>
    <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="${palette.haze0}" offset="0" stop-opacity="0.65" />
      <stop stop-color="${palette.haze1}" offset="1" stop-opacity="0.1" />
    </linearGradient>
    <linearGradient id="sun" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="${palette.sun0}" offset="0" />
      <stop stop-color="${palette.sun1}" offset="1" />
    </linearGradient>
    ${grainDefs}
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)" />
  <rect x="14" y="14" width="692" height="392" fill="none" stroke="${palette.frame}" stroke-width="10" />
  <g filter="url(#grain)">
    <rect x="480" y="-18" width="240" height="200" fill="url(#sun)" opacity="0.35" />
    <rect x="0" y="260" width="720" height="180" fill="${palette.horizon}" />
    <path d="M-20 250 Q160 210 320 250 T720 240 L720 280 L-20 280 Z" fill="${palette.hill}" opacity="0.9" />
    <path d="M-30 320 C200 280 360 310 520 320 C660 330 720 310 720 310 L720 420 L-30 420 Z" fill="url(#haze)" />
    <rect x="70" y="170" width="120" height="130" fill="${palette.struct}" opacity="0.75" />
    <rect x="230" y="150" width="150" height="150" fill="${palette.struct2}" opacity="0.8" />
    <rect x="430" y="190" width="160" height="120" fill="${palette.struct3}" opacity="0.8" />
    <rect x="600" y="160" width="40" height="160" fill="${palette.tower}" opacity="0.7" />
    ${neonLines(palette)}
    <circle cx="620" cy="90" r="6" fill="${palette.neon}" />
    <circle cx="86" cy="66" r="4" fill="${palette.neon}" />
    <circle cx="360" cy="42" r="5" fill="${palette.neon}" />
  </g>
  <g font-family="'Space Grotesk','Arial Black',sans-serif" fill="${palette.text}">
    <rect x="24" y="24" width="220" height="72" fill="${palette.captionBg}" opacity="0.72" />
    <text x="32" y="64" font-size="32" letter-spacing="2">${title}</text>
    <text x="32" y="96" font-size="16" opacity="0.86">${subtitle}</text>
    <text x="32" y="126" font-size="13" opacity="0.72">Ashwood · Oregon · 1976</text>
  </g>
</svg>`;

const palettes = {
  city: { bg0: '#0b1224', bg1: '#101726', bg2: '#1c2437', haze0: '#0b1224', haze1: '#0f172a', sun0: '#eab308', sun1: '#f97316', horizon: '#0f172a', hill: '#111827', struct: '#1f2937', struct2: '#111827', struct3: '#0f172a', tower: '#111827', frame: '#0f172a', text: '#e2e8f0', neon: '#f97316', captionBg: '#0f172a' },
  police: { bg0: '#11121f', bg1: '#1a1f2f', bg2: '#0d121c', haze0: '#0d121c', haze1: '#0b1224', sun0: '#7c3aed', sun1: '#22d3ee', horizon: '#0b1224', hill: '#0f172a', struct: '#1d4ed8', struct2: '#0ea5e9', struct3: '#0ea5e9', tower: '#312e81', frame: '#1f2937', text: '#e2e8f0', neon: '#22d3ee', captionBg: '#0f172a' },
  home: { bg0: '#120c16', bg1: '#1f1724', bg2: '#2b1b1c', haze0: '#2e1065', haze1: '#1f1724', sun0: '#e11d48', sun1: '#f472b6', horizon: '#2e1065', hill: '#1f1724', struct: '#b91c1c', struct2: '#9f1239', struct3: '#6b21a8', tower: '#6b21a8', frame: '#2e1065', text: '#fde68a', neon: '#f472b6', captionBg: '#1f1724' },
  gas: { bg0: '#0b0f1a', bg1: '#101627', bg2: '#1e293b', haze0: '#0f172a', haze1: '#0b1224', sun0: '#f59e0b', sun1: '#ef4444', horizon: '#0f172a', hill: '#1e293b', struct: '#f97316', struct2: '#9a3412', struct3: '#7c2d12', tower: '#ef4444', frame: '#0f172a', text: '#f8fafc', neon: '#f97316', captionBg: '#0f172a' },
  factory: { bg0: '#0a0d14', bg1: '#0f172a', bg2: '#111827', haze0: '#0f172a', haze1: '#0b1224', sun0: '#334155', sun1: '#22d3ee', horizon: '#0f172a', hill: '#111827', struct: '#0ea5e9', struct2: '#312e81', struct3: '#1f2937', tower: '#0ea5e9', frame: '#0ea5e9', text: '#e2e8f0', neon: '#22d3ee', captionBg: '#0f172a' },
  monster: { bg0: '#0b0d17', bg1: '#0f172a', bg2: '#020617', haze0: '#020617', haze1: '#0b1224', sun0: '#10b981', sun1: '#0ea5e9', horizon: '#020617', hill: '#0b1224', struct: '#16a34a', struct2: '#047857', struct3: '#0f172a', tower: '#0b1224', frame: '#14532d', text: '#a7f3d0', neon: '#22d3ee', captionBg: '#04111f' },
};

export const images = {
  city: encode(panel('Ashwood · City Limits', 'Туман и неон у въезда', palettes.city)),
  police: encode(panel('Участок', 'Шеф Холден ждёт', palettes.police)),
  home: encode(panel('Дом Харперов', 'родители на грани', palettes.home)),
  gas: encode(panel('Заправка', 'Свидетели говорят шёпотом', palettes.gas)),
  factory: encode(panel('Завод', 'шумы в старых цехах', palettes.factory)),
  monster: encode(panel('Туманное ущелье', 'криптида вдалеке', palettes.monster)),
};

const portrait = (title, subtitle, accent, hue) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" fill="none">
  <defs>
    <linearGradient id="pbg" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="${hue[0]}" offset="0" />
      <stop stop-color="${hue[1]}" offset="1" />
    </linearGradient>
    ${grainDefs}
  </defs>
  <rect width="100%" height="100%" rx="20" fill="#0b1224" stroke="${accent}" stroke-width="8" />
  <rect x="14" y="18" width="212" height="120" rx="18" fill="url(#pbg)" opacity="0.85" />
  <g filter="url(#grain)">
    <circle cx="70" cy="140" r="26" fill="#0f172a" stroke="${accent}" stroke-width="5" />
    <rect x="40" y="60" width="60" height="100" rx="18" fill="#0f172a" opacity="0.9" />
    <rect x="100" y="70" width="100" height="110" rx="20" fill="#0f172a" opacity="0.9" />
    <path d="M120 156 Q150 142 190 154" stroke="${accent}" stroke-width="6" opacity="0.8" />
    <path d="M110 184 Q150 198 190 182" stroke="#e2e8f0" stroke-width="4" opacity="0.8" />
    <rect x="126" y="106" width="52" height="32" rx="8" fill="#0b1224" stroke="#e2e8f0" stroke-width="3" />
  </g>
  <text x="50%" y="206" font-size="16" fill="#e2e8f0" font-family="'Space Grotesk',sans-serif" text-anchor="middle">${title}</text>
  <text x="50%" y="226" font-size="12" fill="${accent}" font-family="'Space Grotesk',sans-serif" text-anchor="middle">${subtitle}</text>
</svg>`;

export const portraits = {
  detective: encode(portrait('Детектив', 'Ashwood noir', '#f97316', ['#111827', '#0f172a'])),
  chief: encode(portrait('Шеф Холден', 'приказной', '#22d3ee', ['#0f172a', '#1d4ed8'])),
  parents: encode(portrait('Харперы', 'на грани', '#f43f5e', ['#2e1065', '#1f1724'])),
  attendant: encode(portrait('Свидетель', 'усталый', '#fbbf24', ['#0f172a', '#1e293b'])),
  monster: encode(portrait('Криптида', 'туман', '#10b981', ['#020617', '#0f172a'])),
};

const strip = (label, accent) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 120" fill="none">
  ${grainDefs}
  <rect width="100%" height="100%" rx="16" fill="#0b1224" stroke="${accent}" stroke-width="6" />
  <path d="M0 78 C80 98 160 88 320 82" stroke="${accent}" stroke-width="6" opacity="0.6" />
  <text x="50%" y="60" fill="#e2e8f0" font-size="24" text-anchor="middle" font-family="'Space Grotesk',sans-serif">${label}</text>
  <circle cx="26" cy="26" r="6" fill="${accent}" />
  <circle cx="294" cy="92" r="5" fill="${accent}" />
</svg>`;

export const sprites = {
  detective: encode(strip('Детектив', '#f97316')),
  arrow: encode(strip('→ К участку', '#22d3ee')),
  station: encode(strip('Участок', '#0ea5e9')),
};

const avatarSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 360" fill="none">
  ${grainDefs}
  <defs>
    <linearGradient id="avgb" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#111827" offset="0" />
      <stop stop-color="#0f172a" offset="1" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" rx="28" fill="url(#avgb)" stroke="#f97316" stroke-width="8" />
  <circle cx="180" cy="140" r="72" fill="#1f2937" stroke="#f8fafc" stroke-width="4" />
  <rect x="120" y="210" width="120" height="90" rx="28" fill="#0f172a" stroke="#f97316" stroke-width="6" />
  <path d="M120 238 C150 220 210 220 240 238" stroke="#f8fafc" stroke-width="5" fill="none" />
  <text x="50%" y="330" dominant-baseline="middle" text-anchor="middle" fill="#e2e8f0" font-size="20" font-family="'Inter','Arial',sans-serif">Detective</text>
</svg>`;

export const avatarBaseImage = encode(avatarSvg);
