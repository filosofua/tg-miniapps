import React from 'react';

const moodToAccent = {
  tense: '#ef4444',
  calm: '#22d3ee',
  hope: '#f97316',
  default: '#f97316',
};

const DialogueBox = ({ speaker = 'Нарратор', mood = 'default', text }) => {
  const accent = moodToAccent[mood] || moodToAccent.default;
  return (
    <div className="dialogue-box">
      <div className="dialogue-header">
        <div className="dialogue-speaker">{speaker}</div>
        <div className="pill" style={{ background: 'rgba(255,255,255,0.04)', borderColor: accent, color: accent }}>
          {mood}
        </div>
      </div>
      <div className="dialogue-text">{text}</div>
      <div className="accent-bar" style={{ background: accent }} />
    </div>
  );
};

export default DialogueBox;
