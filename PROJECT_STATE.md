# VoltanLabs Project State

Status: active  
Current phase: Studio to Data Discovery Integration Phase A

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

VoltanLabs Studio is the internal workshop that supports product creation, validation, documentation, and future automation.

## Product Priority

The current flagship product is:

**DataByteSprites: Data Discovery**

The current development rule is:

> Studio work should directly support Data Discovery, DataByteDex, Creator Suite, or product publishing.

## Active Product Architecture

Data Discovery currently uses the new product container:

```text
#ddApp
```

The old scanner container was:

```text
#ddStandalone
```

The new product app replaced the old scanner container. Legacy features should be migrated into `#ddApp`, not patched back into `#ddStandalone`.

## Current Data Discovery Load Chain

```text
databyte-discovery.html
├── assets/js/dd-canon-roster.js
├── assets/js/dd-studio-data-bridge.js
├── assets/js/databyte-discovery-product-app.js
├── assets/js/dd-health-signal-bridge.js
└── assets/js/dd-scan-bg.js
```

## Current Game Flow

```text
Scanner
  ↓
Signal Encounter
  ↓
Start Battle
  ↓
Battle Sequence
  ↓
Capture Confirmation
  ↓
Battle Result
  ↓
Scanner
```

Supporting panels:

- DataByteDex panel
- Party panel
- Inventory panel
- Admin profile panel

## Current Data Sources

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

- Loads the Studio species index.
- Overlays matching Studio species data onto the playable roster.
- Exposes bridge status through `window.DD_STUDIO_DATA_BRIDGE`.
- Dispatches `dd:studio-data-ready` before the game app boots.

## What Studio Can Do Now

Studio currently provides:

- Knowledge Engine registry.
- Diagnostics source registry.
- Validation engine.
- Repository health dashboard.
- Repository Intelligence.
- Health History.
- Auto Repair planning.
- Dependency Graph Viewer.
- Coverage Heat Map.
- Repository Evolution Dashboard.
- Predictive Diagnostics foundation.
- Studio to game data bridge foundation.

## What Studio Cannot Do Yet

Studio does not yet automatically create complete playable game content.

It cannot yet automatically:

- Generate a complete new sprite line.
- Generate moves and abilities for a sprite.
- Export balanced encounter tables.
- Create final DataByteDex entries from Studio records.
- Attach final art assets.
- Run one-click build/export into the public game.

Those are future integration goals.

## Migration Status

| System | Status | Notes |
| --- | --- | --- |
| Scanner container | Migrated | New active container is `#ddApp`. |
| 52-sprite roster | Migrated | Public bridge lives in `dd-canon-roster.js`. |
| Studio species overlay | In progress | Initial bridge added in `dd-studio-data-bridge.js`. |
| Signal encounter | Migrated | Encounter is now a separate state before battle. |
| Battle sequence | In progress | Lead vs wild view exists; balance and moves still need work. |
| Health and signal bars | In progress | Lead health and enemy signal are visible and update through current battle logic. |
| Capture confirmation | Migrated | Capture now asks before spending a ByteCoin. |
| Capture result | Migrated | Success/failure result screen exists. |
| Party sync | In progress | Auto-fill exists; swapping and deeper management need expansion. |
| Inventory | Foundation | ByteCoins and Signal Boosts exist. |
| DataByteDex sync | In progress | Seen/captured local storage sync exists; DataByteDex should consume shared roster next. |
| Legacy visual effects | In progress | Some effects are compatibility-loaded; best effects should be ported natively into `#ddApp`. |
| Studio automation | Planned | Studio does not yet auto-assemble full game content. |

## Known Issues

- The playable game still has duplicated concepts between the public roster and Studio species index.
- DataByteDex still needs to consume the shared roster bridge.
- Battle needs real move lists, turn structure, damage rules, and enemy behaviors.
- Captured sprite health persistence needs a future healing/recovery mechanic.
- Several legacy scripts still exist as compatibility layers and need audit.
- Studio diagnostics need continued updates as new game bridge files are added.

## Immediate Priorities

1. Finish the Studio to Data Discovery data connection.
2. Make DataByteDex consume the shared roster bridge.
3. Expand the Studio species index or generate a full game-data manifest.
4. Build a real battle engine with moves and turn rules.
5. Continue migrating legacy effects into the new product app.
6. Keep Diagnostics updated so the health checker tracks new bridge and product files.

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

The long-term goal is for new content to be created through Studio, validated automatically, and consumed directly by the public game.
