# VoltanLabs Project State

Status: active  
Current phase: Data Discovery Phase 4.3 Canonical Scanner OS Runtime

## Purpose

This document is the current living state of VoltanLabs. It explains what exists, what is active, what is being migrated, and what the next development priorities are.

## Current Direction

VoltanLabs has three connected layers:

```text
Public Website
  ↓
Products and Tools
  ↓
VoltanLabs Studio
```

The public website is the front door.

The products are what visitors play and use.

VoltanLabs Studio is the internal workshop that supports product creation, validation, documentation, runtime ownership, and future automation.

## Product Priority

The current flagship product is:

**DataByteSprites: Data Discovery**

The current development rule is:

> Studio work should directly support Data Discovery, DataByteDex, Creator Suite, diagnostics, runtime ownership, or product publishing.

## Current Architecture Decision

Data Discovery has moved beyond the Phase 3 split-runtime foundation and the early Phase 4 compatibility-stack phase.

The active direction is now a canonical Scanner OS runtime model.

```text
Studio Data
  ↓
Studio Data Bridge
  ↓
Gameplay Rules + Encounter Runtime + Capture Runtime + Battle Resolver
  ↓
Product App v3.5
  ↓
Canonical Scanner OS Runtime
  ├── Viewport and shell layout
  ├── Mobile spacing and action tray sizing
  ├── Battle centerline layout
  ├── Navigation sizing
  └── Compatibility wrappers during validation
  ↓
Player UI
```

The immediate direction is to turn Data Discovery into one stable mobile Scanner OS shell where Scan, Encounter, Battle, Download, Dex, Party, Items, and Admin views all operate inside the same app frame instead of rebuilding the whole screen differently.

## Active Product Architecture

Active live app container:

```text
#ddApp
```

Former legacy scanner container:

```text
#ddStandalone
```

The active product app is:

```text
assets/js/databyte-discovery-product-app-v3-5.js
```

The current canonical Scanner OS layout owner is:

```text
assets/js/dd-scanner-os-runtime.js
```

The current Phase 4 loader and diagnostics chain is tracked by:

```text
studio/runtime/load-order.json
studio/diagnostics/sources.json
docs/datadiscovery-phase-4-bookkeeping.md
```

## Current Data Discovery Load Chain

```text
databyte-discovery.html
├── assets/js/dd-canon-roster.js
├── assets/js/dd-studio-data-bridge.js
├── assets/js/dd-battle-engine-2-4.js
├── assets/js/dd-gameplay-rules-2-4.js
├── assets/js/dd-capture-runtime.js
├── assets/js/dd-encounter-runtime.js
├── assets/js/dd-battle-balance-2-4.js
├── assets/js/dd-battle-resolver.js
├── assets/js/dd-battle-state-runtime.js
├── assets/js/dd-battle-presentation-runtime.js
├── assets/js/dd-collection-runtime.js
├── assets/js/dd-party-runtime.js
├── assets/js/dd-party-switch-runtime.js
├── assets/js/dd-inventory-runtime.js
├── assets/js/dd-dex-runtime.js
├── assets/js/dd-collection-dex-runtime-bridge.js
├── assets/js/databyte-discovery-product-app-v3-5.js
├── assets/js/dd-health-signal-bridge.js
└── assets/js/dd-scan-bg.js
    ├── assets/js/dd-scanner-os-runtime.js
    ├── assets/js/dd-mobile-game-tray-4-2.js
    ├── assets/js/dd-unified-scanner-shell-4-3-once.js
    └── assets/js/dd-battle-centerline-fix-4-3.js
```

## Current DataByteDex Load Chain

```text
databytedex.html
├── assets/js/dd-canon-roster.js
├── assets/js/dd-studio-data-bridge.js
└── assets/js/databytedex-shared-renderer.js
```

## Current Runtime Owners

