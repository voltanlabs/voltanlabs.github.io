# DataByte stats and progression

## Individual capture rolls

Every captured DataByte is an individual instance with its own unique ID.

- A base HP roll from 60–100 is generated with the wild instance. Its level-adjusted max HP is retained when caught and the base roll is never rerolled.
- Current HP carries over from the signal at capture; a defeated signal is captured at 0 HP and must be recovered before it can lead a battle.
- Wild level, level-appropriate XP, attack, defense, speed, stat rolls, and critical chance all carry into the caught instance unchanged.
- Critical chance is randomly rolled from 0–50% when the wild instance is generated and never increases with level.
- Critical chance never increases from leveling or evolution.
- Attack, defense, and speed use the species configuration plus an individual variation roll.

## Form caps

Each evolution stage has its own HP ceiling:

| Form | HP cap |
| --- | ---: |
| Base form | 100 |
| Second form | 200 |
| Third form | 300 |

The instance's max HP grows from its capture roll toward its current form cap as it levels. It never exceeds that cap.

## Level growth

Sprite level uses the existing XP curve and is capped at level 100.

- Max HP grows progressively toward the current form cap, with higher levels reaching the cap more reliably.
- Attack, defense, and speed each gain 0.85 points per level, rounded for display and battle.
- Evolution adds a stage bonus to attack, defense, and speed while preserving the instance's original variation.
- Current HP is preserved as a percentage when leveling or evolving, preventing free healing.

## Family evolution timing

Evolution timing varies by family so every line does not peak at the same point.

| Timing band | First evolution | Second evolution |
| --- | ---: | ---: |
| Early | Level 22 / 23,100 XP | Level 50 / 122,500 XP |
| Standard | Level 30 / 43,500 XP | Level 65 / 208,000 XP |
| Late | Level 40 / 78,000 XP | Level 78 / 300,300 XP |

The XP values are calculated from the level curve: `50 × (level - 1) × level`. The current level-100 cap remains meaningful because third forms arrive well after the midpoint of progression.

## Healing and battle

Healing is capped by the instance's current `maxHp`, not a universal 100 HP value. Battle damage reads the instance's attack, defense, speed, and fixed crit chance. Evolution and storage preserve the instance's rolls through its unique ID.

### Canonical battle rules

- Player and wild DataBytes both use their authored species/family move sets. Both sides use move accuracy, attack, defense, level, crit, alignment interactions, buffs, debuffs, damage-over-time effects, and stacking limits.
- Level advantage uses `clamp(1.03 ^ (attacker level - defender level), 0.45, 2.10)`. A five-level gap remains competitive, while a very low-level DataByte cannot reliably overpower a signal dozens of levels above it.
- Turns are locked from command selection through the enemy response. Repeated clicks cannot add attacks.
- Switching and using a battle item consume the player's action and allow an enemy response. Healing items immediately persist the restored HP to the unique instance.
- A fainted active DataByte must be replaced by a different healthy party instance. If none remain, the battle returns to the scanner and recovery must use Signal Reboot; battle defeat never grants a free full heal.
- Scanning does not passively heal or revive stored instances. HP changes only through battle effects, healing items, progression growth that preserves the current HP ratio, or an explicit Signal Reboot.
- A newly generated wild instance always enters at full current HP. Capture preserves its encountered level, level-appropriate XP, max HP, current HP, stats, crit, and stat rolls.

## Wild-form unlocks

Player profile XP controls which evolved forms can appear as wild signals. Individual DataByte XP controls whether an owned instance may evolve; these are separate progression tracks.

- Base forms are available from the start.
- Second forms unlock in the same family timing band as their first evolution: Early level 22, Standard level 30, Late level 40, and Endgame level 50.
- Third forms unlock at the family’s second-evolution threshold: Early level 50, Standard level 65, Late level 78, and Endgame level 88.
- Once unlocked, encounter weighting remains stage-based: base 50, second form 30, and third form 20.

## Wild encounter levels and rewards

Wild signals use the active region's level band rather than always spawning at level 1. Each encounter rolls independently across the full band.

| Region | Wild level band |
| --- | ---: |
| Pristine Grove | 1–15 |
| Stained Rift | 10–35 |
| Null Cavern | 25–60 |
| Signal Bay | 45–85 |

Victory XP scales with encounter level, rarity, and evolution stage. The reward is staged so a failed capture never erases earned progress:

1. When the enemy is defeated, base battle XP is immediately awarded to the player profile and active DataByte. The victory also grants one DataByteCoin and one randomized field item.
2. If capture succeeds, an additional capture bonus equal to 25% of base battle XP (minimum 5 XP) is awarded to the same profile and active DataByte.
3. If capture fails, only the base battle XP remains. Capture does not award a second copy of base XP, coin, or item.

Each stage is guarded by its own state flag, so repeated callbacks or opening the reward screen cannot duplicate rewards. Player defeat pays nothing.

Capture difficulty increases modestly with enemy level and evolution stage, while lower HP, capture pressure, and reduced stability continue to improve the chance.

Battle damage now uses both combatants' defense and a bounded level-gap modifier. Higher-level signals therefore hit harder and resist lower-level attacks, while equal-level battles remain close to the normal attack-versus-defense formula.
