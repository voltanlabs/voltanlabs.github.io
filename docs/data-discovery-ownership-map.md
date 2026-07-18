# Data Discovery Ownership Map

This document is the canonical ownership registry for the Data Discovery application.

Current live phase: **6.0 Progression Loop**

Current recovery revision: **6.0.4 / bootstrap 1.9.4**

## Governance Status

The Architecture Freeze remains active. The active HTML path and
`studio/runtime/load-order.json` are synchronized. Legacy runtime files remain
in the repository as recovery evidence but are not active owners unless loaded
by `databyte-discovery.html`.

## Active State and Behavior Owners

| Area | Canonical owner | Public contract | Status |
|---|---|---|---|
| Studio-authored game data | `dd-studio-data-bridge.js` | `DD_STUDIO_DATA_BRIDGE` | active |
| Encounter selection and Signal | `dd-encounter-runtime.js` | `DD_ENCOUNTER_RUNTIME` | active |
| Download rules | `dd-capture-runtime.js` | `DD_CAPTURE_RUNTIME` | active |
| Player persistence and party state | `dd-player-runtime.js` | `DD_PLAYER_RUNTIME` | active |
| Battle calculations, turns, retaliation, and transitions | `dd-battle-core-runtime.js` | `DD_BATTLE_CORE_RUNTIME` | active owner |
| Legacy battle facade | `dd-battle-runtime.js` | `DD_BATTLE_RUNTIME` | implemented but not loaded |
| Legacy battle resolver | `dd-battle-resolver.js` | `DD_BATTLE_RESOLVER` | implemented but not loaded |
| Legacy battle state | `dd-battle-state-runtime.js` | `DD_BATTLE_STATE_RUNTIME` | implemented but not loaded |
| Status rules | `dd-status-runtime.js` | `DD_STATUS_RUNTIME` | active owner through silent battle-core calls |
| Battle rewards, XP, levels, Version Upgrades, and history | `dd-battle-reward-runtime.js` | `DD_BATTLE_REWARD_RUNTIME` | active owner |
| Application routing and rendering | `databyte-discovery-product-app-v4-shell.js` | `DD_PRODUCT_APP_V4_SHELL` | active |
| Runtime loading and readiness | `dd-app-bootstrap.js` | `DD_APP_BOOTSTRAP` | active entry point |
| Screen and control dispatch | `dd-screen-registry.js` | `DD_SCREEN_REGISTRY` | active facade |
| App layout and overlays | `dd-app-presentation-runtime.js` | `DD_APP_PRESENTATION_RUNTIME` | active |

`DD_PLAYER_RUNTIME` exclusively owns the collection, party IDs, active party
slot, forced-switch requirement, inventory, and Dex progress storage contracts.
Its lead selector prefers a usable active sprite, then the first usable party
member; Battle start synchronizes that choice without making party reads write.
It publishes the older `DD_COLLECTION_RUNTIME`, `DD_PARTY_RUNTIME`,
`DD_PARTY_SWITCH_RUNTIME`, `DD_INVENTORY_RUNTIME`, and `DD_DEX_RUNTIME` globals
as compatibility views backed by the same implementation. Their former files
are implemented but not loaded.

`DD_PLAYER_RUNTIME` also owns the rolling local recovery backup. It snapshots
collection, party, inventory, and Dex data after canonical writes and restores
that backup when the primary collection save is missing.

`DD_BATTLE_CORE_RUNTIME` is the only battle execution contract consumed by the
App Shell. It owns deterministic move normalization, turn order, hit and damage
calculation, player and enemy action application, Download pressure, lead HP
persistence, and terminal decisions. It publishes no per-phase DOM events.
The shell owns input locking, routing, and rendering only.

## Active Presentation Owners

| Area | Owner | Status |
|---|
| Scanner markup | `dd-scanner-screen.js` | active screen owner |
| Encounter markup | `dd-encounter-screen.js` | active screen owner |
| Battle markup | `dd-battle-screen.js` | active screen owner |
| Battle controls | `dd-battle-controls.js` | active controls owner |
| Download confirmation | `dd-confirm-screen.js` | active screen owner |
| Result markup | `dd-result-screen.js` | active screen owner |
| Battle effects, battle toast, app layout, party overlay | `dd-app-presentation-runtime.js` | active presentation owner |

The shell builds one context snapshot and prepares screen and control markup
before committing either DOM host. Presentation and compatibility modules may
observe lifecycle events but must not infer or mutate canonical battle state.
`dd-battle-screen.js` derives each sprite's thin outer HP edge exclusively from
canonical current/max HP; the shell updates the same percentage and severity
color after every completed attack. The opaque inner circle prevents the HP
gradient from filling behind the sprite.

## Phase 5.0 Battle Rebuild

The former attack pipeline crossed resolver, status, battle-state, facade,
event, persistence, and presentation modules during one click. Browser testing
showed renderer failure inside that shared pipeline even after presentation was
removed. Phase 5.0 replaces active attack execution with one bounded owner and
one returned result. The rebuilt owner has no DOM access and emits no combat
events; the shell patches the HUD once after a completed turn. Phase 5.1
retires the old engine, balance, resolver, state, and facade modules from the
active bootstrap, reducing the generated bundle from 24 to 19 modules.

Status modifiers, action gates, application, duration ticking, stack behavior,
and status damage remain owned by `DD_STATUS_RUNTIME`. The rebuilt core uses
silent owner calls so combat does not publish full mutable sprite graphs.
`DD_BATTLE_REWARD_RUNTIME` remains the reward owner and is invoked once after a
core victory result.

Live verification completed seven consecutive two-action turns. Each turn
updated wild HP, lead HP, Download pressure, and the battle log. The seventh
turn reached Party Defeated without a freeze; Return to Scanner restored the
party through `DD_PLAYER_RUNTIME.recovery`.

## Phase 4.9 Freeze Recovery

The live freeze was not one defect. The recovery pass removed four independent
ownership and loading hazards:

1. The production page previously loaded a long global script chain. It now
   loads one bootstrap and one generated runtime bundle while retaining the
   ordered module manifest as the source of truth.
2. Scanner and Encounter previously built battle context eagerly. Battle
   context is now route-scoped and is created only for Battle, confirmation,
   and result routes.
3. Party reads previously called `autoFill()`, wrote local storage, and emitted
   party events. Party reads are now pure; autofill is an explicit seed action.
4. Shell sprite normalization previously called the battle resolver and
   normalized the active lead twice. Presentation/context normalization no
   longer invokes resolver work; move normalization remains owned by the
   resolver during attack resolution.

Live verification in the in-app browser confirmed fast Scanner startup,
Encounter navigation, Battle startup, attack response, party-defeat routing,
Scanner return, and Party/Items/Dex navigation. Automated coverage executes
seven consecutive real resolver/state transactions.

Post-defeat recovery is owned by `DD_PLAYER_RUNTIME.recovery`. Returning to the
Scanner from a `party-defeated` result restores every downloaded party member to
full HP, clears forced-switch state, resets the active slot, persists once, and
emits `dd:party-restored`. No healing occurs during an active battle.

## Archived Recovery References

Superseded persistence, Scanner OS, party-switch bridge, viewport, health/signal,
and effects modules are retained under
`archive/databyte-discovery/runtime-compatibility/`. They are not imported by
the active bootstrap and must not be restored as runtime owners.

Temporary prefix bundles, the diagnostic harness, and the retired duplicate
battle-presentation observer are retained under
`archive/databyte-discovery/recovery-diagnostics/`.
