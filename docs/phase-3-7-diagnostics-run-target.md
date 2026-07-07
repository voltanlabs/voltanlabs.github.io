# Phase 3.7 Diagnostics Run Target

Status: active validation target  
Phase: 3.7 Diagnostics Alignment

## Purpose

This note records the next manual diagnostics run target after the Phase 3.7 ownership validator was wired into `/studio/diagnostics/`.

## Expected Diagnostic Coverage

The next report should include the standard Studio diagnostics plus the Phase 3.7 Runtime Ownership Validation panel.

Expected ownership targets:

- Product App: `databyte-discovery-product-app-v3-5`
- Battle: `dd-battle-resolver`
- Capture: `dd-capture-runtime`
- Encounter: `dd-encounter-runtime`
- Rules: `dd-gameplay-rules-2-4`
- Battle events/helpers: `dd-battle-engine-2-4`
- Balance: `dd-battle-balance-2-4`
- Roster: `dd-canon-roster`
- Studio data: `dd-studio-data-bridge`

Expected UI targets:

- HP rings for lead and wild sprites
- Separate Signal meter
- No main-battle horizontal HP bars
- Visual-only compatibility layers remain non-owning

## Run Instructions

1. Open `/studio/diagnostics/`.
2. Let the diagnostics panels finish loading.
3. Copy or save the generated report.
4. Verify whether `STUDIO_PHASE37_OWNERSHIP_REPORT` reports zero errors.
5. Use the findings to decide the next cleanup pass.

## Next Build Target

After this diagnostics run target is registered, Phase 3.8 begins by splitting Product App-owned party and inventory logic into dedicated runtime modules:

- `dd-party-runtime.js`
- `dd-inventory-runtime.js`
