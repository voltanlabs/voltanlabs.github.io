# Data Discovery Runtime Load Order

Status: active reference  
Phase: 6.0 progression, rewards, strategy, and save recovery
Authoritative browser loader: `databyte-discovery.html`  
Manifest mirror: `studio/runtime/load-order.json`

## Purpose

This document defines the required browser script order for DataByteSprites: Data Discovery and explains why each dependency must be available before the next owner boots.

The browser page loads one module entry point: `dd-app-bootstrap.js`. The
bootstrap loads one generated classic-script bundle so the 19 runtime modules do
not create a sequential network waterfall. `studio/tools/build-data-discovery-runtime.mjs`
builds that artifact from the bootstrap's ordered module registry. The
manifest's `entrypoint` and bundle must match the HTML/bootstrap, and its
`modules` list must match the bootstrap input list exactly.

## Active Phase Order

1. Canon roster and asynchronous Studio data bridge.
2. Status runtime, gameplay rules, capture, and encounter owners.
3. `dd-player-runtime.js`, the single player persistence owner.
4. `dd-battle-core-runtime.js`, the only active battle execution owner.
5. Battle reward runtime and reward presentation components.
6. Screen owners, battle controls, and `dd-screen-registry.js`.
7. `databyte-discovery-product-app-v4-shell.js`.
8. `dd-app-presentation-runtime.js` as the single app and battle presentation
   observer.

Studio bridge diagnostics are intentionally excluded from the production game
bootstrap. They remain available to Studio tooling without scheduling health
checks or persistence work inside the live battle page.

The App Shell depends on `DD_PLAYER_RUNTIME` and `DD_BATTLE_CORE_RUNTIME`.
The former battle engine, balance, resolver, state, and facade modules are not
active bundle inputs. Player compatibility globals remain aliases backed by one
storage implementation.

The reward runtime owns XP totals, level thresholds, Version Upgrade tiers,
deterministic drops, and persistent battle history. The player runtime owns the
rolling recovery backup and applies reward-driven sprite stat updates. The
result screen and reward presentation are read-only consumers of those results.

## Readiness Contract

`dd-app-bootstrap.js` owns asynchronous data readiness and declares
`runtime:ready`. It reports the exact failed import and only reports missing
owners after the bounded startup window. Rendering remains atomic: one context
produces both screen and controls markup before either host is updated.

## Validation

Run:

```powershell
node --test tests/data-discovery-runtime.test.mjs
```

After changing any bundle input, rebuild first:

```powershell
node studio/tools/build-data-discovery-runtime.mjs
```

Then compare the HTML module entry point and bootstrap import list with
`studio/runtime/load-order.json`, and exercise Scanner -> Encounter -> Battle ->
Download -> Collection/Dex.

The generated `assets/js/dd-runtime-bundle.js` is an active deployable artifact.
Do not edit it directly. Diagnostic prefix bundles are not deployable artifacts
and belong in `archive/databyte-discovery/recovery-diagnostics/`.
