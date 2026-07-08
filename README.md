# VoltanLabs Studio

VoltanLabs Studio is an offline-first software development platform for building games, AI tools, creative software, documentation systems, simulations, and future commercial products.

The project has grown from a collection of browser tools into a modular Studio architecture built around a shared runtime, searchable knowledge indexes, diagnostics, reusable assets, project-specific intelligence, and repository health automation.

## Current Focus

**Data Discovery Phase 4.3: Unified Scanner Shell Compatibility is active.**

The current priority is stabilizing DataByteSprites: Data Discovery as a mobile-first Scanner OS shell. The live game now boots through dedicated runtime owners for roster data, Studio data overlays, gameplay rules, encounter generation, capture/download logic, battle state, battle presentation, collection, party, inventory, Dex progress, and Product App v3.5 UI orchestration.

Current stabilization goals:

- Keep Scan, Encounter, Battle, Download, Dex, Party, Items, and Admin views inside one stable app shell.
- Consolidate Phase 4 layout compatibility layers into one canonical Scanner OS runtime.
- Replace repeated layout patches with direct runtime ownership.
- Keep Diagnostics, the Knowledge Engine, source ownership, runtime manifests, mechanics graphs, README, ROADMAP, and PROJECT_STATE synchronized.
- Continue splitting gameplay state out of Product App v3.5 into dedicated runtime modules.

## Live Studio Areas

- `/studio/` — VoltanLabs Studio shell and global search UI.
- `/studio/diagnostics/` — Studio Intelligence dashboard and repository health control center.
- `/studio/runtime/` — runtime load-order visualizer.
- `/studio/knowledge/index.v2.json` — Knowledge Engine v2 registry.
- `/studio/diagnostics/sources.json` — diagnostics source registry.
- `/studio/validation/rules.json` — validation rules manifest.
- `/studio/validation/phase-1.2-completion.json` — Phase 1.2 completion and handoff manifest.
- `/studio/databytesprites/` — DataByteSprites project indexes.
- `/studio/assets/index.json` — Asset Library index.
- `/technology-vault/` — Technology Vault foundation.
- `/tools.html` — Creator Suite entry point.
- `/databyte-discovery.html` — DataByteSprites: Data Discovery live runtime.
- `/databytedex.html` — DataByteDex shared roster view.

## Documentation Map

| Document | Path | Status |
| --- | --- | --- |
| Living Project State | `PROJECT_STATE.md` | Active source of truth |
| Roadmap | `ROADMAP.md` | Active |
| Site Strategy | `SITE_STRATEGY.md` | Active |
| Runtime Load Order | `studio/runtime/load-order.json` | Active |
| Diagnostics Sources | `studio/diagnostics/sources.json` | Active |
| Runtime Ownership Audit | `docs/databyte-runtime-ownership-audit.md` | Active |
| Gameplay Ownership Audit | `docs/databyte-gameplay-ownership-audit.md` | Active |
| Phase 4 Bookkeeping | `docs/datadiscovery-phase-4-bookkeeping.md` | Active |
| Studio Game Integration Roadmap | `studio/docs/STUDIO_GAME_INTEGRATION_ROADMAP.md` | Active |
| Repository Audit | `docs/phase-2.1-repository-audit.md` | Reference |
| Architecture Map | `ARCHITECTURE.md` | Reference |
| Repository Map | `REPOSITORY_MAP.md` | Reference |
| Diagnostics Reference | `DIAGNOSTICS.md` | Reference |
| Validation Reference | `VALIDATION.md` | Reference |
| Knowledge Engine Reference | `KNOWLEDGE_ENGINE.md` | Reference |
| Module Index | `MODULE_INDEX.md` | Reference |
| Release Notes | `RELEASE_NOTES_PHASE2.md` | Reference |

## Architecture Overview

