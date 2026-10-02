const CACHE = "hci-athlete-lima-eliana-90b43e94b7d110a1eb53";
const PREFIX = "hci-athlete-lima-eliana-";
const PRECACHE = ["./athlete.html","./portal-data-5537216014b1ed369f09.json","./manifest.webmanifest","./icon-192.png","./icon-512.png","./assets/athlete-Bq5F_Yqy.js","./assets/athlete-CYhDSjt2.css"];
const ROOT = new URL('./', self.registration.scope);
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(PRECACHE.map(file => new URL(file, ROOT)))));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith(PREFIX) && key !== CACHE) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== ROOT.origin || !url.pathname.startsWith(ROOT.pathname)) return;
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const response = await fetch(request);
        if (!response.ok) throw new Error('PORTAL_NAVIGATION_FAILED');
        const usable = response.redirected
          ? new Response(await response.blob(), { status: response.status, statusText: response.statusText, headers: response.headers })
          : response;
        // The installed worker caches a whole package during installation.
        // An online navigation must not replace its offline HTML independently.
        return usable;
      } catch {
        return (await cache.match(new URL('./athlete.html', ROOT))) || Response.error();
      }
    })());
    return;
  }
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(request);
    if (cached) return cached;
    const response = await fetch(request);
    if (response.ok) await cache.put(request, response.clone());
    return response;
  })());
});
