import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Browse.css';
import { getAllAnime } from '../../services/animeData';

const Browse = () => {
  const animeData = getAllAnime();
  const navigate = useNavigate();
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('popularity');
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const gemsRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const allGenres = ['All', 'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Supernatural', 'Superhero'];

  const filteredAnime = animeData
    .filter(anime => {
      const matchesGenre = selectedGenre === 'All' || anime.genres.some(g => g.toLowerCase().includes(selectedGenre.toLowerCase()));
      const matchesSearch = anime.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesGenre && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'year') return b.year - a.year;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return b.rating - a.rating;
    });

  const hiddenGems = animeData
    .filter(a => a.rating >= 8.4 && a.rating <= 8.9)
    .slice(0, 4);

  const trendingAnime = animeData
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  const handleAnimeClick = (anime, e) => {
    // If clicking the watch button, navigate directly
    if (e.target.closest('.card-watch-btn')) {
      navigate(`/watch/${anime.id}`);
      return;
    }
    // Otherwise open modal
    setSelectedAnime(anime);
  };

  const handleWatchClick = (anime, e) => {
    e.stopPropagation();
    navigate(`/watch/${anime.id}`);
  };

  return (
    <div className="browse-page">
      {/* Hero Section */}
      <section className="browse-hero">
        <div className="hero-bg">
          <div className="hero-gradient-left"></div>
          <div className="hero-gradient-right"></div>
          <div className="hero-dots"></div>
        </div>
        
        <div className={`hero-main ${isLoaded ? 'loaded' : ''}`}>
          <div className="hero-text-section">
            <div className="hero-eyebrow">
              <span className="eyebrow-line"></span>
              <span>Your Gateway to Anime</span>
            </div>
            
            <h1 className="hero-heading">
              <span className="heading-line delay-1">Unlimited</span>
              <span className="heading-line gradient delay-2">Entertainment</span>
              <span className="heading-line delay-3">Awaits</span>
            </h1>
            
            <p className="hero-desc">
              Stream the latest episodes, discover hidden gems, and join millions of anime fans worldwide.
            </p>
            
            <div className="hero-cta">
              <button className="cta-btn primary">
                Browse Now
              </button>
              <button className="cta-btn secondary">
                View Trailer
              </button>
            </div>
          </div>
        </div>
        
        <div className="hero-stats-bar">
          <div className="stat-box">
            <span className="stat-num">12K+</span>
            <span className="stat-txt">Anime Titles</span>
          </div>
          <div className="stat-divider-v"></div>
          <div className="stat-box">
            <span className="stat-num">100K+</span>
            <span className="stat-txt">Episodes</span>
          </div>
          <div className="stat-divider-v"></div>
          <div className="stat-box">
            <span className="stat-num">4K</span>
            <span className="stat-txt">Quality</span>
          </div>
          <div className="stat-divider-v"></div>
          <div className="stat-box">
            <span className="stat-num">24/7</span>
            <span className="stat-txt">Streaming</span>
          </div>
        </div>
      </section>

      {/* Discover Hidden Gems Section */}
      <section className="gems-section" ref={gemsRef}>
        <div className="gems-container">
          <div className="gems-header">
            <div className="gems-title-group">
              <span className="gems-badge">
                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
                Hidden Gems
              </span>
              <h2 className="gems-title">Discover Underrated Anime</h2>
              <p className="gems-subtitle">Curated picks that deserve more attention</p>
            </div>
            <button className="gems-view-all">View All</button>
          </div>

          <div className="gems-grid">
            {hiddenGems.map((anime, index) => (
              <div 
                key={anime.id} 
                className="gem-card"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={(e) => handleAnimeClick(anime, e)}
              >
                <div className="gem-image">
                  <img src={anime.poster} alt={anime.title} />
                  <div className="gem-overlay">
                    <div className="gem-play">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="gem-content">
                  <div className="gem-rating">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    {anime.rating}
                  </div>
                  <h3 className="gem-title">{anime.title}</h3>
                  <div className="gem-meta">
                    <span>{anime.year}</span>
                    <span className="gem-dot">•</span>
                    <span>{typeof anime.episodes === 'number' ? `${anime.episodes} eps` : anime.episodes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Now Section */}
      <section className="trending-section">
        <div className="trending-container">
          <div className="trending-header">
            <div className="trending-title-group">
              <span className="trending-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
                Trending
              </span>
              <h2 className="trending-title">Popular Right Now</h2>
            </div>
          </div>

          <div className="trending-list">
            {trendingAnime.map((anime, index) => (
              <div 
                key={anime.id} 
                className="trending-item"
                onClick={(e) => handleAnimeClick(anime, e)}
              >
                <span className="trending-rank">#{index + 1}</span>
                <div className="trending-image">
                  <img src={anime.poster} alt={anime.title} />
                </div>
                <div className="trending-info">
                  <h4 className="trending-name">{anime.title}</h4>
                  <div className="trending-meta">
                    <span className="trending-rating">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      {anime.rating}
                    </span>
                    <span>{anime.year}</span>
                    <span className="trending-dot">•</span>
                    <span>{anime.status}</span>
                  </div>
                </div>
                <div className="trending-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Controls */}
      <div className="browse-controls-wrapper">
        <div className="browse-controls-inner">
          <div className="browse-search-section">
            <div className="browse-search-box">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search anime..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="clear-search" onClick={() => setSearchTerm('')}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="browse-filters-row">
            <div className="genre-pills-wrapper">
              <div className="genre-pills">
                {allGenres.map((genre) => (
                  <button
                    key={genre}
                    className={`genre-pill ${selectedGenre === genre ? 'active' : ''}`}
                    onClick={() => setSelectedGenre(genre)}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            <div className="browse-actions">
              <select 
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popularity">Popular</option>
                <option value="rating">Top Rated</option>
                <option value="year">Newest</option>
                <option value="title">A-Z</option>
              </select>

              <div className="view-toggle">
                <button 
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
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
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="results-info">
            <span className="results-count">
              {filteredAnime.length} anime found
            </span>
            {selectedGenre !== 'All' && (
              <button 
                className="clear-filter"
                onClick={() => setSelectedGenre('All')}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Anime Grid */}
      <div className="browse-content">
        {filteredAnime.length > 0 ? (
          <div className={`anime-display ${viewMode}`}>
            {filteredAnime.map((anime, index) => (
              <div
                key={anime.id}
                className="anime-card"
                style={{ animationDelay: `${index * 0.06}s` }}
                onClick={(e) => handleAnimeClick(anime, e)}
              >
                <div className="card-image">
                  <img src={anime.poster} alt={anime.title} />
                  <div className="card-overlay">
                    <div className="play-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="card-badges">
                    <span className={`status-badge ${anime.status.toLowerCase().replace(' ', '-')}`}>
                      {anime.status}
                    </span>
                  </div>
                  <div className="rating-badge">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    {anime.rating}
                  </div>
                </div>
                <div className="card-info">
                  <h3 className="card-title">{anime.title}</h3>
                  <div className="card-meta">
                    <span>{anime.year}</span>
                    <span className="card-sep">-</span>
                    <span>{typeof anime.episodes === 'number' ? `${anime.episodes} eps` : anime.episodes}</span>
                  </div>
                  <div className="card-genres">
                    {anime.genres.slice(0, 2).map(g => (
                      <span key={g} className="genre-tag">{g}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No Results Found</h3>
            <p>Try different keywords</p>
            <button onClick={() => { setSearchTerm(''); setSelectedGenre('All'); }}>
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Anime Detail Modal */}
      {selectedAnime && (
        <div className="anime-modal-overlay" onClick={() => setSelectedAnime(null)}>
          <div className="anime-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedAnime(null)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
            
            <div className="modal-image">
              <img src={selectedAnime.poster} alt={selectedAnime.title} />
            </div>
            
            <div className="modal-content">
              <div className="modal-header">
                <span className={`modal-status ${selectedAnime.status.toLowerCase().replace(' ', '-')}`}>
                  {selectedAnime.status}
                </span>
                <div className="modal-rating">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  {selectedAnime.rating}
                </div>
              </div>
              
              <h2 className="modal-title">{selectedAnime.title}</h2>
              
              <div className="modal-meta">
                <div className="meta-item">
                  <span className="meta-label">Year</span>
                  <span className="meta-value">{selectedAnime.year}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Episodes</span>
                  <span className="meta-value">{selectedAnime.episodes}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Genres</span>
                  <span className="meta-value">{selectedAnime.genres.join(', ')}</span>
                </div>
              </div>
              
              <p className="modal-description">{selectedAnime.description}</p>
              
              <div className="modal-actions">
                <Link to={`/watch/${selectedAnime.id}`} className="btn-primary">
                  Watch Now
                </Link>
                <button className="btn-secondary">Add to List</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Browse;
