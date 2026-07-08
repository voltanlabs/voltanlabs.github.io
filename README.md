# VoltanLabs Studio

VoltanLabs Studio is an offline-first software development platform for building games, AI tools, creative software, documentation systems, simulations, and future commercial products.

The project has grown from a collection of browser tools into a modular Studio architecture built around a shared runtime, searchable knowledge indexes, diagnostics, reusable assets, project-specific intelligence, and repository health automation.

## Current Focus

**Data Discovery Phase 4.3: Canonical Scanner OS Runtime is active.**

The current priority is stabilizing DataByteSprites: Data Discovery as a mobile-first Scanner OS. The live game now boots through dedicated runtime owners for roster data, Studio data overlays, gameplay rules, encounter generation, capture/download logic, battle resolution, battle state, battle presentation, collection, party, inventory, Dex progress, and Product App v3.5 UI orchestration.

The newest architecture change is that `assets/js/dd-scanner-os-runtime.js` is now the canonical owner for Scanner OS layout. It owns the fixed viewport, scanner shell, battle layout, mobile spacing, action controls, navigation sizing, and battle centerline rules.

The previous layout wrapper files are no longer loaded by `dd-scan-bg.js`:

- `dd-mobile-game-tray-4-2.js`
- `dd-unified-scanner-shell-4-3.js`
- `dd-unified-scanner-shell-4-3-once.js`
- `dd-battle-centerline-fix-4-3.js`

Current stabilization goals:

- Keep Scan, Encounter, Battle, Download, Dex, Party, Items, and Admin views inside one stable app shell.
- Keep `dd-scanner-os-runtime.js` as the only active Scanner/Battle layout owner.
- Audit Product App v3.5 for remaining battle layout assumptions instead of adding new CSS wrappers.
- Keep Diagnostics, the Knowledge Engine, source ownership, runtime manifests, mechanics graphs, README, ROADMAP, and PROJECT_STATE synchronized.
- Continue splitting gameplay state out of Product App v3.5 into dedicated runtime modules.

## Live Studio Areas

- `/studio/` — VoltanLabs Studio shell and global search UI.
- `/studio/diagnostics/` — Studio Intelligence dashboard and repository health control center.
- `/studio/runtime/` — runtime load-order visualizer.
- `/studio/knowledge/index.v2.json` — Knowledge Engine v2 registry.
- `/studio/diagnostics/sources.json` — diagnostics source registry.
- `/studio/validation/rules.json` — validation rules manifest.
- `/studio/validation/phase-1.2-completion.json` — Phase 1.2 completion and handoff manifest.
- `/studio/databytesprites/` — DataByteSprites project indexes.
- `/studio/assets/index.json` — Asset Library index.
- `/technology-vault/` — Technology Vault foundation.
- `/tools.html` — Creator Suite entry point.
- `/databyte-discovery.html` — DataByteSprites: Data Discovery live runtime.
- `/databytedex.html` — DataByteDex shared roster view.

## Documentation Map

| Document | Path | Status |
| --- | --- | --- |
| Living Project State | `PROJECT_STATE.md` | Active source of truth |
| Roadmap | `ROADMAP.md` | Active |
| Phase 4.3 Architecture Snapshot | `docs/phase-4.3-architecture-snapshot.md` | Active reference |
| Site Strategy | `SITE_STRATEGY.md` | Active |
| Runtime Load Order | `studio/runtime/load-order.json` | Active |
| Diagnostics Sources | `studio/diagnostics/sources.json` | Active |
| Runtime Ownership Audit | `docs/databyte-runtime-ownership-audit.md` | Active |
| Gameplay Ownership Audit | `docs/databyte-gameplay-ownership-audit.md` | Active |
| Phase 4 Bookkeeping | `docs/datadiscovery-phase-4-bookkeeping.md` | Active |
| Studio Game Integration Roadmap | `studio/docs/STUDIO_GAME_INTEGRATION_ROADMAP.md` | Active |
| Repository Audit | `docs/phase-2.1-repository-audit.md` | Reference |
| Architecture Map | `ARCHITECTURE.md` | Reference |
| Repository Map | `REPOSITORY_MAP.md` | Reference |
| Diagnostics Reference | `DIAGNOSTICS.md` | Reference |
| Validation Reference | `VALIDATION.md` | Reference |
| Knowledge Engine Reference | `KNOWLEDGE_ENGINE.md` | Reference |
| Module Index | `MODULE_INDEX.md` | Reference |
| Release Notes | `RELEASE_NOTES_PHASE2.md` | Reference |

