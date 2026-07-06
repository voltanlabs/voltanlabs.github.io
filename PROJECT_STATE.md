# VoltanLabs Project State

Status: active  
Current phase: Phase 3 Runtime Integration and Repository Stabilization

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

> Studio work should directly support Data Discovery, DataByteDex, Creator Suite, diagnostics, or product publishing.

## Current Architecture Decision

Data Discovery is now in a Phase 3 split-runtime architecture.

The Product App is no longer supposed to own every gameplay rule directly. It should orchestrate the UI and call dedicated runtime owners.

```text
Studio Data
  ↓
Studio Data Bridge
  ↓
Gameplay Rules
  ↓
Encounter Runtime + Capture Runtime + Battle Engine
  ↓
Product App v3
  ↓
Player UI
```

The legacy Scanner OS and Phase 2 Product App files are retained as references only. New gameplay work should target the Phase 3 runtime chain.

## Active Product Architecture

Active live app container:

```text
#ddApp
```

Former legacy scanner container:

```text
#ddStandalone
```

The live product app is now:

```text
assets/js/databyte-discovery-product-app-v3.js
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
├── assets/js/databyte-discovery-product-app-v3.js
├── assets/js/dd-health-signal-bridge.js
└── assets/js/dd-scan-bg.js
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
| Encounter generation | `dd-encounter-runtime.js` | Active Phase 3 owner |
| Capture rules | `dd-capture-runtime.js` | Active Phase 3 owner |
| Battle helpers | `dd-battle-engine-2-4.js` | Active foundation |
| Balance normalization | `dd-battle-balance-2-4.js` | Active foundation |
| Product UI orchestration | `databyte-discovery-product-app-v3.js` | Active Phase 3 owner |
| DataByteDex renderer | `databytedex-shared-renderer.js` | Active |
| Health/signal visual bridge | `dd-health-signal-bridge.js` | Compatibility |
| Scanner background visuals | `dd-scan-bg.js` | Compatibility |

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
Battle Engine helpers + Product App v3 battle UI
  ↓
Capture Runtime resolves capture attempt
  ↓
Battle / Capture Result
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

## Current Data Sources

### Shared Game Data Manifest

File:

- `studio/databytesprites/game-data.v1.json`

Purpose:

- Describes the shared game-data pipeline.
- Registers runtime scripts, Studio sources, merge rules, item definitions, encounter pools, validation targets, and Phase 3 runtime ownership.
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

## What Studio Cannot Do Yet

Studio does not yet automatically create complete playable game content.

It cannot yet automatically:

- Generate a complete new sprite line.
- Generate moves and abilities for a sprite.
- Export balanced encounter tables into final runtime logic.
- Attach final art assets.
- Run one-click build/export into the public game.
- Run full battle/capture simulations from a Studio UI.

Those are future integration goals.

## Migration Status

| System | Status | Notes |
| --- | --- | --- |
| Scanner container | Migrated | New active container is `#ddApp`. |
| 52-sprite roster | Migrated | Public bridge lives in `dd-canon-roster.js`. |
| Shared game-data manifest | Active Phase 3 foundation | `game-data.v1.json` now has root IDs, runtime sources, items, encounter pools, validation targets, and next systems. |
| Studio species overlay | Active foundation | Bridge loads manifest sources and overlays Studio species data onto the runtime roster. |
| DataByteDex shared renderer | Migrated foundation | Dex consumes `DD_CANON_ROSTER` through the shared renderer. |
| Signal encounter | Phase 3 runtime owner active | `dd-encounter-runtime.js` owns encounter generation and signal initialization. |
| Capture flow | Phase 3 runtime owner active | `dd-capture-runtime.js` owns odds, caps, attempts, and failed-capture bonuses. |
| Gameplay rules | Active foundation | `dd-gameplay-rules-2-4.js` owns capture/stability/move tuning baselines. |
| Battle sequence | Active foundation | `dd-battle-engine-2-4.js` provides type helpers, enemy move choice, and event hooks. |
| Product App | Phase 3 active | `databyte-discovery-product-app-v3.js` is the active UI orchestrator. |
| Health and signal bars | Active foundation | Product App v3 and compatibility bridge display battle telemetry. |
| Capture confirmation | Migrated | Capture asks before spending a ByteCoin. |
| Capture result | Migrated | Success/failure result screen exists. |
| Party sync | Active foundation | Auto-fill exists; future clean Party Runtime should split this out of Product App v3. |
| Inventory | Active foundation | Product App v3 currently owns item state; future Item Runtime should split this out. |
| Encounter pools | Active foundation | Manifest defines common, rare, epic, and deep signal pools. |
| Legacy visual effects | Compatibility | Effects should stay visual-only or be ported natively. |
| Studio automation | Planned | Studio does not yet auto-assemble full game content. |

## Known Issues

- Repository health is improving but still reports orphan records and unresolved dependency graph edges.
- Documentation drift should continue shrinking after README, PROJECT_STATE, ROADMAP, and Studio integration roadmap updates.
- Some legacy scripts still exist as behavior references and need a safe retirement audit.
- Party and inventory are still inside Product App v3 and should become clean runtime modules later.
- Battle is functional but still foundation-level; it needs deeper move resolver, status system, healing balance, reward rules, and enemy behavior.
- Studio diagnostics need continued alignment with Phase 3 runtime ownership.

## Immediate Priorities

1. Reduce orphan records in Knowledge Engine and mechanics graph outputs.
2. Resolve dependency graph edges now that Phase 3 runtime owners are registered.
3. Keep README, PROJECT_STATE, ROADMAP, and Studio integration roadmap synchronized.
4. Rerun diagnostics after each stabilization pass.
5. Split Party Runtime and Item Runtime out of Product App v3 after repository health stabilizes.
6. Add Studio balance simulator and export pipeline after runtime ownership is stable.

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
