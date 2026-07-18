# VoltanLabs Studio

VoltanLabs Studio is an offline-first, repository-first software development platform for building games, AI tools, creative software, documentation systems, simulations, and future commercial products.

The project uses modular runtimes, explicit ownership contracts, searchable knowledge indexes, diagnostics, Studio Intelligence, reusable assets, and repository automation. The current flagship product is **DataByteSprites: Data Discovery**.

## Current Focus

**Data Discovery Phase 6.0.4: Progression Loop + Runtime Recovery**

The current release consolidates the live game into one generated 19-module browser bundle. A deterministic battle core owns each complete turn, the player runtime owns all persistent player domains, and the reward runtime owns XP, levels, stat growth, ByteCoins, Version Upgrade tiers, and battle history. The next priority is authored upgrade content and ceremony presentation without reopening those ownership boundaries.

## Recovery Milestone

The current recovery pass established:

- A canonical species-index reconstruction tool at `studio/tools/reconstruct-species-index.mjs`.
- A GitHub Actions workflow that regenerates, validates, commits, and pushes `studio/databytesprites/species.json`.
- A reconstructed 71-species Studio index generated from the active canon roster.
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
