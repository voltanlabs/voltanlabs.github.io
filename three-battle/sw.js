const CACHE = 'databyte-three-release-7';
const CORE = [
  './', './index.html', './styles.css', './manifest.json',
 './main.js?v=no-coins-capture-2', './recovery.js?v=hp-recovery-1', './pwa.js?v=release-0.1.3', './vendor/three.module.js', './vendor/three.core.js', './data/runtime-data.js', './data/species.json', './data/moves.json', './session.js?v=capture-slots-5', './save-tools.js?v=save-safety-1',
  './progression.js?v=rank-progression', './inventory.js?v=item-cache', './capture-pressure.js?v=pressure-loop', './evolution.js?v=version-upgrades', './environment.js?v=signal-environments', './combat-effects.js?v=combat-motion', './missions.js?v=mission-chain', './encounter.js', './dex-ui.js?v=collection-count-1', './dex-details.js?v=dex-records', './regions.js?v=signal-regions', './region-encounters.js?v=regional-pools', './events.js?v=live-signal-events', './reward-history.js?v=reward-history', './world-map.js?v=world-map', './discovery-codes.js?v=manual-discovery', './starter.js?v=paint-gate', './slots-ui.js', './switch-ui.js', './os-nav.js?v=items-popup',
  './data/sprites/placeholder.png', './data/sprites/leovolt.png', './data/sprites/scorpyone.png', './feedback.js?v=feedback-1', './capture-control.js?v=live-capture-1', './roster-loader.js?v=roster-v2', './slots-ui.js?v=party-overview-3'
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
