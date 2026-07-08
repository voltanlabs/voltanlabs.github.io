# VoltanLabs Project State

Status: active  
Current phase: Data Discovery Phase 4.3 Canonical Scanner OS Runtime + Studio Intelligence Foundation

## Purpose

This document is the living state of VoltanLabs. It explains what is active now, what owns each major system, and what the next priorities are.

Older Phase 2-era root reference docs have been consolidated into:

```text
docs/studio-reference.md
```

## Current Direction

VoltanLabs has three connected layers:

```text
Public Website
  ↓
Products and Tools
  ↓
VoltanLabs Studio
```

The public website is the front door. Products are what visitors play and use. VoltanLabs Studio is the internal workshop that supports product creation, validation, documentation, runtime ownership, diagnostics, Studio Intelligence, and future automation.

## Product Priority

The current flagship product is:

**DataByteSprites: Data Discovery**

The current development rule is:

> Studio work should directly support Data Discovery, DataByteDex, Creator Suite, diagnostics, runtime ownership, Studio Intelligence, or product publishing.

## Current Architecture Decision

Data Discovery has moved beyond the early Phase 4 compatibility-stack phase.

The active direction is a canonical Scanner OS runtime model.

```text
Studio Data
  ↓
Studio Data Bridge
  ↓
Gameplay Rules + Encounter Runtime + Capture Runtime + Battle Resolver
  ↓
Product App v3.5
  ↓
Canonical Scanner OS Runtime
  ├── Viewport and shell layout
  ├── Mobile spacing and action tray sizing
  ├── Battle centerline layout
  ├── Navigation sizing
  └── Scanner/Battle layout ownership
  ↓
Player UI
```

The immediate direction is to turn Data Discovery into one stable mobile Scanner OS shell where Scan, Encounter, Battle, Download, Dex, Party, Items, and Admin views all operate inside the same app frame.

## Studio Intelligence Direction

Studio Intelligence is now an active foundation layer.

Primary manifest:

```text
studio/intelligence/core.manifest.json
```

Current model:

```text
Diagnostics Source Registry + Validation Rules + Runtime Manifest + Knowledge Indexes
  ↓
Validation Engine
  ↓
window.VOLTAN_VALIDATION_REPORT
  ↓
Studio Intelligence Modules
  ├── Health History
  ├── Diagnostics Snapshot System
  ├── UI Layout Audit
  ├── Module Ownership Audit
  ├── Report Timeline
  ├── Documentation Audit
  ├── Auto Repair Planning
  ├── Dependency Graph Viewer
  ├── Coverage Heat Map
  ├── Repository Evolution Dashboard
  ├── Predictive Diagnostics
  └── Master Report Export Verification
  ↓
Studio Intelligence Manager
  ↓
window.VOLTAN_STUDIO_INTELLIGENCE
  ↓
Master Report Bridge
  ↓
Copy / Save Master Studio Report
```

The rule is that Studio Intelligence modules should read from the shared diagnostics report whenever possible instead of rebuilding separate report models.

Active Studio Intelligence browser objects:

```text
window.VOLTAN_VALIDATION_REPORT
window.VOLTAN_STUDIO_INTELLIGENCE
window.VOLTAN_REPORT_TIMELINE
window.VOLTAN_DOCUMENTATION_AUDIT
window.VOLTAN_MASTER_REPORT_EXPORT_VERIFICATION
```

Snapshot target:

```text
studio/diagnostics/latest-report.json
```

`latest-report.json` is a repo-tracked snapshot target. The browser can create, copy, and save a repo-ready payload, but it cannot safely write to GitHub by itself without a trusted backend, GitHub App, or connector.

## Active Source-of-Truth Documents

| Document | Role |
| --- | --- |
| `README.md` | Public overview and current handoff. |
| `PROJECT_STATE.md` | Living internal state. |
| `ROADMAP.md` | Short active roadmap. |
| `docs/studio-reference.md` | Consolidated Studio technical reference. |
| `docs/phase-4.3-architecture-snapshot.md` | Current Data Discovery architecture snapshot. |
| `docs/documentation-audit-phase-1.md` | Documentation audit inventory and sync findings. |
| `docs/intelligence-module-registry.md` | Human-readable Studio Intelligence module registry. |
| `studio/intelligence/core.manifest.json` | Studio Intelligence manifest. |
| `studio/runtime/load-order.json` | Machine-readable runtime manifest. |
| `studio/diagnostics/sources.json` | Machine-readable diagnostics source registry. |
| `studio/knowledge/index.v2.json` | Knowledge Engine registry. |

