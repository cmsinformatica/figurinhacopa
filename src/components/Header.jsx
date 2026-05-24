import React from 'react';
import { Trophy } from 'lucide-react';
import ThemeToggle from './ThemeToggle.jsx';

export default function Header({ currentTab, setCurrentTab }) {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        transition: 'var(--transition)',
        backdropFilter: 'blur(12px)',
        backgroundColor: 'rgba(var(--bg-secondary-rgb), 0.8)'
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {/* Brand/Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, var(--gold), var(--warning))',
              color: '#000',
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(255, 215, 0, 0.3)'
            }}
          >
            <Trophy size={20} style={{ strokeWidth: 2.5 }} />
          </div>
          <div>
            <h1
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1
              }}
            >
              FiguCopa <span style={{ color: 'var(--accent)' }}>2026</span>
            </h1>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'bold' }}>
              PWA de Troca Inteligente
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setCurrentTab('matches')}
            style={{
              background: currentTab === 'matches' ? 'var(--accent-light)' : 'transparent',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              color: currentTab === 'matches' ? 'var(--accent)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            🔄 Matches
          </button>
          <button
            onClick={() => setCurrentTab('album')}
            style={{
              background: currentTab === 'album' ? 'var(--accent-light)' : 'transparent',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              color: currentTab === 'album' ? 'var(--accent)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            ⚽ Álbum
          </button>
        </nav>

        {/* Theme Switching Button */}
        <div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
