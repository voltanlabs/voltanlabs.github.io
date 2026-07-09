# Data Discovery v4 App Shell Migration Plan

Status: active plan  
Phase: 4.4 App Shell Migration  
Supersedes: v3.5 Product App transition shell as the long-term target

## Purpose

Data Discovery is moving from a patched Product App monolith into a modular app shell architecture.

The new shell file will be:

`assets/js/databyte-discovery-product-app-v4-shell.js`

The current v3.5 file remains a legacy reference until parity is confirmed.

## Target Rule

The Product App should be a container, router, and module caller.

It should not own:

- Battle screen HTML
- Battle controls HTML
- Battle CSS
- Scanner screen layout long-term
- Party screen layout long-term
- Inventory screen layout long-term
- Dex screen layout long-term
- Admin screen layout long-term
- Gameplay math
- Capture odds
- Battle terminal state
- Presentation effects

## Six-Step Settlement Plan

### Step 1: Document v4 shell architecture

Create this plan and define the ownership boundary before changing the live loader.

### Step 2: Create v4 shell

Create `databyte-discovery-product-app-v4-shell.js` with only:

- boot/app container
- app state
- screen routing
- runtime calls
- action binding
- screen module calls
- fallback only where a module does not exist yet

### Step 3: Add screen registry pattern

The shell should route screens through a registry-style map:

```js
const screens = {
  scanner,
  encounter,
  battle,
  confirm,
  result,
  party,
  items,
  dex,
  admin
};
```

Battle must call:

- `DD_BATTLE_SCREEN.renderBattleScreen(context)`
- `DD_BATTLE_CONTROLS.renderBattleControls(context)`

### Step 4: Switch the loader

Update `databyte-discovery.html` to load:

`/assets/js/databyte-discovery-product-app-v4-shell.js`

instead of:

`/assets/js/databyte-discovery-product-app-v3-5.js`

Keep v3.5 in the repo as a legacy reference.

### Step 5: Update Studio ownership metadata

Update source indexes and ownership docs so:

- v4 shell is active owner of app shell/routing
- v3.5 is legacy reference
- Battle Screen owns battle layout
- Battle Controls owns battle controls
- Runtime modules own gameplay behavior

### Step 6: Run duplicate-owner cleanup audit

Search for and flag duplicate ownership:

- battle layout CSS outside `dd-battle-screen.js`
- battle controls CSS outside `dd-battle-controls.js`
- Product App battle HTML fallback after v4 is stable
- compatibility layers that mutate layout/state

## v4 Shell Responsibilities

The v4 shell owns:

- app root creation
- state object
- screen route selection
- action binding
- runtime orchestration
- context building for screen modules
- non-battle fallback screens until extracted

The v4 shell does not own:

- battle layout
- battle controls layout
- battle math
- capture math
- battle presentation effects
- scanner background visuals

## Initial Active Screen Modules

| Screen Area | Owner |
| --- | --- |
| Battle screen | `dd-battle-screen.js` |
| Battle controls | `dd-battle-controls.js` |
| Dex public page | `databytedex-shared-renderer.js` |
| Party data | `dd-party-runtime.js` |
| Inventory data | `dd-inventory-runtime.js` |
| Capture/download | `dd-capture-runtime.js` |
| Encounter generation | `dd-encounter-runtime.js` |
| Battle math | `dd-battle-resolver.js` |
| Battle terminal state | `dd-battle-state-runtime.js` |

## Definition of Done

This migration is complete when:

- `databyte-discovery.html` loads v4 shell
- v4 shell uses Battle Screen and Battle Controls modules
- battle controls are no longer embedded in the shell
- battle layout is no longer embedded in the shell
- v3.5 is marked as legacy reference
- Studio ownership diagnostics recognize the new active shell
