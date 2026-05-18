const CACHE_NAME = 'royal-prestige-pamela-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css'
];

// Evento de Instalación: Guarda los archivos esenciales en la caché del celular
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caché configurada con éxito');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Evento de Activación: Limpia versiones viejas de caché si se llega a actualizar la app
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Borrando caché antigua:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Evento Fetch: Intercepta las peticiones para que la app funcione sin internet (Offline)
self.addEventListener('fetch', (event) => {
  // Solo interceptar peticiones de tipo GET estándar (evita errores con APIs de geolocalización o WhatsApp)
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // Si no hay internet y no está en caché, no rompe la app
        return new Response('Modo fuera de línea activo.');
      });
    })
  );
});
