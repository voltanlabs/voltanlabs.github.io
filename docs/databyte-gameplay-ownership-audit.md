# Data Discovery Gameplay Ownership Audit

Status: active canon  
Phase: 4.3 Ownership Correction

## Purpose

This document maps every major gameplay and UI responsibility in DataByteSprites: Data Discovery to a single active owner.

The goal is to prevent duplicate gameplay logic, layout rules, animation effects, state transitions, and compatibility patches from stacking across legacy prototypes, Scanner OS rewrite files, compatibility layers, and the current Product App runtime.

## Current Canonical Rule

New logic belongs in a dedicated runtime or screen owner whenever possible. Product App v3.5 remains the temporary coordinator and bootstrapping shell, but it should no longer be treated as the long-term owner for every screen, panel, control group, visual effect, or state rule.

```text
Studio data
  ↓
dd-studio-data-bridge.js
  ↓
dd-gameplay-rules-2-4.js
  ↓
dd-encounter-runtime.js + dd-capture-runtime.js + dd-battle-resolver.js + dd-battle-state-runtime.js
  ↓
Screen modules / Product App transition shell
  ↓
Presentation runtime for non-layout effects only
```

## Ownership Vocabulary

| Term | Meaning |
| --- | --- |
| Owner | The only module allowed to define or mutate that responsibility. |
| Runtime | Owns rules, state, math, data mutation, or persistent system behavior. |
| Screen Renderer | Owns HTML/layout for one screen or panel. |
| Controls Renderer | Owns buttons and input wiring for one screen or mode. |
| Presentation | Owns visual feedback only. It must not change layout, state, or rules. |
| Compatibility | Temporary bridge. It must be visual-only or adapter-only. |
| Legacy Reference | Retained for comparison only. It must not be loaded by the live app. |
| Split Required | Active today, but too broad and scheduled for extraction. |

## Phase 4.3 Canon

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
- Failed download attempts reduce Signal.
- Player sprite fainting reduces Signal.
- Leaving or returning from an active encounter reduces Signal.
- Signal reaching 0 means the wild encounter disappears from scanner range.
- Defeating the wild sprite stabilizes or increases Signal because the encounter becomes easier to contain.

### Download Pressure

Download Pressure is the short-term download advantage created by battle actions.

- Attacks raise download pressure / download window.
- Defeating the wild sprite improves download odds and stabilizes Signal.
- Download odds must respect caps from the Capture Runtime and Gameplay Rules.
- Signal Boost is removed from the current battle UI and should not return until items are designed as a real system.

### UI Canon

The target mobile battle UI is:

```text
Lead HP ring        Wild HP ring
      VS
Transient battle toast, only when an event happens
Signal meter
Download window
Move / Download / Items / Switch / Return controls
```

Rules:

- HP rings replace horizontal HP bars.
- Wild sprite ring must represent HP, not Signal.
- Signal must be displayed separately as encounter stability.
- Fighter text should be short and spaced enough to avoid overlapping on mobile.
- Battle screen layout should eventually be owned by `dd-battle-screen.js`.
- Battle controls should eventually be owned by `dd-battle-controls.js`.
- Presentation modules may highlight or float messages, but must not shake, resize, or move `.battle-card`, `.stage`, `.battleGrid`, `.card`, or `#ddApp`.

## Gameplay Responsibility Map

