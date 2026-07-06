# Data Discovery Gameplay Ownership Audit

Status: active canon  
Phase: 3.5 Gameplay Canonicalization

## Purpose

This document maps every major gameplay responsibility in DataByteSprites: Data Discovery to a single active owner.

The goal is to prevent duplicate gameplay logic from stacking across legacy prototypes, Scanner OS rewrite files, compatibility layers, and the current Phase 3 Product App runtime.

## Current Canonical Rule

New gameplay logic belongs in a dedicated Phase 3 runtime owner whenever possible. Product App v3.5 owns UI orchestration and live screen state, but math and rules should defer to runtime owners.

```text
Studio data
  ↓
dd-studio-data-bridge.js
  ↓
dd-gameplay-rules-2-4.js
  ↓
dd-encounter-runtime.js + dd-capture-runtime.js + dd-battle-resolver.js
  ↓
databyte-discovery-product-app-v3-5.js
```

## Phase 3.5 Gameplay Canon

### HP

HP is creature health.

- Player sprite HP determines whether the lead sprite can keep fighting.
- Wild sprite HP determines whether the wild sprite has been defeated or weakened.
- Both player and wild HP are displayed as circular HP rings around their sprite icons.
- Horizontal HP bars are deprecated and should not be used in the main mobile battle layout.

### Signal

Signal is encounter stability, not creature health.

- Signal belongs to the encounter, not to either creature.
- Signal should not be used as the wild sprite's HP.
- Failed capture attempts reduce Signal.
- Player sprite fainting reduces Signal.
- Leaving or returning from an active encounter reduces Signal.
- Signal reaching 0 means the wild encounter disappears from scanner range.
- Defeating the wild sprite stabilizes or increases Signal because the encounter becomes easier to contain.

### Capture Pressure

Capture Pressure is the short-term capture advantage created by battle actions.

- Attacks raise capture pressure / capture window.
- Defeating the wild sprite improves capture odds and stabilizes Signal.
- Signal Boost improves the capture window.
- Capture odds must respect capture caps from the Capture Runtime and Gameplay Rules.

### UI Canon

The canonical mobile battle UI is:

```text
Lead HP ring        Wild HP ring
      VS
Signal meter
Capture window
Battle log
Move / capture / item controls
```

Rules:

- HP rings replace horizontal HP bars.
- Wild sprite ring must represent HP, not Signal.
- Signal must be displayed separately as encounter stability.
- Fighter text should be short and spaced enough to avoid overlapping on mobile.
- Product App owns rendering; runtime modules own rules.

## Gameplay Responsibility Map

