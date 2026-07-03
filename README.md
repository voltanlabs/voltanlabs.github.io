# VoltanLabs Studio

VoltanLabs is being rebuilt from a page-first website into an offline-first creative software studio for games, tools, assets, documentation, local AI workflows, and future commercial products.

Primary site: **VoltanLabs.com**

Current active development branch: `studio/foundation-files`

## Studio Direction

VoltanLabs Studio is the operating hub for the wider VoltanLabs ecosystem. The current architecture prioritizes:

- Repository-first development
- Offline-first data files and browser-side systems
- Modular Studio indexes
- Searchable project knowledge
- Reusable assets and manifests
- Small verified commits
- Data-driven project growth instead of patch-only page edits

## Current Studio Systems

### Studio Shell

The Studio dashboard lives at `/studio/` and renders project modules through shared browser-side registry files.

Core files:

- `/studio/index.html`
- `/assets/studio-registry.js`
- `/assets/studio-shell.js`

### Knowledge Engine

The Knowledge Engine is the central index registry for Studio search and project memory.

Core file:

- `/studio/knowledge/index.json`

It registers every searchable index and defines the common record model used by Studio-wide search.

### Studio-wide Global Search

The global search system is registry-driven. It reads `/studio/knowledge/index.json`, loads each registered index, adapts records into a shared search shape, and renders results in the Studio UI.

Core file:

- `/assets/asset-search.js`

Current searchable record families include modules, assets, technologies, dependency graph records, DataByteSprites systems, source files, species, lore, mechanics, moves, type chart rules, and passive abilities.

### Studio Diagnostics

The Studio diagnostics dashboard checks the core offline indexes, DataByteSprites content files, and runtime manifest from one page.

Core file:

- `/studio/diagnostics/index.html`

It reports loaded sources, record counts, warnings, failed JSON loads, missing schema versions, missing species battle stats, missing move learn rules, ability assignment issues, and runtime dependency problems. It can also copy a JSON diagnostic report.

### Runtime Visualizer

The runtime visualizer renders the manifest-driven boot phases, modules, dependencies, and failure behavior.

Core files:

- `/studio/runtime/index.html`
- `/studio/runtime/load-order.json`
- `/assets/js/studio-runtime-loader.js`
- `/assets/js/studio-runtime-health.js`
- `/assets/js/studio-runtime-bridge-checks.js`

### Asset Library

The Asset Library provides an offline-first catalog for VoltanLabs assets, previews, dependencies, licenses, and reusable files.

Core file:

- `/studio/assets/index.json`

### Technology Vault

The Technology Vault tracks vetted and research-stage technologies for local-first development, commercial safety, licensing, and implementation planning.

Core files:

- `/technology-vault/data/technologies.json`
- `/studio/technology/index.json`

### Project Dependency Graph

The dependency graph maps Studio modules, indexes, systems, projects, and planned intelligence layers.

Core file:

- `/studio/graph/index.json`

### DataByteSprites Knowledge Integration

DataByteSprites is the flagship project used to prove the Studio knowledge architecture. It now has structured indexes for game systems, source ownership, sprite species, lore, mechanics, moves, type rules, and passive abilities.

Core files:

- `/studio/databytesprites/index.json`
- `/studio/databytesprites/source-files.json`
- `/studio/databytesprites/species.json`
- `/studio/databytesprites/lore.json`
- `/studio/databytesprites/mechanics-graph.json`
- `/studio/databytesprites/moves.json`
- `/studio/databytesprites/type-chart.json`
- `/studio/databytesprites/abilities.json`

## DataByteSprites Knowledge Layers

The DataByteSprites knowledge system is organized into layers:

1. **Project systems** — scanner, discovery, battle, capture, codex, progression, journal, missions, admin console.
2. **Source-file ownership** — active runtime files, legacy reference files, patch layers, and future rebuild targets.
3. **Sprite species** — species metadata, rarity, evolution lines, capture hooks, battle stat placeholders, DataByteDex references, and asset references.
4. **Lore** — Null signal origin, Voltaverse rules, characters, artifacts, events, threat seeds, and timeline foundations.
5. **Mechanics graph** — relationships between scanner, capture, battle, species, lore, source owners, and future runtime integrations.
6. **Gameplay content** — moves, type effectiveness rules, and passive abilities.
7. **Runtime bridges** — additive browser-side systems that connect indexed data to Data Discovery without replacing the core Scanner OS all at once.

Together these form the first project-level knowledge model inside VoltanLabs Studio.

## Data Discovery Runtime

`databyte-discovery.html` now boots through the manifest-driven runtime loader instead of directly listing every bridge script.

Current boot entry:

- `/assets/js/studio-runtime-loader.js`

Current runtime manifest:

- `/studio/runtime/load-order.json`

The manifest loads:

1. Capture pool bridge
2. Battle balance bridge
3. Move runtime bridge
4. Type-effectiveness bridge
5. Passive ability bridge
6. Scanner OS runtime
7. Scanner background effects
8. Runtime bridge health checks

## DataByteDex Runtime

The DataByteDex page now uses a Knowledge Engine powered renderer.

Core files:

- `/databytedex.html`
- `/assets/js/databytedex-knowledge-renderer.js`

The renderer loads:

- `/studio/databytesprites/species.json`
- `/studio/databytesprites/lore.json`

It preserves seen and captured progress from local storage while rendering indexed species, lore links, battle stat seeds, discovery hooks, capture data, and rarity.

## Development Workflow

This repository follows repository-first development rules:

1. Read the current branch state before making changes.
2. Continue from the latest implementation instead of recreating systems.
3. Make small, safe commits.
4. Push immediately after each completed phase.
5. Report only real commit messages and SHAs returned by GitHub.
6. Keep data structures reusable and offline-first.
7. Prefer adding new indexes through `/studio/knowledge/index.json` instead of hard-coding new search behavior.
8. Prefer additive runtime bridges until the scanner can be safely consolidated into stable runtime modules.

## Completed Studio Foundation Phases

- Studio module registry
- Studio shell renderer
- Studio dashboard rendering
- Module manifest architecture
- Knowledge Engine index
- Knowledge Engine search
- Studio search UI
- Asset Library Index
- Asset search engine
- Technology Vault indexing
- Project dependency graph
- Studio-wide registry-driven global search
- DataByteSprites project index
- DataByteSprites source-file index
- DataByteSprites sprite species index
- DataByteSprites lore index
- DataByteSprites mechanics graph
- Knowledge-driven DataByteDex renderer
- Species capture pool bridge
- Battle balance bridge
- Move list index and move runtime bridge
- Type chart index and type-effectiveness bridge
- Passive ability index and ability runtime bridge
- Gameplay indexes registered with Studio global search
- Runtime load-order manifest
- Studio runtime loader
- Runtime health panel
- Bridge health checks
- Runtime visualizer page
- Studio diagnostics dashboard

## Next Highest-Value Work

Recommended next phases:

1. Register diagnostics in the Studio dashboard/module registry.
2. Promote bridge health results into a persistent diagnostics report format.
3. Add missing asset/reference detection across species, lore, moves, abilities, and source files.
4. Add DataByteDex ability and move display sections.
5. Begin consolidating capture, battle, moves, types, and abilities into cleaner Data Discovery runtime modules.

## Architecture Principle

Every future Studio system should be able to answer:

- What is this record?
- Where does it live in the repo?
- What project owns it?
- What does it depend on?
- What depends on it?
- Is it active, legacy, planned, locked, or experimental?
- Can Studio search it offline?
- Can diagnostics validate it?

If the answer is no, the system should gain an index, runtime check, or documentation before it grows further.
