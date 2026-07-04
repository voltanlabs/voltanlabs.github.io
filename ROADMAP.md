# VoltanLabs Studio Roadmap

Status: active  
Phase: 2.1 Documentation & Architecture Audit

## Purpose

This roadmap tracks completed foundations, active documentation work, and planned next phases for VoltanLabs Studio.

## Current Status

VoltanLabs Studio has completed the Phase 2.0 Studio Intelligence foundation and is currently in Phase 2.1 documentation and architecture alignment.

## Phase 1 — Validation Engine

Status: complete foundation.

Completed:

- Repository-wide source loading.
- Validation rules manifest.
- ID graph construction.
- Cross-index reference validation.
- Duplicate ID detection.
- Orphan detection.
- Mechanics graph validation.
- Runtime load-order validation.
- Documentation drift validation.
- Knowledge coverage scoring.
- Dependency explorer edges.
- Repository health report.

## Phase 1.2 — Repository Integrity & Actionable Diagnostics

Status: complete foundation.

Completed:

- Repository Integrity Engine.
- Repository Health Dashboard.
- Source-aware findings.
- Repair suggestions.
- DataByteSprites index validation.
- Runtime dependency validation.
- Phase 1.2 completion manifest.

## Phase 2.0 — Studio Intelligence Dashboard

Status: complete foundation.

Goal:

Turn `/studio/diagnostics/` into the Studio Control Center.

Completed modules:

- Repository Intelligence.
- Repository Health History.
- Auto Repair Engine.
- Dependency Graph Viewer.
- Coverage Heat Map.
- Repository Evolution Dashboard.

Completed exports:

- Full validation report JSON.
- Health history JSON.
- Repair plan JSON.
- Dependency graph JSON.
- Coverage heat map JSON.
- Coverage summary Markdown.
- Evolution dashboard JSON.
- Executive summary Markdown.

## Phase 2.1 — Documentation & Architecture Audit

Status: active.

Goal:

Make the repository self-documenting and bring all documentation into alignment with the current implementation.

Completed so far:

- Repository audit.
- README refresh.
- Architecture map.
- Repository map.
- Diagnostics reference.
- Validation reference.
- Knowledge Engine reference shell.
- Module Index shell.

Remaining:

- Expand Knowledge Engine reference.
- Expand Module Index.
- Complete Phase 2 release notes.
- Keep README, architecture, repository map, and audit status synchronized.

## Phase 2.2 — Predictive Diagnostics

Status: planned.

Goal:

Use the Phase 2.0 Studio Intelligence stack to detect patterns and recommend maintenance actions before problems grow.

Planned capabilities:

- Correlate repeated warning categories.
- Predict technical debt growth.
- Recommend safest repair order.
- Detect stale documentation automatically.
- Identify fragile indexes.
- Generate architecture recommendations from repository state.
- Create predictive report exports.

## Phase 3 — DataByteSprites Runtime Integration

Status: planned.

Goal:

Begin consuming DataByteSprites knowledge indexes inside runtime and gameplay systems.

Priority integrations:

- Species-driven capture pool.
- Battle balance pass from species stats, moves, abilities, and type chart.
- DataByteDex renderer from species and lore indexes.
- Journal OS from lore and discovery history.
- Mission OS from lore, graph nodes, and progression goals.
- Runtime dependency hooks for scanner, battle, capture, and journal systems.

## Phase 4 — Asset Library and Technology Vault Expansion

Status: active foundation / planned expansion.

Goal:

Turn foundational indexes into useful production systems.

Planned work:

- Expand Asset Library schema.
- Add asset ownership and usage maps.
- Expand Technology Vault categories.
- Add license and offline-first reference structures.
- Link assets and technologies into the Knowledge Engine.

## Phase 5 — Studio AI Development Assistant

Status: future milestone.

Goal:

Add repository-aware assistant capabilities on top of the Knowledge Engine and Diagnostics systems.

Future capabilities:

- Ask repository-aware questions.
- Explain dependencies.
- Suggest refactors.
- Generate or repair indexes.
- Maintain documentation.
- Propose safe next commits.

## Development Rules

- Work in small, safe phases.
- Keep documentation synchronized after each major phase.
- Prefer registries, manifests, and indexes over one-off wiring.
- Keep diagnostics as the repository health authority.
- Avoid expanding undocumented systems until they are mapped.
- Preserve offline-first and browser-first architecture.
