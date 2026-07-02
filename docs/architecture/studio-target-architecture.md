# VoltanLabs Studio Target Architecture

Purpose: define the destination structure for the repo before major file moves. This document is the map for turning VoltanLabs from a collection of pages into a studio platform.

## Core rule

Every file should have a clear ownership area:

- Studio Core
- Product
- Creator Suite
- Technology Vault
- Knowledge Engine
- Simulation Lab
- Shared System
- Asset Library
- Documentation
- Legacy / Archive

If a file does not clearly belong anywhere, it needs classification before refactor.

## Target folder layout

```text
voltanlabs.github.io/
├── index.html
├── studio/
│   ├── index.html
│   ├── data/
│   └── js/
├── products/
│   └── databytesprites/
│       ├── index.html
│       ├── discovery/
│       ├── arena/
│       ├── dex/
│       ├── data/
│       └── js/
├── creator-suite/
│   ├── index.html
│   ├── draw/
│   ├── character-forge/
│   ├── gif-forge/
│   ├── sprite-sheet-forge/
│   └── promptcraft/
├── technology-vault/
│   ├── index.html
│   ├── data/
│   └── js/
├── knowledge-engine/
│   ├── README.md
│   ├── data/
│   └── js/
├── simulation-lab/
│   ├── README.md
│   ├── data/
│   └── js/
├── shared/
│   ├── js/
│   ├── css/
│   └── components/
├── assets/
│   ├── images/
│   ├── sprites/
│   ├── audio/
│   ├── fonts/
│   └── video/
└── docs/
    ├── audits/
    ├── architecture/
    ├── databytesprites/
    ├── decisions/
    └── manifests/
```

## Migration principles

1. Keep the public site working after every commit.
2. Prefer redirects over broken links.
3. Do not move DataByteSprites scripts until active vs legacy status is documented.
4. Convert patch-layer systems into modules gradually.
5. Keep shared navigation/header/footer centralized.
6. Store resource databases as JSON first; automate later.
7. Document every major architectural decision in `/docs/decisions/`.

## DataByteSprites target modules

DataByteSprites should eventually be organized by feature domain:

```text
products/databytesprites/
├── discovery/
│   ├── scanner.html
│   └── scanner.js
├── arena/
│   ├── battle.html
│   └── battle.js
├── dex/
│   ├── index.html
│   └── dex.js
├── data/
│   ├── sprites.json
│   ├── encounters.json
│   ├── moves.json
│   └── items.json
└── js/
    ├── state.js
    ├── party.js
    ├── inventory.js
    ├── capture.js
    └── save.js
```

## Creator Suite target modules

The Creator Suite should become one hub with sub-tools:

```text
creator-suite/
├── index.html
├── draw/
├── character-forge/
├── gif-forge/
├── sprite-sheet-forge/
└── promptcraft/
```

Shared canvas, export, UI, storage, and preview code should eventually move into `/shared/js/`.

## Studio Core target modules

Studio Core is the daily control panel:

```text
studio/
├── index.html
├── data/projects.json
└── js/studio-dashboard.js
```

It should link to:

- DataByteSprites
- Creator Suite
- Technology Vault
- Knowledge Engine
- Simulation Lab
- Asset Library
- Documentation

## Refactor safety checklist

Before moving any page or script:

- Is the current public URL known?
- Is there a replacement URL?
- Does the header/footer point to the new location?
- Are relative asset paths still valid?
- Is there a redirect or compatibility shell?
- Was the change tested in browser after deployment?

## Immediate next step

Create a DataByteSprites manifest that classifies every known DataByte script as:

- active
- probable active
- legacy
- duplicate
- patch/fix layer
- unknown

No DataByte file moves before that manifest exists.
