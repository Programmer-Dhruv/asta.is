import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getAllAnime } from '../../services/animeData'
import './Top.css'

// Icons
const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
)

const FireIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
)

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
    <path d="M8 5v14l11-7z"/>
  </svg>
)

const CrownIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z"/>
  </svg>
)

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
  </svg>
)

const Top = () => {
  const allAnime = getAllAnime()
  const [viewMode, setViewMode] = useState('grid')

  const topAnime = useMemo(() => {
    return [...allAnime].sort((a, b) => b.rating - a.rating)
  }, [allAnime])

  const heroAnime = topAnime[0]
  const runnersUp = topAnime.slice(1, 4)
  const remainingAnime = topAnime.slice(4)

  return (
    <div className="top-page">
      {/* Ambient Background Effects */}
      <div className="top-bg-effects">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
        <div className="bg-grid"></div>
      </div>

      <div className="top-container">
        {/* Header */}
        <motion.div 
          className="top-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="top-title-section">
            <div className="top-icon">
              <FireIcon />
            </div>
            <div>
              <h1>Top Anime</h1>
              <p>Rated by the community • Updated daily</p>
            </div>
          </div>
        </motion.div>

        {/* #1 Hero Section */}
        <AnimatePresence mode="wait">
          {heroAnime && (
            <motion.div
              key={heroAnime.id}
              className="hero-section"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <div className="hero-content">
                {/* Hero Background */}
                <div className="hero-bg">
                  <img 
                    src={heroAnime.cover} 
                    alt="" 
                    className="hero-bg-image"
                  />
                  <div className="hero-bg-overlay"></div>
                  <div className="hero-bg-gradient"></div>
                </div>

                {/* Hero Badge */}
                <div className="hero-badge">
                  <span className="hero-badge-icon">
                    <CrownIcon />
                  </span>
                  <span>#1 RANKED ANIME</span>
                </div>

                {/* Hero Info */}
                <div className="hero-info">
                  <div className="hero-rank-display">
                    <span className="rank-number">01</span>
                  </div>
                  
                  <div className="hero-details">
                    <h2 className="hero-title">{heroAnime.title}</h2>
                    
                    <div className="hero-meta">
                      <div className="hero-rating">
                        <StarIcon />
                        <span className="rating-value">{heroAnime.rating}</span>
                        <span className="rating-max">/10</span>
                      </div>
                      <span className="meta-divider">•</span>
                      <span className="meta-year">{heroAnime.year}</span>
                      <span className="meta-divider">•</span>
                      <span className="meta-type">{heroAnime.type}</span>
                    </div>

                    <p className="hero-description">{heroAnime.description}</p>

                    <div className="hero-genres">
                      {heroAnime.genres.map((genre, idx) => (
                        <span key={idx} className="genre-pill">{genre}</span>
                      ))}
                    </div>

                    <div className="hero-actions">
                      <Link to={`/watch/${heroAnime.id}`} className="hero-btn hero-btn-primary">
                        <PlayIcon />
                        <span>Watch Now</span>
                      </Link>
                      <button className="hero-btn hero-btn-secondary">
                        <PlusIcon />
                        <span>Add to List</span>
                      </button>
                    </div>
                  </div>

                  <div className="hero-poster">
                    <img src={heroAnime.poster} alt={heroAnime.title} />
                    <div className="poster-glow"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top 2-4 Section */}
        <motion.div 
          className="runners-section"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h3 className="section-title">
            <span className="title-accent">Top</span> Runners Up
          </h3>
          
          <div className="runners-grid">
            {runnersUp.map((anime, index) => (
              <motion.div
                key={anime.id}
                className={`runner-card runner-${index + 2}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -12, scale: 1.02 }}
              >
                <Link to={`/watch/${anime.id}`} className="runner-link">
                  <div className="runner-rank-badge">
                    #{index + 2}
                  </div>
                  <div className="runner-image">
                    <img src={anime.poster} alt={anime.title} />
                    <div className="runner-overlay">
                      <div className="runner-play">
                        <PlayIcon />
                      </div>
                    </div>
                  </div>
                  <div className="runner-info">
                    <h4>{anime.title}</h4>
                    <div className="runner-meta">
                      <span className="runner-rating">
                        <StarIcon />
                        {anime.rating}
                      </span>
                      <span className="runner-year">{anime.year}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Ranking Grid */}
        <div className="ranking-section">
          <div className="ranking-header">
            <h3 className="section-title">
              <span className="title-accent">Full</span> Rankings
            </h3>
            
            <div className="view-toggle">
              <button 
                className={viewMode === 'grid' ? 'active' : ''}
                onClick={() => setViewMode('grid')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                </svg>
              </button>
              <button 
                className={viewMode === 'list' ? 'active' : ''}
                onClick={() => setViewMode('list')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
                </svg>
              </button>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <motion.div 
              className="anime-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {remainingAnime.map((anime, index) => (
                <motion.div
                  key={anime.id}
                  className="anime-grid-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  whileHover={{ y: -8 }}
                >
                  <Link to={`/watch/${anime.id}`} className="grid-item-link">
                    <div className="grid-rank-badge">#{index + 5}</div>
                    <div className="grid-image-wrapper">
                      <img src={anime.poster} alt={anime.title} />
                      <div className="grid-hover-overlay">
                        <div className="grid-play-btn">
                          <PlayIcon />
                        </div>
                      </div>
                      <div className="grid-rating-badge">
                        <StarIcon />
                        <span>{anime.rating}</span>
                      </div>
                    </div>
                    <div className="grid-content">
                      <h4 className="grid-title">{anime.title}</h4>
                      <div className="grid-meta">
                        <span>{anime.year}</span>
                        <span className="grid-meta-dot">•</span>
                        <span>{anime.type}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="anime-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {remainingAnime.map((anime, index) => (
                <motion.div
                  key={anime.id}
                  className="list-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  whileHover={{ x: 8, backgroundColor: "rgba(139, 92, 246, 0.08)" }}
                >
                  <Link to={`/watch/${anime.id}`} className="list-item-link">
                    <span className="list-rank">#{index + 5}</span>
                    <div className="list-image">
                      <img src={anime.poster} alt={anime.title} />
                    </div>
                    <div className="list-content">
                      <h4>{anime.title}</h4>
                      <div className="list-meta">
                        <span>{anime.year}</span>
                        <span className="dot">•</span>
                        <span>{anime.type}</span>
                        <span className="dot">•</span>
                        <span>{anime.genres.slice(0, 2).join(', ')}</span>
                      </div>
                    </div>
                    <div className="list-rating">
                      <StarIcon />
                      <span>{anime.rating}</span>
                    </div>
                    <div className="list-arrow">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Top
