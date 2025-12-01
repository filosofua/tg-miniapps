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
import { applyDelta, loadState, persist, resetState, updateLeaderboard, upsertReferral } from './engine/stateManager';

const scenes = { scene1, scene2, scene3, scene4, scene5, scene6 };

const detectStartSignature = (bootstrap) => {
  const query = new URLSearchParams(window.location.search);
  const initData = bootstrap?.initData || {};
  if (query.has('start') || Object.prototype.hasOwnProperty.call(initData, 'start_param')) {
    const ref = query.get('start') || initData.start_param || 'blank';
    return `start:${ref}`;
  }
  if (initData.query_id) return `q:${initData.query_id}`;
  if (initData.auth_date) return `auth:${initData.auth_date}`;
  return 'local-run';
};

const extractRefId = (bootstrap) => bootstrap?.startParam || new URLSearchParams(window.location.search).get('start');

const App = ({ bootstrap = {} }) => {
  const [startSignature] = useState(() => detectStartSignature(bootstrap));
  const [refId] = useState(() => extractRefId(bootstrap));
  const [state, setState] = useState(() => {
    const base = loadState(startSignature, refId);
    return refId ? upsertReferral(base, refId) : base;
  });

  useEffect(() => {
    persist(state);
  }, [state]);

  const currentScene = useMemo(() => scenes[state.sceneId], [state.sceneId]);

  const handleCharacterComplete = (payload) => {
    const nftCharacter = generateCharacterNFT(payload.name, payload.archetype, payload.vibe, payload.avatarSeed);
    const base = resetState(startSignature, refId);
    setState({
      ...base,
      startSignature,
      player: {
        ...base.player,
        name: payload.name,
        archetype: payload.archetype,
      },
      nftCharacter,
      introDone: false,
      sceneId: 'intro',
      sceneStep: 0,
      runId: Date.now(),
    });
  };

  const handleResolve = ({ delta, advance, nextScene }) => {
    setState((prev) => {
      let nextState = delta ? applyDelta(prev, delta) : { ...prev };
      if (nextScene) {
        nextState = { ...nextState, sceneId: nextScene, sceneStep: 0 };
      } else if (typeof advance === 'number') {
        nextState = { ...nextState, sceneStep: advance };
      }
      persist(nextState);
      return nextState;
    });
  };

  const handleFinish = (label) => {
    const nftFinal = generateFinalNFT(state.player, label);
    const leaderboardEntry = {
      id: 'you',
      name: state.player.name || 'Ты',
      investigation: state.player.investigation,
      time: Math.max(120, Math.round((Date.now() - state.runId) / 1000)),
      coins: state.farmCoins,
    };
    const updated = updateLeaderboard({ ...state, nftFinal }, leaderboardEntry);
    setState({ ...updated, sceneId: 'farm', sceneStep: 0 });
  };

  const handleFarmUpdate = (payload) => setState((prev) => ({ ...prev, ...payload }));

  const resetProgress = () => setState(resetState(startSignature, refId));

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
        <IntroScene onComplete={() => setState((prev) => ({ ...prev, introDone: true, sceneId: 'scene1', sceneStep: 0 }))} />
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
                  { id: `friend-${Date.now()}`, name: 'Друг', investigation: prev.player.investigation - 1 + Math.random() * 2, time: 840, coins: prev.farmCoins + 5 },
                ],
              }))
            }
          />
        </div>
        {state.nftFinal && (
          <div className="shell-card" style={{ marginTop: 12 }}>
            <div className="card-header">
              <h2>Твой финал: {state.nftFinal.tier}</h2>
              <p>Локальная SVG-картинка + JSON. Можно сохранить для архива.</p>
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
        <SceneRenderer
          scene={currentScene}
          stepIndex={state.sceneStep || 0}
          onResolve={handleResolve}
          onFinish={handleFinish}
          player={state.player}
        />
        <Leaderboard
          leaderboard={state.leaderboard}
          referrals={state.referrals}
          onAddMock={() =>
            setState((prev) => ({
              ...prev,
              leaderboard: [
                ...prev.leaderboard,
                { id: `ref-${Date.now()}`, name: 'Реферал', investigation: prev.player.investigation + 1, time: 900, coins: prev.farmCoins },
              ],
            }))
          }
        />
      </div>
    </div>
  );
};

export default App;
