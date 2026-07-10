# Data Discovery Ownership Map

This document is the canonical ownership registry for the Data Discovery application.

Current live phase: **4.4.3 Modular Vertical Slice**

## Active Owners

| Area | Owner | Status |
|---|---|---|
| App lifecycle | DD_PRODUCT_APP_V4_SHELL | Active |
| Header | DD_PRODUCT_APP_V4_SHELL | Active |
| Navigation | DD_PRODUCT_APP_V4_SHELL | Active |
| Screen routing | DD_PRODUCT_APP_V4_SHELL | Active |
| Scanner screen | DD_SCANNER_SCREEN | Active |
| Encounter screen | DD_ENCOUNTER_SCREEN | Active |
| Battle screen | DD_BATTLE_SCREEN | Active |
| Battle controls | DD_BATTLE_CONTROLS | Active |
| Download confirmation screen | DD_CONFIRM_SCREEN | Active |
| Download result screen | DD_RESULT_SCREEN | Active |
| Battle resolver | DD_BATTLE_RESOLVER | Active |
| Battle state | DD_BATTLE_STATE_RUNTIME | Active |
| Battle presentation effects | DD_BATTLE_PRESENTATION_RUNTIME | Active |
| Encounter generation | DD_ENCOUNTER_RUNTIME | Active |
| Capture / Download system | DD_CAPTURE_RUNTIME | Active |
| Collection storage | DD_COLLECTION_RUNTIME | Active |
| Party storage | DD_PARTY_RUNTIME | Active |
| Active party switching | DD_PARTY_SWITCH_RUNTIME | Active |
| Inventory storage | DD_INVENTORY_RUNTIME | Active foundation |
| Dex state | DD_DEX_RUNTIME | Active foundation |

## Temporary Screen Owners

These screens still use v4 shell fallback presentation and must be extracted before receiving major layout work:

- Party Screen → future `DD_PARTY_SCREEN`
- Items Screen → future `DD_ITEMS_SCREEN`
- Dex Screen → future `DD_DEX_SCREEN`
- Admin Screen → future `DD_ADMIN_SCREEN`

## Diagnostic-Only Fallbacks

The v4 shell may retain minimal fallback renderers for Scanner, Encounter, Battle, Download Confirmation, and Download Result only to report missing modules during boot or load failure.

These fallbacks are not active presentation owners and must not receive gameplay, layout, or polish work.

## Compatibility Owners Still Active

| Responsibility | Current file | Status |
|---|---|---|
| Party switch overlay | `dd-party-switch-ui.js` | Compatibility UI; working but not final owner |
| Party faint/wipe adapter | `dd-party-switch-battle-bridge.js` | Compatibility adapter |
| Party HUD refresh | `dd-party-switch-refresh.js` | Compatibility visual helper |
| Battle experience effects | `dd-battle-experience-4-2.js` | Merge candidate |
| Viewport lock | `dd-layout-viewport-lock-4-2.js` | Compatibility layout guard |
| Scanner behavior guard | `dd-scanner-behavior-4-3.js` | Compatibility behavior guard |
| Outer Scanner OS stabilization | `dd-scanner-os-runtime.js` | Active shell stabilizer; narrow ownership |
| Health / Signal telemetry | `dd-health-signal-bridge.js` | Compatibility visual helper |
| Scanner background | `dd-scan-bg.js` | Visual/bootstrap owner only |

## Missing Gameplay Owners

The following systems do not yet have canonical active owners:

- Progression / XP / levels
- Rewards and loot
- Status effects
- Abilities and passives
- Evolution / upgrade paths
- Missions and quests
- Journal
- Biomes / scanner regions
- Shops and economy
- Audio and haptics
- Save migration and export/import
- Standalone production packaging verification

## Conflict Rule

If two modules claim ownership of the same responsibility, the change must be rejected until ownership is resolved.

## Editing Rule

Presentation changes must be made in the canonical screen owner. Runtime behavior changes must be made in the canonical runtime owner. The v4 shell should only coordinate routing, context, and actions.

Until a temporary screen is extracted, changes should be limited to required functionality and should not expand the shell fallback into a permanent screen implementation.

## Studio Rule

Studio diagnostics should read this ownership model together with `studio/runtime/load-order.json`.

The game must remain independently distributable. Studio validation, diagnostics, ownership graphs, and editors are development tools and must not become required production runtime dependencies.

## Related Current Audit

See:

`docs/databyte-gameplay-ownership-audit.md`

That document records the current playable loop, partial systems, systems not yet added, compatibility debt, and recommended next commits.
