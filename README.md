# VoltanLabs Studio

VoltanLabs Studio is an offline-first software development platform for building games, AI tools, creative software, documentation systems, simulations, and future commercial products.

The project has grown from a collection of browser tools into a modular Studio architecture built around a shared runtime, searchable knowledge indexes, diagnostics, reusable assets, project-specific intelligence, and repository health automation.

## Current Focus

**Phase 2.0: Studio Intelligence Dashboard is complete as a foundation.**

The active handoff is **Phase 2.1: Documentation & Architecture Audit**. Phase 2.1 brings the repository documentation, architecture maps, module maps, and roadmaps back into alignment with the systems now implemented in the Studio.

Primary Phase 2.1 documents:

- `docs/phase-2.1-repository-audit.md`
- `ARCHITECTURE.md`
- `REPOSITORY_MAP.md`
- `DIAGNOSTICS.md`
- `VALIDATION.md`
- `KNOWLEDGE_ENGINE.md`
- `MODULE_INDEX.md`
- `ROADMAP.md`
- `RELEASE_NOTES_PHASE2.md`

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

## Documentation Map

| Document | Path | Status |
| --- | --- | --- |
| Repository Audit | `docs/phase-2.1-repository-audit.md` | Active |
| Architecture Map | `ARCHITECTURE.md` | Active |
| Repository Map | `REPOSITORY_MAP.md` | Active |
| Diagnostics Reference | `DIAGNOSTICS.md` | Active |
| Validation Reference | `VALIDATION.md` | Active |
| Knowledge Engine Reference | `KNOWLEDGE_ENGINE.md` | Active |
| Module Index | `MODULE_INDEX.md` | Active |
| Roadmap | `ROADMAP.md` | Active |
| Release Notes | `RELEASE_NOTES_PHASE2.md` | Active |

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
│   ├── Dependency Graph Viewer
│   ├── Coverage Heat Map
│   └── Repository Evolution Dashboard
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
        ├── Species index
        ├── Lore index
        ├── Source-file index
        ├── Mechanics graph
        ├── Move index
        ├── Type chart
        └── Ability index
```

For the full architecture map, see `ARCHITECTURE.md`. For the repository directory/status map, see `REPOSITORY_MAP.md`. For technical references, see `DIAGNOSTICS.md`, `VALIDATION.md`, `KNOWLEDGE_ENGINE.md`, and `MODULE_INDEX.md`. For planning and history, see `ROADMAP.md` and `RELEASE_NOTES_PHASE2.md`.

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

### DataByteSprites Knowledge Base

Status: complete foundation.

Live indexes include:

- `studio/databytesprites/species.json`
- `studio/databytesprites/lore.json`
- `studio/databytesprites/source-files.json`
- `studio/databytesprites/mechanics-graph.json`
- `studio/databytesprites/moves.json`
- `studio/databytesprites/type-chart.json`
- `studio/databytesprites/abilities.json`

These are registered through `studio/knowledge/index.v2.json` and are searchable from the Studio UI.

### Runtime Foundation

Status: active foundation.

Live runtime files include:

- `studio/runtime/load-order.json`
- `assets/js/studio-runtime-loader.js`
- `assets/js/studio-runtime-health.js`
- `assets/js/studio-runtime-bridge-checks.js`

The current runtime work focuses on making boot order, bridge health, and DataByteSprites runtime dependencies visible to the Studio.

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

## Roadmap

See `ROADMAP.md` for the dedicated roadmap.

Summary:

- Phase 1: Validation Engine — complete foundation.
- Phase 1.2: Repository Integrity & Actionable Diagnostics — complete foundation.
- Phase 2.0: Studio Intelligence Dashboard — complete foundation.
- Phase 2.1: Documentation & Architecture Audit — active.
- Phase 2.2: Predictive Diagnostics — planned.
- Phase 3: DataByteSprites Runtime Integration — planned.
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

Complete **Phase 2.1: Documentation & Architecture Audit** by expanding `KNOWLEDGE_ENGINE.md` and `MODULE_INDEX.md`, then move into **Phase 2.2: Predictive Diagnostics**.
