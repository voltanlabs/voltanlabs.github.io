# VoltanLabs Studio Diagnostics Reference

Status: active  
Phase: 2.1 Documentation & Architecture Audit

## Purpose

Diagnostics is the Studio Control Center. It validates repository health, groups findings, stores health history, creates repair plans, maps dependencies, scores subsystem coverage, and summarizes repository maturity.

The live dashboard is available at:

- `/studio/diagnostics/`

## Diagnostics Stack

```text
/studio/diagnostics/index.html
        │
        ├── assets/js/studio-validation-engine.js
        ├── assets/js/studio-validation-health-calibrator.js
        ├── assets/js/studio-diagnostics-intelligence.js
        ├── assets/js/studio-health-history.js
        ├── assets/js/studio-auto-repair-engine.js
        ├── assets/js/studio-dependency-graph-viewer.js
        ├── assets/js/studio-coverage-heat-map.js
        └── assets/js/studio-repository-evolution-dashboard.js
```

## Source Inputs

Diagnostics uses two primary source files:

- `studio/diagnostics/sources.json`
- `studio/validation/rules.json`

The validation engine loads every registered source, scans records, builds an ID graph, checks references, and emits a single browser report:

```js
window.VOLTAN_VALIDATION_REPORT
```

All Phase 2.0 Studio Intelligence modules consume that report.

## Report Lifecycle

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

## Core Report Fields

The validation report includes these important fields:

| Field | Purpose |
| --- | --- |
| `generatedAt` | ISO timestamp for the report run. |
| `engineVersion` | Validation engine version. |
| `rulesVersion` | Validation rule schema version. |
| `healthScore` | Overall repository health. |
| `coverageScore` | Average knowledge coverage score. |
| `errorCount` | Blocking findings. |
| `warningCount` | Warnings needing repair or review. |
| `infoCount` | Informational findings. |
| `recordCount` | Total loaded records. |
| `idCount` | IDs indexed into the repository graph. |
| `linkCount` | References scanned. |
| `sources` | Loaded source registry results. |
| `findings` | Errors, warnings, and info findings. |
| `coverage` | Coverage by tracked record kind. |
| `dependencyExplorer` | Source-aware dependency edges. |
| `repairSuggestions` | Initial repair hints from validation. |

Phase 2.0 modules add more fields onto the report object in-browser, such as:

- `repositoryIntelligence`
- `autoRepairPlan`
- `dependencyGraph`
- `coverageHeatMap`
- `repositoryEvolutionDashboard`

## Module Reference

### Validation Engine

File: `assets/js/studio-validation-engine.js`

Responsibilities:

- Load sources.
- Load rules.
- Build repository model.
- Index IDs and aliases.
- Collect references.
- Validate source availability.
- Validate schema versions.
- Validate required fields.
- Detect duplicate IDs.
- Validate cross-index references.
- Validate mechanics graph integrity.
- Validate runtime load order.
- Detect orphan records.
- Build coverage metrics.
- Build dependency explorer edges.
- Build repair suggestions.
- Render summary and source cards.

### Health Calibrator

File: `assets/js/studio-validation-health-calibrator.js`

Responsibilities:

- Calibrate or improve health scoring output.
- Keep health reporting readable and stable.

### Repository Intelligence

File: `assets/js/studio-diagnostics-intelligence.js`

Responsibilities:

- Group findings into diagnostic categories.
- Show top priority repair categories.
- Add `Save Report File` behavior.
- Allow report JSON export.
- Add repository intelligence metadata to the validation report.

Finding groups include:

- Missing IDs
- Broken references
- Orphan records
- Duplicate IDs
- Schema mismatches
- Runtime dependencies
- Mechanics graph
- Documentation gaps

### Health History

File: `assets/js/studio-health-history.js`

Responsibilities:

- Store local browser snapshots.
- Compare current run to previous runs.
- Render health and coverage trends.
- Show recent run table.
- Export health history JSON.
- Clear local health history.

Storage:

- Uses browser `localStorage`.
- Does not write to the repository.

### Auto Repair Engine

File: `assets/js/studio-auto-repair-engine.js`

Responsibilities:

- Convert findings into a dry-run repair queue.
- Classify repairs as:
  - Safe auto-fix
  - Assisted fix
  - Manual review
  - Architecture review
- Estimate projected health impact.
- Export repair plans as JSON.
- Copy commit summaries.

Important boundary:

The browser Auto Repair Engine does not directly mutate repository files. It produces implementation-ready repair plans.

### Dependency Graph Viewer

File: `assets/js/studio-dependency-graph-viewer.js`

Responsibilities:

- Build a graph model from `dependencyExplorer` edges.
- Render node cloud.
- Render edge stream.
- Filter all, unresolved, entry, and terminal nodes.
- Show unresolved edges.
- Show orphan/endpoint hints.
- Show simple circular-reference hints.
- Export graph JSON.

### Coverage Heat Map

File: `assets/js/studio-coverage-heat-map.js`

Responsibilities:

- Score repository subsystems.
- Combine coverage, findings, repair pressure, graph availability, and source counts.
- Render subsystem heat cards.
- Provide drill-down findings.
- Export coverage as JSON.
- Export coverage as Markdown.

Subsystems include:

- Studio Core
- Knowledge Engine
- DataByteSprites
- Creator Suite
- Asset Library
- Technology Vault
- Simulation Lab
- Runtime
- Validation
- Documentation

### Repository Evolution Dashboard

File: `assets/js/studio-repository-evolution-dashboard.js`

Responsibilities:

- Calculate repository maturity score.
- Assign readiness stage.
- Summarize health, coverage, heat map, graph resolution, and repair pressure.
- Show milestone completion.
- Identify highest-risk subsystem.
- Identify top repair category.
- Recommend the next milestone.
- Export JSON and Markdown executive summaries.

## Export Formats

Diagnostics supports these exports:

| Export | Module | Format |
| --- | --- | --- |
| Full report | Repository Intelligence | JSON |
| Health history | Health History | JSON |
| Repair plan | Auto Repair Engine | JSON |
| Commit summary | Auto Repair Engine | Clipboard text |
| Dependency graph | Dependency Graph Viewer | JSON |
| Coverage heat map | Coverage Heat Map | JSON |
| Coverage summary | Coverage Heat Map | Markdown |
| Evolution dashboard | Repository Evolution Dashboard | JSON |
| Executive summary | Repository Evolution Dashboard | Markdown |

## Extension Guide

To add a new diagnostics companion module:

1. Create a new file in `assets/js/`.
2. Wait for `window.VOLTAN_VALIDATION_REPORT`.
3. Build a derived model from the report.
4. Attach the model back to the report object.
5. Render a dashboard section inside `#diagnostics`.
6. Add export behavior if useful.
7. Add a script tag to `/studio/diagnostics/index.html`.
8. Update `README.md`, `ARCHITECTURE.md`, `DIAGNOSTICS.md`, and `REPOSITORY_MAP.md` if the module becomes a permanent part of Studio.

## Design Rules

- Keep diagnostics browser-first and offline-first.
- Prefer source-aware findings.
- Do not hide blocking errors behind summary scores.
- Do not automatically mutate repository files from the browser dashboard.
- Keep every module independently removable.
- Export data in simple JSON or Markdown.
- Keep report fields human-readable.
- Update documentation after each major diagnostics expansion.
