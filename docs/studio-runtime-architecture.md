# VoltanLabs Studio Runtime Architecture

This document tracks the current browser runtime architecture for VoltanLabs Studio and DataByteSprites: Data Discovery.

## Current Runtime Strategy

The current strategy is additive and repository-first:

1. Keep the working Scanner OS intact.
2. Add small bridge scripts that consume offline JSON indexes.
3. Prove each system through the browser runtime before consolidating.
4. Register data sources in the Knowledge Engine so they are searchable from Studio.
5. Avoid replacing stable gameplay all at once.

## Data Discovery Boot Order

`databyte-discovery.html` currently loads these scripts in order:

1. `/assets/js/databyte-capture-pool.js`
2. `/assets/js/databyte-balance-bridge.js`
3. `/assets/js/databyte-move-bridge.js`
4. `/assets/js/databyte-type-bridge.js`
5. `/assets/js/databyte-ability-bridge.js`
6. `/assets/js/databyte-standalone-app.js`
7. `/assets/js/dd-scan-bg.js`

This order matters because each bridge contributes runtime data or UI enhancements that the later scanner screens can expose.

## Runtime Bridges

### Capture Pool Bridge

File:

- `/assets/js/databyte-capture-pool.js`

Data source:

- `/studio/databytesprites/species.json`

Purpose:

- Loads indexed sprite species.
- Maps discovery codes to species records.
- Adds species metadata to the current scanner encounter.
- Preserves seen progress in local storage.

### Battle Balance Bridge

File:

- `/assets/js/databyte-balance-bridge.js`

Data source:

- Current encounter data seeded by the capture pool.
- Species battle stat fields from `/studio/databytesprites/species.json`.

Purpose:

- Displays expanded stats: HP, ATK, DEF, SPD, SPC, and Power.
- Provides tiered balancing without replacing the core battle engine.

### Move Runtime Bridge

File:

- `/assets/js/databyte-move-bridge.js`

Data source:

- `/studio/databytesprites/moves.json`

Purpose:

- Loads move definitions.
- Finds moves for the current species.
- Renders clickable move buttons.
- Uses the current Attack action as a fallback resolver.

### Type Effectiveness Bridge

File:

- `/assets/js/databyte-type-bridge.js`

Data source:

- `/studio/databytesprites/type-chart.json`

Purpose:

- Evaluates move elements against species elements.
- Annotates move buttons with type effectiveness.
- Applies capture bonuses when possible.
- Adds type-effectiveness notes to the battle log.

### Ability Runtime Bridge

File:

- `/assets/js/databyte-ability-bridge.js`

Data source:

- `/studio/databytesprites/abilities.json`

Purpose:

- Loads passive ability definitions.
- Finds abilities for the current species.
- Displays passive ability cards.
- Applies small stat and capture modifiers.

## Knowledge Engine Runtime Inputs

The runtime bridge stack depends on these registered Knowledge Engine data files:

- `/studio/databytesprites/species.json`
- `/studio/databytesprites/moves.json`
- `/studio/databytesprites/type-chart.json`
- `/studio/databytesprites/abilities.json`
- `/studio/databytesprites/lore.json`
- `/studio/databytesprites/mechanics-graph.json`

The global registry is:

- `/studio/knowledge/index.json`

The search adapter is:

- `/assets/asset-search.js`

## Current Limitation

The runtime currently relies on script tag order in `databyte-discovery.html`.

That is acceptable for the current bridge phase, but it will become fragile as more systems are added.

## Next Architecture Target: Runtime Load-Order Manager

The next runtime architecture phase should introduce:

- `/studio/runtime/load-order.json`
- `/assets/js/studio-runtime-loader.js`

The loader should define and enforce boot phases such as:

1. `studio:boot`
2. `knowledge:indexes-ready`
3. `databytesprites:data-ready`
4. `scanner:bridges-ready`
5. `scanner:ready`
6. `battle:ready`

## Proposed Load-Order Manifest

The manifest should declare:

- Runtime module ID
- Script path
- Data dependencies
- Event dependencies
- Events emitted
- Optional/required status
- Failure behavior

Example shape:

```json
{
  "id": "databyte-capture-pool",
  "script": "/assets/js/databyte-capture-pool.js",
  "requires": ["species-index"],
  "emits": ["databytesprites:capture-pool-ready"],
  "required": true
}
```

## Consolidation Plan

Once the loader exists, the current bridge scripts can be consolidated into cleaner modules:

- Data source loader
- Encounter generator
- Battle stat resolver
- Move resolver
- Type resolver
- Ability resolver
- UI renderer
- Persistence layer

The scanner should eventually stop depending on hidden page-flow behavior and become a true app runtime with explicit systems and lifecycle events.

## Rule for Future Runtime Work

Every runtime feature should answer:

- What data index powers it?
- What script owns it?
- What lifecycle event starts it?
- What event proves it is ready?
- What does it depend on?
- What happens if the dependency fails?

If those answers are missing, add documentation or an index before expanding the feature.
