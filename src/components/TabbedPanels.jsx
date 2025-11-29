// src/components/TabbedPanels.jsx
import { useEffect } from "react";
import { FEED_ITEMS, LOG_ITEMS, JOURNAL_ITEMS } from "../data/index.js";

export function TabbedPanels({
  unlockedFeed,
  unlockedLogs,
  unlockedJournals,
  stats,
  flags,
  readFeed,
  readLogs,
  readJournals,
  onReadFeed,
  onReadLog,
  onReadJournal,
  activeTab,
  onTabChange,
  focusTarget
}) {

  const unreadFeedCount = unlockedFeed.filter(
    (id) => !readFeed.includes(id)
  ).length;
  const unreadLogCount = unlockedLogs.filter(
    (id) => !readLogs.includes(id)
  ).length;
  const unreadJournalCount = unlockedJournals.filter(
    (id) => !readJournals.includes(id)
  ).length;

  useEffect(() => {
    if (!focusTarget) return;
    const { type, itemId } = focusTarget;

    let elementId;
    if (type === "feed") elementId = `feed-${itemId}`;
    else if (type === "log") elementId = `log-${itemId}`;
    else if (type === "journal") elementId = `journal-${itemId}`;
    if (!elementId) return;

    const el = document.getElementById(elementId);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("focused");

    const timeoutId = setTimeout(() => {
      el.classList.remove("focused");
    }, 1200);

    return () => clearTimeout(timeoutId);
  }, [focusTarget, activeTab]);


  return (
    <section className="tabs-card">
      <div className="tabs-header">
        <div className="tab-button-wrapper">
          <button
            className={
              activeTab === "feed" ? "tab-button active" : "tab-button"
            }
            onClick={() => onTabChange("feed")}
          >
            Social Feed
          </button>
          <span
            className={
              "tab-badge-floating " + (unreadFeedCount > 0 ? "visible" : "")
            }
          >
            {unreadFeedCount > 0 ? unreadFeedCount : ""}
          </span>
        </div>

        <div className="tab-button-wrapper">
          <button
            className={
              activeTab === "logs" ? "tab-button active" : "tab-button"
            }
            onClick={() => onTabChange("logs")}
          >
            Iago&apos;s Logs
          </button>
          <span
            className={
              "tab-badge-floating " + (unreadLogCount > 0 ? "visible" : "")
            }
          >
            {unreadLogCount > 0 ? unreadLogCount : ""}
          </span>
        </div>

        <div className="tab-button-wrapper">
          <button
            className={
              activeTab === "journals" ? "tab-button active" : "tab-button"
            }
            onClick={() => onTabChange("journals")}
          >
            Desdemona&apos;s Journals
          </button>
          <span
            className={
              "tab-badge-floating " + (unreadJournalCount > 0 ? "visible" : "")
            }
          >
            {unreadJournalCount > 0 ? unreadJournalCount : ""}
          </span>
        </div>
      </div>

      <div className="tabs-body">
        {activeTab === "feed" && (
          <FeedPanel
            unlockedIds={unlockedFeed}
            stats={stats}
            flags={flags}
            readFeed={readFeed}
            onReadFeed={onReadFeed}
          />
        )}
        {activeTab === "logs" && (
          <LogsPanel
            unlockedIds={unlockedLogs}
            flags={flags}
            readLogs={readLogs}
            onReadLog={onReadLog}
          />
        )}
        {activeTab === "journals" && (
          <JournalsPanel
            unlockedIds={unlockedJournals}
            flags={flags}
            readJournals={readJournals}
            onReadJournal={onReadJournal}
          />
        )}
      </div>
    </section>
  );
}

function getFeedText(item, stats, flags) {
  if (item.text) return item.text;
  if (!item.baseText) return "";

  const rep = stats.reputation ?? 50;
  const struck = flags.hasStruckDesdemona;

  if (item.scandalVariant && rep <= 40 && struck) {
    return item.scandalVariant;
  }

  if (item.sympatheticVariant && rep >= 60 && !struck) {
    return item.sympatheticVariant;
  }

  return item.baseText;
}

function FeedPanel({ unlockedIds, stats, flags, readFeed, onReadFeed }) {
  if (!unlockedIds.length) {
    return <p className="muted-text">No public rumours yet.</p>;
  }

  const items = unlockedIds
    .map((id) => FEED_ITEMS[id])
    .filter(Boolean)
    .reverse();

  return (
    <ul className="feed-list">
      {items.map((item) => {
        const isUnread = !readFeed.includes(item.id);
        return (
          <li
            id={`feed-${item.id}`}
            key={item.id}
            className={`feed-item ${isUnread ? "unread" : ""}`}
            onClick={() => onReadFeed(item.id)}
          >
            <div className="item-header">
              <span className={`item-dot ${isUnread ? "visible" : ""}`} />
              <div className="item-header-text">
                <div className="feed-author">{item.author}</div>
                <div className="feed-act">{item.act}</div>
              </div>
            </div>
            <p className="feed-text">{getFeedText(item, stats, flags)}</p>
          </li>
        );
      })}
    </ul>
  );
}

function LogsPanel({ unlockedIds, flags, readLogs, onReadLog }) {
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
      {items.map((item) => {
        let text = item.text ?? item.baseText;
        if (item.id === "exposed" && item.baseText) {
          if (flags.everChoseToDoubtIago && item.grudgingVariant) {
            text = item.grudgingVariant;
          } else if (!flags.everChoseToDoubtIago && item.bitterVariant) {
            text = item.bitterVariant;
          }
        }

        const isUnread = !readLogs.includes(item.id);

        return (
          <li
            id={`log-${item.id}`}
            key={item.id}
            className={`log-item ${isUnread ? "unread" : ""}`}
            onClick={() => onReadLog(item.id)}
          >
            <div className="item-header">
              <span className={`item-dot ${isUnread ? "visible" : ""}`} />
              <h4>{item.title}</h4>
            </div>
            <p>{text}</p>
          </li>
        );
      })}
    </ul>
  );
}

function JournalsPanel({
  unlockedIds,
  flags,
  readJournals,
  onReadJournal
}) {
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
      {items.map((item) => {
        let text = item.text ?? item.baseText;

        if (item.id === "journal2") {
          if (flags.hasStruckDesdemona && item.baseText) {
            text = item.baseText;
          } else if (!flags.hasStruckDesdemona && item.softerText) {
            text = item.softerText;
          }
        }

        if (item.id === "journal3" && item.baseText) {
          if (flags.hasStruckDesdemona && item.fearfulText) {
            text = item.fearfulText;
          } else {
            text = item.baseText;
          }
        }

        const isUnread = !readJournals.includes(item.id);

        return (
          <li
            id={`journal-${item.id}`}
            key={item.id}
            className={`journal-item ${isUnread ? "unread" : ""}`}
            onClick={() => onReadJournal(item.id)}
          >
            <div className="item-header">
              <span className={`item-dot ${isUnread ? "visible" : ""}`} />
              <h4>{item.title}</h4>
            </div>
            <p>{text}</p>
          </li>
        );
      })}
    </ul>
  );
}
