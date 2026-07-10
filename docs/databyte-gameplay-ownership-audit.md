# Data Discovery Gameplay Ownership and Gap Audit

Status: active canon  
Phase: 4.4.3 Modular Vertical Slice  
Last reviewed: 2026-07-10

## Purpose

This document records what the live Data Discovery build currently owns, what is only partially implemented, and what has not been added yet.

The rule remains:

> One active owner per responsibility. Screen presentation belongs in screen modules, gameplay behavior belongs in runtimes, and the v4 App Shell coordinates routing, context, and actions.

## Active Live Architecture

```text
databyte-discovery.html
  ↓
Core data and gameplay runtimes
  ↓
Dedicated screen/control owners
  ↓
DD_PRODUCT_APP_V4_SHELL v4.4.3
  ↓
Compatibility adapters and visual-only helpers
```

### Active App Owner

| Responsibility | Owner | Status |
|---|---|---|
| App lifecycle | `databyte-discovery-product-app-v4-shell.js` | Active |
| Route state | `databyte-discovery-product-app-v4-shell.js` | Active |
| Screen registry | `databyte-discovery-product-app-v4-shell.js` | Active |
| Context building | `databyte-discovery-product-app-v4-shell.js` | Active |
| Action dispatch | `databyte-discovery-product-app-v4-shell.js` | Active |
| Header and bottom navigation | `databyte-discovery-product-app-v4-shell.js` | Active |

The shell must not become the long-term presentation owner for extracted screens.

## Dedicated Presentation Owners

| Screen / Controls | Owner | Status |
|---|---|---|
| Scanner | `dd-scanner-screen.js` | Active owner |
| Encounter | `dd-encounter-screen.js` | Active owner |
| Battle | `dd-battle-screen.js` | Active owner |
| Battle controls | `dd-battle-controls.js` | Active owner |
| Download confirmation | `dd-confirm-screen.js` | Active owner |
| Download result | `dd-result-screen.js` | Active owner |

The shell may keep minimal missing-module diagnostics for these screens, but those fallbacks must not receive layout or gameplay work.

## Active Runtime Owners

| Gameplay Area | Owner | Status |
|---|---|---|
| Canon roster | `dd-canon-roster.js` | Active |
| Studio game-data overlay | `dd-studio-data-bridge.js` | Active |
| Gameplay rules | `dd-gameplay-rules-2-4.js` | Active foundation |
| Encounter generation | `dd-encounter-runtime.js` | Active |
| Download odds and attempts | `dd-capture-runtime.js` | Active |
| Battle helper bus | `dd-battle-engine-2-4.js` | Active foundation |
| Battle balance | `dd-battle-balance-2-4.js` | Active |
| Damage, accuracy, turn order, enemy move choice | `dd-battle-resolver.js` | Active |
| Battle terminal state | `dd-battle-state-runtime.js` | Active |
| Non-layout battle effects | `dd-battle-presentation-runtime.js` | Active |
| Collection storage | `dd-collection-runtime.js` | Active |
| Party storage | `dd-party-runtime.js` | Active |
| Active-party switching state | `dd-party-switch-runtime.js` | Active |
| Inventory storage | `dd-inventory-runtime.js` | Active foundation |
| Dex seen/downloaded state | `dd-dex-runtime.js` | Active |

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
  ├── Success → collection / party → scanner
  ├── Recoverable failure → continue battle
  └── Signal loss → scanner
