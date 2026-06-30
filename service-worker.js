// ═══════════════════════════════════════════════════════════════
// HomeoClinic — Service Worker
// Full offline support: app shell + assets cached on install.
// Cache-first strategy with background revalidation.
// All clinic DATA lives in IndexedDB/localStorage (handled by the
// app itself) — this worker only caches the static app files.
// ═══════════════════════════════════════════════════════════════

const CACHE_VERSION = 'homeoclinic-v2';
const CACHE_NAME = CACHE_VERSION;

// Files that make up the app shell — adjust the HTML filename if you rename it.
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// ── INSTALL: pre-cache the app shell ──
self.addEventListener('install', event => {
  self.skipWaiting(); // activate new SW immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(APP_SHELL).catch(err => {
        // Don't fail install if one optional asset is missing
        console.warn('SW: some app-shell assets failed to cache', err);
      });
    })
  );
});

// ── ACTIVATE: clean up old caches ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH: cache-first, falling back to network, with background refresh ──
self.addEventListener('fetch', event => {
  const req = event.request;

  // Only handle GET requests for our own origin (app shell + same-origin assets)
  if (req.method !== 'GET') return;

  // Let cross-origin requests (CDN libs, Firebase, fonts, QR API, WhatsApp links, etc.)
  // pass straight through to the network — never intercept third-party calls.
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then(cachedResponse => {
      // Kick off a network fetch in the background to keep cache fresh
      const networkFetch = fetch(req)
        .then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse); // offline — fall back to cache

      // Cache-first: return cached immediately if we have it,
      // otherwise wait for the network.
      return cachedResponse || networkFetch;
    })
  );
});

// ── MESSAGE: allow the page to trigger skipWaiting / cache clear manually ──
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME);
  }
});
