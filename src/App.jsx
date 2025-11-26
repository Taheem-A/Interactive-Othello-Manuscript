// src/App.jsx
import { useMemo, useState } from "react";
import {
  SCENES,
  FEED_ITEMS,
  LOG_ITEMS,
  JOURNAL_ITEMS,
  computeMode
} from "./data.js";

function findScene(id) {
  return SCENES.find((s) => s.id === id);
}

export default function App() {
  const [currentSceneId, setCurrentSceneId] = useState("act3_scene1");

  const [stats, setStats] = useState({
    trust: 60,
    jealousy: 15,
    dependence: 20
  });

  const [mode, setMode] = useState(computeMode(stats));

  const [unlockedFeed, setUnlockedFeed] = useState([]);
  const [unlockedLogs, setUnlockedLogs] = useState([]);
  const [unlockedJournals, setUnlockedJournals] = useState([]);

  const currentScene = useMemo(
    () => findScene(currentSceneId),
    [currentSceneId]
  );

  // On entering a scene, automatically unlock any feed/journals/logs
  // (This is a simple effect-like behaviour triggered manually.)
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

    // apply stat effects
    const newStats = {
      trust: clampStat((stats.trust ?? 0) + (choice.effects?.trust ?? 0)),
      jealousy: clampStat(
        (stats.jealousy ?? 0) + (choice.effects?.jealousy ?? 0)
      ),
      dependence: clampStat(
        (stats.dependence ?? 0) + (choice.effects?.dependence ?? 0)
      )
    };

    const newMode = computeMode(newStats);

    // unlock extras
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
    setCurrentSceneId("act3_scene1");
    setStats({ trust: 60, jealousy: 15, dependence: 20 });
    setMode(computeMode({ trust: 60, jealousy: 15 }));
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
          Explore Othello&apos;s choices through jealousy, trust, and Iago&apos;s
          manipulation.
        </p>
      </header>

      <div className="layout">
        {/* Left: main narrative + choices */}
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

        {/* Right: stats + tabs */}
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
          Based on William Shakespeare&apos;s <em>Othello</em>. All text here is
          a creative adaptation for an ENG4U project.
        </p>
      </footer>
    </div>
  );
}

function ChoicesList({ scene, mode, stats, onChoice }) {
  const visibleChoices = (scene.choices || []).filter((choice) => {
    // jealousy threshold:
    if (typeof choice.minJealousy === "number") {
      if (stats.jealousy < choice.minJealousy) return false;
    }
    // mode requirement (for final scene)
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

function StatsPanel({ stats, mode }) {
  return (
    <section className="stats-card">
      <h3>Emotional Variables</h3>
      <StatBar label="Trust in Desdemona" value={stats.trust} />
      <StatBar label="Jealousy" value={stats.jealousy} />
      <StatBar label="Dependence on Iago" value={stats.dependence} />
      <p className="mode-text">
        Mode: <strong>{mode}</strong>
      </p>
    </section>
  );
}

function StatBar({ label, value }) {
  return (
    <div className="stat-row">
      <div className="stat-label">
        {label} <span className="stat-value">{value}</span>
      </div>
      <div className="stat-bar">
        <div className="stat-bar-fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

// --- Tabs for Feed / Logs / Journals ---

function TabbedPanels({ unlockedFeed, unlockedLogs, unlockedJournals }) {
  const [activeTab, setActiveTab] = useState("feed");

  return (
    <section className="tabs-card">
      <div className="tabs-header">
        <button
          className={
            activeTab === "feed" ? "tab-button active" : "tab-button"
          }
          onClick={() => setActiveTab("feed")}
        >
          Social Feed
        </button>
        <button
          className={
            activeTab === "logs" ? "tab-button active" : "tab-button"
          }
          onClick={() => setActiveTab("logs")}
        >
          Iago&apos;s Logs
        </button>
        <button
          className={
            activeTab === "journals" ? "tab-button active" : "tab-button"
          }
          onClick={() => setActiveTab("journals")}
        >
          Desdemona&apos;s Journals
        </button>
      </div>

      <div className="tabs-body">
        {activeTab === "feed" && <FeedPanel unlockedIds={unlockedFeed} />}
        {activeTab === "logs" && <LogsPanel unlockedIds={unlockedLogs} />}
        {activeTab === "journals" && (
          <JournalsPanel unlockedIds={unlockedJournals} />
        )}
      </div>
    </section>
  );
}

function FeedPanel({ unlockedIds }) {
  if (!unlockedIds.length) {
    return <p className="muted-text">No public rumours yet.</p>;
  }

  const items = unlockedIds
    .map((id) => FEED_ITEMS[id])
    .filter(Boolean)
    .reverse(); // show newest first

  return (
    <ul className="feed-list">
      {items.map((item) => (
        <li key={item.id} className="feed-item">
          <div className="feed-author">{item.author}</div>
          <div className="feed-act">{item.act}</div>
          <p className="feed-text">{item.text}</p>
        </li>
      ))}
    </ul>
  );
}

function LogsPanel({ unlockedIds }) {
  if (!unlockedIds.length) {
    return (
      <p className="muted-text">
        No logs unlocked. Iago prefers to write only when his plans advance.
      </p>
    );
  }

  const items = unlockedIds.map((id) => LOG_ITEMS[id]).filter(Boolean);

  return (
    <ul className="log-list">
      {items.map((item) => (
        <li key={item.id} className="log-item">
          <h4>{item.title}</h4>
          <p>{item.text}</p>
        </li>
      ))}
    </ul>
  );
}

function JournalsPanel({ unlockedIds }) {
  if (!unlockedIds.length) {
    return (
      <p className="muted-text">
        Desdemona has not written anything you can &quot;see&quot; yet.
      </p>
    );
  }

  const items = unlockedIds.map((id) => JOURNAL_ITEMS[id]).filter(Boolean);

  return (
    <ul className="journal-list">
      {items.map((item) => (
        <li key={item.id} className="journal-item">
          <h4>{item.title}</h4>
          <p>{item.text}</p>
        </li>
      ))}
    </ul>
  );
}
