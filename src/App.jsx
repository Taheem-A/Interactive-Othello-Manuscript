// src/App.jsx
import { useEffect, useMemo, useState } from "react";
import { SCENES, computeMode } from "./data/index.js";
import { StatsPanel } from "./components/StatsPanel.jsx";
import { TabbedPanels } from "./components/TabbedPanels.jsx";
import { RunSummary } from "./components/RunSummary.jsx";
import { WelcomeScreen } from "./components/WelcomeScreen.jsx";

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

  // NEW: show welcome page first
  const [hasStarted, setHasStarted] = useState(false);

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

  // which items have been read
  const [readLogs, setReadLogs] = useState([]);
  const [readJournals, setReadJournals] = useState([]);

  const currentScene = useMemo(
    () => findScene(currentSceneId),
    [currentSceneId]
  );

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

    setCounters((prev) => {
      const newModeCounts = { ...prev.modeCounts };
      newModeCounts[newMode] = (newModeCounts[newMode] ?? 0) + 1;

      const updated = {
        ...prev,
        modeCounts: newModeCounts,
        totalChoices: prev.totalChoices + 1
      };

      if (tags.includes("trust")) updated.trustChoices += 1;
      if (tags.includes("jealous")) updated.jealousyChoices += 1;
      if (tags.includes("iago")) updated.iagoChoices += 1;
      if (tags.includes("violent")) updated.violentChoices += 1;

      return updated;
    });

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

    setHistory((prev) => [
      ...prev,
      { sceneId: currentScene.id, choiceId: choice.id, tags }
    ]);

    if (choice.unlockFeed) {
      addToUnlocked(choice.unlockFeed, setUnlockedFeed);
    }
    if (choice.unlockLogs) {
      addToUnlocked(choice.unlockLogs, setUnlockedLogs);
      // new logs start as unread
    }
    if (choice.unlockJournals) {
      addToUnlocked(choice.unlockJournals, setUnlockedJournals);
      // new journals start as unread
    }

    setStats(newStats);
    setMode(newMode);
    setCurrentSceneId(choice.nextScene);
  }

  function handleReadLog(id) {
    setReadLogs((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }

  function handleReadJournal(id) {
    setReadJournals((prev) => (prev.includes(id) ? prev : [...prev, id]));
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
    setReadLogs([]);
    setReadJournals([]);
    // we do NOT reset hasStarted here; once they open the manuscript,
    // restart just restarts Act III from inside it.
  }

  // If we somehow don't find the scene
  if (!currentScene) {
    return (
      <div className="app-root">
        <p>Scene not found.</p>
      </div>
    );
  }

  const isEnding = currentScene.type === "ending";

  const sceneText = (() => {
    if (!currentScene) return "";
    if (currentScene.textByMode && currentScene.textByMode[mode]) {
      return currentScene.textByMode[mode];
    }
    if (currentScene.textIfStruck && flags.hasStruckDesdemona) {
      return currentScene.textIfStruck;
    }
    return currentScene.text;
  })();

  // 👉 Show welcome page first
  if (!hasStarted) {
    return (
      <div className="app-root">
        <WelcomeScreen onStart={() => setHasStarted(true)} />
      </div>
    );
  }

  // 👉 Once started, show the main two-page layout
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
            <p className="scene-text">{sceneText}</p>

            {!isEnding && (
              <>
                <p className="mode-indicator">
                  Current emotional mode:{" "}
                  <span>
                    <strong>{mode}</strong>
                  </span>
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
              <>
                <RunSummary stats={stats} flags={flags} counters={counters} />
                <div className="ending-actions">
                  <button onClick={restart} className="primary-button">
                    Restart from Act 3
                  </button>
                </div>
              </>
            )}
          </section>
        </main>

        <aside className="side-panel">
          <StatsPanel stats={stats} mode={mode} />
          <TabbedPanels
            unlockedFeed={unlockedFeed}
            unlockedLogs={unlockedLogs}
            unlockedJournals={unlockedJournals}
            stats={stats}
            flags={flags}
            readLogs={readLogs}
            readJournals={readJournals}
            onReadLog={handleReadLog}
            onReadJournal={handleReadJournal}
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