## Current Data Discovery Runtime Chain

```text
databyte-discovery.html
├── dd-canon-roster.js
├── dd-studio-data-bridge.js
├── dd-battle-engine-2-4.js
├── dd-gameplay-rules-2-4.js
├── dd-capture-runtime.js
├── dd-encounter-runtime.js
├── dd-battle-balance-2-4.js
├── dd-battle-resolver.js
├── dd-battle-state-runtime.js
├── dd-battle-presentation-runtime.js
├── dd-collection-runtime.js
├── dd-party-runtime.js
├── dd-party-switch-runtime.js
├── dd-inventory-runtime.js
├── dd-dex-runtime.js
├── dd-collection-dex-runtime-bridge.js
├── databyte-discovery-product-app-v3-5.js
├── dd-health-signal-bridge.js
└── dd-scan-bg.js
    └── dd-scanner-os-runtime.js
```

## Current Runtime Owners

- `assets/js/dd-encounter-runtime.js` — encounter generation, rarity pools, signal initialization.
- `assets/js/dd-capture-runtime.js` — download odds, caps, rolls, failed-download bonuses, and Signal Boost behavior.
- `assets/js/dd-gameplay-rules-2-4.js` — gameplay rules for capture/download, stability, and move tuning.
- `assets/js/dd-battle-engine-2-4.js` — type utilities, enemy move choice, battle events, audio/animation hooks.
- `assets/js/dd-battle-resolver.js` — turn order, hit checks, damage math, enemy move choice, and capture pressure output.
- `assets/js/dd-battle-state-runtime.js` — battle state transitions.
- `assets/js/dd-battle-presentation-runtime.js` — battle presentation hooks.
- `assets/js/dd-collection-runtime.js` — downloaded sprite collection state.
- `assets/js/dd-party-runtime.js` — party state and lead sprite resolution.
- `assets/js/dd-party-switch-runtime.js` — party switching foundation.
- `assets/js/dd-inventory-runtime.js` — ByteCoins, boosts, and repair item state.
- `assets/js/dd-dex-runtime.js` — Dex progress state.
- `assets/js/dd-scanner-os-runtime.js` — canonical Scanner OS layout owner.
- `assets/js/databyte-discovery-product-app-v3-5.js` — active UI orchestration for scanner, encounter, battle, download, party, items, Dex, and Admin.

## Roadmap

See `ROADMAP.md` for the dedicated roadmap.

Summary:

- Phase 1: Validation Engine — complete foundation.
- Phase 1.2: Repository Integrity & Actionable Diagnostics — complete foundation.
- Phase 2.0: Studio Intelligence Dashboard — complete foundation.
- Phase 2.1: Documentation & Architecture Audit — complete foundation / reference.
- Phase 2.2: Predictive Diagnostics — active foundation.
- Phase 2.3: Shared Game Data Pipeline — active foundation.
- Phase 2.4: Battle Engine and Gameplay Consolidation — active foundation.
- Phase 3: DataByteSprites Runtime Integration — complete foundation.
- Phase 4.1: Party switching foundation — active foundation.
- Phase 4.2: Battle experience and mobile layout stabilization — compatibility foundation.
- Phase 4.3: Canonical Scanner OS Runtime — active stabilization.
- Phase 4.4: Product App battle layout ownership audit — next.
- Phase 5: Studio AI Development Assistant — future milestone.

## Development Rules

- Repository-first development.
- Offline-first architecture.
- Small, safe commits.
- Push after each completed phase.
- Do not invent commits or SHAs.
- Prefer indexes, manifests, and registries over hardcoded one-off wiring.
- Keep live `main` and development branches reconciled where possible.
- Documentation must match the implementation state after each major phase.
- Do not add new layout wrappers for the battle screen; consolidate ownership instead.

## Current Highest-Value Task

Continue the **Phase 4.3 Scanner OS stabilization pass** by auditing Product App v3.5 battle markup and CSS, removing duplicate battle layout ownership, keeping `dd-scanner-os-runtime.js` as the canonical layout owner, and rerunning Diagnostics after each safe pass.
