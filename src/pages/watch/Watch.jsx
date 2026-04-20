import { useState, useRef, useCallback, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import './Watch.css'

import { getAnimeById, getRelatedAnime, generateEpisodes, getSampleComments } from '../../services/animeData'

// ==========================================
// ICONS
// ==========================================

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M8 5v14l11-7z"/>
  </svg>
)

const PauseIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
  </svg>
)

const SkipPrevIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z"/>
  </svg>
)

const SkipNextIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M6 18l8.5-6L6 6v12zm10-12v12h2V6h-2z"/>
  </svg>
)

const VolumeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
  </svg>
)

const VolumeMuteIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71z"/>
  </svg>
)

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
  </svg>
)

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
  </svg>
)

const FilmIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
  </svg>
)

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
  </svg>
)

const QualityIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
  </svg>
)

const FullscreenIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
  </svg>
)

const FullscreenExitIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
  </svg>
)

const ChevronLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
  </svg>
)

const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
  </svg>
)

const ChevronDownIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M7 10l5 5 5-5z"/>
  </svg>
)

const PlaylistIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
    <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z"/>
  </svg>
)

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
)

const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
  </svg>
)

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
  </svg>
)

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
  </svg>
)

const ThumbUpIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
  </svg>
)

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
  </svg>
)

const GridIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/>
  </svg>
)

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
  </svg>
)

// ==========================================
// HELPERS
// ==========================================

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// ==========================================
// COMPONENTS
// ==========================================

function MetaBadge({ icon: Icon, children, variant }) {
  return (
    <div className={`meta-badge ${variant ? `meta-badge--${variant}` : ''}`}>
      {Icon && <Icon />}
      <span>{children}</span>
    </div>
  )
}

function ActionButton({ icon: Icon, children, variant, onClick }) {
  return (
    <button className={`action-btn ${variant ? `action-btn--${variant}` : ''}`} onClick={onClick}>
      {Icon && <Icon />}
      <span>{children}</span>
    </button>
  )
}

