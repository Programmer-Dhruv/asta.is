import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Profile.css';
import { getAllAnime } from '../../services/animeData';

const Profile = () => {
  const navigate = useNavigate();
  const animeData = getAllAnime();
  
  // Load user data from localStorage or use defaults
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem('astaUserProfile');
    return saved ? JSON.parse(saved) : {
      username: 'AnimeOtaku_42',
      joinedDate: 'March 2024',
      avatarColor: '#8b5cf6',
    };
  });

  // User stats (mock data)
  const [stats] = useState({
    animeWatched: 247,
    hoursWatched: 892,
    favoriteGenre: 'Action',
    chaptersRead: 1543,
    reviewsWritten: 12,
    daysActive: 89,
  });

  // Recent activity (mock data)
  const [recentActivity] = useState([
    { id: 1, type: 'watched', anime: 'Frieren: Beyond Journey\'s End', episode: 'Episode 28', time: '2 hours ago', poster: animeData[9]?.poster },
    { id: 2, type: 'completed', anime: 'Solo Leveling', episode: 'Season 1', time: '1 day ago', poster: animeData[8]?.poster },
    { id: 3, type: 'reviewed', anime: 'Demon Slayer: Kimetsu no Yaiba', rating: 9.5, time: '2 days ago', poster: animeData[0]?.poster },
    { id: 4, type: 'watched', anime: 'Jujutsu Kaisen', episode: 'Episode 23', time: '3 days ago', poster: animeData[2]?.poster },
    { id: 5, type: 'added', anime: 'Vinland Saga', time: '4 days ago', poster: animeData[11]?.poster },
  ]);

  // My list / favorite anime
  const [myList] = useState(() => {
    // Get 6 anime from the data as favorites
    return animeData.slice(0, 6).map(anime => ({
      id: anime.id,
      title: anime.title,
      poster: anime.poster,
      rating: anime.rating,
      status: anime.status,
      progress: Math.floor(Math.random() * 100),
    }));
  });

  // Settings state
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('astaUserSettings');
    return saved ? JSON.parse(saved) : {
      darkMode: true,
      notifications: true,
      autoPlay: true,
      subtitles: true,
      streamingQuality: 'auto',
    };
  });

  // UI states
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [editedUsername, setEditedUsername] = useState(userData.username);
  const [activeTab, setActiveTab] = useState('overview');

  // Save user data to localStorage
  useEffect(() => {
    localStorage.setItem('astaUserProfile', JSON.stringify(userData));
  }, [userData]);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('astaUserSettings', JSON.stringify(settings));
  }, [settings]);

  // Handle username edit
  const handleSaveUsername = () => {
    if (editedUsername.trim()) {
      setUserData(prev => ({ ...prev, username: editedUsername.trim() }));
    }
    setIsEditingUsername(false);
  };

  // Handle settings toggle
  const handleSettingToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Handle anime click
  const handleAnimeClick = (animeId) => {
    navigate(`/watch/${animeId}`);
  };

  // Get activity icon
  const getActivityIcon = (type) => {
    switch (type) {
      case 'watched': return '▶';
      case 'completed': return '✓';
      case 'reviewed': return '★';
      case 'added': return '+';
      default: return '●';
    }
  };

  // Get avatar initial
  const getAvatarInitial = () => {
    return userData.username.charAt(0).toUpperCase();
  };

  // Calculate days on platform
  const daysOnPlatform = Math.floor((Date.now() - new Date(userData.joinedDate).getTime()) / (1000 * 60 * 60 * 24)) || 89;

  return (
    <div className="profile-page">
      {/* Background decorations */}
      <div className="profile-bg-effects">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
        <div className="bg-grid"></div>
      </div>

      {/* Header / Profile Card */}
      <section className="profile-header">
        <div className="profile-header-container">
          {/* Avatar */}
          <div className="avatar-section">
            <div className="avatar-wrapper" style={{ '--avatar-color': userData.avatarColor }}>
              <div className="avatar-ring"></div>
              <div className="avatar-inner">
                {getAvatarInitial()}
              </div>
              <button className="avatar-edit-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
            </div>
            
            {/* Online status */}
            <div className="online-indicator">
              <span className="online-dot"></span>
              Online
            </div>
          </div>

          {/* User Info */}
          <div className="user-info-section">
            {/* Username */}
            <div className="username-wrapper">
              {isEditingUsername ? (
                <div className="username-edit-form">
                  <input
                    type="text"
                    value={editedUsername}
                    onChange={(e) => setEditedUsername(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveUsername()}
                    autoFocus
                    maxLength={24}
                    className="username-input"
                  />
                  <button className="save-btn" onClick={handleSaveUsername}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </button>
                  <button className="cancel-btn" onClick={() => {
                    setEditedUsername(userData.username);
                    setIsEditingUsername(false);
                  }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              ) : (
                <h1 className="username" onClick={() => setIsEditingUsername(true)}>
                  {userData.username}
                  <button className="edit-username-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                </h1>
              )}
            </div>

            {/* Member since */}
            <p className="member-since">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Member since {userData.joinedDate}
            </p>

            {/* Quick Stats Pills */}
            <div className="quick-stats-row">
              <div className="quick-stat-pill">
                <span className="qs-value">{stats.animeWatched}</span>
                <span className="qs-label">Watched</span>
              </div>
              <div className="quick-stat-pill">
                <span className="qs-value">{stats.hoursWatched}h</span>
                <span className="qs-label">Hours</span>
              </div>
              <div className="quick-stat-pill">
                <span className="qs-value">{stats.favoriteGenre}</span>
                <span className="qs-label">Favorite</span>
              </div>
              <div className="quick-stat-pill accent">
                <span className="qs-value">{daysOnPlatform}</span>
                <span className="qs-label">Days Active</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="profile-tabs-wrapper">
        <div className="profile-tabs-container">
          <nav className="profile-tabs">
            <button 
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              Overview
            </button>
            <button 
              className={`tab-btn ${activeTab === 'mylist' ? 'active' : ''}`}
              onClick={() => setActiveTab('mylist')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              My List
            </button>
            <button 
              className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
              onClick={() => setActiveTab('activity')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              Activity
            </button>
            <button 
              className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
              Settings
            </button>
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="profile-content">
        <div className="profile-content-container">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="tab-content overview-content">
              {/* Detailed Stats */}
              <section className="stats-section">
                <div className="section-header">
                  <h2>Your Statistics</h2>
                  <span className="section-badge">All Time</span>
                </div>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
                        <polyline points="17 2 12 7 7 2"/>
                      </svg>
                    </div>
                    <div className="stat-info">
                      <span className="stat-value">{stats.animeWatched}</span>
                      <span className="stat-label">Anime Watched</span>
                    </div>
                    <div className="stat-bar">
                      <div className="stat-bar-fill" style={{ width: '78%' }}></div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                    </div>
                    <div className="stat-info">
                      <span className="stat-value">{stats.hoursWatched}</span>
                      <span className="stat-label">Hours Watched</span>
                    </div>
                    <div className="stat-bar">
                      <div className="stat-bar-fill" style={{ width: '65%' }}></div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                      </svg>
                    </div>
                    <div className="stat-info">
                      <span className="stat-value">{stats.chaptersRead}</span>
                      <span className="stat-label">Chapters Read</span>
                    </div>
                    <div className="stat-bar">
                      <div className="stat-bar-fill" style={{ width: '55%' }}></div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    </div>
                    <div className="stat-info">
                      <span className="stat-value">{stats.favoriteGenre}</span>
                      <span className="stat-label">Favorite Genre</span>
                    </div>
                    <div className="stat-bar">
                      <div className="stat-bar-fill accent" style={{ width: '90%' }}></div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                    </div>
                    <div className="stat-info">
                      <span className="stat-value">{stats.reviewsWritten}</span>
                      <span className="stat-label">Reviews Written</span>
                    </div>
                    <div className="stat-bar">
                      <div className="stat-bar-fill" style={{ width: '40%' }}></div>
                    </div>
                  </div>

                  <div className="stat-card highlight">
                    <div className="stat-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                    </div>
                    <div className="stat-info">
                      <span className="stat-value">{daysOnPlatform}</span>
                      <span className="stat-label">Days on Platform</span>
                    </div>
                    <div className="stat-bar">
                      <div className="stat-bar-fill accent" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Recent Activity Preview */}
              <section className="activity-preview-section">
                <div className="section-header">
                  <h2>Recent Activity</h2>
                  <button className="view-all-btn" onClick={() => setActiveTab('activity')}>
                    View All
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </button>
                </div>
                <div className="activity-list">
                  {recentActivity.slice(0, 3).map((activity) => (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-icon">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="activity-poster">
                        <img src={activity.poster} alt={activity.anime} />
                      </div>
                      <div className="activity-info">
                        <span className="activity-text">
                          {activity.type === 'watched' && `Watched ${activity.anime}`}
                          {activity.type === 'completed' && `Completed ${activity.anime}`}
                          {activity.type === 'reviewed' && `Reviewed ${activity.anime}`}
                          {activity.type === 'added' && `Added ${activity.anime} to list`}
                        </span>
                        <span className="activity-meta">
                          {activity.episode || (activity.rating ? `${activity.rating}/10` : '')}
                          {' • '}{activity.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Favorite Anime Preview */}
              <section className="favorites-preview-section">
                <div className="section-header">
                  <h2>Favorite Anime</h2>
                  <button className="view-all-btn" onClick={() => setActiveTab('mylist')}>
                    View All
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </button>
                </div>
                <div className="favorites-grid">
                  {myList.slice(0, 4).map((anime) => (
                    <div 
                      key={anime.id} 
                      className="favorite-card"
                      onClick={() => handleAnimeClick(anime.id)}
                    >
                      <div className="favorite-poster">
                        <img src={anime.poster} alt={anime.title} />
                        <div className="favorite-overlay">
                          <div className="play-btn">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        </div>
                        <div className="favorite-rating">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                          {anime.rating}
                        </div>
                      </div>
                      <h4 className="favorite-title">{anime.title}</h4>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* My List Tab */}
          {activeTab === 'mylist' && (
            <div className="tab-content mylist-content">
              <div className="mylist-header">
                <div className="mylist-stats">
                  <span className="mylist-count">{myList.length} Anime</span>
                  <span className="mylist-watched">
                    {Math.round(myList.reduce((acc, a) => acc + a.progress, 0) / myList.length)}% avg progress
                  </span>
                </div>
                <div className="mylist-actions">
                  <select className="filter-select">
                    <option>All</option>
                    <option>Watching</option>
                    <option>Completed</option>
                    <option>Plan to Watch</option>
                  </select>
                </div>
              </div>

              <div className="mylist-grid">
                {myList.map((anime) => (
                  <div 
                    key={anime.id} 
                    className="mylist-card"
                    onClick={() => handleAnimeClick(anime.id)}
                  >
                    <div className="mylist-poster">
                      <img src={anime.poster} alt={anime.title} />
                      <div className="mylist-overlay">
                        <div className="mylist-play">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                      <div className={`mylist-status ${anime.status.toLowerCase()}`}>
                        {anime.status}
                      </div>
                      <div className="mylist-progress">
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${anime.progress}%` }}></div>
                        </div>
                        <span className="progress-text">{anime.progress}%</span>
                      </div>
                    </div>
                    <div className="mylist-info">
                      <h4 className="mylist-title">{anime.title}</h4>
                      <div className="mylist-meta">
                        <span className="mylist-rating">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                          {anime.rating}
                        </span>
                        <span className="mylist-dot">•</span>
                        <span className="mylist-genre">{stats.favoriteGenre}</span>
                      </div>
                      <div className="mylist-actions-row">
                        <button className="mylist-btn watch">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="5 3 19 12 5 21 5 3"/>
                          </svg>
                          Watch
                        </button>
                        <button className="mylist-btn remove">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="add-more-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add More Anime
              </button>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="tab-content activity-content">
              <div className="activity-header">
                <h2>Activity History</h2>
                <div className="activity-filters">
                  <button className="filter-btn active">All</button>
                  <button className="filter-btn">Watching</button>
                  <button className="filter-btn">Completed</button>
                  <button className="filter-btn">Reviews</button>
                </div>
              </div>

              <div className="activity-timeline">
                {recentActivity.map((activity, index) => (
                  <div key={activity.id} className="timeline-item">
                    <div className="timeline-marker">
                      <div className="timeline-dot"></div>
                      {index < recentActivity.length - 1 && <div className="timeline-line"></div>}
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-card">
                        <div className="timeline-poster">
                          <img src={activity.poster} alt={activity.anime} />
                        </div>
                        <div className="timeline-info">
                          <div className="timeline-header">
                            <span className={`timeline-badge ${activity.type}`}>
                              {getActivityIcon(activity.type)}
                              {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                            </span>
                            <span className="timeline-time">{activity.time}</span>
                          </div>
                          <h4 className="timeline-title">{activity.anime}</h4>
                          <p className="timeline-detail">
                            {activity.episode || (activity.rating ? `Rated ${activity.rating}/10` : 'Added to list')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="activity-stats-summary">
                <div className="summary-card">
                  <span className="summary-value">This Week</span>
                  <span className="summary-label">8 episodes watched</span>
                </div>
                <div className="summary-card">
                  <span className="summary-value">This Month</span>
                  <span className="summary-label">32 hours spent</span>
                </div>
                <div className="summary-card">
                  <span className="summary-value">Total</span>
                  <span className="summary-label">{stats.reviewsWritten} reviews</span>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="tab-content settings-content">
              <div className="settings-header">
                <h2>Account Settings</h2>
                <p>Customize your experience</p>
              </div>

              {/* Appearance Settings */}
              <section className="settings-section">
                <h3>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5"/>
                    <line x1="12" y1="1" x2="12" y2="3"/>
                    <line x1="12" y1="21" x2="12" y2="23"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                    <line x1="1" y1="12" x2="3" y2="12"/>
                    <line x1="21" y1="12" x2="23" y2="12"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                  </svg>
                  Appearance
                </h3>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-label">Dark Mode</span>
                    <span className="setting-desc">Use dark theme across the platform</span>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.darkMode}
                      onChange={() => handleSettingToggle('darkMode')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-label">Auto-Play Next Episode</span>
                    <span className="setting-desc">Automatically play the next episode</span>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.autoPlay}
                      onChange={() => handleSettingToggle('autoPlay')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </section>

              {/* Notifications */}
              <section className="settings-section">
                <h3>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                  Notifications
                </h3>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-label">Push Notifications</span>
                    <span className="setting-desc">Receive notifications for new episodes</span>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.notifications}
                      onChange={() => handleSettingToggle('notifications')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-label">Email Digest</span>
                    <span className="setting-desc">Weekly summary of trending anime</span>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </section>

              {/* Playback Settings */}
              <section className="settings-section">
                <h3>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                  Playback
                </h3>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-label">Enable Subtitles</span>
                    <span className="setting-desc">Show subtitles by default</span>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.subtitles}
                      onChange={() => handleSettingToggle('subtitles')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-label">Streaming Quality</span>
                    <span className="setting-desc">Video playback quality</span>
                  </div>
                  <select 
                    className="setting-select"
                    value={settings.streamingQuality}
                    onChange={(e) => setSettings(prev => ({ ...prev, streamingQuality: e.target.value }))}
                  >
                    <option value="auto">Auto</option>
                    <option value="1080p">1080p HD</option>
                    <option value="720p">720p</option>
                    <option value="480p">480p</option>
                  </select>
                </div>
              </section>

              {/* Privacy & Security */}
              <section className="settings-section">
                <h3>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  Privacy & Security
                </h3>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-label">Profile Visibility</span>
                    <span className="setting-desc">Who can see your profile</span>
                  </div>
                  <select className="setting-select">
                    <option>Public</option>
                    <option>Friends Only</option>
                    <option>Private</option>
                  </select>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-label">Show Watch History</span>
                    <span className="setting-desc">Display your watch activity</span>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </section>

              {/* Danger Zone */}
              <section className="settings-section danger-zone">
                <h3>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  Danger Zone
                </h3>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-label">Clear Watch History</span>
                    <span className="setting-desc">Remove all your watch history</span>
                  </div>
                  <button className="danger-btn">Clear History</button>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-label">Delete Account</span>
                    <span className="setting-desc">Permanently delete your account</span>
                  </div>
                  <button className="danger-btn delete">Delete Account</button>
                </div>
              </section>

              {/* Save Button */}
              <div className="settings-footer">
                <button className="save-settings-btn" onClick={() => alert('Settings saved!')}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                    <polyline points="17 21 17 13 7 13 7 21"/>
                    <polyline points="7 3 7 8 15 8"/>
                  </svg>
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
