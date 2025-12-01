import { useMemo, useState } from "react";
import nftPool from "../nft/nftPool.json";
import { pickRandomNft } from "../nft/nftGenerator";

const personas = [
  { value: "calm", label: "Спокойный" },
  { value: "instinct", label: "Чутьё" },
  { value: "tough", label: "Жёсткий" }
];

export default function CharacterCreate({ onComplete }) {
  const [name, setName] = useState("");
  const [persona, setPersona] = useState(personas[0].value);
  const [minted, setMinted] = useState(null);

  const rarityBadge = useMemo(() => {
    if (!minted) return null;
    return {
      common: "badge-common",
      rare: "badge-rare",
      legendary: "badge-legendary"
    }[minted.rarity];
  }, [minted]);

  function handleGenerate(e) {
    e.preventDefault();
    const nft = pickRandomNft(nftPool);
    setMinted(nft);
  }

  function handleContinue() {
    if (!name.trim() || !minted) return;
    onComplete({ name: name.trim(), persona, nftCharacter: minted });
  }

  return (
    <div className="character-create">
      <div className="character-create__card">
        <p className="character-create__badge">Создание персонажа</p>
        <h1>Твой детектив в Ашвуде</h1>
        <p className="character-create__lead">
          Введи имя, выбери характер и вытяни случайного детектива. Карточка
          определит твой вайб в расследовании.
        </p>

        <form className="character-create__form" onSubmit={handleGenerate}>
          <label className="character-create__field">
            <span>Имя персонажа</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например, Эшли Ривз"
              required
            />
          </label>

          <label className="character-create__field">
            <span>Характер</span>
            <select value={persona} onChange={(e) => setPersona(e.target.value)}>
              {personas.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            <p className="character-create__hint">Не влияет на NFT, но задаёт настроение расследования.</p>
          </label>

          <button type="submit" className="character-create__cta">
            Случайный детектив
          </button>
        </form>

        {minted && (
          <div className="nft-card">
            <div className={`nft-card__rarity ${rarityBadge}`}>{minted.rarity}</div>
            <div className="nft-card__visual" aria-hidden>
              {minted.image ? (
                <img
                  src={minted.image}
                  alt={`NFT ${minted.name}`}
                  className="nft-card__art"
                  loading="lazy"
                />
              ) : (
                <div className="nft-card__emoji">🃏</div>
              )}
              <div className="nft-card__grain" />
            </div>
            <div className="nft-card__content">
              <p className="nft-card__label">Твой детектив</p>
              <p className="nft-card__title">{minted.name}</p>
              <p className="nft-card__meta">ID: {minted.id}</p>
            </div>
            <button className="character-create__cta" onClick={handleContinue}>
              Начать пролог
            </button>
          </div>
        )}

        {!minted && (
          <p className="character-create__fineprint">
            NFT выпадает случайно из пула. Изображения пока плейсхолдерные —
            добавь свои арты в будущем релизе.
          </p>
        )}
      </div>
    </div>
  );
}
