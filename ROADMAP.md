# VoltanLabs Roadmap

Status: active  
Current focus: Data Discovery product build and shared roster alignment

## Purpose

This roadmap tracks the full VoltanLabs website and product strategy, not only VoltanLabs Studio.

The key decision:

> VoltanLabs Studio is the internal workshop. Data Discovery and the public site are the product-facing priority.

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

The public homepage should remain the front door of VoltanLabs.

The Studio should not replace the public website. Studio should support product development behind the scenes.

VoltArcade should remain the game hub.

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
- Admin profile seed.
- Starter Leovolt seed.
- Local collection storage.
- Seen/Captured local progress.
- Discovery code input.
- Random scan code.
- Encounter creation.
- Battle/capture loop foundation.
- Party local storage.
- Inventory foundation.
- Admin profile panel.
- 52-sprite shared canon roster bridge.
- Product app layer wired to Data Discovery.

Current focus:

- Test the new 52-sprite product build.
- Continue improving scanner → encounter → battle → capture → scanner flow.
- Move DataByteDex to consume the same shared roster bridge.

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

Current issue:

- Studio is powerful, but it should now be used to support Data Discovery instead of expanding for its own sake.

## Active Product Phase — Data Discovery Expansion

Status: active.

Goal:

Make Data Discovery feel like the flagship game instead of a small prototype.

This phase combines the four immediate product priorities:

1. Expand the scanner roster.
2. Align scanner and DataByteDex around one sprite source.
3. Improve the scanner → encounter → battle → capture → scanner loop.
4. Use Studio only to support those product goals.

Completed in the first product pass:

- Added `assets/js/dd-canon-roster.js`.
- Added `assets/js/databyte-discovery-product-app.js`.
- Wired `databyte-discovery.html` to the product app build.
- Scanner now uses the 52-sprite canon roster bridge.
- DataByteDex progress remains synced through the existing Seen/Captured local storage keys.

Next tasks:

- Test the new product app on mobile and desktop.
- Move DataByteDex to consume `DD_CANON_ROSTER`.
- Improve battle feel and capture feedback.
- Add better rarity pools, code categories, and special encounters.
- Add asset hooks for sprite art.

## Shared Data Phase — One Sprite Source of Truth

Status: in progress.

Goal:

Stop maintaining separate hardcoded sprite lists.

Priority tasks:

- Use `assets/js/dd-canon-roster.js` as the current public shared roster bridge.
- Move DataByteDex toward the shared roster bridge.
- Later align the public roster bridge with `/studio/databytesprites/species.json`.
- Validate sprite data through Studio diagnostics.

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

## Studio Support Phase

Status: ongoing support.

Goal:

Improve Studio only when it directly supports product development.

Allowed Studio work:

- Data validation needed for Data Discovery.
- Shared sprite data validation.
- Missing asset detection.
- Sprite/move/ability/lore consistency checks.
- Repair plans that directly unblock game content.

Deferred Studio work:

- Large new diagnostics dashboards.
- Studio AI assistant implementation.
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

## Development Rules

- Public site stays visitor-friendly.
- Data Discovery is the flagship product priority.
- Studio is the support platform, not the front door.
- Creator Suite supports the asset pipeline.
- DataByteDex and scanner should move toward one shared data source.
- Keep small, safe commits.
- Update documentation when the strategy changes.