function VideoPlayer({ episode, onTogglePlay, onSeek, onPrev, onNext, onToggleFullscreen, isPlaying, progress, volume, onVolumeChange, isFullscreen, disablePrev, disableNext, coverImage }) {
  const [showControls, setShowControls] = useState(false)
  const [showSpeedMenu, setShowSpeedMenu] = useState(false)
  const [showQualityMenu, setShowQualityMenu] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState('1x')
  const [quality, setQuality] = useState('1080p')
  const hideTimeoutRef = useRef(null)
  const containerRef = useRef(null)

  const handleMouseMove = useCallback(() => {
    setShowControls(true)
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
    hideTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false)
    }, 3000)
  }, [isPlaying])

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const newProgress = ((e.clientX - rect.left) / rect.width) * 100
    onSeek(Math.min(100, Math.max(0, newProgress)))
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
    onToggleFullscreen()
  }

  const speeds = ['0.5x', '0.75x', '1x', '1.25x', '1.5x', '2x']
  const qualities = ['4K', '1080p', '720p', '480p', '360p']

  return (
    <motion.div
      ref={containerRef}
      className={`video-player ${showControls ? 'show-controls' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="video-bg">
        {coverImage && (
          <img 
            src={coverImage} 
            alt="Video background" 
            className="video-bg-image"
          />
        )}
        <div className="video-placeholder">
          <PlayIcon />
        </div>
      </div>

      <div className="video-overlay" />

      {!isPlaying && (
        <motion.button
          className="play-button"
          onClick={onTogglePlay}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <PlayIcon />
        </motion.button>
      )}

      <div className="video-controls">
        <div className="controls-gradient" />
        
        <div className="progress-area" onClick={handleProgressClick}>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
            <div className="progress-thumb" style={{ left: `${progress}%` }} />
          </div>
        </div>

        <div className="controls-bar">
          <div className="controls-group">
            <button className="ctrl-btn" onClick={onTogglePlay}>
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button className="ctrl-btn" onClick={onPrev} disabled={disablePrev}>
              <SkipPrevIcon />
            </button>
            <button className="ctrl-btn" onClick={onNext} disabled={disableNext}>
              <SkipNextIcon />
            </button>

            <div className="volume-group">
              <button className="ctrl-btn" onClick={() => onVolumeChange(volume === 0 ? 0.8 : 0)}>
                {volume === 0 ? <VolumeMuteIcon /> : <VolumeIcon />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="volume-slider"
              />
            </div>

            <span className="time-display">
              {formatTime(progress * 2.4)} / {formatTime(1440)}
            </span>
          </div>

          <div className="controls-group">
            <span className="episode-badge">
              S{episode.seasonId} E{episode.number}
            </span>

            <div className="dropdown">
              <button className="ctrl-btn" onClick={() => { setShowSpeedMenu(!showSpeedMenu); setShowQualityMenu(false) }}>
                {playbackSpeed}
              </button>
              {showSpeedMenu && (
                <div className="dropdown-menu">
                  {speeds.map((speed) => (
                    <button
                      key={speed}
                      className={speed === playbackSpeed ? 'active' : ''}
                      onClick={() => { setPlaybackSpeed(speed); setShowSpeedMenu(false) }}
                    >
                      {speed}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="dropdown">
              <button className="ctrl-btn" onClick={() => { setShowQualityMenu(!showQualityMenu); setShowSpeedMenu(false) }}>
                <QualityIcon />
              </button>
              {showQualityMenu && (
                <div className="dropdown-menu">
                  {qualities.map((q) => (
                    <button
                      key={q}
                      className={q === quality ? 'active' : ''}
                      onClick={() => { setQuality(q); setShowQualityMenu(false) }}
                    >
                      {q} {q === '1080p' && <span className="best-label">BEST</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="ctrl-btn" onClick={toggleFullscreen}>
              {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function EpisodeNav({ current, onPrev, onNext }) {
  const hasPrev = current.seasonId > 1 || current.number > 1
  const hasNext = current.seasonId < 4 || current.number < 21

  const getPrevInfo = () => {
    if (current.number > 1) {
      return { season: current.seasonId, episode: current.number - 1 }
    } else if (current.seasonId > 1) {
      return { season: current.seasonId - 1, episode: 26 }
    }
    return null
  }

  const getNextInfo = () => {
    if (current.number < 26) {
      return { season: current.seasonId, episode: current.number + 1 }
    } else if (current.seasonId < 4) {
      return { season: current.seasonId + 1, episode: 1 }
    }
    return null
  }

  const prev = getPrevInfo()
  const next = getNextInfo()

  return (
    <div className="episode-nav">
      <button className="nav-btn" onClick={onPrev} disabled={!hasPrev}>
        <ChevronLeftIcon />
        <div className="nav-text">
          <span className="nav-label">Previous</span>
          {prev && <span className="nav-title">S{prev.season} E{prev.episode}</span>}
        </div>
      </button>

      <div className="current-badge">
        S{current.seasonId} • E{current.number}
      </div>

      <button className="nav-btn nav-btn--next" onClick={onNext} disabled={!hasNext}>
        <div className="nav-text">
          <span className="nav-label">Next</span>
          {next && <span className="nav-title">S{next.season} E{next.episode}</span>}
        </div>
        <ChevronRightIcon />
      </button>
    </div>
  )
}

function EpisodesList({ anime, selectedSeason, onSeasonChange, currentEpisode, onSelectEpisode }) {
  const [showDropdown, setShowDropdown] = useState(false)
  const currentSeasonData = anime.seasons.find(s => s.id === selectedSeason)
  const allEpisodes = generateEpisodes(anime)
  const seasonEpisodes = allEpisodes.filter(ep => ep.seasonId === selectedSeason)

  return (
    <section className="episodes-section">
      <div className="section-header">
        <h2 className="section-title">
          <PlaylistIcon />
          <span>Episodes</span>
        </h2>

        <div className="season-selector">
          <button className="season-btn" onClick={() => setShowDropdown(!showDropdown)}>
            <span>{currentSeasonData.name}</span>
            <ChevronDownIcon />
          </button>

          {showDropdown && (
            <div className="season-dropdown">
              {anime.seasons.map((season) => (
                <button
                  key={season.id}
                  className={season.id === selectedSeason ? 'active' : ''}
                  onClick={() => { onSeasonChange(season.id); setShowDropdown(false) }}
                >
                  <span>{season.name}</span>
                  <span className="ep-count">{season.episodes} eps</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="episodes-grid">
        {seasonEpisodes.map((ep) => (
          <motion.div
            key={ep.id}
            className={`episode-card ${ep.seasonId === currentEpisode.seasonId && ep.number === currentEpisode.number ? 'active' : ''}`}
            onClick={() => onSelectEpisode(ep)}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <div className="episode-thumb">
              <img 
                src={anime.cover} 
                alt={`Episode ${ep.number}`} 
                className="episode-image"
                loading="lazy"
              />
              <div className="episode-overlay">
                <PlayIcon />
              </div>
              
              {ep.isNew && <span className="ep-badge ep-badge--new">NEW</span>}
              {ep.isWatched && (
                <span className="ep-badge ep-badge--watched">
                  <CheckIcon />
                </span>
              )}
              <span className="ep-duration">{ep.duration}</span>
            </div>

            <div className="episode-info">
              <span className="ep-number">Episode {ep.number}</span>
              <span className="ep-title">{ep.title}</span>
              
              {ep.progress > 0 && (
                <div className="ep-progress">
                  <div className="ep-progress-fill" style={{ width: `${ep.progress}%` }} />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function CommentsSection({ comments }) {
  const [sortBy, setSortBy] = useState('top')

  return (
    <section className="comments-section">
      <div className="comments-header">
        <h2 className="section-title">
          <span>Comments</span>
          <span className="comment-count">({comments.length})</span>
        </h2>

        <div className="sort-buttons">
          <button className={`sort-btn ${sortBy === 'top' ? 'active' : ''}`} onClick={() => setSortBy('top')}>
            Top
          </button>
          <button className={`sort-btn ${sortBy === 'newest' ? 'active' : ''}`} onClick={() => setSortBy('newest')}>
            Newest
          </button>
        </div>
      </div>

      <div className="comment-input">
        <div className="comment-avatar" style={{ background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' }}>
          👤
        </div>
        <input type="text" placeholder="Share your thoughts about this anime..." />
        <button className="send-btn">
          <SendIcon />
        </button>
      </div>

      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <div className="comment-avatar" style={{ background: 'linear-gradient(135deg, #374151, #1f2937)' }}>
              {comment.avatar}
            </div>
            <div className="comment-body">
              <div className="comment-meta">
                <span className="comment-author">{comment.user}</span>
                <span className="comment-time">{comment.time}</span>
              </div>
              <p className="comment-text">{comment.text}</p>
              <div className="comment-actions">
                <button className="comment-action">
                  <ThumbUpIcon />
                  <span>{comment.likes}</span>
                </button>
                <button className="comment-action">Reply</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="view-more-btn">View All Comments</button>
    </section>
  )
}

function RelatedSidebar({ anime, relatedAnime }) {
  return (
    <aside className="sidebar">
      <h3 className="sidebar-title">
        <GridIcon />
        <span>Related Anime</span>
      </h3>

      <div className="related-list">
        {relatedAnime.map((item) => (
          <Link to={`/watch/${item.id}`} key={item.id} className="related-card-link">
            <motion.div
              className="related-card"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="related-thumb">
                <img src={item.poster} alt={item.title} className="related-image" />
              </div>
              <div className="related-info">
                <span className="related-title">{item.title}</span>
                <span className="related-rating">
                  <StarIcon />
                  <span>{item.rating}</span>
                </span>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </aside>
  )
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function Watch() {
  const { animeId } = useParams()
  const navigate = useNavigate()
  
  const anime = getAnimeById(parseInt(animeId))
  
  const [selectedSeason, setSelectedSeason] = useState(anime?.seasons[0]?.id || 1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Get current episode from state or default to first
  const [currentEpisode, setCurrentEpisode] = useState({
    seasonId: anime?.seasons[0]?.id || 1,
    number: 1
  })

  // Update episode when season changes
  useEffect(() => {
    if (anime) {
      const seasonData = anime.seasons.find(s => s.id === selectedSeason)
      if (seasonData) {
        setCurrentEpisode(prev => ({
          ...prev,
          seasonId: selectedSeason,
          number: 1
        }))
      }
    }
  }, [selectedSeason, anime])

  // Navigation helpers
  const hasPrevEpisode = () => {
    if (!anime) return false
    const currentSeasonIndex = anime.seasons.findIndex(s => s.id === currentEpisode.seasonId)
    if (currentEpisode.number > 1) return true
    if (currentSeasonIndex > 0) return true
    return false
  }

  const hasNextEpisode = () => {
    if (!anime) return false
    const currentSeason = anime.seasons.find(s => s.id === currentEpisode.seasonId)
    if (currentEpisode.number < currentSeason.episodes) return true
    const currentSeasonIndex = anime.seasons.findIndex(s => s.id === currentEpisode.seasonId)
    if (currentSeasonIndex < anime.seasons.length - 1) return true
    return false
  }

  const handlePrev = () => {
    if (!anime) return
    const currentSeason = anime.seasons.find(s => s.id === currentEpisode.seasonId)
    
    if (currentEpisode.number > 1) {
      setCurrentEpisode(prev => ({ ...prev, number: prev.number - 1 }))
    } else {
      const currentSeasonIndex = anime.seasons.findIndex(s => s.id === currentEpisode.seasonId)
      if (currentSeasonIndex > 0) {
        const prevSeason = anime.seasons[currentSeasonIndex - 1]
        setCurrentEpisode({ seasonId: prevSeason.id, number: prevSeason.episodes })
        setSelectedSeason(prevSeason.id)
      }
    }
  }

  const handleNext = () => {
    if (!anime) return
    const currentSeason = anime.seasons.find(s => s.id === currentEpisode.seasonId)
    
    if (currentEpisode.number < currentSeason.episodes) {
      setCurrentEpisode(prev => ({ ...prev, number: prev.number + 1 }))
    } else {
      const currentSeasonIndex = anime.seasons.findIndex(s => s.id === currentEpisode.seasonId)
      if (currentSeasonIndex < anime.seasons.length - 1) {
        const nextSeason = anime.seasons[currentSeasonIndex + 1]
        setCurrentEpisode({ seasonId: nextSeason.id, number: 1 })
        setSelectedSeason(nextSeason.id)
      }
    }
  }

  const handleSelectEpisode = (ep) => {
    setCurrentEpisode({ seasonId: ep.seasonId, number: ep.number })
    setSelectedSeason(ep.seasonId)
  }

  // If anime not found, show error
  if (!anime) {
    return (
      <div className="watch-page">
        <div className="watch-container">
          <div className="anime-not-found">
            <h1>Anime not found</h1>
            <p>The anime you're looking for doesn't exist.</p>
            <Link to="/browse" className="back-link">
              <ArrowLeftIcon />
              Back to Browse
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const relatedAnime = getRelatedAnime(anime.id, 5)
  const comments = getSampleComments(anime.title)

  return (
    <div className="watch-page">
      <div className="ambient-bg" />
      
      <div className="watch-container">
        <main className="watch-main">
          <VideoPlayer
            episode={currentEpisode}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            onSeek={setProgress}
            onPrev={handlePrev}
            onNext={handleNext}
            onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
            isPlaying={isPlaying}
            progress={progress}
            volume={volume}
            onVolumeChange={setVolume}
            isFullscreen={isFullscreen}
            disablePrev={!hasPrevEpisode()}
            disableNext={!hasNextEpisode()}
            coverImage={anime.cover}
          />

          <EpisodeNav
            current={currentEpisode}
            onPrev={handlePrev}
            onNext={handleNext}
          />

          <motion.div
            className="anime-info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="anime-details">
              <h1 className="anime-title">{anime.title}</h1>
              
              <div className="anime-meta">
                <MetaBadge icon={StarIcon} variant="rating">{anime.rating}</MetaBadge>
                <MetaBadge icon={CalendarIcon}>{anime.year}</MetaBadge>
                <MetaBadge icon={FilmIcon}>{anime.type}</MetaBadge>
                <MetaBadge icon={ClockIcon}>{anime.duration}</MetaBadge>
                <MetaBadge>{anime.ageRating}</MetaBadge>
              </div>

              <p className="anime-description">{anime.description}</p>

              <div className="anime-genres">
                {anime.genres.map((genre, idx) => (
                  <span key={idx} className="genre-tag">{genre}</span>
                ))}
              </div>
            </div>

            <div className="anime-actions">
              <ActionButton icon={PlusIcon} variant="primary">Add to List</ActionButton>
              <ActionButton icon={ShareIcon}>Share</ActionButton>
              <ActionButton icon={HeartIcon}>Like</ActionButton>
            </div>
          </motion.div>

          <EpisodesList
            anime={anime}
            selectedSeason={selectedSeason}
            onSeasonChange={setSelectedSeason}
            currentEpisode={currentEpisode}
            onSelectEpisode={handleSelectEpisode}
          />

          <CommentsSection comments={comments} />
        </main>

        <RelatedSidebar anime={anime} relatedAnime={relatedAnime} />
      </div>
    </div>
  )
}
