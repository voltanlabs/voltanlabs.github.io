# VoltanLabs Studio Reference

Status: active consolidated reference  
Current phase: Data Discovery Phase 4.3 Canonical Scanner OS Runtime

## Purpose

This document consolidates the older Studio architecture, repository map, diagnostics, validation, Knowledge Engine, module index, and Phase 2 release notes into one reference file.

It replaces the older root-level reference documents as the preferred technical reference so the repository has fewer documentation files and clearer sources of truth.

## Source Of Truth Set

Use these files first:

- `README.md` — public project overview and current status.
- `PROJECT_STATE.md` — living internal state and architecture notes.
- `ROADMAP.md` — short active roadmap.
- `docs/studio-reference.md` — consolidated Studio technical reference.
- `docs/phase-4.3-architecture-snapshot.md` — current Scanner OS architecture snapshot.
- `studio/runtime/load-order.json` — active runtime manifest.
- `studio/diagnostics/sources.json` — diagnostics source registry.
- `studio/knowledge/index.v2.json` — Knowledge Engine registry.

## High-Level Architecture

VoltanLabs has three connected layers:

```text
Public Website
  ↓
Products and Tools
  ↓
VoltanLabs Studio
```

The public website is the front door. Products and tools are what visitors use. Studio is the internal workshop that supports product creation, validation, documentation, runtime ownership, and future automation.

## Core Studio Systems

### Studio Shell

Primary path:

- `/studio/`

Primary files:

- `studio/index.html`
- `studio/knowledge/index.v2.json`
- `studio/modules/*/module.json`

Responsibilities:

- Present Studio modules.
- Surface active and planned systems.
- Connect navigation and search to Knowledge Engine metadata.
- Serve as the future launcher for repository-aware tools.

### Knowledge Engine v2

Primary path:

- `studio/knowledge/index.v2.json`

Role:

The Knowledge Engine is the metadata backbone of VoltanLabs Studio. It tells Studio what modules, indexes, collections, record types, and searchable data exist.

Responsibilities:

- Register Studio modules.
- Register DataByteSprites indexes.
- Register asset, technology, and future module references.
- Preserve stable IDs and source paths.
- Support Studio search, diagnostics, validation, coverage scoring, and future AI tools.

Important conventions:

- Prefer stable lowercase IDs.
- Use `id` as the primary identifier when possible.
- Avoid changing IDs once other records reference them.
- Keep indexes aligned with `studio/diagnostics/sources.json`.

Common record types:

- `module`
- `species`
- `lore`
- `sourceFile`
- `mechanicsGraph`
- `move`
- `typeChart`
- `ability`
- `asset`
- `technology`

### Diagnostics / Studio Intelligence

Primary path:

- `/studio/diagnostics/`

Primary files:

- `studio/diagnostics/index.html`
- `studio/diagnostics/sources.json`
- `studio/validation/rules.json`
- `assets/js/studio-validation-engine.js`
- `assets/js/studio-validation-health-calibrator.js`
- `assets/js/studio-diagnostics-intelligence.js`
- `assets/js/studio-health-history.js`
- `assets/js/studio-auto-repair-engine.js`
- `assets/js/studio-dependency-graph-viewer.js`
- `assets/js/studio-coverage-heat-map.js`
- `assets/js/studio-repository-evolution-dashboard.js`

Role:

Diagnostics is the Studio Control Center. It validates repository health, groups findings, stores local health history, creates repair plans, maps dependencies, scores subsystem coverage, and summarizes repository maturity.

Report object:

```js
window.VOLTAN_VALIDATION_REPORT
```

Core report fields:

- `generatedAt`
- `engineVersion`
- `rulesVersion`
- `healthScore`
- `coverageScore`
- `errorCount`
- `warningCount`
- `infoCount`
- `recordCount`
- `idCount`
- `linkCount`
- `sources`
- `findings`
- `coverage`
- `dependencyExplorer`
- `repairSuggestions`

Phase 2 Studio Intelligence modules add additional in-browser data such as repository intelligence, auto repair plans, dependency graph data, coverage heat map data, and repository evolution summaries.

Important boundary:

The browser diagnostics system does not directly mutate repository files. It produces reports, exports, and implementation-ready repair plans.

### Validation Engine

Primary file:

- `assets/js/studio-validation-engine.js`

Responsibilities:

- Load diagnostics sources.
- Load validation rules.
- Build the repository ID graph.
- Validate references.
- Detect duplicate IDs.
- Detect orphan records.
- Validate mechanics graph integrity.
- Validate runtime load order.
- Build coverage metrics.
- Build dependency explorer edges.
- Emit the health report.

Accepted ID-like fields include:

- `id`
- `attackingElement`
- `name`
- `label`

Common relationship fields include:

- `dependencies`
- `relatedSpecies`
- `relatedSystems`
- `relatedCharacters`
- `learnedBy`
- `assignedTo`
- `requires`
- `assetRefs`
- `dexRefs`

### Runtime System

Primary path:

- `/studio/runtime/`

Primary files:

- `studio/runtime/index.html`
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

Primary paths:

- `databyte-discovery.html`
- `databytedex.html`
- `studio/databytesprites/`

Structured indexes:

- `species.json`
- `lore.json`
- `source-files.json`
- `mechanics-graph.json`
- `moves.json`
- `type-chart.json`
- `abilities.json`
- `game-data.v1.json`

The flagship product is DataByteSprites: Data Discovery. It is currently in Phase 4.3 Scanner OS stabilization.

Current active product app:

