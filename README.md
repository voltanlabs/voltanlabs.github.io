# VoltanLabs Studio

VoltanLabs Studio is an offline-first software development platform for building games, AI tools, creative software, documentation systems, simulations, and future commercial products.

The project has grown from a collection of browser tools into a modular Studio architecture built around shared runtimes, searchable knowledge indexes, diagnostics, reusable assets, project-specific intelligence, and repository health automation.

## Current Focus

**Data Discovery Phase 4.3: Canonical Scanner OS Runtime is active.**

The current priority is stabilizing DataByteSprites: Data Discovery as a mobile-first Scanner OS. The live game now boots through dedicated runtime owners for roster data, Studio data overlays, gameplay rules, encounter generation, download logic, battle resolution, battle state, battle presentation, collection, party, inventory, Dex progress, and Product App v3.5 UI orchestration.

`assets/js/dd-scanner-os-runtime.js` is the canonical Scanner OS layout owner. It owns the fixed viewport, scanner shell, battle layout, mobile spacing, action controls, navigation sizing, and battle centerline rules.

The previous layout wrapper files are no longer loaded by `dd-scan-bg.js`:

- `dd-mobile-game-tray-4-2.js`
- `dd-unified-scanner-shell-4-3.js`
- `dd-unified-scanner-shell-4-3-once.js`
- `dd-battle-centerline-fix-4-3.js`

Current stabilization goals:

- Keep Scan, Encounter, Battle, Download, Dex, Party, Items, and Admin views inside one stable app shell.
- Keep `dd-scanner-os-runtime.js` as the only active Scanner/Battle layout owner.
- Audit Product App v3.5 for remaining battle layout assumptions instead of adding new CSS wrappers.
- Continue splitting gameplay state out of Product App v3.5 into dedicated runtime modules.

## Live Studio Areas

- `/studio/` — VoltanLabs Studio shell and global search UI.
- `/studio/diagnostics/` — Studio Intelligence dashboard and repository health control center.
- `/studio/runtime/` — runtime load-order visualizer.
- `/studio/knowledge/index.v2.json` — Knowledge Engine v2 registry.
- `/studio/diagnostics/sources.json` — diagnostics source registry.
- `/studio/validation/rules.json` — validation rules manifest.
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
| Roadmap | `ROADMAP.md` | Active short roadmap |
| Consolidated Studio Reference | `docs/studio-reference.md` | Active technical reference |
| Phase 4.3 Architecture Snapshot | `docs/phase-4.3-architecture-snapshot.md` | Active Data Discovery snapshot |
| Site Strategy | `SITE_STRATEGY.md` | Active public-site strategy |
| Runtime Load Order | `studio/runtime/load-order.json` | Active machine-readable manifest |
| Diagnostics Sources | `studio/diagnostics/sources.json` | Active machine-readable registry |

Older Phase 2 root docs have been consolidated into `docs/studio-reference.md` and should not continue growing independently.

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
- `assets/js/dd-gameplay-rules-2-4.js` — gameplay rules for download, stability, and move tuning.
- `assets/js/dd-battle-engine-2-4.js` — type utilities, enemy move choice, battle events, audio/animation hooks.
- `assets/js/dd-battle-resolver.js` — turn order, hit checks, damage math, enemy move choice, and download pressure output.
- `assets/js/dd-battle-state-runtime.js` — battle state transitions.
- `assets/js/dd-battle-presentation-runtime.js` — battle presentation hooks.
- `assets/js/dd-collection-runtime.js` — downloaded sprite collection state.
- `assets/js/dd-party-runtime.js` — party state and lead sprite resolution.
- `assets/js/dd-party-switch-runtime.js` — party switching foundation.
- `assets/js/dd-inventory-runtime.js` — ByteCoins, boosts, and repair item state.
- `assets/js/dd-dex-runtime.js` — Dex progress state.
- `assets/js/dd-scanner-os-runtime.js` — canonical Scanner OS layout owner.
- `assets/js/databyte-discovery-product-app-v3-5.js` — active UI orchestration for scanner, encounter, battle, download, party, items, Dex, and Admin.

## Development Rules

- Repository-first development.
- Offline-first architecture.
- Small, safe commits.
- Push after each completed phase.
- Do not invent commits or SHAs.
- Prefer indexes, manifests, and registries over hardcoded one-off wiring.
- Documentation must match the implementation state after each major phase.
- Do not add new layout wrappers for the battle screen; consolidate ownership instead.

## Current Highest-Value Task

Continue the **Phase 4.3 Scanner OS stabilization pass** by auditing Product App v3.5 battle markup and CSS, removing duplicate battle layout ownership, keeping `dd-scanner-os-runtime.js` as the canonical layout owner, and rerunning Diagnostics after each safe pass.
