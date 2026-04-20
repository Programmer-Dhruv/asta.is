import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllAnime } from '../../services/animeData';
import './MyList.css';

const STORAGE_KEY = 'asta-watchlist';

const MyList = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  const animeData = getAllAnime();

  // Load watchlist from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Validate and filter only existing anime
        const validAnime = parsed
          .map(id => animeData.find(a => a.id === id))
          .filter(Boolean);
        setWatchlist(validAnime);
      } catch (e) {
        console.error('Failed to parse watchlist:', e);
        setWatchlist([]);
      }
    }
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  // Save watchlist to localStorage
  const saveToStorage = useCallback((list) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.map(a => a.id)));
  }, []);

  // Remove anime from watchlist
  const removeFromList = useCallback((animeId, e) => {
    if (e) e.stopPropagation();
    setWatchlist(prev => {
      const updated = prev.filter(a => a.id !== animeId);
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  // Check if anime is in watchlist (for heart icon state)
  const isInWatchlist = useCallback((animeId) => {
    return watchlist.some(a => a.id === animeId);
  }, [watchlist]);

  // Navigate to watch page
  const handleWatchAnime = (anime) => {
    navigate(`/watch/${anime.id}`);
  };

  return (
    <div className="mylist-page">
      <div className="mylist-hero">
        <div className="mylist-hero-bg">
          <div className="mylist-gradient-1"></div>
          <div className="mylist-gradient-2"></div>
          <div className="mylist-dots"></div>
        </div>
        
        <div className={`mylist-hero-content ${isLoaded ? 'loaded' : ''}`}>
          <div className="mylist-hero-text">
            <div className="mylist-eyebrow">
              <span className="eyebrow-line"></span>
              <span>Your Collection</span>
            </div>
            
            <h1 className="mylist-heading">
              <span className="heading-line delay-1">My</span>
              <span className="heading-line gradient delay-2">Watchlist</span>
            </h1>
            
            <p className="mylist-desc">
              Your personal collection of anime favorites. Keep track of what you want to watch next.
            </p>
            
            <div className="mylist-stats">
              <div className="mylist-stat">
                <span className="mylist-stat-num">{watchlist.length}</span>
                <span className="mylist-stat-txt">Anime Saved</span>
              </div>
              <div className="mylist-stat-divider"></div>
              <div className="mylist-stat">
                <span className="mylist-stat-num">
                  {watchlist.length > 0 
                    ? (watchlist.reduce((sum, a) => sum + (typeof a.episodes === 'number' ? a.episodes : 0), 0))
                    : 0}
                </span>
                <span className="mylist-stat-txt">Total Episodes</span>
              </div>
              <div className="mylist-stat-divider"></div>
              <div className="mylist-stat">
                <span className="mylist-stat-num">
                  {watchlist.length > 0 
                    ? (watchlist.reduce((sum, a) => sum + a.rating, 0) / watchlist.length).toFixed(1)
                    : '0.0'}
                </span>
                <span className="mylist-stat-txt">Avg Rating</span>
              </div>
            </div>
          </div>

          <div className="mylist-hero-visual">
            <div className="mylist-floating-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mylist-content">
        {watchlist.length > 0 ? (
          <>
            <div className="mylist-grid-header">
              <h2 className="mylist-section-title">
                <svg viewBox="0 0 24 24" fill="currentColor" className="section-icon">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                Saved Anime
              </h2>
              <span className="mylist-count">{watchlist.length} {watchlist.length === 1 ? 'title' : 'titles'}</span>
            </div>

            <div className="mylist-grid">
              {watchlist.map((anime, index) => (
                <div
                  key={anime.id}
                  className="mylist-card"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => handleWatchAnime(anime)}
                >
                  <div className="mylist-card-image">
                    <img src={anime.poster} alt={anime.title} />
                    <div className="mylist-card-overlay">
                      <div className="mylist-play-btn">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                    <div className="mylist-card-badges">
                      <span className={`mylist-status ${anime.status.toLowerCase()}`}>
                        {anime.status}
                      </span>
                    </div>
                    <div className="mylist-card-rating">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      {anime.rating}
                    </div>
                    <button 
                      className="mylist-remove-btn"
                      onClick={(e) => removeFromList(anime.id, e)}
                      aria-label="Remove from list"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                      <span>Remove</span>
                    </button>
                  </div>
                  <div className="mylist-card-info">
                    <h3 className="mylist-card-title">{anime.title}</h3>
                    <div className="mylist-card-meta">
                      <span>{anime.year}</span>
                      <span className="meta-sep">-</span>
                      <span>{typeof anime.episodes === 'number' ? `${anime.episodes} eps` : anime.episodes}</span>
                    </div>
                    <div className="mylist-card-genres">
                      {anime.genres.slice(0, 2).map(genre => (
                        <span key={genre} className="mylist-genre-tag">{genre}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="mylist-empty-state">
            <div className="mylist-empty-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <h2 className="mylist-empty-title">Your watchlist is empty</h2>
            <p className="mylist-empty-desc">
              Start adding anime to your list by clicking the heart icon on any anime card.
            </p>
            <Link to="/browse" className="mylist-browse-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
              Browse Anime
            </Link>
            
            <div className="mylist-empty-decoration">
              <div className="deco-ring ring-1"></div>
              <div className="deco-ring ring-2"></div>
              <div className="deco-ring ring-3"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Export a helper function to check if anime is in watchlist
// This can be used by other components (like Browse) to show filled heart icons
export const isAnimeInWatchlist = (animeId) => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return false;
  try {
    const list = JSON.parse(stored);
    return list.includes(animeId);
  } catch {
    return false;
  }
};

// Export a helper function to add anime to watchlist
export const addToWatchlist = (anime) => {
  const stored = localStorage.getItem(STORAGE_KEY);
  let list = [];
  if (stored) {
    try {
      list = JSON.parse(stored);
    } catch {
      list = [];
    }
  }
  if (!list.includes(anime.id)) {
    list.push(anime.id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }
};

// Export a helper function to remove anime from watchlist
export const removeFromWatchlist = (animeId) => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return;
  try {
    let list = JSON.parse(stored);
    list = list.filter(id => id !== animeId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // Silent fail
  }
};

export default MyList;
