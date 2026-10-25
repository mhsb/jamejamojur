/* سرویس‌ورکر: همهٔ فایل‌ها یک‌بار کش می‌شوند و برنامه کاملاً آفلاین کار می‌کند.
   این فایل خودکار ساخته می‌شود (tools/build_sw.py)؛ دستی ویرایشش نکنید. */
const CACHE = 'zamin-asman-d0dca15106';
const ASSETS = [
 "./",
 "assets/css/shell.css",
 "assets/fonts/vazirmatn-subset.woff2",
 "assets/icons/apple-touch-icon.png",
 "assets/icons/icon-192.png",
 "assets/icons/icon-512.png",
 "assets/icons/icon.svg",
 "assets/icons/maskable-512.png",
 "assets/js/bridge.js",
 "assets/js/shell.js",
 "assets/lib/d3.min.js",
 "assets/lib/three.min.js",
 "data/places.json",
 "index.html",
 "manifest.webmanifest",
 "modules/atlas/app.js",
 "modules/atlas/data.js",
 "modules/atlas/index.html",
 "modules/countries/app.js",
 "modules/countries/data.js",
 "modules/countries/index.html",
 "modules/iran/app.js",
 "modules/iran/data.js",
 "modules/iran/index.html",
 "modules/sky/app.js",
 "modules/sky/index.html",
 "modules/solar/app.js",
 "modules/solar/index.html"
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('zamin-asman-') && k !== CACHE) await caches.delete(k);
    await self.clients.claim();
    for (const c of await self.clients.matchAll()) c.postMessage({ sw: 'ready' });
  })());
});

/* اول از کش (سریع و آفلاین)، همزمان در پس‌زمینه تازه می‌شود */
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(r, { ignoreSearch: true });
    const net = fetch(r).then(res => { if (res.ok) cache.put(r, res.clone()); return res; }).catch(() => null);
    if (hit) { e.waitUntil(net); return hit; }
    const res = await net;
    if (res) return res;
    if (r.mode === 'navigate') return (await cache.match('./')) || (await cache.match('index.html')) || Response.error();
    return Response.error();
  })());
});