| Gameplay Area | Active Owner | Support Owner | Legacy / Duplicate Sources | Status |
| --- | --- | --- | --- | --- |
| Page boot | `databyte-discovery.html` | runtime ready events | old direct app boot paths | Active owner |
| Screen routing | `databyte-discovery-product-app-v3-5.js` | future `dd-app-shell.js` | `databyte-standalone-app.js`, old overlay scripts | Split required |
| Scanner input | `databyte-discovery-product-app-v3-5.js` | `dd-encounter-runtime.js` | `databyte-discovery.js`, `databyte-standalone-app.js` | Split required into `dd-scanner-screen.js` |
| Scanner shell layout | `dd-scanner-os-runtime.js` | `dd-layout-viewport-lock-4-2.js` | Product App CSS patches | Active but narrow owner |
| Scanner background visuals | `dd-scan-bg.js` | none | old scanner background scripts | Compatibility, visual-only |
| Encounter generation | `dd-encounter-runtime.js` | `game-data.v1.json` encounter pools | `databyte-capture-pool.js`, `databyte-discovery.js`, `databyte-standalone-app.js` | Active owner |
| Rarity pools | `studio/databytesprites/game-data.v1.json` | `dd-encounter-runtime.js` | legacy capture pool | Active owner |
| Public roster | `dd-canon-roster.js` | `dd-studio-data-bridge.js` | hardcoded Dex lists, old species arrays | Active owner |
| Studio species overlay | `dd-studio-data-bridge.js` | `species.json` | none active | Active owner |
| Move assignment | `dd-studio-data-bridge.js` | `moves.json` | `databyte-move-bridge.js`, old battle files | Active owner |
| Type effectiveness | `dd-battle-engine-2-4.js` | `type-chart.json`, `dd-studio-data-bridge.js` | `databyte-type-bridge.js` | Active owner |
| Battle screen layout | `databyte-discovery-product-app-v3-5.js` | future `dd-battle-screen.js` | `dd-scanner-os-runtime.js` patches, `dd-battle-os-v2.js`, `databyte-battle.js` | Split required |
| Battle controls | `databyte-discovery-product-app-v3-5.js` | future `dd-battle-controls.js` | old Boost/Repair controls, battle patches | Split required |
| Battle toast/log | `dd-scanner-os-runtime.js` transition patch | future `dd-battle-screen.js` + presentation runtime | Product App battle log, presentation float text | Split required |
| Turn order | `dd-battle-resolver.js` | none | `dd-battle-os-v2.js` | Active owner |
| Enemy AI | `dd-battle-resolver.js` | `dd-battle-engine-2-4.js` utilities | `databyte-battle.js`, `dd-battle-os-v2.js` | Active owner |
| Damage math | `dd-battle-resolver.js` | `dd-gameplay-rules-2-4.js` | `databyte-battle.js`, `dd-battle-os-v2.js`, legacy balance bridge | Active owner |
| Battle terminal state | `dd-battle-state-runtime.js` | Product App applies returned state | Product App local battle flags | Active owner, Product App split pressure |
| Capture odds | `dd-capture-runtime.js` | `dd-gameplay-rules-2-4.js` | old chance helpers | Active owner |
| Download result | `dd-capture-runtime.js` owns attempt math; Product App owns result screen transition | future `dd-result-screen.js` | `dd-battle-phase3c-guard.js`, `dd-battle-os-v2.js` | Split required |
| Signal stability | `dd-encounter-runtime.js` baseline + Product App live encounter state | `dd-gameplay-rules-2-4.js` | old signal-as-HP battle logic | Canon corrected; future state extraction needed |
| HP rings | `databyte-discovery-product-app-v3-5.js` transition renderer | future `dd-battle-screen.js` | Product App CSS, Scanner OS overrides | Split required |
| Battle effects | `dd-battle-presentation-runtime.js` | `dd-battle-experience-4-2.js` if visual-only | Product App `.fx-*` CSS, Scanner OS overrides | Conflict found; consolidate |
| Battle experience polish | `dd-battle-experience-4-2.js` | presentation events | Product App effect CSS | Compatibility / merge candidate |
| Health and Signal telemetry | `dd-health-signal-bridge.js` | Product App DOM | none | Compatibility, visual-only |
| Party storage | `dd-party-runtime.js` | Product App fallback localStorage | `databyte-party.js`, Product App fallback | Active runtime, fallback should shrink |
| Party switching | `dd-party-switch-runtime.js` | `dd-party-switch-ui.js`, `dd-party-switch-battle-bridge.js` | active sprite HUD chip from refresh layer | Active but tighten UI ownership |
| Inventory storage | `dd-inventory-runtime.js` | Product App fallback localStorage | `databyte-inventory.js`, Product App fallback | Active runtime, fallback should shrink |
| Dex seen/captured | `dd-dex-runtime.js` + `databytedex-shared-renderer.js` | `DD_CANON_ROSTER`, shared storage keys | `dd-dex-progress.js`, hardcoded Dex page | Active shared path |
| Admin profile | `databyte-discovery-product-app-v3-5.js` | future `dd-admin-screen.js` | `databyte-admin-console.js` | Split required |
| XP / rank | none active | future progression module | `databyte-discovery-progression.js` | Planned, not active |
| Journal | none active | future journal module | `databyte-discovery-journal.js` | Planned, not active |
| Missions | none active | future missions module | `databyte-missions.js` | Planned, not active |

