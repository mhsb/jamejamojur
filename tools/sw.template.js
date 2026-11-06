/* سرویس‌ورکر: همهٔ فایل‌ها یک‌بار کش می‌شوند و برنامه کاملاً آفلاین کار می‌کند.
   کدها (html/js/css) همیشه اول از اینترنت تازه گرفته می‌شوند و فقط وقتی اینترنت نیست از کش می‌آیند.
   این فایل خودکار ساخته می‌شود (tools/build_sw.py)؛ دستی ویرایشش نکنید. */
const CACHE = 'jam-__VERSION__';
const ASSETS = __ASSETS__;
const FRESH = /(\.html|\.css|\.webmanifest|\/(app|shell|bridge|version|astro)\.js)$|\/$/;

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await Promise.all(ASSETS.map(async a => {
      const r = await fetch(new Request(a, { cache: 'reload' }));
      if (!r.ok) throw new Error(a);
      await c.put(a, r);
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if ((k.startsWith('zamin-asman-') || k.startsWith('jam-')) && k !== CACHE) await caches.delete(k);
    await self.clients.claim();
    for (const c of await self.clients.matchAll()) c.postMessage({ sw: 'ready' });
  })());
});

async function fallback(cache, r) {
  return (await cache.match(r, { ignoreSearch: true })) ||
    (r.mode === 'navigate' ? (await cache.match('./')) || (await cache.match('index.html')) : null) || Response.error();
}
async function netFirst(r) {
  const cache = await caches.open(CACHE);
  try {
    const res = await Promise.race([fetch(r.url, { cache: 'no-cache' }), new Promise((_, j) => setTimeout(j, 4000))]);
    if (res.ok) cache.put(r, res.clone());
    return res;
  } catch (_) { return fallback(cache, r); }
}
async function cacheFirst(r) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(r, { ignoreSearch: true });
  if (hit) return hit;
  try { const res = await fetch(r); if (res.ok) cache.put(r, res.clone()); return res; } catch (_) { return Response.error(); }
}
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== location.origin) return;
  e.respondWith(r.mode === 'navigate' || FRESH.test(u.pathname) ? netFirst(r) : cacheFirst(r));
});
