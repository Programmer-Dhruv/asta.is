import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Upcoming.css';
import { getAllAnime } from '../../services/animeData';

const Upcoming = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedYear, setSelectedYear] = useState('all');

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const allAnime = getAllAnime();

  // Get upcoming anime - Ongoing status and anime with future seasons
  const upcomingAnime = allAnime.filter(anime => {
    const hasFutureSeason = anime.seasons.some(
      season => parseInt(season.year) > 2024
    );
    return anime.status === 'Ongoing' || hasFutureSeason;
  });

  // Extract unique years from upcoming anime
  const upcomingYears = [...new Set(
    upcomingAnime.flatMap(anime =>
      anime.seasons
        .filter(s => parseInt(s.year) >= 2024)
        .map(s => s.year)
    )
  )].sort();

  // Group anime by upcoming season/year
  const groupedByYear = upcomingYears.reduce((acc, year) => {
    const yearAnime = upcomingAnime.filter(anime =>
      anime.seasons.some(s => s.year === year)
    );
    if (yearAnime.length > 0) {
      acc[year] = yearAnime;
    }
    return acc;
  }, {});

  // Filter by year
  const filteredAnime = selectedYear === 'all'
    ? upcomingAnime
    : upcomingAnime.filter(anime =>
        anime.seasons.some(s => s.year === selectedYear)
      );

  // Calculate days until release (mock data for demo)
  const getCountdown = (year) => {
    const currentYear = 2026;
    const currentMonth = 4;
    const seasons = {
      'Winter 2024': { months: [1, 2, 3], year: 2024 },
      'Spring 2024': { months: [4, 5, 6], year: 2024 },
      'Summer 2024': { months: [7, 8, 9], year: 2024 },
      'Fall 2024': { months: [10, 11, 12], year: 2024 },
      'Winter 2025': { months: [1, 2, 3], year: 2025 },
      'Spring 2025': { months: [4, 5, 6], year: 2025 },
      'Summer 2025': { months: [7, 8, 9], year: 2025 },
      'Fall 2025': { months: [10, 11, 12], year: 2025 },
      'Winter 2026': { months: [1, 2, 3], year: 2026 },
      'Spring 2026': { months: [4, 5, 6], year: 2026 },
      'Summer 2026': { months: [7, 8, 9], year: 2026 },
      'Fall 2026': { months: [10, 11, 12], year: 2026 },
    };

    for (const [seasonName, data] of Object.entries(seasons)) {
      if (parseInt(year) === data.year) {
        const startMonth = data.months[0];
        const targetDate = new Date(data.year, startMonth - 1, 1);
        const today = new Date();
        const diffTime = targetDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return {
          season: seasonName,
          days: Math.max(0, diffDays),
          past: diffDays < 0
        };
      }
    }
    return { season: year, days: 0, past: true };
  };

  // Get the next upcoming season
  const getNextSeason = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    
    const seasons = [
      { name: 'Winter', months: [1, 2, 3] },
      { name: 'Spring', months: [4, 5, 6] },
      { name: 'Summer', months: [7, 8, 9] },
      { name: 'Fall', months: [10, 11, 12] },
    ];

    for (let i = 0; i < 4; i++) {
      const season = seasons[i];
      if (currentMonth < season.months[0]) {
        return { name: season.name, year: currentYear };
      }
    }
    return { name: 'Winter', year: currentYear + 1 };
  };

  const nextSeason = getNextSeason();

  return (
    <div className="upcoming-page">
      {/* Hero Section */}
      <section className="upcoming-hero">
        <div className="hero-bg">
          <div className="hero-gradient-left"></div>
          <div className="hero-gradient-right"></div>
          <div className="hero-particles"></div>
        </div>

        <div className={`hero-content ${isLoaded ? 'loaded' : ''}`}>
          <div className="hero-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span>Coming Soon</span>
          </div>

          <h1 className="hero-title">
            <span className="title-line delay-1">Upcoming</span>
            <span className="title-line gradient delay-2">Anime</span>
            <span className="title-line delay-3">Releases</span>
          </h1>

          <p className="hero-desc">
            Stay ahead of the curve with our comprehensive guide to upcoming anime seasons. 
            From highly anticipated sequels to brand new series.
          </p>

          <div className="next-season-highlight">
            <span className="highlight-label">Next Season</span>
            <span className="highlight-value">{nextSeason.name} {nextSeason.year}</span>
          </div>
        </div>
      </section>

      {/* Timeline Navigation */}
      <div className="timeline-nav-wrapper">
        <div className="timeline-nav">
          <button
            className={`timeline-btn ${selectedYear === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedYear('all')}
          >
            <span className="btn-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12,6 12,12 16,14"/>
              </svg>
            </span>
            All Upcoming
          </button>
          {upcomingYears.map(year => {
            const countdown = getCountdown(year);
            return (
              <button
                key={year}
                className={`timeline-btn ${selectedYear === year ? 'active' : ''}`}
                onClick={() => setSelectedYear(year)}
              >
                <span className="btn-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                  </svg>
                </span>
                {year}
                <span className="btn-countdown">
                  {countdown.days > 0 ? `${countdown.days}d` : 'Now'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline Section */}
      {selectedYear === 'all' && (
        <section className="timeline-section">
          <div className="timeline-container">
            <div className="timeline-header">
              <h2 className="timeline-title">
                <span className="title-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="20" x2="12" y2="10"/>
                    <line x1="18" y1="20" x2="18" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="16"/>
                  </svg>
                </span>
                Release Timeline
              </h2>
            </div>

            <div className="timeline">
              {Object.entries(groupedByYear).map(([year, animes], yearIndex) => {
                const countdown = getCountdown(year);
                return (
                  <div key={year} className="timeline-year" style={{ '--year-index': yearIndex }}>
                    <div className="timeline-marker">
                      <div className="marker-dot"></div>
                      <div className="marker-line"></div>
                    </div>

                    <div className="timeline-content">
                      <div className="year-header">
                        <div className="year-badge">
                          <span className="year-number">{year}</span>
                          <span className="year-season">{countdown.season}</span>
                        </div>
                        <div className={`countdown-badge ${countdown.past ? 'past' : ''}`}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12,6 12,12 16,14"/>
                          </svg>
                          <span>{countdown.days > 0 ? `${countdown.days} days` : 'Current Season'}</span>
                        </div>
                      </div>

                      <div className="year-grid">
                        {animes.map((anime, index) => {
                          const upcomingSeason = anime.seasons.find(s => s.year === year);
                          return (
                            <div
                              key={anime.id}
                              className="timeline-card"
                              style={{ animationDelay: `${index * 0.1}s` }}
                            >
                              <Link to={`/watch/${anime.id}`} className="card-link">
                                <div className="card-poster">
                                  <img src={anime.poster} alt={anime.title} />
                                  <div className="poster-overlay">
                                    <div className="play-btn">
                                      <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M8 5v14l11-7z"/>
                                      </svg>
                                    </div>
                                  </div>
                                  <div className="card-status">
                                    {anime.status === 'Ongoing' ? (
                                      <span className="status-ongoing">Ongoing</span>
                                    ) : (
                                      <span className="status-upcoming">Upcoming</span>
                                    )}
                                  </div>
                                </div>

                                <div className="card-body">
                                  <div className="card-meta">
                                    <span className="meta-season">{upcomingSeason?.name || 'Season'}</span>
                                    <span className="meta-sep">•</span>
                                    <span className="meta-year">{year}</span>
                                  </div>

                                  <h3 className="card-title">{anime.title}</h3>

                                  <div className="card-info">
                                    <span className="info-type">{anime.type}</span>
                                    <span className="info-sep">•</span>
                                    <span className="info-episodes">
                                      {upcomingSeason?.episodes || 'TBA'} eps
                                    </span>
                                  </div>

                                  <div className="card-genres">
                                    {anime.genres.slice(0, 3).map(genre => (
                                      <span key={genre} className="genre-tag">{genre}</span>
                                    ))}
                                  </div>
                                </div>
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Anime Grid */}
      <section className="grid-section">
        <div className="grid-container">
          <div className="grid-header">
            <h2 className="grid-title">
              {selectedYear === 'all' ? 'All Upcoming Anime' : `Upcoming in ${selectedYear}`}
            </h2>
            <span className="grid-count">{filteredAnime.length} titles</span>
          </div>

          <div className="anime-grid">
            {filteredAnime.map((anime, index) => {
              const nextSeasonInfo = anime.seasons
                .filter(s => parseInt(s.year) >= 2024)
                .sort((a, b) => parseInt(a.year) - parseInt(b.year))[0];
              const countdown = getCountdown(nextSeasonInfo?.year || '2026');

              return (
                <Link
                  key={anime.id}
                  to={`/watch/${anime.id}`}
                  className="grid-card"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <div className="grid-poster">
                    <img src={anime.poster} alt={anime.title} />
                    <div className="poster-gradient"></div>

                    <div className="poster-badges">
                      {anime.status === 'Ongoing' && (
                        <span className="badge-live">
                          <span className="live-dot"></span>
                          Live
                        </span>
                      )}
                      <span className="badge-rating">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        {anime.rating}
                      </span>
                    </div>

                    <div className="poster-overlay">
                      <div className="overlay-content">
                        <div className="play-button">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                        <span className="watch-text">Watch Now</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid-body">
                    <div className="grid-meta">
                      <span className="meta-year">{anime.year}</span>
                      <span className="meta-sep">•</span>
                      <span className="meta-type">{anime.type}</span>
                    </div>

                    <h3 className="grid-title">{anime.title}</h3>

                    <div className="grid-seasons">
                      {anime.seasons
                        .filter(s => parseInt(s.year) >= 2024)
                        .slice(0, 2)
                        .map(season => (
                          <div key={season.id} className="season-chip">
                            <span className="season-name">{season.name}</span>
                            <span className="season-year">{season.year}</span>
                          </div>
                        ))}
                    </div>

                    <div className="grid-footer">
                      <div className="countdown">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12,6 12,12 16,14"/>
                        </svg>
                        <span>{countdown.days > 0 ? `${countdown.days} days` : 'Now Streaming'}</span>
                      </div>
                      <span className="episode-count">
                        {typeof anime.episodes === 'number' ? anime.episodes : '?'} eps
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {filteredAnime.length === 0 && (
            <div className="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <h3>No Upcoming Anime</h3>
              <p>Check back later for new releases</p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <div className="stat-value">{upcomingAnime.length}</div>
            <div className="stat-label">Upcoming Titles</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div className="stat-value">{upcomingYears.length}</div>
            <div className="stat-label">Upcoming Seasons</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12,6 12,12 16,14"/>
              </svg>
            </div>
            <div className="stat-value">
              {Math.min(...upcomingYears.map(y => getCountdown(y).days))}
            </div>
            <div className="stat-label">Days Until Next Release</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div className="stat-value">50K+</div>
            <div className="stat-label">Tracking This</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Upcoming;
