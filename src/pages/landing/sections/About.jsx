import './About.css'

const About = () => {
  return (
    <div className="about-section">

      {/* LEFT CONTENT */}
      <div className="about-content">
        <h2>
          What is <span>ASTA.IS</span>?
        </h2>

        <p className="about-main-text">
          ASTA.IS is a cinematic anime platform crafted for fans who want more
          than just episodes.
        </p>

        <p className="about-sub-text">
          Smooth experiences. Dark aesthetics. Carefully curated anime worlds.
          No clutter. No distractions. Just pure immersion.
        </p>

        <div className="about-stats">
          <div className="stat">
            <h3>100+</h3>
            <span>Anime Titles</span>
          </div>
          <div className="stat">
            <h3>Ultra</h3>
            <span>HD Quality</span>
          </div>
          <div className="stat">
            <h3>24/7</h3>
            <span>Streaming</span>
          </div>
        </div>
      </div>

      {/* RIGHT VISUAL */}
      <div className="about-visual">
        <div className="glow-circle"></div>
        <div className="glass-card">
          <p>
            "Anime is not just content.
            <br />
            It's a world you enter."
          </p>
        </div>
      </div>

    </div>
  )
}

export default About
