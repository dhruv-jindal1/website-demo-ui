import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import logo from '../../assets/chronotrack-logo.png';
import './Topbar.css';

export default function Topbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      navigate('/dashboard');
    }
  };

  return (
    <header className="topbar">
      <div
        className="topbar__left"
        onClick={() => navigate('/dashboard')}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
      >
        
          <img src={logo} alt="ChronoTrack logo" className="topbar__logo-img" />

        <div className="topbar__brand">
          <span className="topbar__brand-name"></span>
        </div>
      </div>

      <div className="topbar__right">
        <button className="topbar__logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}