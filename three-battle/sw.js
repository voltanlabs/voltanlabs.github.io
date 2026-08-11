const CACHE = 'databyte-three-release-34';
const CORE = [
  './party-handoff.js?v=preserve-hp-handoff-1',
  './starter.js?v=starter-preview-1',
  './', './index.html', './styles.css', './manifest.json',
  './data/runtime-data.js', './data/species.json', './data/moves.json',
  './vendor/three.module.js', './vendor/three.core.js', './battle-rules.js', './battle-state.js', './battle-status.js', './battle-render.js',
  './status-effects.js?v=status-runtime-2', './authored-moves.js?v=authored-family-moves-1', './move-catalog.js?v=move-catalog-61-1', './move-effects.js?v=move-effects-8', './battle-ai.js', './battle-guards.js?v=fainted-capture-1',
  './reward-flow.js?v=reward-flow-1', './roster-loader.js?v=roster-v2', './session.js?v=profile-session-1', './species-progression.js?v=species-stages-1', './instance-storage.js?v=unique-databyte-instances-2', './evolution-gate.js?v=instance-evolution-3', './storage-sync.js?v=party-xp-merge-2', './profile-normalizer.js?v=profile-normalizer-1',
  './progression.js?v=profile-progression-1', './inventory.js?v=profile-inventory-2', './capture-pressure.js?v=pressure-loop-3', './environment.js?v=signal-environments', './combat-effects.js?v=combat-motion-2',
  './feedback.js?v=feedback-1', './capture-control.js?v=live-capture-2', './capture-coins.js?v=capture-balance-1', './encounter-code.js?v=code-identity-1', './stability-normalizer.js?v=stability-floor-1', './encounter-levels.js?v=admin-signal-level-1', './battle-levels.js?v=admin-signal-level-2', './battle-rewards.js?v=explicit-outcome-2',
 './missions.js?v=profile-missions-1', './recovery.js?v=hp-recovery-2', './encounter.js?v=rarity-window-1', './dex-ui.js?v=collection-count-1', './dex-details.js?v=dex-records', './regions.js?v=profile-regions-2', './region-encounters.js?v=profile-regional-pools-2', './events.js?v=profile-events-1', './reward-history.js?v=scaled-enemy-xp-1', './world-map.js?v=profile-world-map-2', './discovery-codes.js?v=profile-discovery-codes-1', './starter.js?v=paint-gate', './slots-ui.js?v=instance-deploy-3', './switch-ui.js?v=switch-instance-3', './os-nav.js?v=items-popup', './save-tools.js?v=save-safety-1', './pwa.js?v=release-0.1.6', './main.js?v=accuracy-guard-21'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const networkFirst = event.request.destination === 'document' || event.request.destination === 'script' || event.request.url.includes('/main.js');
  event.respondWith((networkFirst ? fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(CACHE).then(cache => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match(event.request)) : caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(CACHE).then(cache => cache.put(event.request, copy));
    return response;
  }))).catch(() => caches.match('./index.html')));
});