| Gameplay Area | Active Owner | Support Owner | Legacy / Duplicate Sources | Status |
| --- | --- | --- | --- | --- |
| Screen routing | `databyte-discovery-product-app-v3-5.js` | `databyte-discovery.html` | `databyte-standalone-app.js`, old overlay scripts | Active owner established |
| Scanner input | `databyte-discovery-product-app-v3-5.js` | `dd-canon-roster.js`, `dd-encounter-runtime.js` | `databyte-discovery.js`, `databyte-standalone-app.js` | Active owner established |
| Encounter generation | `dd-encounter-runtime.js` | `game-data.v1.json` encounter pools | `databyte-capture-pool.js`, `databyte-discovery.js`, `databyte-standalone-app.js` | Active owner established |
| Rarity pools | `studio/databytesprites/game-data.v1.json` | `dd-encounter-runtime.js` | legacy capture pool | Active foundation |
| Public roster | `dd-canon-roster.js` | `dd-studio-data-bridge.js` | hardcoded Dex lists, old species arrays | Active owner established |
| Studio species overlay | `dd-studio-data-bridge.js` | `species.json` | none active | Active owner established |
| Move assignment | `dd-studio-data-bridge.js` | `moves.json` | `databyte-move-bridge.js`, old battle files | Active owner established |
| Type effectiveness | `dd-battle-engine-2-4.js` | `type-chart.json`, `dd-studio-data-bridge.js` | `databyte-type-bridge.js` | Active owner established |
| Battle screen | `databyte-discovery-product-app-v3-5.js` | `dd-battle-resolver.js` | `dd-battle-os-v2.js`, `databyte-battle.js` | Active owner established |
| Turn order | `dd-battle-resolver.js` | `databyte-discovery-product-app-v3-5.js` | `dd-battle-os-v2.js` | Active owner established |
| Enemy AI | `dd-battle-resolver.js` | `dd-battle-engine-2-4.js` | `databyte-battle.js`, `dd-battle-os-v2.js` | Active owner established |
| Damage math | `dd-battle-resolver.js` | `dd-battle-engine-2-4.js` | `databyte-battle.js`, `dd-battle-os-v2.js`, legacy balance bridge | Active owner established |
| Capture odds | `dd-capture-runtime.js` | `dd-gameplay-rules-2-4.js` | old chance helpers | Active owner established |
| Capture result | `databyte-discovery-product-app-v3-5.js` | `dd-capture-runtime.js` | `dd-battle-phase3c-guard.js`, `dd-battle-os-v2.js` | Active owner established |
| Signal stability | `dd-encounter-runtime.js` baseline + Product App live encounter state | `dd-gameplay-rules-2-4.js` | old signal-as-HP battle logic | Canon corrected |
| HP rings / battle UI | `databyte-discovery-product-app-v3-5.js` | CSS inside Product App v3.5 | v3.4 horizontal bars | Canon corrected |
| Status effects | future status runtime | `dd-battle-resolver.js` | none active | Planned |
| Battle audio/animation hooks | `dd-battle-engine-2-4.js` | Product App emits events | older polish/guard layers | Active foundation |
| Party storage | `databyte-discovery-product-app-v3-5.js` | localStorage keys | `databyte-party.js`, `databyte-admin-console.js` | Product app active; future clean module possible |
| Inventory storage | `databyte-discovery-product-app-v3-5.js` | `game-data.v1.json` item definitions | `databyte-inventory.js`, `databyte-admin-console.js` | Product app active; future clean module possible |
| Dex seen/captured | `databyte-discovery-product-app-v3-5.js` + `databytedex-shared-renderer.js` | localStorage keys, shared roster | `dd-dex-progress.js`, hardcoded Dex page | Active shared path established |
| Admin profile | `databyte-discovery-product-app-v3-5.js` | localStorage profile key | `databyte-admin-console.js` | Product app active; future module possible |
| XP / rank | none active | future progression module | `databyte-discovery-progression.js` | Planned, not active |
| Journal | none active | future journal module | `databyte-discovery-journal.js` | Planned, not active |
| Missions | none active | future missions module | `databyte-missions.js` | Planned, not active |

## Current Duplicate Logic Risks

### 1. Capture odds

Risk:

- Older roster records still expose prototype `chance` values.
- Product App updates live `currentChance` during battle.
- Capture Runtime and Gameplay Rules own caps and baselines.

Decision:

`dd-capture-runtime.js` owns capture odds, capture caps, capture attempts, failed-capture bonuses, and Signal Boost capture effects. Product App may display and request changes through this runtime.

### 2. Signal stability

Risk:

- Legacy builds treated Signal like enemy HP.
- Some UI builds displayed Signal around the wild sprite ring.

Decision:

Signal is encounter stability. It is displayed separately from HP. Wild sprite rings must display HP only.

### 3. Damage and battle math

Risk:

- Product App can accidentally reintroduce local damage formulas.

Decision:

`dd-battle-resolver.js` owns turn order, hit checks, damage math, enemy move choice, and capture-pressure output. Product App applies the resolver output to live state and renders it.

### 4. Party and inventory

Risk:

- Product App currently owns localStorage party and items.
- Partial old files `databyte-party.js` and `databyte-inventory.js` still exist.

Decision:

Product App remains active owner until clean modules are created. Old partial modules are `retire-or-merge-candidate`.

### 5. Dex progress

Risk:

- Product App has an internal Dex panel.
- `databytedex-shared-renderer.js` owns the public Dex page.
- Old `dd-dex-progress.js` exists.

Decision:

Shared localStorage keys and `DD_CANON_ROSTER` are the source of truth. Old Dex progress file is legacy reference only.

## Immediate Fix Targets

1. Keep `databyte-discovery.html` booting `databyte-discovery-product-app-v3-5.js`.
2. Keep horizontal HP bars out of the main battle screen.
3. Keep both lead and wild sprite rings mapped to HP.
4. Keep Signal separate from HP in a dedicated meter.
5. Update source indexes and runtime manifests when Product App versions change.
6. Compare legacy capture/signal formulas before further tuning changes.

## Future Clean Module Targets

After Phase 3.5, these can become clean modules:

- `dd-party-runtime.js`
- `dd-inventory-runtime.js`
- `dd-progress-runtime.js`
- `dd-status-runtime.js`
- `dd-reward-runtime.js`

Each module should have one clear purpose and should be loaded through the runtime manifest.
