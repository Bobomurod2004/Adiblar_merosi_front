import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/', label: 'Bosh sahifa' },
  { to: '/writers', label: 'Adiblar' },
  { to: '/works', label: 'Asarlar' },
  { to: '/scholarships', label: 'Stipendiya haqida' },
  { to: '/tests', label: 'Testlar' },
  { to: '/articles', label: 'Maqolalar' },
  { to: '/submit-article', label: 'Maqola yuborish' },
  { to: '/ai-chat', label: 'AI Chat' },
]

function getInitials(fullName) {
  if (!fullName) return 'AD'
  const parts = String(fullName).split(' ').filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

function SiteLayout({ children }) {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/">
          <div className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4 6.5C4 5.67 4.67 5 5.5 5H10C11.1 5 12 5.9 12 7V19C11.2 18.2 10.2 17.75 9 17.75H4V6.5ZM20 6.5C20 5.67 19.33 5 18.5 5H14C12.9 5 12 5.9 12 7V19C12.8 18.2 13.8 17.75 15 17.75H20V6.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M12 7V19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          <div className="brand-copy">
            <h1>Adiblar Merosi</h1>
            <p>Adabiyot - millatning ma'naviy merosi</p>
          </div>
        </Link>

        <nav className="nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-link${isActive ? ' is-active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="topbar-actions">
          <button className="search-icon-btn" aria-label="Qidirish">
            🔍
          </button>
          
          {user ? (
            <div className="user-nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link to="/profile" className="profile-trigger" style={{ textDecoration: 'none' }}>
                <div className="author-avatar-mini" style={{ width: '40px', height: '40px', background: '#e9be64', color: '#0f264a', fontSize: '1rem', fontWeight: '800', border: 'none' }}>
                  {getInitials(user.first_name || user.username)}
                </div>
              </Link>
              <button 
                onClick={handleLogout} 
                className="secondary-btn"
                style={{ 
                  background: '#c0392b', 
                  color: '#fff', 
                  border: 'none', 
                  padding: '8px 16px', 
                  fontSize: '0.85rem',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Chiqish
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-btn-premium">
              Kirish
            </Link>
          )}
        </div>
      </header>

      <main>{children}</main>
    </div>
  )
}

export default SiteLayout
