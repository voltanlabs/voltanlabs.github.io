# Studio ↔ Data Discovery Integration Roadmap

Status: active  
Current phase: Phase 3 Runtime Integration and Repository Stabilization

## Goal

Make VoltanLabs Studio the authoritative source for Data Discovery content, validation, diagnostics, balance testing, and future game-ready exports.

## Current Architecture

```text
Studio-authored data
  ↓
Game data manifest
  ↓
Studio data bridge
  ↓
Gameplay rules + runtime owners
  ↓
Product App v3
  ↓
Data Discovery + DataByteDex
```

## Active Runtime Owners

| Runtime Area | Owner | Status |
| --- | --- | --- |
| Studio manifest | `studio/databytesprites/game-data.v1.json` | Active foundation |
| Species data | `studio/databytesprites/species.json` | Active foundation |
| Move data | `studio/databytesprites/moves.json` | Active foundation |
| Type chart | `studio/databytesprites/type-chart.json` | Active foundation |
| Ability data | `studio/databytesprites/abilities.json` | Active foundation / future runtime |
| Studio bridge | `assets/js/dd-studio-data-bridge.js` | Active |
| Gameplay rules | `assets/js/dd-gameplay-rules-2-4.js` | Active foundation |
| Encounter runtime | `assets/js/dd-encounter-runtime.js` | Active Phase 3 owner |
| Capture runtime | `assets/js/dd-capture-runtime.js` | Active Phase 3 owner |
| Battle engine | `assets/js/dd-battle-engine-2-4.js` | Active foundation |
| Product UI | `assets/js/databyte-discovery-product-app-v3.js` | Active Phase 3 owner |
| Dex renderer | `assets/js/databytedex-shared-renderer.js` | Active foundation |

## Phase A — Shared Data Foundation

Status: complete foundation.

Completed:

- Single public roster bridge.
- Shared Studio species index.
- Shared move index.
- Shared type chart.
- Ability index foundation.
- Shared registry for moves, items, and encounters.
- Auto-validation of IDs and references through Diagnostics.
- DataByteDex and Data Discovery both consume shared runtime data.

## Phase B — Runtime Ownership Split

Status: active foundation.

Completed:

- Encounter Runtime created.
- Capture Runtime created.
- Gameplay Rules runtime created.
- Battle Engine helper runtime created.
- Product App v3 cutover created.
- Source ownership map updated for Phase 3.
- Mechanics graph updated for Phase 3.

Next:

- Split Party Runtime out of Product App v3.
- Split Item Runtime out of Product App v3.
- Add Progression Runtime.
- Add Mission Runtime.
- Add Journal Runtime.
- Add Ability Runtime.

## Phase C — Studio Export Pipeline

Status: planned foundation.

Goal:

Move from hand-maintained runtime files toward Studio-authored export manifests.

Planned outputs:

- `studio/exports/databytesprites/runtime.v1.json`
- `studio/exports/databytesprites/species-runtime.v1.json`
- `studio/exports/databytesprites/moves-runtime.v1.json`
- `studio/exports/databytesprites/encounters-runtime.v1.json`
- `studio/exports/databytesprites/items-runtime.v1.json`
- `studio/exports/databytesprites/balance-report.v1.json`

Required capabilities:

- Studio content editor generates sprite definitions.
- Automatic Dex generation.
- Automatic encounter tables.
- Automatic item tables.
- Automatic balancing reports.
- Runtime export manifest.
- Regression validation.
- Health checks.
- Build report generation.

## Phase D — Simulation Lab and Balance Testing

Status: planned.

Goal:

Let Studio test game rules before they reach the public game.

Planned simulation types:

- Capture-rate simulation.
- Encounter rarity simulation.
- Battle pacing simulation.
- Move power and accuracy simulation.
- Party survival simulation.
- Reward/progression simulation.

Example outputs:

- Average turns per battle.
- Capture success by rarity.
- Signal stability depletion rate.
- Enemy faint rate.
- Player faint rate.
- Recommended balance changes.

## Phase E — One-Click Game Export

Status: future milestone.

Goal:

Studio becomes capable of preparing a validated game-ready build.

Required final pieces:

- Complete runtime manifest export.
- Complete species/move/item/encounter export.
- Asset binding manifest.
- DataByteDex static data export.
- Regression validation.
- Diagnostics report export.
- Build report generation.
- One-click export into the playable game.

## Current Stabilization Work

Before expanding gameplay heavily, the repository needs to keep reducing diagnostics pressure:

1. Rerun Diagnostics after each stabilization pass.
2. Reduce orphan records.
3. Resolve dependency graph edges.
4. Keep README, PROJECT_STATE, ROADMAP, source ownership, mechanics graph, and runtime manifest synchronized.
5. Confirm Product App v3 loop works: Scanner → Encounter → Battle → Capture → Collection → DataByteDex.
6. Then continue runtime module splits and gameplay expansion.
