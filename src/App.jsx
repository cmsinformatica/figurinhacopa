import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import MatchFeed from './components/MatchFeed.jsx';
import AlbumGrid from './components/AlbumGrid.jsx';
import ChatTab from './components/ChatTab.jsx';
import ProfileTab from './components/ProfileTab.jsx';
import OfflineBanner from './components/OfflineBanner.jsx';
import { getUserAlbum, calculateMatches, getUserProfile, saveUserProfile, proposeTrade, syncAllDataWithSupabase } from './db.js';

export default function App() {
  const [currentTab, setCurrentTab] = useState('matches');
  const [isOfflineSimulated, setIsOfflineSimulated] = useState(false);
  const [album, setAlbum] = useState(() => getUserAlbum());
  const [profile, setProfile] = useState(() => getUserProfile());
  const [activeChatCollectorId, setActiveChatCollectorId] = useState(null);

  useEffect(() => {
    syncAllDataWithSupabase().then(() => {
      setAlbum(getUserAlbum());
      setProfile(getUserProfile());
    });
  }, []);

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

  const handleProfileUpdate = (newProfile) => {
    setProfile(newProfile);
    saveUserProfile(newProfile);
  };

  const handleSyncTrigger = () => {
    // Força atualização a partir do localStorage
    setAlbum(getUserAlbum());
    setProfile(getUserProfile());
  };

  const handleProposeTrade = (match) => {
    // Cria proposta no db local
    proposeTrade(match.id, match.youSend, match.youReceive);
    // Seleciona o colecionador ativo no chat
    setActiveChatCollectorId(match.id);
    // Alterna para a aba de chat
    setCurrentTab('chat');
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
        {currentTab === 'matches' && (
          <MatchFeed matches={matches} onProposeTrade={handleProposeTrade} />
        )}
        
        {currentTab === 'album' && (
          <AlbumGrid album={album} onAlbumUpdate={handleAlbumUpdate} />
        )}

        {currentTab === 'chat' && (
          <ChatTab 
            activeCollectorId={activeChatCollectorId} 
            setActiveCollectorId={setActiveChatCollectorId} 
            album={album}
            onAlbumUpdate={handleAlbumUpdate}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileTab 
            album={album} 
            onAlbumUpdate={handleAlbumUpdate}
            profile={profile}
            onProfileUpdate={handleProfileUpdate}
          />
        )}
      </main>
    </div>
  );
}
