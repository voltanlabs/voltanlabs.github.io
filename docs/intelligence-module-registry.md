# Intelligence Module Registry

Status: active foundation

The Intelligence Module Registry is the catalog for Studio Intelligence modules.

Current registered modules:

- Diagnostics Snapshot System
- UI Layout Audit
- Module Ownership Audit
- Studio Intelligence Manager
- Master Report Bridge
- Health History
- Auto Repair Engine
- Dependency Graph Viewer
- Coverage Heat Map
- Repository Evolution Dashboard
- Predictive Diagnostics

Registry rule:

New Studio Intelligence modules should be documented here before being wired into Diagnostics or the Master Report.

Current flow:

```text
Diagnostics Report
  -> Studio Intelligence Manager
  -> Master Report Bridge
  -> Master Studio Report
```

Next step:

Move this registry into a machine-readable manifest after the connector accepts the standalone registry file.
