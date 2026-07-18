# VoltanLabs Repository Guidance

This file governs work throughout this repository. It describes the current architecture and the rules contributors and coding agents must follow. More-specific `AGENTS.md` files may add local requirements, but they must not weaken the ownership, validation, recovery, or documentation rules defined here.

## Project Mission and Current State

VoltanLabs is an offline-first, browser-first software studio and product repository hosted as a static GitHub Pages site. Its flagship product is **DataByteSprites: Data Discovery**. The repository also contains VoltanLabs Studio, Studio Intelligence and diagnostics, the Knowledge Engine, the Generator/Creator Suite, the Technology Vault, and public product pages.

The active milestone is **Data Discovery Phase 6.0.4 Progression Loop + Runtime Recovery**, loaded by bootstrap 1.9.4 as one generated bundle containing 19 explicitly ordered browser modules. The live shell is v4.10.2. Older documents and legacy files may describe v3, v3.5, or the Phase 4 compatibility chain; do not assume that the newest-looking filename or document is active. The live HTML entry point, bootstrap registry, runtime manifest, ownership map, and exported browser globals must agree before behavior changes are merged.

Runtime consolidation and deterministic recovery remain the baseline for feature work. Do not hide damaged canonical data or generators behind new fallback logic.

## Architectural Model

The project has no bundler or framework-level module graph. Runtime composition is controlled by HTML script order, browser globals, custom DOM events, JSON registries, and `localStorage`.

The intended product flow is:

```text
Studio-authored canonical data
  -> Studio Data Bridge
  -> Gameplay and state runtimes
  -> Dedicated screen and control owners
  -> DD_PRODUCT_APP_V4_SHELL
  -> Compatibility adapters and visual-only helpers
  -> Player UI
```

The major repository areas are:

- `/` — public site pages, product entry points, and top-level governance documents.
- `/assets/js/` — Data Discovery runtimes, Studio Intelligence modules, bridges, compatibility modules, and shared browser code.
- `/studio/` — Studio shell, diagnostics, runtime visualizer, Knowledge Engine, DataByteSprites canonical data, validation data, and repository tools.
- `/studio/databytesprites/` — canonical structured DataByteSprites indexes and generated game-data manifests.
- `/studio/diagnostics/` — browser diagnostics entry point, source registry, and report snapshots.
- `/studio/runtime/` — runtime manifest and observability tools; it does not replace the live product HTML boot chain.
- `/character-forge/`, `/gif-forge/`, `/sprite-sheet-forge/`, and `/promptcraft.html` — Generator/Creator Suite tools.
- `/technology-vault/` — data-driven technology and licensing reference.
- `/archive/` — historical references only. Archived files must never become active runtime owners by accident.
- `/docs/` — architecture snapshots, ownership maps, audits, recovery plans, and historical phase records.

## Sources of Truth

Use evidence in this order when determining current behavior:

1. The scripts actually loaded by the active HTML entry point.
2. The globals, events, storage keys, and behavior implemented by those loaded scripts.
3. `docs/data-discovery-ownership-map.md` and the current architecture freeze.
4. `studio/runtime/load-order.json`, `studio/databytesprites/source-files.json`, and `studio/databytesprites/mechanics-graph.json`.
5. `README.md`, `PROJECT_STATE.md`, and current recovery documentation.
6. Historical phase documents and archived code.

When these disagree, report the discrepancy. Do not silently select whichever source supports the desired change.

## Runtime Ownership Rules

Every stateful or behavioral concern must have one canonical owner. Other modules may call that owner, render its output, or provide compatibility aliases; they must not independently implement the same rules.

Current canonical boundaries are:

