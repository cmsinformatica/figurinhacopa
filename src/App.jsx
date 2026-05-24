import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import MatchFeed from './components/MatchFeed.jsx';
import AlbumGrid from './components/AlbumGrid.jsx';
import ChatTab from './components/ChatTab.jsx';
import ProfileTab from './components/ProfileTab.jsx';
import AuthScreen from './components/AuthScreen.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import { supabase } from './supabaseClient.js';
import { getUserAlbum, calculateMatches, getUserProfile, saveUserProfile, proposeTrade, syncAllDataWithSupabase, fetchRealCollectorsAndCalculateMatches, fetchRealLeaderboard } from './db.js';

export default function App() {
  const [currentTab, setCurrentTab] = useState('matches');
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [album, setAlbum] = useState({});
  const [profile, setProfile] = useState(null);
  const [activeChatCollectorId, setActiveChatCollectorId] = useState(null);

  // Controla simulação offline
  const [isOfflineSimulated, setIsOfflineSimulated] = useState(false);

  const loadOrCreateUserProfile = async (sessionUser) => {
    try {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sessionUser.id)
        .single();

      if (userProfile) {
        setProfile(userProfile);
        localStorage.setItem('figucopa_user_profile', JSON.stringify(userProfile));
        return userProfile;
      } else {
        const meta = sessionUser.user_metadata || {};
        const newProfile = {
          id: sessionUser.id,
          name: meta.name || 'Colecionador',
          neighborhood: meta.neighborhood || 'Barra',
          favorite_team: meta.favorite_team || 'BRA',
          distance: '0m',
          completed_trades: 0,
          rating: 5.0,
          avatar: '⚽',
          is_admin: false
        };
        await supabase.from('profiles').upsert([newProfile]);
        setProfile(newProfile);
        localStorage.setItem('figucopa_user_profile', JSON.stringify(newProfile));
        return newProfile;
      }
    } catch (err) {
      console.warn('Erro ao carregar ou criar perfil, usando local:', err.message);
      const fallback = {
        id: sessionUser.id,
        name: 'Colecionador',
        neighborhood: 'Barra',
        favorite_team: 'BRA',
        completed_trades: 0,
        rating: 5.0,
        avatar: '⚽',
        is_admin: false
      };
      setProfile(fallback);
      localStorage.setItem('figucopa_user_profile', JSON.stringify(fallback));
      return fallback;
    }
  };

  useEffect(() => {
    // 1. Recupera sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        loadOrCreateUserProfile(session.user);
        setAlbum(getUserAlbum());
      }
      setLoadingSession(false);
    });

    // 2. Escuta mudanças na autenticação (Login / Cadastro / Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        loadOrCreateUserProfile(session.user).then(() => {
          // Sincroniza dados na nuvem de forma assíncrona
          syncAllDataWithSupabase().then(() => {
            setAlbum(getUserAlbum());
          });
        });
      } else {
        localStorage.removeItem('figucopa_user_profile');
        localStorage.removeItem('figucopa_user_album');
        setProfile(null);
        setAlbum({});
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

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

  const [realMatches, setRealMatches] = useState([]);
  const [realStats, setRealStats] = useState({ collectorsCount: 1, tradesCount: 0, onlineCount: 1 });
  const [realLeaderboard, setRealLeaderboard] = useState([]);

  // Sincroniza e busca os matches e estatísticas reais do Supabase
  useEffect(() => {
    if (!session || !profile) return;

    const loadRealtimeFeed = async () => {
      try {
        const calculatedMatches = await fetchRealCollectorsAndCalculateMatches(profile, album);
        setRealMatches(calculatedMatches);

        const calculatedLeaderboard = await fetchRealLeaderboard(profile, album);
        setRealLeaderboard(calculatedLeaderboard);

        // Busca estatísticas reais de cadastrados e trocas
        const { count: cCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        const { data: profilesData } = await supabase
          .from('profiles')
          .select('completed_trades');

        let totalTrades = 0;
        if (profilesData) {
          totalTrades = profilesData.reduce((sum, p) => sum + (p.completed_trades || 0), 0);
        }

        setRealStats({
          collectorsCount: cCount || 1,
          tradesCount: totalTrades,
          onlineCount: Math.max(1, Math.round((cCount || 1) * 0.35))
        });
      } catch (err) {
        console.warn('Erro ao carregar dados em tempo real:', err.message);
      }
    };

    loadRealtimeFeed();
    const interval = setInterval(loadRealtimeFeed, 8000);
    return () => clearInterval(interval);
  }, [session, profile, album]);

  if (loadingSession) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem', animation: 'spin 2s linear infinite' }}>⚽</div>
        <h3 style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>Carregando Arena...</h3>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!session) {
    return <AuthScreen onAuthSuccess={(sess) => setSession(sess)} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', transition: 'var(--transition)' }}>
      {/* Header / Navegação */}
      <Header 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        isAdmin={profile?.is_admin} 
        onLogout={handleLogout} 
      />

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
          <MatchFeed 
            matches={realMatches} 
            onProposeTrade={handleProposeTrade} 
            realStats={realStats}
            profile={profile}
          />
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
            realLeaderboard={realLeaderboard}
          />
        )}

        {currentTab === 'admin' && profile?.is_admin && (
          <AdminPanel />
        )}
      </main>
    </div>
  );
}
