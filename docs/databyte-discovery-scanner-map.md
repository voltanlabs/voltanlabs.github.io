# DataByteSprites: Data Discovery Scanner Map

Project tag: `DBD-SCANNER-OS`

Purpose: keep the active Scanner OS app separated from old legacy UI files. The legacy files are now reference-only unless explicitly promoted into a Scanner OS module.

## Runtime entry point

These files are active for the live Data Discovery page.

| Status | File | Role |
|---|---|---|
| ACTIVE | `databyte-discovery.html` | Direct Scanner OS boot page. Should not load legacy page sections. |
| ACTIVE | `assets/js/databyte-standalone-app.js` | Main standalone Scanner OS app renderer and state bridge. This is the primary file to inspect for scanner/creature/capture screen rendering. |
| ACTIVE | `assets/js/dd-scan-bg.js` | Central Scanner OS module loader and animated scan background. Loads all `dd-*` runtime modules. |

## Active Scanner OS modules

These files are current modular wrappers for the new app shell.

| Status | File | Role |
|---|---|---|
| ACTIVE | `assets/js/dd-wheel-nav.js` | Floating scanner wheel/menu navigation. |
| ACTIVE | `assets/js/dd-screen-tune.js` | Scanner screen layout tuning. |
| ACTIVE | `assets/js/dd-return-fix.js` | Legacy return/control cleanup. |
| ACTIVE | `assets/js/dd-scanner-os-polish.js` | Scanner OS visual polish, creature/capture screen tuning. |
| ACTIVE | `assets/js/dd-nav-cleanup.js` | One-navigation-language cleanup. Removes duplicate return actions and styles Scanner chip. |
| ACTIVE | `assets/js/dd-living-scanner.js` | Idle scanner animation: radar sweep, active blips, pulse. |
| ACTIVE | `assets/js/dd-rarity-fx.js` | Rarity-specific signal orb effects. |
| ACTIVE | `assets/js/dd-capture-themes.js` | Capture result color/mood themes. |
| ACTIVE | `assets/js/dd-portrait-cards.js` | Portrait card renderer for Dex, Party, and Items lists. |
| ACTIVE | `assets/js/dd-dex-progress.js` | Scanner OS progress panels for Dex/Party/Items. |
| ACTIVE | `assets/js/dd-battle-os.js` | Scanner OS battle bridge. Currently works but still mixes HP-style battle terms with legacy Signal rules. |
| ACTIVE | `assets/js/dd-battle-legacy-stats.js` | Temporary legacy battle telemetry overlay. Must be realigned: Signal means capture probability, not HP/integrity. |
| ACTIVE | `assets/js/dd-battle-legacy-features.js` | Temporary legacy battle controls overlay: stability pips, Scan Pulse, Return, subdued capture guard. |
| REVIEW | `assets/js/dd-root.js` | Earlier/root Scanner OS helper. Check before deleting or reusing. |

## Phase 1 legacy battle audit — source of truth

Use this section before changing battle or capture math.

### Legacy capture rules from `assets/js/databyte-discovery.js`

- `captureChance` and `currentChance` are created from the template chance. Starter is always `100`.
- `chanceText` displays `currentChance` with a minimum of `5%`.
- Capture rolls `1..100` and succeeds when `roll <= currentChance`.
- Failed ByteCoin throws reduce `stability` by `1` and reduce `currentChance` by `10`, with a floor of `5`.
- If `stability <= 0`, the signal collapses, the sprite is marked `Escaped`, and the encounter is cleared.
- Legacy capture did not have rarity caps. The current Scanner OS added rarity caps later; keep them only if intentionally accepted as Scanner OS balancing.

### Legacy battle rules from `assets/js/databyte-battle.js`

