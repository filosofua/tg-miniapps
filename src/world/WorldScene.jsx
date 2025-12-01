import { useMemo } from "react";

const STEP = 1;

export default function WorldScene({
  zones,
  unlockedScenes,
  completedScenes,
  position,
  onMove,
  onEnterScene,
  nextSceneId,
  player,
  onResetStory
}) {
  const clampedPosition = Math.max(0, Math.min(zones.length - 1, position || 0));
  const currentZone = zones[clampedPosition];

  const isUnlocked = useMemo(() => {
    return unlockedScenes?.includes(currentZone.sceneId);
  }, [currentZone.sceneId, unlockedScenes]);

  const completedLabel = completedScenes?.includes(currentZone.sceneId)
    ? "(пройдено)"
    : "";

  return (
    <div className="world">
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

        <div className="world__controls">
          <button
            onClick={() => onMove(clampedPosition - STEP)}
            disabled={clampedPosition === 0}
          >
            ◀ Влево
          </button>
          <div className="world__controls-meta">
            {isUnlocked ? "Можно войти" : "Пока закрыто"}
            {nextSceneId === currentZone.sceneId && " • Следующая цель"}
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
          disabled={!isUnlocked}
          onClick={() => onEnterScene(currentZone.sceneId)}
        >
          Войти в сцену
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
