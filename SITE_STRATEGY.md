# VoltanLabs Site Strategy Audit

Status: active  
Purpose: clarify the public website, Studio, Data Discovery, Creator Suite, and roadmap direction.

## Why This Audit Exists

VoltanLabs has grown in two directions at the same time:

1. A public creative website with games, tools, and worlds.
2. An internal Studio platform with diagnostics, validation, knowledge indexes, runtime tools, and repository intelligence.

Both are useful, but they serve different audiences. This audit defines the difference so the roadmap can focus on finishing playable products without losing the Studio foundation.

## Current Site Model

The current site already has the right high-level pieces:

```text
VoltanLabs Public Site
├── Home
├── VoltArcade
│   ├── Data Discovery
│   ├── DataByteDex
│   ├── Databyte Arena
│   └── Voltan's Quest
├── Creator Suite
├── Technology Vault
├── About / Contact / Programs
└── VoltanLabs Studio
    ├── Knowledge Engine
    ├── Diagnostics
    ├── Runtime Visualizer
    ├── Asset Library
    └── Repository Intelligence
```

## Public Website Role

The public website is the front door.

Its job is to answer:

- What is VoltanLabs?
- What can I play?
- What can I use?
- What is being built?
- Where should I go first?

The homepage should stay product-facing and visitor-friendly.

Current public homepage direction:

- VoltanLabs is presented as a digital universe.
- Main destinations are VoltArcade, Data Discovery, DataByteDex, and Arena.
- Creator Suite is presented as the supporting tool layer.

This is the correct direction.

## Studio Role

VoltanLabs Studio is not meant to replace the public website.

Studio is the workshop behind the website.

Its job is to answer:

- What exists in the repository?
- What is broken?
- What depends on what?
- What changed over time?
- What should be repaired next?
- Which indexes support which products?

Studio should remain accessible, but it should be framed as an internal operating hub rather than the main public experience.

## Product Priority

The flagship product should now be:

**DataByteSprites: Data Discovery**

Studio should support Data Discovery instead of distracting from it.

The new rule:

> Build Studio only when it directly helps Data Discovery, Creator Suite, or another public product move forward.

## Key Audit Findings

### 1. Homepage is already public-facing

The homepage already presents VoltanLabs as a public creative site. It features VoltArcade, Data Discovery, DataByteDex, Databyte Arena, and Creator Suite.

Decision:

- Keep the homepage public-facing.
- Do not make `/studio/` the default face of the website.

### 2. VoltArcade is the correct game hub

VoltArcade already presents Data Discovery as the featured game and links to Scanner, DataByteDex, Arena, and future game experiences.

Decision:

- Keep VoltArcade as the game hub.
- Make Data Discovery the featured playable experience.

### 3. Data Discovery is playable but content-light

The public DataByteDex lists 52 canon sprites, but the live scanner currently uses a much smaller hardcoded template list.

Decision:

- The next game pass should connect Data Discovery to the full sprite roster or expand its internal roster to match DataByteDex.

### 4. DataByteDex is useful but should become data-driven

DataByteDex currently presents the 52-sprite roster and tracks Seen/Captured progress through local storage.

Decision:

- Keep DataByteDex public.
- Later move it toward shared index data from `/studio/databytesprites/species.json` instead of maintaining separate hardcoded data.

### 5. Creator Suite is real and should stay public

Creator Suite is a public tool layer for making assets, animation frames, GIFs, and sprite sheets.

Decision:

- Keep Creator Suite public.
- Treat it as the production pipeline that supports Data Discovery and future games.

### 6. Studio is powerful but needs clearer positioning

Studio has become the repository operating system: Knowledge Engine, Validation, Diagnostics, Health History, Auto Repair, Dependency Graph, Coverage Heat Map, Evolution Dashboard, and Predictive Diagnostics.

Decision:

- Keep Studio as the internal operating hub.
- Do not prioritize more Studio expansion until it supports Data Discovery or product publishing.

## New Strategic Hierarchy

```text
1. Public Face
   Home, About, Contact, Programs

2. Product Layer
   VoltArcade, Data Discovery, DataByteDex, Arena, Voltan's Quest

3. Creator Layer
   Draw, Character Forge, Gif Forge, Sprite Sheet Forge, PromptCraft

4. Studio Layer
   Knowledge Engine, Diagnostics, Runtime, Asset Library, Validation

5. Future Automation Layer
   Predictive Diagnostics, Studio AI Assistant, automated index generation
```

## Roadmap Reset

### Phase A — Site Clarity

Goal:

Make the website hierarchy clear.

Tasks:

- Public homepage remains the VoltanLabs front door.
- VoltArcade remains the game hub.
- Studio is documented as the internal workshop.
- Roadmap explains product priority clearly.

### Phase B — Data Discovery Product Push

Goal:

Make Data Discovery feel like the flagship game.

Tasks:

- Connect scanner to more sprites.
- Bring the scanner roster closer to the 52-sprite DataByteDex roster.
- Improve discovery, encounter, battle, capture, and return-to-scanner flow.
- Improve save/load and collection reliability.
- Strengthen party, item, and Admin profile systems.

### Phase C — Shared Data Integration

Goal:

Stop maintaining separate hardcoded sprite rosters.

Tasks:

- Use `/studio/databytesprites/species.json` or a public export as the shared sprite source.
- Make DataByteDex and Data Discovery consume the same data source.
- Validate moves, abilities, and type chart before gameplay consumption.
- Use Studio diagnostics to catch broken game data.

### Phase D — Creator Pipeline Support

Goal:

Make Creator Suite feed the game pipeline.

Tasks:

- Create asset naming rules.
- Connect sprite assets to species IDs.
- Add placeholder art flow for every sprite.
- Build simple export paths from Creator Suite into game-ready assets.

### Phase E — Studio Automation

Goal:

Let Studio help assemble future content.

Tasks:

- Generate sprite stubs.
- Generate DataByteDex stubs.
- Detect missing sprite assets.
- Detect missing moves, abilities, or lore.
- Recommend next content additions.

## Near-Term Recommendation

Stop adding major Studio features for the moment.

Use the existing Studio foundation as support while the next work focuses on:

1. Data Discovery roster expansion.
2. Data Discovery gameplay flow cleanup.
3. DataByteDex and scanner data alignment.
4. Public roadmap and site clarity.

## Guiding Principle

VoltanLabs Studio builds the products.

Data Discovery is the product that should now drive the Studio.
