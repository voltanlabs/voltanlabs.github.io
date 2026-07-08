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

### DataByteDex Foundation

Status: shared renderer foundation.

Completed:

- Seen count.
- Captured count.
- Search.
- Local storage integration with Data Discovery progress.
- Shared renderer consuming `DD_CANON_ROSTER`.
- Studio bridge support through `dd-studio-data-bridge.js`.

### Studio Foundation

Status: active support platform.

Completed:

- Studio shell.
- Knowledge Engine v2.
- Validation Engine.
- Diagnostics dashboard.
- Repository Intelligence stack.
- Predictive Diagnostics start.
- Repository Integrity Engine.
- Dependency Explorer.
- Dependency Graph Viewer.
- Coverage Heat Map.
- Repository Evolution Dashboard.
- Knowledge coverage metrics.
- Actionable repair suggestions.
- Living project state document.
- Studio to Data Discovery Integration Roadmap.
- Shared game-data manifest.
- Runtime load-order manifest.
- Diagnostics registry updated with game bridge scripts, Dex renderer, runtime ownership audits, Phase 4 modules, and manifest files.

Current issue:

- Studio can validate and inform the game, but it does not yet auto-assemble full game content, export a complete balanced build, or consolidate runtime compatibility layers automatically.

## Active Phase — Phase 4.3 Unified Scanner Shell Compatibility

Status: active.

Goal:

Turn Data Discovery into one stable mobile-first Scanner OS shell where Scan, Encounter, Battle, Download, Dex, Party, Items, and Admin views all operate inside the same app frame.

Current Phase 4.3 runtime chain:

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
├── dd-party-switch-battle-bridge.js
├── dd-party-switch-ui.js
├── dd-party-switch-refresh.js
├── dd-battle-experience-4-2.js
├── dd-layout-viewport-lock-4-2.js
├── dd-mobile-game-tray-4-2.js
├── dd-unified-scanner-shell-4-3.js
├── dd-battle-centerline-fix-4-3.js
├── dd-health-signal-bridge.js
└── dd-scan-bg.js
```

Completed in Phase 4 so far:

- Added Party Runtime and party switching foundation.
- Added Party Switch UI, battle bridge, and HUD refresh helpers.
- Added Battle State Runtime and Battle Presentation Runtime foundations.
- Added Collection, Inventory, and Dex runtime foundations.
- Added Collection-to-Dex bridge.
- Added Product App v3.5 as the active UI orchestrator.
- Added Battle Experience 4.2 compatibility polish.
- Added Viewport Lock and Mobile Game Tray compatibility layers.
- Added Unified Scanner Shell 4.3 compatibility layer.
- Added Battle Centerline Fix 4.3 compatibility layer.
- Updated runtime load-order and diagnostics source tracking for Phase 4 modules.
- Updated PROJECT_STATE and README for Phase 4.3 stabilization.

Next tasks:

1. Stop compatibility loaders from repeatedly stacking layout scripts.
2. Make `dd-scan-bg.js` visual/background-only or convert it into a single explicit compatibility bootstrap.
3. Consolidate Phase 4 layout rules into one canonical Scanner OS shell runtime.
4. Replace compatibility patches with direct runtime integration.
5. Split remaining party and item behavior out of Product App v3.5.
6. Update Knowledge Engine and mechanics graph records for Phase 4 modules.
7. Rerun Diagnostics and compare health/coverage against the previous report.
8. Add Studio balance simulator and export pipeline after runtime ownership is stable.

## Shared Data Phase — One Sprite Source of Truth

Status: active foundation.

Goal:

Stop maintaining separate hardcoded sprite lists.

Priority tasks:

- Use `assets/js/dd-canon-roster.js` as the current public shared roster bridge.
- Overlay Studio data from `/studio/databytesprites/species.json` through `dd-studio-data-bridge.js`.
- Move DataByteDex and Data Discovery toward the same runtime roster global.
- Align the public roster bridge with a Studio-generated game-data manifest export.
- Validate sprite data through Studio diagnostics.

## Runtime Module Split Phase

Status: active foundation.

Goal:

Move gameplay ownership out of Product App v3.5 and into dedicated runtime modules.

Completed:

- Encounter Runtime.
- Capture / Download Runtime.
- Gameplay Rules Runtime.
- Battle Engine helper runtime.
- Battle Resolver Runtime.
- Battle State Runtime foundation.
- Battle Presentation Runtime foundation.
- Collection Runtime foundation.
- Party Runtime foundation.
- Party Switch Runtime foundation.
- Inventory Runtime foundation.
- Dex Runtime foundation.

Next runtime modules:

- Progression Runtime.
- Mission Runtime.
- Journal Runtime.
- Ability Runtime.
- Reward Runtime.
- Canonical Scanner OS Shell Runtime.

## Battle Engine Phase

Status: active foundation.

Goal:

Turn the current battle foundation into a real battle engine.

Completed:

- Move buttons from Studio move data.
- Speed-based turn order foundation.
- Type/effectiveness helper hooks.
- Enemy move choice helper.
- Basic health and signal resolution.
- Basic capture/download flow integration.
- Dedicated battle resolver foundation.
- Battle state runtime foundation.
- Battle presentation runtime foundation.

Priority tasks:

- Add deeper status effect handling.
- Add victory, defeat, and reward rules.
- Add healing/recovery balance.
- Add boss and rare encounter behavior.
- Add balance validation from Studio diagnostics.
- Move more battle UI presentation out of Product App v3.5.

## Studio Export Pipeline Phase

Status: planned foundation.

Goal:

Make Studio the authoring and validation layer for game-ready exports.

Priority tasks:

- Studio-authored species export.
- Studio-authored moves export.
- Studio-authored encounter tables.
- Studio-authored item tables.
- Studio balance simulator output.
- Runtime export manifest.
- One-click validation report.

## Creator Pipeline Phase

Status: planned.

Goal:

Make Creator Suite feed Data Discovery and future games.

Priority tasks:

- Asset naming rules.
- Sprite asset folders.
- Placeholder art for all sprite IDs.
- Export paths from Creator Suite into game-ready assets.
- Asset-to-species links in Studio indexes.

## Development Rules

- Public site stays visitor-friendly.
- Data Discovery is the flagship product priority.
- Studio is the support platform, not the front door.
- Creator Suite supports the asset pipeline.
- DataByteDex and scanner should move toward one shared data source.
- Health checker / Diagnostics must be updated when new bridge scripts, docs, or data sources are added.
- Keep small, safe commits.
- Update documentation when the strategy changes.
