import React from 'react';

const ChoiceButtons = ({ options = [], onChoose }) => (
  <div className="choices-grid">
    {options.map((option) => (
      <button key={option.label} className="choice" onClick={() => onChoose(option)}>
        <div className="choice-label">{option.label}</div>
        {(option.fear || option.investigation || option.moral || option.item) && (
          <div className="choice-stats">
            {option.fear ? <span>Fear {option.fear > 0 ? '+' : ''}{option.fear}</span> : null}
            {option.investigation ? <span>Inv {option.investigation > 0 ? '+' : ''}{option.investigation}</span> : null}
            {option.moral ? <span>Moral {option.moral > 0 ? '+' : ''}{option.moral}</span> : null}
            {option.item ? <span>+ {option.item}</span> : null}
          </div>
        )}
      </button>
    ))}
  </div>
);

export default ChoiceButtons;
