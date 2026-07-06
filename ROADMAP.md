# VoltanLabs Roadmap

Status: active  
Current focus: Phase 3 Runtime Integration and Repository Stabilization

## Purpose

This roadmap tracks the full VoltanLabs website and product strategy, not only VoltanLabs Studio.

The key decision:

> VoltanLabs Studio is the internal workshop. Data Discovery and the public site are the product-facing priority.

## Current Source of Truth

For the most current project status, see:

- `PROJECT_STATE.md`
- `SITE_STRATEGY.md`
- `README.md`
- `docs/databyte-runtime-ownership-audit.md`
- `docs/databyte-gameplay-ownership-audit.md`
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

Status: active Phase 3 runtime stabilization.

Completed:

- New active `#ddApp` product container.
- 52-sprite shared canon roster bridge.
- Studio data bridge overlay foundation.
- Shared game-data manifest.
- Scanner, encounter, battle, capture confirmation, result, party, items, Dex, and Admin panels.
- Lead vs Wild battle arena foundation.
- Health and Signal telemetry foundation.
- Phase 3 Encounter Runtime.
- Phase 3 Capture Runtime.
- Shared Gameplay Rules runtime.
- Battle Engine helper runtime.
- Product App v3 functional cutover.

Current issue:

- The game is functional as a foundation, but repository metadata, runtime ownership, and diagnostics must be stabilized before major gameplay expansion.

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
- Diagnostics registry updated with game bridge scripts, Dex renderer, runtime ownership audits, and manifest files.

Current issue:

- Studio can validate and inform the game, but it does not yet auto-assemble full game content or export a complete balanced build.

## Active Phase — Phase 3 Runtime Integration and Repository Stabilization

Status: active.

Goal:

Make Data Discovery functional through dedicated runtime owners while stabilizing the repository metadata that Diagnostics uses to understand the architecture.

Current Phase 3 runtime chain:

```text
databyte-discovery.html
├── dd-canon-roster.js
├── dd-studio-data-bridge.js
├── dd-battle-engine-2-4.js
├── dd-gameplay-rules-2-4.js
├── dd-capture-runtime.js
├── dd-encounter-runtime.js
├── dd-battle-balance-2-4.js
└── databyte-discovery-product-app-v3.js
```

Completed in Phase 3 so far:

- Added `assets/js/dd-capture-runtime.js`.
- Added `assets/js/dd-encounter-runtime.js`.
- Added `assets/js/databyte-discovery-product-app-v3.js`.
- Wired the live page to Product App v3.
- Repaired `studio/databytesprites/game-data.v1.json` with root IDs and Phase 3 runtime references.
- Rebuilt `studio/databytesprites/source-files.json` around Phase 3 runtime ownership.
- Rebuilt `studio/databytesprites/mechanics-graph.json` around active runtime owners.
- Updated README for Phase 3 stabilization.
- Updated PROJECT_STATE and ROADMAP for Phase 3 stabilization.

Next tasks:

1. Rerun Diagnostics and compare health/coverage against the previous report.
2. Reduce remaining orphan records in Knowledge Engine outputs.
3. Resolve remaining dependency graph edges.
4. Update Studio integration roadmap with export and simulator milestones.
5. Split Party Runtime out of Product App v3.
6. Split Item Runtime out of Product App v3.
7. Add battle move resolver and reward/progression hooks.

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

Move gameplay ownership out of Product App v3 and into dedicated runtime modules.

Completed:

- Encounter Runtime.
- Capture Runtime.
- Gameplay Rules Runtime.
- Battle Engine helper runtime.

Next runtime modules:

- Party Runtime.
- Item Runtime.
- Progression Runtime.
- Mission Runtime.
- Journal Runtime.
- Ability Runtime.

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
- Basic capture flow integration.

Priority tasks:

- Add dedicated battle move resolver.
- Add deeper status effect handling.
- Add victory, defeat, and reward rules.
- Add healing/recovery balance.
- Add boss and rare encounter behavior.
- Add balance validation from Studio diagnostics.

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