Older root docs should not continue growing independently unless deliberately revived.

## Active Product Architecture

Active live app container:

```text
#ddApp
```

Former legacy scanner container:

```text
#ddStandalone
```

The active product app is:

```text
assets/js/databyte-discovery-product-app-v3-5.js
```

The canonical Scanner OS layout owner is:

```text
assets/js/dd-scanner-os-runtime.js
```

The Scanner OS behavior guard is:

```text
assets/js/dd-scanner-behavior-4-3.js
```

The scanner background and Scanner OS bootstrap file is:

```text
assets/js/dd-scan-bg.js
```

`dd-scan-bg.js` now loads only the canonical Scanner OS runtime for layout.

## Current Data Discovery Load Chain

```text
databyte-discovery.html
├── assets/js/dd-canon-roster.js
├── assets/js/dd-studio-data-bridge.js
├── assets/js/dd-battle-engine-2-4.js
├── assets/js/dd-gameplay-rules-2-4.js
├── assets/js/dd-capture-runtime.js
├── assets/js/dd-encounter-runtime.js
├── assets/js/dd-battle-balance-2-4.js
├── assets/js/dd-battle-resolver.js
├── assets/js/dd-battle-state-runtime.js
├── assets/js/dd-battle-presentation-runtime.js
├── assets/js/dd-collection-runtime.js
├── assets/js/dd-party-runtime.js
├── assets/js/dd-party-switch-runtime.js
├── assets/js/dd-inventory-runtime.js
├── assets/js/dd-dex-runtime.js
├── assets/js/dd-collection-dex-runtime-bridge.js
├── assets/js/databyte-discovery-product-app-v3-5.js
├── assets/js/dd-scanner-behavior-4-3.js
├── assets/js/dd-health-signal-bridge.js
└── assets/js/dd-scan-bg.js
    └── assets/js/dd-scanner-os-runtime.js
```

## Retired From Active Scanner OS Layout Loading

These files still exist for reference, but they are no longer loaded by `dd-scan-bg.js` as active layout owners:

```text
assets/js/dd-mobile-game-tray-4-2.js
assets/js/dd-unified-scanner-shell-4-3.js
assets/js/dd-unified-scanner-shell-4-3-once.js
assets/js/dd-battle-centerline-fix-4-3.js
```

## Current DataByteDex Load Chain

```text
databytedex.html
├── assets/js/dd-canon-roster.js
├── assets/js/dd-studio-data-bridge.js
└── assets/js/databytedex-shared-renderer.js
```

## Current Runtime Owners

| Runtime Area | Active Owner | Status |
| --- | --- | --- |
| Page boot | `databyte-discovery.html` | Active |
| Public roster | `dd-canon-roster.js` | Active |
| Studio data overlay | `dd-studio-data-bridge.js` | Active |
| Gameplay rules | `dd-gameplay-rules-2-4.js` | Active foundation |
| Encounter generation | `dd-encounter-runtime.js` | Active owner |
| Download/capture rules | `dd-capture-runtime.js` | Active owner |
| Battle helpers | `dd-battle-engine-2-4.js` | Active foundation |
| Battle resolver | `dd-battle-resolver.js` | Active owner |
| Battle state | `dd-battle-state-runtime.js` | Active foundation |
| Battle presentation | `dd-battle-presentation-runtime.js` | Active foundation |
| Collection | `dd-collection-runtime.js` | Active foundation |
| Party | `dd-party-runtime.js` | Active foundation |
| Party switching | `dd-party-switch-runtime.js` | Active foundation |
| Party switch UI | `dd-party-switch-ui.js` | Compatibility UI |
| Party switch battle bridge | `dd-party-switch-battle-bridge.js` | Compatibility bridge |
| Party switch HUD refresh | `dd-party-switch-refresh.js` | Compatibility UI |
| Inventory | `dd-inventory-runtime.js` | Active foundation |
| Dex runtime | `dd-dex-runtime.js` | Active foundation |
| Product UI orchestration | `databyte-discovery-product-app-v3-5.js` | Active UI owner |
| Scanner OS behavior | `dd-scanner-behavior-4-3.js` | Active guard |
| Scanner OS layout | `dd-scanner-os-runtime.js` | Active canonical owner |
| Battle experience polish | `dd-battle-experience-4-2.js` | Compatibility |
| Viewport lock / mobile layout | `dd-layout-viewport-lock-4-2.js` | Compatibility |
| DataByteDex renderer | `databytedex-shared-renderer.js` | Active |
| Health/signal visual bridge | `dd-health-signal-bridge.js` | Compatibility |
| Scanner background/bootstrap | `dd-scan-bg.js` | Active visual/bootstrap owner |

