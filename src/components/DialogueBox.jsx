import React from 'react';
import { portraits } from '../assets/images';

const moodToAccent = {
  tense: '#ef4444',
  calm: '#22d3ee',
  hope: '#f97316',
  default: '#f97316',
};

const speakerPortrait = {
  'Шеф Холден': portraits.chief,
  'Шеф': portraits.chief,
  'Родители Харпер': portraits.parents,
  'Харперы': portraits.parents,
  'Свидетель': portraits.attendant,
  'Автозаправщик': portraits.attendant,
  'Монстр': portraits.monster,
};

const DialogueBox = ({ speaker = 'Нарратор', mood = 'default', text }) => {
  const accent = moodToAccent[mood] || moodToAccent.default;
  const portrait = speakerPortrait[speaker] || portraits.detective;

  return (
    <div className="dialogue-box">
      <div className="dialogue-header">
        <div className="dialogue-speaker">{speaker}</div>
        <div className="pill" style={{ background: 'rgba(255,255,255,0.04)', borderColor: accent, color: accent }}>
          {mood}
        </div>
      </div>
      <div className="dialogue-body">
        <div className="dialogue-portrait" aria-hidden="true">
          <img src={portrait} alt="портрет" />
        </div>
        <div className="dialogue-text">{text}</div>
      </div>
      <div className="accent-bar" style={{ background: accent }} />
    </div>
  );
};

export default DialogueBox;
