# VoltanLabs Studio

VoltanLabs Studio is an offline-first software development platform for building games, AI tools, creative software, documentation systems, simulations, and future commercial products.

The project has grown from a collection of browser tools into a modular Studio architecture built around a shared runtime, searchable knowledge indexes, diagnostics, reusable assets, project-specific intelligence, and repository health automation.

## Current Focus

**Phase 3: DataByteSprites Runtime Integration and Repository Stabilization is active.**

The current priority is stabilizing the Phase 3 Data Discovery runtime after the split-module cutover. Data Discovery now boots through dedicated runtime owners for encounters, capture, gameplay rules, battle helpers, and Product App v3 UI orchestration.

Current stabilization goals:

- Clear blocking validation errors.
- Reduce orphan records.
- Resolve dependency graph edges.
- Align documentation with the Phase 3 runtime.
- Keep Diagnostics, the Knowledge Engine, source ownership, runtime manifests, and gameplay maps synchronized.

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
| Living Project State | `PROJECT_STATE.md` | Active |
| Roadmap | `ROADMAP.md` | Active |
| Site Strategy | `SITE_STRATEGY.md` | Active |
| Runtime Ownership Audit | `docs/databyte-runtime-ownership-audit.md` | Active |
| Gameplay Ownership Audit | `docs/databyte-gameplay-ownership-audit.md` | Active |
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
        ├── Capture Runtime
        ├── Gameplay Rules Runtime
        ├── Battle Engine Runtime
        └── Product App v3
```

For the current implementation state, see `PROJECT_STATE.md`, `ROADMAP.md`, `docs/databyte-runtime-ownership-audit.md`, and `docs/databyte-gameplay-ownership-audit.md`.

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

Status: active Phase 3 stabilization.

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
└── databyte-discovery-product-app-v3.js
```

Current Phase 3 runtime owners:

- `assets/js/dd-encounter-runtime.js` — encounter generation, rarity pools, signal initialization.
- `assets/js/dd-capture-runtime.js` — capture odds, capture caps, capture rolls, failed-capture bonuses, Signal Boost behavior.
- `assets/js/dd-gameplay-rules-2-4.js` — gameplay rules for capture/stability/move tuning.
- `assets/js/dd-battle-engine-2-4.js` — type utilities, enemy move choice, battle events, audio/animation hooks.
- `assets/js/databyte-discovery-product-app-v3.js` — UI orchestration for scanner, encounter, battle, capture, party, items, Dex, and Admin.

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
- Phase 3: DataByteSprites Runtime Integration — active stabilization.
- Phase 4: Asset Library and Technology Vault Expansion — planned expansion.
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

Continue the **Repository Stabilization Pass** by reducing orphan records, resolving dependency graph edges, aligning the Knowledge Engine with Phase 3 runtime ownership, and rerunning Diagnostics until repository health reaches the healthy band.
