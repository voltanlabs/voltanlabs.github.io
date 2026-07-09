# Data Discovery Battle Ownership Extraction Plan

Status: active plan  
Phase: 4.3 Ownership Correction  
Related map: `docs/databyte-gameplay-ownership-audit.md`

## Purpose

This plan defines how to extract the battle UI out of `databyte-discovery-product-app-v3-5.js` without breaking the current playable Data Discovery build.

The goal is not to rewrite battle logic. The goal is to make ownership clear so future battle layout changes happen in one battle screen module instead of being patched across Product App, Scanner OS Runtime, Presentation Runtime, and compatibility layers.

## Current Problem

`databyte-discovery-product-app-v3-5.js` still owns too many battle responsibilities:

- battle screen HTML
- battle controls
- battle log markup
- HP ring markup
- Signal meter markup
- Download window markup
- local battle flow application
- Product App CSS for battle layout
- Product App CSS for battle effects

That was acceptable for a prototype, but it now creates ownership conflicts because other modules also touch the battle area.

## Target Owner Split

| Responsibility | Target Owner | Notes |
| --- | --- | --- |
| Battle math | `dd-battle-resolver.js` | Already active owner. Do not move. |
| Battle terminal state | `dd-battle-state-runtime.js` | Already active owner. Do not move. |
| Download odds/result math | `dd-capture-runtime.js` | Already active owner. Do not move. |
| Encounter Signal stability | `dd-encounter-runtime.js` + live encounter state | Keep Signal separate from HP. |
| Battle effects | `dd-battle-presentation-runtime.js` | Non-layout effects only. |
| Battle screen layout | `dd-battle-screen.js` | New extraction target. |
| Battle controls | `dd-battle-controls.js` | New extraction target after screen renderer exists. |
| Battle shell routing | `databyte-discovery-product-app-v3-5.js` now, future `dd-app-shell.js` | Product App remains coordinator during transition. |
| Scanner viewport stabilization | `dd-scanner-os-runtime.js` | Must not remain long-term battle layout owner. |

## New Module 1: `dd-battle-screen.js`

### Owns

`dd-battle-screen.js` should own battle HTML and layout helpers:

- `renderBattleScreen(context)`
- `renderFighter(sprite, side)`
- `renderHpRing(sprite)`
- `renderSignalMeter(signal)`
- `renderDownloadGauge(signal)`
- `renderBattleToast(message)`
- battle-specific CSS for `.battle-card`, `.battleGrid`, `.fighter`, `.ring`, `.signalBox`, `.downloadGauge`, and `.battleLog` / toast container

### Does not own

It must not own:

- turn order
- damage math
- hit checks
- capture/download odds
- inventory spending
- party storage
- terminal battle state
- global Scanner OS viewport locking
- non-layout attack effects

### Required Input Contract

`renderBattleScreen(context)` should receive a plain context object from the Product App / shell:

```js
{
  lead,
  wild,
  odds,
  signal,
  maxSignal,
  isWildDefeated,
  latestMessage,
  battleState
}
```

The renderer should return HTML only. It should not mutate global state.

## New Module 2: `dd-battle-controls.js`

### Owns

`dd-battle-controls.js` should own battle control HTML and action metadata:

- `renderBattleControls(context)`
- move buttons
- Download button
- Items placeholder button
- Switch button
- Return button
- defeated-state controls
- confirm-state controls if result extraction is delayed

### Does not own

It must not own:

- applying damage
- calculating odds
- spending items directly
- switching party directly
- manipulating DOM outside the controls region

### Required Output Contract

`renderBattleControls(context)` should return HTML plus stable data attributes:

```html
<button class="move" data-action="move" data-move-id="signal-strike">Signal Strike</button>
<button data-action="download">Download</button>
<button data-action="items">Items</button>
<button data-action="switch">Switch</button>
<button data-action="return">Return</button>
```

The app shell binds actions centrally. Controls do not bind themselves unless a later UI runtime is introduced.

## Product App Transition Rule

During extraction, `databyte-discovery-product-app-v3-5.js` remains the live coordinator.

It may continue to own:

- current `state` object
- routing between scanner / encounter / battle / confirm / result / party / items / dex / admin
- applying resolver output to live state
- calling runtime APIs
- binding actions returned by controls

It should stop owning:

- battle layout HTML
- battle controls HTML
- Product App battle CSS
- battle-card animations
- long-term battle toast/log behavior

## Safe Extraction Order

### Step 1: Create passive `dd-battle-screen.js`

Add the module and expose:

```js
window.DD_BATTLE_SCREEN = {
  version,
  renderBattleScreen,
  renderFighter,
  renderHpRing,
  renderSignalMeter,
  renderDownloadGauge
};
```

Do not load it live yet unless it is fully passive and only defines functions.

### Step 2: Product App calls battle screen renderer

Replace only the Product App battle screen branch with:

```js
if (window.DD_BATTLE_SCREEN) {
  return window.DD_BATTLE_SCREEN.renderBattleScreen(context);
}
```

Keep fallback Product App battle HTML for one commit so the game remains playable if the module fails to load.

### Step 3: Move battle CSS owner

Move battle-specific CSS from Product App and Scanner OS Runtime into `dd-battle-screen.js`.

Scanner OS Runtime may keep viewport rules only.

### Step 4: Create passive `dd-battle-controls.js`

Expose:

```js
window.DD_BATTLE_CONTROLS = {
  version,
  renderBattleControls
};
```

No gameplay changes yet.

### Step 5: Product App calls controls renderer

Replace only the battle controls branch with:

```js
if (window.DD_BATTLE_CONTROLS) {
  return window.DD_BATTLE_CONTROLS.renderBattleControls(context);
}
```

Keep fallback controls for one commit.

### Step 6: Remove obsolete patches

After screen and controls renderers are live and tested:

- remove battle layout patches from `dd-scanner-os-runtime.js`
- remove Product App `.fx-hit .battle-card` layout animation
- remove Boost / Repair fallback UI from Product App
- keep battle effects in `dd-battle-presentation-runtime.js`

## Studio Validation Targets

The Studio should eventually flag these conflicts:

- Product App and `dd-battle-screen.js` both defining battle layout permanently
- Scanner OS Runtime defining battle layout after `dd-battle-screen.js` is active
- Presentation Runtime animating `.battle-card`, `.stage`, `.card`, `.battleGrid`, or `#ddApp`
- Compatibility layers injecting battle HUD elements
- Multiple files generating battle control buttons
- Any legacy Product App version loaded by `databyte-discovery.html`

## No-Shortcut Rule

If an extraction commit conflicts or fails:

1. Re-fetch the current file.
2. Merge the intended ownership change into the latest version.
3. Retry the update.
4. If needed, use the rename/copy method to preserve the source and replace the original safely.

Do not solve blocked extraction by adding another patch layer.

## Definition of Done

Battle ownership extraction is complete when:

- battle screen HTML is owned by `dd-battle-screen.js`
- battle controls HTML is owned by `dd-battle-controls.js`
- Product App is only coordinating battle flow and applying runtime results
- Scanner OS Runtime no longer patches battle internals
- Presentation Runtime owns effects without moving layout containers
- Studio source index and ownership audit agree with the live runtime chain