- `dd-canon-roster.js` owns the public fallback roster.
- `dd-studio-data-bridge.js` owns loading and normalizing Studio-authored runtime data.
- `dd-status-runtime.js` owns status definitions, status application rules, modifiers, action gates, durations, stacks, and status lifecycle.
- `dd-gameplay-rules-2-4.js` owns shared gameplay tuning baselines.
- `dd-encounter-runtime.js` owns encounter selection, rarity pools, and initial encounter signal/stability.
- `dd-capture-runtime.js` owns Download/capture odds, caps, attempts, failed-attempt bonuses, and Download-related item effects.
- `dd-battle-core-runtime.js` owns battle calculation, application, turn order, retaliation, transaction guards, faint decisions, and terminal results in one synchronous event-free transaction.
- `dd-battle-reward-runtime.js` owns idempotent reward calculation and application, XP thresholds, levels, stat growth, Version Upgrade tiers, and persistent battle history.
- `dd-player-runtime.js` owns collection, party, active slot, forced switching, inventory, Dex, individual saved progression, rolling backups, and party recovery. Its legacy domain globals are compatibility views only.
- Dedicated `DD_*_SCREEN` globals own screen markup and screen-specific presentation.
- `DD_BATTLE_CONTROLS` owns battle control markup and control layout.
- `DD_PRODUCT_APP_V4_SHELL` owns boot, routing, context construction, screen registry dispatch, action binding, lifecycle coordination, turn-transaction safety, and recovery from control locks.
- `dd-app-bootstrap.js` owns the single module entry point and ordered bundle readiness contract; `studio/tools/build-data-discovery-runtime.mjs` reproducibly builds the loaded bundle from that registry.
- Legacy engine, resolver, state, Scanner OS, viewport, health-signal, party-switch UI, battle-experience, and similar compatibility modules are not loaded. They remain reference or archive material unless ownership is explicitly transferred and documented.

The application shell must not absorb battle math, Download math, status rules, persistence rules, canonical content, or dedicated screen markup. Domain runtimes must not manipulate screen layout. Presentation modules must not mutate canonical battle state.

Signal/stability is encounter integrity; it is not the wild sprite's HP. HP and signal must not share storage, calculation, or display ownership.

## Browser Runtime Contracts

- Treat HTML script order as a dependency graph. Never reorder scripts without checking `requires`, global availability, ready events, and the runtime manifest.
- Do not introduce a new global if an existing owner can expose the required method or event.
- Namespaced globals must identify a single owner and publish enough metadata for diagnostics, normally `owner`, `version`, and capability methods.
- Prefer structured inputs and results over shared mutable objects.
- Custom events must use stable, namespaced names and documented detail shapes.
- Avoid polling when an owner can emit a lifecycle or state-change event.
- Keep storage keys centralized in their domain owner. New code must not write another owner's `localStorage` key directly.
- Reads may support migration aliases, but writes should target one canonical schema and key.
- Fallback behavior must be explicit, observable, and tested. A fallback must not make invalid canonical data appear healthy.
- Use defensive feature detection for optional compatibility modules, but fail visibly when a required canonical owner is absent.

## Coding Standards

- Preserve the browser-first, static-hosting architecture unless an approved architecture decision changes it.
- Write dependency-free JavaScript where practical. Repository Node tools should use built-in Node modules unless a dependency is deliberately introduced and documented.
- Match the style of the file being changed. Do not perform unrelated formatting rewrites.
- Prefer small modules with one owner and a narrow public API over patch-layer files or monolithic rewrites.
- Do not create new filenames containing `copy`, `fix`, `stable`, `final`, or another version suffix as a substitute for defining ownership. Extend or replace a canonical owner through an explicit migration.
- Keep IDs stable, lowercase, and machine-safe. Do not silently rename species, move, ability, module, source, or mechanics IDs.
- Keep canonical Configuration and Alignment separate. Alignment values are `Pristine`, `Stained`, and `Null`; configuration fields must use the canonical Configuration Chart vocabulary.
- Normalize data at system boundaries, not repeatedly in every caller.
- Escape user- or data-supplied strings before inserting HTML.
- Avoid inline application logic in new HTML when the behavior belongs to a reusable module.
- Do not add remote runtime dependencies to offline-first tools without documenting the offline degradation path.
- Preserve accessibility basics: semantic controls, labels, keyboard operation, visible focus, readable contrast, and non-color-only state indicators.
- Do not edit vendored libraries to implement product behavior.
- Never make a broad file move or deletion until references, HTML loads, manifests, documentation, and archive requirements have been audited.

## Battle Runtime Standards

Battle work must preserve a deterministic transaction boundary:

```text
user action
  -> shell locks controls
  -> battle core calculates and applies one structured turn
  -> player owner persists party effects once
  -> reward owner applies terminal rewards once
  -> presentation renders resulting context
  -> shell unlocks or enters a terminal/forced-switch state
```

