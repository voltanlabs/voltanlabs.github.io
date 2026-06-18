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
| ACTIVE | `assets/js/dd-battle-os.js` | New Scanner OS battle bridge. This is currently connected but still needs creature-screen action mounting fixed. |
| REVIEW | `assets/js/dd-root.js` | Earlier/root Scanner OS helper. Check before deleting or reusing. |

## Legacy reference-only Data Discovery systems

These files should not be loaded by `databyte-discovery.html` anymore. Use them only as references when rebuilding systems inside Scanner OS modules.

| Status | File | Suggested migration target |
|---|---|---|
| LEGACY-REFERENCE | `assets/js/databyte-discovery.js` | Core roster/discovery logic. Mine for roster/data rules. |
| LEGACY-REFERENCE | `assets/js/databyte-discovery-progression.js` | Rebuild as Scanner OS progression module. |
| LEGACY-REFERENCE | `assets/js/databyte-discovery-journal.js` | Rebuild as Dex/journal module. |
| LEGACY-REFERENCE | `assets/js/databyte-discovery-decompile.js` | Rebuild as Items/Decompile module. |
| LEGACY-REFERENCE | `assets/js/databyte-discovery-inventory-fix.js` | Reference for inventory storage edge cases. |
| LEGACY-REFERENCE | `assets/js/databyte-battle.js` | Mine battle rules for `dd-battle-os.js`. |
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

## Current next target

Fix creature-detail layout and battle action mounting in:

1. `assets/js/databyte-standalone-app.js`
2. `assets/js/dd-battle-os.js`
3. `assets/js/dd-screen-tune.js` / `assets/js/dd-scanner-os-polish.js` if styling override is safer.
