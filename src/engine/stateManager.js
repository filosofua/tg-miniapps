const STORAGE_KEY = 'ashwood-oregon-state-v2';

const defaultLeaderboard = [
  { id: 'chief', name: 'Шеф Холден', investigation: 6, time: 780, coins: 28 },
  { id: 'ivy', name: 'Айви из архива', investigation: 4, time: 920, coins: 18 },
  { id: 'rookie', name: 'Стажёр Бак', investigation: 2, time: 1080, coins: 9 },
];

const createBaseState = (signature = null, refId = null) => ({
  startSignature: signature,
  introDone: false,
  sceneId: 'intro',
  sceneStep: 0,
  player: {
    name: '',
    archetype: 'Интуитивный сыщик',
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
  leaderboard: defaultLeaderboard,
  createdAt: Date.now(),
  runId: Date.now(),
});

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn('Не удалось распарсить сохранение', error);
    return null;
  }
};

export const persist = (state) => {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, lastSaved: Date.now() }));
};

export const resetState = (signature = null, refId = null) => {
  const fresh = createBaseState(signature, refId);
  persist(fresh);
  return fresh;
};

export const loadState = (signature = null, refId = null) => {
  if (typeof localStorage === 'undefined') return createBaseState(signature, refId);
  const stored = safeParse(localStorage.getItem(STORAGE_KEY));
  if (!stored) return resetState(signature, refId);

  const signatureChanged = signature && stored.startSignature !== signature;
  if (signatureChanged) return resetState(signature, refId);

  const mergedReferrals = refId
    ? stored.referrals?.some((ref) => ref.id === refId)
      ? stored.referrals
      : [...(stored.referrals || []), { id: refId, joinedAt: Date.now() }]
    : stored.referrals || [];

  return {
    ...createBaseState(signature || stored.startSignature, refId),
    ...stored,
    startSignature: signature || stored.startSignature || null,
    referrals: mergedReferrals,
  };
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
  const list = state.leaderboard.filter((item) => item.id !== entry.id);
  const updated = [...list, entry].sort((a, b) => b.investigation - a.investigation || a.time - b.time).slice(0, 20);
  const nextState = { ...state, leaderboard: updated };
  persist(nextState);
  return nextState;
};

export const applyDelta = (state, delta = {}) => {
  if (!delta) return state;
  const { fear = 0, investigation = 0, moral = 0, item } = delta;
  const inventory = item ? [...state.player.inventory, item] : state.player.inventory;
  const next = {
    ...state,
    player: {
      ...state.player,
      fear: state.player.fear + fear,
      investigation: state.player.investigation + investigation,
      moral: state.player.moral + moral,
      inventory,
    },
  };
  persist(next);
  return next;
};
