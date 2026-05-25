import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { requestNotificationPermission } from './notifications.js';

// Registra service worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (reg) => console.log('[SW] Service Worker registrado:', reg.scope),
      (err) => console.warn('[SW] Erro ao registrar SW:', err.message)
    );
  });
}

// Solicita permissão de notificações após interação do usuário
const setupNotifications = () => {
  const handleInteraction = () => {
    requestNotificationPermission();
    document.removeEventListener('click', handleInteraction);
    document.removeEventListener('touchstart', handleInteraction);
  };
  document.addEventListener('click', handleInteraction);
  document.addEventListener('touchstart', handleInteraction);
};

if (typeof document !== 'undefined') {
  setupNotifications();
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
