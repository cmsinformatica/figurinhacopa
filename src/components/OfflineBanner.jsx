import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

export default function OfflineBanner({ isOfflineSimulated, setIsOfflineSimulated, onSyncTrigger }) {
  const [offlineQueueCount, setOfflineQueueCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  // Monitora a fila de sincronização no localStorage
  const updateQueueCount = () => {
    const queue = JSON.parse(localStorage.getItem('figucopa_offline_sync') || '[]');
    setOfflineQueueCount(queue.length);
  };

  useEffect(() => {
    updateQueueCount();
    // Escuta alterações na localStorage
    const handleStorageChange = () => updateQueueCount();
    window.addEventListener('storage', handleStorageChange);
    
    // Intervalo de verificação
    const interval = setInterval(updateQueueCount, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleSimulatedConnectionToggle = () => {
    const newOfflineState = !isOfflineSimulated;
    setIsOfflineSimulated(newOfflineState);
    
    if (!newOfflineState && offlineQueueCount > 0) {
      // Retornou ao modo online - dispara sincronização
      setIsSyncing(true);
      setTimeout(() => {
        // Limpa a fila e sincroniza
        localStorage.removeItem('figucopa_offline_sync');
        setOfflineQueueCount(0);
        setIsSyncing(false);
        if (onSyncTrigger) onSyncTrigger();
      }, 1500); // Simula atraso na rede
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        width: '90%',
        maxWidth: '500px',
        background: isOfflineSimulated ? 'var(--warning-light)' : 'var(--bg-secondary)',
        border: `2px solid ${isOfflineSimulated ? 'var(--warning)' : 'var(--border)'}`,
        borderRadius: '16px',
        padding: '12px 16px',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'var(--transition)',
        color: 'var(--text-primary)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            background: isOfflineSimulated ? 'var(--warning)' : 'var(--success-light)',
            color: isOfflineSimulated ? '#000' : 'var(--success)',
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'var(--transition)'
          }}
        >
          {isOfflineSimulated ? <WifiOff size={18} /> : <Wifi size={18} />}
        </div>
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>
            {isOfflineSimulated ? 'Modo Offline Ativo (Simulado)' : 'Conectado ao Supabase'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {isOfflineSimulated 
              ? `${offlineQueueCount} alteração(ões) pendente(s) no aparelho` 
              : 'Sincronização em tempo real ativa'}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {isSyncing && (
          <RefreshCw 
            size={16} 
            style={{ 
              animation: 'spin 1s linear infinite', 
              color: 'var(--accent)',
              marginRight: '4px' 
            }} 
          />
        )}
        <button
          onClick={handleSimulatedConnectionToggle}
          style={{
            background: isOfflineSimulated ? 'var(--warning)' : 'var(--bg-tertiary)',
            color: isOfflineSimulated ? '#000' : 'var(--text-primary)',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'var(--transition)'
          }}
        >
          {isOfflineSimulated ? 'Ficar Online' : 'Ficar Offline'}
        </button>
      </div>

      {/* Rotação CSS */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
