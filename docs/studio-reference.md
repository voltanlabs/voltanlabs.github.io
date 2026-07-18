# VoltanLabs Studio Reference

Status: active consolidated reference  
Current phase: Data Discovery Phase 6.0 Progression Loop + Studio Intelligence Foundation

## Purpose

This is the preferred technical reference for VoltanLabs Studio. It summarizes the active architecture, source-of-truth files, Studio Intelligence layer, runtime ownership model, and current technical debt.

Older root-level reference documents should not continue growing independently unless deliberately revived.

## Source Of Truth Set

Use these files first:

- `README.md` — public overview and current handoff.
- `PROJECT_STATE.md` — living internal state.
- `ROADMAP.md` — active roadmap.
- `docs/studio-reference.md` — consolidated technical reference.
- `docs/phase-4.3-architecture-snapshot.md` — Data Discovery architecture snapshot.
- `docs/documentation-audit-phase-1.md` — documentation audit inventory.
- `docs/intelligence-module-registry.md` — Studio Intelligence module registry.
- `studio/intelligence/core.manifest.json` — Studio Intelligence machine-readable manifest.
- `studio/runtime/load-order.json` — runtime manifest.
- `studio/diagnostics/sources.json` — diagnostics source registry.
- `studio/knowledge/index.v2.json` — Knowledge Engine registry.

## High-Level Architecture

```text
Public Website
  ↓
Products and Tools
  ↓
VoltanLabs Studio
```

The public site is the front door. Products and tools are what visitors use. Studio is the internal workshop for validation, documentation, runtime ownership, diagnostics, Studio Intelligence, and future automation.

## Studio Intelligence

Primary path:

- `/studio/diagnostics/`

Primary manifest:

- `studio/intelligence/core.manifest.json`

Primary files:

- `studio/diagnostics/index.html`
- `studio/diagnostics/sources.json`
- `studio/validation/rules.json`
- `assets/js/studio-validation-engine.js`
- `assets/js/studio-health-history.js`
- `assets/js/studio-diagnostics-snapshot-system.js`
- `assets/js/studio-ui-layout-audit.js`
- `assets/js/studio-module-ownership-audit.js`
- `assets/js/studio-intelligence-manager.js`
- `assets/js/studio-master-report-bridge.js`
- `assets/js/studio-report-timeline.js`
- `assets/js/studio-documentation-audit.js`
- `assets/js/studio-master-report-export-verifier.js`
- `assets/js/studio-diagnostics-panel-collapse.js`
- `assets/js/studio-auto-repair-engine.js`
- `assets/js/studio-dependency-graph-viewer.js`
- `assets/js/studio-coverage-heat-map.js`
- `assets/js/studio-repository-evolution-dashboard.js`
- `assets/js/studio-predictive-diagnostics.js`

Current data flow:

```text
Diagnostics Sources + Validation Rules + Runtime Manifest + Knowledge Indexes
  ↓
Validation Engine
  ↓
window.VOLTAN_VALIDATION_REPORT
  ↓
Studio Intelligence Modules
  ↓
Studio Intelligence Manager
  ↓
window.VOLTAN_STUDIO_INTELLIGENCE
  ↓
Master Report Bridge
  ↓
Copy / Save Master Studio Report
```

Runtime objects:

```text
window.VOLTAN_VALIDATION_REPORT
window.VOLTAN_STUDIO_INTELLIGENCE
window.VOLTAN_REPORT_TIMELINE
window.VOLTAN_DOCUMENTATION_AUDIT
window.VOLTAN_MASTER_REPORT_EXPORT_VERIFICATION
```

Active Studio Intelligence modules:

- Validation Engine
- Health History
- Diagnostics Snapshot System
- UI Layout Audit
- Module Ownership Audit
- Studio Intelligence Manager
- Master Report Bridge
- Report Timeline
- Documentation Audit
- Master Report Export Verification
- Diagnostics Panel Collapse
- Auto Repair Engine
- Dependency Graph Viewer
- Coverage Heat Map
- Repository Evolution Dashboard
- Predictive Diagnostics

Next planned Studio Intelligence module:

- Runtime Audit

Important boundary:

