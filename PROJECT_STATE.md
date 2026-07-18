# VoltanLabs Project State

Status: active  
Current phase: Data Discovery Phase 6.0 Progression Loop

Latest runtime recovery: Data Discovery Phase 6.0.4 loads one generated runtime
bundle from bootstrap 1.9.4 and preserves 19 ordered modules in the runtime
manifest. `dd-battle-core-runtime.js` is the active battle calculation,
application, turn-order, retaliation, and battle-context owner. It uses one
synchronous event-free transaction per input and returns one result to the
shell. Live browser verification confirms fast Scanner startup, Encounter and
Battle startup, seven repeated attack turns, HP and Download updates,
party-defeat routing, Scanner return, and full-party healing.

The previous engine/balance/resolver/state/facade stack is no longer loaded.
Status rules remain owned by `dd-status-runtime.js` through silent calculation
and lifecycle calls. Rewards remain a separate domain owner and are awarded
once when the rebuilt core reports victory.

Phase 6.0 completes the first progression loop. Battle victories now award
idempotent XP, levels, stat growth, ByteCoins, deterministic drops, and Version
Upgrade tiers. The result screen presents reward and level progress before
returning to the defeated signal for Download. The Admin screen exposes recent
persistent battle history, and player data maintains a rolling recovery backup
that restores a missing primary save automatically.

Authored specialty moves now extend beyond explicit species mappings through
configuration matching. Their strategic status effects are active, zero-power
support moves no longer deal damage, and battle controls identify configuration
and status roles. Presentation adds bounded hit/attack feedback and status chips
without adding combat events to the deterministic core transaction.
Saved collection records reconcile their authored move sets from the current
roster while preserving HP, XP, levels, stats, and player-owned progress.

Party lead selection is recovery-safe: a fainted saved active slot no longer
shadows healthy members. Reads remain pure, and Battle start synchronizes the
active slot to the selected usable lead exactly once.

Battle HP presentation is tied directly to canonical current/max HP. The thin
edge around each sprite drains clockwise on every hit, changes from green to
yellow to red as HP falls, and reaches an empty red state at 0 HP. The interior
sprite circle remains opaque and is not filled by the HP color.

During battle, the shell marks its remaining viewport as a dedicated battle
stage. The battle screen fills that entire stage, while its sprite grid expands
and centers inside the available space above the canonical battle controls.
The shell owns the stage mode; the battle screen owns only its internal sizing.

Party defeat is no longer a persistent soft-lock. Returning from the defeat
result restores all downloaded party members to full HP through the canonical
player recovery owner; healing never occurs mid-battle.

Latest battle contention recovery (2026-07-17): Scanner and Encounter no longer
build battle context eagerly; party reads no longer write storage or emit
events; shell context normalization no longer invokes the battle resolver; and
the active lead is normalized only once. Superseded compatibility and recovery
diagnostic files are archived as evidence.

The v4.7.6 shell also builds one shared context snapshot and prepares both the
screen and its controls before changing either DOM host. This prevents a late
context failure from pairing an Encounter screen with stale Scanner controls
and removes three redundant storage/context rebuilds from each render.

Phase 4.8 begins the runtime consolidation baseline. `dd-player-runtime.js` is
now the single loaded owner for collection, party, active slot, forced switch,
inventory, and Dex persistence; the former domain globals are compatibility
views from that owner. Phase 5.0 supersedes the former battle facade with
`dd-battle-core-runtime.js`; legacy battle components remain repository
references but are excluded from the active bootstrap.

The visual-only `dd-scan-bg.js` adapter is implemented but no longer loaded;
its always-running sweep and ring animations remained active across every screen
and reproduced renderer unresponsiveness before battle input was dispatched.

Phase 4.9 adds `DD_SCREEN_REGISTRY` as the only screen/control contract consumed
by the shell, `DD_APP_PRESENTATION_RUNTIME` as the app layout and overlay owner,
and `DD_APP_BOOTSTRAP` as the single HTML module entry point. The HTML now loads
one bootstrap, which fetches one generated bundle; its 19 input owners remain
explicit and deterministic in the bootstrap and runtime manifest. Fifteen
superseded runtime files remain recoverable under the compatibility archive;
temporary isolation bundles, the diagnostic harness, and the retired duplicate
presentation observer are in the recovery-diagnostics archive.

## Version Upgrade Path

Implemented in Phase 6.0.4:

- Persistent XP, levels 1-30, deterministic stat growth, and battle history.
- Version tiers at Kilobyte (1), Megabyte (5), Gigabyte (10), Terabyte (15),
  and Petabyte (25).
- Idempotent victory rewards and a result screen with level and tier progress.
- Rolling player-save recovery and authored specialty-move reconciliation.

Planned next, in order:

1. Author canonical per-tier forms, stat packages, and move/ability unlocks in
   Studio data.
2. Add a Version Upgrade ceremony screen that presents, but does not calculate,
   the reward runtime's upgrade result.
3. Expand specialty move and status coverage across the canonical roster.
4. Add mission, item, and equipment progression through their existing owners.
5. Add explicit save slots and portable export/import after schema migration
   rules are documented and tested.

## Purpose

This document is the living internal state of VoltanLabs. It records the active product architecture, canonical owners, working gameplay loop, repository recovery work, known gaps, Studio support, and immediate priorities.

Older Phase 2-era references are consolidated into:

```text
docs/studio-reference.md
```

## Current Direction

VoltanLabs has three connected layers:

```text
Public Website
  ↓
Products and Tools
  ↓
VoltanLabs Studio
```

