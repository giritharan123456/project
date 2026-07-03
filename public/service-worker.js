// Service worker disabled to prevent caching issues
// const CACHE_NAME = 'market-gap-finder-v2';
// const urlsToCache = [
//   '/',
//   '/index.html',
//   '/static/js/bundle.js',
//   '/static/css/main.css'
// ];

// self.addEventListener('install', event => {
//   event.waitUntil(
//     caches.open(CACHE_NAME)
//       .then(cache => cache.addAll(urlsToCache))
//   );
// });

// self.addEventListener('fetch', event => {
//   event.respondWith(
//     caches.match(event.request)
//       .then(response => {
//         if (response) {
//           return response;
//         }
//         return fetch(event.request);
//       })
//   );
// });
