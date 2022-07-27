const CACHE_DATA_NAME = 'wordle-data';

this.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_DATA_NAME).then((cache) => {
      cache.addAll(['/static/js/bundle.js', '/index.html', '/words.json', '/favicon.ico', '/']);
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
