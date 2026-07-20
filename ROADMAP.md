# VoltanLabs Roadmap

Current focus: **Data Discovery Phase 6.0.4 Progression Loop + Presentation Recovery**.

See `PROJECT_STATE.md`, `README.md`, `docs/data-discovery-ownership-map.md`,
`docs/databyte-runtime-load-order.md`, and `docs/studio-reference.md` for the
active architecture and implementation status.

## Roadmap Rules

- One active owner per responsibility.
- The v4 App Shell coordinates; it does not absorb gameplay or screen ownership.
- Screens render; runtimes calculate, transition, and persist state.
- The HTML entry point, bootstrap registry, generated bundle, runtime manifest,
  diagnostics, and ownership maps must stay synchronized.
- Planned systems must not be described as implemented.
- Compatibility layers may be retired only after verified canonical replacements
  exist and recovery-value copies are archived.
- Data Discovery must remain offline-first and independently distributable.

## Phase 6.0.4 Release Baseline

- One bootstrap loads one generated bundle containing 19 ordered active modules.
- `dd-battle-core-runtime.js` owns one complete deterministic battle transaction
  per player input, including ordering, damage, retaliation, fainting, and the
  terminal decision.
- `dd-player-runtime.js` owns collection, party, switching, inventory, Dex,
  individual progression, party recovery, and rolling save backup.
- `dd-battle-reward-runtime.js` owns idempotent XP, levels, stat growth,
  ByteCoins, drops, Version Upgrade tiers, and persistent battle history.
- Specialty moves and strategic statuses are active through Studio-authored data.
- Victory results show reward and progression details before Download resumes.
- Battle HP is the thin ring around each sprite, and the battle sprite window
  fills the remaining viewport above the battle controls.
- Unloaded compatibility runtimes and recovery diagnostics are archived rather
  than participating in the live script chain.

## Version Upgrade Progression

The current progression contract is implemented through level 30 with milestone
tiers at Kilobyte (1), Megabyte (5), Gigabyte (10), Terabyte (15), and Petabyte
(25). The reward runtime owns thresholds, tier decisions, and history. The
player runtime persists each sprite's resulting progress. Studio data will own
authored forms and unlock packages; screens may present results but may not
calculate them.

### Next release path

1. **Canonical upgrade content**
   - Author per-tier forms, stat packages, move unlocks, and ability unlocks.
   - Add schema validation and deterministic roster coverage reports.
2. **Version Upgrade ceremony**
   - Add a dedicated presentation screen driven by the reward result.
   - Preserve Continue-to-Download routing after a victory upgrade.
3. **Roster strategy coverage**
   - Expand specialty moves, support actions, and status interactions.
   - Add deterministic tests for each new effect and immunity.
4. **Adventure progression**
   - Add missions, item progression, and equipment without bypassing player,
     reward, inventory, or canonical-data ownership.
5. **Save portability**
   - Define versioned save migrations, explicit slots, and export/import.
   - Validate corrupt, older, missing, and partially migrated saves.

## Presentation Recovery Path

The next visual milestone consolidates presentation behavior without merging
gameplay owners:

1. Keep `dd-app-presentation-runtime.js` as the visual coordinator for shared
   scene backgrounds, motion policy, overlays, and asset loading.
2. Keep screen render functions internally separated for Scanner, Encounter,
   Battle, Result, and controls, but reduce their independent visual plumbing.
3. Add a safe `spriteAsset` presentation field that accepts same-origin assets
   under `/assets/`; fallback remains the current icon when no asset is present.
4. Reintroduce the legacy scan beam, rotating rings, rarity glow, and battle
   attack/hit motion as CSS owned by the presentation layer. No polling loops
   or animation module may mutate battle state.
5. Test with `assets/sprites/crabician.gif`, `leovolt.gif`, `nullbot.gif`, and
   `scorpyone.gif` before wiring canonical Studio asset references.
6. Add reduced-motion behavior and image-load fallback before promoting any
   visual asset contract into Studio data.

## Recovery and Release Gates

Before each merge to `main`:

1. Rebuild the runtime bundle from `dd-app-bootstrap.js`.
2. Validate the HTML entry point against `studio/runtime/load-order.json`.
3. Run JavaScript syntax checks, JSON parsing, and the Data Discovery regression
   suite.
4. Exercise Scanner -> Encounter -> Battle -> Result -> Download in a browser,
   including repeated attacks, a terminal result, control recovery, and viewport
   layout.
5. Review archive moves and confirm no archived file is loaded or registered as
   an active owner.
6. Synchronize versions and ownership language across current documentation.

Canonical-data generator recovery remains a separate repository-recovery track.
Runtime fallbacks do not make invalid generator inputs or stale generated output
healthy; strict generator checks must pass before canonical data regeneration is
claimed complete.
