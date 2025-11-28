// src/components/TabbedPanels.jsx

import { useState } from "react";
import { FEED_ITEMS, LOG_ITEMS, JOURNAL_ITEMS } from "../data/index.js";

export function TabbedPanels({
  unlockedFeed,
  unlockedLogs,
  unlockedJournals,
  stats,
  flags
}) {
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
        {activeTab === "feed" && (
          <FeedPanel unlockedIds={unlockedFeed} stats={stats} flags={flags} />
        )}
        {activeTab === "logs" && (
          <LogsPanel unlockedIds={unlockedLogs} flags={flags} />
        )}
        {activeTab === "journals" && (
          <JournalsPanel unlockedIds={unlockedJournals} flags={flags} />
        )}
      </div>
    </section>
  );
}

function getFeedText(item, stats, flags) {
  // Simple helper to pick variants when available
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

  // Default to baseText
  return item.baseText;
}

function FeedPanel({ unlockedIds, stats, flags }) {
  if (!unlockedIds.length) {
    return <p className="muted-text">No public rumours yet.</p>;
  }

  const items = unlockedIds
    .map((id) => FEED_ITEMS[id])
    .filter(Boolean)
    .reverse();

  return (
    <ul className="feed-list">
      {items.map((item) => (
        <li key={item.id} className="feed-item">
          <div className="feed-author">{item.author}</div>
          <div className="feed-act">{item.act}</div>
          <p className="feed-text">{getFeedText(item, stats, flags)}</p>
        </li>
      ))}
    </ul>
  );
}

function LogsPanel({ unlockedIds, flags }) {
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
        return (
          <li key={item.id} className="log-item">
            <h4>{item.title}</h4>
            <p>{text}</p>
          </li>
        );
      })}
    </ul>
  );
}

function JournalsPanel({ unlockedIds, flags }) {
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

        return (
          <li key={item.id} className="journal-item">
            <h4>{item.title}</h4>
            <p>{text}</p>
          </li>
        );
      })}
    </ul>
  );
}
