export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) return;

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      localStorage.setItem('figucopa_push_enabled', 'true');
      registerServiceWorker();
    }
  } catch (err) {
    console.warn('[Notificações] Erro ao solicitar permissão:', err.message);
  }
};

const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('[Notificações] Service Worker registrado:', registration.scope);
    } catch (err) {
      console.warn('[Notificações] Erro ao registrar SW:', err.message);
    }
  }
};

export const sendLocalNotification = (title, body) => {
  if (localStorage.getItem('figucopa_push_enabled') !== 'true') return;
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  try {
    new Notification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      vibrate: [200, 100, 200],
      tag: 'figucopa-notification'
    });
  } catch (err) {
    console.warn('[Notificações] Erro ao enviar notificação:', err.message);
  }
};