```text
VoltanLabs Studio
├── Studio Shell
│   ├── Module registry
│   ├── Dashboard renderer
│   └── Studio search UI
├── Knowledge Engine v2
│   ├── Module indexes
│   ├── Asset indexes
│   ├── Technology indexes
│   ├── DataByteSprites indexes
│   └── Common search model
├── Diagnostics / Studio Intelligence
│   ├── Source registry
│   ├── Validation rules
│   ├── Repository Integrity Engine
│   ├── Health Calibrator
│   ├── Repository Intelligence
│   ├── Repository Health History
│   ├── Auto Repair Engine
│   ├── Dependency Explorer
│   ├── Dependency Graph Viewer
│   ├── Coverage Heat Map
│   ├── Repository Evolution Dashboard
│   ├── Knowledge coverage metrics
│   └── Actionable repair suggestions
├── Runtime System
│   ├── Load-order manifest
│   ├── Runtime loader
│   ├── Runtime health panel
│   └── Bridge health checks
├── Creator Suite
│   ├── Draw Tool
│   ├── Gif Forge
│   ├── PromptCraft
│   └── Future production tools
└── Projects
    └── DataByteSprites
        ├── Game data manifest
        ├── Species index
        ├── Lore index
        ├── Source-file index
        ├── Mechanics graph
        ├── Move index
        ├── Type chart
        ├── Ability index
        ├── Encounter Runtime
        ├── Capture / Download Runtime
        ├── Gameplay Rules Runtime
        ├── Battle Engine Runtime
        ├── Battle State Runtime
        ├── Battle Presentation Runtime
        ├── Collection Runtime
        ├── Party Runtime
        ├── Party Switch Runtime
        ├── Inventory Runtime
        ├── Dex Runtime
        └── Product App v3.5
```

For the current implementation state, see `PROJECT_STATE.md`, `ROADMAP.md`, `studio/runtime/load-order.json`, `docs/databyte-runtime-ownership-audit.md`, and `docs/databyte-gameplay-ownership-audit.md`.

## Completed Foundation

### Studio Foundation

Status: complete foundation.

- Studio shell published to the live `main` branch.
- Module registry is live.
- Studio dashboard renders from registry data.
- Knowledge Engine v2 is live.
- Studio search can consume multiple Knowledge Engine record types.
- Diagnostics page is live.
- Runtime Visualizer is live.
- Runtime load-order manifest is live.

### Phase 1.2 Repository Integrity Engine

Status: complete foundation.

Phase 1.2 upgraded Diagnostics from basic source checks into a repository-wide architecture analyzer.

Completed capabilities:

- Repository-wide ID graph.
- Cross-index validation.
- Duplicate ID detection.
- Orphan record detection.
- Runtime dependency validation.
- Mechanics graph validation.
- Knowledge coverage metrics.
- Dependency Explorer.
- Source-aware findings.
- Actionable repair suggestions.
- Documentation drift validation.
- Repository Health Dashboard.

The completion manifest lives at `studio/validation/phase-1.2-completion.json`.

### Phase 2.0 Studio Intelligence Dashboard

Status: complete foundation.

Phase 2.0 turned `/studio/diagnostics/` into the Studio Control Center.

Implemented modules:

- `assets/js/studio-diagnostics-intelligence.js` — grouped findings, top priorities, and repair categories.
- `assets/js/studio-health-history.js` — local report snapshots, trends, sparklines, export, and history reset.
- `assets/js/studio-auto-repair-engine.js` — dry-run repair plans, fix classifications, projected health impact, and repair exports.
- `assets/js/studio-dependency-graph-viewer.js` — dependency graph model, node cloud, edge stream, unresolved edges, endpoint hints, and graph export.
- `assets/js/studio-coverage-heat-map.js` — subsystem readiness scoring, drill-down findings, JSON export, and Markdown export.
- `assets/js/studio-repository-evolution-dashboard.js` — maturity score, readiness stage, milestone tracker, technical debt summary, highest-risk subsystem, next milestone, and executive exports.

### DataByteSprites Runtime Foundation

Status: active Phase 4.3 stabilization.

Live Data Discovery runtime chain:

