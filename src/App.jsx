import React, { useState } from 'react';
import Header from './components/Header.jsx';
import MatchFeed from './components/MatchFeed.jsx';
import AlbumGrid from './components/AlbumGrid.jsx';
import OfflineBanner from './components/OfflineBanner.jsx';
import { getUserAlbum, calculateMatches } from './db.js';

export default function App() {
  const [currentTab, setCurrentTab] = useState('matches');
  const [isOfflineSimulated, setIsOfflineSimulated] = useState(false);
  const [album, setAlbum] = useState(() => getUserAlbum());

  const handleAlbumUpdate = (newAlbum) => {
    setAlbum(newAlbum);
    // Salva localmente (cuida de fila offline se necessário)
    localStorage.setItem('figucopa_user_album', JSON.stringify(newAlbum));
    
    // Adiciona na fila se estiver simulando offline
    if (isOfflineSimulated) {
      const queue = JSON.parse(localStorage.getItem('figucopa_offline_sync') || '[]');
      queue.push({
        timestamp: Date.now(),
        action: 'UPDATE_ALBUM',
        data: newAlbum
      });
      localStorage.setItem('figucopa_offline_sync', JSON.stringify(queue));
    }
  };

  const handleSyncTrigger = () => {
    // Força atualização a partir do localStorage
    setAlbum(getUserAlbum());
  };

  const matches = calculateMatches();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', transition: 'var(--transition)' }}>
      {/* Header / Navegação */}
      <Header currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Área de Conteúdo Principal (Centralizada e Responsiva) */}
      <main
        style={{
          flex: 1,
          width: '100%',
          maxWidth: '640px',
          margin: '0 auto',
          padding: '1.5rem 1rem',
          boxSizing: 'border-box'
        }}
      >
        {currentTab === 'matches' ? (
          <MatchFeed matches={matches} />
        ) : (
          <AlbumGrid album={album} onAlbumUpdate={handleAlbumUpdate} />
        )}
      </main>

      {/* Banner de Controle Offline (PWA) */}
      <OfflineBanner
        isOfflineSimulated={isOfflineSimulated}
        setIsOfflineSimulated={setIsOfflineSimulated}
        onSyncTrigger={handleSyncTrigger}
      />
    </div>
  );
}