| Runtime Area | Active Owner | Status |
| --- | --- | --- |
| Page boot | `databyte-discovery.html` | Active |
| Public roster | `dd-canon-roster.js` | Active |
| Studio data overlay | `dd-studio-data-bridge.js` | Active |
| Gameplay rules | `dd-gameplay-rules-2-4.js` | Active foundation |
| Encounter generation | `dd-encounter-runtime.js` | Active owner |
| Capture rules | `dd-capture-runtime.js` | Active owner |
| Battle helpers | `dd-battle-engine-2-4.js` | Active foundation |
| Battle resolver | `dd-battle-resolver.js` | Active owner |
| Battle state | `dd-battle-state-runtime.js` | Active foundation |
| Battle presentation | `dd-battle-presentation-runtime.js` | Active foundation |
| Collection | `dd-collection-runtime.js` | Active foundation |
| Party | `dd-party-runtime.js` | Active foundation |
| Party switching | `dd-party-switch-runtime.js` | Active Phase 4.1 owner |
| Party switch UI | `dd-party-switch-ui.js` | Compatibility UI |
| Party switch battle bridge | `dd-party-switch-battle-bridge.js` | Compatibility bridge |
| Party switch HUD refresh | `dd-party-switch-refresh.js` | Compatibility UI |
| Inventory | `dd-inventory-runtime.js` | Active foundation |
| Dex runtime | `dd-dex-runtime.js` | Active foundation |
| Product UI orchestration | `databyte-discovery-product-app-v3-5.js` | Active UI owner |
| Scanner OS layout | `dd-scanner-os-runtime.js` | Active canonical owner |
| Battle experience polish | `dd-battle-experience-4-2.js` | Compatibility |
| Viewport lock / mobile layout | `dd-layout-viewport-lock-4-2.js` | Compatibility |
| Mobile action tray | `dd-mobile-game-tray-4-2.js` | Compatibility wrapper |
| Unified Scanner Shell | `dd-unified-scanner-shell-4-3-once.js` | Compatibility wrapper |
| Battle centerline correction | `dd-battle-centerline-fix-4-3.js` | Compatibility wrapper |
| DataByteDex renderer | `databytedex-shared-renderer.js` | Active |
| Health/signal visual bridge | `dd-health-signal-bridge.js` | Compatibility |
| Scanner loader/background visuals | `dd-scan-bg.js` | Active bootstrap and background owner |

## Current Game Flow

```text
Scanner
  ↓
Encounter Runtime creates signal
  ↓
Signal Encounter
  ↓
Start Battle
  ↓
Battle Resolver + Product App v3.5 battle UI
  ↓
Scanner OS Runtime owns fixed shell layout
  ↓
Party Switch Runtime, Capture Runtime, and Battle Presentation hooks
  ↓
Battle / Download Result
  ↓
Collection, Party, DataByteDex progress
  ↓
Scanner
```

Supporting panels:

- DataByteDex panel
- Party panel
- Inventory panel
- Admin profile panel
- Phase 4 Switch overlay

## Current Data Sources

### Shared Game Data Manifest

File:

- `studio/databytesprites/game-data.v1.json`

Purpose:

- Describes the shared game-data pipeline.
- Registers runtime scripts, Studio sources, merge rules, item definitions, encounter pools, validation targets, and runtime ownership.
- Provides the current bridge between Studio data and public game runtime data.

### Public Game Roster

File:

- `assets/js/dd-canon-roster.js`

Purpose:

- Provides the 52-sprite public playable roster bridge.

### Studio Species Index

File:

- `studio/databytesprites/species.json`

Purpose:

- Studio-side species metadata, lore, battle stats, discovery information, capture notes, asset references, and dependencies.

### Studio Data Bridge

File:

- `assets/js/dd-studio-data-bridge.js`

Purpose:

- Loads the shared game-data manifest.
- Loads Studio species, move, and type-chart indexes from the manifest.
- Overlays matching Studio species data onto the playable roster.
- Exposes bridge status through `window.DD_STUDIO_DATA_BRIDGE`.
- Exposes manifest data through `window.DD_GAME_DATA_MANIFEST`.
- Dispatches `dd:studio-data-ready` before product renderers boot.

### Canonical Scanner OS Runtime

File:

- `assets/js/dd-scanner-os-runtime.js`

Purpose:

- Owns fixed Scanner OS viewport behavior.
- Owns shared shell layout, mobile spacing, action tray sizing, navigation sizing, and battle centerline geometry.
- Emits `dd:scanner-os-runtime-ready` for runtime tracking.
- Allows older Phase 4 layout modules to remain as temporary compatibility wrappers while the canonical runtime is validated.

## What Studio Can Do Now

Studio currently provides:

- Knowledge Engine registry.
- Diagnostics source registry.
- Validation engine.
- Repository health dashboard.
- Repository Intelligence.
- Health History.
- Auto Repair planning.
- Dependency Explorer.
- Dependency Graph Viewer.
- Coverage Heat Map.
- Repository Evolution Dashboard.
- Predictive Diagnostics foundation.
- Studio-to-game data bridge foundation.
- Shared game-data manifest foundation.
- DataByteDex shared renderer foundation.
- Runtime ownership audit.
- Gameplay ownership audit.
- Phase 3 source ownership map.
- Phase 3 mechanics graph.
- Phase 4 runtime/load-order tracking.
- Phase 4 diagnostics tracking for party switch, battle experience, canonical Scanner OS runtime, compatibility wrappers, and bridge modules.

