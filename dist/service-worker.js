/*
  ไฟล์นี้ควรบันทึกเป็น service-worker.js และวางไว้ใน root directory ของ GitHub Pages
  This file should be saved as service-worker.js and placed in the root directory of your GitHub Pages.
*/
const CACHE_NAME = 'mangpong-v3';
const urlsToCache = [
  '/',
  '/mangpong-pwa/',
  '/mangpong-pwa/index.html',
  '/mangpong-pwa/main.js',
  '/mangpong-pwa/manifest.json',
  '/mangpong-pwa/icon-192.png',
  '/mangpong-pwa/icon-512.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Filter out URLs that don't exist to prevent caching errors
        const validUrls = [];
        const validationPromises = urlsToCache.map(url => {
          return fetch(url, { method: 'HEAD' })
            .then(response => {
              if (response.ok) {
                validUrls.push(url);
              }
            })
            .catch(() => {
              // Ignore failed requests, don't cache them
              console.log('Skipping cache for non-existent URL:', url);
            });
        });
        
        return Promise.all(validationPromises)
          .then(() => cache.addAll(validUrls));
      })
      .catch(error => {
        console.error('Failed to cache URLs:', error);
        // Continue installation even if caching fails
        return Promise.resolve();
      })
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
  if (event.request.method !== 'GET') return;

  // Handle requests to edit.html specially (since it doesn't exist)
  if (event.request.url.includes('/edit.html')) {
    // Redirect to index.html with query parameters
    const newUrl = new URL(event.request.url);
    newUrl.pathname = newUrl.pathname.replace('/edit.html', '/index.html');
    const redirectedRequest = new Request(newUrl.toString(), event.request);
    
    event.respondWith(
      fetch(redirectedRequest).catch(() => {
        // Fallback to cache if network fails
        return caches.match(redirectedRequest) || caches.match('/mangpong-pwa/index.html');
      })
    );
    return;
  }

  if (event.request.destination === 'image' || event.request.destination === 'font') {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
          });
          return networkResponse;
        });
        return cachedResponse || fetchPromise;
      })
    );
  } else if (event.request.destination === 'document' || event.request.destination === 'script' || event.request.destination === 'style') {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        return cachedResponse || fetch(event.request).then(networkResponse => {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
          });
          return networkResponse;
        });
      })
    );
  } else {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }
});

// Handle push notifications (if used)
self.addEventListener('push', event => {
  console.log('Push event received:', event);
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('Notification click received:', event);
});