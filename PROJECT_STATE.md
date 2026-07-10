# VoltanLabs Project State

Status: active  
Current phase: Data Discovery Phase 4.4.3 Modular Vertical Slice + Studio Intelligence Foundation

## Purpose

This document is the living state of VoltanLabs. It records the active product architecture, current owners, working gameplay loop, known gaps, Studio support, and immediate priorities.

Older Phase 2-era technical references are consolidated into:

```text
docs/studio-reference.md
```

## Current Direction

VoltanLabs has three connected layers:

```text
Public Website
  ↓
Products and Tools
  ↓
VoltanLabs Studio
```

The public website is the front door. Products are what visitors play and use. VoltanLabs Studio is the internal workshop for content, validation, documentation, diagnostics, runtime ownership, Studio Intelligence, and future publishing automation.

The current flagship product is:

**DataByteSprites: Data Discovery**

The development rule is:

> Studio work should directly support Data Discovery, DataByteDex, Creator Suite, diagnostics, runtime ownership, Studio Intelligence, or product publishing.

## Current Architecture Decision

Data Discovery now uses a modular v4 App Shell architecture.

```text
Studio Data
  ↓
Studio Data Bridge
  ↓
Gameplay Rules + Encounter + Capture + Battle Runtimes
  ↓
Dedicated Screen and Control Owners
  ↓
DD_PRODUCT_APP_V4_SHELL v4.4.3
  ↓
Compatibility Adapters and Visual-Only Helpers
  ↓
Player UI
```

The v4 App Shell owns:

- App lifecycle.
- Route state.
- Screen registry.
- Context building.
- Runtime coordination.
- Action dispatch.
- Header and bottom navigation.

Dedicated screen modules own extracted presentation. The shell must not receive new layout or polish work for screens that already have canonical owners.

## Active Source-of-Truth Documents

| Document | Role |
| --- | --- |
| `README.md` | Public overview and handoff. |
| `PROJECT_STATE.md` | Living internal state. |
| `ROADMAP.md` | Short active roadmap. |
| `docs/data-discovery-ownership-map.md` | Canonical ownership registry. |
| `docs/databyte-gameplay-ownership-audit.md` | Current implementation and gap audit. |
| `docs/studio-reference.md` | Consolidated Studio reference. |
| `studio/runtime/load-order.json` | Machine-readable runtime and ownership manifest. |
| `studio/diagnostics/sources.json` | Diagnostics source registry. |
| `studio/knowledge/index.v2.json` | Knowledge Engine registry. |
| `studio/intelligence/core.manifest.json` | Studio Intelligence manifest. |

## Active Product Architecture

Active app container:

```text
#ddApp
```

Active App Shell:

```text
assets/js/databyte-discovery-product-app-v4-shell.js
```

Current shell version:

```text
4.4.3
```

The former v3.5 Product App is now a legacy transition reference and is not the active shell.

## Dedicated Presentation Owners

| Screen / Controls | Active Owner |
| --- | --- |
| Scanner | `assets/js/dd-scanner-screen.js` |
| Encounter | `assets/js/dd-encounter-screen.js` |
| Battle | `assets/js/dd-battle-screen.js` |
| Battle controls | `assets/js/dd-battle-controls.js` |
| Download confirmation | `assets/js/dd-confirm-screen.js` |
| Download result | `assets/js/dd-result-screen.js` |

The shell may retain minimal missing-module diagnostics for these screens, but those fallbacks are not presentation owners.

## Temporary Screen Owners

These views still use v4 shell fallback presentation:

- Party.
- Items.
- Dex.
- Admin.

Planned dedicated owners:

```text
DD_PARTY_SCREEN
DD_ITEMS_SCREEN
DD_DEX_SCREEN
DD_ADMIN_SCREEN
```

## Current Data Discovery Load Chain

```text
databyte-discovery.html
├── dd-canon-roster.js
├── dd-studio-data-bridge.js
├── dd-battle-engine-2-4.js
├── dd-gameplay-rules-2-4.js
├── dd-capture-runtime.js
├── dd-encounter-runtime.js
├── dd-battle-balance-2-4.js
├── dd-battle-resolver.js
├── dd-battle-state-runtime.js
├── dd-battle-presentation-runtime.js
├── dd-collection-runtime.js
├── dd-party-runtime.js
├── dd-party-switch-runtime.js
├── dd-inventory-runtime.js
├── dd-dex-runtime.js
├── dd-collection-dex-runtime-bridge.js
├── dd-layout-viewport-lock-4-2.js
├── dd-scanner-screen.js
├── dd-encounter-screen.js
├── dd-battle-screen.js
├── dd-battle-controls.js
├── dd-confirm-screen.js
├── dd-result-screen.js
├── databyte-discovery-product-app-v4-shell.js
├── dd-scanner-behavior-4-3.js
├── dd-party-switch-battle-bridge.js
├── dd-party-switch-ui.js
├── dd-party-switch-refresh.js
├── dd-battle-experience-4-2.js
├── dd-health-signal-bridge.js
└── dd-scan-bg.js
    └── dd-scanner-os-runtime.js
```

