const CACHE_NAME = 'quickbill-pos-v6';

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installed network-first PWA controller v6');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          console.log('[Service Worker] Deleting legacy cache:', key);
          return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

// Network-First strategy to ensure fresh code and translations on every load
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
