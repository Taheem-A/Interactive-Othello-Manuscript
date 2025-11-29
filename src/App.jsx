// src/App.jsx
import { useEffect, useMemo, useState } from "react";
import { SCENES, computeMode, FEED_ITEMS, LOG_ITEMS, JOURNAL_ITEMS } from "./data/index.js";
import { StatsPanel } from "./components/StatsPanel.jsx";
import { TabbedPanels } from "./components/TabbedPanels.jsx";
import { RunSummary } from "./components/RunSummary.jsx";
import { WelcomeScreen } from "./components/WelcomeScreen.jsx";
import { NotificationCenter } from "./components/NotificationCenter.jsx";

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

  // Show welcome page first
  const [hasStarted, setHasStarted] = useState(false);

  const [currentSceneId, setCurrentSceneId] = useState("act3_start");

  const [stats, setStats] = useState(initialStats);
  const [mode, setMode] = useState(computeMode(initialStats));

  const [activeTab, setActiveTab] = useState("feed");
  const [focusTarget, setFocusTarget] = useState(null);

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

  // Which items have been read (for dots + tab badges)
  const [readFeed, setReadFeed] = useState([]);
  const [readLogs, setReadLogs] = useState([]);
  const [readJournals, setReadJournals] = useState([]);

  // Notification center
  const [notifications, setNotifications] = useState([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  const currentScene = useMemo(
    () => findScene(currentSceneId),
    [currentSceneId]
  );

  // Helper to build a human-readable message for notifications
  function buildNotificationMessage(type, id) {
    if (type === "feed") {
      const item = FEED_ITEMS[id];
      if (!item) return "Social feed has been updated.";
      return `New social post by ${item.author} (${item.act}).`;
    }
    if (type === "log") {
      const item = LOG_ITEMS[id];
      if (!item) return "New private log from Iago.";
      return `New Iago log: “${item.title}”.`;
    }
    if (type === "journal") {
      const item = JOURNAL_ITEMS[id];
      if (!item) return "New journal entry from Desdemona.";
      return `New journal from Desdemona: “${item.title}”.`;
    }
    return "New event unlocked.";
  }

  function pushNotifications(type, ids) {
    if (!ids || !ids.length) return;
    const now = new Date();
    const timeLabel = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

    setNotifications((prev) => [
      ...prev,
      ...ids.map((id) => ({
        id: `${type}-${id}-${now.getTime()}-${Math.random()
          .toString(36)
          .slice(2, 7)}`,
        type,
        itemId: id,
        message: buildNotificationMessage(type, id),
        timeLabel
      }))
    ]);
    setHasUnreadNotifications(true);
  }

  // Handle unlocks on scene enter (with notifications)
  useEffect(() => {
    if (!currentScene) return;

    if (currentScene.unlockFeedOnEnter) {
      const newIds = currentScene.unlockFeedOnEnter.filter(
        (id) => !unlockedFeed.includes(id)
      );
      if (newIds.length) {
        setUnlockedFeed([...unlockedFeed, ...newIds]);
        pushNotifications("feed", newIds);
      }
    }
    if (currentScene.unlockLogsOnEnter) {
      const newIds = currentScene.unlockLogsOnEnter.filter(
        (id) => !unlockedLogs.includes(id)
      );
      if (newIds.length) {
        setUnlockedLogs([...unlockedLogs, ...newIds]);
        pushNotifications("log", newIds);
      }
    }
    if (currentScene.unlockJournalsOnEnter) {
      const newIds = currentScene.unlockJournalsOnEnter.filter(
        (id) => !unlockedJournals.includes(id)
      );
      if (newIds.length) {
        setUnlockedJournals([...unlockedJournals, ...newIds]);
        pushNotifications("journal", newIds);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScene]);

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

    // Handle unlocks from this choice (with notifications)
    if (choice.unlockFeed) {
      const newIds = choice.unlockFeed.filter(
        (id) => !unlockedFeed.includes(id)
      );
      if (newIds.length) {
        setUnlockedFeed([...unlockedFeed, ...newIds]);
        pushNotifications("feed", newIds);
      }
    }
    if (choice.unlockLogs) {
      const newIds = choice.unlockLogs.filter(
        (id) => !unlockedLogs.includes(id)
      );
      if (newIds.length) {
        setUnlockedLogs([...unlockedLogs, ...newIds]);
        pushNotifications("log", newIds);
      }
    }
    if (choice.unlockJournals) {
      const newIds = choice.unlockJournals.filter(
        (id) => !unlockedJournals.includes(id)
      );
      if (newIds.length) {
        setUnlockedJournals([...unlockedJournals, ...newIds]);
        pushNotifications("journal", newIds);
      }
    }

    setStats(newStats);
    setMode(newMode);
    setCurrentSceneId(choice.nextScene);
  }

  // Mark items as read (for dots + tab badges)
  function handleReadFeed(id) {
    setReadFeed((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }

  function handleReadLog(id) {
    setReadLogs((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }

  function handleReadJournal(id) {
    setReadJournals((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }

  // When the notification center is opened, clear the bell's unread dot
  function handleOpenNotificationCenter() {
    setHasUnreadNotifications(false);
  }

  // Notification click handler
  function handleNotificationClick(notification) {
  if (!notification) return;
  const { type, itemId } = notification;

  if (type === "feed") {
    setActiveTab("feed");
  } else if (type === "log") {
    setActiveTab("logs");
  } else if (type === "journal") {
    setActiveTab("journals");
  }

  setFocusTarget({
    type,
    itemId,
    ts: Date.now() // so React sees it as a new target each time
  });
}

// Natification dismiss handler
function handleDismissNotification(id) {
  setNotifications((prev) => prev.filter((n) => n.id !== id));
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
    setReadFeed([]);
    setReadLogs([]);
    setReadJournals([]);
    // We intentionally keep notifications history; it's the "record"
  }

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

  // Show welcome page first
  if (!hasStarted) {
    return (
      <div className="app-root">
        <WelcomeScreen onStart={() => setHasStarted(true)} />
      </div>
    );
  }

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-header-text">
            <h1>Othello Interactive Narrative Engine</h1>
            <p className="subtitle">
              Explore how jealousy, trust, and manipulation reshape the tragedy.
            </p>
          </div>
          <NotificationCenter
            notifications={notifications}
            hasUnread={hasUnreadNotifications}
            onOpenCenter={handleOpenNotificationCenter}
            onNotificationClick={handleNotificationClick}
            onDismissNotification={handleDismissNotification}
          />
        </div>
      </header>

      <div className="layout">
        <main className="main-panel">
          <section key={currentSceneId} className="scene-card fade-scene">
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
            readFeed={readFeed}
            readLogs={readLogs}
            readJournals={readJournals}
            onReadFeed={handleReadFeed}
            onReadLog={handleReadLog}
            onReadJournal={handleReadJournal}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            focusTarget={focusTarget}
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
