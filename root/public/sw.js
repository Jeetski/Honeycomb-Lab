const IMAGE_CACHE = 'honeycomb-lab-images-v1';
const MAX_IMAGE_ENTRIES = 80;

const CORE_IMAGES = [
  '/background.png',
  '/honeycomb_lab.png',
  '/ribbon.png',
  '/huge_condom.jpg',
  '/royal_magnum.jpg',
  '/BolenZdrav.jpg',
  '/David.png',
  '/tiny.jpg',
  '/average.jpg',
  '/XXXL.jpg',
  '/licenses/Silver_No_Background.png',
  '/licenses/Rose-Gold_No_Background.png',
  '/licenses/Diamond_No_Background.png',
  '/licenses/Custom_No_Background.png',
  '/beats/malice/thumb.webp',
  '/beats/gold/thumb.webp',
  '/beats/digital-strings/thumb.webp',
  '/beats/beatitude/thumb.webp',
  '/beats/quixotic/thumb.webp',
  '/beats/ambivalence/thumb.webp',
];

const IMAGE_EXTENSION_RE = /\.(?:avif|gif|ico|jpe?g|png|svg|webp)(?:\?.*)?$/i;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(IMAGE_CACHE).then((cache) => (
      Promise.allSettled(
        CORE_IMAGES.map((url) => (
          fetch(url, { cache: 'reload' }).then((response) => {
            if (response.ok) return cache.put(url, response);
            return undefined;
          })
        ))
      )
    ))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => (
      Promise.all(
        keys
          .filter((key) => key.startsWith('honeycomb-lab-images-') && key !== IMAGE_CACHE)
          .map((key) => caches.delete(key))
      )
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const isImageRequest = request.destination === 'image' || IMAGE_EXTENSION_RE.test(url.pathname);
  if (!isImageRequest) return;

  event.respondWith(cacheImageRequest(request, event));
});

async function cacheImageRequest(request, event) {
  const cache = await caches.open(IMAGE_CACHE);
  const cached = await cache.match(request);

  if (cached) {
    event.waitUntil(fetchAndCacheImage(request, cache).catch(() => undefined));
    return cached;
  }

  return fetchAndCacheImage(request, cache);
}

async function fetchAndCacheImage(request, cache) {
  const response = await fetch(request);
  if (response.ok && response.type === 'basic') {
    await cache.put(request, response.clone());
    await trimImageCache(cache);
  }
  return response;
}

async function trimImageCache(cache) {
  const keys = await cache.keys();
  if (keys.length <= MAX_IMAGE_ENTRIES) return;

  await Promise.all(keys.slice(0, keys.length - MAX_IMAGE_ENTRIES).map((key) => cache.delete(key)));
}
