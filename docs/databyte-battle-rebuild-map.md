# DataByteSprites Battle Rebuild Map

Project tag: `DBD-BATTLE-REBUILD`

Purpose: keep the Scanner OS battle rebuild aligned with the intended Data Discovery rules and stop temporary overlay patches from becoming permanent architecture.

## Current design decision

The battle system is moving away from a strict `attack until subdued -> capture` model.

New target model:

```text
Encounter starts
  ↓
Player chooses each turn:
  Attack / Shield / Change / Item / Throw DataByteCoin / Return
  ↓
If Throw succeeds: Signal Stored
If Throw fails: Stability reduced, enemy may act, player chooses again
If Stability reaches 0: Signal Lost / Collapse
```

Important rule: **Throw DataByteCoin should be available during the normal battle loop.** The player can try to capture early, fail, attack again, use an item, shield, change party, then try another DataByteCoin.

## Source of truth

| File | Status | Use |
|---|---|---|
| `assets/js/databyte-battle.js` | LEGACY SOURCE | Battle rules reference. Do not load directly into Scanner OS. |
| `assets/js/databyte-discovery.js` | LEGACY SOURCE | Capture, Signal, Stability, Seen/Captured/Escaped rules. |
| `assets/js/dd-battle-os-v2.js` | ACTIVE REBUILD | Current single active battle system for testing. Needs turn-loop refactor. |
| `assets/js/dd-battle-phase3c-guard.js` | ACTIVE POLISH | Result card and action cleanup. Must remain visual-only. |
| `assets/js/dd-phase4a-cleanup.js` | ACTIVE POLISH | Reward cleanup module. Must not alter capture roll logic. |
| `docs/databyte-discovery-scanner-map.md` | ACTIVE MAP | Main Scanner OS architecture map. |
| `docs/databyte-legacy-app-rebuild-map.md` | ACTIVE MAP | Overall legacy-to-Scanner OS migration tracker. |

## Legacy battle rule summary

- Signal means capture probability.
- Battle starts with Signal equal to the current encounter capture chance.
- Attack reduces target HP/resistance and raises Signal/capture probability.
- Scan Pulse/Items may raise Signal without damage.
- Throw DataByteCoin uses the current Signal as capture probability.
- Failed ByteCoin throws reduce Stability and may trigger Signal Lost.
- Stability is shown as pips/stars and functions as the encounter escape/collapse timer.
- Fighter HP may be displayed, but must never be labeled as Signal.

## Updated Scanner OS battle terminology

| Term | Meaning |
|---|---|
| Target HP / Resistance | How strong the signal still is. Lower HP should raise capture odds. |
| Signal / Capture Probability | Actual current DataByteCoin success chance. |
| Signal Gain | Temporary increase to capture probability from attacks, items, or actions. |
| Signal Stability | Encounter timer. Failed captures and enemy effects reduce it. |
| Core HP | Player/scanner partner HP. Reaching 0 should require party swap or return. |

## Target player action set

| Action | Availability | Intended behavior |
|---|---|---|
| Attack | Normal battle turns | Damage target resistance and raise capture probability. |
| Shield | Normal battle turns | Reduce incoming damage and/or prevent stability loss that turn. |
| Change | Normal battle turns | Swap active party sprite/scanner core once party exists. |
| Item | Normal battle turns | Use Stabilizer, Jammer, Patch, special coins, etc. |
| Throw DataByteCoin | Normal battle turns | Roll against current capture probability. Available before target reaches 0 HP. |
| Return | Normal battle turns | Leave encounter or return to scanner/signal screen. |
| Continue | Result only | Exit successful capture/collapse result. |

## Correct failed DataByteCoin behavior

When the player throws before defeat/subdue and it fails:

1. Roll fails.
2. Stability drops by 1.
3. Capture probability may drop by 10 or stay tuned depending on balancing.
4. If Stability remains above 0, the player returns to the **normal action loop** with Attack / Shield / Change / Item / Throw / Return available.
5. If Stability reaches 0, the signal collapses and exits to result/return flow.

Failed throws must not create a mixed state where target HP remains but the UI acts subdued-only.

## Current active battle stack

| File | Status | Role |
|---|---|---|
| `assets/js/dd-battle-os-v2.js` | ACTIVE CORE | Single active battle rebuild. Owns battle UI, Signal, Stability, Lost, coin roll, and action loop. |
| `assets/js/dd-battle-phase3c-guard.js` | ACTIVE VISUAL GUARD | Result card polish, button cleanup, subtitles. Must not bind capture buttons or alter capture odds. |
| `assets/js/dd-phase4a-cleanup.js` | ACTIVE REWARD CLEANUP | Reward/duplicate cleanup. Must not alter battle state. |
| `assets/js/dd-battle-os.js` | RETIRED ACTIVE-FILE | Old battle core. No longer loaded by `dd-scan-bg.js`; keep as fallback/reference until V2 is renamed final. |
| `assets/js/dd-battle-legacy-stats.js` | RETIRED TEMP | Not loaded. Earlier telemetry overlay. |
| `assets/js/dd-battle-legacy-features.js` | RETIRED TEMP | Not loaded. Earlier controls overlay. |
| `assets/js/dd-scan-bg.js` | ACTIVE LOADER | Loads Scanner OS modules and `dd-battle-os-v2.js`. |

