# Phase 3.6 Runtime Variable Ownership Search

Status: active audit note  
Phase: 3.6 Pass 2C

## Purpose

This note records where important Data Discovery gameplay variables appear so future work can keep runtime ownership clear.

Searched terms:

- `signalDamage`
- `currentChance`
- `captureChance`
- `stability`

## Canonical Ownership

| Concept | Canonical Owner |
| --- | --- |
| Battle damage and capture pressure | `assets/js/dd-battle-resolver.js` |
| Capture odds and caps | `assets/js/dd-capture-runtime.js` and `assets/js/dd-gameplay-rules-2-4.js` |
| Encounter signal baseline | `assets/js/dd-encounter-runtime.js` |
| Live UI application and display | `assets/js/databyte-discovery-product-app-v3-5.js` |
| Visual compatibility display | `assets/js/dd-health-signal-bridge.js` |

## Search Findings

### `signalDamage`

Expected active reference:

- `assets/js/dd-battle-resolver.js`

Historical references:

- `assets/js/databyte-discovery-product-app-v3-2.js`
- `assets/js/databyte-discovery-product-app-v3-3.js`
- `docs/runtime-legacy-inventory.md`

### `currentChance`

Expected active references:

- `assets/js/dd-capture-runtime.js`
- `assets/js/dd-encounter-runtime.js`
- `assets/js/dd-gameplay-rules-2-4.js`
- `assets/js/dd-battle-balance-2-4.js`

Additional historical/prototype references found:

- `assets/js/dd-root.js`
- `assets/js/databyte-auto-start.js`
- `assets/js/databyte-discovery.js`
- `assets/js/databyte-rare-spawn.js`
- `assets/js/dd-battle-legacy-stats.js`
- `assets/js/databyte-capture-loop-copy.js`
- `assets/js/dd-battle-legacy-features.js`
- `assets/js/databyte-discovery-product-app-v3-2.js`
- `assets/js/databyte-discovery-product-app-v3-3.js`

### `captureChance`

Expected active references:

- `assets/js/dd-capture-runtime.js`
- `assets/js/dd-gameplay-rules-2-4.js`
- `assets/js/dd-battle-balance-2-4.js`
- `assets/js/dd-encounter-runtime.js`

Additional historical/prototype references found:

- `assets/js/dd-root.js`
- `assets/js/databyte-auto-start.js`
- `assets/js/databyte-capture-loop-copy.js`
- `assets/js/databyte-rare-spawn.js`
- `assets/js/databyte-discovery.js`
- `assets/js/databyte-battle-copy.js`

### `stability`

Expected active references:

- `assets/js/dd-encounter-runtime.js`
- `assets/js/dd-gameplay-rules-2-4.js`
- `assets/js/dd-battle-balance-2-4.js`
- `assets/js/dd-health-signal-bridge.js`

Additional historical/prototype references found:

- `assets/js/dd-root.js`
- `assets/js/databyte-battle.js`
- `assets/js/databyte-discovery.js`
- `assets/js/databyte-rare-spawn.js`
- `assets/js/databyte-auto-start.js`
- `databyte-discovery-v2.html`
- `assets/js/databyte-signal-stage.js`
- `assets/js/dd-battle-legacy-features.js`
- `assets/js/databyte-capture-loop-copy.js`

## Audit Result

The current search pass supports the Phase 3.5 ownership model: active runtime ownership is concentrated in the split runtimes and Product App v3.5. Several older prototype files still contain the same variable names, so indexes and diagnostics should continue marking those files as historical references rather than active owners.

## Next Pass

Register this note in the Knowledge Engine and source-file index, then run Diagnostics to compare health and coverage after the Phase 3.6 audit updates.
