import React from 'react';

const DialogueBox = ({ speaker, text, onNext, accent }) => (
  <div className="dialogue-box">
    <div className="dialogue-header">
      <span className="dialogue-speaker">{speaker || 'Нарратив'}</span>
      {onNext && (
        <button className="pill" onClick={onNext}>
          Дальше
        </button>
      )}
    </div>
    <p className="dialogue-text" dangerouslySetInnerHTML={{ __html: text }} />
    {accent && <div className="accent-bar" style={{ background: accent }} />}
  </div>
);

export default DialogueBox;
