const CACHE_DATA_NAME = 'wordle-data';

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
