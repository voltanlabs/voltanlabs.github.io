const CACHE = 'databyte-three-release-2';
const CORE = [
  './', './index.html', './styles.css', './manifest.json',
  './main.js?v=release-features-1', './pwa.js?v=release-d4f04cc', './vendor/three.module.js', './vendor/three.core.js', './data/runtime-data.js', './data/species.json', './data/moves.json', './session.js?v=save-portability-1', './save-tools.js?v=save-portability-1',
  './progression.js?v=rank-progression', './inventory.js?v=item-cache', './capture-pressure.js?v=pressure-loop', './evolution.js?v=version-upgrades', './environment.js?v=signal-environments', './combat-effects.js?v=combat-motion', './missions.js?v=mission-chain', './encounter.js', './dex-ui.js?v=collection-count-1', './dex-details.js?v=dex-records', './regions.js?v=signal-regions', './region-encounters.js?v=regional-pools', './events.js?v=live-signal-events', './reward-history.js?v=reward-history', './world-map.js?v=world-map', './discovery-codes.js?v=manual-discovery', './starter.js?v=paint-gate', './slots-ui.js', './switch-ui.js', './os-nav.js?v=items-popup',
  './data/sprites/placeholder.png', './data/sprites/leovolt.png', './data/sprites/scorpyone.png', './feedback.js?v=feedback-1'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(CACHE).then(cache => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match('./index.html'))));
});