- `battle.signal` is initialized from `chanceText`. In legacy terms, **Signal % is the capture probability / signal lock number.**
- `boostSignal(amount)` increases `battle.signal` and writes that value back to `chanceText` with `syncChanceText()`.
- `Scan Pulse` calls `boostSignal(12)` and then enemy turn.
- Enemy weakened/defeated calls `boostSignal(15)` and enters a resolved/subdued state where the player can throw a ByteCoin or return.
- `Throw ByteCoin` syncs the battle Signal back into the capture system, clicks the capture button, then checks the capture result.
- Failed ByteCoin attempts during battle call `dropStability("ByteCoin breakout.")`.
- Player forced offline calls `dropStability(...)` and enters a resolved state needing party swap/return.
- Stability display uses star pips: `★` for current stability and `☆` for missing stability.

### Critical terminology rule

Do **not** use `Signal Integrity` as an HP-derived number in Scanner OS. That contradicts legacy Data Discovery.

Correct Scanner OS battle display should be:

- `Signal` or `Signal Lock` = actual capture probability/currentChance.
- `Battle Bonus` = increase applied to the Signal/capture probability.
- `Signal Stability` = remaining escape/collapse buffer shown as stars or bars.
- Fighter HP bars may exist, but they must be labeled as HP/Guard/Partner status, not Signal.

### Current drift to fix in Phase 2

- `dd-battle-legacy-stats.js` currently derives an `Integrity` value from `enemyHp` and shows it as signal-related telemetry. Remove or relabel it as enemy HP only.
- `dd-battle-os.js` currently auto-launches capture on enemy defeat. Legacy allowed a resolved/subdued state with `Throw ByteCoin` and `Return` controls.
- `dd-battle-os.js` battle boost path must use the scanner bridge (`window.ddBoostCapture`) so Scanner OS balancing/caps apply consistently.
- Temporary overlays should be consolidated into the battle module after the rules are corrected.

## Legacy reference-only Data Discovery systems

These files should not be loaded by `databyte-discovery.html` anymore. Use them only as references when rebuilding systems inside Scanner OS modules.

| Status | File | Suggested migration target |
|---|---|---|
| LEGACY-REFERENCE | `assets/js/databyte-discovery.js` | Core roster/discovery/capture rules. Mine for roster/data rules. |
| LEGACY-REFERENCE | `assets/js/databyte-discovery-progression.js` | Rebuild as Scanner OS progression module. |
| LEGACY-REFERENCE | `assets/js/databyte-discovery-journal.js` | Rebuild as Dex/journal module. |
| LEGACY-REFERENCE | `assets/js/databyte-discovery-decompile.js` | Rebuild as Items/Decompile module. |
| LEGACY-REFERENCE | `assets/js/databyte-discovery-inventory-fix.js` | Reference for inventory storage edge cases. |
| LEGACY-REFERENCE | `assets/js/databyte-battle.js` | Source of truth for legacy battle rules. Mine battle rules for `dd-battle-os.js`. |
| LEGACY-REFERENCE | `assets/js/databyte-battle-copy.js` | Copy/rules reference only. |
| LEGACY-REFERENCE | `assets/js/databyte-battle-layout-lock.js` | Layout reference only; do not load into Scanner OS. |
| LEGACY-REFERENCE | `assets/js/databyte-missions.js` | Rebuild as `dd-missions-os.js`. |
| LEGACY-REFERENCE | `assets/js/databyte-admin-console.js` | Rebuild as Scanner OS Admin module. |
| LEGACY-REFERENCE | `assets/js/databyte-admin-console-simple.js` | Admin reference only. |
| LEGACY-REFERENCE | `assets/js/databyte-admin-tabs.js` | Admin UI reference only. |
| LEGACY-REFERENCE | `assets/js/databyte-admin-tabs-stable.js` | Admin UI reference only. |
| LEGACY-REFERENCE | `assets/js/databyte-app-shell-v2.js` | Old app-shell flow. Reference only. |
| LEGACY-REFERENCE | `assets/js/databyte-fullscreen-shell.js` | Old fullscreen scanner shell. Reference only. |
| LEGACY-REFERENCE | `assets/js/databyte-native-app-shell.js` | Old native shell attempt. Reference only. |
| LEGACY-REFERENCE | `assets/js/databyte-scanner-workspace.js` | Scanner layout/interaction reference only. |
| LEGACY-REFERENCE | `assets/js/databyte-scanner-effects.js` | Effects reference only. |
| LEGACY-REFERENCE | `assets/js/databyte-signal-stage.js` | Signal stage reference only. |
| LEGACY-REFERENCE | `assets/js/databyte-signal-collapse.js` | Signal/collapse behavior reference only. |
| LEGACY-REFERENCE | `assets/js/databyte-special-panel.js` | Special panel reference only. |
| LEGACY-REFERENCE | `assets/js/databyte-status-center.js` | Status panel reference only. |
| LEGACY-REFERENCE | `assets/js/databyte-status-cleanup-v2.js` | Cleanup reference only. |
| LEGACY-REFERENCE | `assets/js/databyte-ui-state-fix.js` | UI-state bug reference only. |
| LEGACY-REFERENCE | `assets/js/databyte-click-fix.js` | Click/touch bug reference only. |
| LEGACY-REFERENCE | `assets/js/databyte-auto-start.js` | Old boot/autostart reference only. |
| LEGACY-REFERENCE | `assets/js/databyte-idle-restore.js` | Old idle recovery reference only. |
| LEGACY-REFERENCE | `assets/js/databyte-rare-style.js` | Old handoff loader. No longer needed for direct boot unless intentionally restored. |
| LEGACY-REFERENCE | `assets/js/databyte-rare-spawn.js` | Spawn tuning reference only. |
| LEGACY-REFERENCE | `assets/js/databyte-rate-copy.js` | Copy/reference only. |
| LEGACY-REFERENCE | `assets/js/databyte-copy-loader.js` | Copy loader reference only. |
| LEGACY-REFERENCE | `assets/js/databyte-escape-guard-copy.js` | Escape/guard reference only. |
| LEGACY-REFERENCE | `assets/js/databyte-stat-safety.js` | Stat guard reference only. |
| LEGACY-REFERENCE | `assets/js/databytedex-action-router.js` | Dex action reference only. |
| LEGACY-REFERENCE | `assets/js/databytedex-panel-cleanup.js` | Dex panel cleanup reference only. |

