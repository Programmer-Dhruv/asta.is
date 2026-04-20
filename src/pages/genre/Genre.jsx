import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAllAnime } from '../../services/animeData';
import './Genre.css';

const GENRE_INFO = {
  Action: {
    description: 'High-octane sequences, intense battles, and adrenaline-pumping action. From sword fights to superpowers, these anime deliver non-stop excitement.',
    icon: '⚔️',
    color: '#ef4444'
  },
  Adventure: {
    description: 'Embark on thrilling journeys across fantastical worlds. Follow brave protagonists as they explore, discover, and face countless challenges.',
    icon: '🧭',
    color: '#f59e0b'
  },
  Comedy: {
    description: 'Laugh out loud with hilarious moments, witty banter, and comedic chaos. These anime are perfect for lifting your spirits.',
    icon: '😂',
    color: '#fbbf24'
  },
  Drama: {
    description: 'Deep emotional stories that explore complex relationships, personal struggles, and the human condition with compelling narratives.',
    icon: '🎭',
    color: '#8b5cf6'
  },
  Fantasy: {
    description: 'Enter magical realms filled with mythical creatures, powerful sorcery, and extraordinary adventures beyond imagination.',
    icon: '✨',
    color: '#a855f7'
  },
  Horror: {
    description: 'Face your deepest fears with chilling tales of supernatural terror, psychological horror, and nightmarish creatures.',
    icon: '👻',
    color: '#6366f1'
  },
  Supernatural: {
    description: 'Explore the boundary between the living and the otherworldly with ghosts, demons, psychic powers, and mysterious phenomena.',
    icon: '🌙',
    color: '#7c3aed'
  },
  Superhero: {
    description: 'Extraordinary individuals with unique powers defending the innocent. Hero stories with epic battles and inspiring moments.',
    icon: '🦸',
    color: '#0ea5e9'
  }
};

const ALL_GENRES = Object.keys(GENRE_INFO);

