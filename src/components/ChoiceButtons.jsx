import React from 'react';

const ChoiceButtons = ({ text, options, onSelect }) => (
  <div className="choice-box">
    <p className="choice-text">{text}</p>
    <div className="choices-grid">
      {options.map((option) => (
        <button key={option.label} className="choice" onClick={() => onSelect(option)}>
          <div className="choice-label">{option.label}</div>
          <div className="choice-stats">
            {option.fear ? <span>Fear {option.fear > 0 ? '+' : ''}{option.fear}</span> : null}
            {option.investigation ? <span>Inv {option.investigation > 0 ? '+' : ''}{option.investigation}</span> : null}
            {option.moral ? <span>Moral {option.moral > 0 ? '+' : ''}{option.moral}</span> : null}
          </div>
        </button>
      ))}
    </div>
  </div>
);

export default ChoiceButtons;