## Current Runtime Owners

| Runtime Area | Active Owner | Status |
| --- | --- | --- |
| Page boot | `databyte-discovery.html` | Active |
| Public roster | `dd-canon-roster.js` | Active |
| Studio data overlay | `dd-studio-data-bridge.js` | Active |
| Gameplay rules | `dd-gameplay-rules-2-4.js` | Active foundation |
| Encounter generation | `dd-encounter-runtime.js` | Active owner |
| Download rules and attempts | `dd-capture-runtime.js` | Active owner |
| Battle helper bus | `dd-battle-engine-2-4.js` | Active foundation |
| Battle balance | `dd-battle-balance-2-4.js` | Active |
| Damage, accuracy, turn order, enemy move choice | `dd-battle-resolver.js` | Active owner |
| Battle terminal state | `dd-battle-state-runtime.js` | Active owner |
| Non-layout battle effects | `dd-battle-presentation-runtime.js` | Active owner |
| Collection | `dd-collection-runtime.js` | Active owner |
| Party | `dd-party-runtime.js` | Active owner |
| Party switching | `dd-party-switch-runtime.js` | Active owner |
| Inventory | `dd-inventory-runtime.js` | Active foundation |
| Dex state | `dd-dex-runtime.js` | Active foundation |
| App orchestration | `databyte-discovery-product-app-v4-shell.js` | Active shell |

## Current Playable Loop

```text
Scanner
  ↓
Encounter
  ↓
Battle
  ├── Moves
  ├── Items panel
  ├── Party switch overlay
  └── Download attempt
        ↓
Download confirmation
        ↓
Result
  ├── Success → Collection / Party → Scanner
  ├── Recoverable failure → Continue Battle
  └── Signal loss → Scanner
```

Verified working:

- Discovery-code and random-code encounter generation.
- Dedicated Scanner, Encounter, Battle, Confirm, and Result screens.
- Battle damage, accuracy, turn order, and enemy move selection.
- Separate creature HP and encounter Signal.
- Download odds, caps, ByteCoin use, success, failure, and Signal loss.
- Collection persistence.
- Party auto-fill.
- Battle party switching.
- Returning from battle Items to the active battle.
- Recoverable download failure through the Result screen.
- Terminal result return to Scanner.
- Seen/downloaded Dex state tracking.

## Partial Systems

### Party

Implemented:

- Party persistence.
- Auto-fill.
- Active-party index.
- Battle switch overlay.
- Fainted-member blocking.

Still partial:

- No dedicated Party Screen owner.
- No polished reorder or lead-selection UI outside battle.
- No sprite detail, status, equipment, or move management.
- Party-switch UI remains a compatibility overlay.

### Inventory and Items

Implemented:

- Inventory persistence.
- ByteCoin count and spending.
- Items panel route returns to battle when opened during battle.

Still partial:

- No dedicated Items Screen owner.
- No usable battle-item catalog.
- No item targeting or turn-consumption rules.
- No healing, buffs, cures, crafting, shops, or loot source.

### Dex

Implemented:

- Seen/downloaded tracking.
- Shared roster and external DataByteDex renderer foundation.

Still partial:

- No dedicated in-game Dex Screen owner.
- No entry details, filtering, habitat, moves, evolution, or capture history.

### Admin and Profile

Implemented:

- Basic stored profile.
- Basic fallback panel.

Still partial:

- No dedicated Admin Screen owner.
- No settings, save management, statistics, credits, or debug controls.
- The development label `v4 App Shell` is still visible in the live header.

### Battle Completion

Implemented:

- Wild defeat.
- Active-sprite faint support.
- Recoverable download failure.
- Signal collapse.
- Party-switch-required events.

Still partial:

- No complete party-wipe recovery flow.
- No formal victory reward pipeline.
- No battle reward table.
- No strategic enemy AI profiles.
- No dedicated battle summary separate from download results.

## Systems Not Added Yet

- XP, levels, stat growth, and rank progression.
- Move-learning progression.
- Evolution or upgrade paths.
- Rewards and loot.
- Status effects.
- Abilities and passives.
- Critical-hit and advanced battle rules.
- Biomes and scanner regions.
- Missions, quests, and journal.
- Daily or weekly encounters.
- Bosses, raids, or multi-enemy battles.
- Shops and a broader economy.
- Sound, music, haptics, and accessibility settings.
- Versioned save migration.
- Save export/import.
- Offline/PWA packaging validation.
- Studio-free production export verification.

