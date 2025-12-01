import { useEffect, useMemo, useState } from "react";

function generateRefId() {
  return Math.random().toString(36).slice(2, 8);
}

function buildInitialFarmState(initialCoins) {
  return {
    coins: Math.max(initialCoins || 0, 0),
    level: 1,
    incomePerTick: 1,
    clickBonus: 1,
    referrals: {
      myRefId: generateRefId(),
      referredBy: "",
      referredFriends: []
    },
    leaderboard: []
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

  const [referralInput, setReferralInput] = useState("");
  const [friendName, setFriendName] = useState("");

  useEffect(() => {
    const id = setInterval(() => {
      setState((prev) => ({
        ...prev,
        coins: prev.coins + prev.incomePerTick
      }));
    }, 1000);

    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("ashwood_farm_state", JSON.stringify(state));
    } catch (e) {
      console.error(e);
    }
  }, [state]);

  useEffect(() => {
    setState((prev) => {
      const leaderboardWithoutPlayer = (prev.leaderboard || []).filter(
        (entry) => entry.name !== (playerName || "Детектив")
      );

      const updated = [
        ...leaderboardWithoutPlayer,
        {
          name: playerName || "Детектив",
          coins: prev.coins,
          points: initialCoins
        }
      ].sort((a, b) => b.coins - a.coins);

      return { ...prev, leaderboard: updated };
    });
  }, [playerName, state.coins, initialCoins]);

  function handleAddReferral(name) {
    if (!name.trim()) return;
    setState((prev) => {
      const unique = new Set(prev.referrals?.referredFriends || []);
      unique.add(name.trim());
      return {
        ...prev,
        referrals: {
          ...prev.referrals,
          referredFriends: Array.from(unique)
        }
      };
    });
  }

  function handleSetReferredBy(code) {
    setState((prev) => ({
      ...prev,
      referrals: {
        ...prev.referrals,
        referredBy: code
      }
    }));
  }

  const canUpgradeIncome = state.coins >= 50;
  const canUpgradeClick = state.coins >= 30;

  const badges = useMemo(() => [starterNft, finalNft].filter(Boolean), [finalNft, starterNft]);

  const referralLink = useMemo(
    () => `t.me/ashwood_bot?start=${state.referrals.myRefId}`,
    [state.referrals.myRefId]
  );

  return (
    <div className="farm">
      <header className="farm__hero">
        <div>
          <p className="farm__eyebrow">Ashwood Coin Farm</p>
          <h1 className="farm__title">Бюро расследований в пост-игре</h1>
          <p className="farm__lead">
            Монеты начисляются за клики и пассивный доход. Стартовый баланс — твои
            сюжетные очки: {initialCoins}. Сохраняется локально.
          </p>
          {badges.length > 0 && (
            <div className="farm__badges">
              {badges.map((badge) => (
                <div key={badge.id} className="farm__badge">
                  {badge.image && (
                    <img
                      src={badge.image}
                      alt={badge.name}
                      className="farm__badge-art"
                      loading="lazy"
                    />
                  )}
                  <div className="farm__badge-title">{badge.name}</div>
                  <div className="farm__badge-meta">rarity: {badge.rarity}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="farm__hero-panel">
          <p className="farm__hero-label">Детектив</p>
          <p className="farm__hero-name">{playerName || "Неизвестный"}</p>
          <p className="farm__hero-meta">Уровень: {state.level}</p>
          <p className="farm__hero-meta">Пассивный доход: {state.incomePerTick} / сек</p>
          <p className="farm__hero-meta">Бонус за клик: +{state.clickBonus}</p>
        </div>
      </header>

      <div className="farm__grid">
        <section className="farm__card farm__card--primary">
          <div className="farm__stat">Монеты бюро: {state.coins}</div>
          <div className="farm__stat">Уровень агента: {state.level}</div>
          <p className="farm__muted">Монеты копятся автоматически каждую секунду.</p>

          <button
            className="farm__cta"
            onClick={() =>
              setState((prev) => ({
                ...prev,
                coins: prev.coins + prev.clickBonus
              }))
            }
          >
            Сделать запись в досье (+{state.clickBonus} монет)
          </button>
        </section>

        <section className="farm__card">
          <div className="farm__card-header">
            <h3>Улучшения бюро</h3>
            <p className="farm__muted">Расширяй доход и клики, чтобы обогнать друзей.</p>
          </div>
          <div className="farm__upgrades">
            <button
              className="farm__upgrade"
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
              <div>
                <p className="farm__upgrade-title">+1 монета/сек</p>
                <p className="farm__upgrade-meta">Стоимость: 50 монет</p>
              </div>
              <span className="farm__pill">Купить</span>
            </button>

            <button
              className="farm__upgrade"
              disabled={!canUpgradeClick}
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  coins: prev.coins - 30,
                  clickBonus: prev.clickBonus + 1
                }))
              }
            >
              <div>
                <p className="farm__upgrade-title">+1 монета за клик</p>
                <p className="farm__upgrade-meta">Стоимость: 30 монет</p>
              </div>
              <span className="farm__pill">Купить</span>
            </button>
          </div>
        </section>

        <section className="farm__card farm__card--referral">
          <div className="farm__card-header">
            <h3>Реферальная система</h3>
            <p className="farm__muted">Делись ссылкой и отмечай, кто привёл тебя.</p>
          </div>
          <div className="farm__ref-row">
            <p className="farm__muted">Твоя ссылка</p>
            <div className="farm__ref-link">{referralLink}</div>
          </div>

          <label className="farm__field">
            <span>Пригласивший тебя (start-код)</span>
            <input
              className="farm__input"
              type="text"
              placeholder="например, 4fj9sa"
              value={referralInput}
              onChange={(e) => {
                setReferralInput(e.target.value);
                handleSetReferredBy(e.target.value);
              }}
            />
          </label>

          <label className="farm__field">
            <span>Добавить приглашённого друга</span>
            <div className="farm__input-row">
              <input
                className="farm__input"
                type="text"
                placeholder="Имя друга"
                value={friendName}
                onChange={(e) => setFriendName(e.target.value)}
              />
              <button
                type="button"
                className="farm__pill farm__pill--action"
                onClick={() => {
                  handleAddReferral(friendName);
                  setFriendName("");
                }}
              >
                Добавить
              </button>
            </div>
          </label>

          <div className="farm__chips">
            {(state.referrals.referredFriends || []).length === 0 && (
              <span className="farm__muted">Пока никого</span>
            )}
            {state.referrals.referredFriends.map((friend) => (
              <span key={friend} className="farm__chip">
                {friend}
              </span>
            ))}
          </div>
        </section>

        <section className="farm__card farm__card--leaderboard">
          <div className="farm__card-header">
            <h3>Локальный лидерборд</h3>
            <p className="farm__muted">Сортировка по монетам фарма. Очки сюжета фиксируются при входе.</p>
          </div>
          <div className="farm__leaderboard">
            {state.leaderboard.map((entry, idx) => (
              <div key={entry.name + idx} className="farm__leaderboard-row">
                <div>
                  <div className="farm__leaderboard-name">
                    #{idx + 1} {entry.name}
                  </div>
                  <div className="farm__leaderboard-meta">Очки сюжета: {entry.points}</div>
                </div>
                <div className="farm__leaderboard-score">{entry.coins} 💰</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="farm__footer">
        <button className="farm__reset" onClick={onResetStory}>
          Сбросить прогресс истории и пройти сюжет заново
        </button>
        <p className="farm__muted">В будущих версиях здесь появится привязка к NFT/токенам.</p>
      </footer>
    </div>
  );
}
