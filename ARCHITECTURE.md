# VoltanLabs Studio Architecture

Status: active  
Phase: 2.1 Documentation & Architecture Audit

## Overview

VoltanLabs Studio is an offline-first modular software studio. It is organized around a small set of durable systems:

- Studio Shell
- Knowledge Engine v2
- Diagnostics / Studio Intelligence
- Runtime System
- Creator Suite
- Asset Library
- Technology Vault
- Simulation Lab
- DataByteSprites project intelligence

The architecture favors searchable indexes, manifests, registries, local browser tools, and small companion modules over monolithic rewrites.

## Related References

- `README.md` — current project status and roadmap handoff.
- `REPOSITORY_MAP.md` — directory ownership and status map.
- `DIAGNOSTICS.md` — Studio Intelligence and diagnostics module reference.
- `VALIDATION.md` — validation rules, source registry, report shape, and best practices.
- `KNOWLEDGE_ENGINE.md` — Knowledge Engine registry and index reference.
- `MODULE_INDEX.md` — Studio module catalog.
- `ROADMAP.md` — phase roadmap.
- `RELEASE_NOTES_PHASE2.md` — Phase 2 release notes.
- `docs/phase-2.1-repository-audit.md` — active documentation audit.

## High-Level Map

```text
VoltanLabs Studio
├── User-facing web pages
│   ├── Studio shell
│   ├── Diagnostics dashboard
│   ├── Runtime visualizer
│   ├── Creator tools
│   └── Project pages
├── Data layer
│   ├── Knowledge Engine v2 registry
│   ├── Diagnostics source registry
│   ├── Validation rules
│   ├── Runtime load-order manifest
│   ├── DataByteSprites indexes
│   ├── Asset Library index
│   └── Module manifests
├── Intelligence layer
│   ├── Repository validation engine
│   ├── Health calibration
│   ├── Repository Intelligence
│   ├── Health History
│   ├── Auto Repair Engine
│   ├── Dependency Graph Viewer
│   ├── Coverage Heat Map
│   └── Repository Evolution Dashboard
└── Future expansion
    ├── Predictive diagnostics
    ├── Studio AI development assistant
    ├── Build pipeline intelligence
    └── Runtime/gameplay index consumption
```

## Core Layers

### 1. Studio Shell

Primary path: `/studio/`

The Studio Shell is the main entry point for VoltanLabs Studio. It provides navigation and a registry-backed overview of available systems.

Responsibilities:

- Present Studio modules.
- Surface active and planned areas.
- Connect to Knowledge Engine metadata.
- Serve as the future launcher for repository-aware tools.

Important files:

- `studio/index.html`
- `studio/knowledge/index.v2.json`
- `studio/modules/*/module.json`

### 2. Knowledge Engine v2

Primary path: `/studio/knowledge/index.v2.json`

The Knowledge Engine is the registry that tells Studio what exists. It references modules, indexes, collections, and searchable record types.

Responsibilities:

- Register Studio modules.
- Register DataByteSprites indexes.
- Define index paths and record types.
- Provide metadata for search, diagnostics, and future AI tools.

Key concepts:

- Stable IDs
- Registered indexes
- Common search fields
- Record types
- Source-aware paths

For details, see `KNOWLEDGE_ENGINE.md`.

### 3. Diagnostics / Studio Intelligence

Primary path: `/studio/diagnostics/`

Diagnostics started as source validation and has evolved into the Studio Control Center.

Phase 1.2 provided repository integrity validation. Phase 2.0 added companion intelligence modules that consume the validation report.

For the full technical reference, see `DIAGNOSTICS.md`.

#### Validation Engine

Primary file: `assets/js/studio-validation-engine.js`

Produces `window.VOLTAN_VALIDATION_REPORT`.

Responsibilities:

- Load diagnostics source registry.
- Load validation rules.
- Build repository ID graph.
- Validate references.
- Detect duplicate IDs.
- Detect orphan records.
- Validate mechanics graph integrity.
- Validate runtime load order.
- Build coverage metrics.
- Build dependency explorer edges.
- Emit a health report.

For validation rule details, see `VALIDATION.md`.

#### Health Calibrator

Primary file: `assets/js/studio-validation-health-calibrator.js`

Responsibilities:

- Adjust and normalize health reporting.
- Support readable Studio health score output.

#### Repository Intelligence

Primary file: `assets/js/studio-diagnostics-intelligence.js`

Responsibilities:

- Group findings by category.
- Identify top priorities.
- Mark repair groups as safe, partial, review, or manual.
- Add save-report and export behavior.