- Never calculate and apply the same damage in separate owners.
- Never apply a battle-core result more than once.
- Maintain explicit turn IDs or equivalent guards against duplicate dispatch.
- Forced switching, fainting, Download eligibility, victory, defeat, and return-to-scanner are state decisions, not CSS or screen decisions.
- Visual effects and messages may observe outcomes but must not determine them.
- Any battle change requires regression coverage for player/enemy ordering, misses, statuses, fainting, switching, Download success/failure, rewards, persistence, and control-unlock recovery as applicable.

## Studio and Diagnostics Standards

Studio Intelligence is a reporting and planning system. Browser modules may read repository-served resources, compute reports, save browser-local history, and export reports. They must not claim to have mutated repository files.

- `window.VOLTAN_VALIDATION_REPORT` is the base diagnostics report contract.
- Companion modules must consume reports without rewriting another module's result in place unless that mutation is part of a documented manager contract.
- `window.VOLTAN_STUDIO_INTELLIGENCE` is the consolidated intelligence contract.
- Diagnostics findings must retain source paths and stable finding IDs.
- A health score must not suppress parse errors, missing canonical owners, broken generators, or unresolved required dependencies.
- The runtime manifest must be compared with the active HTML load chain; validating the manifest alone is insufficient.
- Auto-repair remains dry-run/report-only unless a separately trusted repository-writing workflow is explicitly approved.

## Generator Suite Process

“Generator Suite” covers both creative browser tools and repository data generators. State which category a change affects.

### Creative tools

The intended asset workflow is:

```text
Draw Parts
  -> Character Forge 2D/3D
  -> pose/frame export
  -> GIF Forge or Sprite Sheet Forge
  -> named asset export
  -> future Studio Asset Library registration
```

Creative-tool changes must:

1. Preserve local/offline operation, including local workers and vendored libraries.
2. Define accepted input formats, dimensions, coordinate systems, and transparency behavior.
3. Produce deterministic filenames and export metadata where possible.
4. Revoke temporary object URLs and release canvas/worker resources.
5. Verify empty input, malformed input, large input, export cancellation, and repeated export.
6. Keep tool-specific state isolated; do not invent incompatible project formats without documenting them.
7. Update `tools.html`, relevant tool help text, and Studio/Knowledge registration when a tool or export contract changes.

### Data generators and reconstructors

Canonical generated data must be reproducible from named source files. Recovery utilities must graduate into deterministic generators or validators; do not leave one-off repair scripts as permanent authority.

For generator work:

1. Identify canonical inputs, output, schema version, generator identity, and ordering rules.
2. Parse and validate every input before generating output.
3. Produce deterministic formatting and record ordering.
4. Write atomically; never leave a partial canonical file after failure.
5. Support a non-writing `--check` mode that fails when output is invalid or stale.
6. Support strict validation where warnings must block release.
7. Run `node --check` on the generator before executing it.
8. Run the DataByteSprites validator and parse every JSON file after generation.
9. Review the generated diff; do not hand-edit generated output unless the generator is being recovered and the exception is documented.
10. Update schemas, manifests, source registries, ownership maps, diagnostics rules, and generator documentation in the same logical change.

There must be one canonical game-data generator. Reconstructed variants are recovery evidence until explicitly promoted or archived. Do not run a writing generator while its sources or its current output fail JSON parsing. Do not report the pipeline healthy merely because runtime fallbacks allow the browser application to boot.

The expected validation sequence, once the canonical scripts are recovered, is:

```powershell
node --check studio/tools/generate-game-data.mjs
node studio/tools/validate-databytesprites.mjs
node studio/tools/generate-game-data.mjs --check --strict
node --check studio/tools/reconstruct-species-index.mjs
```

Use the repository-supported Node version from CI (currently Node 20) or a compatible later version. Record deviations when diagnosing version-specific failures.

## Validation Requirements

Run checks proportional to the change. A normal recovery or runtime change should verify:

- Git status before and after work.
- Syntax for every changed JavaScript or MJS file.
- Parsing for every changed JSON file and, for canonical-data work, all repository JSON files.
- Canonical generator `--check` and strict validation.
- All local `src` and `href` references affected by the change.
- Active HTML load order against `studio/runtime/load-order.json`.
- Required global owners and ready events.
- Duplicate ownership of state, calculations, storage keys, markup, and CSS layout.
- Data Discovery's Scanner -> Encounter -> Battle -> Download -> Collection -> DataByteDex vertical slice.
- Relevant viewport and keyboard behavior for UI changes.
- A clean console for the exercised path.

