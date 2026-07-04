# VoltanLabs Studio Repository Map

Status: active  
Phase: 2.1 Documentation & Architecture Audit

## Purpose

This map explains the major repository areas, their current status, and how they relate to VoltanLabs Studio.

It separates active systems, active foundations, planned systems, and areas that need future audit or legacy classification.

## Status Legend

- **Active** — live system used by the current Studio.
- **Active foundation** — live or registered foundation that needs expansion or deeper documentation.
- **Planned** — intentionally registered or planned but not fully implemented.
- **Needs audit** — exists or is referenced, but needs classification during Phase 2.1.
- **Legacy candidate** — may be superseded by newer architecture and should not be expanded until reviewed.

## Top-Level Areas

| Path | Status | Owner / Purpose |
| --- | --- | --- |
| `/README.md` | Active | Main project summary and roadmap handoff. |
| `/ARCHITECTURE.md` | Active | Current Studio architecture map. |
| `/REPOSITORY_MAP.md` | Active | Repository area and ownership map. |
| `/DIAGNOSTICS.md` | Active | Studio Intelligence reference. |
| `/VALIDATION.md` | Active | Validation rules and report reference. |
| `/KNOWLEDGE_ENGINE.md` | Active | Knowledge Engine registry and index reference. |
| `/MODULE_INDEX.md` | Active | Studio module catalog. |
| `/ROADMAP.md` | Active | Dedicated project roadmap. |
| `/RELEASE_NOTES_PHASE2.md` | Active | Phase 2 release notes. |
| `/docs/` | Active foundation | Phase audits and future documentation set. |
| `/studio/` | Active | Main VoltanLabs Studio shell and internal systems. |
| `/assets/` | Active | Shared JavaScript, CSS, images, runtime helpers, and tool support files. |
| `/studio/databytesprites/` | Active | DataByteSprites project indexes. |
| `/studio/diagnostics/` | Active | Diagnostics dashboard and source registry. |
| `/studio/runtime/` | Active | Runtime visualizer and load-order system. |
| `/studio/knowledge/` | Active | Knowledge Engine registry. |
| `/studio/validation/` | Active | Validation rules and milestone manifests. |
| `/studio/modules/` | Active foundation | Module manifests for Studio areas. |
| `/studio/assets/` | Active foundation | Asset Library index. |
| `/technology-vault/` | Active foundation | Technology Vault foundation. |
| `/tools.html` | Active foundation | Creator Suite entry point. |

## Studio Directory Map

```text
studio/
├── index.html
├── assets/
│   └── index.json
├── databytesprites/
│   ├── abilities.json
│   ├── lore.json
│   ├── mechanics-graph.json
│   ├── moves.json
│   ├── source-files.json
│   ├── species.json
│   └── type-chart.json
├── diagnostics/
│   ├── index.html
│   └── sources.json
├── knowledge/
│   └── index.v2.json
├── modules/
│   ├── dashboard/
│   ├── databytesprites/
│   ├── runtime-visualizer/
│   ├── studio-diagnostics/
│   └── simulation-lab/
├── runtime/
│   ├── index.html
│   └── load-order.json
└── validation/
    ├── rules.json
    └── phase-1.2-completion.json
```

## Assets Directory Map

```text
assets/
├── js/
│   ├── studio-validation-engine.js
│   ├── studio-validation-health-calibrator.js
│   ├── studio-diagnostics-intelligence.js
│   ├── studio-health-history.js
│   ├── studio-auto-repair-engine.js
│   ├── studio-dependency-graph-viewer.js
│   ├── studio-coverage-heat-map.js
│   ├── studio-repository-evolution-dashboard.js
│   ├── studio-runtime-loader.js
│   ├── studio-runtime-health.js
│   └── studio-runtime-bridge-checks.js
└── other shared assets
```

## Documentation Map