- `assets/js/databyte-discovery-product-app-v3-5.js`

Canonical Scanner OS layout owner:

- `assets/js/dd-scanner-os-runtime.js`

Current runtime bootstrap:

- `assets/js/dd-scan-bg.js`

The previous layout wrapper files are no longer loaded by `dd-scan-bg.js` and should be treated as retired/reference layout files unless intentionally restored:

- `assets/js/dd-mobile-game-tray-4-2.js`
- `assets/js/dd-unified-scanner-shell-4-3.js`
- `assets/js/dd-unified-scanner-shell-4-3-once.js`
- `assets/js/dd-battle-centerline-fix-4-3.js`

## Active Data Discovery Runtime Chain

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
├── dd-health-signal-bridge.js
└── dd-scan-bg.js
    └── dd-scanner-os-runtime.js
```

## Runtime Ownership Summary

| Area | Owner | Status |
| --- | --- | --- |
| Roster | `dd-canon-roster.js` | Active |
| Studio data overlay | `dd-studio-data-bridge.js` | Active |
| Gameplay rules | `dd-gameplay-rules-2-4.js` | Active foundation |
| Encounter generation | `dd-encounter-runtime.js` | Active |
| Capture/download logic | `dd-capture-runtime.js` | Active |
| Battle helpers | `dd-battle-engine-2-4.js` | Active foundation |
| Battle resolver | `dd-battle-resolver.js` | Active |
| Battle state | `dd-battle-state-runtime.js` | Active foundation |
| Battle presentation | `dd-battle-presentation-runtime.js` | Active foundation |
| Collection | `dd-collection-runtime.js` | Active foundation |
| Party | `dd-party-runtime.js` | Active foundation |
| Party switching | `dd-party-switch-runtime.js` | Active foundation |
| Inventory | `dd-inventory-runtime.js` | Active foundation |
| Dex state | `dd-dex-runtime.js` | Active foundation |
| Product UI orchestration | `databyte-discovery-product-app-v3-5.js` | Active, still too large |
| Scanner OS layout | `dd-scanner-os-runtime.js` | Canonical owner |
| Background visuals/bootstrap | `dd-scan-bg.js` | Active visual/bootstrap owner |

## Repository Area Map

| Path | Purpose |
| --- | --- |
| `/` | Public website, root documentation, and product pages. |
| `/assets/` | Shared JavaScript, CSS, images, runtime helpers, and tool support files. |
| `/assets/js/` | Studio modules, Data Discovery runtimes, Creator Suite scripts, and public app logic. |
| `/docs/` | Consolidated reference docs, snapshots, audits, and architecture notes. |
| `/studio/` | Main VoltanLabs Studio shell and internal systems. |
| `/studio/databytesprites/` | DataByteSprites indexes and project intelligence. |
| `/studio/diagnostics/` | Diagnostics dashboard and source registry. |
| `/studio/runtime/` | Runtime visualizer and load-order system. |
| `/studio/knowledge/` | Knowledge Engine registry. |
| `/studio/validation/` | Validation rules and milestone manifests. |
| `/studio/modules/` | Studio module manifests. |
| `/studio/assets/` | Asset Library index. |
| `/technology-vault/` | Technology Vault foundation. |
| `/tools.html` | Creator Suite entry point. |

## Creator Suite

Primary entry:

- `tools.html`

Known tools include:

- Draw Tool.
- Gif Forge.
- PromptCraft.
- Character Forge.
- Future production utilities.

Current status: active foundation. Creator Suite needs deeper source ownership and stronger links into the Asset Library and DataByteSprites art pipeline.

## Asset Library

Primary index:

- `studio/assets/index.json`

Current status: active foundation. It is registered and referenced, but still needs expanded schema documentation, asset source ownership rules, and asset-to-project linking.

## Technology Vault

Primary path:

- `/technology-vault/`

Current status: active foundation. It should become a structured reference library for offline-first tools, local AI, licenses, and reusable technologies.

## Simulation Lab

Primary manifest:

- `studio/modules/simulation-lab/module.json`

Current status: planned. It is intended to support testing sandboxes, simulation prototypes, AI and game-logic experiments, and controlled validation scenarios.

## Phase 2 Historical Summary

Phase 2 transformed VoltanLabs Studio from a modular shell with validation into a repository-aware Studio Control Center.

Major completed foundations:

- Source registry loading.
- Validation rules loading.
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
- Repository Intelligence.
- Health History.
- Auto Repair planning.
- Dependency Graph Viewer.
- Coverage Heat Map.
- Repository Evolution Dashboard.

## Current Technical Debt

- Product App v3.5 still owns too much rendering and layout behavior.
- Scanner OS layout ownership must remain consolidated in `dd-scanner-os-runtime.js`.
- Some docs and manifests still need Phase 4.3 synchronization.
- Diagnostics still needs direct checks for duplicate active layout ownership.
- Party, inventory, rewards, missions, progression, abilities, and animations need deeper runtime ownership.
- Studio can validate and report, but it cannot yet auto-assemble complete game content or safely mutate repository files from the browser.

## Architecture Rules

- Prefer registries, manifests, and indexes over hardcoded one-off wiring.
- Prefer small companion modules over fragile rewrites.
- Keep source paths visible in reports.
- Keep IDs stable.
- Treat Diagnostics as the repository health authority.
- Keep README, PROJECT_STATE, ROADMAP, JSON manifests, and this reference synchronized after major phases.
- Keep the project offline-first and browser-first unless intentionally changed.
- Do not add new layout wrapper files for the battle screen; consolidate ownership instead.