The browser diagnostics system does not directly mutate repository files. It produces reports, exports, and implementation-ready repair plans. GitHub writes must happen through a trusted backend, GitHub App, connector, or manual commit workflow.

## DataByteSprites Architecture

Primary paths:

- `databyte-discovery.html`
- `databytedex.html`
- `studio/databytesprites/`

The flagship product is DataByteSprites: Data Discovery. It is currently in Phase 6.0 progression stabilization.

Current active product app shell:

- `assets/js/databyte-discovery-product-app-v4-shell.js`

Canonical battle and player owners:

- `assets/js/dd-battle-core-runtime.js`
- `assets/js/dd-player-runtime.js`
- `assets/js/dd-battle-reward-runtime.js`

Runtime bootstrap:

- `assets/js/dd-app-bootstrap.js`
- `assets/js/dd-runtime-bundle.js`

Retired from active Scanner OS layout loading:

- `assets/js/dd-mobile-game-tray-4-2.js`
- `assets/js/dd-unified-scanner-shell-4-3.js`
- `assets/js/dd-unified-scanner-shell-4-3-once.js`
- `assets/js/dd-battle-centerline-fix-4-3.js`

## Active Data Discovery Runtime Chain

```text
databyte-discovery.html
└── dd-app-bootstrap.js
    └── dd-runtime-bundle.js (19 ordered owners)
        ├── canon + Studio data
        ├── status + gameplay + capture + encounter
        ├── dd-player-runtime.js
        ├── dd-battle-core-runtime.js
        ├── reward runtime + presentation
        ├── screen/control owners + registry
        ├── databyte-discovery-product-app-v4-shell.js
        └── dd-app-presentation-runtime.js
```

## Runtime Ownership Summary

| Area | Owner | Status |
| --- | --- | --- |
| Roster | `dd-canon-roster.js` | Active |
| Studio data overlay | `dd-studio-data-bridge.js` | Active |
| Gameplay rules | `dd-gameplay-rules-2-4.js` | Active foundation |
| Encounter generation | `dd-encounter-runtime.js` | Active owner |
| Capture/download logic | `dd-capture-runtime.js` | Active owner |
| Battle calculation, turn, and state | `dd-battle-core-runtime.js` | Active owner |
| Legacy battle resolver/state | `dd-battle-resolver.js`, `dd-battle-state-runtime.js` | Implemented but not loaded |
| App and battle presentation | `dd-app-presentation-runtime.js` | Active owner |
| Collection, party, switching, inventory, Dex, and save backup | `dd-player-runtime.js` | Active owner |
| XP, levels, Version Upgrades, rewards, and battle history | `dd-battle-reward-runtime.js` | Active owner |
| Product UI orchestration | `databyte-discovery-product-app-v4-shell.js` | Active shell |
| Runtime load/readiness | `dd-app-bootstrap.js` | Active entry point |

## Repository Area Map

| Path | Purpose |
| --- | --- |
| `/` | Public website, root docs, product pages. |
| `/assets/` | Shared JS, CSS, images, runtime helpers, and tools. |
| `/assets/js/` | Studio modules, Data Discovery runtimes, Creator Suite scripts, and app logic. |
| `/docs/` | Consolidated references, audits, and architecture notes. |
| `/studio/` | Studio shell and internal systems. |
| `/studio/databytesprites/` | DataByteSprites indexes and project intelligence. |
| `/studio/diagnostics/` | Diagnostics dashboard and source registry. |
| `/studio/intelligence/` | Studio Intelligence manifest and metadata. |
| `/studio/runtime/` | Runtime visualizer and load-order system. |
| `/studio/knowledge/` | Knowledge Engine registry. |
| `/studio/validation/` | Validation rules and milestone manifests. |
| `/studio/modules/` | Studio module manifests. |
| `/studio/assets/` | Asset Library index. |
| `/technology-vault/` | Technology Vault foundation. |
| `/tools.html` | Creator Suite entry point. |

## Current Technical Debt

- Product App v3.5 still owns too much rendering and layout behavior.
- Scanner OS layout ownership must remain consolidated in `dd-scanner-os-runtime.js`.
- Runtime Audit is the next needed Studio Intelligence module.
- Missions, authored ability coverage, additional specialty moves, and explicit multi-slot save management remain future runtime work.
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
