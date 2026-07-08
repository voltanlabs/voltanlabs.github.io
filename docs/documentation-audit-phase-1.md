# Documentation Audit - Phase 1 Inventory

Status: active audit
Date: 2026-07-08

## Purpose

This file records the Phase 1 documentation audit before consolidation changes are made.

## Current source-of-truth set

| Document | Status | Phase 1 classification | Notes |
| --- | --- | --- | --- |
| `README.md` | Active | Needs update | Correctly describes Scanner OS focus, but highest-value task still points mostly to Product App v3.5 layout stabilization and does not mention the newest Studio Intelligence export/collapse work. |
| `PROJECT_STATE.md` | Active | Needs update | Strong architecture record, but immediate priorities are stale. UI Layout Audit, Module Ownership Audit, Report Timeline, and Documentation Audit are already implemented. |
| `ROADMAP.md` | Active | Needs update | Lists UI Layout Audit, Module Ownership Audit, Report Timeline, and Documentation Audit as next commits even though they are already active. Runtime Audit should be the next Studio Intelligence milestone. |
| `docs/studio-reference.md` | Active | Needs update | Consolidated reference is valuable, but Diagnostics / Studio Intelligence section predates Master Report Bridge, Intelligence Manager, Report Timeline, Documentation Audit, Export Verification, and collapsible panels. |
| `docs/intelligence-module-registry.md` | Active foundation | Keep and update | Documents the registry in Markdown while standalone JSON registry remains optional/future. Should be synced with active modules. |
| `studio/intelligence/core.manifest.json` | Active machine-readable source | Current | Now lists Report Timeline and Documentation Audit as active and Runtime Audit as the only planned audit. |
| `studio/diagnostics/sources.json` | Active machine-readable registry | Needs follow-up check | Should be checked after docs update to confirm all source IDs match documentation expectations. |
| `studio/runtime/load-order.json` | Active machine-readable runtime manifest | Keep | Runtime source of truth for Data Discovery loading. |
| `studio/knowledge/index.v2.json` | Active Knowledge Engine registry | Keep | Search and registry backbone for Studio modules and indexes. |
| `ROADMAP_BACKUP.md` | Backup | Archive candidate | Should not be treated as active roadmap unless deliberately restored. |

## Findings

### Finding 1: Studio Intelligence implementation is ahead of docs

Implemented systems now include:

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
- Collapsible Diagnostics Panels
- Dependency Graph Viewer
- Coverage Heat Map
- Repository Evolution Dashboard
- Predictive Diagnostics
- Auto Repair planning

Several docs still describe some of these as planned or omit them entirely.

### Finding 2: ROADMAP.md needs immediate refresh

`ROADMAP.md` still lists these as next commits:

- UI Layout Audit
- Module Ownership Audit
- Report Timeline
- Documentation Audit

Those should move to completed / active foundation. The next Studio Intelligence commit should be Runtime Audit.

### Finding 3: PROJECT_STATE.md priority list is stale

The immediate priorities still include the first Studio Intelligence audits even though they have been completed. The priority list should be replaced with:

1. Runtime Audit.
2. Runtime dependency validation against loaded scripts.
3. Product App v3.5 battle markup and CSS ownership audit.
4. Scanner OS duplicate ownership cleanup.
5. Remaining party/item runtime split.
6. Studio balance simulator and export pipeline.

### Finding 4: Studio Reference needs a Studio Intelligence refresh

`docs/studio-reference.md` should add the newer dashboard/export modules to the Diagnostics section:

- `assets/js/studio-intelligence-manager.js`
- `assets/js/studio-master-report-bridge.js`
- `assets/js/studio-report-timeline.js`
- `assets/js/studio-documentation-audit.js`
- `assets/js/studio-master-report-export-verifier.js`
- `assets/js/studio-diagnostics-panel-collapse.js`

It should also document `window.VOLTAN_STUDIO_INTELLIGENCE`, `window.VOLTAN_REPORT_TIMELINE`, `window.VOLTAN_DOCUMENTATION_AUDIT`, and the enriched Master Report export.

### Finding 5: README is mostly current but incomplete

`README.md` correctly captures the Scanner OS and runtime owner direction, but it should mention the current Studio Intelligence foundation and latest diagnostics panel improvements.

## Phase 2 recommended safe updates

1. Update `ROADMAP.md` first because it is shortest and most stale.
2. Update `PROJECT_STATE.md` next because it is the living internal state.
3. Update `README.md` with a short Studio Intelligence status block.
4. Update `docs/studio-reference.md` with a fuller Diagnostics / Studio Intelligence reference.
5. Update `docs/intelligence-module-registry.md` to match the active module list.
6. Rerun Diagnostics and confirm Documentation Audit results improve.

## Consolidation recommendations

- Keep `README.md`, `PROJECT_STATE.md`, `ROADMAP.md`, and `docs/studio-reference.md` as the active human-readable source set.
- Keep JSON manifests as machine-readable source of truth.
- Treat `ROADMAP_BACKUP.md` as archival unless needed for recovery.
- Avoid creating more overlapping roadmap files.