const Genre = () => {
  const { genreName } = useParams();
  const [animeList, setAnimeList] = useState([]);
  const [currentGenre, setCurrentGenre] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    const genre = genreName ? decodeURIComponent(genreName) : 'Action';
    const formattedGenre = ALL_GENRES.find(
      g => g.toLowerCase() === genre.toLowerCase()
    ) || 'Action';

    const allAnime = getAllAnime();
    const filteredAnime = allAnime.filter(anime =>
      anime.genres.some(g => g.toLowerCase() === formattedGenre.toLowerCase())
    );

    // Sort anime based on selected option
    const sortedAnime = [...filteredAnime].sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'year') return b.year - a.year;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return b.rating - a.rating;
    });

    setAnimeList(sortedAnime);
    setCurrentGenre(formattedGenre);
    
    // Trigger animations
    setIsLoaded(false);
    setTimeout(() => setIsLoaded(true), 100);
  }, [genreName, sortBy]);

  const genreInfo = currentGenre ? GENRE_INFO[currentGenre] : GENRE_INFO['Action'];

  const handleWatchAnime = (animeId) => {
    // Navigation happens via Link
  };

  return (
    <div className="genre-page">
      {/* Background Effects */}
      <div className="genre-bg">
        <div 
          className="genre-gradient"
          style={{ '--genre-color': genreInfo.color }}
        ></div>
        <div className="genre-dots"></div>
      </div>

      {/* Header Section */}
      <header className="genre-header">
        <div className={`genre-hero ${isLoaded ? 'loaded' : ''}`}>
          <div className="genre-icon-large">
            <span>{genreInfo.icon}</span>
          </div>
          <div className="genre-title-section">
            <div className="genre-eyebrow">
              <span className="eyebrow-line"></span>
              <span>Explore Genre</span>
            </div>
            <h1 className="genre-title">
              {currentGenre}
            </h1>
            <p className="genre-description">
              {genreInfo.description}
            </p>
            <div className="genre-stats">
              <div className="genre-stat">
                <span className="stat-number">{animeList.length}</span>
                <span className="stat-label">Titles</span>
              </div>
              <div className="genre-stat-divider"></div>
              <div className="genre-stat">
                <span className="stat-number">
                  {animeList.length > 0 
                    ? (animeList.reduce((acc, a) => acc + a.rating, 0) / animeList.length).toFixed(1)
                    : '0.0'
                  }
                </span>
                <span className="stat-label">Avg Rating</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Genre Navigation Pills */}
      <nav className="genre-nav-wrapper">
        <div className="genre-nav-inner">
          <div className="genre-nav-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            <span>Browse Genres</span>
          </div>
          <div className="genre-pills">
            {ALL_GENRES.map((genre) => (
              <Link
                key={genre}
                to={`/genre/${genre}`}
                className={`genre-pill ${currentGenre === genre ? 'active' : ''}`}
                style={{ '--pill-color': GENRE_INFO[genre].color }}
              >
                <span className="pill-icon">{GENRE_INFO[genre].icon}</span>
                <span className="pill-text">{genre}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Content Section */}
      <div className="genre-content-wrapper">
        <div className="genre-content-inner">
          {/* Controls Bar */}
          <div className="genre-controls">
            <div className="genre-results-info">
              <span className="results-text">
                <strong>{animeList.length}</strong> {currentGenre} anime
              </span>
            </div>
            <div className="genre-sort-section">
              <label className="sort-label">Sort by:</label>
              <select 
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="rating">Top Rated</option>
                <option value="year">Newest First</option>
                <option value="title">Alphabetical</option>
              </select>
            </div>
          </div>

          {/* Anime Grid */}
          {animeList.length > 0 ? (
            <div className={`genre-anime-grid ${isLoaded ? 'loaded' : ''}`}>
              {animeList.map((anime, index) => (
                <Link
                  to={`/watch/${anime.id}`}
                  key={anime.id}
                  className="genre-anime-card"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="genre-card-image">
                    <img src={anime.poster} alt={anime.title} />
                    <div className="genre-card-overlay">
                      <div className="genre-play-btn">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                    <div className="genre-card-badges">
                      <span className={`genre-status-badge ${anime.status.toLowerCase()}`}>
                        {anime.status}
                      </span>
                    </div>
                    <div className="genre-rating-badge">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      {anime.rating}
                    </div>
                  </div>
                  <div className="genre-card-info">
                    <h3 className="genre-card-title">{anime.title}</h3>
                    <div className="genre-card-meta">
                      <span className="meta-year">{anime.year}</span>
                      <span className="meta-separator">•</span>
                      <span className="meta-episodes">
                        {typeof anime.episodes === 'number' 
                          ? `${anime.episodes} eps` 
                          : anime.episodes
                        }
                      </span>
                    </div>
                    <div className="genre-card-genres">
                      {anime.genres.slice(0, 3).map((g) => (
                        <Link
                          key={g}
                          to={`/genre/${g}`}
                          className={`genre-tag ${g.toLowerCase()}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {g}
                        </Link>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="genre-empty-state">
              <div className="empty-icon">{genreInfo.icon}</div>
              <h3>No {currentGenre} Anime Found</h3>
              <p>We're constantly adding new titles. Check back soon!</p>
              <Link to="/browse" className="empty-browse-btn">
                Browse All Anime
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Related Genres Section */}
      <section className="related-genres-section">
        <div className="related-genres-inner">
          <h2 className="related-title">Explore More Genres</h2>
          <div className="related-genres-grid">
            {ALL_GENRES.filter(g => g !== currentGenre).map((genre) => (
              <Link
                key={genre}
                to={`/genre/${genre}`}
                className="related-genre-card"
                style={{ '--related-color': GENRE_INFO[genre].color }}
              >
                <span className="related-icon">{GENRE_INFO[genre].icon}</span>
                <span className="related-name">{genre}</span>
                <span className="related-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Genre;
