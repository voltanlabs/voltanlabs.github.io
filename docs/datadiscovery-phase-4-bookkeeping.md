# Data Discovery Phase 4 Bookkeeping

Status: active  
Scope: Phase 4.1 through Phase 4.3 compatibility/runtime work

## Purpose

This document records the major Data Discovery runtime, UI, layout, and compatibility layers added after the last large documentation pass. It is intended to reduce documentation drift while the app moves from a webpage-style flow toward a stable mobile game shell.

## Phase 4.1: Party Switching Runtime

### Added Runtime Modules

- `assets/js/dd-party-switch-runtime.js`
  - Owns active party slot tracking.
  - Emits party switch events.
  - Tracks forced-switch state.
  - Provides party wipe detection helpers.

- `assets/js/dd-party-switch-ui.js`
  - Adds the battle Switch button.
  - Provides the party switch overlay.
  - Shows active, ready, and fainted party members.
  - Calls the Party Switch Runtime when a replacement is selected.

- `assets/js/dd-party-switch-battle-bridge.js`
  - Bridges existing Product App battle flow to the new Party Switch Runtime.
  - Detects active sprite fainting.
  - Requests forced switching.
  - Emits party faint and party wipe events.
  - Blocks non-switch battle actions while a switch is required.

- `assets/js/dd-party-switch-refresh.js`
  - Adds the Active Sprite chip.
  - Refreshes battle HUD after party switches.
  - Adds small visual refresh feedback when the active slot changes.

### Phase 4.1 Result

Party switching is now modular instead of being buried directly in the Product App. The Product App still renders the core battle screen, but switching is now owned by a dedicated runtime stack.

## Phase 4.2: Battle Experience and Mobile Layout

### Added Runtime/Layout Modules

- `assets/js/dd-battle-experience-4-2.js`
  - Adds battle feedback polish.
  - Adds HP pulse reactions.
  - Adds switch/download visual feedback hooks.
  - Updates the visible phase label to Phase 4.2 Battle XP.

- `assets/js/dd-layout-viewport-lock-4-2.js`
  - Locks Data Discovery into an app-like mobile viewport.
  - Prevents whole-page scrolling during gameplay.
  - Stabilizes battle card rows.
  - Caps battle text/log height.
  - Begins fixed scanner/battle layout behavior.

- `assets/js/dd-layout-battle-viewport-4-2.js`
  - Added as an experimental battle viewport stabilizer.
  - Later folded conceptually into the active viewport lock layer.

- `assets/js/dd-mobile-game-tray-4-2.js`
  - Adds compact mobile action tray rules.
  - Converts battle controls toward a two-column game layout.
  - Shrinks large mobile buttons.
  - Reduces HUD and bottom navigation height.

### Phase 4.2 Result

Battle no longer behaves like a long scrolling webpage. The battle arena, action buttons, and navigation are closer to a native mobile game layout. Some styling remains compatibility-layer based and should eventually be consolidated.

## Phase 4.3: Unified Scanner Shell Foundation

### Added Shell/Layout Modules

- `assets/js/dd-unified-scanner-shell-4-3.js`
  - Adds a compatibility shell to make Scan, Encounter, and Battle use a more consistent app frame.
  - Forces stage/card areas into stable viewport slots.
  - Prevents battle log and names from changing overall layout height.

- `assets/js/dd-battle-centerline-fix-4-3.js`
  - Corrects the battle arena centerline.
  - Forces the two fighters and VS marker into equal-width columns.
  - Stretches Signal and Download HUD bars across the available battle card width.

### Phase 4.3 Result

The app is transitioning toward one permanent Scanner OS shell where the header, scanner viewport, controls, and bottom navigation stay stable while only the contents of the viewport change.

## Current Active Load Path Notes

`databyte-discovery.html` starts the core runtime chain and then `dd-scan-bg.js` loads several visual and compatibility layers. As of this bookkeeping pass, `dd-scan-bg.js` also loads:

- `dd-mobile-game-tray-4-2.js`
- `dd-unified-scanner-shell-4-3.js`
- `dd-battle-centerline-fix-4-3.js`

This means several Phase 4 layout improvements currently load through the compatibility loader rather than directly through the boot HTML. This is acceptable for rapid iteration, but should be consolidated later.

## Known Technical Debt

- Multiple compatibility layers now style the same battle/card/control elements.
- The Product App still owns too much rendering logic.
- Scan, Encounter, and Battle still have separate internal render paths.
- Phase 4.3 should continue toward a single permanent Scanner OS shell.
- Long sprite names need an auto-fit strategy rather than ellipsis-only truncation.
- Phase labels still show Phase 4.2 Battle XP while Phase 4.3 compatibility work is underway.

## Next Recommended Passes

1. Verify the Phase 4.3 centerline fix on mobile after cache refresh.
2. Consolidate Phase 4 layout CSS into one canonical layout runtime.
3. Update the Product App to render through one permanent Scanner OS shell instead of separate screen structures.
4. Replace compatibility patches with direct runtime integration.
5. Update Studio diagnostics/registry so Phase 4 modules are first-class tracked runtime owners.