## Current Game Flow

```text
Scanner
  ↓
Encounter Runtime creates signal
  ↓
Signal Encounter
  ↓
Start Battle
  ↓
Battle Resolver + Product App v3.5 battle UI
  ↓
Scanner OS Runtime owns fixed shell layout
  ↓
Party Switch Runtime, Capture Runtime, and Battle Presentation hooks
  ↓
Battle / Download Result
  ↓
Collection, Party, DataByteDex progress
  ↓
Scanner
```

Supporting panels:

- DataByteDex panel.
- Party panel.
- Inventory panel.
- Admin profile panel.
- Party switch overlay.

## What Studio Can Do Now

Studio currently provides:

- Knowledge Engine registry.
- Diagnostics source registry.
- Validation engine.
- Repository health dashboard.
- Repository Intelligence.
- Health History.
- Diagnostics Snapshot System.
- `latest-report.json` repo snapshot target.
- Studio Intelligence Core manifest.
- Studio Intelligence Manager.
- Master Report Bridge.
- Report Timeline.
- Documentation Audit.
- Master Report Export Verification.
- Collapsible Diagnostics Panels.
- UI Layout Audit.
- Module Ownership Audit.
- Auto Repair planning.
- Dependency Explorer.
- Dependency Graph Viewer.
- Coverage Heat Map.
- Repository Evolution Dashboard.
- Predictive Diagnostics foundation.
- Studio-to-game data bridge foundation.
- Shared game-data manifest foundation.
- DataByteDex shared renderer foundation.
- Runtime ownership tracking.
- Consolidated Studio reference documentation.

## What Studio Cannot Do Yet

Studio does not yet automatically create complete playable game content.

It cannot yet automatically:

- Generate a complete new sprite line.
- Generate moves and abilities for a sprite.
- Export balanced encounter tables into final runtime logic.
- Attach final art assets.
- Run one-click build/export into the public game.
- Run full battle/download simulations from a Studio UI.
- Safely mutate repository files directly from the browser.

## Known Issues

- Product App v3.5 still owns too much rendering and layout logic.
- Scan, Encounter, and Battle still have separate internal render paths even though the Scanner OS runtime now owns the fixed shell layout.
- Long sprite names still need an auto-fit strategy.
- Some legacy scripts still exist as behavior references and need a safe retirement audit.
- Battle needs deeper move resolver, status system, healing balance, reward rules, enemy behavior, and animation ownership.
- Runtime Audit is the next Studio Intelligence module needed to compare live page script loading against runtime and diagnostics manifests.
- Documentation needs the remaining Phase 2 sync commits: README, Studio Reference, and Intelligence Module Registry.

## Immediate Priorities

1. Add Runtime Audit as the next Studio Intelligence module.
2. Add Runtime Dependency Validation against loaded scripts and manifests.
3. Audit Product App v3.5 battle markup and base CSS ownership.
4. Continue Scanner OS duplicate ownership cleanup.
5. Keep `dd-scanner-os-runtime.js` as the only Scanner/Battle layout owner.
6. Keep README, PROJECT_STATE, ROADMAP, `docs/studio-reference.md`, Studio Intelligence manifest, runtime manifest, diagnostics sources, and Studio integration roadmap synchronized.
7. Rerun diagnostics after each stabilization pass.
8. Split remaining party and item behavior out of Product App v3.5.
9. Add Studio balance simulator and export pipeline after runtime ownership is stable.

## Long-Term Vision

The target workflow is:

```text
Studio creates or edits content
  ↓
Studio validates IDs, references, balance, and assets
  ↓
Studio Intelligence audits layout, ownership, runtime, docs, exports, and health trends
  ↓
Studio exports game-ready data
  ↓
Data Discovery consumes the exported data
  ↓
DataByteDex renders the same data
```

The long-term goal is for new content to be created through Studio, validated automatically, balanced through Simulation Lab, audited through Studio Intelligence, and consumed directly by the public game.
