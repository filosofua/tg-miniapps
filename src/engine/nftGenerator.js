const colors = ['#f97316', '#fbbf24', '#22d3ee', '#a78bfa', '#4ade80'];
const randFromSeed = (seed, mod) => (Math.abs(Math.sin(seed)) * 10000) % mod;

const wrapSvg = (body) => `data:image/svg+xml;utf8,${encodeURIComponent(body)}`;

export const generateCharacterNFT = (name, archetype, vibe, seed = Date.now()) => {
  const color = colors[Math.floor(randFromSeed(seed, colors.length))];
  const badge = ['NOIR', 'ASHWOOD', '1976'][Math.floor(randFromSeed(seed + 13, 3))];
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 560" fill="none">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#0b1224" />
          <stop offset="1" stop-color="#020617" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" rx="22" fill="url(#g)" stroke="${color}" stroke-width="8" />
      <circle cx="210" cy="160" r="92" fill="#0f172a" stroke="${color}" stroke-width="6" />
      <rect x="120" y="270" width="180" height="170" rx="26" fill="#0b1224" stroke="${color}" stroke-width="5" />
      <path d="M140 320 Q210 360 280 320" stroke="#e2e8f0" stroke-width="5" fill="none" opacity="0.8" />
      <text x="50%" y="470" fill="#e2e8f0" font-size="26" font-family="'Space Grotesk',sans-serif" text-anchor="middle">${
        name || 'Detective'
      }</text>
      <text x="50%" y="510" fill="${color}" font-size="18" font-family="'Space Grotesk',sans-serif" text-anchor="middle">${archetype}</text>
      <text x="32" y="56" fill="#e2e8f0" font-size="16" font-family="'Space Grotesk',sans-serif">${vibe}</text>
      <text x="360" y="56" fill="${color}" font-size="16" font-family="'Space Grotesk',sans-serif" text-anchor="end">${badge}</text>
    </svg>
  `;

  return {
    name: `${name || 'Detective'} of Ashwood`,
    description: `${archetype} · настроение: ${vibe}`,
    image: wrapSvg(svg),
    attributes: [
      { trait_type: 'Archetype', value: archetype },
      { trait_type: 'Vibe', value: vibe },
      { trait_type: 'Badge', value: badge },
    ],
  };
};

const tierFromStats = (player) => {
  const score = player.investigation * 2 + player.moral - player.fear;
  if (score >= 10) return 'legendary';
  if (score >= 5) return 'rare';
  return 'common';
};

export const generateFinalNFT = (player, label = 'finale') => {
  const tier = tierFromStats(player);
  const palette = {
    common: '#94a3b8',
    rare: '#22d3ee',
    legendary: '#f97316',
  }[tier];
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 360" fill="none">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#0f172a" />
          <stop offset="1" stop-color="#020617" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" rx="18" fill="url(#bg)" stroke="${palette}" stroke-width="7" />
      <text x="24" y="56" fill="${palette}" font-size="22" font-family="'Space Grotesk',sans-serif">Ashwood · Final</text>
      <text x="24" y="98" fill="#e2e8f0" font-size="18" font-family="'Space Grotesk',sans-serif">${label}</text>
      <text x="24" y="140" fill="#e2e8f0" font-size="16" font-family="'Space Grotesk',sans-serif">Fear: ${player.fear}</text>
      <text x="24" y="172" fill="#e2e8f0" font-size="16" font-family="'Space Grotesk',sans-serif">Investigation: ${player.investigation}</text>
      <text x="24" y="204" fill="#e2e8f0" font-size="16" font-family="'Space Grotesk',sans-serif">Moral: ${player.moral}</text>
      <text x="24" y="248" fill="#cbd5e1" font-size="14" font-family="'Space Grotesk',sans-serif">Inventory: ${
        player.inventory.join(', ') || 'пусто'
      }</text>
      <text x="94%" y="92%" fill="${palette}" font-size="22" font-family="'Space Grotesk',sans-serif" text-anchor="end">${tier.toUpperCase()}</text>
    </svg>
  `;

  return {
    name: `Ashwood Finale — ${tier}`,
    description: 'Локальный NFT-финал по результату прохождения комикса.',
    image: wrapSvg(svg),
    tier,
    attributes: [
      { trait_type: 'Tier', value: tier },
      { trait_type: 'Fear', value: player.fear },
      { trait_type: 'Investigation', value: player.investigation },
      { trait_type: 'Moral', value: player.moral },
      { trait_type: 'Final Label', value: label },
    ],
  };
};
