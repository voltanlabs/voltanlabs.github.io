# DataByteSprites Legacy App Rebuild Map

Project tag: `DBD-LEGACY-REBUILD`

Purpose: track which legacy systems have been rebuilt into Scanner OS modules and which systems are still borrowed from legacy behavior.

Related maps:

- `docs/databyte-discovery-scanner-map.md`
- `docs/databyte-battle-rebuild-map.md`

## Rebuild status board

| System | Status | Notes |
|---|---|---|
| Scanner Shell | REBUILT | Standalone Scanner OS active. |
| Encounter Discovery | REBUILT | Scanner-based encounter flow active. |
| Capture Flow | REBUILT | Capture screens and roll system active. |
| Capture Result Screen | REBUILT | Success/failure result flow active. |
| Rarity Effects | REBUILT | Scanner OS effects active. |
| Dex Progress Panels | REBUILT | Scanner OS implementation active. |
| Battle System | PARTIAL | Legacy rules documented. Core rewrite still required. |
| Journal | PENDING | Legacy reference exists but not rebuilt. |
| Missions | PENDING | Legacy reference exists but not rebuilt. |
| Inventory Expansion | PENDING | Partial storage exists. Not rebuilt. |
| Decompile System | PENDING | Legacy reference only. |
| Admin Console | PENDING | Legacy reference only. |
| Progression / Scanner Rank | PENDING | Not rebuilt. |
| XP Rewards | PENDING | Not rebuilt. |
| Party Management | PARTIAL | Basic collection exists, battle integration incomplete. |
| Signal Lost Flow | PARTIAL | Exists in legacy. Not fully restored. |
| Evolution / Upgrade Systems | PENDING | Future rebuild. |

## Active Scanner OS modules

These are intended rebuild targets and active ownership locations.

| Module | Ownership |
|---|---|
| `databyte-standalone-app.js` | Core scanner state and rendering. |
| `dd-battle-os.js` | Future single battle owner after rebuild. |
| `dd-dex-progress.js` | Dex/progress UI. |
| Future `dd-journal-os.js` | Journal rebuild target. |
| Future `dd-missions-os.js` | Missions rebuild target. |
| Future `dd-admin-os.js` | Admin rebuild target. |
| Future `dd-progression-os.js` | XP/rank rebuild target. |

## Legacy reference files

These are references, not runtime targets.

- `databyte-discovery.js`
- `databyte-battle.js`
- `databyte-discovery-journal.js`
- `databyte-discovery-progression.js`
- `databyte-missions.js`
- `databyte-admin-console.js`

## Current priority order

1. Finish battle rebuild.
2. Restore Signal Lost and Stability behavior.
3. Restore progression/rank system.
4. Rebuild journal.
5. Rebuild missions.
6. Rebuild admin console.

## Engineering rule

Every rebuild phase must:

1. Update the relevant map.
2. Build the feature.
3. Wire the feature.
4. Update the map again.
5. Record the commit SHA.

No feature is considered complete until all five steps are done.
