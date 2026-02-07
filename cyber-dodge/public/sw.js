const CACHE_NAME = 'cyber-dodge-v1';
const assets = [
  '/',
  '/index.html',
  '/style.css',
  '/manifest.json',
  '/src/game.js',
  'https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/index.umd.min.js'
];

// Install Service Worker
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// Ambil aset dari cache jika offline
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
