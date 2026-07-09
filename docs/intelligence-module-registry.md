# Intelligence Module Registry

Status: active foundation

The Intelligence Module Registry is the human-readable catalog for Studio Intelligence modules. The machine-readable source of truth is `studio/intelligence/core.manifest.json`.

## Active modules

- Validation Engine
- Health History
- Diagnostics Snapshot System
- UI Layout Audit
- Module Ownership Audit
- Runtime Audit
- Runtime Dependency Validation
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

## Registry rule

New Studio Intelligence modules should be documented here and in `studio/intelligence/core.manifest.json` before being wired into Diagnostics or the Master Report.

## Current flow

```text
Validation Engine
  ↓
Studio Intelligence Modules
  ↓
Studio Intelligence Manager
  ↓
Master Report Bridge
  ↓
Master Studio Report
```

## Current active audit focus

- Runtime Audit is active.
- Runtime Dependency Validation is active.
- Documentation Synchronizer is the next Studio Intelligence milestone.

## Synchronization rule

Keep this registry synchronized with:

- `README.md`
- `PROJECT_STATE.md`
- `ROADMAP.md`
- `docs/studio-reference.md`
- `studio/intelligence/core.manifest.json`
