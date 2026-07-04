# VoltanLabs Studio Module Index

Status: active  
Phase: 2.1 Documentation & Architecture Audit

## Purpose

This index catalogs major Studio modules, their purpose, status, primary files, and documentation links.

It should stay aligned with:

- `studio/knowledge/index.v2.json`
- `REPOSITORY_MAP.md`
- `ARCHITECTURE.md`
- `DIAGNOSTICS.md`
- `VALIDATION.md`

## Status Legend

| Status | Meaning |
| --- | --- |
| Active | Live and used by the current Studio. |
| Active foundation | Exists and is intended to grow. |
| Planned | Registered or planned, but not fully implemented. |
| Future | Conceptual milestone. |
| Needs audit | Needs classification before expansion. |

## Active Modules

### Studio Shell

Status: active

Primary paths:

- `studio/index.html`
- `studio/modules/dashboard/`
- `studio/knowledge/index.v2.json`

Purpose:

- Main Studio entry point.
- Presents registered modules.
- Connects navigation and search to Knowledge Engine data.

Dependencies:

- Knowledge Engine v2.
- Module manifests.

Documentation:

- `ARCHITECTURE.md`
- `REPOSITORY_MAP.md`
- `KNOWLEDGE_ENGINE.md`

### Diagnostics / Studio Intelligence

Status: active

Primary paths:

- `studio/diagnostics/index.html`
- `studio/diagnostics/sources.json`
- `assets/js/studio-validation-engine.js`
- `assets/js/studio-validation-health-calibrator.js`
- `assets/js/studio-diagnostics-intelligence.js`
- `assets/js/studio-health-history.js`
- `assets/js/studio-auto-repair-engine.js`
- `assets/js/studio-dependency-graph-viewer.js`
- `assets/js/studio-coverage-heat-map.js`
- `assets/js/studio-repository-evolution-dashboard.js`

Purpose:

- Validate repository health.
- Render Studio Control Center.
- Group findings.
- Store health history.
- Generate repair plans.
- Build dependency graphs.
- Score subsystem coverage.
- Track repository evolution.

Dependencies:

- Diagnostics source registry.
- Validation rules.
- Knowledge Engine indexes.
- Runtime manifest.
- DataByteSprites indexes.

Documentation:

- `DIAGNOSTICS.md`
- `VALIDATION.md`
- `RELEASE_NOTES_PHASE2.md`

### Runtime Visualizer

Status: active

Primary paths:

- `studio/runtime/index.html`
- `studio/runtime/load-order.json`
- `assets/js/studio-runtime-loader.js`
- `assets/js/studio-runtime-health.js`
- `assets/js/studio-runtime-bridge-checks.js`

Purpose:

- Visualize runtime load order.
- Surface runtime health concepts.
- Prepare future runtime dependency checks.

Dependencies:

- Runtime load-order manifest.
- Studio diagnostics.

Documentation:

- `ARCHITECTURE.md`
- `REPOSITORY_MAP.md`

### Knowledge Engine v2

Status: active

Primary paths:

- `studio/knowledge/index.v2.json`
- Registered JSON indexes.
- `KNOWLEDGE_ENGINE.md`

Purpose:

- Registry of modules, indexes, paths, and searchable data.
- Metadata foundation for Studio search and future AI tools.

Dependencies:

- Module manifests.
- DataByteSprites indexes.
- Asset Library index.
- Technology references.

Documentation:

- `KNOWLEDGE_ENGINE.md`
- `ARCHITECTURE.md`
- `REPOSITORY_MAP.md`

### DataByteSprites Knowledge Base

Status: active

Primary paths:

- `studio/databytesprites/species.json`
- `studio/databytesprites/lore.json`
- `studio/databytesprites/source-files.json`
- `studio/databytesprites/mechanics-graph.json`
- `studio/databytesprites/moves.json`
- `studio/databytesprites/type-chart.json`
- `studio/databytesprites/abilities.json`

Purpose:

- Store structured project intelligence for DataByteSprites.
- Provide canon data for future runtime/gameplay integration.

Dependencies:

- Knowledge Engine v2.
- Diagnostics source registry.
- Validation rules.

Documentation:

- `ARCHITECTURE.md`
- `KNOWLEDGE_ENGINE.md`
- `VALIDATION.md`

## Active Foundations

### Creator Suite

Status: active foundation

Primary paths:

- `tools.html`
- Tool-specific pages and scripts.

Known tools:

- Draw Tool.
- Gif Forge.
- PromptCraft.
- Future production tools.

Purpose:

- Browser-based creative production tools.
- Future monetizable tool suite.

Needs:

- Dedicated Creator Suite documentation.
- Tool-by-tool source ownership.
- Knowledge Engine registration cleanup.

### Asset Library

Status: active foundation

Primary paths:

- `studio/assets/index.json`

Purpose:

- Register reusable assets.
- Prepare for asset ownership, usage tracking, and production asset indexing.

Needs:

- Asset schema documentation.
- Asset-to-project relationship fields.
- Asset coverage validation.

### Technology Vault

Status: active foundation

Primary paths:

- `technology-vault/`

Purpose:

- Store reusable technology, license, and offline-first engineering references.

Needs:

- Technology taxonomy.
- License metadata.
- Knowledge Engine linking.

## Planned Modules

### Simulation Lab

Status: planned

Primary paths:

- `studio/modules/simulation-lab/module.json`

Purpose:

- Testing sandbox.
- Simulation prototypes.
- Controlled experiments.
- Future AI/gameplay validation scenarios.

Needs:

- Implementation plan.
- Runtime hooks.
- Diagnostics coverage.

### Predictive Diagnostics

Status: planned Phase 2.2

Purpose:

- Correlate recurring warning categories.
- Predict technical debt growth.
- Recommend safe repair order.
- Detect stale documentation.
- Suggest architecture improvements.

Expected dependencies:

- Validation report.
- Repository Intelligence.
- Health History.
- Auto Repair Engine.
- Coverage Heat Map.
- Repository Evolution Dashboard.

### Studio AI Development Assistant

Status: future milestone

Purpose:

- Answer repository-aware questions.
- Explain dependencies.
- Suggest refactors.
- Generate or repair indexes.
- Maintain documentation.

Expected dependencies:

- Knowledge Engine.
- Diagnostics reports.
- Repository maps.
- Module index.
- Validation rules.

## Module Registration Rules

When adding a module:

1. Give it a stable ID.
2. Add a clear status.
3. Define its primary paths.
4. Add dependencies where useful.
5. Register it in the Knowledge Engine when it should be discoverable.
6. Add it to this Module Index.
7. Add Diagnostics coverage if it introduces records or manifests.
8. Update Repository Map if it creates a major new area.
9. Update README if it changes the project status or roadmap.

## Dependency Rules

Module dependencies should be explicit when possible.

Useful dependency fields include:

- `dependencies`
- `requires`
- `relatedSystems`
- `assetRefs`
- `dexRefs`

These fields help Diagnostics build dependency graphs and repair plans.

## Maintenance Notes

- Diagnostics is the health authority.
- Knowledge Engine is the registry authority.
- Repository Map is the directory/status authority.
- Module Index is the human-readable module catalog.
- README is the public-facing project handoff.

If a module becomes active, update all affected references in the same development pass.

## Next Expansion Targets

Highest-value module documentation targets:

1. Creator Suite tool-by-tool map.
2. Asset Library schema and ownership rules.
3. Technology Vault taxonomy.
4. DataByteSprites runtime integration map.
5. Predictive Diagnostics module plan.
