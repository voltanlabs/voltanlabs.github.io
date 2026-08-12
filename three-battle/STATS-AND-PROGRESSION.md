# DataByte stats and progression

## Individual capture rolls

Every captured DataByte is an individual instance with its own unique ID.

- Capture HP is randomly rolled from 60–100 at level 1.
- Capture HP is the instance's starting max HP and is never rerolled.
- Critical chance is randomly rolled from 0–50% at capture.
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

- Max HP grows gradually toward the current form cap.
- Attack, defense, and speed each gain 0.4 points per level, rounded for display and battle.
- Evolution adds a stage bonus to attack, defense, and speed while preserving the instance's original variation.
- Current HP is preserved as a percentage when leveling or evolving, preventing free healing.

## Healing and battle

Healing is capped by the instance's current `maxHp`, not a universal 100 HP value. Battle damage reads the instance's attack, defense, speed, and fixed crit chance. Evolution and storage preserve the instance's rolls through its unique ID.
