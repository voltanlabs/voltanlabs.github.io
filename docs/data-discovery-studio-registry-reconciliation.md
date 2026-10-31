# Studio Registry Reconciliation — Data Discovery

Baseline: `f9368dfb439a33aeb6e79e66c040247a11fa0b00`. This is a **read-only dependency classification**; it does not authorize file retirement or redefine the Studio schema.

## Verified consumers

| Registry | Consumer or purpose | Impact of moving a referenced file |
| --- | --- | --- |
| `studio/diagnostics/sources.json` | `assets/js/studio-validation-engine.js` reads this registry and fetches `source.path` (see its registry constant and fetch loop) | **Live validation failure** unless registry and any other consumers are updated |
| `studio/databytesprites/source-files.json` | Studio source ownership index; referenced by `assets/js/studio-phase37-ownership-validator.js` and Studio knowledge metadata | **Ownership and indexing risk**; verify exact consumer behavior before editing |
| `studio/databytesprites/mechanics-graph.json` | Phase 6 ownership/dependency graph, including status-flow node | **Graph accuracy risk**; path changes require coordinated metadata updates |
| `studio/runtime/load-order.json` | Phase 6 active module and legacy-reference manifest | **Manifest integrity risk**; do not equate `legacyModules` with active script loads |
| `studio/diagnostics/sources.v0.1.8.json` | Historical diagnostics snapshot | **Historical fidelity risk**; preserve snapshot rather than blindly rewriting |

## Classification of specifically investigated legacy files

- **Validation-registered, not cleared:** `dd-mobile-game-tray-4-2.js`, `dd-unified-scanner-shell-4-3-once.js`, `dd-battle-centerline-fix-4-3.js`. These are listed in current `studio/diagnostics/sources.json`, with `retired-active-load` status; that status is not permission to delete the files.
- **Studio indexed, not cleared:** `dd-status-battle-flow.js`, `dd-battle-resolver.js`, `dd-battle-state-runtime.js` appear in the DataByteSprites source index and/or mechanics graph; verify references to exported globals, diagnostics, and callers before relocation.
- **Manifest/documentation candidates, not cleared:** `dd-unified-scanner-shell-4-3.js`, `databyte-capture-pool.js`, `databyte-ability-bridge.js`. GitHub filename searches found manifest/documentation references, but search absence elsewhere is not a comprehensive dependency test.
- **Explicit code dependency:** `dd-mobile-game-tray-4-2.js` references `dd-battle-centerline-fix-4-3.js`; evaluate the full script before moving either.

## Product boundary and metadata drift

The public `databyte-discovery.html` redirects to `three-battle/index.html`. `three-battle/README.md` documents an isolated session and battle implementation. Separately, `dd-app-bootstrap.js` retains 19 Phase 6 sources and the bundle builder derives its inputs from that list.

`source-files.json` describes Phase 4.4.4, `sources.json` describes Phase 4.4.3, and `load-order.json` describes Phase 6. These may be historical subsystem descriptions rather than simple errors. **Do not overwrite their phase labels until consumers and intended ownership are established.**

## Safe reconciliation sequence

1. Enumerate every registry consumer, including runtime code, tools, and generated files.
2. For each candidate, record source SHA, all path and global-name references, and whether its file is fetched or executed.
3. Separate current product, retained legacy runtime, Studio validation, and archival-history requirements.
4. Make coordinated registry/path changes only after tests are defined. Historical snapshots stay immutable.
5. Run Studio validation, Phase 6 bundle rebuild/check, and Three.js smoke tests before approving any relocation.

## Decision

**Hold all further JavaScript moves.** This audit establishes that Studio diagnostics actively fetches some retired-load scripts and that ownership indexes retain others. No application or registry behavior is changed by this document.

## Follow-up source inspection — 2026-10-31

Verified at commit `ba4aafdb2cc0c5e924d0b114b3f20fdefd1221ae`:

- `assets/js/studio-validation-engine.js` declares `SOURCE_REGISTRY = "/studio/diagnostics/sources.json"` and fetches registry `source.path` as text or JSON (around lines 357–360). This is an actual file-availability dependency, not merely documentation.
- `assets/js/studio-phase37-ownership-validator.js` loads `/studio/databytesprites/source-files.json` and uses indexed records for canonical-owner checks, duplicate-owner detection, and UI-canon checks. Classification edits can change validation findings without changing gameplay.
- `assets/js/dd-mobile-game-tray-4-2.js` is a 43-line styling-only module guarded by a pathname check. It mentions `dd-battle-centerline-fix-4-3.js` **only in a comment**; it does not import or dynamically load that module. Correct the earlier “code dependency” shorthand: this is a documented division of styling responsibility, not a verified runtime dependency edge.
- `assets/js/dd-status-battle-flow.js` exposes `window.DD_STATUS_BATTLE_FLOW`, and is not one of the 19 `dd-app-bootstrap.js` registered bundle inputs. A global-name reference audit remains necessary before moving it.

**Status:** still no approved script moves. Required next checks: all page entrypoints and script tags, global references, dynamic loaders, Studio registry fetch outcomes, workflow validation and Three.js smoke testing. GitHub text search alone cannot certify absence of use.
