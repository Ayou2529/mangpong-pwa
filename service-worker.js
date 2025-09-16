/*
  ไฟล์นี้ควรบันทึกเป็น service-worker.js และวางไว้ใน root directory ของ GitHub Pages
  This file should be saved as service-worker.js and placed in the root directory of your GitHub Pages.
*/
const CACHE_NAME = 'mangpong-v4';
const OFFLINE_CACHE_NAME = 'mangpong-offline-v1';

// Core assets to precache
const urlsToCache = [
  '/',
  '/mangpong-pwa/',
  '/mangpong-pwa/index.html',
  '/mangpong-pwa/main.js',
  '/mangpong-pwa/manifest.json',
  '/mangpong-pwa/icon-192.png',
  '/mangpong-pwa/icon-512.png',
];

// Offline fallback page
const OFFLINE_URL = '/mangpong-pwa/offline.html';

// Install event - precache core assets
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Precache core assets
      caches.open(CACHE_NAME)
        .then(cache => {
          console.log('Service Worker: Precaching core assets');
          return cache.addAll(urlsToCache)
            .catch(error => {
              console.warn('Service Worker: Failed to precache some URLs:', error);
              // Continue installation even if some URLs fail to cache
              return Promise.resolve();
            });
        }),
      // Cache offline fallback page
      caches.open(OFFLINE_CACHE_NAME)
        .then(cache => {
          console.log('Service Worker: Caching offline page');
          return cache.addAll([OFFLINE_URL])
            .catch(error => {
              console.warn('Service Worker: Failed to cache offline page:', error);
              return Promise.resolve();
            });
        }),
    ])
      .then(() => {
        console.log('Service Worker: Installation complete');
        // Skip waiting to activate the new service worker immediately
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Installation failed:', error);
      }),
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            // Delete old caches that don't match current cache names
            if (cacheName !== CACHE_NAME && cacheName !== OFFLINE_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        console.log('Service Worker: Activation complete');
        // Claim clients to have the service worker control them immediately
        return self.clients.claim();
      })
      .catch(error => {
        console.error('Service Worker: Activation failed:', error);
      }),
  );
});

// Helper function to return cached response or fetch and cache new response
async function cacheFirst(request) {
  try {
    // Try to get response from cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('Service Worker: Returning cached response for:', request.url);
      return cachedResponse;
    }
    
    // If not in cache, fetch from network
    console.log('Service Worker: Fetching from network:', request.url);
    const networkResponse = await fetch(request);
    
    // Clone the response before putting it in cache
    const responseToCache = networkResponse.clone();
    
    // Put response in cache
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, responseToCache);
    
    return networkResponse;
  } catch (error) {
    console.error('Service Worker: CacheFirst failed for:', request.url, error);
    throw error;
  }
}

// Helper function to fetch from network first, fallback to cache
async function networkFirst(request) {
  try {
    // Fetch from network
    console.log('Service Worker: Fetching from network (NetworkFirst):', request.url);
    const networkResponse = await fetch(request);
    
    // Clone the response before putting it in cache
    const responseToCache = networkResponse.clone();
    
    // Put response in cache
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, responseToCache);
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: NetworkFirst failed, falling back to cache for:', request.url);
    
    // If network fails, try to get from cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If neither network nor cache work, throw error
    throw error;
  }
}

// Helper function for stale-while-revalidate strategy
async function staleWhileRevalidate(request) {
  try {
    // Try to get response from cache
    const cachedResponse = await caches.match(request);
    
    // Fetch fresh response from network in background
    const fetchPromise = fetch(request)
      .then(networkResponse => {
        // Clone the response before putting it in cache
        const responseToCache = networkResponse.clone();
        
        // Put fresh response in cache
        return caches.open(CACHE_NAME)
          .then(cache => cache.put(request, responseToCache))
          .then(() => networkResponse);
      })
      .catch(error => {
        console.warn('Service Worker: StaleWhileRevalidate network fetch failed:', error);
        // Return null to indicate network fetch failed
        return null;
      });
    
    // Return cached response if available, otherwise wait for network
    if (cachedResponse) {
      console.log('Service Worker: Returning stale response for:', request.url);
      // Don't await the fetch promise to return immediately (stale-while-revalidate)
      fetchPromise.catch(() => {}); // Catch any errors silently
      return cachedResponse;
    } else {
      console.log('Service Worker: No cached response, waiting for network for:', request.url);
      // Wait for network response
      const networkResponse = await fetchPromise;
      if (networkResponse) {
        return networkResponse;
      } else {
        throw new Error('Both cache and network failed');
      }
    }
  } catch (error) {
    console.error('Service Worker: StaleWhileRevalidate failed for:', request.url, error);
    throw error;
  }
}

// Helper function to get offline fallback page
async function getOfflineFallbackPage() {
  try {
    // Try to get offline page from dedicated offline cache
    const cache = await caches.open(OFFLINE_CACHE_NAME);
    const cachedResponse = await cache.match(OFFLINE_URL);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback to main cache
    const mainCache = await caches.open(CACHE_NAME);
    const mainCachedResponse = await mainCache.match(OFFLINE_URL);
    if (mainCachedResponse) {
      return mainCachedResponse;
    }
    
    // Last resort - return a basic offline response
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Offline</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body>
        <div style="text-align: center; margin-top: 50px;">
          <h1>Offline Mode</h1>
          <p>You are currently offline. Please check your internet connection.</p>
        </div>
      </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    console.error('Service Worker: Failed to get offline fallback:', error);
    // Return a basic offline response
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Offline</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body>
        <div style="text-align: center; margin-top: 50px;">
          <h1>Offline Mode</h1>
          <p>You are currently offline. Please check your internet connection.</p>
        </div>
      </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' },
    });
  }
}

// Fetch event - handle all network requests
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  const request = event.request;
  const url = new URL(request.url);
  
  // Skip requests from Chrome extensions (to avoid errors)
  if (url.protocol === 'chrome-extension:') {
    return;
  }
  
  console.log('Service Worker: Handling fetch event for:', url.href);
  
  // Skip Google Apps Script URLs to prevent caching issues
  if (url.hostname.includes('script.google.com') || url.hostname.includes('googleapis.com')) {
    console.log('Service Worker: Skipping Google Apps Script URL');
    return;
  }
  
  // Handle navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // Try to fetch the page from network
          const networkResponse = await fetch(request);
          
          // Clone the response before putting it in cache
          const responseToCache = networkResponse.clone();
          
          // Put response in cache
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, responseToCache);
          
          return networkResponse;
        } catch (error) {
          console.log('Service Worker: Navigation request failed, serving offline page:', error);
          
          // Serve offline fallback page
          return getOfflineFallbackPage();
        }
      })(),
    );
    return;
  }
  
  // Handle requests for images, fonts, and other static assets
  if (request.destination === 'image' || 
      request.destination === 'font' || 
      request.destination === 'audio' || 
      request.destination === 'video') {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
  
  // Handle requests for documents, scripts, and styles
  if (request.destination === 'document' || 
      request.destination === 'script' || 
      request.destination === 'style') {
    event.respondWith(networkFirst(request));
    return;
  }
  
  // Handle other requests with cache-first strategy
  event.respondWith(cacheFirst(request));
});