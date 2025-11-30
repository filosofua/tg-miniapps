const encode = (svg) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const panel = (title, subtitle, palette) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 420" fill="none">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="${palette.bg0}" offset="0" />
      <stop stop-color="${palette.bg1}" offset="0.5" />
      <stop stop-color="${palette.bg2}" offset="1" />
    </linearGradient>
    <linearGradient id="sun" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="${palette.sun0}" offset="0" />
      <stop stop-color="${palette.sun1}" offset="1" />
    </linearGradient>
    <filter id="grain" x="-10" y="-10" width="760" height="440">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="noise"/>
      <feColorMatrix in="noise" type="saturate" values="0"/>
      <feBlend in="SourceGraphic" in2="noise" mode="overlay"/>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)" />
  <rect x="18" y="18" width="684" height="384" fill="none" stroke="${palette.frame}" stroke-width="8" />
  <g filter="url(#grain)" opacity="0.9">
    <rect x="520" y="-10" width="180" height="180" fill="url(#sun)" opacity="0.4" />
    <path d="M0 320 C180 300 260 280 400 320 C540 360 640 340 720 300 L720 420 L0 420 Z" fill="${palette.horizon}" opacity="0.9" />
    <path d="M-20 260 Q160 220 320 260 T720 250 L720 300 L-20 300 Z" fill="${palette.hill}" opacity="0.9" />
    <rect x="70" y="180" width="120" height="120" fill="${palette.struct}" opacity="0.7" />
    <rect x="250" y="170" width="160" height="140" fill="${palette.struct2}" opacity="0.8" />
    <rect x="460" y="200" width="140" height="120" fill="${palette.struct3}" opacity="0.8" />
  </g>
  <g font-family="'Inter','Arial Black',sans-serif" fill="${palette.text}">
    <text x="32" y="74" font-size="40" letter-spacing="2">${title}</text>
    <text x="32" y="122" font-size="20" opacity="0.86">${subtitle}</text>
    <text x="32" y="168" font-size="16" opacity="0.72">Ashwood · Oregon · 1976</text>
  </g>
</svg>`;

const palettes = {
  city: { bg0: '#0b1224', bg1: '#101726', bg2: '#1c2437', sun0: '#eab308', sun1: '#f97316', horizon: '#0f172a', hill: '#111827', struct: '#1f2937', struct2: '#111827', struct3: '#0f172a', frame: '#0f172a', text: '#e2e8f0' },
  police: { bg0: '#11121f', bg1: '#1a1f2f', bg2: '#0d121c', sun0: '#7c3aed', sun1: '#22d3ee', horizon: '#0b1224', hill: '#0f172a', struct: '#1d4ed8', struct2: '#0ea5e9', struct3: '#0ea5e9', frame: '#1f2937', text: '#e2e8f0' },
  home: { bg0: '#120c16', bg1: '#1f1724', bg2: '#2b1b1c', sun0: '#e11d48', sun1: '#f472b6', horizon: '#2e1065', hill: '#1f1724', struct: '#b91c1c', struct2: '#9f1239', struct3: '#6b21a8', frame: '#2e1065', text: '#fde68a' },
  gas: { bg0: '#0b0f1a', bg1: '#101627', bg2: '#1e293b', sun0: '#f59e0b', sun1: '#ef4444', horizon: '#0f172a', hill: '#1e293b', struct: '#f97316', struct2: '#9a3412', struct3: '#7c2d12', frame: '#0f172a', text: '#f8fafc' },
  factory: { bg0: '#0a0d14', bg1: '#0f172a', bg2: '#111827', sun0: '#334155', sun1: '#22d3ee', horizon: '#0f172a', hill: '#111827', struct: '#0ea5e9', struct2: '#312e81', struct3: '#1f2937', frame: '#0ea5e9', text: '#e2e8f0' },
  monster: { bg0: '#0b0d17', bg1: '#0f172a', bg2: '#020617', sun0: '#10b981', sun1: '#0ea5e9', horizon: '#020617', hill: '#0b1224', struct: '#16a34a', struct2: '#047857', struct3: '#0f172a', frame: '#14532d', text: '#a7f3d0' },
};

export const images = {
  city: encode(panel('Ashwood · City Limits', 'Туман и неон у въезда', palettes.city)),
  police: encode(panel('Участок', 'Шеф Холден ждёт', palettes.police)),
  home: encode(panel('Дом Харперов', 'родители на грани', palettes.home)),
  gas: encode(panel('Заправка', 'Свидетели говорят шёпотом', palettes.gas)),
  factory: encode(panel('Завод', 'шумы в старых цехах', palettes.factory)),
  monster: encode(panel('Туманное ущелье', 'криптида вдалеке', palettes.monster)),
};

const avatarSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 360" fill="none">
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