## Compatibility Layers Still Loaded

| File | Current Role |
| --- | --- |
| `dd-party-switch-ui.js` | Working battle switch overlay; not yet final owner. |
| `dd-party-switch-battle-bridge.js` | Faint/wipe event adapter. |
| `dd-party-switch-refresh.js` | Party HUD refresh helper. |
| `dd-battle-experience-4-2.js` | Visual polish merge candidate. |
| `dd-layout-viewport-lock-4-2.js` | Mobile viewport guard. |
| `dd-scanner-behavior-4-3.js` | Compatibility behavior guard. |
| `dd-scanner-os-runtime.js` | Outer shell stabilizer with narrow ownership. |
| `dd-health-signal-bridge.js` | Visual telemetry helper. |
| `dd-scan-bg.js` | Scanner background/bootstrap; visual-only target. |

These files should be merged or retired only after equivalent canonical behavior is verified.

## Retired From Active Layout Loading

These files remain as references but are no longer active layout owners:

```text
assets/js/dd-mobile-game-tray-4-2.js
assets/js/dd-unified-scanner-shell-4-3.js
assets/js/dd-unified-scanner-shell-4-3-once.js
assets/js/dd-battle-centerline-fix-4-3.js
```

## Current DataByteDex Load Chain

```text
databytedex.html
├── assets/js/dd-canon-roster.js
├── assets/js/dd-studio-data-bridge.js
└── assets/js/databytedex-shared-renderer.js
```

## Studio Intelligence Direction

Studio Intelligence remains an active foundation layer.

Primary manifest:

```text
studio/intelligence/core.manifest.json
```

Current model:

```text
Diagnostics Sources + Validation Rules + Runtime Manifest + Knowledge Indexes
  ↓
Validation Engine
  ↓
Shared Validation Report
  ↓
Studio Intelligence Modules
  ↓
Studio Intelligence Manager
  ↓
Master Report Bridge and Export
```

Active capabilities include:

- Validation Engine.
- Diagnostics source registry.
- Runtime ownership tracking.
- Repository health dashboard.
- Health history and snapshots.
- UI layout audit.
- Module ownership audit.
- Documentation audit.
- Dependency graph tools.
- Coverage heat map.
- Repository evolution dashboard.
- Predictive diagnostics foundation.
- Master report export verification.
- Studio-to-game data bridge foundation.
- Shared DataByteDex rendering foundation.

Studio does not yet automatically:

- Generate complete playable sprite lines.
- Generate final moves and abilities.
- Export balanced encounter tables directly into production runtime data.
- Attach final art assets.
- Run a one-click public-game build/export.
- Run full battle/download simulations through a complete Studio UI.
- Safely mutate repository files directly from the browser without a trusted connector or backend.

## Known Repository Sync Gaps

The runtime manifest and this project-state document now reflect v4.4.3, but the following still need review:

- `studio/diagnostics/sources.json` may not include all newly extracted screen owners.
- DataByteSprites source indexes may not include all newly extracted screen files.
- README and ROADMAP should be checked against the new 4.4.3 wording.
- Diagnostics rules should verify all six required presentation globals.
- The Studio runtime loader should be compared directly with `databyte-discovery.html` to prevent future version drift.

## Immediate Priorities

1. Synchronize diagnostics sources and DataByteSprites source indexes with the v4.4.3 manifest.
2. Add battle terminal handling, party-wipe recovery, and a reward contract.
3. Extract dedicated Party and Items screen owners.
4. Extract dedicated Dex and Admin screen owners.
5. Add one canonical progression runtime for XP, levels, stat growth, and move-unlock hooks.
6. Audit compatibility layers and retire only those with verified canonical replacements.
7. Hide development labels and complete the production header pass.
8. Validate standalone packaging without Studio UI or diagnostics as runtime dependencies.

## Development Rules

- One active owner per responsibility.
- Screen presentation belongs in screen modules.
- Gameplay behavior belongs in runtimes.
- The v4 App Shell coordinates; it does not absorb extracted presentation.
- Visual-effect modules may not move or resize app, stage, card, grid, or control containers.
- Runtime manifests, diagnostics, ownership maps, and project state must be updated when ownership changes.
- Data Discovery must remain distributable without the Studio UI.

## Long-Term Vision

```text
Studio creates or edits content
  ↓
Studio validates IDs, references, balance, assets, ownership, and runtime health
  ↓
Simulation and Studio Intelligence audit the content
  ↓
Studio exports game-ready data
  ↓
Data Discovery and DataByteDex consume the same data
  ↓
The public product ships independently of Studio tooling
```

The long-term goal is for new content to be created through Studio, validated automatically, balanced through Simulation Lab, audited through Studio Intelligence, exported into production-ready data, and consumed directly by Data Discovery and DataByteDex.