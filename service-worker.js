const CACHE_NAME = 'mangpong-v5';
const OFFLINE_CACHE_NAME = 'mangpong-offline-v2';

// แก้ไข URLs สำหรับ GitHub Pages
const urlsToCache = [
  '/mangpong-pwa/',
  '/mangpong-pwa/index.html',
  '/mangpong-pwa/manifest.json',
  '/mangpong-pwa/dist/icon-192.png',
  '/mangpong-pwa/dist/icon-512.png',
  '/mangpong-pwa/dist/icon-maskable.png',
  '/mangpong-pwa/dist/favicon.ico',
];

const OFFLINE_URL = '/mangpong-pwa/offline.html';

// เพิ่ม offline.html fallback page
self.addEventListener('install', event => {
  console.log('Service Worker: Installing v5...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  console.log('Service Worker: Activating v5...');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && cacheName !== OFFLINE_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  
  // Skip chrome extensions and Google APIs
  if (url.protocol === 'chrome-extension:' || 
      url.hostname.includes('googleapis.com') || 
      url.hostname.includes('script.google.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
      .catch(() => {
        // Return offline page for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/mangpong-pwa/offline.html');
        }
      })
  );
});