#### Health History

Primary file: `assets/js/studio-health-history.js`

Responsibilities:

- Store local health snapshots in browser storage.
- Compare current health to previous runs.
- Render trend cards and sparklines.
- Export local health history.

#### Auto Repair Engine

Primary file: `assets/js/studio-auto-repair-engine.js`

Responsibilities:

- Convert findings into a dry-run repair queue.
- Classify repair mode.
- Estimate health impact.
- Export repair plans.
- Copy commit summaries for implementation.

Important: the browser module does not rewrite repository files. It produces safe repair plans for implementation.

#### Dependency Graph Viewer

Primary file: `assets/js/studio-dependency-graph-viewer.js`

Responsibilities:

- Build node and edge graph from dependency explorer data.
- Show resolved and unresolved edges.
- Highlight endpoint/orphan hints.
- Highlight simple circular-reference hints.
- Export dependency graph JSON.

#### Coverage Heat Map

Primary file: `assets/js/studio-coverage-heat-map.js`

Responsibilities:

- Score subsystems by coverage and diagnostic pressure.
- Render subsystem heat cards.
- Provide drill-down findings.
- Export JSON and Markdown reports.

#### Repository Evolution Dashboard

Primary file: `assets/js/studio-repository-evolution-dashboard.js`

Responsibilities:

- Calculate Studio maturity score.
- Determine readiness stage.
- Summarize technical debt.
- Track milestones.
- Identify highest-risk subsystem.
- Recommend next milestone.
- Export JSON and Markdown summaries.

## Diagnostics Data Flow

```text
sources.json + rules.json
        │
        ▼
studio-validation-engine.js
        │
        ▼
window.VOLTAN_VALIDATION_REPORT
        │
        ├── Repository Intelligence
        ├── Health History
        ├── Auto Repair Engine
        ├── Dependency Graph Viewer
        ├── Coverage Heat Map
        └── Repository Evolution Dashboard
```

## Runtime System

Primary path: `/studio/runtime/`

The runtime system makes load order and runtime health visible.

Important files:

- `studio/runtime/load-order.json`
- `assets/js/studio-runtime-loader.js`
- `assets/js/studio-runtime-health.js`
- `assets/js/studio-runtime-bridge-checks.js`

Responsibilities:

- Define module load order.
- Surface runtime boot status.
- Check runtime bridge health.
- Support future runtime integration with DataByteSprites and Studio modules.

## DataByteSprites Architecture

Primary path: `/studio/databytesprites/`

DataByteSprites is the flagship project and the strongest test case for repository intelligence.

Indexes:

- `species.json`
- `lore.json`
- `source-files.json`
- `mechanics-graph.json`
- `moves.json`
- `type-chart.json`
- `abilities.json`

Responsibilities:

- Store canon species metadata.
- Store lore and story records.
- Track source-file ownership.
- Model mechanics relationships.
- Define moves, abilities, and type rules.
- Prepare future runtime/gameplay consumption.

## Creator Suite Architecture

Primary path: `/tools.html`

The Creator Suite contains browser-based production tools.

Known tools include:

- Draw Tool
- Gif Forge
- PromptCraft
- Future production utilities

Current status: active foundation. It needs a dedicated module map during Phase 2.1.

## Asset Library

Primary path: `/studio/assets/index.json`

The Asset Library is the future production asset system.

Current status: active foundation. It is registered and referenced, but needs expanded documentation and deeper indexing.

## Technology Vault

Primary path: `/technology-vault/`

Technology Vault is a reusable engineering and licensing reference.

Current status: active foundation. It should become a structured reference library for offline-first tools, local AI, licenses, and reusable technologies.

## Simulation Lab

Primary path: `/studio/modules/simulation-lab/module.json`

Simulation Lab is registered as a planned module.

Future responsibilities:

- Testing sandbox
- Simulation prototypes
- AI and game logic experiments
- Controlled validation scenarios

## Architectural Rules

- Prefer registries, manifests, and indexes over hardcoded one-off wiring.
- Prefer small companion modules over large fragile rewrites.
- Keep source paths visible in reports.
- Keep IDs stable.
- Treat diagnostics as the repository health authority.
- Keep README, maps, and indexes synchronized after major phases.
- Keep the project offline-first and browser-first unless intentionally changed.

## Current Architecture Status

Phase 2.0 completed the Studio Intelligence foundation.

Phase 2.1 is documenting and mapping that implementation so future work can move into predictive diagnostics, repository-aware recommendations, and deeper DataByteSprites runtime integration.
