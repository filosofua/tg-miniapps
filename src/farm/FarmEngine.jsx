import React, { useEffect, useRef, useState } from 'react';
import FarmUI from './FarmUI';

const UPGRADE_COSTS = {
  autoClickRate: 20,
  clickMultiplier: 30,
  passiveIncome: 25,
};

const FarmEngine = ({ state, onUpdate, onExit }) => {
  const [coins, setCoins] = useState(state.farmCoins || 0);
  const [upgrades, setUpgrades] = useState(state.upgrades || {});
  const timerRef = useRef(null);

  useEffect(() => {
    onUpdate({ farmCoins: coins, upgrades });
  }, [coins, upgrades, onUpdate]);

  useEffect(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCoins((prev) => prev + (upgrades.passiveIncome || 0) + (upgrades.autoClickRate || 0));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [upgrades.passiveIncome, upgrades.autoClickRate]);

  const handleClick = () => setCoins((prev) => prev + (upgrades.clickMultiplier || 1));

  const handleUpgrade = (type) => {
    const cost = UPGRADE_COSTS[type] || 10;
    if (coins < cost) return;
    setCoins((prev) => prev - cost);
    setUpgrades((prev) => ({ ...prev, [type]: (prev[type] || 0) + 1 }));
  };

  return <FarmUI coins={coins} upgrades={upgrades} onClick={handleClick} onUpgrade={handleUpgrade} onExit={onExit} />;
};

export default FarmEngine;
