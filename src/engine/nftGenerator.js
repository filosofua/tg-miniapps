const colors = ['#f97316', '#fbbf24', '#22d3ee', '#a78bfa', '#4ade80'];
const randFromSeed = (seed, mod) => (Math.abs(Math.sin(seed)) * 10000) % mod;

const wrapSvg = (body) => `data:image/svg+xml;utf8,${encodeURIComponent(body)}`;

const featureFromSeed = (seed) => {
  const coat = ['двубортное пальто', 'кожаная куртка', 'винтажный плащ'][Math.floor(randFromSeed(seed, 3))];
  const hat = ['федора', 'капюшон', 'без головного убора'][Math.floor(randFromSeed(seed + 5, 3))];
  const mood = ['холодный взгляд', 'уставший', 'на взводе'][Math.floor(randFromSeed(seed + 7, 3))];
  return { coat, hat, mood };
};

const buildPortraitLayers = (color, accent, seed) => {
  const eyeShift = randFromSeed(seed + 31, 8) - 4;
  const mouth = randFromSeed(seed + 11, 12) - 6;
  const badge = ['NOIR', 'ASHWOOD', '1976'][Math.floor(randFromSeed(seed + 13, 3))];
  const plate = ['A-76', 'N-13', 'X-22'][Math.floor(randFromSeed(seed + 19, 3))];
  return { eyeShift, mouth, badge, plate };
};

export const generateCharacterNFT = (name, archetype, vibe, seed = Date.now()) => {
  const accent = colors[Math.floor(randFromSeed(seed, colors.length))];
  const { coat, hat, mood } = featureFromSeed(seed);
  const { eyeShift, mouth, badge, plate } = buildPortraitLayers(accent, accent, seed);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 560" fill="none">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#0b1224" />
          <stop offset="1" stop-color="#020617" />
        </linearGradient>
        <linearGradient id="film" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="${accent}" stop-opacity="0.15" />
          <stop offset="1" stop-color="#0b1224" stop-opacity="0" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" rx="22" fill="url(#g)" stroke="${accent}" stroke-width="8" />
      <rect x="18" y="18" width="384" height="90" rx="16" fill="#0f172a" stroke="${accent}" stroke-width="4" opacity="0.9" />
      <text x="32" y="64" fill="#e2e8f0" font-size="22" font-family="'Space Grotesk',sans-serif">${name || 'Детектив'}</text>
      <text x="32" y="92" fill="${accent}" font-size="14" font-family="'Space Grotesk',sans-serif">${archetype} · ${vibe}</text>
      <rect x="28" y="126" width="364" height="390" rx="18" fill="#0b1224" stroke="#1f2937" />
      <rect x="32" y="130" width="356" height="382" rx="18" fill="url(#film)" opacity="0.55" />
      <g>
        <circle cx="210" cy="220" r="96" fill="#0f172a" stroke="${accent}" stroke-width="5" />
        <path d="M138 242 Q210 190 282 242" stroke="#e2e8f0" stroke-width="7" fill="none" opacity="0.8" />
        <path d="M174 216 C190 206 230 206 246 216" stroke="#e2e8f0" stroke-width="4" opacity="0.8" />
        <circle cx="182" cy="222" r="14" fill="#e2e8f0" />
        <circle cx="238" cy="222" r="14" fill="#e2e8f0" />
        <circle cx="182" cy="222" r="6" fill="#0b1224" transform="translate(${eyeShift} 0)" />
        <circle cx="238" cy="222" r="6" fill="#0b1224" transform="translate(${eyeShift * -1} 0)" />
        <path d="M180 260 Q210 ${262 + mouth} 240 260" stroke="#f97316" stroke-width="4" fill="none" />
        <path d="M158 188 Q210 170 262 188" stroke="#e2e8f0" stroke-width="4" opacity="0.7" />
        <path d="M142 280 Q210 310 278 280" stroke="#e2e8f0" stroke-width="6" opacity="0.45" />
      </g>
      <g>
        <rect x="118" y="300" width="184" height="120" rx="30" fill="#0f172a" stroke="${accent}" stroke-width="5" />
        <text x="50%" y="360" fill="#e2e8f0" font-size="18" font-family="'Space Grotesk',sans-serif" text-anchor="middle">${coat}</text>
        <text x="50%" y="388" fill="#94a3b8" font-size="14" font-family="'Space Grotesk',sans-serif" text-anchor="middle">${hat}</text>
      </g>
      <g>
        <rect x="46" y="434" width="328" height="84" rx="14" fill="#0f172a" stroke="#1f2937" />
        <text x="60" y="468" fill="#e2e8f0" font-size="16" font-family="'Space Grotesk',sans-serif">${mood}</text>
        <text x="60" y="492" fill="#94a3b8" font-size="12" font-family="'Space Grotesk',sans-serif">${badge} · ${plate}</text>
        <text x="360" y="492" fill="${accent}" font-size="16" font-family="'Space Grotesk',sans-serif" text-anchor="end">seed:${seed}</text>
      </g>
    </svg>
  `;

  return {
    name: `${name || 'Detective'} of Ashwood`,
    description: `${archetype} · настроение: ${vibe}`,
    image: wrapSvg(svg),
    attributes: [
      { trait_type: 'Archetype', value: archetype },
      { trait_type: 'Vibe', value: vibe },
      { trait_type: 'Coat', value: coat },
      { trait_type: 'Headwear', value: hat },
      { trait_type: 'Mood', value: mood },
      { trait_type: 'Badge', value: badge },
      { trait_type: 'Plate', value: plate },
      { trait_type: 'Seed', value: seed },
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
