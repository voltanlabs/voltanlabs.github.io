# Data Discovery Runtime and Retirement Evidence Register

Audit baseline: `72cdc3802dc01792b66aba32996bead47268cce9` (main). Scope: repository static references and selected source/manifest inspection. This register is **not** proof of runtime execution or an exhaustive dependency graph. Status: **no JavaScript retirement approved**.

## Runtime boundaries

- **Current public entry:** `/databyte-discovery.html` redirects to `/three-battle/index.html?from=legacy-discovery`. The standalone Three.js product has its own `main.js`, `session.js`, battle modules and persistence namespace (see `three-battle/README.md`). Preserve this tree.
- **Phase 6 compatibility/product runtime:** `assets/js/dd-app-bootstrap.js` registers **19** ordered modules. `studio/tools/build-data-discovery-runtime.mjs` reads this registry and regenerates `assets/js/dd-runtime-bundle.js`. Treat all 19 sources, bootstrap, bundle, and builder as **protected** pending a separate lifecycle decision.
- **Studio:** `studio/runtime/load-order.json` tracks Phase 6 active and legacy modules. `studio/databytesprites/source-files.json`, `studio/databytesprites/mechanics-graph.json`, and `studio/diagnostics/sources.json` independently reference source paths. A module omitted from the Phase 6 boot list may still be consumed by Studio.
- **Workflow:** `.github/workflows/rebuild-data-discovery-runtime.yml` validates hard-coded older shell/phase versions. Review separately; do not interpret its checks as proof of current runtime correctness.

## Retirement candidates — hold pending verification

| Candidate | Observed repository references | Classification | Before any move |
| --- | --- | --- | --- |
| `assets/js/dd-status-battle-flow.js` | Phase 6 legacy manifest; Studio source index; Studio mechanics graph; own source | **HOLD — Studio-indexed** | Check Studio path consumers, status-flow globals, and runtime tests; update indexes atomically |
| `assets/js/dd-mobile-game-tray-4-2.js` | Phase 6 legacy manifest; Studio diagnostics current and historical; docs; potential dependent patch | **HOLD — diagnostics-indexed** | Verify diagnostics fetch behavior and dependency chain |
| `assets/js/dd-battle-centerline-fix-4-3.js` | Referenced by mobile game tray source; Studio diagnostics current and historical; manifest; docs | **HOLD — code dependency** | Audit caller and any dynamic loads |
| `assets/js/dd-unified-scanner-shell-4-3.js` | Phase 6 legacy manifest; Studio reference and bookkeeping docs | **CANDIDATE — not cleared** | Search alternate filename/global references and direct page imports |
| `assets/js/databyte-capture-pool.js` | Phase 6 legacy manifest; legacy inventory documentation | **CANDIDATE — not cleared** | Check globals, external pages, Studio and generated assets |
| `assets/js/databyte-ability-bridge.js` | Phase 6 legacy manifest; legacy inventory documentation | **CANDIDATE — not cleared** | Check future ability consumers, global names and data bridges |

Other previously flagged bridges and wrappers (`databyte-balance-bridge.js`, `databyte-move-bridge.js`, `databyte-type-bridge.js`, `dd-unified-scanner-shell-4-3-once.js`) remain **unreviewed**, not cleared.

## Important documentation drift

- `studio/databytesprites/source-files.json` still describes Phase 4.4.4.
- `studio/diagnostics/sources.json` still describes recovery state 4.4.3.
- `studio/runtime/load-order.json` describes Phase 6, while the current public entry redirects to Three.js.
- Runtime rebuild workflow contains checks for shell 4.10.6 and product phase 6.0.6 despite newer source references.

Do not simply rewrite these manifests as Three.js manifests: they may intentionally describe the retained legacy subsystem. First document the intended product boundaries and Studio coverage.

## Retirement gate (all required)

1. Inspect current public HTML, Three.js imports, Phase 6 bootstrap and bundle inputs, Studio source registries, diagnostics and GitHub Actions.
2. Search for path references **and** basename, exported globals, dynamic script loaders, and generated bundle references. GitHub code search may miss files or references.
3. Check historical and deep-link entry points and whether their URLs are intentionally supported.
4. Preserve file content exactly when relocating; update any live paths, documentation, indexes, and diagnostics in the same atomic commit.
5. Run relevant builds, static reference checks, and smoke tests; verify no broken fetches or runtime imports.
6. Record source/destination, replacement owner, evidence, validation result, and commit SHA here.

## Current decision

**No runtime assets moved in this audit.** The register is a planning and safety record; absence from a load-order list alone is insufficient evidence of non-use.
