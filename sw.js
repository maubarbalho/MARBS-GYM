const CACHE_NAME = 'marsb-gym-v73-end-buttons-last';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './favicon-16.png',
  './favicon-32.png',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .catch(() => undefined)
  );
});

async function purgeOldCaches() {
  const keys = await caches.keys();
  await Promise.all(keys
    .filter((key) => key.startsWith('marsb-gym-') && key !== CACHE_NAME)
    .map((key) => caches.delete(key)));
}

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      purgeOldCaches(),
      self.registration.navigationPreload
        ? self.registration.navigationPreload.enable().catch(() => undefined)
        : Promise.resolve()
    ])
  );
  self.clients.claim();
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PURGE_OLD_CACHES') event.waitUntil(purgeOldCaches());
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('notificationclick', (event) => {
  const notification = event.notification;
  notification.close();
  if (notification.data && notification.data.type === 'timer-finished') {
    event.waitUntil(
      self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
        const openClient = clients.find((client) => 'focus' in client);
        if (openClient) return openClient.focus();
        return self.clients.openWindow ? self.clients.openWindow('./#treinos') : undefined;
      })
    );
  }
});

async function networkFirst(request, fallbackUrl) {
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    }
    return response;
  } catch (e) {
    const cached = await caches.match(request);
    return cached || caches.match(fallbackUrl);
  }
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  const network = fetch(request).then(async (response) => {
    if (response && response.ok && new URL(request.url).origin === self.location.origin) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    }
    return response;
  }).catch(() => cached);
  return cached || network;
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const isNavigation = event.request.mode === 'navigate';
  const isManifest = new URL(event.request.url).pathname.endsWith('/manifest.json');

  if (isNavigation || isManifest) {
    event.respondWith(networkFirst(event.request, './index.html'));
    return;
  }

  event.respondWith(staleWhileRevalidate(event.request));
});
