// src/components/TabbedPanels.jsx

import { useState } from "react";
import { FEED_ITEMS, LOG_ITEMS, JOURNAL_ITEMS } from "../data/index.js";

export function TabbedPanels({ unlockedFeed, unlockedLogs, unlockedJournals }) {
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
    .reverse();

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
