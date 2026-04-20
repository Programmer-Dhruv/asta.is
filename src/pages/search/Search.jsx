import { useState, useMemo, useRef, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getAllAnime } from '../../services/animeData'
import './Search.css'

/* ─── SVG Icons ─────────────────────────────────────────────────── */
const SearchIcon = ({ size = 24 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    width={size} height={size} aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
)

const ClearIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    width="18" height="18" aria-hidden="true">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
)

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13" aria-hidden="true">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26" aria-hidden="true">
    <path d="M8 5v14l11-7z" />
  </svg>
)

const FilterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    width="18" height="18" aria-hidden="true">
    <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
  </svg>
)

const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    width="16" height="16" aria-hidden="true">
    <path d="M6 9l6 6 6-6" />
  </svg>
)

/* ─── Animation Variants ─────────────────────────────────────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show:   { opacity: 1, y: 0,  scale: 1,    transition: { type: 'spring', stiffness: 260, damping: 24 } },
  exit:   { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.18 } },
}

/* ─── Component ─────────────────────────────────────────────────── */
const Search = () => {
  const allAnime      = getAllAnime()
  const navigate      = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const inputRef      = useRef(null)

  // State – initialise query from ?q= URL param for shareability
  const [query,          setQuery]          = useState(searchParams.get('q') || '')
  const [selectedGenre,  setSelectedGenre]  = useState('')
  const [selectedYear,   setSelectedYear]   = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedRating, setSelectedRating] = useState('')
  const [sortBy,         setSortBy]         = useState('relevance')
  const [showFilters,    setShowFilters]    = useState(false)

  // Sync URL with query
  useEffect(() => {
    const params = {}
    if (query) params.q = query
    setSearchParams(params, { replace: true })
  }, [query]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-focus on mount
  useEffect(() => { inputRef.current?.focus() }, [])

  /* ── Derived filter data ── */
  const allGenres  = useMemo(
    () => [...new Set(allAnime.flatMap(a => a.genres))].sort(),
    [allAnime]
  )
  const allYears   = useMemo(
    () => [...new Set(allAnime.map(a => a.year))].sort((a, b) => b - a),
    [allAnime]
  )
  const allStatuses = useMemo(
    () => [...new Set(allAnime.map(a => a.status))].sort(),
    [allAnime]
  )

  /* ── Search & filter logic ── */
  const searchResults = useMemo(() => {
    let results = [...allAnime]
    const q = query.trim().toLowerCase()

    if (q) {
      results = results.filter(anime =>
        anime.title.toLowerCase().includes(q) ||
        (anime.originalTitle && anime.originalTitle.toLowerCase().includes(q)) ||
        anime.genres.some(g => g.toLowerCase().includes(q)) ||
        String(anime.year).includes(q)
      )
    }

    if (selectedGenre) {
      results = results.filter(a =>
        a.genres.some(g => g.toLowerCase() === selectedGenre.toLowerCase())
      )
    }

    if (selectedYear) {
      results = results.filter(a => a.year === parseInt(selectedYear, 10))
    }

    if (selectedStatus) {
      results = results.filter(a =>
        a.status.toLowerCase() === selectedStatus.toLowerCase()
      )
    }

    if (selectedRating) {
      const min = parseFloat(selectedRating)
      results = results.filter(a => a.rating >= min)
    }

    switch (sortBy) {
      case 'rating':  results.sort((a, b) => b.rating - a.rating);                      break
      case 'year':    results.sort((a, b) => b.year - a.year);                           break
      case 'title':   results.sort((a, b) => a.title.localeCompare(b.title));            break
      case 'episodes':results.sort((a, b) => (Number(b.episodes) || 0) - (Number(a.episodes) || 0)); break
      default: break // relevance – keep match order
    }

    return results
  }, [query, selectedGenre, selectedYear, selectedStatus, selectedRating, sortBy, allAnime])

  /* ── Helpers ── */
  const hasActiveFilters = selectedGenre || selectedYear || selectedStatus || selectedRating
  const hasAnyInput      = query || hasActiveFilters

  const clearAll = () => {
    setQuery('')
    setSelectedGenre('')
    setSelectedYear('')
    setSelectedStatus('')
    setSelectedRating('')
    setSortBy('relevance')
    inputRef.current?.focus()
  }

  const activeFilterCount = [selectedGenre, selectedYear, selectedStatus, selectedRating]
    .filter(Boolean).length

  /* ── Render ── */
  return (
    <div className="search-page">

      {/* ── Background decoration ── */}
      <div className="search-bg-glow" aria-hidden="true" />

      <div className="search-container">

        {/* ── Header ── */}
        <motion.header
          className="search-header"
          initial={{ opacity: 0, y: -28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="search-header-badge">
            <SearchIcon size={14} />
            <span>Search Library</span>
          </div>
          <h1 className="search-heading">
            Find Your Next<br />
            <span className="search-heading-gradient">Anime Adventure</span>
          </h1>
          <p className="search-subheading">
            Search across {allAnime.length} titles by name, genre, or year
          </p>
        </motion.header>

        {/* ── Search Input ── */}
        <motion.div
          className="search-input-wrapper"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12 }}
        >
          <div className="search-input-box" data-active={!!query}>
            <span className="search-input-icon">
              <SearchIcon size={22} />
            </span>

            <input
              ref={inputRef}
              type="search"
              placeholder="Search by title, genre, year…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Search anime"
              autoComplete="off"
              spellCheck="false"
            />

            <AnimatePresence>
              {query && (
                <motion.button
                  className="search-clear-btn"
                  onClick={() => { setQuery(''); inputRef.current?.focus() }}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.15 }}
                  aria-label="Clear search"
                >
                  <ClearIcon />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Filter toggle button */}
            <button
              className={`search-filter-toggle ${showFilters ? 'active' : ''} ${activeFilterCount > 0 ? 'has-badge' : ''}`}
              onClick={() => setShowFilters(v => !v)}
              aria-expanded={showFilters}
              aria-label="Toggle filters"
              data-count={activeFilterCount || undefined}
            >
              <FilterIcon />
              <span>Filters</span>
              <span className="filter-toggle-chevron">
                <ChevronIcon />
              </span>
            </button>
          </div>
        </motion.div>

        {/* ── Collapsible Filters Panel ── */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className="search-filters-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="search-filters-inner">
                {/* Genre */}
                <div className="filter-field">
                  <label className="filter-label" htmlFor="filter-genre">Genre</label>
                  <div className="filter-select-wrap">
                    <select
                      id="filter-genre"
                      value={selectedGenre}
                      onChange={e => setSelectedGenre(e.target.value)}
                    >
                      <option value="">All Genres</option>
                      {allGenres.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                </div>

                {/* Year */}
                <div className="filter-field">
                  <label className="filter-label" htmlFor="filter-year">Year</label>
                  <div className="filter-select-wrap">
                    <select
                      id="filter-year"
                      value={selectedYear}
                      onChange={e => setSelectedYear(e.target.value)}
                    >
                      <option value="">All Years</option>
                      {allYears.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>

                {/* Status */}
                <div className="filter-field">
                  <label className="filter-label" htmlFor="filter-status">Status</label>
                  <div className="filter-select-wrap">
                    <select
                      id="filter-status"
                      value={selectedStatus}
                      onChange={e => setSelectedStatus(e.target.value)}
                    >
                      <option value="">All Statuses</option>
                      {allStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                {/* Min Rating */}
                <div className="filter-field">
                  <label className="filter-label" htmlFor="filter-rating">Min Rating</label>
                  <div className="filter-select-wrap">
                    <select
                      id="filter-rating"
                      value={selectedRating}
                      onChange={e => setSelectedRating(e.target.value)}
                    >
                      <option value="">Any Rating</option>
                      <option value="9">9.0+ Elite</option>
                      <option value="8.5">8.5+ Excellent</option>
                      <option value="8">8.0+ Great</option>
                      <option value="7">7.0+ Good</option>
                    </select>
                  </div>
                </div>

                {/* Sort */}
                <div className="filter-field">
                  <label className="filter-label" htmlFor="filter-sort">Sort By</label>
                  <div className="filter-select-wrap">
                    <select
                      id="filter-sort"
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value)}
                    >
                      <option value="relevance">Relevance</option>
                      <option value="rating">Top Rated</option>
                      <option value="year">Newest First</option>
                      <option value="title">A → Z</option>
                      <option value="episodes">Most Episodes</option>
                    </select>
                  </div>
                </div>

                {hasActiveFilters && (
                  <button className="filter-clear-btn" onClick={clearAll}>
                    <ClearIcon />
                    Clear All
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Results Meta Bar ── */}
        <motion.div
          className="search-meta-bar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <span className="search-results-count">
            <strong>{searchResults.length}</strong>
            &nbsp;{searchResults.length === 1 ? 'result' : 'results'}
            {hasAnyInput && <span className="search-meta-context"> found</span>}
          </span>

          {hasAnyInput && (
            <button className="search-reset-link" onClick={clearAll}>
              Reset all
            </button>
          )}
        </motion.div>

        {/* ── Genre Quick Chips (always visible) ── */}
        <motion.div
          className="search-genre-chips"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button
            className={`genre-chip ${selectedGenre === '' ? 'active' : ''}`}
            onClick={() => setSelectedGenre('')}
          >
            All
          </button>
          {allGenres.map(genre => (
            <button
              key={genre}
              className={`genre-chip ${selectedGenre === genre ? 'active' : ''}`}
              onClick={() => setSelectedGenre(g => g === genre ? '' : genre)}
            >
              {genre}
            </button>
          ))}
        </motion.div>

        {/* ── Results Grid ── */}
        <AnimatePresence mode="wait">
          {searchResults.length > 0 ? (
            <motion.div
              key="results"
              className="search-results-grid"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {searchResults.map(anime => (
                <motion.div
                  key={anime.id}
                  variants={cardVariants}
                  layout
                >
                  <Link
                    to={`/watch/${anime.id}`}
                    className="search-card"
                    aria-label={`Watch ${anime.title}`}
                  >
                    {/* Poster */}
                    <div className="search-card-poster">
                      <img
                        src={anime.poster}
                        alt={anime.title}
                        loading="lazy"
                        onError={e => { e.currentTarget.src = 'https://placehold.co/300x420/111/555?text=No+Image' }}
                      />

                      {/* Hover overlay */}
                      <div className="search-card-overlay">
                        <div className="search-card-play">
                          <PlayIcon />
                        </div>
                        <span className="search-card-watch-label">Watch Now</span>
                      </div>

                      {/* Badges */}
                      <div className="search-card-badges">
                        <span className={`search-card-status ${anime.status === 'Ongoing' ? 'ongoing' : 'finished'}`}>
                          {anime.status}
                        </span>
                      </div>

                      <div className="search-card-rating">
                        <StarIcon />
                        <span>{anime.rating}</span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="search-card-info">
                      <h3 className="search-card-title" title={anime.title}>
                        {anime.title}
                      </h3>

                      <div className="search-card-meta">
                        <span>{anime.year}</span>
                        <span className="search-card-sep" aria-hidden="true">·</span>
                        <span>{anime.type}</span>
                        {typeof anime.episodes === 'number' && (
                          <>
                            <span className="search-card-sep" aria-hidden="true">·</span>
                            <span>{anime.episodes} eps</span>
                          </>
                        )}
                      </div>

                      <div className="search-card-genres">
                        {anime.genres.slice(0, 2).map(g => (
                          <span key={g} className="search-card-genre">{g}</span>
                        ))}
                        {anime.genres.length > 2 && (
                          <span className="search-card-genre muted">+{anime.genres.length - 2}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* ── Empty State ── */
            <motion.div
              key="empty"
              className="search-empty"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="search-empty-icon" aria-hidden="true">
                <SearchIcon size={36} />
              </div>
              <h2 className="search-empty-title">No Results Found</h2>
              <p className="search-empty-text">
                {query
                  ? <>No anime matched &ldquo;<strong>{query}</strong>&rdquo;. Try a different keyword or clear your filters.</>
                  : 'Try adjusting your filters to find what you\'re looking for.'}
              </p>
              <button className="search-empty-btn" onClick={clearAll}>
                Clear & Start Over
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}

export default Search
