import { useEffect, useMemo, useState } from "react";

function getRandomPoints(option) {
  if (
    typeof option?.minPoints === "number" &&
    typeof option?.maxPoints === "number"
  ) {
    const min = Math.min(option.minPoints, option.maxPoints);
    const max = Math.max(option.minPoints, option.maxPoints);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  return null;
}

export default function SceneRenderer({ sceneData, onNextScene, updatePlayer, player, backdrop }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [lastPoints, setLastPoints] = useState(null);
  const step = sceneData.steps[stepIndex];

  const hasChoice = useMemo(() => step?.type === "choice", [step]);

  useEffect(() => {
    setStepIndex(0);
    setLastPoints(null);
  }, [sceneData]);

  useEffect(() => {
    if (stepIndex >= sceneData.steps.length) {
      onNextScene(sceneData.defaultNext ?? 0);
    }
  }, [onNextScene, sceneData, stepIndex]);

  function next(optionIndex = null) {
    if (!step) return;
    // если это выбор
    if (optionIndex !== null) {
      const option = step.options[optionIndex];
      const awardedPoints = getRandomPoints(option);

      if (option.fear) updatePlayer("fear", option.fear);
      if (option.investigation) updatePlayer("investigation", option.investigation);
      if (option.item) updatePlayer("inventory", option.item);
      if (awardedPoints) {
        updatePlayer("points", awardedPoints);
        setLastPoints(awardedPoints);
      } else {
        setLastPoints(null);
      }

      if (option.nextScene) {
        onNextScene(option.nextScene);
        setStepIndex(0);
        return;
      }

      if (typeof option.next === "number") {
        setStepIndex(option.next);
        return;
      }
    } else {
      // обычный переход
      setLastPoints(null);
      if (step.nextScene) {
        onNextScene(step.nextScene);
        setStepIndex(0);
        return;
      }
      setStepIndex((i) => i + 1);
    }
  }

  return (
    <div className="scene">
      <div className="scene__hud">
        <div>
          <p className="scene__eyebrow">Сцена {sceneData.id}</p>
          <h2 className="scene__title">{sceneData.title}</h2>
          <div className="scene__progress">
            <div className="scene__progress-bar" style={{ width: `${((stepIndex + 1) / sceneData.steps.length) * 100}%` }} />
            <span>
              Шаг {Math.min(stepIndex + 1, sceneData.steps.length)} / {sceneData.steps.length}
            </span>
          </div>
        </div>
        <div className="scene__meta">
          <div className="scene__stat">Очки: {player?.points ?? 0}</div>
          <div className="scene__stat">Страх: {player?.fear ?? 0}</div>
          <div className="scene__stat">Расследование: {player?.investigation ?? 0}</div>
          <div className="scene__stat">Инвентарь: {player?.inventory?.length || 0}</div>
        </div>
      </div>

      <div className="scene__stage">
        {backdrop && (
          <div
            className="scene__backdrop"
            style={{ backgroundImage: `url(${backdrop})` }}
            aria-hidden
          />
        )}
        <div className="scene__grain" aria-hidden />
        <div className="scene__panel">
          {hasChoice && lastPoints !== null && (
            <div className="scene__ribbon">+{lastPoints} очков расследования</div>
          )}

          {step?.type === "dialogue" && (
            <div className="scene__bubble">
              <div className="scene__bubble-avatar" aria-hidden>
                <span role="img" aria-label="character">
                  💬
                </span>
              </div>
              <div>
                <p className="scene__speaker">{step.character}</p>
                <p className="scene__text">{step.text}</p>
              </div>
              <button className="scene__cta" onClick={() => next()}>
                Далее
              </button>
            </div>
          )}

          {step?.type === "choice" && (
            <div className="scene__choice">
              <p className="scene__choice-text">{step.text}</p>
              <div className="scene__options">
                {step.options.map((o, i) => {
                  const meta = [
                    typeof o.minPoints === "number" && typeof o.maxPoints === "number"
                      ? `+${o.minPoints}–${o.maxPoints} очков`
                      : null,
                    o.fear ? `Страх ${o.fear > 0 ? "+" : ""}${o.fear}` : null,
                    o.investigation
                      ? `Расследование ${o.investigation > 0 ? "+" : ""}${o.investigation}`
                      : null,
                    o.item ? `Предмет: ${o.item}` : null
                  ].filter(Boolean);

                  return (
                    <button key={i} className="scene__option" onClick={() => next(i)}>
                      <span className="scene__option-label">{o.label}</span>
                      {meta.length > 0 && <span className="scene__option-meta">{meta.join(" • ")}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step?.type === "add_item" && (
            <div className="scene__item-card">
              <div className="scene__item-icon" aria-hidden>
                🗂️
              </div>
              <div>
                <p className="scene__item-label">Новая улика</p>
                <p className="scene__item-title">{step.item}</p>
              </div>
              <button className="scene__cta" onClick={() => next()}>
                Далее
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
