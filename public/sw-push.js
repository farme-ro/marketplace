/**
 * Service Worker for Push Notifications
 * 
 * Handles push notifications for farme.ro PWA
 */

const CACHE_NAME = 'farme-push-v1';

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW Push] Service Worker installing...');
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW Push] Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  return self.clients.claim();
});

// Push event - handle incoming push notifications
self.addEventListener('push', (event) => {
  console.log('[SW Push] Push notification received:', event);

  let notificationData = {
    title: 'farme.ro',
    body: 'Ai o notificare nouă',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    data: {},
  };

  // Parse push data if available
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        title: data.title || notificationData.title,
        body: data.body || notificationData.body,
        icon: data.icon || notificationData.icon,
        badge: data.badge || notificationData.badge,
        data: data.data || {},
      };
    } catch (e) {
      console.error('[SW Push] Error parsing push data:', e);
      notificationData.body = event.data.text() || notificationData.body;
    }
  }

  // Show notification
  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      data: notificationData.data,
      tag: notificationData.data.url || 'default',
      requireInteraction: false,
      actions: notificationData.data.url
        ? [
            {
              action: 'open',
              title: 'Deschide',
            },
            {
              action: 'close',
              title: 'Închide',
            },
          ]
        : [],
    })
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[SW Push] Notification clicked:', event);

  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  // Open URL if available
  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true,
      })
      .then((clientList) => {
        // Check if there's already a window/tab open with the target URL
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // If not, open a new window/tab
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Notification close event
self.addEventListener('notificationclose', (event) => {
  console.log('[SW Push] Notification closed:', event);
});

