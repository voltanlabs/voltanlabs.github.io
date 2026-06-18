# DataByteSprites Battle Rebuild Map

Project tag: `DBD-BATTLE-REBUILD`

Purpose: keep the Scanner OS battle rebuild aligned with the original Data Discovery rules and stop temporary overlay patches from becoming permanent architecture.

## Source of truth

| File | Status | Use |
|---|---|---|
| `assets/js/databyte-battle.js` | LEGACY SOURCE | Battle rules reference. Do not load directly into Scanner OS. |
| `assets/js/databyte-discovery.js` | LEGACY SOURCE | Capture, Signal, Stability, Seen/Captured/Escaped rules. |
| `docs/databyte-discovery-scanner-map.md` | ACTIVE MAP | Main Scanner OS architecture map. |
| `docs/databyte-legacy-app-rebuild-map.md` | ACTIVE MAP | Overall legacy-to-Scanner OS migration tracker. |

## Legacy battle rule summary

- Signal means capture probability.
- Battle starts with Signal equal to the current encounter capture chance.
- Attack reduces target HP.
- Enemy HP reaching zero means the target is weakened/subdued, not automatically captured.
- Weakened/subdued battle grants a Signal boost.
- Scan Pulse grants a Signal boost and then lets the enemy act.
- Throw DataByteCoin uses the current Signal as capture probability.
- Failed ByteCoin throws reduce Stability and may trigger Signal Lost.
- Stability is shown as pips/stars.
- Fighter HP may be displayed, but must never be labeled as Signal.

## Current active battle stack

| File | Status | Problem / role |
|---|---|---|
| `assets/js/dd-battle-os.js` | ACTIVE CORE | Main battle UI and action engine, but still partially HP/RPG-style. |
| `assets/js/dd-battle-legacy-stats.js` | TEMP ACTIVE | Displays Signal, Battle Bonus, Target HP. Should be merged into battle core. |
| `assets/js/dd-battle-legacy-features.js` | TEMP ACTIVE | Adds Stability pips, Scan Pulse, Return, and Subdued guard. Should be merged into battle core. |
| `assets/js/dd-scan-bg.js` | ACTIVE LOADER | Loads the battle core and temporary battle layers. |

## Current known issues

| Issue | Status | Notes |
|---|---|---|
| Signal telemetry confusion | PARTIAL FIX | Signal label corrected, but core battle still owns HP-derived flow. |
| Enemy defeat capture flow | BROKEN | User still sees same problem after Subdued overlay patch. Need core rewrite, not overlay. |
| Multiple battle files fighting each other | BROKEN | Temporary overlays are patching `dd-battle-os.js` instead of replacing the wrong flow. |
| Capture probability mismatch | WATCH | Battle display and final capture roll can differ by a few points due to duplicated calculations. |
| FAB/hamburger during battle | WATCH | Previously patched by removal/hiding, but must be owned by battle core. |
| Legacy Scan Pulse amount | PARTIAL | Legacy was +12 Signal. Current overlay used smaller tuning. Must be standardized. |
| Signal Lost from battle | MISSING | Failed ByteCoin/breakout should drop Stability and possibly mark Escaped. |
| Party swap after player forced offline | MISSING | Legacy noted party swap needed. Scanner OS does not implement it yet. |
| Battle log history | MISSING | Current screen mostly uses a single line. Legacy kept recent log entries. |
| XP / rewards | MISSING | Future Scanner OS progression system. |

## Rebuild target architecture

Target battle stack:

| File | Target role |
|---|---|
| `assets/js/dd-battle-os.js` | Owns all battle UI, state, actions, Signal math bridge, Subdued/Lost/Capture flow. |
| `assets/js/dd-battle-legacy-stats.js` | DELETE after merge. |
| `assets/js/dd-battle-legacy-features.js` | DELETE after merge. |
| `assets/js/dd-scan-bg.js` | Loads only `dd-battle-os.js` for battle. |

## Phase checklist

### Phase 1 — Audit

- [x] Read legacy `databyte-battle.js`.
- [x] Read legacy `databyte-discovery.js` capture rules.
- [x] Document that Signal equals capture probability.
- [x] Document current temporary overlay drift.

### Phase 2 — Stabilize current visible battle

- [x] Rename/remove HP-derived Signal Integrity telemetry.
- [~] Add Subdued state guard through overlay.
- [ ] Confirm Subdued state works in user testing.
- [ ] If still broken, stop overlay patching and rewrite `dd-battle-os.js` directly.

### Phase 3 — Core battle rewrite

- [ ] Replace `dd-battle-os.js` battle flow with legacy-correct state machine.
- [ ] State machine: `active -> subdued -> capture-result` or `active -> lost -> return`.
- [ ] Signal math uses `window.ddChanceOf()` and `window.ddBoostCapture()` only.
- [ ] Scan Pulse boost standardized.
- [ ] Enemy defeated boost standardized.
- [ ] Throw DataByteCoin calls scanner capture once, intentionally.
- [ ] Failed capture returns to signal/battle state according to Stability.
- [ ] Battle UI owns its own log history.

### Phase 4 — Cleanup

- [ ] Remove `dd-battle-legacy-stats.js` from loader.
- [ ] Remove `dd-battle-legacy-features.js` from loader.
- [ ] Delete temporary overlay files or mark as reference-only.
- [ ] Update `docs/databyte-discovery-scanner-map.md`.
- [ ] Update `docs/databyte-legacy-app-rebuild-map.md`.

## Working rule

No future battle patch is complete until:

1. This map is updated.
2. Code is changed.
3. Loader wiring is changed if needed.
4. This map is updated again with new status.
5. User receives the exact commit SHA and what to test.