## Current known issues

| Issue | Status | Notes |
|---|---|---|
| Multiple battle files fighting each other | FIXED FOR TESTING | Loader now runs only `dd-battle-os-v2.js` for battle core. |
| Signal telemetry confusion | MOSTLY FIXED | Signal is capture probability. Some wording cleanup still needed. |
| Strict subdued-only capture model | DESIGN CHANGE REQUIRED | Replace with free turn loop where coin can be thrown before target reaches 0 HP. |
| Failed pre-subdue throw creates mixed state | ACTIVE BUG | Failed throws should return to normal action loop, not subdued-only state. |
| Damage-to-Signal math | ACTIVE TUNING | Damage converts into Signal gain with rarity scaling. Needs more balancing. |
| Capture probability mismatch | WATCH | Result screen must use displayed current Signal. |
| Signal Lost from battle | PARTIAL | Failed coin breakout exists. Needs free-loop parity. |
| Party swap after player forced offline | MISSING | Needed once Change/Party is active. |
| Items | MISSING | Phase 4 battle loop requires item hook. |
| XP / rewards | PARTIAL | Backend/reward cards exist; sync still needs cleanup. |

## Phase checklist

### Phase 1 — Audit

- [x] Read legacy `databyte-battle.js`.
- [x] Read legacy `databyte-discovery.js` capture rules.
- [x] Document that Signal equals capture probability.
- [x] Document current temporary overlay drift.

### Phase 2A — Isolate current visible battle

- [x] Create `dd-battle-os-v2.js` copy-based rebuild workspace.
- [x] Wire loader to V2 only.
- [x] Retire old overlays from active loader.
- [x] Confirm V2 battle launches on mobile.

### Phase 2B — Signal math and defeated-state correction

- [x] Remove counter after defeating hit.
- [x] Convert target damage into Signal gain.
- [x] Add rarity-scaled Signal gains.
- [x] Keep Signal as capture probability.
- [ ] Tune Common/Rare/Epic/Mythic gain numbers from user screenshots.
- [ ] Compare V2 displayed Signal against final capture result roll.

### Phase 3C — Result polish and stability cleanup

- [x] Result card polish.
- [x] Rarity banner on result card.
- [x] XP/streak reward display.
- [x] Failed coin breakout messaging.
- [x] Visual guard made visual-only after capture-roll side effects.
- [ ] Rarity source must come from encounter record, not guessed from logs.
- [ ] Duplicate/NEW display needs final validation after cache reset.

### Phase 4A — Free capture turn loop prep

- [x] Decide that Throw DataByteCoin should be interchangeable with Attack/Shield/Item/Change.
- [x] Update battle map for free capture turn loop.
- [ ] Refactor `dd-battle-os-v2.js` so `throwCoin()` is valid before target reaches 0 HP.
- [ ] On failed early throw, keep `st.sub=false` and return to normal action loop.
- [ ] Reserve `subdued` as a high-odds state only, not a hard capture gate.
- [ ] Add Item placeholder button/state.
- [ ] Add Change placeholder button/state.
- [ ] Update `dd-battle-phase3c-guard.js` so it does not hide Attack/Shield just because a coin failed.
- [ ] Test: attack -> throw fail -> attack -> throw success.
- [ ] Test: throw immediately -> fail -> shield -> throw again.

### Phase 4B — Progression and collection

- [ ] Scanner XP card sync.
- [ ] Rank screen.
- [ ] Collection/party screen.
- [ ] DataByteDex completion and duplicate handling.
- [ ] Capture statistics.

### Phase 5 — Finalize single battle system

- [ ] Rename/swap `dd-battle-os-v2.js` into final `dd-battle-os.js`.
- [ ] Update `dd-scan-bg.js` to load final file name.
- [ ] Delete or reference-only retire old battle overlays.
- [ ] Update `docs/databyte-discovery-scanner-map.md`.
- [ ] Update `docs/databyte-legacy-app-rebuild-map.md`.

## Working rule

No future battle patch is complete until:

1. This map is updated.
2. Code is changed.
3. Loader wiring is changed if needed.
4. This map is updated again with new status.
5. User receives the exact commit SHA and what to test.