Do not regenerate snapshots, manifests, or canonical data merely to make a check pass. Diagnose the mismatch first.

## Documentation Requirements

Documentation is part of the implementation contract, not optional cleanup.

For architectural, ownership, runtime, schema, generator, or phase changes, update the relevant set of:

- `README.md`
- `PROJECT_STATE.md`
- `ROADMAP.md`
- `ARCHITECTURE.md`
- `REPOSITORY_MAP.md`
- `MODULE_INDEX.md`
- `docs/data-discovery-ownership-map.md`
- `docs/databyte-runtime-load-order.md`
- `studio/runtime/load-order.json`
- `studio/databytesprites/source-files.json`
- `studio/databytesprites/mechanics-graph.json`
- `studio/knowledge/index.v2.json`
- `studio/diagnostics/sources.json`
- `studio/intelligence/core.manifest.json`

Only update documents affected by the change, but do not leave two documents claiming different active owners or phases. Historical snapshots should remain historical: add a status note or superseding link instead of rewriting history to look current.

Documentation must distinguish:

- implemented and loaded,
- implemented but not loaded,
- compatibility-only,
- planned,
- legacy reference,
- archived,
- recovery-blocked.

Never describe a planned global, directory, export, or runtime as active before it exists and is connected to the live path.

## Commit Workflow

Use small, intentional commits organized by recovery boundary or ownership change.

Before editing:

1. Read this file and any more-specific repository guidance.
2. Inspect `git status` and preserve unrelated user changes.
3. Identify the active entry point, canonical owner, manifests, tests/checks, and affected documentation.
4. For risky work, capture the failing command or reproducible behavior before implementing a fix.

Before committing:

1. Review the complete diff, including generated files.
2. Run the required validation sequence.
3. Confirm that no source, manifest, or documentation file still names a superseded active owner.
4. Confirm that no debug output, temporary file, local path, credential, or generated backup is included.
5. Stage only files belonging to the commit's stated purpose.

Prefer conventional, imperative commit messages such as:

```text
fix: restore canonical DataByteSprites lore JSON
fix: recover deterministic game-data generation
refactor: consolidate battle presentation ownership
docs: synchronize v4 runtime ownership
test: add battle transaction regression coverage
```

Recommended recovery commit order:

1. Restore parseable canonical inputs without changing gameplay behavior.
2. Recover validators and one canonical deterministic generator.
3. Regenerate and validate canonical outputs.
4. Add CI gates for JSON, generators, references, and ownership.
5. Freeze the v4 vertical slice with regression tests.
6. Consolidate compatibility and presentation layers.
7. Expand features only after the recovery baseline is green.

Do not combine repository-wide formatting, file moves, behavior changes, generated-data changes, and documentation synchronization into one opaque commit.

## Change Safety and Legacy Policy

- Do not modify source code when a task is documentation-only.
- Do not delete or move legacy files solely because they appear unused. Verify HTML references, dynamic loading, globals, manifests, documentation, and recovery value first.
- Do not reactivate archived code to recover behavior without extracting that behavior into the current owner.
- Do not overwrite user changes or use destructive Git commands to obtain a clean tree.
- Do not introduce an architectural migration as an incidental fix. Document and approve the ownership transfer first.
- When uncertain whether a file is active, classify it through evidence and record the uncertainty instead of guessing.

## Current Recovery Risks

At the Phase 6.0.4 baseline, contributors must keep the following recovery risks visible until separately revalidated:

- Canonical `abilities.json`, `lore.json`, and `game-data.v1.json` have been observed failing JSON parsing.
- The canonical `studio/tools/generate-game-data.mjs` has been observed failing JavaScript syntax validation.
- The reconstructed generator reports missing or invalid battle statistics across the species index and incomplete ability, item, encounter, and type-rule coverage.
- Several older architecture documents reference directories or owners that do not exist in the current tree or are no longer active.
- Historical manifests, Studio registries, and architecture snapshots may still name unloaded Phase 4 owners; current documents must classify these as legacy rather than active.
- Authored Version Upgrade forms, per-tier move unlocks, and the upgrade ceremony are planned data/presentation work. The current runtime implements thresholds, tiers, stat growth, and history only.

Re-run the relevant checks before relying on this blocker list; update current-state documentation when a blocker is resolved.
