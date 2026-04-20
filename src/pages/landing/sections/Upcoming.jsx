import './Upcoming.css'

const Upcoming = () => {
  return (
    <div className="upcoming-wrapper">
      <div className="upcoming-glow" />

      <div className="upcoming-content">
        <h2>
          Upcoming <span>Releases</span>
        </h2>

        <p className="upcoming-tagline">
          The next wave of anime is already in motion.
        </p>

        <div className="upcoming-grid">
          <div className="upcoming-card">
            <span>⚔️</span>
            <h3>Dark Fantasy Arc</h3>
            <p>New blood. New enemies. No mercy.</p>
          </div>

          <div className="upcoming-card">
            <span>🩸</span>
            <h3>Psychological Thriller</h3>
            <p>Reality bends. Minds break.</p>
          </div>

          <div className="upcoming-card">
            <span>🚀</span>
            <h3>Sci-Fi Saga</h3>
            <p>Beyond time. Beyond dimensions.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Upcoming
