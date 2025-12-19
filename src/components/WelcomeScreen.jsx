// src/components/WelcomeScreen.jsx

export function WelcomeScreen({ onStart }) {
  return (
    <div className="welcome-root">
      <section className="welcome-card">
        <p className="welcome-kicker">An Interactive Manuscript</p>

        <h1 className="welcome-title-main">
          The Tragedy of <span>Othello</span>
        </h1>

        <p className="welcome-subtitle">
          A reimagining of Acts III—V that lets you explore how jealousy, trust,
          and manipulation reshape the ending of the play.
        </p>

        <div className="welcome-meta">
          <p>
            <strong>Adapted by:</strong> Taheem Akter
          </p>
          <p>
            <strong>Course:</strong> ENG4U — Shakespeare Unit
          </p>
          <p>
            <strong>Source Text:</strong> William Shakespeare&apos;s{" "}
            <em>Othello</em>
          </p>
        </div>

        <div className="welcome-description">
          <p>
            This project treats <em>Othello</em> as if it were a living
            manuscript. Your decisions adjust Othello&apos;s inner state
            numerically — his trust, jealousy, dependence on Iago, and public
            reputation — and those shifts ripple outward into new rumours, private
            logs, and alternate endings.
          </p>
          <p>
            Once you open the manuscript, the left page will preserve the story,
            while the right page will show marginal notes, Iago&apos;s private
            reflections, and Desdemona&apos;s journals reacting to your
            choices.
          </p>
        </div>

        <button className="welcome-button" onClick={onStart}>
          Open the Manuscript
        </button>

        <p className="welcome-footnote">
          Best experienced on a laptop or desktop so the two-page layout is
          visible side by side.
        </p>
      </section>
    </div>
  );
}
