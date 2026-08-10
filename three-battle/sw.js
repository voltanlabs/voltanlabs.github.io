const CACHE = 'databyte-three-release-10';
const CORE = [
  './main.js?v=capture-xp-1',
 './', './index.html', './styles.css', './manifest.json', './move-catalog.js?v=move-catalog-60-1', './move-effects.js?v=move-effects-2',
 './main.js?v=reward-levels-1', './recovery.js?v=hp-recovery-1', './encounter-code.js?v=code-identity-1', './stability-normalizer.js?v=stability-floor-1', './encounter-levels.js?v=admin-signal-level-1', './battle-levels.js?v=admin-signal-level-2', './battle-rewards.js?v=scaled-enemy-xp-1', './profile-normalizer.js?v=profile-normalizer-1', './pwa.js?v=release-0.1.4', './vendor/three.module.js', './vendor/three.core.js', './data/runtime-data.js', './data/species.json', './data/moves.json', './session.js?v=profile-session-1', './save-tools.js?v=save-safety-1',
  './progression.js?v=profile-progression-1', './inventory.js?v=profile-inventory-1', './capture-pressure.js?v=pressure-loop', './evolution.js?v=version-upgrades', './environment.js?v=signal-environments', './combat-effects.js?v=combat-motion-2', './missions.js?v=profile-missions-1', './encounter.js?v=rarity-window-1', './dex-ui.js?v=collection-count-1', './dex-details.js?v=dex-records', './regions.js?v=profile-regions-1', './region-encounters.js?v=profile-regional-pools-1', './events.js?v=profile-events-1', './reward-history.js?v=scaled-enemy-xp-1', './world-map.js?v=profile-world-map-1', './discovery-codes.js?v=profile-discovery-codes-1', './starter.js?v=paint-gate', './slots-ui.js?v=sprite-progression-1', './switch-ui.js', './os-nav.js?v=items-popup',
  './data/sprites/placeholder.png', './data/sprites/leovolt.png', './data/sprites/scorpyone.png', './feedback.js?v=feedback-1', './capture-control.js?v=live-capture-2', './capture-coins.js?v=capture-balance-1', './roster-loader.js?v=roster-v2'
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
