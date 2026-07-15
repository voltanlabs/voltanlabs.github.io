# VoltanLabs Roadmap

Current focus: **Data Discovery Phase 4.4.3 Modular Vertical Slice + Repository Recovery and Governance Synchronization**.

See `PROJECT_STATE.md`, `README.md`, `docs/data-discovery-ownership-map.md`, `docs/studio-reference.md`, and `studio/intelligence/core.manifest.json` for detailed architecture and implementation status.

## Roadmap Rules

- One active owner per responsibility.
- The v4 App Shell coordinates; it does not absorb gameplay or screen ownership.
- Screens render; runtimes calculate and transition state.
- Documentation, manifests, diagnostics, and ownership maps must stay synchronized.
- Planned systems must not be described as implemented.
- Compatibility layers may be retired only after verified canonical replacements exist.
- Data Discovery must remain independently distributable without Studio UI dependencies.

## Completed Recovery and Governance Milestones

- Reconstructed the canonical DataByteSprites species index from the surviving roster source.
- Added a GitHub Actions workflow that validates, regenerates, commits, and pushes `studio/databytesprites/species.json`.
- Restored and authored the 20-configuration DataByteSprites chart.
- Kept Alignment (`Pristine`, `Stained`, `Null`) separate from Configuration.
- Updated `README.md` to the current v4.4.3 architecture and recovery state.
- Updated `PROJECT_STATE.md` with the recovery milestone, governance findings, and corrected priorities.
- Updated `docs/data-discovery-ownership-map.md` to distinguish active, temporary, planned, and recovery infrastructure ownership.
- Reaffirmed the Data Discovery Core Stabilization v1.0 Architecture Freeze.

## Current Critical Path

1. **Complete battle helper recovery**
   - Reconstruct `assets/js/dd-battle-engine-2-4.js` as a complete, valid runtime.