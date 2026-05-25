import React, { useEffect, useState } from 'react';
import { Trophy, MessageSquare, User, RefreshCw, Activity, Award, LogOut, Globe } from 'lucide-react';
import ThemeToggle from './ThemeToggle.jsx';
import { getTrades } from '../db.js';

export default function Header({ currentTab, setCurrentTab, isAdmin, onLogout }) {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const updateNotifications = () => {
      const trades = getTrades();
      const pending = trades.filter(t => t.status === 'pending').length;
      setPendingCount(pending);
    };

    updateNotifications();
    const interval = setInterval(updateNotifications, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      className="glass-ethereal"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid var(--border)',
        transition: 'var(--transition)'
      }}
    >
      <div
        style={{
          maxWidth: '640px', // Alinhado com o container principal
          margin: '0 auto',
          padding: '0.75rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {/* Brand / Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, var(--gold), var(--warning))',
              color: '#000',
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(255, 215, 0, 0.25)'
            }}
          >
            <Trophy size={16} style={{ strokeWidth: 2.5 }} />
          </div>
          <div>
            <h1
              style={{
                fontSize: '1.05rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              FiguCopa <span style={{ color: 'var(--accent)' }}>2026</span>
            </h1>
            <span style={{ fontSize: '0.55rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
              <span className="pulse-dot" style={{ width: '4px', height: '4px', marginRight: '4px' }}></span>
              Salvador, Bahia
            </span>
          </div>
        </div>

        {/* Tab Navigation (Lucide Icons + Neon Shadow Active) */}
        <nav style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          {isAdmin && (
            <button
              onClick={() => setCurrentTab('admin')}
              title="Painel Admin"
              style={{
                background: currentTab === 'admin' ? 'var(--warning-light)' : 'transparent',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '8px',
                color: currentTab === 'admin' ? 'var(--warning)' : 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'var(--transition)',
                boxShadow: currentTab === 'admin' ? '0 0 10px rgba(255, 178, 0, 0.15)' : 'none'
              }}
            >
              <Award size={16} />
            </button>
          )}

          <button
            onClick={() => setCurrentTab('matches')}
            title="Matches de Troca"
            style={{
              background: currentTab === 'matches' ? 'var(--accent-light)' : 'transparent',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '8px',
              color: currentTab === 'matches' ? 'var(--accent)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'var(--transition)',
              boxShadow: currentTab === 'matches' ? '0 0 10px rgba(37, 117, 252, 0.15)' : 'none'
            }}
          >
            <RefreshCw size={16} style={{ animation: currentTab === 'matches' ? 'spin 12s linear infinite' : 'none' }} />
          </button>

          <button
            onClick={() => setCurrentTab('worldcup')}
            title="Tabela da Copa 2026"
            style={{
              background: currentTab === 'worldcup' ? 'var(--accent-light)' : 'transparent',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '8px',
              color: currentTab === 'worldcup' ? 'var(--accent)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'var(--transition)',
              boxShadow: currentTab === 'worldcup' ? '0 0 10px rgba(37, 117, 252, 0.15)' : 'none'
            }}
          >
            <Globe size={16} />
          </button>
          
          <button
            onClick={() => setCurrentTab('album')}
            title="Seu Álbum"
            style={{
              background: currentTab === 'album' ? 'var(--accent-light)' : 'transparent',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '8px',
              color: currentTab === 'album' ? 'var(--accent)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'var(--transition)',
              boxShadow: currentTab === 'album' ? '0 0 10px rgba(37, 117, 252, 0.15)' : 'none'
            }}
          >
            <Trophy size={16} />
          </button>

          <button
            onClick={() => setCurrentTab('chat')}
            title="Mensagens e Propostas"
            style={{
              background: currentTab === 'chat' ? 'var(--accent-light)' : 'transparent',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '8px',
              color: currentTab === 'chat' ? 'var(--accent)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              transition: 'var(--transition)',
              boxShadow: currentTab === 'chat' ? '0 0 10px rgba(37, 117, 252, 0.15)' : 'none'
            }}
          >
            <MessageSquare size={16} />
            {pendingCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  background: 'var(--error)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '14px',
                  height: '14px',
                  fontSize: '0.55rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 0 2px var(--bg-primary)'
                }}
              >
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentTab('profile')}
            title="Seu Perfil"
            style={{
              background: currentTab === 'profile' ? 'var(--accent-light)' : 'transparent',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '8px',
              color: currentTab === 'profile' ? 'var(--accent)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'var(--transition)',
              boxShadow: currentTab === 'profile' ? '0 0 10px rgba(37, 117, 252, 0.15)' : 'none'
            }}
          >
            <User size={16} />
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              title="Sair da Conta"
              style={{
                background: 'transparent',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '8px',
                color: 'var(--error)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'var(--transition)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--error-light)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <LogOut size={16} />
            </button>
          )}
        </nav>

        {/* Theme Toggle Container */}
        <div>
          <ThemeToggle />
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </header>
  );
}