## Current Duplicate Logic Risks

### 1. Product App owns too much

Risk:

- Product App v3.5 currently handles shell boot, screen routing, live state application, battle layout, battle controls, battle log, CSS, party panel, inventory panel, Dex panel, Admin panel, result screen, and some effect classes.

Decision:

Product App v3.5 is now classified as `active-shell / split-required`. It can remain the live coordinator while screen modules are extracted one at a time.

### 2. Battle layout ownership overlap

Risk:

- Product App renders battle layout.
- Scanner OS runtime patches battle layout.
- Presentation and experience modules have touched hit effects.

Decision:

The target owner is `dd-battle-screen.js`. Until that exists, Product App remains the renderer and Scanner OS runtime is allowed only temporary stabilization patches.

### 3. Battle animation ownership overlap

Risk:

- Product App `.fx-hit` rules have shaken `.battle-card`.
- `dd-battle-presentation-runtime.js` previously shook `.battle-card`.
- `dd-battle-experience-4-2.js` adds ring and float effects.

Decision:

Only `dd-battle-presentation-runtime.js` should own battle effects. Effects must target sprites, rings, popups, or overlays only. They must not animate layout containers.

### 4. Capture odds

Risk:

- Older roster records still expose prototype `chance` values.
- Product App updates live `currentChance` during battle.
- Capture Runtime and Gameplay Rules own caps and baselines.

Decision:

`dd-capture-runtime.js` owns capture odds, capture caps, attempts, failed-download bonuses, and future item-based download effects. Product App may display and request changes through this runtime.

### 5. Signal stability

Risk:

- Legacy builds treated Signal like enemy HP.
- Some UI builds displayed Signal around the wild sprite ring.

Decision:

Signal is encounter stability. It is displayed separately from HP. Wild sprite rings must display HP only.

### 6. Damage and battle math

Risk:

- Product App can accidentally reintroduce local damage formulas.

Decision:

`dd-battle-resolver.js` owns turn order, hit checks, damage math, enemy move choice, and download-pressure output. Product App applies the resolver output to live state and renders it.

### 7. Party, inventory, and Dex panels

Risk:

- Product App still renders these panels directly.
- Dedicated runtimes now exist for storage/data behavior.

Decision:

Storage/data behavior belongs to `dd-party-runtime.js`, `dd-inventory-runtime.js`, and `dd-dex-runtime.js`. Panel layout should eventually move to screen modules.

## Immediate Architecture Targets

1. Keep `databyte-discovery.html` booting the current runtime chain until each extracted screen is tested.
2. Create `dd-battle-screen.js` as the first screen extraction target.
3. Create `dd-battle-controls.js` after battle screen rendering is stable.
4. Remove battle layout patches from `dd-scanner-os-runtime.js` after `dd-battle-screen.js` owns layout.
5. Remove Product App `.fx-*` layout animations after presentation ownership is clean.
6. Keep horizontal HP bars out of the main battle screen.
7. Keep both lead and wild sprite rings mapped to HP.
8. Keep Signal separate from HP in a dedicated meter.
9. Update source indexes and runtime manifests when owner roles change.
10. Teach Studio diagnostics to flag compatibility layers that mutate state or layout.

## Future Clean Module Targets

- `dd-app-shell.js`
- `dd-scanner-screen.js`
- `dd-battle-screen.js`
- `dd-battle-controls.js`
- `dd-party-screen.js`
- `dd-inventory-screen.js`
- `dd-dex-screen.js`
- `dd-admin-screen.js`
- `dd-result-screen.js`
- `dd-progress-runtime.js`
- `dd-status-runtime.js`
- `dd-reward-runtime.js`

Each module should have one clear purpose and should be loaded through the runtime manifest.
