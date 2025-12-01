export function pickRandomNft(pool) {
  if (!Array.isArray(pool) || pool.length === 0) {
    return null;
  }

  const totalWeight = pool.reduce((acc, item) => acc + (item.weight || 1), 0);
  const roll = Math.random() * totalWeight;

  let cumulative = 0;
  for (const item of pool) {
    cumulative += item.weight || 1;
    if (roll <= cumulative) {
      return item;
    }
  }

  return pool[pool.length - 1];
}
