import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const navLinks = [
  { label: 'Dashboard', path: '/dashboard', icon: '⊞' },
  { label: 'Calendar',  path: '/calendar',  icon: '◫' },
  { label: 'Reports',   path: '/reports',   icon: '↗' },
  { label: 'Settings',  path: '/settings',  icon: '⚙' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      {/* Logo */}
      <div style={styles.logo} onClick={() => navigate('/dashboard')}>
        <span style={styles.logoIcon}>◷</span>
        <span style={styles.logoText}>TimeTrack</span>
      </div>

      {/* Nav Links */}
      <div style={styles.links}>
        {navLinks.map((link) => {
          const active = location.pathname === link.path;
          return (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              style={{ ...styles.link, ...(active ? styles.linkActive : {}) }}
            >
              <span>{link.icon}</span>
              {link.label}
            </button>
          );
        })}
      </div>

      {/* User */}
      <div style={styles.user}>
        <div
          style={styles.avatar}
          onClick={() => navigate('/settings')}
          title="Go to settings"
        >
          {user?.name?.charAt(0) ?? 'U'}
        </div>
        <span style={styles.userName}>{user?.name}</span>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    height: 'var(--navbar-height)',
    background: 'var(--color-surface)',
    borderBottom: '1px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px',
    gap: '24px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    marginRight: '16px',
  },
  logoIcon: {
    fontSize: '20px',
    color: 'var(--color-primary)',
  },
  logoText: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--color-text-primary)',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    flex: 1,
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: 'var(--radius-md)',
    border: 'none',
    background: 'transparent',
    color: 'var(--color-text-secondary)',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  linkActive: {
    background: 'var(--color-primary-light)',
    color: 'var(--color-primary)',
  },
  user: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginLeft: 'auto',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'var(--color-primary)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  userName: {
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--color-text-primary)',
  },
  logoutBtn: {
    fontSize: '13px',
    color: 'var(--color-text-muted)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: 'var(--radius-sm)',
  },
};