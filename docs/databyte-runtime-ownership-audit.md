# Data Discovery Runtime Ownership Audit

Status: active audit  
Phase: Runtime Ownership Cleanup after Phase 2.4

## Purpose

This document defines which files currently own each Data Discovery runtime responsibility.

The goal is to stop stacked systems from fighting each other. Every gameplay responsibility should have one active owner, with compatibility and legacy files clearly separated.

## Active Runtime Chain

The live Data Discovery product page is now owned by the Product App runtime chain:

```text
databyte-discovery.html
├── /assets/js/dd-canon-roster.js
├── /assets/js/dd-studio-data-bridge.js
├── /assets/js/dd-battle-engine-2-4.js
├── /assets/js/dd-battle-balance-2-4.js
├── /assets/js/databyte-discovery-product-app.js
├── /assets/js/dd-health-signal-bridge.js
└── /assets/js/dd-scan-bg.js
```

## Active Owners

| Responsibility | Active Owner | Notes |
| --- | --- | --- |
| Page boot | `databyte-discovery.html` | Loads the product runtime chain and cache-busts app scripts. |
| Public roster | `assets/js/dd-canon-roster.js` | Current 52-sprite roster bridge. |
| Studio data merge | `assets/js/dd-studio-data-bridge.js` | Loads game-data manifest, species, moves, and type chart. |
| Battle helper hooks | `assets/js/dd-battle-engine-2-4.js` | Type utilities, enemy move choice, battle events, audio/animation hooks, recovery helper. |
| Battle balance | `assets/js/dd-battle-balance-2-4.js` | Normalizes capture odds, signal stability, move power, accuracy, and caps. |
| Product app screens | `assets/js/databyte-discovery-product-app.js` | Owns scanner, encounter, battle, capture, party, inventory, Dex, and Admin panels. |
| Shared Dex page | `assets/js/databytedex-shared-renderer.js` | DataByteDex consumes the shared runtime roster. |
| Runtime manifest | `studio/runtime/load-order.json` | Documents the current Product App runtime chain. |
| Game data manifest | `studio/databytesprites/game-data.v1.json` | Shared game-data source registry for Studio/game bridge. |

## Compatibility Layers

These files are still allowed to load, but they should not own gameplay rules:

| File | Role | Retirement Condition |
| --- | --- | --- |
| `assets/js/dd-health-signal-bridge.js` | Compatibility display layer for health/signal telemetry. | Retire after telemetry is fully native in `databyte-discovery-product-app.js`. |
| `assets/js/dd-scan-bg.js` | Background/effects layer. | Keep if visual-only; retire if it mutates scanner state. |
| `assets/js/studio-runtime-bridge-checks.js` | Runtime health checks. | Must validate Product App globals, not old Scanner OS globals. |
| `assets/js/studio-runtime-health.js` | Floating runtime health panel. | Keep as diagnostics-only. |

## Legacy References

These files may be used for behavior recovery, but should not be loaded as active product runtime owners:

| File | Legacy Role | Replacement |
| --- | --- | --- |
| `assets/js/databyte-discovery.js` | Original discovery reference. | `databyte-discovery-product-app.js` + `dd-studio-data-bridge.js`. |
| `assets/js/databyte-battle.js` | Original battle reference. | `databyte-discovery-product-app.js` + `dd-battle-engine-2-4.js`. |
| `assets/js/databyte-standalone-app.js` | Scanner OS generation active owner. | `databyte-discovery-product-app.js`. |
| `assets/js/dd-battle-os-v2.js` | Scanner OS battle rebuild owner. | `databyte-discovery-product-app.js` + `dd-battle-engine-2-4.js`. |
| `assets/js/dd-battle-phase3c-guard.js` | Old result/guard patch layer. | Native result handling in `databyte-discovery-product-app.js`. |
| `assets/js/dd-dex-progress.js` | Scanner OS Dex/progress owner. | `databytedex-shared-renderer.js` and product app Dex panel. |
| `assets/js/databyte-discovery-journal.js` | Legacy journal. | Future native journal module. |
| `assets/js/databyte-discovery-progression.js` | Legacy XP/rank. | Future native progression module. |
| `assets/js/databyte-missions.js` | Legacy missions. | Future native mission module. |
| `assets/js/databyte-admin-console.js` | Legacy admin mega-panel. | Product app Admin panel plus future native admin modules. |
| `assets/js/databyte-party.js` | Partial party module. | Native party state in product app until split into a clean module. |
| `assets/js/databyte-inventory.js` | Partial inventory module. | Native inventory state in product app until split into a clean module. |

## Duplicate Logic Hotspots

These are the systems most likely to have duplicated or stacked implementations:

1. Encounter generation and rarity pools.
2. Capture odds and capture caps.
3. Signal stability and signal depletion.
4. Battle turns and attack resolution.
5. Move loading and move assignment.
6. Type effectiveness.
7. Party storage and lead sprite selection.
8. Inventory storage and item effects.
9. Dex seen/captured progress.
10. Result screens and post-battle recovery.

## Runtime Ownership Rules

1. New gameplay logic goes into the Product App chain, not the old Scanner OS chain.
2. Studio data should flow through the Studio data bridge or game-data manifest.
3. Compatibility layers may render UI or effects, but should not mutate game state unless explicitly documented.
4. Legacy references should not be loaded by `databyte-discovery.html`.
5. Diagnostics should validate active Product App globals, not retired Scanner OS globals.
6. When a compatibility layer becomes unnecessary, mark it as `retire-candidate` before deletion.

## Immediate Audit Fixes

- Update `studio/databytesprites/source-files.json` so Product App files are active owners.
- Update `assets/js/studio-runtime-bridge-checks.js` so health checks validate `DD_*` and `DDBattle24` globals instead of old `DBS_*` globals.
- Continue comparing legacy signal/capture behavior against the current balance layer before tuning more numbers.
