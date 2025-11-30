const STORAGE_KEY = 'ashwood-oregon-state-v1';

const baseDefaultState = (startSignature = null, refId = null) => ({
  startSignature,
  introDone: false,
  sceneId: 'intro',
  player: {
    name: '',
    archetype: 'Тихий аналитик',
    fear: 0,
    investigation: 0,
    moral: 0,
    inventory: [],
  },
  nftCharacter: null,
  nftFinal: null,
  farmCoins: 0,
  upgrades: {
    autoClickRate: 0,
    clickMultiplier: 1,
    passiveIncome: 0,
  },
  referrals: refId ? [{ id: refId, joinedAt: Date.now() }] : [],
  leaderboard: [
    { id: 'chief', name: 'Шеф Холден', investigation: 5, time: 780, coins: 24 },
    { id: 'ivy', name: 'Айви из архива', investigation: 3, time: 920, coins: 18 },
  ],
  createdAt: Date.now(),
});

const safeParse = (raw) => {
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn('Не удалось распарсить сохранение:', error);
    return null;
  }
};

export const resetState = (signature = null, refId = null) => {
  const state = baseDefaultState(signature, refId);
  persist(state);
  return state;
};

export const loadState = (signature = null, refId = null) => {
  if (typeof localStorage === 'undefined') return baseDefaultState(signature, refId);
  const stored = safeParse(localStorage.getItem(STORAGE_KEY));
  if (!stored || (signature && stored.startSignature !== signature)) {
    return resetState(signature, refId);
  }
  return {
    ...baseDefaultState(signature || stored.startSignature, refId),
    ...stored,
    startSignature: signature || stored.startSignature || null,
  };
};

export const persist = (state) => {
  if (typeof localStorage === 'undefined') return;
  const payload = { ...state, lastSaved: Date.now() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

export const upsertReferral = (state, refId) => {
  if (!refId) return state;
  const exists = state.referrals.some((ref) => ref.id === refId);
  if (exists) return state;
  const updated = { ...state, referrals: [...state.referrals, { id: refId, joinedAt: Date.now() }] };
  persist(updated);
  return updated;
};

export const updateLeaderboard = (state, entry) => {
  const others = state.leaderboard.filter((item) => item.id !== entry.id);
  const updated = [...others, entry].sort((a, b) => b.investigation - a.investigation || a.time - b.time).slice(0, 15);
  const nextState = { ...state, leaderboard: updated };
  persist(nextState);
  return nextState;
};
