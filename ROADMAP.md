# VoltanLabs Roadmap

Current focus: Phase 4.3 Canonical Scanner OS Runtime + Studio Intelligence Foundation.

See PROJECT_STATE.md, README.md, docs/studio-reference.md, docs/phase-4.3-architecture-snapshot.md, and studio/intelligence/core.manifest.json for detailed architecture.

## Current priorities

- Stabilize Scanner OS runtime.
- Keep dd-scanner-os-runtime.js as the single Scanner/Battle layout owner.
- Keep dd-scanner-behavior-4-3.js guarding active encounter, battle, and confirm flows.
- Audit Product App v3.5 battle layout ownership.
- Eliminate duplicate layout ownership before adding more battle features.
- Continue runtime modularization.
- Keep diagnostics health at 0 errors and 0 warnings.
- Use the Diagnostics Snapshot System to export repo-ready health snapshots.
- Keep latest-report.json as the tracked latest diagnostics snapshot target.
- Build Studio Intelligence audits on top of the shared diagnostics report model.
- Keep documentation synchronized.

## Next Studio Intelligence commits

1. Register studio/intelligence/core.manifest.json in diagnostics sources with a smaller safe patch.
2. Add UI Layout Audit.
3. Add Module Ownership Audit.
4. Add Report Timeline from diagnostics snapshots.
5. Add Runtime Audit to compare page script loading against load-order.json.
6. Add Documentation Audit for README, PROJECT_STATE, ROADMAP, and Studio reference drift.

## Next Data Discovery commits

1. Audit Product App v3.5 CSS and battle markup.
2. Move battle layout assumptions into dd-scanner-os-runtime.js or remove duplicates.
3. Split remaining party behavior out of Product App v3.5.
4. Split remaining item behavior out of Product App v3.5.
5. Add deeper battle move/status/reward systems after layout ownership is stable.
