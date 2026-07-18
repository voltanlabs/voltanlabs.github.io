# Data Discovery Runtime Compatibility Archive

Status: archived recovery evidence  
Archived during: Phase 4.9 screen, presentation, and bootstrap consolidation

These files are not loaded by `databyte-discovery.html` or imported by
`assets/js/dd-app-bootstrap.js`. They remain available to explain historical
behavior and recovery decisions; they must not be restored as active owners.

Superseding owners:

- `dd-player-runtime.js` replaces the separate collection, party,
  party-switch, inventory, Dex, and collection/Dex bridge implementations.
- `dd-app-presentation-runtime.js` replaces the viewport guard, Scanner OS
  layout stabilizer, scanner behavior guard, party-switch UI/refresh bridge,
  and visual background adapters.
- `dd-screen-registry.js` and the dedicated screen files own screen and control
  rendering.
- `dd-battle-presentation-runtime.js` owns battle effects.

The archived background, battle-experience, Scanner OS, and health/signal
adapters are also renderer-contention or ownership-violation evidence from the
battle-freeze recovery. Any useful behavior must be reimplemented in the
current canonical owner and covered by regression tests; do not load these files
directly.
