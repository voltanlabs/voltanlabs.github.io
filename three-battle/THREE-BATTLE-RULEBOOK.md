# VoltanLabs Three.js Data Discovery Rulebook

This is the working rulebook for the standalone `three-battle` game. It is the source of truth for implemented behavior unless a rule is explicitly marked **Open decision**. The original Data Discovery game is outside this document and must not be changed by Three.js work.

## 1. Product boundary

- The Three.js game lives in `three-battle/`.
- It owns its own battle loop, scanner, party, repository, Dex, regions, inventory, rewards, progression, and save namespace.
- Persistence keys use the `vl_three_battle_*` prefix.
- `resetSave()` may clear that namespace only; it must not clear or modify the original game.
- The browser must load the page through a static server so ES modules and textures resolve correctly.

## 2. Identity and storage

- `species ID` identifies the species definition: moves, lore, sprite, alignment, rarity, family, and configuration.
- `uid` identifies one owned instance and is the preferred key for HP, XP, stats, crit, switching, deleting, upgrading, and storage operations.
- A species may be caught multiple times. Each catch receives a new UID and independent rolls.
- The party has five active slots. Extra catches go to the repository.
- The lead is the first active party slot and cannot be a fainted instance.
- Repository instances retain their own HP, XP, level, stats, crit, form, and UID.
- A delete operation permanently removes that one instance from party or repository.
- Deleting a nonexistent UID returns failure and changes nothing.

## 3. Capture and wild instances

- A wild signal is generated at the active region’s level band.
- Wild instances enter battle at full current HP.
- Wild level, XP, HP roll, max HP, stats, stat rolls, crit, rarity, alignment, form, and region are preserved when captured.
- Capture does not reset a wild instance to level 1 or reroll its stats.
- A defeated wild instance can be captured at 0 HP; it must be recovered before becoming lead.
- Capture chance is based on rarity, wild level, evolution stage, remaining HP, capture pressure, and stability.
- Base rarity chances are Common 85%, Uncommon 76%, Rare 66%, Epic 56%, Legendary 46%, and Mythic 36%, before modifiers and final bounds.
- Final capture chance is bounded between 5% and 95%.
- A capture attempt spends one DataByteCoin. Failed captures reduce stability and may allow the enemy to act if battle is still active.
- A successful capture is added to the first empty party slot; if full, it goes to the repository.

## 4. XP and level progression

- XP is cumulative total XP, not XP only within the current level.
- The level threshold is `50 × (level - 1) × level`.

| Level | Total XP required |
|---:|---:|
| 1 | 0 |
| 2 | 100 |
| 3 | 300 |
| 4 | 600 |
| 5 | 1,000 |
| 10 | 4,500 |
| 30 | 43,500 |
| 50 | 122,500 |
| 65 | 208,000 |
| 78 | 300,300 |
| 100 | 495,000 |

- Level is capped at 100.
- XP is the sole source of truth for an owned instance’s level.
- Saved level fields are display/cache fields and are repaired from XP; they must never inflate XP.
- Imported and legacy instances are normalized immediately on import; level, XP, HP, and stats are not left in a partially normalized state.
- XP rewards are added to both the player profile and the active instance when appropriate.
- A level-up preserves the current HP percentage while recalculating max HP and combat stats.

## 5. HP rules

- There is no hard max-HP cap for owned instances.
- Wild capture HP rolls are stage-based: base forms 60–100, second forms 90–140, and third forms 120–180.
- Level growth adds `0.85 HP per level` after level 1, rounded to the nearest whole HP.
- Each form upgrade adds a flat `+50 max HP` bonus.
- The controlled formula is: `capture HP + round((level - 1) × 0.85) + ((form stage - 1) × 50)`.
- This creates approximate level-100 bands of 144–184 HP for base forms, 194–234 HP for second forms, and 244–284 HP for third forms.
- These are progression bands, not hard ceilings; the individual capture roll and future rule changes may move the final value outside a displayed example band.
- Leveling and upgrading preserve the current HP ratio; they do not grant a free full heal.
- Current HP can change through battle damage, healing items, status effects, and explicit Signal Reboot.

## 6. Combat stats

- Attack, defense, and speed start from the species configuration plus an instance-specific deterministic variation roll.
- Level growth adds `0.85` to attack, defense, and speed per level, rounded for battle/display.
- Evolution adds `+18` to attack, defense, and speed for each form transition.
- Crit chance is rolled independently on capture from 0–50%.
- Crit chance never increases from leveling or evolution.
- A critical hit multiplies damage by `1.5` and is labeled `CRITICAL` in the battle log.
- **Wild stat ceiling:** wild stat generation currently uses a temporary ceiling of 160 for attack, defense, and speed.
- The 160 value is an implementation tuning constant named `WILD_STAT_CEILING`; it did not come from the lore sheet.
- Owned instances have no 160 ceiling. Leveling and evolution may raise owned stats above 160.

## 7. Evolution and upgrade

- Evolution is manually confirmed from the instance details window.
- A base form may upgrade to its second form when its family threshold is reached.
- A second form may upgrade to its third form when its family threshold is reached.
- XP is not spent when upgrading; the instance keeps its cumulative XP.
- UID, crit, stat-roll variation, HP ratio, and individual identity are preserved.
- Species ID, name, sprite, form/version, stage bonus, and form HP bonus change to the next form.
- Evolution timing varies by family:

