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
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => caches.match('/index.html'))
  );
});
