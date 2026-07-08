# VoltanLabs Roadmap

Status: active  
Current focus: Data Discovery Phase 4.3 Unified Scanner Shell Compatibility

## Purpose

This roadmap tracks the full VoltanLabs website and product strategy, not only VoltanLabs Studio.

The key decision:

> VoltanLabs Studio is the internal workshop. Data Discovery and the public site are the product-facing priority.

## Current Source of Truth

For the most current project status, see:

- `PROJECT_STATE.md`
- `README.md`
- `studio/runtime/load-order.json`
- `studio/diagnostics/sources.json`
- `SITE_STRATEGY.md`
- `docs/databyte-runtime-ownership-audit.md`
- `docs/databyte-gameplay-ownership-audit.md`
- `docs/datadiscovery-phase-4-bookkeeping.md`
- `studio/docs/STUDIO_GAME_INTEGRATION_ROADMAP.md`

## Strategic Model

```text
VoltanLabs
├── Public Website
├── Product Layer
│   ├── VoltArcade
│   ├── Data Discovery
│   ├── DataByteDex
│   ├── Databyte Arena
│   └── Voltan's Quest
├── Creator Layer
│   ├── Draw Tool
│   ├── Character Forge
│   ├── Gif Forge
│   ├── Sprite Sheet Forge
│   └── PromptCraft
├── Studio Layer
│   ├── Knowledge Engine
│   ├── Validation
│   ├── Diagnostics
│   ├── Runtime Visualizer
│   ├── Repository Intelligence
│   ├── Predictive Diagnostics
│   ├── Repository Integrity Engine
│   ├── Dependency Explorer
│   ├── Coverage Heat Map
│   └── Repository Evolution Dashboard
└── Future Automation Layer
    ├── Studio AI Assistant
    ├── Automated index generation
    ├── Documentation repair
    ├── Simulation Lab
    └── Game content assembly
```

## Current Site Decision

The public homepage remains the front door of VoltanLabs.

The Studio should not replace the public website. Studio supports product development behind the scenes.

VoltArcade remains the game hub.

Data Discovery is the flagship playable product.

## Completed Foundations

### Data Discovery Foundation

Status: active Phase 4.3 Scanner OS stabilization.

Completed:

- New active `#ddApp` product container.
- 52-sprite shared canon roster bridge.
- Studio data bridge overlay foundation.
- Shared game-data manifest.
- Scanner, encounter, battle, download confirmation, result, party, items, Dex, and Admin panels.
- Lead vs Wild battle arena foundation.
- Health and Signal telemetry foundation.
- Phase 3 Encounter Runtime.
- Phase 3 Capture / Download Runtime.
- Shared Gameplay Rules runtime.
- Battle Engine helper runtime.
- Battle Resolver runtime.
- Battle State Runtime foundation.
- Battle Presentation Runtime foundation.
- Collection Runtime foundation.
- Party Runtime foundation.
- Party Switch Runtime and compatibility UI.
- Inventory Runtime foundation.
- Dex Runtime foundation.
- Product App v3.5 functional cutover.
- Phase 4.2 battle experience and mobile layout compatibility.
- Phase 4.3 unified scanner shell and battle centerline compatibility.

Current issue:

- The game is functional as a foundation, but the Scanner OS still depends on multiple layout and compatibility layers targeting the same UI elements. These layers need to be consolidated into one canonical shell runtime before major gameplay expansion.

## Active Phase — Phase 4.3 Unified Scanner Shell Compatibility

Status: active.

This file is preserved as the pre-wrapper-cut roadmap backup.
