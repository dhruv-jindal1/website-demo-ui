import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Sidebar from './sidebar';
import Topbar from './Topbar';

export default function Layout({ theme, setTheme }) {
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  return (
    <div style={styles.appShell}>
      <Topbar />

      <div style={styles.bodyShell}>
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          theme={theme}
          setTheme={setTheme}
        />

        <main
          style={{
            ...styles.main,
            marginLeft: collapsed ? '84px' : 'var(--sidebar-width)',
            width: collapsed
              ? 'calc(100% - 84px)'
              : 'calc(100% - var(--sidebar-width))',
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

const styles = {
  appShell: {
    minHeight: '100vh',
    background: 'var(--app-bg)',
  },
  bodyShell: {
    display: 'flex',
    minHeight: 'calc(100vh - 72px)',
  },
  main: {
    minHeight: 'calc(100vh - 72px)',
    padding: '32px',
    transition: 'all 0.25s ease',
  },
};