// src/App.jsx
import { useEffect, useMemo, useState } from "react";
import { SCENES, computeMode } from "./data/index.js";
import { StatsPanel } from "./components/StatsPanel.jsx";
import { TabbedPanels } from "./components/TabbedPanels.jsx";
import { RunSummary } from "./components/RunSummary.jsx";

function findScene(id) {
  return SCENES.find((s) => s.id === id);
}

export default function App() {
  const initialStats = {
    trust: 60,
    jealousy: 15,
    dependence: 20,
    reputation: 80
  };

  const [currentSceneId, setCurrentSceneId] = useState("act3_start");

  const [stats, setStats] = useState(initialStats);

  const [mode, setMode] = useState(computeMode(initialStats));

  const [flags, setFlags] = useState({
    hasStruckDesdemona: false,
    followedCassioPath: false,
    tookViolentBranch: false,
    questionedIagoSeriously: false,
    everChoseOpenHonestyWithDesdemona: false,
    everActedWithSelfControlInPublic: false,
    everChoseToDoubtIago: false
  });

  const [counters, setCounters] = useState({
    trustChoices: 0,
    jealousyChoices: 0,
    iagoChoices: 0,
    violentChoices: 0,
    totalChoices: 0,
    modeCounts: { Resisting: 0, Torn: 0, Consumed: 0 }
  });

  const [history, setHistory] = useState([]);

  const [unlockedFeed, setUnlockedFeed] = useState([]);
  const [unlockedLogs, setUnlockedLogs] = useState([]);
  const [unlockedJournals, setUnlockedJournals] = useState([]);

  const currentScene = useMemo(
    () => findScene(currentSceneId),
    [currentSceneId]
  );

  const isEnding = currentScene?.type === "ending";

  // Handle unlocks on scene enter
  useEffect(() => {
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

    const effects = choice.effects || {};

    const newStats = {
      trust: clampStat((stats.trust ?? 0) + (effects.trust ?? 0)),
      jealousy: clampStat((stats.jealousy ?? 0) + (effects.jealousy ?? 0)),
      dependence: clampStat(
        (stats.dependence ?? 0) + (effects.dependence ?? 0)
      ),
      reputation: clampStat(
        (stats.reputation ?? 0) + (effects.reputation ?? 0)
      )
    };

    const newMode = computeMode(newStats);

    const tags = choice.tags || [];

    // Update counters (modeCounts, tags)
    setCounters((prev) => {
      const newModeCounts = { ...prev.modeCounts };
      newModeCounts[newMode] = (newModeCounts[newMode] ?? 0) + 1;

      const updated = {
        ...prev,
        modeCounts: newModeCounts,
        totalChoices: prev.totalChoices + 1
      };

      if (tags.includes("trust")) {
        updated.trustChoices += 1;
      }
      if (tags.includes("jealous")) {
        updated.jealousyChoices += 1;
      }
      if (tags.includes("iago")) {
        updated.iagoChoices += 1;
      }
      if (tags.includes("violent")) {
        updated.violentChoices += 1;
      }

      return updated;
    });

    // Update flags
    if (choice.setFlags) {
      setFlags((prev) => {
        const updated = { ...prev };
        for (const key of Object.keys(choice.setFlags)) {
          if (choice.setFlags[key]) {
            updated[key] = true;
          }
        }
        return updated;
      });
    }

    // Update history
    setHistory((prev) => [
      ...prev,
      { sceneId: currentScene.id, choiceId: choice.id, tags }
    ]);

    // Unlock feed/log/journals from choice
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
    setCurrentSceneId("act3_start");
    setStats(initialStats);
    setMode(computeMode(initialStats));
    setFlags({
      hasStruckDesdemona: false,
      followedCassioPath: false,
      tookViolentBranch: false,
      questionedIagoSeriously: false,
      everChoseOpenHonestyWithDesdemona: false,
      everActedWithSelfControlInPublic: false,
      everChoseToDoubtIago: false
    });
    setCounters({
      trustChoices: 0,
      jealousyChoices: 0,
      iagoChoices: 0,
      violentChoices: 0,
      totalChoices: 0,
      modeCounts: { Resisting: 0, Torn: 0, Consumed: 0 }
    });
    setHistory([]);
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

  const sceneText = (() => {
    if (!currentScene) return "";
    // Priority: textByMode -> textIfStruck -> text
    if (currentScene.textByMode && currentScene.textByMode[mode]) {
      return currentScene.textByMode[mode];
    }
    if (currentScene.textIfStruck && flags.hasStruckDesdemona) {
      return currentScene.textIfStruck;
    }
    return currentScene.text;
  })();

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Othello – Interactive Folio</h1>
        <p className="subtitle">
          A two-page manuscript that lets you rewrite the path of jealousy,
          trust, and manipulation.
        </p>
      </header>

      <div className="layout book-layout">
        {/* LEFT PAGE – play text + choices */}
        <main className="main-panel">
          <section className="scene-card page-left">
            <h2>{currentScene.title}</h2>
            {isEnding && <p className="ending-label">Ending</p>}
            <p className="scene-text">{sceneText}</p>

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
                  Begin Again from Act 3
                </button>
              </div>
            )}
          </section>
        </main>

        {/* RIGHT PAGE – marginalia / notes */}
        <aside className="side-panel">
          <section className="notes-card page-right">
            <StatsPanel stats={stats} mode={mode} />
            <TabbedPanels
              unlockedFeed={unlockedFeed}
              unlockedLogs={unlockedLogs}
              unlockedJournals={unlockedJournals}
              stats={stats}
              flags={flags}
            />
            {isEnding && (
              <RunSummary stats={stats} flags={flags} counters={counters} />
            )}
          </section>
        </aside>
      </div>

      <footer className="app-footer">
        <p>
          Based on William Shakespeare&apos;s <em>Othello</em>. This interactive
          folio models how small choices in trust, jealousy, and dependence
          reshape the tragedy.
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