```text
databyte-discovery.html
├── dd-canon-roster.js
├── dd-studio-data-bridge.js
├── dd-battle-engine-2-4.js
├── dd-gameplay-rules-2-4.js
├── dd-capture-runtime.js
├── dd-encounter-runtime.js
├── dd-battle-balance-2-4.js
├── dd-battle-resolver.js
├── dd-battle-state-runtime.js
├── dd-battle-presentation-runtime.js
├── dd-collection-runtime.js
├── dd-party-runtime.js
├── dd-party-switch-runtime.js
├── dd-inventory-runtime.js
├── dd-dex-runtime.js
├── dd-collection-dex-runtime-bridge.js
├── databyte-discovery-product-app-v3-5.js
├── dd-party-switch-battle-bridge.js
├── dd-party-switch-ui.js
├── dd-party-switch-refresh.js
├── dd-battle-experience-4-2.js
├── dd-layout-viewport-lock-4-2.js
├── dd-mobile-game-tray-4-2.js
├── dd-unified-scanner-shell-4-3.js
├── dd-battle-centerline-fix-4-3.js
├── dd-health-signal-bridge.js
└── dd-scan-bg.js
```

Current Phase 4.3 runtime owners:

- `assets/js/dd-encounter-runtime.js` — encounter generation, rarity pools, signal initialization.
- `assets/js/dd-capture-runtime.js` — download odds, caps, rolls, failed-download bonuses, and Signal Boost behavior.
- `assets/js/dd-gameplay-rules-2-4.js` — gameplay rules for capture/download, stability, and move tuning.
- `assets/js/dd-battle-engine-2-4.js` — type utilities, enemy move choice, battle events, audio/animation hooks.
- `assets/js/dd-battle-resolver.js` — turn order, hit checks, damage math, enemy move choice, and capture pressure output.
- `assets/js/dd-battle-state-runtime.js` — battle state transitions.
- `assets/js/dd-battle-presentation-runtime.js` — battle presentation hooks.
- `assets/js/dd-collection-runtime.js` — downloaded sprite collection state.
- `assets/js/dd-party-runtime.js` — party state and lead sprite resolution.
- `assets/js/dd-party-switch-runtime.js` — party switching foundation.
- `assets/js/dd-inventory-runtime.js` — ByteCoins, boosts, and repair item state.
- `assets/js/dd-dex-runtime.js` — Dex progress state.
- `assets/js/databyte-discovery-product-app-v3-5.js` — active UI orchestration for scanner, encounter, battle, download, party, items, Dex, and Admin.
- `assets/js/dd-unified-scanner-shell-4-3.js` and `assets/js/dd-battle-centerline-fix-4-3.js` — Phase 4.3 compatibility layer for unified Scanner OS shell and centering.

### DataByteSprites Knowledge Base

Status: active foundation.

Live indexes include:

- `studio/databytesprites/game-data.v1.json`
- `studio/databytesprites/species.json`
- `studio/databytesprites/lore.json`
- `studio/databytesprites/source-files.json`
- `studio/databytesprites/mechanics-graph.json`
- `studio/databytesprites/moves.json`
- `studio/databytesprites/type-chart.json`
- `studio/databytesprites/abilities.json`

These are registered through `studio/knowledge/index.v2.json` and Diagnostics.

## Roadmap

See `ROADMAP.md` for the dedicated roadmap.

Summary:

- Phase 1: Validation Engine — complete foundation.
- Phase 1.2: Repository Integrity & Actionable Diagnostics — complete foundation.
- Phase 2.0: Studio Intelligence Dashboard — complete foundation.
- Phase 2.1: Documentation & Architecture Audit — complete foundation / reference.
- Phase 2.2: Predictive Diagnostics — active foundation.
- Phase 2.3: Shared Game Data Pipeline — active foundation.
- Phase 2.4: Battle Engine and Gameplay Consolidation — active foundation.
- Phase 3: DataByteSprites Runtime Integration — complete foundation.
- Phase 4.1: Party switching foundation — active foundation.
- Phase 4.2: Battle experience and mobile layout stabilization — active compatibility.
- Phase 4.3: Unified Scanner Shell Compatibility — active stabilization.
- Phase 5: Studio AI Development Assistant — future milestone.

## Development Rules

- Repository-first development.
- Offline-first architecture.
- Small, safe commits.
- Push after each completed phase.
- Do not invent commits or SHAs.
- Prefer indexes, manifests, and registries over hardcoded one-off wiring.
- Keep live `main` and development branches reconciled where possible.
- Documentation must match the implementation state after each major phase.

## Current Highest-Value Task

Continue the **Phase 4.3 Scanner OS stabilization pass** by consolidating duplicated layout compatibility layers, reducing Product App v3.5 rendering ownership, keeping runtime ownership records current, and rerunning Diagnostics after each safe pass.
