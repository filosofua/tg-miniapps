const sanitize = (value) => value?.toString().trim() || 'Ashwood Detective';

const wrapSvg = (title, subtitle, accent = '#f97316') => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 260" fill="none">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#0b1224" offset="0" />
      <stop stop-color="#131a2f" offset="0.5" />
      <stop stop-color="#1f2937" offset="1" />
    </linearGradient>
    <filter id="grain" x="0" y="0">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" result="noise"/>
      <feColorMatrix in="noise" type="saturate" values="0"/>
      <feBlend in="SourceGraphic" in2="noise" mode="overlay"/>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)" />
  <rect x="10" y="10" width="400" height="240" stroke="${accent}" stroke-width="5" fill="none" />
  <g filter="url(#grain)">
    <text x="28" y="76" fill="#f1f5f9" font-size="26" font-family="'Inter', 'Arial Black', sans-serif" letter-spacing="1">${title}</text>
    <text x="28" y="126" fill="#cbd5e1" font-size="18" font-family="'Inter', 'Arial', sans-serif" opacity="0.88">${subtitle}</text>
    <text x="28" y="182" fill="${accent}" font-size="16" font-family="'Inter', 'Arial', sans-serif" opacity="0.8">Ashwood, Oregon · 1976</text>
  </g>
</svg>`;

const toDataUri = (svg) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

export const generateCharacterNFT = (name, archetype, vibe, seed = Date.now()) => {
  const title = `${sanitize(name)} — ${archetype}`;
  const subtitle = `Настрой: ${vibe} · Токен ${seed}`;
  const accent = '#f97316';
  return {
    id: `ashwood-detective-${seed}`,
    name: sanitize(name),
    description: 'NFT-детектив для Ashwood, Oregon (локальное хранение).',
    image: toDataUri(wrapSvg(title, subtitle, accent)),
    attributes: [
      { trait_type: 'Archetype', value: archetype },
      { trait_type: 'Vibe', value: vibe },
      { trait_type: 'Year', value: '1976' },
    ],
    mintedAt: Date.now(),
  };
};

export const determineFinalTier = (player) => {
  const { investigation, moral, fear } = player;
  if (investigation >= 6 && moral >= 4 && fear <= 2) return 'legendary';
  if (fear >= 6) return 'common';
  if (investigation >= 4 || moral >= 3) return 'rare';
  return 'common';
};

export const generateFinalNFT = (player, finalSceneLabel = 'Финал') => {
  const tier = determineFinalTier(player);
  const accents = { common: '#22c55e', rare: '#38bdf8', legendary: '#a855f7' };
  const title = `${sanitize(player.name)} · ${finalSceneLabel}`;
  const subtitle = `Итог: ${tier.toUpperCase()} · Fear ${player.fear} / Inv ${player.investigation} / Moral ${player.moral}`;
  return {
    id: `ashwood-finale-${Date.now()}`,
    tier,
    name: `${tier} detective`,
    description: 'Финальный NFT-исход в Ashwood, Oregon (локальное хранение).',
    image: toDataUri(wrapSvg(title, subtitle, accents[tier] || '#94a3b8')),
    attributes: [
      { trait_type: 'Tier', value: tier },
      { trait_type: 'Fear', value: player.fear },
      { trait_type: 'Investigation', value: player.investigation },
      { trait_type: 'Moral', value: player.moral },
    ],
    mintedAt: Date.now(),
  };
};
