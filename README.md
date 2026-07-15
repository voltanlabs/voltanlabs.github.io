# VoltanLabs Studio

VoltanLabs Studio is an offline-first, repository-first software development platform for building games, AI tools, creative software, documentation systems, simulations, and future commercial products.

The project uses modular runtimes, explicit ownership contracts, searchable knowledge indexes, diagnostics, Studio Intelligence, reusable assets, and repository automation. The current flagship product is **DataByteSprites: Data Discovery**.

## Current Focus

**Data Discovery Phase 4.4.3: Modular Vertical Slice + Repository Recovery and Governance**

The immediate priority is to preserve the stable v4 App Shell architecture while recovering damaged canonical data and runtime files, synchronizing documentation, and strengthening automated repository validation.

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

Data Discovery uses the v4 modular App Shell:

```text
Studio Data
  ↓
Studio Data Bridge
  ↓
Gameplay and State Runtimes
  ↓
Dedicated Screen and Control Owners
  ↓
DD_PRODUCT_APP_V4_SHELL
  ↓
Compatibility Adapters and Visual Helpers
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
