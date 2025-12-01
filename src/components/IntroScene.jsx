import React, { useEffect, useState } from 'react';
import { images } from '../assets/images';

const IntroScene = ({ onComplete }) => {
  const [position, setPosition] = useState(0);
  const [hint, setHint] = useState('Двигайся стрелками или кнопками ниже');

  useEffect(() => {
    const handler = (event) => {
      if (event.key === 'ArrowRight') move(12);
      if (event.key === 'ArrowLeft') move(-12);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  const move = (delta) => {
    setPosition((prev) => {
      const next = Math.min(100, Math.max(0, prev + delta));
      if (next >= 96) {
        setHint('Шеф ждёт. Входим.');
        setTimeout(onComplete, 450);
      }
      return next;
    });
  };

  return (
    <div className="intro-shell">
      <div className="intro-bg" style={{ backgroundImage: `url(${images.city})` }} />
      <div className="intro-overlay">
        <div className="intro-header">
          <p className="pill">Ashwood · вступление</p>
          <h1>Дойти до участка</h1>
          <p className="intro-tip">Небольшая прогулка в стиле комикса, чтобы почувствовать город.</p>
        </div>
        <div className="street">
          <div className="street-line" />
          <div className="detective" style={{ left: `${position}%` }}>🕵️‍♂️</div>
          <div className="arrow" style={{ left: `${Math.min(98, position + 6)}%` }}>→ участок</div>
        </div>
        <div className="controls">
          <button onClick={() => move(-12)}>← Влево</button>
          <button className="primary" onClick={() => move(12)}>Вправо →</button>
        </div>
        <p className="intro-tip">{hint}</p>
      </div>
    </div>
  );
};

export default IntroScene;
