const CACHE_NAME = 'civilskash-v4-ultimate';
const DYNAMIC_CACHE = 'civilskash-dynamic-v1';

// 1. APP SHELL: These must be cached for the app to load at all
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  // Cache the library you use for Image Sharing
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
];

// 2. INSTALL: Cache the "App Shell" immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching App Shell');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); // Forces this new SW to become active immediately
});

// 3. ACTIVATE: Clean up old caches (crucial for updates)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== DYNAMIC_CACHE) {
            console.log('[SW] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim(); // Take control of open pages immediately
});

// 4. FETCH STRATEGIES (The "Brain" of the Offline Mode)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // STRATEGY A: Google Script API (Network First, then Cache)
  if (url.href.includes('script.google.com') || url.href.includes('/exec')) {
    event.respondWith(
      fetch(event.request)
        .then((networkRes) => {
          return caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(event.request, networkRes.clone());
            return networkRes;
          });
        })
        .catch(() => {
          // If offline, return the cached API response
          return caches.match(event.request);
        })
    );
    return;
  }

  // STRATEGY B: Google Fonts & CDNs (Cache First)
  if (url.origin.includes('fonts.googleapis.com') || 
      url.origin.includes('fonts.gstatic.com') ||
      url.origin.includes('cdnjs.cloudflare.com')) {
    event.respondWith(
      caches.match(event.request).then((cachedRes) => {
        return cachedRes || fetch(event.request).then((networkRes) => {
          return caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(event.request, networkRes.clone());
            return networkRes;
          });
        });
      })
    );
    return;
  }

  // STRATEGY C: Images (Stale-While-Revalidate)
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request).then((cachedRes) => {
        const fetchPromise = fetch(event.request).then((networkRes) => {
          return caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(event.request, networkRes.clone());
            return networkRes;
          });
        });
        return cachedRes || fetchPromise;
      })
    );
    return;
  }

  // STRATEGY D: Default (Cache First, fall back to Network)
  // For everything else (index.html, app.js, style.css)
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
