// src/components/NotificationCenter.jsx
import { useState } from "react";

export function NotificationCenter({
  notifications,
  hasUnread,
  onOpenCenter
}) {
  const [isOpen, setIsOpen] = useState(false);

  function toggleOpen() {
    const next = !isOpen;
    setIsOpen(next);
    if (next) {
      onOpenCenter?.();
    }
  }

  const latestNotifications = [...notifications].slice(-12).reverse();

  return (
    <div className="notification-wrapper">
      <button
        className={
          "notification-bell" + (hasUnread ? " notification-bell-unread" : "")
        }
        onClick={toggleOpen}
        aria-label="Open notification center"
      >
        <span className="notification-bell-icon">🔔</span>
        {hasUnread && <span className="notification-bell-dot" />}
      </button>

      {isOpen && (
        <div className="notification-panel">
          <div className="notification-panel-header">
            <h3>Notifications</h3>
          </div>

          {latestNotifications.length === 0 ? (
            <p className="notification-empty">
              No recent events yet. New rumours, logs, and journals will appear
              here.
            </p>
          ) : (
            <ul className="notification-list">
              {latestNotifications.map((n) => (
                <li key={n.id} className="notification-item">
                  <div className="notification-item-main">
                    <span className={`notification-pill type-${n.type}`}>
                      {labelForType(n.type)}
                    </span>
                    <span className="notification-message">{n.message}</span>
                  </div>
                  {n.timeLabel && (
                    <span className="notification-time">{n.timeLabel}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function labelForType(type) {
  if (type === "feed") return "Feed";
  if (type === "log") return "Log";
  if (type === "journal") return "Journal";
  return "Event";
}
