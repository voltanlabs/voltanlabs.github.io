# DataByteSprites Battle Rebuild Map

Project tag: `DBD-BATTLE-REBUILD`

Purpose: keep the Scanner OS battle rebuild aligned with the original Data Discovery rules and stop temporary overlay patches from becoming permanent architecture.

## Source of truth

| File | Status | Use |
|---|---|---|
| `assets/js/databyte-battle.js` | LEGACY SOURCE | Battle rules reference. Do not load directly into Scanner OS. |
| `assets/js/databyte-discovery.js` | LEGACY SOURCE | Capture, Signal, Stability, Seen/Captured/Escaped rules. |
| `assets/js/dd-battle-os-v2.js` | ACTIVE REBUILD | Current single active battle system for testing. |
| `docs/databyte-discovery-scanner-map.md` | ACTIVE MAP | Main Scanner OS architecture map. |
| `docs/databyte-legacy-app-rebuild-map.md` | ACTIVE MAP | Overall legacy-to-Scanner OS migration tracker. |

## Legacy battle rule summary

- Signal means capture probability.
- Battle starts with Signal equal to the current encounter capture chance.
- Tune/attack reduces target HP.
- Enemy HP reaching zero means the target is weakened/subdued, not automatically captured.
- Weakened/subdued battle grants a Signal boost.
- Scan Pulse grants a Signal boost and then lets the enemy act.
- Throw DataByteCoin uses the current Signal as capture probability.
- Failed ByteCoin throws reduce Stability and may trigger Signal Lost.
- Stability is shown as pips/stars.
- Fighter HP may be displayed, but must never be labeled as Signal.

## Current active battle stack

| File | Status | Role |
|---|---|---|
| `assets/js/dd-battle-os-v2.js` | ACTIVE CORE | Single active battle rebuild. Owns battle UI, Signal, Stability, Subdued/Lost, and coin handoff. |
| `assets/js/dd-battle-os.js` | RETIRED ACTIVE-FILE | Old battle core. No longer loaded by `dd-scan-bg.js`; keep as fallback/reference until V2 is renamed final. |
| `assets/js/dd-battle-legacy-stats.js` | RETIRED TEMP | Not loaded. Earlier telemetry overlay. |
| `assets/js/dd-battle-legacy-features.js` | RETIRED TEMP | Not loaded. Earlier controls overlay. |
| `assets/js/dd-scan-bg.js` | ACTIVE LOADER | Loads Scanner OS modules and `dd-battle-os-v2.js`. Also owns restored scanner background CSS. |

## Current known issues

| Issue | Status | Notes |
|---|---|---|
| Multiple battle files fighting each other | FIXED FOR TESTING | Loader now runs only `dd-battle-os-v2.js` for battle. |
| Signal telemetry confusion | FIXED IN V2 | Signal is treated as capture probability. HP is displayed separately. |
| Enemy defeat capture flow | PARTIAL FIX | V2 enters Subdued and uses Throw DataByteCoin. Needs more capture-result parity testing. |
| Damage-to-Signal math | PHASE 2B ACTIVE | Damage now converts into Signal gain with rarity scaling. Needs tuning from screenshots. |
| Counter after defeating blow | FIXED IN 2B | Defeating hit should not trigger enemy counter. |
| Capture probability mismatch | WATCH | Final capture screen still uses scanner capture system; compare V2 Signal to result roll. |
| Signal Lost from battle | PARTIAL | Core-offline Stability drop exists. Failed coin breakout still needs parity. |
| Party swap after player forced offline | MISSING | Legacy noted party swap needed. Scanner OS does not implement it yet. |
| Battle log history | PARTIAL | V2 stores recent action history. Needs styling/tuning. |
| XP / rewards | MISSING | Future Scanner OS progression system. |

## Scanner visual notes tied to battle work

The battle isolation pass temporarily removed scanner background effects from the loader. These were restored in `dd-scan-bg.js`.

Current visual state:

- Grid brightness restored and increased.
- Gold scanner sweep restored.
- Sprite-orb animated rings added.
- Ring placement fixed from stage-level to orb-level.

Planned scanner visual upgrades:

1. Rarity-colored orb rings.
2. Slow orbiting particles for Epic/Mythic sprites.
3. Signal distortion effect for Glitch sprites.
4. Scanner pulse expanding outward when discovery succeeds.
5. Rarity-specific idle glow intensity.

## Rebuild target architecture

Target battle stack:

| File | Target role |
|---|---|
| `assets/js/dd-battle-os.js` | Final battle owner after V2 is confirmed and renamed/swapped. |
| `assets/js/dd-battle-os-v2.js` | Temporary active rebuild workspace. |
| `assets/js/dd-battle-legacy-stats.js` | Delete or mark reference-only after final swap. |
| `assets/js/dd-battle-legacy-features.js` | Delete or mark reference-only after final swap. |
| `assets/js/dd-scan-bg.js` | Loads only the final battle module and scanner visual modules. |

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
- [x] Confirm Subdued and Throw DataByteCoin are visible.

### Phase 2B — Signal math and defeated-state correction

- [x] Remove counter after defeating hit.
- [x] Convert target damage into Signal gain.
- [x] Add rarity-scaled Signal gains.
- [x] Add subdued result panel with final capture probability.
- [x] Keep Signal as capture probability.
- [ ] Tune Common/Rare/Epic/Mythic gain numbers from user screenshots.
- [ ] Compare V2 displayed Signal against final capture result roll.

### Phase 3 — Battle parity pass

- [ ] Failed coin breakout reduces Stability and may return to battle/signal.
- [ ] Signal Lost from failed capture matches legacy behavior.
- [ ] Party lead swap after player forced offline.
- [ ] Battle result screen parity with legacy wording.
- [ ] Scanner XP/rank reward hooks.
- [ ] Type/rarity-specific battle text.

### Phase 4 — Finalize single battle system

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
