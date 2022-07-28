const CACHE_DATA_NAME = 'wordle_cache_v1';

this.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_DATA_NAME).then((cache) => {
      const urlsToCache = [
        '/index.html',
        '/words.json',
        '/favicon.ico',
        '/',
        '/manifest.json',
        '/logo192.png',
      ];

      fetch('/asset-manifest.json')
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);
          cache.addAll([...urlsToCache, data.files['main.css'], data.files['main.js']]);
        })
        .catch((err) => {
          console.log('err', err);
          cache.addAll([...urlsToCache, '/static/js/bundle.js']);
        });
    })
  );
});

this.addEventListener('fetch', (event) => {
  if (!navigator.onLine) {
    event.respondWith(
      caches.match(event.request).then((result) => {
        if (result) return result;
        return fetch(event.request);
      })
    );
  }
});

this.addEventListener('activate', (event) => {
  const cacheAllowList = [CACHE_DATA_NAME];

  // Get all the currently active `Cache` instances.
  event.waitUntil(
    caches.keys().then((keys) => {
      // Delete all caches that aren't in the allow list:
      return Promise.all(
        keys.map((key) => {
          if (!cacheAllowList.includes(key)) {
            return caches.delete(key);
          }
          return null;
        })
      );
    })
  );
});
