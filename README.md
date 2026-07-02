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

Current searchable record families include:

- Modules
- Assets
- Technologies
- Dependency graph records
- DataByteSprites systems
- DataByteSprites source files
- DataByteSprites sprite species

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

DataByteSprites is the flagship project used to prove the Studio knowledge architecture. It now has structured indexes for game systems, source ownership, sprite species, and lore.

Core files:

- `/studio/databytesprites/index.json`
- `/studio/databytesprites/source-files.json`
- `/studio/databytesprites/species.json`
- `/studio/databytesprites/lore.json`

## DataByteSprites Knowledge Layers

The DataByteSprites knowledge system is organized into layers:

1. **Project systems** — scanner, discovery, battle, capture, codex, progression, journal, missions, admin console.
2. **Source-file ownership** — active runtime files, legacy reference files, patch layers, and future rebuild targets.
3. **Sprite species** — species metadata, rarity, evolution lines, capture hooks, battle stat placeholders, DataByteDex references, and asset references.
4. **Lore** — Null signal origin, Voltaverse rules, characters, artifacts, events, threat seeds, and timeline foundations.

Together these form the first project-level knowledge model inside VoltanLabs Studio.

## Development Workflow

This repository follows repository-first development rules:

1. Read the current branch state before making changes.
2. Continue from the latest implementation instead of recreating systems.
3. Make small, safe commits.
4. Push immediately after each completed phase.
5. Report only real commit messages and SHAs returned by GitHub.
6. Keep data structures reusable and offline-first.
7. Prefer adding new indexes through `/studio/knowledge/index.json` instead of hard-coding new search behavior.

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

## Next Highest-Value Work

Recommended next phases:

1. Register the DataByteSprites lore index with the Knowledge Engine and global search adapter.
2. Build a DataByteSprites mechanics graph connecting capture, battle, progression, species, and lore.
3. Add source/runtime load-order documentation for DataByteSprites.
4. Begin DataByteDex renderer integration using the species and lore indexes.
5. Add documentation pages for each Studio subsystem.

## Architecture Principle

Every future Studio system should be able to answer:

- What is this record?
- Where does it live in the repo?
- What project owns it?
- What does it depend on?
- What depends on it?
- Is it active, legacy, planned, locked, or experimental?
- Can Studio search it offline?

If the answer is no, the system should gain an index before it grows further.
