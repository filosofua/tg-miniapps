import React, { useMemo, useState } from 'react';
import { generateCharacterNFT } from '../engine/nftGenerator';

const archetypes = [
  { id: 'analyst', label: 'Интуитивный сыщик', desc: 'Спокоен, читает детали, строит версии.' },
  { id: 'hound', label: 'Уличный нюхач', desc: 'Доверяет чутью, быстро действует.' },
  { id: 'medium', label: 'Чувствующий город', desc: 'Слышит шум тумана и шёпот труб.' },
];

const vibes = ['Сдержанный', 'Грязный нуар', 'Саркастичный', 'Мрачный реализм'];

const CharacterCreate = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [archetype, setArchetype] = useState(archetypes[0].label);
  const [vibe, setVibe] = useState(vibes[0]);
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 9999));

  const preview = useMemo(() => generateCharacterNFT(name || 'Детектив', archetype, vibe, seed), [name, archetype, vibe, seed]);
  const previewTitle = useMemo(() => (name ? `${name}, ${vibe}` : 'Твой детектив'), [name, vibe]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    onComplete({ name: name.trim(), archetype, vibe, avatarSeed: seed });
  };

  return (
    <div className="shell-card">
      <div className="card-header">
        <h1>Создай детектива</h1>
        <p>Имя, архетип и настрой сохранятся в NFT персонажа и будут влиять на тон диалогов.</p>
      </div>
      <div className="grid two">
        <form className="form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Имя</span>
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
          <label className="field">
            <span>Сид аватара (для генерации SVG)</span>
            <div className="seed-row">
              <input type="number" value={seed} onChange={(e) => setSeed(Number(e.target.value) || 0)} />
              <button type="button" onClick={() => setSeed(Math.floor(Math.random() * 999999))}>Reroll</button>
            </div>
          </label>
          <button type="submit" className="primary">Сохранить и начать</button>
        </form>

        <div className="preview-box">
          <div className="pill muted">Превью NFT</div>
          <div className="nft avatar-preview">
            <div className="nft-visual">
              <img src={preview.image} alt="NFT детектива" />
            </div>
            <div>
              <h3>{previewTitle}</h3>
              <p className="dialogue-text">Архетип: {archetype}</p>
              <p className="dialogue-text">Настрой: {vibe}</p>
              <p className="dialogue-text muted">Сид: {seed}</p>
              <p className="dialogue-text muted">Слои: {preview.attributes.map((a) => a.value).join(' · ')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCreate;
