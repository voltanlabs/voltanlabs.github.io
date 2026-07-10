# Data Discovery Core Stabilization v1.0 — Architecture Freeze

Status: active  
Phase: Core Stabilization v1.0  
Applies to: DataByteSprites: Data Discovery  
Effective shell: `assets/js/databyte-discovery-product-app-v4-shell.js`

## Purpose

This document freezes the first stable ownership architecture for Data Discovery.

The goal is to stop adding cross-owned UI, duplicate renderers, interval-based layout patches, and embedded gameplay logic inside presentation files.

Future work should extend the existing owner or introduce a clearly defined new owner. It should not create another competing implementation for an already owned responsibility.

## Architecture Layers

```text
Data Discovery
├── App Shell
├── Screen Modules
├── Control Modules
├── Runtime Modules
├── Shared Data and Services
├── Compatibility Adapters
└── Studio Diagnostics
```

### App Shell

The App Shell owns application-level coordination only.

Canonical owner:

`assets/js/databyte-discovery-product-app-v4-shell.js`

The App Shell owns:

- application boot
- root app container
- global route state
- screen registry
- controls registry
- context construction
- runtime coordination
- action dispatch
- top application header
- primary navigation mounting

The App Shell must not own:

- battle screen HTML
- battle controls HTML
- battle layout CSS
- battle math
- capture math
- party switching rules
- sprite definitions
- encounter generation rules
- screen-specific animation systems

## Screen Owners

Each screen area may have only one active presentation owner.

| Screen | Canonical owner | Status |
| --- | --- | --- |
| Scanner | `DD_SCANNER_SCREEN` | extraction pending; v4 fallback temporary |
| Encounter | `DD_ENCOUNTER_SCREEN` | extraction pending; v4 fallback temporary |
| Battle | `DD_BATTLE_SCREEN` / `dd-battle-screen.js` | active |
| Confirm Download | `DD_CONFIRM_SCREEN` | extraction pending; v4 fallback temporary |
| Result | `DD_RESULT_SCREEN` | extraction pending; v4 fallback temporary |
| Party | `DD_PARTY_SCREEN` | extraction pending; v4 fallback temporary |
| Items | `DD_ITEMS_SCREEN` | extraction pending; v4 fallback temporary |
| Dex | `DD_DEX_SCREEN` | extraction pending; v4 fallback temporary |
| Admin / Inspector | `DD_ADMIN_SCREEN` | extraction pending; v4 fallback temporary |

A screen module owns:

- its internal markup
- its internal layout
- its screen-specific visual states
- presentation of context supplied by the App Shell

A screen module must not own:

- global routing
- unrelated screen markup
- gameplay math
- persistence rules
- cross-screen DOM mutation

## Control Owners

| Control area | Canonical owner | Status |
| --- | --- | --- |
| Battle controls | `DD_BATTLE_CONTROLS` / `dd-battle-controls.js` | active |
| Scanner controls | future `DD_SCANNER_CONTROLS` or Scanner Screen module | pending |
| Party-switch overlay | `dd-party-switch-ui.js` | compatibility overlay only |

The canonical Battle Controls owner is the only module allowed to create the normal battle action buttons.

Compatibility overlays may react to canonical controls, but they may not inject duplicate buttons into the active controls host.

## Runtime Owners

Runtime modules own behavior and state transitions. They must not render full screens.

| System | Canonical runtime owner |
| --- | --- |
| Encounter generation | `DD_ENCOUNTER_RUNTIME` |
| Capture / Download rules | `DD_CAPTURE_RUNTIME` |
| Battle resolution | `DD_BATTLE_RESOLVER` |
| Battle terminal state | `DD_BATTLE_STATE_RUNTIME` |
| Battle presentation events | `DD_BATTLE_PRESENTATION_RUNTIME` |
| Collection persistence | `DD_COLLECTION_RUNTIME` |
| Party persistence and lead selection | `DD_PARTY_RUNTIME` |
| Party switch state | `DD_PARTY_SWITCH_RUNTIME` |
| Inventory | `DD_INVENTORY_RUNTIME` |
| Dex state | `DD_DEX_RUNTIME` |
| Gameplay rule constants | `DD_GAMEPLAY_RULES` |

Runtime modules may:

- calculate values
- validate actions
- update state
- emit domain events
- expose stable APIs

Runtime modules must not:

- own application headers
- insert screen markup
- inject action buttons
- rewrite another owner's DOM
- depend on visible text to detect application state

