// src/ClickerFarm.jsx
import { useEffect, useMemo, useState } from "react";

function buildInitialFarmState(initialCoins) {
  return {
    coins: Math.max(initialCoins || 0, 0),
    level: 1,
    incomePerTick: 1, // сколько монет в секунду капает
    clickBonus: 1
  };
}

export default function ClickerFarm({
  playerName,
  starterNft,
  finalNft,
  initialCoins = 0,
  onResetStory
}) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem("ashwood_farm_state");
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...buildInitialFarmState(initialCoins),
          ...parsed,
          coins: Math.max(parsed.coins ?? 0, initialCoins ?? 0)
        };
      }
    } catch (e) {
      console.error(e);
    }
    return buildInitialFarmState(initialCoins);
  });

  // авто-фарм каждую секунду
  useEffect(() => {
    const id = setInterval(() => {
      setState((prev) => ({
        ...prev,
        coins: prev.coins + prev.incomePerTick
      }));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // сохраняем farm state
  useEffect(() => {
    try {
      localStorage.setItem("ashwood_farm_state", JSON.stringify(state));
    } catch (e) {
      console.error(e);
    }
  }, [state]);

  const canUpgradeIncome = state.coins >= 50;
  const canUpgradeClick = state.coins >= 30;

  const badges = useMemo(() => {
    return [starterNft, finalNft].filter(Boolean);
  }, [starterNft, finalNft]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "#e5e7eb",
        padding: 20,
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      }}
    >
      <h1 style={{ marginBottom: 8 }}>Ashwood Bureau: Фарм режим</h1>
      <p style={{ marginBottom: 16 }}>
        История расследования завершена. {playerName || "Детектив"}, теперь ты
        управляешь собственным бюро — фарми ресурсы для будущих дел.
      </p>

      {badges.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 16
          }}
        >
          {badges.map((badge) => (
            <div
              key={badge.id}
              style={{
                border: "1px solid #334155",
                borderRadius: 12,
                padding: "10px 12px",
                background: "rgba(51, 65, 85, 0.2)",
                fontSize: 13
              }}
            >
              <div style={{ fontWeight: 700 }}>{badge.name}</div>
              <div style={{ opacity: 0.7 }}>rarity: {badge.rarity}</div>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          marginBottom: 16,
          padding: 16,
          borderRadius: 12,
          border: "1px solid #1e293b",
          background: "#020617"
        }}
      >
        <p style={{ marginBottom: 8 }}>Монеты бюро: {state.coins}</p>
        <p style={{ marginBottom: 8 }}>Уровень: {state.level}</p>
        <p style={{ marginBottom: 8 }}>
          Пассивный доход: {state.incomePerTick} монет/сек
        </p>
        <p style={{ marginBottom: 16 }}>
          Бонус за клик: +{state.clickBonus} монет
        </p>

        <button
          onClick={() =>
            setState((prev) => ({
              ...prev,
              coins: prev.coins + prev.clickBonus
            }))
          }
          style={{
            padding: "12px 24px",
            borderRadius: 999,
            border: "none",
            fontSize: 16,
            cursor: "pointer",
            marginBottom: 16
          }}
        >
          Сделать запись в досье (+монеты)
        </button>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button
            disabled={!canUpgradeIncome}
            onClick={() =>
              setState((prev) => ({
                ...prev,
                coins: prev.coins - 50,
                incomePerTick: prev.incomePerTick + 1,
                level: prev.level + 1
              }))
            }
          >
            Улучшить бюро (+1 монета/сек, -50 монет)
          </button>

          <button
            disabled={!canUpgradeClick}
            onClick={() =>
              setState((prev) => ({
                ...prev,
                coins: prev.coins - 30,
                clickBonus: prev.clickBonus + 1
              }))
            }
          >
            Прокачать досье (+1 монета за клик, -30 монет)
          </button>
        </div>
      </div>

      <div style={{ fontSize: 12, opacity: 0.7, marginTop: 16 }}>
        В будущем здесь можно будет подвязать NFT / токен и вывод наград.
      </div>

      <button
        style={{
          marginTop: 16,
          fontSize: 12,
          opacity: 0.8,
          textDecoration: "underline",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: 0
        }}
        onClick={onResetStory}
      >
        Сбросить прогресс истории и пройти сюжет заново
      </button>
    </div>
  );
}
