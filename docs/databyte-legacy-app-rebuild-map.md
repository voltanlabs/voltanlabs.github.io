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
| Battle System | REBUILT | Battle, subdued, capture, result, and reward flow active. |
| Signal Lost Flow | PARTIAL | Core behavior exists. Legacy parity tuning remains. |
| XP Rewards | PARTIAL | XP backend and rewards active. Scanner UI still missing. |
| Progression / Scanner Rank | PARTIAL | Backend foundations exist. Rank UI not rebuilt. |
| Party Management | PARTIAL | Collection exists, battle integration incomplete. |
| Journal | PENDING | Legacy reference exists but not rebuilt. |
| Missions | PENDING | Legacy reference exists but not rebuilt. |
| Inventory Expansion | PENDING | Partial storage exists. Not rebuilt. |
| Decompile System | PENDING | Legacy reference only. |
| Admin Console | PENDING | Legacy reference only. |
| Evolution / Upgrade Systems | PENDING | Future rebuild. |
| Regional Maps | PENDING | Future rebuild. |

## Current rebuild estimate

- Core Scanner Migration: ~80%
- Battle Migration: ~90%
- Progression Migration: ~35%
- Content Systems Migration: ~15%

## Active Scanner OS modules

| Module | Ownership |
|---|---|
| `databyte-standalone-app.js` | Core scanner state and rendering. |
| `dd-battle-os-v2.js` | Current active battle owner. |
| `dd-battle-phase3c-guard.js` | Phase 3C battle/result polish layer. |
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

## Next rebuild priority order

1. Scanner XP bar and rank display.
2. Scanner progression screen.
3. DataByteDex completion tracking.
4. Journal rebuild.
5. Missions rebuild.
6. Regional map system.
7. Admin console rebuild.

## Engineering rule

Every rebuild phase must:

1. Update the relevant map.
2. Build the feature.
3. Wire the feature.
4. Update the map again.
5. Record the commit SHA.

No feature is considered complete until all five steps are done.