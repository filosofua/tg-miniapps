import { useEffect, useMemo, useState } from "react";

const STEP = 1;
const PARALLAX_LAYERS = [
  { src: "/assets/valiant/parallax-sky.svg", depth: 0.12, opacity: 0.9 },
  { src: "/assets/valiant/parallax-woods.svg", depth: 0.24, opacity: 0.9 }
];

export default function WorldScene({
  zones,
  unlockedScenes,
  completedScenes,
  position,
  zoneFindings,
  onMove,
  onEnterScene,
  onScoutZone,
  nextSceneId,
  player,
  onResetStory
}) {
  const clampedPosition = Math.max(0, Math.min(zones.length - 1, position || 0));
  const currentZone = zones[clampedPosition];
  const [scoutMessage, setScoutMessage] = useState(null);
  const [touchStartX, setTouchStartX] = useState(null);

  useEffect(() => {
    setScoutMessage(null);
  }, [currentZone.id]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onMove(clampedPosition - STEP);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        onMove(clampedPosition + STEP);
      }
    }

    window.addEventListener("keydown", onKey, { passive: false });
    return () => window.removeEventListener("keydown", onKey);
  }, [clampedPosition, onMove]);

  const isUnlocked = useMemo(() => {
    return unlockedScenes?.includes(currentZone.sceneId);
  }, [currentZone.sceneId, unlockedScenes]);

  const zoneCompleted = completedScenes?.includes(currentZone.sceneId);
  const completedLabel = zoneCompleted ? "(пройдено)" : "";
  const isCurrentTarget = nextSceneId === currentZone.sceneId;
  const canEnter = isUnlocked && !zoneCompleted && isCurrentTarget;

  const scouted = zoneFindings?.[currentZone.id];

  const progress = zones.length > 1 ? clampedPosition / (zones.length - 1) : 0;

  return (
    <div
      className="world"
      onTouchStart={(e) => setTouchStartX(e.touches?.[0]?.clientX || null)}
      onTouchEnd={(e) => {
        if (touchStartX === null) return;
        const delta = (e.changedTouches?.[0]?.clientX || 0) - touchStartX;
        if (Math.abs(delta) > 40) {
          onMove(clampedPosition + (delta > 0 ? -STEP : STEP));
        }
        setTouchStartX(null);
      }}
    >
      <div className="world__parallax">
        {PARALLAX_LAYERS.map((layer, idx) => (
          <div
            key={layer.src}
            className="world__parallax-layer"
            style={{
              backgroundImage: `url(${layer.src})`,
              opacity: layer.opacity,
              transform: `translateX(${(0.5 - progress) * layer.depth * 120}%)`
            }}
            aria-hidden
          />
        ))}
      </div>
      <div className="world__backdrop" style={{ backgroundImage: `url(${currentZone.backdrop})` }} />
      <div className="world__grain" aria-hidden />
      <header className="world__header">
        <div>
          <p className="world__eyebrow">Город Ашвуд • 1976</p>
          <h1 className="world__title">Передвижение по городу</h1>
          <p className="world__lead">
            Используй стрелки, свайпы или кнопки, чтобы двигаться по улице и
            добираться до локаций. Нажми «Войти», чтобы открыть сюжетную сцену.
            Узлы открываются строго по сюжету, как в Valiant Hearts.
          </p>
        </div>
        <div className="world__status">
          <div className="world__status-line">Детектив: {player.name || "..."}</div>
          <div className="world__status-line">Очки расследования: {player.points}</div>
          <div className="world__status-line">Страх: {player.fear} • Расследование: {player.investigation}</div>
        </div>
      </header>

      <div className="world__track">
        <div className="world__path" aria-hidden />
        {zones.map((zone, idx) => {
          const unlocked = unlockedScenes?.includes(zone.sceneId);
          const done = completedScenes?.includes(zone.sceneId);
          const active = idx === clampedPosition;

          return (
            <div
              key={zone.id}
              className={`world__node ${active ? "world__node--active" : ""} ${
                unlocked ? "world__node--unlocked" : ""
              } ${done ? "world__node--done" : ""}`}
              style={{ left: `${zone.position}%` }}
            >
              <div className="world__node-dot" />
              <div className="world__node-label">{zone.label}</div>
            </div>
          );
        })}

        <div className="world__character" style={{ left: `${currentZone.position}%` }}>
          <div className="world__avatar" aria-hidden>
            <span role="img" aria-label="detective">
              🕵️
            </span>
          </div>
          <div className="world__shadow" />
        </div>
      </div>

      <div className="world__panel" style={{ background: currentZone.tone }}>
        <p className="world__panel-eyebrow">Точка маршрута #{clampedPosition + 1}</p>
        <h2 className="world__panel-title">
          {currentZone.label} {completedLabel}
        </h2>
        <p className="world__panel-desc">{currentZone.description}</p>

        <div className="world__scout">
          <div>
            <p className="world__scout-title">Осмотреть окружение</p>
            <p className="world__scout-text">
              {currentZone.scoutReward?.text ||
                "Ищи улики, чтобы получить очки расследования и предметы."}
            </p>
          </div>
          <button
            className="world__scout-btn"
            disabled={!isUnlocked || scouted}
            onClick={() => {
              const reward = onScoutZone?.(currentZone.id);
              if (!reward) return;
              setScoutMessage(
                `+${reward.points || 0} очков, +${reward.investigation || 0} расследование${
                  reward.item ? `, предмет: ${reward.item}` : ""
                }${reward.fear ? `, страх ${reward.fear > 0 ? "+" : ""}${reward.fear}` : ""}`
              );
            }}
          >
            {scouted ? "Улики собраны" : "Собрать улики"}
          </button>
        </div>

        {scoutMessage && <div className="world__scout-toast">{scoutMessage}</div>}

        <div className="world__controls">
          <button
            onClick={() => onMove(clampedPosition - STEP)}
            disabled={clampedPosition === 0}
          >
            ◀ Влево
          </button>
          <div className="world__controls-meta">
            {zoneCompleted && "Сцена пройдена"}
            {!zoneCompleted && !isUnlocked && "Пока закрыто"}
            {!zoneCompleted && isUnlocked && !isCurrentTarget && "Открой новую цель"}
            {canEnter && "Можно войти"}
            {isCurrentTarget && " • Следующая цель"}
          </div>
          <button
            onClick={() => onMove(clampedPosition + STEP)}
            disabled={clampedPosition === zones.length - 1}
          >
            Вправо ▶
          </button>
        </div>

        <button
          className="world__cta"
          disabled={!canEnter}
          onClick={() => onEnterScene(currentZone.sceneId)}
        >
          {zoneCompleted ? "Сцена уже пройдена" : "Войти в сцену"}
        </button>

        <div className="world__meta-row">
          <span className="world__meta">Сцены пройдены: {completedScenes?.length || 0}</span>
          <button className="world__reset" onClick={onResetStory}>
            Сбросить историю
          </button>
        </div>
      </div>
    </div>
  );
}