| Document | Path | Status | Purpose |
| --- | --- | --- | --- |
| Main README | `README.md` | Active | Project overview, current status, and roadmap. |
| Phase 2.1 Audit | `docs/phase-2.1-repository-audit.md` | Active | Current documentation and architecture audit. |
| Architecture | `ARCHITECTURE.md` | Active | Layered Studio architecture and data flow. |
| Repository Map | `REPOSITORY_MAP.md` | Active | Directory map and ownership/status classification. |
| Diagnostics Reference | `DIAGNOSTICS.md` | Active | Full Studio Intelligence module reference. |
| Validation Reference | `VALIDATION.md` | Active | Validation engine and rules guide. |
| Knowledge Engine Reference | `KNOWLEDGE_ENGINE.md` | Active | Registry, index, ID, and search conventions. |
| Module Index | `MODULE_INDEX.md` | Active | Human-readable map of Studio modules. |
| Roadmap | `ROADMAP.md` | Active | Dedicated roadmap beyond README summary. |
| Release Notes | `RELEASE_NOTES_PHASE2.md` | Active | Phase 2 completion notes. |

## Active Systems

### Studio Shell

Path: `/studio/`

Status: active.

Purpose:

- Main internal Studio entry point.
- Presents registered modules.
- Connects to Knowledge Engine metadata.

### Diagnostics / Studio Intelligence

Path: `/studio/diagnostics/`

Status: active.

Purpose:

- Runs validation engine.
- Emits repository health report.
- Displays grouped findings, health history, repair plans, graph maps, coverage heat maps, and evolution dashboard.

### Knowledge Engine v2

Path: `/studio/knowledge/index.v2.json`

Status: active.

Purpose:

- Registers Studio modules and indexes.
- Acts as the primary metadata registry.
- Supports search, diagnostics, and future AI tools.

### DataByteSprites Knowledge Base

Path: `/studio/databytesprites/`

Status: active.

Purpose:

- Stores structured game/project intelligence for DataByteSprites.
- Provides species, lore, mechanics, move, ability, type, and source-file data.

### Runtime Visualizer

Path: `/studio/runtime/`

Status: active.

Purpose:

- Shows runtime load-order and health concepts.
- Supports future runtime module integrity checks.

## Active Foundations

### Creator Suite

Primary entry: `/tools.html`

Status: active foundation.

Needs:

- Dedicated Creator Suite map.
- Tool-by-tool documentation.
- Ownership links into Knowledge Engine.

### Asset Library

Primary index: `/studio/assets/index.json`

Status: active foundation.

Needs:

- Asset schema documentation.
- Asset source ownership rules.
- Asset-to-project linking.

### Technology Vault

Primary path: `/technology-vault/`

Status: active foundation.

Needs:

- Technology taxonomy.
- License reference structure.
- Offline-first and local-AI reference categories.

## Planned Systems

### Simulation Lab

Primary manifest: `/studio/modules/simulation-lab/module.json`

Status: planned.

Future purpose:

- Testing sandbox.
- Simulation prototypes.
- Controlled experiments.
- Future AI/gameplay validation scenarios.

### Predictive Diagnostics

Status: planned Phase 2.2.

Future purpose:

- Correlate recurring findings.
- Predict technical debt growth.
- Recommend safe repair order.
- Detect stale documentation.
- Suggest architecture improvements.

### Studio AI Development Assistant

Status: future milestone.

Future purpose:

- Answer repository-aware questions.
- Explain dependencies.
- Suggest refactors.
- Generate or repair indexes.
- Maintain documentation.

## Phase 2.1 Audit Notes

Current map conclusions:

1. Diagnostics is the strongest repository control point.
2. The Knowledge Engine is the strongest source of truth for what Studio knows exists.
3. DataByteSprites has the strongest project-specific data foundation.
4. Creator Suite, Asset Library, and Technology Vault need dedicated docs next.
5. Simulation Lab should remain planned until its purpose is implemented.
6. Future work should avoid expanding undocumented systems until maps are updated.

## Maintenance Rule

When a new module, index, major page, or diagnostic system is added, update at least one of the following:

- `README.md`
- `ARCHITECTURE.md`
- `REPOSITORY_MAP.md`
- `docs/phase-2.1-repository-audit.md`
- `MODULE_INDEX.md`

This keeps VoltanLabs Studio self-documenting as it grows.
