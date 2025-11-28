// src/components/StatsPanel.jsx

export function StatsPanel({ stats, mode }) {
  return (
    <section className="stats-card">
      <h3>Emotional Variables</h3>
      <StatBar label="Trust in Desdemona" value={stats.trust} />
      <StatBar label="Jealousy" value={stats.jealousy} />
      <StatBar label="Dependence on Iago" value={stats.dependence} />
      <StatBar label="Public Reputation" value={stats.reputation} />
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
