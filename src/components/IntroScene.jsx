import { useMemo, useState } from "react";
import "../App.css";

const TARGET_POSITION = 78;
const STEP = 6;

export default function IntroScene({ onComplete }) {
  const [position, setPosition] = useState(10);
  const [direction, setDirection] = useState("right");

  const reachedStation = position >= TARGET_POSITION - 2;

  const arrowLabel = useMemo(() => {
    if (reachedStation) return "Вы у участка";
    return position < TARGET_POSITION ? "Двигайся вправо" : "Чуть назад";
  }, [position, reachedStation]);

  function move(delta) {
    setPosition((prev) => {
      const next = Math.min(92, Math.max(4, prev + delta));
      if (delta > 0) setDirection("right");
      if (delta < 0) setDirection("left");
      return next;
    });
  }

  return (
    <div className="intro-screen">
      <div className="intro-screen__header">
        <span className="intro-screen__badge">Пролог</span>
        <h1>Тебя вызывает шеф</h1>
        <p>Ты в городе Ашвуд. Идёшь к полицейскому участку, чтобы узнать детали дела.</p>
      </div>

      <div className="intro-scene">
        <div className="intro-scene__sky" />
        <div className="intro-scene__street">
          <div
            className={`intro-scene__character intro-scene__character--${direction}`}
            style={{ left: `${position}%` }}
          >
            <div className="intro-scene__avatar">🕵️</div>
            <div className="intro-scene__shadow" />
          </div>

          <div className="intro-scene__station" style={{ left: `${TARGET_POSITION}%` }}>
            <div className="intro-scene__station-shape" />
            <div className="intro-scene__station-label">Участок</div>
            {!reachedStation && <div className="intro-scene__arrow">⬅ {arrowLabel}</div>}
          </div>
        </div>
      </div>

      {!reachedStation && (
        <div className="intro-screen__hint">Стрелка показывает, куда идти. Управляй кнопками ниже.</div>
      )}

      {reachedStation && (
        <div className="intro-screen__dialog">
          <p className="intro-screen__dialog-title">Шеф</p>
          <p className="intro-screen__dialog-text">
            «Детектив! Живо в кабинет. Пропал парень по имени Дэнни Харпер. Твоё дело — вернуть его.»
          </p>
          <button className="intro-screen__cta" onClick={onComplete}>
            Принять задание и войти в кабинет
          </button>
        </div>
      )}

      <div className="intro-screen__controls">
        <button onClick={() => move(-STEP)}>◀ Влево</button>
        <div className="intro-screen__arrow-label">{arrowLabel}</div>
        <button onClick={() => move(STEP)}>Вправо ▶</button>
      </div>
    </div>
  );
}
