import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './Landing.css'
import { 
  heroImage, card1Image, card2Image, 
  grid1Image, grid2Image, grid3Image, grid4Image,
  trend1Image, trend2Image, trend3Image, trend4Image,
  spyfamilyImage, astaImage,
  showcaseAnime, trendingAnime, heroCards
} from '../../services/images'

// ==========================================
// CUSTOM HOOK - SCROLL REVEAL
// ==========================================
const useScrollReveal = () => {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  
  return [ref, visible]
}

// ==========================================
// HERO SECTION
// ==========================================
const HeroSection = () => {
  const navigate = useNavigate()
  const heroRef = useRef(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    const handleMouse = (e) => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window
      setMousePos({
        x: (clientX / innerWidth - 0.5) * 30,
        y: (clientY / innerHeight - 0.5) * 30
      })
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])
  
  return (
    <section className="hero" ref={heroRef}>
      {/* Background Effects */}
      <div className="hero-bg">
        <div className="hero-g1" style={{ transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)` }} />
        <div className="hero-g2" style={{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)` }} />
        <div className="hero-g3" style={{ transform: `translate(${mousePos.x * 0.7}px, ${mousePos.y * 0.7}px)` }} />
        <div className="hero-grid" />
        <div className="hero-particles">
          {[...Array(8)].map((_, i) => <div key={i} className="hero-particle" />)}
        </div>
      </div>
      
      {/* Content */}
      <div className="hero-content">
        <div className="hero-left">
          <div className="hero-badge">
            <span className="badge-dot" />
            Now Streaming in 4K
          </div>
          
          <h1 className="hero-title">
            <span className="line1">The Ultimate</span>
            <span className="line2">Anime Experience</span>
          </h1>
          
          <p className="hero-desc">
            Immersive cinematic streaming for true anime fans. 
            Crystal-clear quality, lightning-fast updates, zero ads.
          </p>
          
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate('/browse')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              Start Watching
            </button>
            <button className="btn-outline" onClick={() => navigate('/browse')}>
              Browse Library
            </button>
          </div>
          
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-value">100+</span>
              <span className="stat-label">Anime</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">4K</span>
              <span className="stat-label">Quality</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">Free</span>
              <span className="stat-label">Forever</span>
            </div>
          </div>
        </div>
        
        {/* Hero Right - WITH LOCAL IMAGES */}
        <div className="hero-right">
          <div className="hero-character" style={{ transform: `translate(${mousePos.x * 0.2}px, ${mousePos.y * 0.2}px)` }}>
            <div className="hero-character-glow" />
            <div className="hero-character-frame">
              <img 
                src={astaImage} 
                alt="Asta - Black Clover"
                className="hero-character-img"
              />
            </div>
            {heroCards.map((card, i) => (
              <div key={i} className={`hero-card hero-card-${i + 1}`}>
                <img 
                  src={card.img} 
                  alt={card.title}
                  className="hero-card-thumb-img"
                />
                <div className="hero-card-info">
                  <span className="hero-card-title">{card.title}</span>
                  <span className="hero-card-sub">{card.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ==========================================
// ABOUT SECTION
// ==========================================
const AboutSection = () => {
  const [ref, visible] = useScrollReveal()
  
  return (
    <section className="about">
      <div className="about-bg-effect" />
      <div ref={ref} className={`about-content ${visible ? 'visible' : ''}`}>
        <span className="about-label">Why Choose Us</span>
        <h2 className="about-title">
          Your Gateway to<br/>
          <span className="gradient-text">Extraordinary Worlds</span>
        </h2>
        <p className="about-desc">
          We curate the finest selection of anime, delivering an unparalleled 
          streaming experience with cutting-edge technology and passionate community.
        </p>
        <div className="about-features">
          <div className="about-feature">
            <div className="about-feature-icon">🎬</div>
            <h3>Crystal Quality</h3>
            <p>Stream in 4K Ultra HD with zero buffering</p>
          </div>
          <div className="about-feature">
            <div className="about-feature-icon">⚡</div>
            <h3>Lightning Fast</h3>
            <p>Episodes updated within hours of release</p>
          </div>
          <div className="about-feature">
            <div className="about-feature-icon">💜</div>
            <h3>No Ads Ever</h3>
            <p>Pure entertainment without interruptions</p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ==========================================
// FEATURES SECTION
// ==========================================
const FeaturesSection = () => {
  const navigate = useNavigate()
  const [ref, visible] = useScrollReveal()
  
  const features = [
    { icon: '🎯', title: 'Smart Search', desc: 'Find any anime instantly' },
    { icon: '📺', title: 'HD Streaming', desc: 'Buffer-free playback' },
    { icon: '📱', title: 'All Devices', desc: 'Watch anywhere' },
    { icon: '❤️', title: 'Watchlist', desc: 'Save favorites' },
  ]
  
  return (
    <section className="features">
      <div className="features-bg-glow" />
      <div ref={ref} className={`features-content ${visible ? 'visible' : ''}`}>
        <div className="features-header">
          <h2 className="features-title">Built for True Fans</h2>
          <p className="features-desc">Every feature designed with anime lovers in mind</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
        <div className="features-cta-wrapper">
          <button className="btn-primary features-cta" onClick={() => navigate('/browse')}>
            Explore All Features
          </button>
        </div>
      </div>
    </section>
  )
}

// ==========================================
// SHOWCASE SECTION
// ==========================================
const ShowcaseSection = () => {
  const navigate = useNavigate()
  const [leftRef, leftVisible] = useScrollReveal()
  const [rightRef, rightVisible] = useScrollReveal()
  
  return (
    <section className="showcase">
      <div className="showcase-container">
        {/* Left - Anime Grid */}
        <div ref={leftRef} className={`showcase-left ${leftVisible ? 'visible' : ''}`}>
          <div className="showcase-grid">
            {showcaseAnime.map((anime, i) => (
              <div 
                key={i} 
                className="showcase-grid-item"
                onClick={() => navigate(`/watch/${anime.id}`)}
              >
                <img 
                  src={anime.img} 
                  alt={anime.title}
                  className="showcase-grid-img"
                />
                <div className="showcase-grid-overlay">
                  <span>{anime.title}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="showcase-badge">
            <span className="showcase-badge-value">500+</span>
            <span className="showcase-badge-label">Episodes</span>
          </div>
        </div>
        
        {/* Right - Trending List */}
        <div ref={rightRef} className={`showcase-right ${rightVisible ? 'visible' : ''}`}>
          <span className="showcase-label">Trending Now</span>
          <h2 className="showcase-title">
            Hot This <span className="gradient-text">Season</span>
          </h2>
          <p className="showcase-desc">
            Don't miss out on the most popular anime everyone's watching right now.
          </p>
          <div className="showcase-list">
            {trendingAnime.map((item, i) => (
              <div key={i} className="showcase-list-item">
                <span className="showcase-rank">#{item.rank}</span>
                <img 
                  src={item.img} 
                  alt={item.title}
                  className="showcase-list-thumb-img"
                />
                <div className="showcase-list-info">
                  <span className="showcase-list-title">{item.title}</span>
                  <span className="showcase-list-sub">{item.episodes}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="btn-primary" onClick={() => navigate('/browse')}>
            Browse All Anime
          </button>
        </div>
      </div>
    </section>
  )
}

// ==========================================
// CTA SECTION
// ==========================================
const CTASection = () => {
  const navigate = useNavigate()
  const [ref, visible] = useScrollReveal()
  
  return (
    <section className="cta">
      <div ref={ref} className={`cta-bg ${visible ? 'visible' : ''}`}>
        <div className="cta-glow cta-glow-1" />
        <div className="cta-glow cta-glow-2" />
        <div className="cta-content">
          <h2 className="cta-title">
            Ready to Start <span className="gradient-text">Watching?</span>
          </h2>
          <p className="cta-desc">
            Join thousands of anime fans. No subscription required.
          </p>
          <div className="cta-btn-wrapper">
            <button className="cta-btn" onClick={() => navigate('/browse')}>
              Start Free Trial
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

// ==========================================
// FOOTER
// ==========================================
const Footer = () => {
  const navigate = useNavigate()
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="logo">ASTA<span>.IS</span></div>
          <p>Your gateway to extraordinary anime worlds. Cinematic streaming experience for true fans.</p>
        </div>
        <div className="footer-links">
          <div className="footer-links-group">
            <h4>Platform</h4>
            <ul>
              <li><button onClick={() => navigate('/')}>Home</button></li>
              <li><button onClick={() => navigate('/browse')}>Browse</button></li>
              <li><button onClick={() => navigate('/search')}>Search</button></li>
            </ul>
          </div>
          <div className="footer-links-group">
            <h4>Discover</h4>
            <ul>
              <li><button onClick={() => navigate('/top')}>Top Anime</button></li>
              <li><button onClick={() => navigate('/upcoming')}>Upcoming</button></li>
              <li><button onClick={() => navigate('/genre/action')}>Genres</button></li>
            </ul>
          </div>
          <div className="footer-links-group">
            <h4>Support</h4>
            <ul>
              <li><button>Help Center</button></li>
              <li><button>Contact</button></li>
              <li><button>FAQ</button></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2024 ASTA.IS - All rights reserved</p>
      </div>
    </footer>
  )
}

// ==========================================
// MAIN LANDING
// ==========================================
const Landing = () => {
  return (
    <div className="landing-wrapper">
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <ShowcaseSection />
      <CTASection />
      <Footer />
    </div>
  )
}

export default Landing
