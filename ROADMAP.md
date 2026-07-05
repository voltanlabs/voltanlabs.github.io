# VoltanLabs Roadmap

Status: active  
Current focus: site clarity, Data Discovery product push, and Studio-as-support

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

Data Discovery should become the flagship playable product.

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

Status: playable foundation.

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
- Floating menu foundation.

Current issue:

- DataByteDex lists 52 canon sprites, but the live scanner currently uses a much smaller hardcoded sprite template list.

### DataByteDex Foundation

Status: active foundation.

Completed:

- 52 canon entries.
- Seen count.
- Captured count.
- Search.
- Local storage integration with Data Discovery progress.

Current issue:

- DataByteDex roster is hardcoded separately from the scanner and Studio indexes.

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

## Active Strategy Phase — Site Clarity & Product Focus

Status: active.

Goal:

Clarify the site hierarchy and shift development priority back toward playable products.

Tasks:

- Keep the homepage public-facing.
- Keep VoltArcade as the game hub.
- Keep Studio as the internal operating hub.
- Use `SITE_STRATEGY.md` as the strategic reference.
- Update future docs and roadmap language around product-first development.

## Next Product Phase — Data Discovery Expansion

Status: next.

Goal:

Make Data Discovery feel like the flagship game instead of a small prototype.

Priority tasks:

1. Expand the scanner roster.
2. Bring scanner content closer to the 52-sprite DataByteDex roster.
3. Improve the scanner → encounter → battle → capture → scanner loop.
4. Improve party, inventory, and Admin profile panels.
5. Improve save/load reliability.
6. Add more sprite variety, rarity behavior, and encounter rules.
7. Keep DataByteDex progress in sync with Data Discovery.

## Shared Data Phase — One Sprite Source of Truth

Status: planned.

Goal:

Stop maintaining separate hardcoded sprite lists.

Priority tasks:

- Choose the canonical sprite data source.
- Move scanner roster toward shared JSON data.
- Move DataByteDex toward shared JSON data.
- Align Studio species indexes, DataByteDex, and scanner data.
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
