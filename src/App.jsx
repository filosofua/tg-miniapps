import { useEffect, useState } from "react";
import "./App.css";
import SceneRenderer from "./components/SceneRenderer";
import ClickerFarm from "./ClickerFarm";
import IntroScene from "./components/IntroScene";

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
const INIT_DATA_KEY = "ashwood_last_init_data";

function getStartContext() {
  if (typeof window === "undefined") return { startParam: null, initDataRaw: null };

  const params = new URLSearchParams(window.location.search);
  const urlStartParam =
    params.get("tgWebAppStartParam") || params.get("start_param") || params.get("start");

  const webApp = window.Telegram?.WebApp;

  return {
    startParam: webApp?.initDataUnsafe?.start_param || urlStartParam,
    initDataRaw: webApp?.initData || params.get("tgWebAppData")
  };
}

function getDefaultState() {
  return {
    introCompleted: false,
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

function loadInitialState() {
  const fallbackState = getDefaultState();
  const { startParam, initDataRaw } = getStartContext();

  let storedInitData = null;

  try {
    storedInitData = localStorage.getItem(INIT_DATA_KEY);
  } catch (e) {
    console.error(e);
  }

  const shouldResetByStartParam =
    typeof startParam === "string" &&
    ["restart", "reset", "start", "intro", "new"].includes(startParam.toLowerCase());

  const initDataChanged =
    typeof initDataRaw === "string" && storedInitData && storedInitData !== initDataRaw;

  if (shouldResetByStartParam || initDataChanged) {
    try {
      if (initDataRaw) localStorage.setItem(INIT_DATA_KEY, initDataRaw);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackState));
    } catch (e) {
      console.error(e);
    }

    return fallbackState;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);

      if (initDataRaw && initDataRaw !== storedInitData) {
        try {
          localStorage.setItem(INIT_DATA_KEY, initDataRaw);
        } catch (e) {
          console.error(e);
        }
      }

      return {
        ...fallbackState,
        ...parsed,
        introCompleted: parsed.introCompleted ?? true,
        player: {
          ...fallbackState.player,
          ...(parsed.player || {})
        }
      };
    }
  } catch (e) {
    console.error(e);
  }

  return fallbackState;
}

export default function App() {
  const [state, setState] = useState(loadInitialState);

  const { introCompleted, mode, sceneId, player, finished } = state;

  // сохраняем игру
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error(e);
    }
  }, [state]);

  useEffect(() => {
    const { initDataRaw } = getStartContext();

    if (!initDataRaw) return;

    try {
      localStorage.setItem(INIT_DATA_KEY, initDataRaw);
    } catch (e) {
      console.error(e);
    }
  }, []);

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
    const fresh = getDefaultState();

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    } catch (e) {
      console.error(e);
    }

    setState(fresh);
  }

  if (!introCompleted) {
    return (
      <IntroScene
        onComplete={() =>
          setState((prev) => ({
            ...prev,
            introCompleted: true,
            mode: "story",
            sceneId: 1,
            finished: false,
            player: prev.player || getDefaultState().player
          }))
        }
      />
    );
  }

  if (mode === "farm") {
    return <ClickerFarm onResetStory={resetStory} />;
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
        Страх: {player.fear} | Расследование: {player.investigation}
        {finished && " | История завершена"}
      </div>
    </div>
  );
}
