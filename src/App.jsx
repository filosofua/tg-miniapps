import { useEffect, useState } from "react";
import "./App.css";
import SceneRenderer from "./components/SceneRenderer";
import ClickerFarm from "./ClickerFarm";

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

function loadInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error(e);
  }
  return {
    mode: "story", // 'story' | 'farm'
    sceneId: 1,
    player: {
      fear: 0,
      investigation: 0,
      inventory: []
    },
    finished: false
  };
}

export default function App() {
  const [state, setState] = useState(loadInitialState);

  const { mode, sceneId, player, finished } = state;

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

  function handleNextScene(nextSceneId) {
    // 0 = сюжет пройден → включаем фарм
    if (nextSceneId === 0) {
      setState((prev) => ({
        ...prev,
        mode: "farm",
        finished: true
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      sceneId: nextSceneId
    }));
  }

  function resetStory() {
    setState((prev) => ({
      ...prev,
      mode: "story",
      sceneId: 1,
      player: {
        fear: 0,
        investigation: 0,
        inventory: []
      },
      finished: false
    }));
  }

  if (mode === "farm") {
    return <ClickerFarm onResetStory={resetStory} />;
  }

  const sceneData = scenesById[sceneId];

  if (!sceneData) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#020617",
          color: "#e5e7eb",
          padding: 20
        }}
      >
        <h2>Сцена не найдена</h2>
        <p>sceneId: {sceneId}</p>
        <button onClick={resetStory}>Сбросить историю</button>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "#e5e7eb",
        padding: 20,
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      }}
    >
      <SceneRenderer
        sceneData={sceneData}
        updatePlayer={updatePlayer}
        onNextScene={handleNextScene}
      />

      <div
        style={{
          position: "fixed",
          bottom: 12,
          right: 12,
          fontSize: 12,
          opacity: 0.7,
          background: "#020617",
          borderRadius: 8,
          padding: "4px 8px",
          border: "1px solid #1e293b"
        }}
      >
        Страх: {player.fear} | Расследование: {player.investigation}
        {finished && " | История завершена"}
      </div>
    </div>
  );
}
