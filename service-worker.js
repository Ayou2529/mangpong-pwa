/*
  ไฟล์นี้ควรบันทึกเป็น service-worker.js และวางไว้ใน root directory ของ GitHub Pages
  This file should be saved as service-worker.js and placed in the root directory of your GitHub Pages.
*/
const CACHE_NAME = 'mangpong-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  // เพิ่มไฟล์ asset อื่นๆตามต้องการ เช่น css js รูปภาพ ฯลฯ
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(urlsToCache)
    )
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
});

self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // For iOS compatibility, handle requests carefully
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if available
        if (response) {
          return response;
        }
        
        // Try to fetch from network
        return fetch(event.request).catch(() => {
          // If fetch fails, try to serve index.html as fallback
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
      })
  );
});

// Handle push notifications (if used)
self.addEventListener('push', event => {
  console.log('Push event received:', event);
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('Notification click received:', event);
});