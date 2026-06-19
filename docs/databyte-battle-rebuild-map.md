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

Important rule: Throw DataByteCoin should be available during the normal battle loop.

## Phase 4A Status

- Free capture turn loop implemented
- Throw available before target reaches 0 HP
- Failed throws return to action loop
- Item placeholder active
- Change placeholder active
- Weakened state no longer hard-locks capture

## Phase 4B — Battle Presentation Modernization

### UI Goals

- Move from webpage-style button stack to RPG battle layout
- Creature becomes primary focus of screen
- Floating combat dock returns in controlled form
- Environment backgrounds introduced
- Reduce vertical button footprint

### Planned Work

- [ ] Floating action dock (Attack / Shield / Item / Change / Coin)
- [ ] Large signal presentation area
- [ ] Environment system (Forest, Stream, Cave, Rift, etc.)
- [ ] Animated signal-ready layout
- [ ] Compact battle log
- [ ] Scanner HUD redesign
- [ ] Mobile-first battle spacing pass

### Phase 4C — Progression Systems

- [ ] Scanner XP
- [ ] Rank progression
- [ ] Inventory system
- [ ] Real item effects
- [ ] Party system
- [ ] Signal swapping

### Phase 5 — World Systems

- [ ] Animated sprites
- [ ] Evolutions
- [ ] World map
- [ ] Quests
- [ ] Events
- [ ] Final battle system merge

## Working rule

No future battle patch is complete until roadmap, code, loader state, and testing notes stay synchronized.