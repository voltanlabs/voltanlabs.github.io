# VoltanLabs Studio Knowledge Engine

Status: active  
Phase: 2.1 Documentation & Architecture Audit

## Purpose

The Knowledge Engine is the metadata backbone of VoltanLabs Studio. It tells the Studio what modules, indexes, collections, record types, and searchable data exist.

Primary registry:

- `studio/knowledge/index.v2.json`

The Knowledge Engine is used by:

- Studio Shell
- Studio search
- Diagnostics
- Validation
- Coverage scoring
- Future repository-aware AI tools

## Core Responsibilities

The Knowledge Engine should:

- Register Studio modules.
- Register project indexes.
- Register DataByteSprites data sources.
- Describe searchable record types.
- Provide paths for diagnostics and future automation.
- Preserve stable IDs and metadata.
- Serve as the repository inventory for future AI tooling.

## Registry Role

The registry is not just a list of files. It is the Studio's map of what the repository knows.

The registry should answer:

- What modules exist?
- What data indexes exist?
- Where are they stored?
- What type of records do they contain?
- Which systems should be searchable?
- Which systems are active, foundational, planned, or future-facing?

## Registered System Types

Known Knowledge Engine areas include:

| Area | Purpose |
| --- | --- |
| Studio modules | Register major Studio areas and pages. |
| DataByteSprites indexes | Register species, lore, moves, abilities, mechanics, source files, and type chart data. |
| Asset indexes | Register reusable creative and production assets. |
| Technology references | Register reusable technology and licensing knowledge. |
| Search metadata | Define searchable fields and display behavior. |
| Future modules | Track planned systems before implementation. |

## DataByteSprites Indexes

Primary path:

- `studio/databytesprites/`

Active indexes:

- `species.json`
- `lore.json`
- `source-files.json`
- `mechanics-graph.json`
- `moves.json`
- `type-chart.json`
- `abilities.json`

These indexes provide the strongest project-specific test case for the Knowledge Engine.

## Record Types

Common record types include:

| Record Type | Description |
| --- | --- |
| `module` | Studio module or major system. |
| `species` | DataByteSprites species record. |
| `lore` | Lore, story, or canon record. |
| `sourceFile` | Source ownership and file map record. |
| `mechanicsGraph` | Relationship graph for mechanics and systems. |
| `move` | DataByteSprites move record. |
| `typeChart` | Element/type effectiveness record. |
| `ability` | DataByteSprites ability record. |
| `asset` | Reusable asset record. |
| `technology` | Technology Vault reference record. |

## ID Strategy

Stable IDs are required for repository intelligence.

Preferred ID rules:

- Use `id` as the primary identifier when possible.
- Keep IDs lowercase and descriptive.
- Avoid spaces in IDs.
- Avoid changing IDs once other records reference them.
- Prefer stable semantic IDs over generated random IDs.
- Use aliases only when necessary for compatibility.

Good examples:

- `databytesprites`
- `studio-diagnostics`
- `runtime-visualizer`
- `leovolt`
- `capture-system`

Avoid:

- Temporary names that will change.
- Duplicate IDs across records of the same kind.
- IDs tied to visual labels that may be rewritten later.

## Search Fields

Searchable records should provide enough text for Studio search and future AI tools.

Recommended fields:

- `id`
- `name`
- `title`
- `label`
- `description`
- `summary`
- `tags`
- `status`
- `path`
- `relatedSystems`
- `relatedCharacters`
- `relatedSpecies`

## Status Conventions

Common statuses:

| Status | Meaning |
| --- | --- |
| `active` | Live and currently used. |
| `active-foundation` | Exists and is meant to grow. |
| `planned` | Intentionally planned but not implemented. |
| `future` | Future-facing concept. |
| `locked` | Intentional locked content. |
| `design-seed` | Early design record. |
| `pending` | Awaiting implementation or review. |

Validation and diagnostics may treat planned or intentionally parked records differently from broken records.

## Relationship Fields

The Knowledge Engine supports cross-index reasoning through relationship fields.

Common fields:

- `dependencies`
- `relatedSpecies`
- `relatedSystems`
- `relatedCharacters`
- `learnedBy`
- `assignedTo`
- `requires`
- `assetRefs`
- `dexRefs`

These fields allow Diagnostics to build dependency graphs and find broken references.

## Source Ownership

Every major system should eventually have a source ownership trail.

Source ownership helps answer:

- Which file owns this system?
- Which JSON index describes it?
- Which runtime file depends on it?
- Which docs explain it?

Important reference:

- `studio/databytesprites/source-files.json`

## Diagnostics Relationship

Diagnostics consumes Knowledge Engine data indirectly through registered sources and indexes.

Flow:

```text
Knowledge Engine registry
        │
        ▼
Diagnostics source registry
        │
        ▼
Validation Engine
        │
        ▼
Studio Intelligence modules
```

The Knowledge Engine should stay aligned with:

- `studio/diagnostics/sources.json`
- `studio/validation/rules.json`
- `REPOSITORY_MAP.md`
- `MODULE_INDEX.md`

## Adding a New Index

When adding a new index:

1. Create the JSON file with a `schemaVersion`.
2. Add stable IDs to records.
3. Add human-readable names or labels.
4. Add descriptions or summaries.
5. Add relationship fields where useful.
6. Register the index in the Knowledge Engine if it should be searchable.
7. Register the source in Diagnostics if it should be validated.
8. Update documentation maps.

## Adding a New Module

When adding a new module:

1. Create a module manifest under `studio/modules/` when applicable.
2. Give the module a stable ID.
3. Define status, purpose, and primary paths.
4. Add it to the Knowledge Engine registry.
5. Add it to `MODULE_INDEX.md`.
6. Update `REPOSITORY_MAP.md` if it creates a new top-level or major area.
7. Add validation coverage if it introduces data records.

## Maintenance Rules

- The Knowledge Engine is the inventory of what Studio knows exists.
- The Repository Map is the human-readable status map.
- The Module Index is the human-readable module catalog.
- Diagnostics is the health authority.
- Validation is the rules authority.

When one changes, check the others.

## Future Direction

The Knowledge Engine should evolve into the foundation for:

- Repository-aware search.
- Predictive diagnostics.
- Studio AI assistant context.
- DataByteSprites runtime integration.
- Asset and technology relationship maps.
- Automated documentation repair suggestions.
