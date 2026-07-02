# DataByteSprites Manifest v1

Purpose: classify the current DataByteSprites codebase before any structural refactor.

## Active Core
- databyte-discovery.js
- databyte-battle.js
- databyte-party.js
- databyte-inventory.js
- databyte-missions.js
- databyte-discovery-journal.js
- databyte-discovery-progression.js
- databyte-scanner-workspace.js
- databyte-scanner-effects.js
- databyte-signal-stage.js
- databytedex-action-router.js
- dd-root.js

## Patch / Stabilization Layer
- databyte-click-fix.js
- databyte-idle-restore.js
- databyte-status-cleanup-v2.js
- dd-nav-cleanup.js
- databyte-container-refine.js
- databyte-version-sync.js
- databyte-copy-loader.js
- databyte-auto-start.js
- databyte-panel-state.js
- databyte-status-center.js
- databyte-signal-collapse.js

## Duplicate / Review Required
- databyte-battle-copy.js
- databyte-party-copy.js
- databyte-app-shell-v2.js
- databyte-admin-console-simple.js
- databyte-admin-tabs-stable.js

## Legacy / Investigation
- dd-battle-legacy-features.js
- dd-battle-legacy-stats.js

## Rules
1. No duplicate files become the new source of truth.
2. Patch-layer files should be merged into core modules over time.
3. Every retirement requires testing before deletion.
4. Each module should eventually own one responsibility.

## Next milestone
Replace patch layering with modular feature folders while preserving existing gameplay and scanner behavior.