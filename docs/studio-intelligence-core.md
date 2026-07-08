# Studio Intelligence Core

Status: active foundation  
Phase: Phase 4.3 Studio Intelligence Foundation

## Purpose

The Studio Intelligence Core is the next layer above Diagnostics.

Diagnostics creates the raw report. Studio Intelligence interprets that report into shared models that other Studio panels can use without each panel recalculating its own version of repository state.

## Current Inputs

- `window.VOLTAN_VALIDATION_REPORT`
- `studio/diagnostics/latest-report.json`
- `studio/diagnostics/sources.json`
- `studio/validation/rules.json`
- `studio/runtime/load-order.json`
- `studio/knowledge/index.v2.json`
- `studio/databytesprites/*.json`
- local health-history snapshots

## Current Outputs

Planned shared models:

- Repository Health Model
- Runtime Ownership Model
- UI Layout Risk Model
- Documentation Drift Model
- Knowledge Graph Model
- Next Best Action Model
- Snapshot Payload Model

## Active Intelligence Modules

| Module | Status | Source |
| --- | --- | --- |
| Validation Intelligence | Active | `assets/js/studio-validation-engine.js` |
| Health History Intelligence | Active | `assets/js/studio-health-history.js` |
| Snapshot Intelligence | Active | `assets/js/studio-diagnostics-snapshot-system.js` |
| Predictive Diagnostics Intelligence | Active | `assets/js/studio-predictive-diagnostics.js` |

## Planned Intelligence Modules

| Module | Status | Goal |
| --- | --- | --- |
| UI Layout Audit | Planned foundation | Detect layout ownership conflicts, overflow risks, duplicate CSS owners, and mobile viewport issues. |
| Module Ownership Audit | Planned foundation | Map features to owners and identify duplicate ownership risks. |
| Report Timeline Audit | Planned foundation | Show health, coverage, warnings, errors, and information-pressure trends across snapshots. |

## Recent Changes

The Diagnostics Snapshot System is now active on `/studio/diagnostics/`.

It provides:

- Copy Snapshot for Repo
- Save Snapshot File
- View Repo Target
- `studio/diagnostics/latest-report.json` as the tracked latest-report target

The Snapshot panel now survives Diagnostics render cycles through a bootstrap watcher in `assets/js/studio-diagnostics-snapshot-system.js`.

## Current Observed Health

After the Phase 4.3 diagnostics cleanup and Snapshot System bootstrap stabilization:

- Health Score: 85
- Coverage Score: 74
- Errors: 0
- Warnings: 0

Future exact values should come from `studio/diagnostics/latest-report.json` once the latest snapshot is stored there.

## Development Rules

- Diagnostics should feed Studio Intelligence instead of each panel inventing its own model.
- New report modules should read from the shared report model wherever possible.
- Scanner layout ownership should remain centralized in `dd-scanner-os-runtime.js` until UI Layout Audit proves otherwise.
- Retired wrapper files should remain reference-only until a legacy retirement pass archives or deletes them safely.

## Next Audits

1. UI Layout Audit Pass 1
   - Detect Scanner OS layout ownership conflicts.
   - Detect mobile overflow risk.
   - Detect duplicate battle layout CSS owners.
   - Detect wrapper regressions.

2. Module Ownership Audit Pass 1
   - Generate a feature-to-owner map for Data Discovery, Studio Diagnostics, Knowledge Engine, Creator Suite, and runtime manifests.

3. Report Timeline Pass 1
   - Show health, coverage, warnings, errors, and info-pressure trends across local and repo snapshot history.
