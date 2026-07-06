# VoltanLabs Roadmap

Status: active  
Current focus: Studio to Data Discovery Integration Phase A

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
│   ├── Home
│   ├── About
│   ├── Contact
│   └── Programs
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

### Public Website Foundation

Status: active foundation.

Completed:

- Public homepage.
- Shared header/footer system.
- VoltArcade game hub.
- Data Discovery entry points.
- DataByteDex page.
- Databyte Arena page.
- Voltan's Quest page.
- Creator Suite page.
- Technology Vault entry.

### Data Discovery Foundation

Status: active product build.

Completed:

- Scanner OS shell.
- New active `#ddApp` product container.
- Admin profile seed.
- Starter Leovolt seed.
- Local collection storage.
- Seen/Captured local progress.
- Discovery code input.
- Random scan code.
- Signal Encounter state.
- Battle Sequence state.
- Lead vs Wild battle arena foundation.
- Health and Signal telemetry foundation.
- Capture Confirmation screen.
- Battle Result screen.
- Party local storage.
- Inventory foundation.
- Admin profile panel.
- 52-sprite shared canon roster bridge.
- Product app layer wired to Data Discovery.
- Studio data bridge overlay foundation.

Current issue:

- Battle is functional but still a foundation. It needs real moves, turn rules, healing/recovery, enemy behavior, and balancing.

### DataByteDex Foundation

Status: active foundation.

Completed:

- 52 canon entries.
- Seen count.
- Captured count.
- Search.
- Local storage integration with Data Discovery progress.

Current issue:

- DataByteDex should consume the shared roster bridge next instead of keeping a separate hardcoded roster.

### Creator Suite Foundation

Status: active foundation.

Completed:

- Draw Tool.
- Character Forge.
- Gif Forge.
- Sprite Sheet Forge.
- PromptCraft foundation.

Current issue:

- Creator Suite is useful, but it is not yet connected to a formal asset pipeline for Data Discovery.

### Studio Foundation

Status: active support platform.

Completed:

- Studio shell.
- Knowledge Engine v2.
- Validation Engine.
- Diagnostics dashboard.
- Runtime Visualizer.
- Repository Intelligence.
- Health History.
- Auto Repair Engine.
- Dependency Graph Viewer.
- Coverage Heat Map.
- Repository Evolution Dashboard.
- Predictive Diagnostics start.
- Documentation maps and strategy docs.
- Living project state document.
- Studio to Data Discovery Integration Roadmap.
- Diagnostics registry updated with game bridge scripts and new documentation.

Current issue:

- Studio can validate and inform the game, but it does not yet auto-assemble full game content.

## Active Phase — Studio to Data Discovery Integration Phase A

Status: active.

Goal:

Move Data Discovery from hand-wired game data toward Studio-backed shared content.

Completed in Phase A so far:

- Added `assets/js/dd-studio-data-bridge.js`.
- Wired `databyte-discovery.html` to load the Studio bridge before the product app.
- Added `PROJECT_STATE.md`.
- Added `studio/docs/STUDIO_GAME_INTEGRATION_ROADMAP.md`.
- Registered game bridge scripts and project docs in `studio/diagnostics/sources.json`.

Next tasks:

1. Move DataByteDex to consume the shared roster bridge.
2. Expand the Studio species index or generate a full game-data manifest.
3. Add Studio validation coverage for playable roster entries.
4. Add moves and abilities into the playable battle engine.
5. Continue migrating legacy effects into `#ddApp`.
6. Keep Diagnostics current as new game bridge files are added.

## Shared Data Phase — One Sprite Source of Truth

Status: in progress.

Goal:

Stop maintaining separate hardcoded sprite lists.

Priority tasks:

- Use `assets/js/dd-canon-roster.js` as the current public shared roster bridge.
- Overlay Studio data from `/studio/databytesprites/species.json` through `dd-studio-data-bridge.js`.
- Move DataByteDex toward the same shared roster bridge.
- Later align the public roster bridge with a Studio-generated game-data manifest.
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

## Studio Support Rule

Status: ongoing.

Goal:

Improve Studio only when it directly supports product development.

Allowed Studio work:

- Data validation needed for Data Discovery.
- Shared sprite data validation.
- Missing asset detection.
- Sprite/move/ability/lore consistency checks.
- Repair plans that directly unblock game content.
- Game data export/import structure.

Deferred Studio work:

- Large new diagnostics dashboards unrelated to product needs.
- Studio AI assistant implementation before the shared game data pipeline works.
- Deep automation not needed for Data Discovery right now.

## Future Automation Phase

Status: future.

Goal:

Let Studio help assemble game content.

Future capabilities:

- Generate sprite stubs.
- Generate DataByteDex entries.
- Detect missing moves, abilities, lore, and assets.
- Recommend content additions.
- Suggest safe commits.
- Explain project architecture.
- Export validated game-ready data.

## Development Rules

- Public site stays visitor-friendly.
- Data Discovery is the flagship product priority.
- Studio is the support platform, not the front door.
- Creator Suite supports the asset pipeline.
- DataByteDex and scanner should move toward one shared data source.
- Health checker / Diagnostics must be updated when new bridge scripts, docs, or data sources are added.
- Keep small, safe commits.
- Update documentation when the strategy changes.