## Legacy/reference pages

| Status | File | Role |
|---|---|---|
| ACTIVE-PAGE | `databyte-discovery.html` | Live direct Scanner OS page. |
| LEGACY-REFERENCE | `databyte-discovery-v2.html` | Old V2 prototype/reference only. |
| LEGACY-REFERENCE | `databytedex.html` | Old Dex page/reference only. |
| SITE-LINK | `voltarcade.html` | Arcade landing page linking to game. |
| SITE-LINK | `index.html` | Site home references DataByte content. |

## CSS reference files

| Status | File | Role |
|---|---|---|
| LEGACY-REFERENCE | `assets/css/databyte-scanner-layout.css` | Old scanner layout reference. |
| LEGACY-REFERENCE | `assets/css/databyte-scanner-recovery.css` | Old scanner recovery reference. |

## Development rule

Do not add old page sections back to `databyte-discovery.html`.

When rebuilding a legacy feature, create a new module named like:

- `assets/js/dd-missions-os.js`
- `assets/js/dd-evolution-os.js`
- `assets/js/dd-admin-os.js`
- `assets/js/dd-inventory-os.js`

Then load it through `assets/js/dd-scan-bg.js`.

Every feature must be built and wired before it is considered complete.

## Current next target

Phase 2: realign Scanner OS battle UI and math with the legacy source of truth.

1. Remove HP-derived `Signal Integrity` from `dd-battle-legacy-stats.js`.
2. Show only legacy-correct `Signal`, `Battle Bonus`, and `Signal Stability` as main telemetry.
3. Keep fighter HP bars only as fighter/partner HP, never as Signal.
4. Stop auto-capture-on-defeat unless intentionally chosen; prefer legacy `Signal Subdued` state with `Throw DataByteCoin` and `Return`.
5. Consolidate temporary battle overlays after behavior is correct.