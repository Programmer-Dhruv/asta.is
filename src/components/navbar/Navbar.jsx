import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
  const location = useLocation()

  return (
    <nav className="asta-navbar">
      <div className="asta-nav-container">

        {/* LOGO */}
        <Link to="/" className="asta-logo">
          <span>ASTA</span><span className="dot">.IS</span>
        </Link>

        {/* LINKS */}
        <ul className="asta-nav-links">
          <li>
            <Link to="/" end className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          </li>
          <li>
            <Link to="/browse" className={location.pathname === '/browse' ? 'active' : ''}>Browse</Link>
          </li>
          <li>
            <Link to="/search" className={location.pathname === '/search' ? 'active' : ''}>Search</Link>
          </li>
          <li>
            <Link to="/upcoming" className={location.pathname === '/upcoming' ? 'active' : ''}>Upcoming</Link>
          </li>
          <li>
            <Link to="/watch/1" className={location.pathname.startsWith('/watch') ? 'active' : ''}>Watch</Link>
          </li>
          <li>
            <a href="#community">Community</a>
          </li>
        </ul>

        {/* ACTION */}
        <div className="asta-nav-action">
          <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            Profile
          </Link>
          <button className="asta-login-btn">Login</button>
        </div>

      </div>
    </nav>
  )
}

export default Navbar
