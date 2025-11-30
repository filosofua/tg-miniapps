import React, { useEffect, useMemo, useState } from 'react';
import SceneRenderer from './components/SceneRenderer';
import CharacterCreate from './components/CharacterCreate';
import Leaderboard from './components/Leaderboard';
import IntroScene from './components/IntroScene';
import FarmEngine from './farm/FarmEngine';
import scene1 from './scenes/scene1';
import scene2 from './scenes/scene2';
import scene3 from './scenes/scene3';
import scene4 from './scenes/scene4';
import scene5 from './scenes/scene5';
import scene6 from './scenes/scene6';
import { generateCharacterNFT, generateFinalNFT } from './engine/nftGenerator';
import { loadState, persist, resetState, updateLeaderboard, upsertReferral } from './engine/stateManager';

const scenes = { scene1, scene2, scene3, scene4, scene5, scene6 };

const buildStartSignature = (bootstrap) => {
  const search = new URLSearchParams(window.location.search);
  const initData = bootstrap?.initData || {};
  const hasQueryStart = search.has('start');
  const hasInitStart = Object.prototype.hasOwnProperty.call(initData, 'start_param');
  const queryStart = search.get('start');
  const initStart = initData.start_param;
  if (hasQueryStart || hasInitStart) {
    const refId = queryStart || initStart || 'blank';
    return `start:${refId}`;
  }
  if (initData.query_id) return `q:${initData.query_id}`;
  if (initData.auth_date) return `auth:${initData.auth_date}`;
  return null;
};

const extractRefId = (bootstrap) => bootstrap?.startParam || new URLSearchParams(window.location.search).get('start');

const App = ({ bootstrap = {} }) => {
  const [startSignature] = useState(() => buildStartSignature(bootstrap));
  const [refId] = useState(() => extractRefId(bootstrap));
  const [state, setState] = useState(() => {
    const base = loadState(startSignature, refId);
    return refId ? upsertReferral(base, refId) : base;
  });

  useEffect(() => {
    persist(state);
  }, [state]);

  const handleCharacterComplete = (payload) => {
    const nftCharacter = generateCharacterNFT(payload.name, payload.archetype, payload.vibe, payload.avatarSeed);
    setState((prev) => ({
      ...prev,
      startSignature,
      player: {
        ...prev.player,
        name: payload.name,
        archetype: payload.archetype,
      },
      nftCharacter,
      introDone: false,
      sceneId: 'intro',
    }));
  };

  const applyStats = (delta) => {
    setState((prev) => {
      const inventory = delta.item ? [...prev.player.inventory, delta.item] : prev.player.inventory;
      return {
        ...prev,
        player: {
          ...prev.player,
          fear: prev.player.fear + (delta.fear || 0),
          investigation: prev.player.investigation + (delta.investigation || 0),
          moral: prev.player.moral + (delta.moral || 0),
          inventory,
        },
      };
    });
  };

  const goToScene = (sceneId) => setState((prev) => ({ ...prev, sceneId }));

  const handleFinish = (label) => {
    const nftFinal = generateFinalNFT(state.player, label);
    const leaderboardEntry = {
      id: 'you',
      name: state.player.name || 'Ты',
      investigation: state.player.investigation,
      time: Math.max(200, Math.round((Date.now() - (state.createdAt || Date.now())) / 1000)),
      coins: state.farmCoins,
    };
    const updated = updateLeaderboard({ ...state, nftFinal }, leaderboardEntry);
    setState({ ...updated, sceneId: 'farm' });
  };

  const handleFarmUpdate = (payload) => {
    setState((prev) => ({ ...prev, ...payload }));
  };

  const resetProgress = () => setState(resetState(startSignature));

  const currentScene = useMemo(() => scenes[state.sceneId], [state.sceneId]);

  const header = (
    <header className="topbar">
      <div>
        <h1 className="logo">Ashwood · 1976</h1>
        <p className="tagline">Комикс-квест · нуар · криптиды</p>
      </div>
      <div className="status">
        <span className="pill">Fear {state.player.fear}</span>
        <span className="pill">Inv {state.player.investigation}</span>
        <span className="pill">Moral {state.player.moral}</span>
        <button className="ghost" onClick={resetProgress}>Сбросить</button>
      </div>
    </header>
  );

  if (!state.nftCharacter) {
    return (
      <div className="page">
        {header}
        <CharacterCreate onComplete={handleCharacterComplete} />
      </div>
    );
  }

  if (!state.introDone) {
    return (
      <div className="page">
        {header}
        <IntroScene onComplete={() => setState((prev) => ({ ...prev, introDone: true, sceneId: 'scene1' }))} />
      </div>
    );
  }

  if (state.sceneId === 'farm') {
    return (
      <div className="page">
        {header}
        <div className="grid">
          <FarmEngine state={state} onUpdate={handleFarmUpdate} onExit={() => setState((prev) => ({ ...prev, sceneId: 'scene6' }))} />
          <Leaderboard
            leaderboard={state.leaderboard}
            referrals={state.referrals}
            onAddMock={() =>
              setState((prev) => ({
                ...prev,
                leaderboard: [
                  ...prev.leaderboard,
                  { id: `friend-${Date.now()}`, name: 'Друг', investigation: Math.max(1, prev.player.investigation - 1), time: 600, coins: prev.farmCoins + 5 },
                ],
              }))
            }
          />
        </div>
        {state.nftFinal && (
          <div className="shell-card">
            <div className="card-header">
              <h2>NFT финала: {state.nftFinal.tier}</h2>
              <p>Локально сгенерированное изображение и метаданные. Скопируй JSON для архива.</p>
            </div>
            <div className="nft">
              <img src={state.nftFinal.image} alt="NFT финала" />
              <pre>{JSON.stringify(state.nftFinal, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="page">
      {header}
      <div className="grid">
        <SceneRenderer scene={currentScene} onUpdateStats={applyStats} onNextScene={goToScene} onFinish={handleFinish} />
        <Leaderboard
          leaderboard={state.leaderboard}
          referrals={state.referrals}
          onAddMock={() =>
            setState((prev) => ({
              ...prev,
              leaderboard: [
                ...prev.leaderboard,
                { id: `ref-${Date.now()}`, name: 'Реферал', investigation: prev.player.investigation + 1, time: 840, coins: prev.farmCoins },
              ],
            }))
          }
        />
      </div>
    </div>
  );
};

export default App;
