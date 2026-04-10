import { NavLink } from 'react-router-dom';
import {
  Clock3,
  CalendarDays,
  LayoutDashboard,
  BarChart3,
  Tags,
  User,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react';

const navSections = [
  {
    title: 'TRACK',
    items: [
      { label: 'Time Tracker', path: '/timer', icon: Clock3 },
      { label: 'Calendar', path: '/calendar', icon: CalendarDays },
    ],
  },
  {
    title: 'ANALYZE',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { label: 'Reports', path: '/reports', icon: BarChart3 },
    ],
  },
  {
    title: 'MANAGE',
    items: [
      { label: 'Categories', path: '/category', icon: Tags },
      { label: 'Profile', path: '/settings', icon: User },
    ],
  },
];

export default function Sidebar({ collapsed, setCollapsed, theme, setTheme }) {
  const isLight = theme === 'light';

  const handleThemeToggle = () => {
    if (setTheme) {
      setTheme(isLight ? 'dark' : 'light');
    }
  };

  return (
    <aside className={`app-sidebar ${collapsed ? 'is-collapsed' : ''}`}>
      <button
        type="button"
        className="app-sidebar__toggle"
        onClick={(e) => {
          e.stopPropagation();
          setCollapsed((prev) => !prev);
        }}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      <div className="app-sidebar__content">
        <div className={`app-sidebar__scroll ${collapsed ? 'is-collapsed' : ''}`}>
          <nav className="app-sidebar__nav">
            {navSections.map((section) => (
              <div className="app-sidebar__section" key={section.title}>
                {!collapsed && (
                  <p className="app-sidebar__section-title">{section.title}</p>
                )}

                <div className="app-sidebar__links">
                  {section.items.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div className="app-sidebar__item-wrap" key={item.path}>
                        <NavLink
                          to={item.path}
                          className={({ isActive }) =>
                            `app-sidebar__link ${isActive ? 'is-active' : ''}`
                          }
                        >
                          <span className="app-sidebar__icon">
                            <Icon size={18} />
                          </span>

                          {!collapsed && (
                            <span className="app-sidebar__label">{item.label}</span>
                          )}
                        </NavLink>

                        {collapsed && (
                          <div className="app-sidebar__flyout">
                            <span className="app-sidebar__flyout-text">{item.label}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="app-sidebar__bottom">
          <div className="app-sidebar__item-wrap">
            <button
              type="button"
              className="app-sidebar__link app-sidebar__theme-btn"
              onClick={handleThemeToggle}
              title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              <span className="app-sidebar__icon">
                {isLight ? <Moon size={18} /> : <Sun size={18} />}
              </span>

              {!collapsed && (
                <span className="app-sidebar__label">
                  {isLight ? 'Dark Mode' : 'Light Mode'}
                </span>
              )}
            </button>

            {collapsed && (
              <div className="app-sidebar__flyout">
                <span className="app-sidebar__flyout-text">
                  {isLight ? 'Dark Mode' : 'Light Mode'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}