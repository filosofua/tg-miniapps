import { useEffect, useState } from "react";
import "./App.css";
import SceneRenderer from "./components/SceneRenderer";
import ClickerFarm from "./ClickerFarm";
import IntroScene from "./components/IntroScene";
import CharacterCreate from "./components/CharacterCreate";
import WorldScene from "./world/WorldScene";
import endingNftPool from "./nft/endingNftPool.json";
import { pickRandomNft } from "./nft/nftGenerator";
import { WORLD_ZONES, getZoneIndexByScene } from "./world/zones";

import scene1 from "./scenes/scene1.js";
import scene2 from "./scenes/scene2.js";
import scene3 from "./scenes/scene3.js";
import scene4 from "./scenes/scene4.js";
import scene5 from "./scenes/scene5.js";
import scene6 from "./scenes/scene6.js";

const scenesById = {
  1: scene1,
  2: scene2,
  3: scene3,
  4: scene4,
  5: scene5,
  6: scene6
};

const STORAGE_KEY = "ashwood_game_state";

function getDefaultState() {
  return {
    created: false,
    introCompleted: false,
    mode: "world", // 'world' | 'scene' | 'farm'
    sceneId: 1,
    worldLocation: 0,
    unlockedScenes: [1],
    completedScenes: [],
    player: {
      name: "",
      persona: "calm",
      nftCharacter: null,
      points: 0,
      fear: 0,
      investigation: 0,
      inventory: []
    },
    finished: false,
    finalNft: null
  };
}

function loadInitialState() {
  const fallbackState = getDefaultState();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);

      return {
        ...fallbackState,
        ...parsed,
        introCompleted: parsed.introCompleted ?? true,
        player: {
          ...fallbackState.player,
          ...(parsed.player || {})
        },
        created: parsed.created ?? Boolean(parsed?.player?.name),
        unlockedScenes:
          parsed.unlockedScenes && parsed.unlockedScenes.length
            ? parsed.unlockedScenes
            : fallbackState.unlockedScenes,
        completedScenes: parsed.completedScenes || fallbackState.completedScenes,
        worldLocation: parsed.worldLocation ?? fallbackState.worldLocation,
        mode:
          parsed.mode && ["world", "scene", "farm"].includes(parsed.mode)
            ? parsed.mode
            : fallbackState.mode
      };
    }
  } catch (e) {
    console.error(e);
  }

  return fallbackState;
}

export default function App() {
  const [state, setState] = useState(loadInitialState);

  const {
    created,
    introCompleted,
    mode,
    sceneId,
    player,
    finished,
    unlockedScenes,
    completedScenes,
    worldLocation
  } = state;

  // сохраняем игру
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error(e);
    }
  }, [state]);

  function updatePlayer(key, value) {
    setState((prev) => {
      const updatedPlayer = { ...prev.player };

      if (key === "inventory") {
        updatedPlayer.inventory = [...updatedPlayer.inventory, value];
      } else {
        updatedPlayer[key] = (updatedPlayer[key] || 0) + value;
      }

      return {
        ...prev,
        player: updatedPlayer
      };
    });
  }

  function handleCharacterCreated(payload) {
    setState((prev) => ({
      ...prev,
      created: true,
      introCompleted: false,
      mode: "world",
      sceneId: 1,
      unlockedScenes: [1],
      completedScenes: [],
      worldLocation: getZoneIndexByScene(1),
      finished: false,
      player: {
        ...prev.player,
        ...payload,
        fear: 0,
        investigation: 0,
        points: 0,
        inventory: []
      },
      finalNft: null
    }));
  }

  function handleNextScene(nextSceneId) {
    setState((prev) => {
      const prevSceneId = prev.sceneId;
      const updatedCompleted = prevSceneId
        ? Array.from(new Set([...(prev.completedScenes || []), prevSceneId]))
        : prev.completedScenes || [];

      // 0 = сюжет пройден → включаем фарм
      if (nextSceneId === 0) {
        return {
          ...prev,
          mode: "farm",
          finished: true,
          completedScenes: updatedCompleted,
          finalNft: prev.finalNft || pickRandomNft(endingNftPool)
        };
      }

      const updatedUnlocked = Array.from(
        new Set([...(prev.unlockedScenes || []), nextSceneId])
      );

      return {
        ...prev,
        mode: "world",
        sceneId: nextSceneId,
        worldLocation: getZoneIndexByScene(nextSceneId),
        unlockedScenes: updatedUnlocked,
        completedScenes: updatedCompleted
      };
    });
  }

  function resetStory() {
    localStorage.removeItem("ashwood_farm_state");
    setState(getDefaultState());
  }

  if (!created) {
    return <CharacterCreate onComplete={handleCharacterCreated} />;
  }

  if (!introCompleted) {
    return (
      <IntroScene
        onComplete={() =>
          setState((prev) => ({
            ...prev,
            introCompleted: true,
            mode: "world",
            sceneId: 1,
            worldLocation: getZoneIndexByScene(1),
            finished: false,
            player: prev.player || getDefaultState().player
          }))
        }
      />
    );
  }

  if (mode === "world") {
    return (
      <WorldScene
        zones={WORLD_ZONES}
        unlockedScenes={unlockedScenes}
        completedScenes={completedScenes}
        position={worldLocation}
        onMove={(next) =>
          setState((prev) => ({
            ...prev,
            worldLocation: Math.max(0, Math.min(WORLD_ZONES.length - 1, next))
          }))
        }
        onEnterScene={(sceneIdToEnter) =>
          setState((prev) => ({
            ...prev,
            mode: "scene",
            sceneId: sceneIdToEnter
          }))
        }
        nextSceneId={sceneId}
        player={player}
        onResetStory={resetStory}
      />
    );
  }

  if (mode === "farm") {
    return (
      <ClickerFarm
        playerName={player.name}
        starterNft={player.nftCharacter}
        finalNft={state.finalNft}
        initialCoins={player.points}
        onResetStory={resetStory}
      />
    );
  }

  const sceneData = scenesById[sceneId];

  if (!sceneData) {
    return (
      <div className="app-shell">
        <h2>Сцена не найдена</h2>
        <p>sceneId: {sceneId}</p>
        <button onClick={resetStory}>Сбросить историю</button>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <SceneRenderer
        sceneData={sceneData}
        updatePlayer={updatePlayer}
        onNextScene={handleNextScene}
      />

      <div className="status-pill">
        <div className="status-pill__line">{player.name || "Детектив"}</div>
        {player.nftCharacter && (
          <div className="status-pill__line">
            NFT: {player.nftCharacter.name} ({player.nftCharacter.rarity})
          </div>
        )}
        <div className="status-pill__line">
          Очки: {player.points} | Страх: {player.fear} | Расследование: {player.investigation}
          {finished && " | История завершена"}
        </div>
      </div>
    </div>
  );
}
