# VoltanLabs Roadmap

Status: active  
Current focus: Phase 2.3 Shared Game Data Pipeline

## Purpose

This roadmap tracks the full VoltanLabs website and product strategy, not only VoltanLabs Studio.

The key decision:

> VoltanLabs Studio is the internal workshop. Data Discovery and the public site are the product-facing priority.

## Current Source of Truth

For the most current project status, see:

- `PROJECT_STATE.md`
- `SITE_STRATEGY.md`
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
│   └── Predictive Diagnostics
└── Future Automation Layer
    ├── Studio AI Assistant
    ├── Automated index generation
    ├── Documentation repair
    └── Game content assembly
```

## Current Site Decision

The public homepage remains the front door of VoltanLabs.

The Studio should not replace the public website. Studio supports product development behind the scenes.

VoltArcade remains the game hub.

Data Discovery is the flagship playable product.

## Completed Foundations

### Data Discovery Foundation

Status: active product build.

Completed:

- New active `#ddApp` product container.
- 52-sprite shared canon roster bridge.
- Studio data bridge overlay foundation.
- Scanner, encounter, battle, capture confirmation, result, party, items, Dex, and Admin panels.
- Lead vs Wild battle arena foundation.
- Health and Signal telemetry foundation.

Current issue:

- Battle is functional but still a foundation. It needs real moves, turn rules, healing/recovery, enemy behavior, and balancing.

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
- Living project state document.
- Studio to Data Discovery Integration Roadmap.
- Shared game-data manifest.
- Diagnostics registry updated with game bridge scripts, Dex renderer, and manifest.

Current issue:

- Studio can validate and inform the game, but it does not yet auto-assemble full game content.

## Active Phase — Phase 2.3 Shared Game Data Pipeline

Status: active.

Goal:

Move Data Discovery and DataByteDex from duplicated hand-wired data toward one Studio-backed shared game-data pipeline.

Completed in Phase 2.3 so far:

- Added `studio/databytesprites/game-data.v1.json`.
- Upgraded `assets/js/dd-studio-data-bridge.js` to load the manifest.
- Added manifest definitions for items and encounter pools.
- Added `assets/js/databytedex-shared-renderer.js`.
- Rewired `databytedex.html` to consume the shared roster and Studio bridge.
- Registered the game-data manifest and shared Dex renderer in Diagnostics.
- Updated `PROJECT_STATE.md` with Phase 2.3 state.

Next tasks:

1. Enable battle moves from the shared manifest and Studio move index.
2. Make the product app consume manifest item and encounter definitions directly.
3. Add diagnostics rules for game-data manifest relationships.
4. Continue migrating legacy effects into `#ddApp`.
5. Build healing/recovery and party management rules.
6. Keep Diagnostics current as new bridge and product files are added.

## Shared Data Phase — One Sprite Source of Truth

Status: in progress.

Goal:

Stop maintaining separate hardcoded sprite lists.

Priority tasks:

- Use `assets/js/dd-canon-roster.js` as the current public shared roster bridge.
- Overlay Studio data from `/studio/databytesprites/species.json` through `dd-studio-data-bridge.js`.
- Move DataByteDex and Data Discovery toward the same runtime roster global.
- Later align the public roster bridge with a Studio-generated game-data manifest export.
- Validate sprite data through Studio diagnostics.

## Battle Engine Phase

Status: active foundation / next gameplay push.

Goal:

Turn the current battle foundation into a real battle engine.

Priority tasks:

- Add move selection.
- Add turn order.
- Add enemy actions.
- Add health recovery/healing rules.
- Add type/effectiveness hooks.
- Add victory, defeat, and capture state rules.
- Add balance validation from Studio diagnostics.

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
