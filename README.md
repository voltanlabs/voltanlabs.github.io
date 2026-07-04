# VoltanLabs Studio

VoltanLabs Studio is an offline-first software development platform for building games, AI tools, creative software, documentation systems, simulations, and future commercial products.

The project has grown from a collection of browser tools into a modular Studio architecture built around a shared runtime, searchable knowledge indexes, diagnostics, reusable assets, and project-specific intelligence.

## Current Focus

**Phase 1.2: Repository Integrity & Actionable Diagnostics is complete as a foundation.**

The current handoff is **Phase 2: Runtime Intelligence Dashboard**. Phase 2 should connect runtime health, runtime load order, bridge checks, and DataByteSprites runtime dependencies to the repository health report created by Phase 1.2.

## Live Studio Areas

- `/studio/` — VoltanLabs Studio shell and global search UI.
- `/studio/diagnostics/` — live Repository Health Dashboard and source checks.
- `/studio/runtime/` — runtime load-order visualizer.
- `/studio/knowledge/index.v2.json` — Knowledge Engine v2 registry.
- `/studio/diagnostics/sources.json` — diagnostics source registry.
- `/studio/validation/rules.json` — validation rules manifest.
- `/studio/validation/phase-1.2-completion.json` — Phase 1.2 completion and Phase 2 handoff manifest.

## Architecture Overview

```text
VoltanLabs Studio
├── Studio Shell
│   ├── Module registry
│   ├── Dashboard renderer
│   └── Studio search UI
├── Knowledge Engine v2
│   ├── Module indexes
│   ├── Asset indexes
│   ├── Technology indexes
│   ├── DataByteSprites indexes
│   └── Common search model
├── Diagnostics
│   ├── Source registry
│   ├── Validation rules
│   ├── Repository Integrity Engine
│   ├── Repository Health Dashboard
│   ├── Dependency Explorer
│   ├── Knowledge coverage metrics
│   ├── Documentation drift validation
│   └── Actionable repair suggestions
├── Runtime System
│   ├── Load-order manifest
│   ├── Runtime loader
│   ├── Runtime health panel
│   └── Bridge health checks
└── Projects
    └── DataByteSprites
        ├── Species index
        ├── Lore index
        ├── Source-file index
        ├── Mechanics graph
        ├── Move index
        ├── Type chart
        └── Ability index
```

## Completed Foundation

### Studio Foundation

Status: complete foundation.

- Studio shell published to the live `main` branch.
- Module registry is live.
- Studio dashboard renders from registry data.
- Knowledge Engine v2 is live.
- Studio search can consume multiple Knowledge Engine record types.
- Diagnostics page is live.
- Runtime Visualizer is live.
- Runtime load-order manifest is live.

### DataByteSprites Knowledge Base

Status: complete foundation.

Live indexes include:

- `studio/databytesprites/species.json`
- `studio/databytesprites/lore.json`
- `studio/databytesprites/source-files.json`
- `studio/databytesprites/mechanics-graph.json`
- `studio/databytesprites/moves.json`
- `studio/databytesprites/type-chart.json`
- `studio/databytesprites/abilities.json`

These are registered through `studio/knowledge/index.v2.json` and are searchable from the Studio UI.

### Runtime Foundation

Status: active foundation.

Live runtime files include:

- `studio/runtime/load-order.json`
- `assets/js/studio-runtime-loader.js`
- `assets/js/studio-runtime-health.js`
- `assets/js/studio-runtime-bridge-checks.js`

The current runtime work focuses on making boot order, bridge health, and DataByteSprites runtime dependencies visible to the Studio.

### Phase 1.2 Repository Integrity Engine

Status: complete foundation.

Phase 1.2 upgraded Diagnostics from basic source checks into a repository-wide architecture analyzer.

Completed capabilities:

- Repository-wide ID graph.
- Cross-index validation.
- Duplicate ID detection.
- Orphan record detection.
- Runtime dependency validation.
- Mechanics graph validation.
- Knowledge coverage metrics.
- Dependency Explorer.
- Source-aware findings.
- Actionable repair suggestions.
- Documentation drift validation.
- Repository Health Dashboard.

The completion manifest lives at `studio/validation/phase-1.2-completion.json`.

## Roadmap

### Phase 1 — Validation Engine

Status: complete foundation.

Built a reusable validation layer that can inspect the Studio registry, all registered indexes, runtime manifests, mechanics graph relationships, source ownership maps, documentation drift, and milestone handoff manifests.

Validation outputs:

- Missing IDs.
- Duplicate IDs.
- Invalid dependencies.
- Broken mechanics graph edges.
- Orphaned records.
- Missing schema versions.
- Invalid runtime load order.
- Missing runtime scripts.
- Knowledge coverage metrics.
- Dependency Explorer edges.
- Actionable repair suggestions.
- Documentation drift warnings.
- Single Studio health report.

### Phase 2 — Runtime Intelligence Dashboard

Status: next phase.

Turn Diagnostics and Runtime Visualizer into a live development dashboard that reports:

- Studio health score.
- Knowledge integrity.
- Runtime modules loaded.
- Runtime load-order status.
- Runtime bridge status.
- Broken references.
- DataByteSprites index coverage.
- Highest-risk gaps.
- Phase 1.2 validation report integration.

Recommended first build: connect runtime visualizer output to `window.VOLTAN_VALIDATION_REPORT` so runtime health and repository health can be viewed together.

### Phase 3 — DataByteSprites Runtime Integration

Status: planned.

Begin consuming the knowledge indexes in actual gameplay systems.

Priority integrations:

- Species-driven capture pool.
- Battle balance pass from species stats, moves, abilities, and type chart.
- DataByteDex renderer from species and lore indexes.
- Journal OS from lore and discovery history.
- Mission OS from lore, graph nodes, and progression goals.

### Phase 4 — Asset Library and Technology Vault Expansion

Status: active foundation / planned expansion.

- Expand the Asset Library into a searchable production asset system.
- Expand the Technology Vault into a reusable engineering reference.
- Link assets, technologies, source files, and project systems through the Knowledge Engine.

### Phase 5 — Studio AI Development Assistant

Status: future milestone.

Once validation and indexing are stable, the Studio should support an AI-assisted development layer that can answer repository-aware questions, suggest refactors, detect drift, and help maintain documentation.

Example goals:

- Find every file related to capture flow.
- Explain what depends on the battle system.
- Detect missing DataByteDex records.
- Recommend the next safest refactor.
- Generate or update indexes from repository state.

## Development Rules

- Repository-first development.
- Offline-first architecture.
- Small, safe commits.
- Push after each completed phase.
- Do not invent commits or SHAs.
- Prefer indexes, manifests, and registries over hardcoded one-off wiring.
- Keep live `main` and development branches reconciled where possible.

## Current Highest-Value Task

Begin **Phase 2: Runtime Intelligence Dashboard** by connecting runtime status, runtime bridge checks, and runtime load order into the Repository Health Dashboard created by Phase 1.2.