## What Studio Cannot Do Yet

Studio does not yet automatically create complete playable game content.

It cannot yet automatically:

- Generate a complete new sprite line.
- Generate moves and abilities for a sprite.
- Export balanced encounter tables into final runtime logic.
- Attach final art assets.
- Run one-click build/export into the public game.
- Run full battle/capture simulations from a Studio UI.
- Retire legacy visual modules without a developer audit.

Those are future integration goals.

## Migration Status

| System | Status | Notes |
| --- | --- | --- |
| Scanner container | Migrated | New active container is `#ddApp`. |
| 52-sprite roster | Migrated | Public bridge lives in `dd-canon-roster.js`. |
| Shared game-data manifest | Active foundation | `game-data.v1.json` has root IDs, runtime sources, items, encounter pools, validation targets, and next systems. |
| Studio species overlay | Active foundation | Bridge loads manifest sources and overlays Studio species data onto the runtime roster. |
| DataByteDex shared renderer | Migrated foundation | Dex consumes `DD_CANON_ROSTER` through the shared renderer. |
| Signal encounter | Runtime owner active | `dd-encounter-runtime.js` owns encounter generation and signal initialization. |
| Capture flow | Runtime owner active | `dd-capture-runtime.js` owns odds, caps, attempts, and failed-capture bonuses. |
| Gameplay rules | Active foundation | `dd-gameplay-rules-2-4.js` owns capture/stability/move tuning baselines. |
| Battle sequence | Active foundation | Battle engine + resolver provide current battle behavior. |
| Party switching | Phase 4.1 active | Dedicated runtime, UI, battle bridge, and refresh modules exist. |
| Scanner OS Runtime | Active canonical owner | `dd-scanner-os-runtime.js` now owns shared layout, mobile spacing, and battle centerline rules. |
| Product App | Active | `databyte-discovery-product-app-v3-5.js` is the active UI orchestrator. |
| Health and signal bars | Active foundation | Product App and compatibility layers display battle telemetry. |
| Download confirmation/result | Migrated | Download terminology replaced capture in player-facing battle UI. |
| Party sync | Active foundation | Party Runtime exists; future cleanup should make it primary for all party state. |
| Inventory | Active foundation | Inventory Runtime exists but needs deeper item behavior integration. |
| Encounter pools | Active foundation | Manifest defines common, rare, epic, and deep signal pools. |
| Legacy visual effects | Compatibility | Effects should stay visual-only or be ported natively. |
| Studio automation | Planned | Studio does not yet auto-assemble full game content. |

## Known Issues

- The Product App still owns too much rendering logic.
- Scan, Encounter, and Battle still have separate internal render paths even though the Scanner OS runtime now owns the fixed shell layout.
- Long sprite names still need an auto-fit strategy instead of ellipsis-only truncation.
- Some legacy scripts still exist as behavior references and need a safe retirement audit.
- Battle needs deeper move resolver, status system, healing balance, reward rules, enemy behavior, and animation ownership.
- Knowledge Engine and mechanics graph records may still need Phase 4.3 Scanner OS ownership records.
- Compatibility wrappers should be retired only after mobile validation confirms the canonical runtime is stable.

## Immediate Priorities

1. Verify the canonical Scanner OS runtime on mobile after cache refresh.
2. Retire compatibility wrappers only after validation.
3. Update Knowledge Engine and mechanics graph records for Scanner OS runtime ownership.
4. Keep README, PROJECT_STATE, ROADMAP, runtime manifest, diagnostics sources, and Studio integration roadmap synchronized.
5. Rerun diagnostics after each stabilization pass.
6. Split remaining party and item behavior out of Product App v3.5.
7. Add Studio balance simulator and export pipeline after runtime ownership is stable.

## Long-Term Vision

The target workflow is:

```text
Studio creates or edits content
  ↓
Studio validates IDs, references, balance, and assets
  ↓
Studio exports game-ready data
  ↓
Data Discovery consumes the exported data
  ↓
DataByteDex renders the same data
```

The long-term goal is for new content to be created through Studio, validated automatically, balanced through Simulation Lab, and consumed directly by the public game.
