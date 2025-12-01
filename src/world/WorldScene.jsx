import { useEffect, useMemo, useState } from "react";

const STEP = 1;

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

  useEffect(() => {
    setScoutMessage(null);
  }, [currentZone.id]);

  const isUnlocked = useMemo(() => {
    return unlockedScenes?.includes(currentZone.sceneId);
  }, [currentZone.sceneId, unlockedScenes]);

  const zoneCompleted = completedScenes?.includes(currentZone.sceneId);
  const completedLabel = zoneCompleted ? "(пройдено)" : "";
  const isCurrentTarget = nextSceneId === currentZone.sceneId;
  const canEnter = isUnlocked && !zoneCompleted && isCurrentTarget;

  const scouted = zoneFindings?.[currentZone.id];

  return (
    <div className="world">
      <div className="world__backdrop" style={{ backgroundImage: `url(${currentZone.backdrop})` }} />
      <div className="world__grain" aria-hidden />
      <header className="world__header">
        <div>
          <p className="world__eyebrow">Город Ашвуд • 1976</p>
          <h1 className="world__title">Передвижение по городу</h1>
          <p className="world__lead">
            Используй стрелки, чтобы добраться до локаций. Нажми «Войти», чтобы
            открыть сюжетную сцену. Уровни открываются по мере прохождения.
          </p>
        </div>
        <div className="world__status">
          <div className="world__status-line">Детектив: {player.name || "..."}</div>
          <div className="world__status-line">Очки расследования: {player.points}</div>
          <div className="world__status-line">Страх: {player.fear} • Расследование: {player.investigation}</div>
        </div>
      </header>

      <div className="world__track">
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