```

### Verified Working

- Discovery-code and random-code encounter generation.
- Dedicated Scanner, Encounter, Battle, Confirm, and Result presentations.
- Battle damage, accuracy, turn order, and enemy move selection.
- Separate creature HP and encounter Signal.
- Download odds, caps, ByteCoin use, success, failure, and Signal loss.
- Collection persistence.
- Party auto-fill.
- Battle party-switch overlay.
- Returning from battle Items to the active battle.
- Returning to Scanner after terminal results.
- Seen/downloaded Dex state tracking.

## Partial Systems

### Party

Implemented:
- Party storage.
- Auto-fill from collection.
- Active party index.
- Battle switching.
- Fainted-member blocking.

Still partial:
- No dedicated `dd-party-screen.js` presentation owner.
- No polished party reorder interface.
- No clear lead selection outside battle.
- No full sprite detail, status, equipment, or move-management view.
- Party-switch UI is still a compatibility overlay rather than a final screen/overlay owner.

### Inventory and Items

Implemented:
- Inventory persistence.
- ByteCoin count and spending.
- Items panel route can return to battle.

Still partial:
- No dedicated `dd-items-screen.js` presentation owner.
- No usable battle-item catalog.
- No healing, buff, debuff, status-curing, or Signal-manipulation items.
- No item targeting or turn-consumption rules.
- No shop, crafting, loot, or item reward source.

### Dex

Implemented:
- Seen/downloaded tracking.
- Shared roster data.
- External DataByteDex shared rendering foundation.

Still partial:
- No dedicated in-game `dd-dex-screen.js` owner.
- No detailed species entry from the in-game panel.
- No filtering, rarity/type sorting, habitat, move, evolution, or capture-history views.

### Admin / Player Profile

Implemented:
- Basic stored profile.
- Basic Admin fallback panel.

Still partial:
- No dedicated `dd-admin-screen.js` owner.
- No settings, save management, statistics, debug toggle, credits, or account/profile progression UI.
- The development label `v4 App Shell` is still visible in the production header.

### Battle Completion

Implemented:
- Wild defeat state.
- Recoverable download failure.
- Signal collapse.
- Active-sprite faint detection support.
- Party-switch-required compatibility events.

Still partial:
- No final all-party-defeated screen and recovery flow.
- No formal victory reward pipeline.
- No encounter reward table.
- No dedicated battle-summary result separate from download result.
- Enemy AI selects moves but does not yet use strategy, type planning, items, switching, or difficulty profiles.

## Not Added Yet

### Progression

- XP runtime.
- Level calculation.
- Stat growth.
- Level-up presentation.
- Player rank progression.
- Move-learning progression.
- Evolution or upgrade paths.

### Expanded Battle Systems

- Status conditions.
- Buffs and debuffs.
- Ability/passive runtime.
- Critical-hit rules.
- Element/type feedback in the battle UI.
- Multi-turn moves.
- Move cooldowns, energy, PP, or another move-resource system.
- Held items or equipment.
- Trainer, boss, raid, or multi-enemy battles.

### World and Content Progression

- Biomes or scanner regions.
- Location-based encounter pools in the player UI.
- Story chapters.
- NPCs.
- Missions and quests.
- Journal.
- Daily/weekly encounters.
- Boss progression.
- Shops and currency economy beyond ByteCoins.
- Rewards and loot tables.

### Presentation and Audio

- Final sprite artwork pipeline.
- Dedicated attack animations.
- Outcome-specific download animations.
- Sound effects.
- Music.
- Haptics.
- Accessibility settings.
- Reduced-motion mode.
- Final production header and branding pass.

### Save and Distribution

- Versioned save migration.
- Export/import save file.
- Save reset confirmation.
- Offline/PWA install validation.
- Standalone production packaging profile.
- Studio-free export verification.
- Automated release checklist.

## Compatibility Layers Still Loaded

| File | Current role | Desired destination |
|---|---|---|
| `dd-party-switch-ui.js` | Battle switch overlay | Promote to final overlay owner or merge into Party presentation |
| `dd-party-switch-battle-bridge.js` | Faint/wipe event adapter | Merge stable behavior into canonical battle/party state owners |
| `dd-party-switch-refresh.js` | Battle HUD refresh helper | Remove after canonical render events cover refresh |
| `dd-battle-experience-4-2.js` | Visual polish | Merge useful effects into presentation runtime |
| `dd-layout-viewport-lock-4-2.js` | Mobile viewport guard | Keep only if shell layout cannot fully replace it |
| `dd-scanner-behavior-4-3.js` | Behavior guard | Retire after v4 shell behavior is fully canonical |
| `dd-scanner-os-runtime.js` | Outer layout stabilizer | Narrow to viewport-only or retire after shell layout audit |
| `dd-health-signal-bridge.js` | Visual telemetry helper | Remove after canonical screens expose stable hooks |
| `dd-scan-bg.js` | Scanner background/bootstrap | Keep visual-only; remove any ownership behavior |

## Documentation and Manifest Gaps Found

The code is currently ahead of several repository records.

- `PROJECT_STATE.md` still describes Product App v3.5 and the Phase 4.3 Scanner OS architecture.
- `studio/runtime/load-order.json` still omits Scanner, Encounter, Confirm, and Result screen owners.
- The runtime manifest still references older shell, Battle Screen, Battle Controls, Party Switch UI, and Battle Experience cache versions.
- The runtime manifest description says only Battle Screen and Battle Controls load before the shell.
- Some source indexes and diagnostics registries may not yet include the newly extracted screen files.

These records should be synchronized before Studio diagnostics are treated as an accurate live ownership report.

## Recommended Next Four Commits

1. **Manifest and documentation sync**  
   Register all active screen owners and current asset versions in the runtime, diagnostics, and source indexes; update `PROJECT_STATE.md`.

2. **Battle terminal and reward flow**  
   Add party-wipe handling, battle completion rewards, and a stable reward/result contract.

3. **Party and Items presentation extraction**  
   Create dedicated Party and Items screen owners while preserving battle return routing.

4. **Progression foundation**  
   Add one canonical progression runtime for XP, levels, stat growth, and move unlock hooks.

## Ownership Rules

- Do not add presentation patches to the v4 shell for an extracted screen.
- Do not let visual-effect modules animate or resize app, stage, card, grid, or control containers.
- Do not duplicate damage, capture, party, inventory, or Dex state inside screen modules.
- Update this audit and the machine-readable manifests whenever ownership changes.
- Studio tools support development, but the distributable game must run without Studio UI or Studio diagnostics.
