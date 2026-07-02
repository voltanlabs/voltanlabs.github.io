# VoltanLabs Studio Audit — Phase 1

Status: **Active audit pass**  
Goal: move VoltanLabs from a page-by-page project into a studio architecture that supports DataByteSprites, the Creator Suite, the Technology Vault, a Knowledge Engine, an Asset Library, and Simulation Lab.

## Evidence gathered

### Public repository root
Observed root entries include:

- `Images/`
- `images/`
- `CNAME`
- `README.md`
- `Styles.css`
- `about.html`
- `about.md`
- `contact.html`
- `features.html`
- `index.html`
- `promptcraft.html`
- `voltanquest.html`
- `voltstock.html`

### Shared shell
Confirmed shared include system:

- `partials/header.html`
- `partials/footer.html`
- `assets/includes.js`

### Technology Vault
Confirmed new app-style vault structure:

- `technology-vault/index.html`
- `technology-vault/data/technologies.json`
- `technology-vault/js/vault.js`
- `technology-vault/README.md`
- legacy redirect: `technology-vault.html`

### DataByteSprites / Data Discovery files located
Docs:

- `docs/databyte-maps.md`
- `docs/databyte-discovery-scanner-map.md`
- `docs/databyte-legacy-app-rebuild-map.md`
- `docs/databyte-battle-rebuild-map.md`

Key scripts found in `assets/js/`:

- `databyte-discovery.js`
- `databyte-battle.js`
- `databyte-battle-copy.js`
- `databyte-party.js`
- `databyte-party-copy.js`
- `databyte-inventory.js`
- `databyte-missions.js`
- `databyte-discovery-journal.js`
- `databyte-discovery-progression.js`
- `databyte-rare-spawn.js`
- `databyte-scanner-workspace.js`
- `databyte-scanner-effects.js`
- `databyte-signal-stage.js`
- `databyte-signal-collapse.js`
- `databyte-app-shell.js`
- `databyte-app-shell-v2.js`
- `databyte-fullscreen-shell.js`
- `databyte-admin-console.js`
- `databyte-admin-console-simple.js`
- `databyte-admin-tabs.js`
- `databyte-admin-tabs-stable.js`
- `databyte-panel-state.js`
- `databyte-status-center.js`
- `databyte-status-cleanup-v2.js`
- `databyte-version-sync.js`
- `databyte-container-refine.js`
- `databyte-copy-loader.js`
- `databyte-click-fix.js`
- `databyte-idle-restore.js`
- `databyte-auto-start.js`
- `databytedex-action-router.js`
- `databytedex-panel-cleanup.js`
- `dd-root.js`
- `dd-nav-cleanup.js`
- `dd-dex-progress.js`
- `dd-battle-legacy-features.js`
- `dd-battle-legacy-stats.js`

Odysseus docs found:

- `odysseus/docs/VOLTANLABS_BOOTSTRAP.md`

## Initial findings

### 1. DataByteSprites has grown by patch layering
The project has many targeted patch files, copy files, cleanup files, stable variants, and v2 variants. This is normal during rapid prototyping, but it is now slowing architecture clarity.

Risk examples:

- `databyte-battle.js` and `databyte-battle-copy.js`
- `databyte-party.js` and `databyte-party-copy.js`
- `databyte-app-shell.js` and `databyte-app-shell-v2.js`
- `databyte-admin-tabs.js` and `databyte-admin-tabs-stable.js`
- multiple cleanup/fix/lock/guard scripts that may overlap

### 2. Shared shell exists and should become the standard
The site already uses shared header/footer injection. This should be expanded into a full shared layer for navigation, cards, badges, status panels, and app shell patterns.

### 3. Technology Vault is already closest to the target architecture
The vault now has a data file, renderer, and app page. This should become the pattern for future internal systems:

- data-driven
- searchable
- modular JS
- clear README
- old page redirects

### 4. Current repository is still page-first, not studio-first
The repository is still mostly organized around standalone pages and scattered scripts. Target direction should be project-first:

- `/studio/`
- `/products/databytesprites/`
- `/creator-suite/`
- `/technology-vault/`
- `/knowledge-engine/`
- `/simulation-lab/`
- `/shared/`
- `/docs/`
- `/assets/`

## Classification tags

Going forward, every file should be tagged as one of:

- `studio-core`
- `databytesprites-active`
- `databytesprites-legacy`
- `creator-suite`
- `technology-vault`
- `knowledge-engine`
- `simulation-lab`
- `shared-ui`
- `shared-assets`
- `docs`
- `experimental`
- `retire-candidate`

## Recommended target architecture

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
│   └── sprite-sheet-forge/
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
    └── decisions/
```

## Immediate commit sequence

### Commit 1 — Audit baseline
Create this audit report and preserve current findings.

### Commit 2 — Studio architecture docs
Add `/docs/architecture/studio-target-architecture.md` with the target folder map and rules.

### Commit 3 — Decision log
Add `/docs/decisions/0001-studio-architecture.md` so future changes are documented.

### Commit 4 — DataByteSprites manifest
Create a manifest listing active/legacy DataByteSprites files before moving anything.

### Commit 5 — Shared conventions
Document file naming, script loading, and patch retirement rules.

## Do not move yet

No large file moves should happen until the DataByteSprites manifest is complete. The project has many patch-layer files, so moving blindly risks breaking the scanner/battle/capture chain.

## Current priority

1. Document the current state.
2. Identify active vs legacy DataByteSprites scripts.
3. Establish Studio docs and decision logs.
4. Add manifests.
5. Refactor only after the manifests are complete.
