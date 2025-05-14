importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

//Cachear imágenes con estrategia Cache First
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
      }),
    ],
  })
);

//Rutas de autenticación siempre desde la red
workbox.routing.registerRoute(
  ({ url }) => url.pathname.startsWith('/usuarios') || url.pathname.startsWith('/login'),
  new workbox.strategies.NetworkOnly()
);

//Archivos estáticos (JS, CSS, HTML) con StaleWhileRevalidate
workbox.routing.registerRoute(
  ({ request }) => ['script', 'style', 'document'].includes(request.destination),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'static-resources',
  })
);

//Limpiar cachés antiguas al activar el nuevo SW
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => 
      Promise.all(cacheNames.map((cache) => caches.delete(cache)))
    )
  );
});
