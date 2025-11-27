// src/App.jsx
import { useMemo, useState } from "react";
import { SCENES, computeMode } from "./data/index.js";
import { StatsPanel } from "./components/StatsPanel.jsx";
import { TabbedPanels } from "./components/TabbedPanels.jsx";

function findScene(id) {
  return SCENES.find((s) => s.id === id);
}

export default function App() {
  const [currentSceneId, setCurrentSceneId] = useState("act3_start");

  const [stats, setStats] = useState({
    trust: 60,
    jealousy: 15,
    dependence: 20
  });

  const [mode, setMode] = useState(computeMode({ trust: 60, jealousy: 15 }));

  const [unlockedFeed, setUnlockedFeed] = useState([]);
  const [unlockedLogs, setUnlockedLogs] = useState([]);
  const [unlockedJournals, setUnlockedJournals] = useState([]);

  const currentScene = useMemo(
    () => findScene(currentSceneId),
    [currentSceneId]
  );

  // handle unlocks when entering a new scene
  useMemo(() => {
    if (!currentScene) return;

    if (currentScene.unlockFeedOnEnter) {
      addToUnlocked(currentScene.unlockFeedOnEnter, setUnlockedFeed);
    }
    if (currentScene.unlockLogsOnEnter) {
      addToUnlocked(currentScene.unlockLogsOnEnter, setUnlockedLogs);
    }
    if (currentScene.unlockJournalsOnEnter) {
      addToUnlocked(currentScene.unlockJournalsOnEnter, setUnlockedJournals);
    }
  }, [currentScene]);

  function addToUnlocked(ids, setter) {
    setter((prev) => {
      const set = new Set(prev);
      ids.forEach((id) => set.add(id));
      return Array.from(set);
    });
  }

  function clampStat(n) {
    if (n < 0) return 0;
    if (n > 100) return 100;
    return n;
  }

  function handleChoice(choice) {
    if (!choice) return;

    const newStats = {
      trust: clampStat(
        (stats.trust ?? 0) + (choice.effects?.trust ?? 0)
      ),
      jealousy: clampStat(
        (stats.jealousy ?? 0) + (choice.effects?.jealousy ?? 0)
      ),
      dependence: clampStat(
        (stats.dependence ?? 0) + (choice.effects?.dependence ?? 0)
      )
    };

    const newMode = computeMode(newStats);

    if (choice.unlockFeed) {
      addToUnlocked(choice.unlockFeed, setUnlockedFeed);
    }
    if (choice.unlockLogs) {
      addToUnlocked(choice.unlockLogs, setUnlockedLogs);
    }
    if (choice.unlockJournals) {
      addToUnlocked(choice.unlockJournals, setUnlockedJournals);
    }

    setStats(newStats);
    setMode(newMode);
    setCurrentSceneId(choice.nextScene);
  }

  function restart() {
    const baseStats = { trust: 60, jealousy: 15, dependence: 20 };
    setCurrentSceneId("act3_start");
    setStats(baseStats);
    setMode(computeMode(baseStats));
    setUnlockedFeed([]);
    setUnlockedLogs([]);
    setUnlockedJournals([]);
  }

  if (!currentScene) {
    return (
      <div className="app-root">
        <p>Scene not found.</p>
      </div>
    );
  }

  const isEnding = currentScene.type === "ending";

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Othello Interactive Narrative Engine</h1>
        <p className="subtitle">
          Explore how jealousy, trust, and manipulation reshape the tragedy.
        </p>
      </header>

      <div className="layout">
        <main className="main-panel">
          <section className="scene-card">
            <h2>{currentScene.title}</h2>
            {isEnding && <p className="ending-label">Ending</p>}
            <p className="scene-text">{currentScene.text}</p>

            {!isEnding && (
              <>
                <p className="mode-indicator">
                  Current emotional mode: <strong>{mode}</strong>
                </p>
                <ChoicesList
                  scene={currentScene}
                  mode={mode}
                  stats={stats}
                  onChoice={handleChoice}
                />
              </>
            )}

            {isEnding && (
              <div className="ending-actions">
                <button onClick={restart} className="primary-button">
                  Restart from Act 3
                </button>
              </div>
            )}
          </section>
        </main>

        <aside className="side-panel">
          <StatsPanel stats={stats} mode={mode} />
          <TabbedPanels
            unlockedFeed={unlockedFeed}
            unlockedLogs={unlockedLogs}
            unlockedJournals={unlockedJournals}
          />
        </aside>
      </div>

      <footer className="app-footer">
        <p>
          Based on William Shakespeare&apos;s <em>Othello</em>. This interactive
          adaptation was created as a creative project to explore theme and
          character.
        </p>
      </footer>
    </div>
  );
}

function ChoicesList({ scene, mode, stats, onChoice }) {
  const visibleChoices = (scene.choices || []).filter((choice) => {
    if (typeof choice.minJealousy === "number") {
      if (stats.jealousy < choice.minJealousy) return false;
    }
    if (choice.modeRequired && scene.isFinalDecision) {
      return choice.modeRequired === mode;
    }
    return true;
  });

  return (
    <div className="choices">
      {visibleChoices.length === 0 && (
        <p className="no-choices">
          No choices available from this state. (This should not normally
          happen.)
        </p>
      )}
      {visibleChoices.map((choice) => (
        <button
          key={choice.id}
          className="choice-button"
          onClick={() => onChoice(choice)}
        >
          {choice.text}
        </button>
      ))}
    </div>
  );
}
