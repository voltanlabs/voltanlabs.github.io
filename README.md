# VoltanLabs Studio

VoltanLabs Studio is an offline-first, repository-first software development platform for building games, AI tools, creative software, documentation systems, simulations, and future commercial products.

The project uses modular runtimes, explicit ownership contracts, searchable knowledge indexes, diagnostics, Studio Intelligence, reusable assets, and repository automation. The current flagship product is **DataByteSprites: Data Discovery**.

## Current Focus

**Data Discovery Phase 6.3.0: Portal Battle Presentation + Mobile Recovery**

The live game is now the standalone Three.js build at [`/three-battle/`](./three-battle/). It owns the battle loop, player persistence, XP, stat growth, evolution, capture, regions, Dex, rewards, items, and responsive presentation. The former Data Discovery shell remains recoverable in Git history and its old URL redirects to this build.

## Recovery Milestone

The current recovery pass established:

- A canonical species-index reconstruction tool at `studio/tools/reconstruct-species-index.mjs`.
- A GitHub Actions workflow that regenerates, validates, commits, and pushes `studio/databytesprites/species.json`.
- The active Three.js roster currently contains 83 unique species records; older Studio recovery notes may still refer to the prior 71-species index.
- A canonical DataByteSprites Configuration Chart containing 20 configurations.
- A strict separation between Alignment (`Pristine`, `Stained`, `Null`) and Configuration.
- An authored first-pass configuration matchup model for battle and Download systems.

Recovery utilities must become repeatable generators or validators rather than remaining one-off repair scripts.

## Active Product Architecture

Data Discovery uses the consolidated v4 modular App Shell:

```text
Studio Data
  ↓
Studio Data Bridge
  ↓
Deterministic Battle, Player, Reward, and Gameplay Runtimes
  ↓
Dedicated Screen and Control Owners
  ↓
DD_PRODUCT_APP_V4_SHELL
  ↓
Generated Runtime Bundle and Presentation Owners
  ↓
Player UI
```

The App Shell coordinates lifecycle, routing, context, and action dispatch. It must not absorb screen markup, battle math, Download math, persistence rules, or screen-specific visual ownership.

## DataByteSprites Canon

### Alignments

Alignment is a separate sprite-state axis:

- `Pristine`
- `Stained`
- `Null`

### Configurations

The canonical configuration vocabulary is:

- Mystic
- Voltricity
- Acoustic
- Torrent
- Thermal
- Organic
- Malware
