import React, { useState } from 'react';

const archetypes = [
  { id: 'analyst', label: 'Тихий аналитик', desc: 'Холодный ум, любит файлы и доказательства.' },
  { id: 'hound', label: 'Полевая волчица', desc: 'Интуиция, быстрые решения, улицы родной дом.' },
  { id: 'medium', label: 'Спокойный мистик', desc: 'Чует странности в воздухе, слушает город.' },
];

const vibes = ['Сдержанный', 'Грязный нуар', 'Саркастичный', 'Злой на систему'];

const CharacterCreate = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [archetype, setArchetype] = useState(archetypes[0].label);
  const [vibe, setVibe] = useState(vibes[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onComplete({ name: name.trim(), archetype, vibe, avatarSeed: Date.now() });
  };

  return (
    <div className="shell-card">
      <div className="card-header">
        <h1>Создай детектива</h1>
        <p>Выбери имя, архетип и настроение для комикса Ashwood, Oregon.</p>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Имя детектива</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Эш, Лин, Мак" />
        </label>
        <div className="field">
          <span>Архетип</span>
          <div className="chips">
            {archetypes.map((item) => (
              <button
                type="button"
                key={item.id}
                className={item.label === archetype ? 'chip active' : 'chip'}
                onClick={() => setArchetype(item.label)}
              >
                <div className="chip-title">{item.label}</div>
                <div className="chip-desc">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="field">
          <span>Настрой</span>
          <div className="chips inline">
            {vibes.map((item) => (
              <button
                type="button"
                key={item}
                className={item === vibe ? 'chip active' : 'chip'}
                onClick={() => setVibe(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <button type="submit" className="primary">Сохранить и начать</button>
      </form>
    </div>
  );
};

export default CharacterCreate;
