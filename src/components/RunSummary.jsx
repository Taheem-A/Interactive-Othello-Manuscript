// src/components/RunSummary.jsx

export function RunSummary({ stats, flags, counters }) {
  const dominantMode = getDominantMode(counters.modeCounts);
  const archetype = getArchetype(stats, flags, counters, dominantMode);

  return (
    <section className="summary-card">
      <h3>Your Othello This Run</h3>
      <ul className="summary-list">
        <li>
          Dominant emotional mode: <strong>{dominantMode}</strong>
        </li>
        <li>
          Trust-leaning choices: <strong>{counters.trustChoices}</strong>
        </li>
        <li>
          Jealousy-leaning choices: <strong>{counters.jealousyChoices}</strong>
        </li>
        <li>
          Choices relying on Iago: <strong>{counters.iagoChoices}</strong>
        </li>
        <li>
          Violent or aggressive choices: <strong>{counters.violentChoices}</strong>
        </li>
        <li>
          Final public reputation: <strong>{stats.reputation}/100</strong>
        </li>
        <li>
          Followed Cassio instead of talking to Desdemona?{" "}
          <strong>{flags.followedCassioPath ? "Yes" : "No"}</strong>
        </li>
        <li>
          Ever struck Desdemona?{" "}
          <strong>{flags.hasStruckDesdemona ? "Yes" : "No"}</strong>
        </li>
        <li>
          Ever chose open honesty with Desdemona?{" "}
          <strong>
            {flags.everChoseOpenHonestyWithDesdemona ? "Yes" : "No"}
          </strong>
        </li>
        <li>
          Ever seriously doubted Iago?{" "}
          <strong>{flags.everChoseToDoubtIago ? "Yes" : "No"}</strong>
        </li>
      </ul>

      <div className="archetype-block">
        <p className="archetype-label">
          Archetype: <strong>{archetype.name}</strong>
        </p>
        <p className="archetype-text">{archetype.description}</p>
      </div>
    </section>
  );
}

function getDominantMode(modeCounts) {
  if (!modeCounts) return "Resisting";
  const entries = Object.entries(modeCounts);
  if (!entries.length) return "Resisting";

  // pick the mode with the largest count
  let bestMode = "Resisting";
  let bestCount = -1;
  for (const [mode, count] of entries) {
    if (count > bestCount) {
      bestMode = mode;
      bestCount = count;
    }
  }
  return bestMode;
}

function getArchetype(stats, flags, counters, dominantMode) {
  const trustBias = counters.trustChoices - counters.jealousyChoices;
  const rep = stats.reputation ?? 50;
  const { hasStruckDesdemona, tookViolentBranch, everChoseToDoubtIago } = flags;

  // Strongly jealous, violent, consumed
  if (dominantMode === "Consumed" && tookViolentBranch) {
    return {
      name: "The Consumed Jealous",
      description:
        "You frequently chose suspicion and violence over trust, leaning heavily on Iago’s version of events. Your tragedy is not that you lacked warnings, but that you would not hear them."
    };
  }

  // Torn, some doubt, some trust
  if (dominantMode === "Torn" && everChoseToDoubtIago && trustBias > 0) {
    return {
      name: "The Reluctant Tragic",
      description:
        "You wavered between trust and doubt, and even questioned Iago at times. Yet when the crucial moments came, you hesitated or chose too late, and your divided heart shaped the outcome."
    };
  }

  // Low reputation and violence
  if (rep < 40 && hasStruckDesdemona) {
    return {
      name: "The Fallen General",
      description:
        "Whatever honour you once held in the eyes of others was scarred by public outbursts and violence. Your fall is recorded as much in scandal and rumour as in private heartbreak."
    };
  }

  // Mostly Resisting, relatively low jealousy
  if (dominantMode === "Resisting" && stats.jealousy < 40) {
    return {
      name: "The Faithful but Haunted",
      description:
        "You clung to your trust in Desdemona more often than not, yet the seeds of doubt still took root. Your story shows how even a mostly faithful heart can be shaken by carefully sown suspicion."
    };
  }

  // Default catch-all
  return {
    name: "The Conflicted Othello",
    description:
      "Your choices reveal a man pulled between love, pride, and manipulation. At times you trusted, at times you doubted, and the world around you responded to every small shift."
  };
}