## Shared Data and Services

Shared data modules provide canonical data without controlling presentation.

| Data or service | Owner |
| --- | --- |
| Canon roster | `DD_CANON_ROSTER` |
| Studio data bridge | `DD_STUDIO_DATA_BRIDGE` |
| Move index | `DD_MOVE_INDEX` |
| Type chart | `DD_TYPE_CHART` |
| Runtime ownership manifest | `studio/runtime/load-order.json` |

Sprite data, moves, types, encounter pools, and balance values should remain separate from screen and control modules.

## Compatibility Adapters

Compatibility adapters are temporary migration tools.

They may:

- translate an old event into a new event
- bridge an old runtime API to a canonical runtime API
- preserve a feature while its owner is being migrated

They must not:

- become permanent owners
- inject duplicate screen controls
- modify the App Shell header
- continuously mutate layout with polling loops
- detect state only by scanning rendered page text
- override canonical screen or control CSS

Every compatibility adapter must be classified as one of:

- required temporary bridge
- visual compatibility layer
- retirement candidate
- legacy reference

## Frozen Ownership Rules

### Rule 1 — One active owner per responsibility

A UI region, state transition, calculation, or data source must have one canonical owner.

### Rule 2 — The shell coordinates; it does not implement subsystems

The v4 App Shell may call modules and pass context. It must not absorb their markup, CSS, or rules.

### Rule 3 — Screens render; runtimes calculate

Screen modules own presentation. Runtime modules own behavior and state transitions.

### Rule 4 — No cross-screen DOM mutation

A module may modify only the DOM that it owns or a documented host supplied by the shell.

### Rule 5 — No new patch wrappers for owned systems

When a defect appears in an owned system, fix the canonical owner or its input contract. Do not add a new wrapper file to override the result.

### Rule 6 — No interval-based layout correction

Polling may be used only for temporary diagnostics or unavoidable compatibility monitoring. It may not repeatedly rewrite canonical layout.

### Rule 7 — Context contracts must be explicit

The App Shell must provide predictable context objects to screen and control modules. Modules should normalize only documented transition shapes.

### Rule 8 — Legacy files remain inactive

Legacy Product App files and retired layout wrappers may remain for reference, but they must not be loaded by the active application path.

### Rule 9 — Architecture changes require documentation

Any change to ownership, active load order, screen contracts, or runtime contracts must update the relevant Studio manifest or architecture document in the same milestone.

### Rule 10 — New features must identify an owner before implementation

Before adding a feature, define:

- its screen owner
- its control owner, if any
- its runtime owner
- its data source
- its emitted and consumed events

## Active Application Path

```text
databyte-discovery.html
├── shared data and runtime modules
├── dd-battle-screen.js
├── dd-battle-controls.js
├── databyte-discovery-product-app-v4-shell.js
├── compatibility adapters
└── Scanner OS / visual support modules
```

The active shell is v4. The v3.5 Product App and earlier Product App files are legacy references only.

## Current Temporary Ownership

The following presentation responsibilities still use fallback renderers inside the v4 shell and are approved temporary exceptions:

- Scanner Screen
- Encounter Screen
- Confirm Download Screen
- Result Screen
- Party Screen
- Items Screen
- Dex Screen
- Admin Screen

These fallbacks may remain during stabilization, but no new feature-heavy logic should be added to them. Each should eventually move into its own screen module.

## Commit Gate

Before merging a Data Discovery change, verify:

- Is the edited file the canonical owner?
- Does the change create duplicate ownership?
- Is presentation being added to a runtime?
- Is gameplay logic being added to a screen?
- Is a compatibility adapter becoming a permanent subsystem?
- Does the change add a polling or DOM mutation loop?
- Does the ownership manifest need an update?
- Can the feature be replaced by editing one module later?

If the answer reveals an ownership conflict, stop and correct the architecture before continuing.

## Stabilization Exit Criteria

Architecture Freeze v1.0 is considered enforced when:

- the active loader uses only the v4 App Shell
- Battle Screen has one presentation owner
- Battle Controls has one control owner
- duplicate legacy UI injections are removed
- the App Shell header has one owner
- Studio diagnostics can identify active owners
- remaining compatibility adapters are inventoried
- no active layout wrapper competes with a canonical owner

## Next Stabilization Step

Create the permanent ownership map and connect it to Studio diagnostics so active, temporary, legacy, and conflicting owners can be inspected without reading source files manually.
