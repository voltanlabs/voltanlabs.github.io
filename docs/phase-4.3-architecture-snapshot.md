# Data Discovery Phase 4.3 Architecture Snapshot

Status: active reference  
Phase: Canonical Scanner OS Runtime

## Purpose

This snapshot records the current DataByteSprites: Data Discovery architecture after the Scanner OS consolidation pass.

## Current Architecture Decision

Data Discovery now uses a canonical Scanner OS runtime as the intended single owner of shared layout responsibilities.

Canonical owner:

```text
assets/js/dd-scanner-os-runtime.js
```

Primary responsibilities:

- Fixed mobile game viewport.
- Scanner shell layout.
- Battle card sizing.
- Battle grid centerline geometry.
- Mobile spacing.
- Navigation sizing.
- Action control sizing.

The previous layout wrapper files are no longer loaded by `dd-scan-bg.js`.

## Active Load Chain

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

## Retired From Active Layout Load

These files still exist for reference, but should not be active layout owners:

```text
assets/js/dd-mobile-game-tray-4-2.js
assets/js/dd-unified-scanner-shell-4-3.js
assets/js/dd-unified-scanner-shell-4-3-once.js
assets/js/dd-battle-centerline-fix-4-3.js
```

## Runtime Ownership Map

| Area | Current Owner | Notes |
| --- | --- | --- |
| Page boot | `databyte-discovery.html` | Active page loader. |
| Product orchestration | `databyte-discovery-product-app-v3-5.js` | Still owns UI rendering and view transitions. |
| Scanner OS layout | `dd-scanner-os-runtime.js` | Canonical layout owner. |
| Battle layout | `dd-scanner-os-runtime.js` | Owns `.battle-card`, `.battleGrid`, `.fighter`, `.controls`, and `.nav` layout rules. |
| Background scan visuals | `dd-scan-bg.js` | Visual and bootstrap owner. |
| Encounter generation | `dd-encounter-runtime.js` | Active runtime owner. |
| Capture/download rules | `dd-capture-runtime.js` | Active runtime owner. |
| Battle resolution | `dd-battle-resolver.js` | Active runtime owner. |
| Party switching | `dd-party-switch-runtime.js` | Active runtime owner. |
| Dex state | `dd-dex-runtime.js` | Active foundation. |
| Inventory state | `dd-inventory-runtime.js` | Active foundation. |

## Current Technical Debt

- Product App v3.5 still contains layout and render assumptions that may compete with the Scanner OS runtime.
- Battle screen centering should be audited in Product App markup and base CSS before any new layout patch is added.
- Long sprite names need an auto-fit strategy.
- Party, inventory, reward, progression, and mission behavior still need deeper runtime ownership.
- Knowledge Engine and mechanics graph records should be synced to the new Scanner OS ownership model.

## Next Architectural Commits

1. Audit Product App v3.5 battle markup and CSS ownership.
2. Move remaining battle layout assumptions into `dd-scanner-os-runtime.js` or remove them from Product App.
3. Add diagnostics checks for duplicate active layout owners.
4. Archive old layout wrapper files once mobile validation confirms the canonical runtime is stable.

## Development Rule

Do not add another CSS wrapper for the battle screen.

If the battle screen is misaligned, find the competing owner and consolidate it.
