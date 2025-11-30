import React, { useEffect, useState } from 'react';
import { images } from '../assets/images';

const IntroScene = ({ onComplete }) => {
  const [position, setPosition] = useState(10);
  const target = 88;

  const move = (delta) => setPosition((prev) => Math.min(100, Math.max(0, prev + delta)));

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') move(6);
      if (e.key === 'ArrowLeft') move(-6);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (position >= target) {
      const timeout = setTimeout(onComplete, 600);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [position, onComplete, target]);

  const bgStyle = {
    backgroundImage: `radial-gradient(circle at 10% 20%, rgba(249,115,22,0.15), transparent 30%), url(${images.city})`,
  };

  return (
    <div className="intro-shell">
      <div className="intro-bg" style={bgStyle} />
      <div className="intro-overlay">
        <div className="intro-header">
          <span className="pill">Ashwood, Oregon · 1976</span>
          <h1>Вызов шефа</h1>
          <p>Двигай детектива к участку. Стрелка покажет путь. Управляй стрелками или кнопками.</p>
        </div>
        <div className="street">
          <div className="arrow" style={{ left: `${target}%` }}>
            <span>Участок →</span>
          </div>
          <div className="detective" style={{ left: `${position}%` }}>
            🕵️
          </div>
          <div className="street-line" />
        </div>
        <div className="controls">
          <button onClick={() => move(-8)}>← Влево</button>
          <button onClick={() => move(8)}>Вправо →</button>
        </div>
        <div className="intro-tip">По прибытии шеф накричит и даст задание.</div>
      </div>
    </div>
  );
};

export default IntroScene;
