# Data Discovery Gameplay Ownership Audit

Status: active audit  
Phase: Gameplay Ownership Cleanup after Runtime Ownership Audit

## Purpose

This document maps every major gameplay responsibility in DataByteSprites: Data Discovery to a single active owner.

The goal is to prevent duplicate gameplay logic from stacking across legacy prototypes, Scanner OS rewrite files, compatibility layers, and the current Product App runtime.

## Current Rule

New gameplay logic belongs in the Product App chain unless this document explicitly promotes a clean standalone module.

```text
Studio data
  ↓
dd-studio-data-bridge.js
  ↓
dd-battle-engine-2-4.js + dd-battle-balance-2-4.js
  ↓
databyte-discovery-product-app.js
```

## Gameplay Responsibility Map

| Gameplay Area | Active Owner | Support Owner | Legacy / Duplicate Sources | Status |
| --- | --- | --- | --- | --- |
| Screen routing | `databyte-discovery-product-app.js` | `databyte-discovery.html` | `databyte-standalone-app.js`, old overlay scripts | Active owner established |
| Scanner input | `databyte-discovery-product-app.js` | `dd-canon-roster.js` | `databyte-discovery.js`, `databyte-standalone-app.js` | Active owner established |
| Encounter generation | `databyte-discovery-product-app.js` | `game-data.v1.json` encounter pools | `databyte-capture-pool.js`, `databyte-discovery.js`, `databyte-standalone-app.js` | Needs formula review |
| Rarity pools | `studio/databytesprites/game-data.v1.json` | `databyte-discovery-product-app.js` | `dd-canon-roster.js` rarity helper, legacy capture pool | In transition |
| Public roster | `dd-canon-roster.js` | `dd-studio-data-bridge.js` | hardcoded Dex lists, old species arrays | Active owner established |
| Studio species overlay | `dd-studio-data-bridge.js` | `species.json` | none active | Active owner established |
| Move assignment | `dd-studio-data-bridge.js` | `moves.json` | `databyte-move-bridge.js`, old battle files | Active owner established |
| Type effectiveness | `dd-battle-engine-2-4.js` | `type-chart.json`, `dd-studio-data-bridge.js` | `databyte-type-bridge.js` | Active owner established |
| Battle screen | `databyte-discovery-product-app.js` | `dd-battle-engine-2-4.js` | `dd-battle-os-v2.js`, `databyte-battle.js` | Active owner established |
| Turn order | `databyte-discovery-product-app.js` | `dd-battle-engine-2-4.js` | `dd-battle-os-v2.js` | Foundation active |
| Enemy AI | `dd-battle-engine-2-4.js` | `databyte-discovery-product-app.js` | `databyte-battle.js`, `dd-battle-os-v2.js` | Foundation active |
| Damage / signal math | `databyte-discovery-product-app.js` | `dd-battle-balance-2-4.js`, `dd-battle-engine-2-4.js` | `databyte-battle.js`, `dd-battle-os-v2.js`, legacy balance bridge | Needs consolidation |
| Capture odds | `dd-battle-balance-2-4.js` | `databyte-discovery-product-app.js` | `dd-canon-roster.js` chance helper, `databyte-balance-bridge.js`, legacy capture logic | Needs consolidation |
| Capture result | `databyte-discovery-product-app.js` | `dd-battle-engine-2-4.js` event hooks | `dd-battle-phase3c-guard.js`, `dd-battle-os-v2.js` | Active owner established; guard is retire candidate |
| Signal stability | `dd-battle-balance-2-4.js` | `databyte-discovery-product-app.js` | `dd-canon-roster.js` stability helper, legacy battle files | Needs consolidation |
| Status effects | `databyte-discovery-product-app.js` | `dd-battle-engine-2-4.js` | none active | Foundation active |
| Battle audio/animation hooks | `dd-battle-engine-2-4.js` | Product app emits events | older polish/guard layers | Active owner established |
| Party storage | `databyte-discovery-product-app.js` | localStorage keys | `databyte-party.js`, `databyte-admin-console.js` | Product app active; future clean module possible |
| Inventory storage | `databyte-discovery-product-app.js` | `game-data.v1.json` item definitions | `databyte-inventory.js`, `databyte-admin-console.js` | Product app active; future clean module possible |
| Dex seen/captured | `databyte-discovery-product-app.js` + `databytedex-shared-renderer.js` | localStorage keys, shared roster | `dd-dex-progress.js`, hardcoded Dex page | Active shared path established |
| Admin profile | `databyte-discovery-product-app.js` | localStorage profile key | `databyte-admin-console.js` | Product app active; future module possible |
| XP / rank | none active | future progression module | `databyte-discovery-progression.js` | Planned, not active |
| Journal | none active | future journal module | `databyte-discovery-journal.js` | Planned, not active |
| Missions | none active | future missions module | `databyte-missions.js` | Planned, not active |

## Current Duplicate Logic Risks

### 1. Capture odds

Risk:

- `dd-canon-roster.js` still exposes high prototype `chance` values.
- `databyte-discovery-product-app.js` still has local `cap`, `odds`, and `setOdds` functions.
- `dd-battle-balance-2-4.js` normalizes odds before app boot.
- Legacy bridge files may contain older balance formulas.

Decision:

`dd-battle-balance-2-4.js` owns baseline odds and caps. Product app may read and update `currentChance`, but should not define new rarity caps independently long term.

### 2. Signal stability

Risk:

- `dd-canon-roster.js` still exposes prototype stability values of 3 to 7.
- `dd-battle-balance-2-4.js` raises stability before product app boot.
- Product app creates encounters from the already-balanced roster but still has local fallback values.

Decision:

`dd-battle-balance-2-4.js` owns baseline stability. Product app owns live encounter stability changes during battle.

### 3. Damage and signal math

Risk:

- Product app calculates signal drop and HP damage.
- Battle engine helper calculates type results and enemy move selection.
- Legacy battle files may contain older formulas worth recovering.

Decision:

For now, product app owns live move resolution because it owns encounter state. Long term, move resolution should move into a clean battle resolver module.

### 4. Party and inventory

Risk:

- Product app currently owns localStorage party and items.
- Partial old files `databyte-party.js` and `databyte-inventory.js` still exist.

Decision:

Product app remains active owner until clean modules are created. Old partial modules are `retire-or-merge-candidate`.

### 5. Dex progress

Risk:

- Product app has an internal Dex panel.
- `databytedex-shared-renderer.js` owns the public Dex page.
- Old `dd-dex-progress.js` exists.

Decision:

Shared localStorage keys and `DD_CANON_ROSTER` are the source of truth. Old Dex progress file is legacy reference only.

## Immediate Fix Targets

1. Remove hardcoded rarity caps from product app or make them defer to `captureCap` from the balanced encounter.
2. Ensure product app honors `captureCap`, `captureChance`, `currentChance`, `stability`, and `maxStability` generated by the balance layer.
3. Add gameplay ownership records to source index or mechanics graph.
4. Mark `dd-battle-phase3c-guard.js`, `databyte-party.js`, and `databyte-inventory.js` as retire/merge candidates.
5. Compare legacy capture/signal formulas before making further gameplay tuning changes.

## Future Clean Module Targets

The Product App is currently allowed to own multiple gameplay systems because the architecture is still consolidating. After the audit, these can become clean modules:

- `dd-encounter-runtime.js`
- `dd-capture-runtime.js`
- `dd-battle-resolver.js`
- `dd-party-runtime.js`
- `dd-inventory-runtime.js`
- `dd-progress-runtime.js`

Each module should have one clear purpose and should be loaded through the runtime manifest.
