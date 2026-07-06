# Phase 3.6 Runtime Legacy Inventory

Status: active audit  
Phase: 3.6 Pass 2 — Legacy Code Audit

## Purpose

This inventory classifies Data Discovery runtime files by lifecycle status so future work does not accidentally treat legacy prototypes or compatibility layers as active gameplay owners.

Lifecycle labels:

- **ACTIVE** — currently used by the live runtime boot chain.
- **SUPPORTED** — active data, bridge, diagnostic, or compatibility support file.
- **LEGACY** — retained for reference or behavior recovery, not active ownership.
- **ARCHIVE** — historical record only.
- **REMOVE-CANDIDATE** — safe to consider deleting after a no-reference verification pass.

## Canonical Active Runtime

The live Data Discovery runtime is now Phase 3.5.

```text
databyte-discovery.html
├── dd-canon-roster.js
├── dd-studio-data-bridge.js
├── dd-battle-engine-2-4.js
├── dd-gameplay-rules-2-4.js
├── dd-capture-runtime.js
├── dd-encounter-runtime.js
├── dd-battle-balance-2-4.js
├── dd-battle-resolver.js
└── databyte-discovery-product-app-v3-5.js
```

## Runtime File Inventory

| File | Status | Replacement / Owner | Action |
| --- | --- | --- | --- |
| `databyte-discovery.html` | ACTIVE | Page boot owner | Keep active; only boot canonical runtime chain. |
| `assets/js/databyte-discovery-product-app-v3-5.js` | ACTIVE | Product App v3.5 | Canonical UI orchestrator. |
| `assets/js/dd-battle-resolver.js` | ACTIVE | Battle Resolver | Owns turn order, hit checks, damage math, enemy move choice, and capture pressure. |
| `assets/js/dd-capture-runtime.js` | ACTIVE | Capture Runtime | Owns odds, caps, attempts, failed-capture bonuses, and Signal Boost capture effects. |
| `assets/js/dd-encounter-runtime.js` | ACTIVE | Encounter Runtime | Owns encounter generation, rarity pools, and signal initialization. |
| `assets/js/dd-gameplay-rules-2-4.js` | ACTIVE | Gameplay Rules Runtime | Owns capture/stability/move tuning baselines. |
| `assets/js/dd-battle-engine-2-4.js` | ACTIVE | Battle Engine Hooks | Owns type helpers, battle event hooks, and helper utilities. |
| `assets/js/dd-battle-balance-2-4.js` | ACTIVE | Balance Layer | Normalizes roster and move values before Product App boot. |
| `assets/js/dd-studio-data-bridge.js` | ACTIVE | Studio Data Bridge | Loads manifest/species/moves/type chart into runtime. |
| `assets/js/dd-canon-roster.js` | ACTIVE | Canon Roster | Public 52-sprite roster bridge. |
| `assets/js/databytedex-shared-renderer.js` | ACTIVE | DataByteDex Renderer | Public Dex renderer that shares progress keys. |
| `assets/js/studio-runtime-bridge-checks.js` | SUPPORTED | Runtime health checks | Keep aligned to v3.5 verification targets. |
| `assets/js/dd-health-signal-bridge.js` | SUPPORTED | Compatibility visuals | Keep visual-only; must not own HP, Signal, odds, or battle state. |
| `assets/js/dd-scan-bg.js` | SUPPORTED | Background effects | Keep visual-only. |

## Product App Version History

| File | Status | Replacement | Action |
| --- | --- | --- | --- |
| `assets/js/databyte-discovery-product-app-v3-4.js` | LEGACY | `databyte-discovery-product-app-v3-5.js` | Retain temporarily for comparison of HP/Signal ring migration. |
| `assets/js/databyte-discovery-product-app-v3-3.js` | LEGACY | `databyte-discovery-product-app-v3-5.js` | Retain temporarily for signal-rule comparison. |
| `assets/js/databyte-discovery-product-app-v3-2.js` | LEGACY | `databyte-discovery-product-app-v3-5.js` | Retain temporarily for battle-resolver wiring comparison. |
| `assets/js/databyte-discovery-product-app-v3.js` | LEGACY | `databyte-discovery-product-app-v3-5.js` | Retain as Phase 3 initial cutover reference. |
| `assets/js/databyte-discovery-product-app.js` | LEGACY | `databyte-discovery-product-app-v3-5.js` | Retain as Phase 2 reference only. |

## Legacy / Compatibility Gameplay Files

| File | Status | Replacement / Owner | Action |
| --- | --- | --- | --- |
| `assets/js/databyte-standalone-app.js` | LEGACY | Product App v3.5 | Retain for behavior recovery only; not active. |
| `assets/js/dd-battle-os-v2.js` | LEGACY | `dd-battle-resolver.js` + Product App v3.5 | Retain for behavior recovery only; not active. |
| `assets/js/databyte-capture-pool.js` | LEGACY | `dd-encounter-runtime.js` | Retain until encounter formulas are compared and migrated. |
| `assets/js/databyte-balance-bridge.js` | LEGACY | `dd-gameplay-rules-2-4.js` | Retain until balance formulas are compared and migrated. |
| `assets/js/databyte-move-bridge.js` | LEGACY | `dd-studio-data-bridge.js` | Retain until move data coverage is verified. |
| `assets/js/databyte-type-bridge.js` | LEGACY | `dd-studio-data-bridge.js` + `dd-battle-engine-2-4.js` | Retain until type chart coverage is verified. |
| `assets/js/databyte-ability-bridge.js` | LEGACY | Future `dd-ability-runtime.js` | Retain as future ability reference. |
| `assets/js/databyte-party.js` | LEGACY | Future `dd-party-runtime.js` | Retain until party split pass. |
| `assets/js/databyte-inventory.js` | LEGACY | Future `dd-inventory-runtime.js` | Retain until item split pass. |
| `assets/js/dd-dex-progress.js` | LEGACY | Product App v3.5 + `databytedex-shared-renderer.js` | Retain until Dex progress verification. |
| `assets/js/dd-battle-phase3c-guard.js` | REMOVE-CANDIDATE | Product App v3.5 / resolver guards | Verify no references, then delete or archive. |

## Canonical Ownership Rules

- Product App v3.5 owns UI orchestration only.
- Product App v3.5 may apply runtime results to live local state.
- Battle Resolver owns turn order, hit checks, damage math, enemy move choice, and capture-pressure output.
- Capture Runtime owns capture odds, caps, attempts, failed-capture bonuses, and Signal Boost capture effects.
- Encounter Runtime owns encounter creation, rarity pools, and signal initialization.
- Gameplay Rules owns shared baselines.
- Signal is encounter stability and is never the wild sprite's HP.
- HP rings are the canonical battle health display for both lead and wild sprites.
- Horizontal HP bars are deprecated in the main mobile battle layout.

## Immediate Follow-up Checks

1. Search the repository for active references to older Product App versions.
2. Search for `signalDamage`, `stability`, `currentChance`, and `captureChance` outside active runtime owners.
3. Confirm no legacy file is loaded by `databyte-discovery.html`.
4. Update `studio/databytesprites/source-files.json` so v3.5 is the active Product App and older versions are legacy references.
5. Update diagnostics rules if they still expect the v3 or v3.4 Product App.
