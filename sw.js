const CACHE_NAME = 'arrival-recorder-v1';
const FILES = [
  '/',
  '/index.html',
  '/sw.js'
];

// install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES))
  );
  self.skipWaiting();
});

// activate
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => {
      if(k !== CACHE_NAME) return caches.delete(k);
    })))
  );
  self.clients.claim();
});

// fetch
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if(cached) return cached;
      return fetch(event.request).then(resp => {
        // optionally cache new requests
        return resp;
      }).catch(()=> caches.match('/index.html'));
    })
  );
});