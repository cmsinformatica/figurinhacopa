import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    // Verifica tema salvo ou preferência do sistema
    const savedTheme = localStorage.getItem('figucopa_theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('figucopa_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <button
      onClick={toggleTheme}
      className="theme-btn"
      aria-label="Alternar tema"
      style={{
        background: 'var(--bg-tertiary)',
        border: '1px solid var(--border)',
        borderRadius: '50px',
        width: '44px',
        height: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: 'var(--text-primary)',
        transition: 'var(--transition)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        className="icon-container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          transform: theme === 'dark' ? 'translateY(-20px)' : 'translateY(20px)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          alignItems: 'center',
          gap: '20px'
        }}
      >
        <Moon size={20} style={{ color: 'var(--accent)' }} />
        <Sun size={20} style={{ color: 'var(--warning)' }} />
      </div>
    </button>
  );
}
