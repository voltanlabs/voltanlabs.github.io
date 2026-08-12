const CACHE = 'databyte-three-release-81';
const CORE = [
  './party-handoff.js?v=preserve-hp-handoff-1',
  './starter.js?v=starter-preview-1',
  './', './index.html', './styles.css', './scanner-effect.js?v=particle-portal-9', './status-tooltips.css?v=status-tooltips-1', './manifest.json',
  './data/runtime-data.js', './data/species.json', './data/moves.json',
  './vendor/three.module.js', './vendor/three.core.js', './battle-rules.js?v=battle-balance-3', './battle-state.js?v=battle-flow-2', './battle-status.js', './battle-render.js',
  './status-effects.js?v=status-runtime-2', './authored-moves.js?v=authored-family-moves-1', './move-catalog.js?v=move-catalog-62', './move-effects.js?v=battle-flow-2', './battle-ai.js?v=battle-balance-2', './battle-guards.js?v=fainted-capture-1',
  './reward-flow.js?v=reward-flow-1', './roster-loader.js?v=roster-v3', './session.js?v=profile-session-1', './species-progression.js?v=wild-form-gates-1', './instance-storage.js?v=save-normalization-1', './evolution-gate.js?v=upgrade-result-1', './storage-sync.js?v=party-xp-merge-2', './profile-normalizer.js?v=profile-normalizer-1',
  './progression.js?v=progression-balance-1', './inventory.js?v=battle-item-turns-1', './capture-pressure.js?v=pressure-loop-3', './environment.js?v=signal-environments', './combat-effects.js?v=combat-motion-3', './move-info.js?v=long-press-info-3',
  './feedback.js?v=feedback-1', './capture-control.js?v=live-capture-2', './capture-coins.js?v=capture-balance-1', './encounter-code.js?v=code-identity-1', './stability-normalizer.js?v=stability-floor-1', './encounter-levels.js?v=admin-signal-level-1', './battle-levels.js?v=admin-signal-level-2', './battle-rewards.js?v=reward-xp-stages-1',
  './missions.js?v=profile-missions-1', './recovery.js?v=signal-reboot-3', './encounter.js?v=discovery-sprite-path-1', './dex-ui.js?v=collection-count-1', './dex-details.js?v=dex-records', './regions.js?v=region-level-gates-1', './region-encounters.js?v=pristine-grove-pool-1', './events.js?v=profile-events-1', './reward-history.js?v=reward-xp-stages-1', './world-map.js?v=region-level-gates-1', './discovery-codes.js?v=profile-discovery-codes-1', './starter.js?v=paint-gate', './slots-ui.js?v=instance-deploy-3', './switch-ui.js?v=switch-instance-4', './os-nav.js?v=items-popup', './save-tools.js?v=save-safety-1', './pwa.js?v=release-0.1.13', './main.js?v=party-recovery-sync-2'
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
