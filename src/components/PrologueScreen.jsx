// src/components/PrologueScreen.jsx

export function PrologueScreen({ onContinue }) {
  return (
    <div className="welcome-root">
      <section className="welcome-card">
        <p className="welcome-kicker">Prologue</p>

        <h1 className="welcome-title-main">
          Acts <span>I–II</span>
        </h1>

        <p className="welcome-subtitle">
          Before jealousy takes root, love, reputation, and resentment quietly
          set the tragedy in motion.
        </p>

        <div className="welcome-description prologue-description">
          <p>
            Othello, a respected Moorish general in the service of Venice, has
            secretly married Desdemona, the daughter of a powerful senator.
            Their love is sincere, yet it provokes outrage—both from Desdemona’s
            father, who feels betrayed, and from those who believe Othello
            unworthy of such devotion.
          </p>

          <p>
            Among them is Iago, Othello’s ensign. Passed over for promotion in
            favor of Cassio, Iago conceals his bitterness behind the appearance
            of loyalty. He presents himself as honest, blunt, and dependable,
            earning Othello’s complete trust while privately resolving to
            destroy both Cassio and the marriage that stands between him and
            advancement.
          </p>

          <p>
            As war threatens Cyprus, Othello is summoned to command the Venetian
            forces. Desdemona follows him overseas, leaving Venice behind. In
            Cyprus, the chaos of battle gives way to a fragile calm—a space in
            which reputation, honor, and appearance matter more than truth.
          </p>

          <p>
            Iago begins to test the foundations of Othello’s confidence. He
            exploits Cassio’s courtesy, Desdemona’s kindness, and Othello’s deep
            but vulnerable love. Nothing has yet been proven, yet doubt has
            found its first quiet foothold.
          </p>

          <p className="prologue-bridge">
            At this moment, Othello’s trust is strong, his jealousy dormant, and
            his reliance on Iago unquestioned.
          </p>

          <p className="prologue-close">
            <em>This manuscript begins where certainty gives way to suspicion.</em>
          </p>
        </div>

        <button className="welcome-button" onClick={onContinue}>
          Continue to Act III
        </button>

        <p className="welcome-footnote">
          This prologue summarizes Acts I–II so the interactive manuscript can
          begin at the turning point: Act III.
        </p>
      </section>
    </div>
  );
}