| Timing family | First upgrade | Second upgrade |
|---|---:|---:|
| Early | Level 22 / 23,100 XP | Level 50 / 122,500 XP |
| Standard | Level 30 / 43,500 XP | Level 65 / 208,000 XP |
| Late | Level 40 / 78,000 XP | Level 78 / 300,300 XP |
| Endgame | Level 50 / 122,500 XP | Level 88 / 382,800 XP |

## 8. Regions and wild encounter levels

Regions are selected through the World Map and live inside the map system.

| Region | Discoveries required | Lead level required | Wild level band |
|---|---:|---:|---:|
| Pristine Grove | 0 | 1 | 1–15 |
| Stained Rift | 8 | 10 | 10–35 |
| Null Cavern | 18 | 25 | 25–60 |
| Signal Bay | 32 | 45 | 45–85 |

- A region requires both its unique discovery count and the active lead level.
- The map shows which requirement is still missing.
- Region alignment/configuration rules determine which species belong to each region.
- Pristine Grove also includes the curated clean/stable families KindleKid, CoinCalf, Clockadile, Gem-N-Eye, PixelPup, and AquoBit because their lore fits a stable discovery environment even when their configuration would otherwise map elsewhere.
- Base forms have the highest stage weighting: base 50, second form 30, third form 20, subject to wild-form profile XP gates.
- The player profile’s admin/progression XP gates when evolved forms can appear in the wild.
- Individual DataByte XP gates owned-instance evolution; these are separate systems.

## 9. Moves and accuracy

- Each species family receives four authored moves.
- Moves have a name, configuration, type, power, accuracy, description, and optional status effect.
- Move cards show name, damage/healing, and current accuracy.
- Accuracy is a move property modified by active accuracy effects; a 100-accuracy move is guaranteed to hit unless a future rule explicitly changes that.
- A move can miss only when its effective accuracy is below 100% and the random accuracy roll fails.
- Move selection is locked during the enemy response so repeated clicks cannot create extra attacks.
- Items and switching consume the player’s turn and allow an enemy response.

## 10. Damage and alignment

- Base damage uses `move power × 0.65 × sqrt(attack / defense)`.
- Level difference uses `clamp(1.03 ^ (attacker level - defender level), 0.45, 2.10)`.
- Alignment interactions, attack/defense modifiers, guard, status modifiers, and critical hits are applied after the base calculation.
- Player and enemy use the same core damage model.
- Enemy attacks use authored family moves when available and alignment fallback moves otherwise.
- Signal, Volt, and Mirror interactions are the current alignment interaction categories.

## 11. Status effects

- Positive and negative effects can exist on both the player and enemy.
- Multiple different effects can be active at the same time.
- Reapplying an existing effect refreshes duration and increases stacks up to that effect’s stack limit.
- Damage-over-time effects tick at the defined turn boundary and can defeat a target.
- Current effects include burn, freeze, shock, corruption, shield, boost, charged, guarded, misdirected, bound, infected, glitched, focused, and drained.
- Positive effects are color-coded green; negative effects are color-coded red/pink.
- Status badges expose a tooltip/description in the battle UI.

## 12. Battle flow

- A battle begins after the discovery record is opened and the player chooses Battle Signal.
- Each turn is player action → enemy response, except when a battle ends, a capture succeeds, or a status prevents an action.
- If the enemy reaches 0 HP, victory rewards are settled once.
- If the player reaches 0 HP, the player must choose a healthy replacement.
- If no healthy party replacement exists, the battle ends and returns to the scanner.
- Defeat never automatically heals or revives the party.
- Signal Reboot is the explicit scanner recovery action for restoring party and repository HP.
- A fainted DataByte cannot be selected as lead or deployed as the active lead.

## 13. Rewards

- Victory XP scales with enemy level, rarity, and evolution stage.
- Defeating an enemy immediately grants base battle XP to the profile and active DataByte.
- Victory also grants one DataByteCoin and one random field item.
- A successful capture adds a 25% capture XP bonus to the same recipients, with a minimum bonus of 5 XP.
- A failed capture does not duplicate base XP, coins, or items.
- Player defeat grants no battle rewards.
- Reward settlement has one-time state guards to prevent duplicate rewards.

## 14. Items and recovery

- Repair Patch restores 25 HP.
- Repair Pulse restores 35 HP.
- Signal Boost increases capture pressure.
- Battle item use consumes the player’s turn.
- Scanner item use can target a damaged party or repository instance.
- Signal Reboot restores all party and repository instances to their max HP and is not passive.

## 15. Dex, discovery, and scanner

- Scanning marks a species as seen and creates its Dex record.
- Capturing marks the Dex record as captured.
- Discovery records use species IDs; owned party operations use UIDs.
- The scanner resets its encounter state when returning from battle or changing regions.
- A scanner cannot begin a new scan while its current scan timer is active.
- A 0-HP active lead is blocked from scanning until Signal Reboot or a healthy replacement is selected.

## 16. Deployment and cache

- JavaScript syntax checks must pass before deployment.
- Generated sprite paths must resolve from `data/sprites/` with case-consistent filenames.
- The service-worker cache release and script query versions must change when behavior changes.
- Deployment should be verified through the live page after the hosting provider finishes publishing.
- Users should receive updated scripts through the versioned service-worker release without manually clearing browser cache.

## 17. Known open decisions

- Whether the current wild stat ceiling should remain 160 after more balance playtesting.
- Whether the third-form +18 bonus should remain additive without an owned-stat ceiling; current rule says yes.

When any open decision is resolved, update this rulebook and the relevant implementation in the same change.
