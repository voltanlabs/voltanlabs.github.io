
Which file are you talking about because my lines look different 


speciesindexreconstruct.txt
Document






DATABYTESPRITES DATA.txt
Document
This is the current lineup and update you can make up how the typing work against each other 

I fetched and audited the live dd-battle-resolver.js.

Audit result: Pass
Structure

✅ Complete file (356 lines).

✅ Properly terminates with })();; no truncation.

✅ Version 3.4.0.

Architecture

✅ Resolver depends on DD_STATUS_RUNTIME instead of owning status state.

✅ Status modifiers are consumed through statusModifiers().

✅ Action blocking is delegated to DD_STATUS_RUNTIME.actionGate().

✅ Status applications are normalized and returned rather than applied directly.

Battle flow

✅ resolve() correctly:

checks action gates,

performs hit calculation,

applies configuration multipliers,

applies status modifiers,

computes damage,

returns statusApplication,

returns modifier information.

Exports

✅ Public API is intact:

normalizeMove

normalizeStatusEffect

configurationsOf

statusModifiers

actionGate

typeResult

resolveStatus

resolve

chooseEnemyMove

effectiveSpeed

turnOrder

hash

One improvement I'd make later
The only architectural refinement I noticed is that hitCheck(), resolveStatus(), chooseEnemyMove(), and turnOrder() currently include Date.now() in their hashing, which makes outcomes non-deterministic across identical battle states.

For future replay support, deterministic testing, and seeded encounters, I'd eventually replace those with a battle-scoped RNG or encounter seed. It's not a bug for normal gameplay, but it's a worthwhile enhancement for the architecture.

So far:

✅ dd-status-runtime.js — passes.

✅ dd-battle-resolver.js — passes.

The last remaining file to audit is assets/js/dd-battle-state-runtime.js.


Proceed with the audit 

Worked for 24s
The live dd-battle-state-runtime.js is complete, but the audit found one important logic issue.

Structural audit — pass
Blob SHA: b9f6c5f29933c641a788ed439f09908918bea28d

Version 0.4.0

Complete through line 375 with the closing })();; no truncation.

All expected APIs remain exported:

state lifecycle and terminal methods

status application

participant and phase ticking

status-terminal resolution

action blocking.

Duplicate terminal processing is correctly blocked by terminalProcessed.

Status applications are delegated to DD_STATUS_RUNTIME, preserving ownership boundaries.

Important issue — participant sides can be reversed
resolveStatusTerminal() determines whether a fainted participant is the player or wild sprite by calling participantSide(). That function first looks for a side stored on a status, but otherwise assumes:

index === 0 ? 'player' : 'wild'
The status-flow coordinator builds its participant map in the order resolver calls occur. When the wild sprite acts first, the insertion order can be:

wild, player
That conflicts with the state runtime’s fallback assumption of:

player, wild
A status-caused knockout could therefore be classified backward:

Wild faints but battle reports defeat.

Player faints but battle reports victory.

Double-faint handling could receive incorrect side information.

The risky classification happens here.

Secondary sequencing concern
DD_STATUS_BATTLE_FLOW calls tickTurn() only after both combatants have acted. But tickTurn() runs both:

beginTurn → start phase
endTurn → end phase
That means the “start” phase currently occurs after the turn’s actions, not before them. It does not break Burn or Corruption today because their damage is end-phase only, but it will matter when start-turn effects are added.

Verdict
dd-status-runtime.js: passes

dd-battle-resolver.js: passes

dd-battle-state-runtime.js: complete, but needs a side-identification fix before relying on status-caused victory and defeat

The next corrective commit should make participant sides explicit in the flow coordinator instead of inferring them from array order or remaining statuses.


Okay give me the next commit in txt file form as a full rebuild fetch the correct file first 

Worked for 43s
I fetched the current live file first and rebuilt it as a complete replacement.

Target:

assets/js/dd-status-battle-flow.js
Commit message:

fix: make status turn sides and phases explicit

This fixes both audit findings:

Player and wild participants are now stored explicitly by side, then always passed to the state runtime as:

player, wild
participantSides is supplied directly, so status-caused victory and defeat no longer depend on insertion order or remaining status data.

The start phase now runs before the first action.

The end phase runs only after both player and wild actions complete.

The current battle turn number is passed into the resolver for Freeze/action-gate rolls.

A start-phase terminal result blocks the pending action cleanly.

Existing DD_STATUS_BATTLE_FLOW installation and health contracts remain available.

The replacement contains 383 lines and passed node --check. 


Library
/
dd-status-battle-flow-v1.1.0-full.txt


// assets/js/dd-status-battle-flow.js
// Phase 4.4.5: live status-turn coordinator with explicit side ownership and correct turn phases.
(function () {
  'use strict';

  if (!location.pathname.includes('databyte-discovery')) return;
  if (window.DD_STATUS_BATTLE_FLOW) return;

  const VERSION = '1.1.0';
  const OWNER = 'dd-status-battle-flow';

  let installed = false;
  let originalResolve = null;
  const actionSides = new Set();
  const participantsBySide = new Map();

  function resolver() {
    return window.DD_BATTLE_RESOLVER || null;
  }

  function battleState() {
    return window.DD_BATTLE_STATE_RUNTIME || null;
  }

  function sideForMode(mode) {
    return mode === 'enemy' ? 'wild' : 'player';
  }

  function opposite(side) {
    return side === 'wild' ? 'player' : 'wild';
  }

  function dispatch(name, detail) {
    document.dispatchEvent(new CustomEvent(name, {
      detail: Object.assign({
        owner: OWNER,
        version: VERSION,
        at: new Date().toISOString()
      }, detail || {})
    }));
  }

  function orderedParticipants() {
    const values = [];
    const sides = [];

    if (participantsBySide.has('player')) {
      values.push(participantsBySide.get('player'));
      sides.push('player');
    }

    if (participantsBySide.has('wild')) {
      values.push(participantsBySide.get('wild'));
      sides.push('wild');
    }

    return { values, sides };
  }

  function registerParticipants(actor, target, actorSide, targetSide) {
    if (actor && actorSide) participantsBySide.set(actorSide, actor);
    if (target && targetSide) participantsBySide.set(targetSide, target);
    return orderedParticipants();
  }

  function resetTurn(reason) {
    actionSides.clear();
    participantsBySide.clear();
    dispatch('dd:status-battle-turn-reset', {
      reason: reason || 'reset'
    });
  }

  function beginTurn(context) {
    const state = battleState();

    if (!state || typeof state.beginTurn !== 'function') {
      return {
        ok: false,
        skipped: true,
        reason: 'begin-turn-unavailable'
      };
    }

    const ordered = orderedParticipants();

    if (ordered.values.length < 2) {
      return {
        ok: false,
        skipped: true,
        reason: 'participants-incomplete',
        participantSides: ordered.sides
      };
    }

    const result = state.beginTurn(ordered.values, {
      source: OWNER,
      participantSides: ordered.sides,
      encounterId:
        state.snapshot &&
        state.snapshot().encounterId ||
        null,
      context: context || {}
    });

    dispatch('dd:status-battle-turn-started', {
      result,
      participantSides: ordered.sides
    });

    return result;
  }

  function endTurn(context) {
    const state = battleState();

    if (!state || typeof state.endTurn !== 'function') {
      return {
        ok: false,
        skipped: true,
        reason: 'end-turn-unavailable'
      };
    }

    const ordered = orderedParticipants();

    const result = state.endTurn(ordered.values, {
      source: OWNER,
      completedSides: Array.from(actionSides),
      participantSides: ordered.sides,
      encounterId:
        state.snapshot &&
        state.snapshot().encounterId ||
        null,
      context: context || {}
    });

    dispatch('dd:status-battle-turn-complete', {
      result,
      participantSides: ordered.sides
    });

    resetTurn('turn-complete');
    return result;
  }

  function terminalBlockedResult(user, move, startResult) {
    return {
      hit: false,
      miss: false,
      actionBlocked: true,
      actionGate: {
        allowed: false,
        blocked: true,
        reason: 'status-terminal'
      },
      blockedByConfiguration: false,
      type: {
        label: 'blocked',
        multiplier: 0,
        captureBonus: 0
      },
      move: move || null,
      hpDamage: 0,
      signalDamage: 0,
      capturePressure: 0,
      statusApplication: null,
      terminal:
        startResult &&
        startResult.terminal ||
        null,
      notes: [
        (user && user.name || 'Sprite') +
        ' could not act because the battle ended during the start phase.'
      ]
    };
  }

  function prepareAction(user, target, options) {
    const mode = options && options.mode || 'player';
    const actorSide = sideForMode(mode);
    const targetSide = opposite(actorSide);

    registerParticipants(
      user,
      target,
      actorSide,
      targetSide
    );

    let startResult = null;

    if (actionSides.size === 0) {
      startResult = beginTurn({
        mode,
        actorSide,
        targetSide
      });
    }

    return {
      mode,
      actorSide,
      targetSide,
      startResult
    };
  }

  function applyResolution(result, user, target, action) {
    const state = battleState();

    if (state && typeof state.applyResolution === 'function') {
      state.applyResolution(result, user, target, {
        actorSide: action.actorSide,
        targetSide: action.targetSide,
        source: OWNER
      });
    }

    actionSides.add(action.actorSide);

    if (
      actionSides.has('player') &&
      actionSides.has('wild')
    ) {
      endTurn({
        mode: action.mode,
        moveId:
          result &&
          result.move &&
          result.move.id ||
          null
      });
    }

    return result;
  }

  function install() {
    const activeResolver = resolver();

    if (!activeResolver || typeof activeResolver.resolve !== 'function') {
      return false;
    }

    if (
      installed &&
      activeResolver.resolve.__ddStatusBattleFlow
    ) {
      return true;
    }

    originalResolve =
      activeResolver.resolve.bind(activeResolver);

    function wrappedResolve(user, move, target, options) {
      const action = prepareAction(
        user,
        target,
        options || {}
      );

      if (
        action.startResult &&
        (
          action.startResult.terminal ||
          (
            action.startResult.state &&
            action.startResult.state.terminalProcessed
          )
        )
      ) {
        return terminalBlockedResult(
          user,
          move,
          action.startResult
        );
      }

      const state = battleState();
      const turn =
        state &&
        state.snapshot &&
        state.snapshot().turn ||
        0;

      const result = originalResolve(
        user,
        move,
        target,
        Object.assign({}, options || {}, {
          turn
        })
      );

      return applyResolution(
        result,
        user,
        target,
        action
      );
    }

    wrappedResolve.__ddStatusBattleFlow = true;
    activeResolver.resolve = wrappedResolve;
    installed = true;

    dispatch(
      'dd:status-battle-flow-ready',
      health()
    );

    return true;
  }

  function health() {
    const ordered = orderedParticipants();

    return {
      owner: OWNER,
      version: VERSION,
      installed,
      resolverAvailable: !!resolver(),
      battleStateAvailable: !!battleState(),
      statusRuntimeAvailable:
        !!window.DD_STATUS_RUNTIME,
      pendingSides:
        Array.from(actionSides),
      registeredSides:
        ordered.sides,
      turnPhases: {
        startBeforeActions: true,
        endAfterBothActions: true
      }
    };
  }

  document.addEventListener(
    'dd:battle-resolver-ready',
    install
  );

  document.addEventListener(
    'dd:battle-state-runtime-ready',
    install
  );

  document.addEventListener(
    'dd:status-runtime-ready',
    install
  );

  document.addEventListener(
    'dd:battle-state-change',
    function (event) {
      const value =
        event &&
        event.detail &&
        event.detail.value;

      if (value !== 'active') {
        resetTurn(
          'battle-state-' + value
        );
      }
    }
  );

  window.DD_STATUS_BATTLE_FLOW =
    Object.freeze({
      version: VERSION,
      owner: OWNER,
      install,
      orderedParticipants,
      registerParticipants,
      beginTurn,
      endTurn,
      resetTurn,
      health
    });

  install();
})();
Library
/
dd-status-battle-flow-v1.1.0-full.txt


// assets/js/dd-status-battle-flow.js
// Phase 4.4.5: live status-turn coordinator with explicit side ownership and correct turn phases.
(function () {
  'use strict';

  if (!location.pathname.includes('databyte-discovery')) return;
  if (window.DD_STATUS_BATTLE_FLOW) return;

  const VERSION = '1.1.0';
  const OWNER = 'dd-status-battle-flow';

  let installed = false;
  let originalResolve = null;
  const actionSides = new Set();
  const participantsBySide = new Map();

  function resolver() {
    return window.DD_BATTLE_RESOLVER || null;
  }

  function battleState() {
    return window.DD_BATTLE_STATE_RUNTIME || null;
  }

  function sideForMode(mode) {
    return mode === 'enemy' ? 'wild' : 'player';
  }

  function opposite(side) {
    return side === 'wild' ? 'player' : 'wild';
  }

  function dispatch(name, detail) {
    document.dispatchEvent(new CustomEvent(name, {
      detail: Object.assign({
        owner: OWNER,
        version: VERSION,
        at: new Date().toISOString()
      }, detail || {})
    }));
  }

  function orderedParticipants() {
    const values = [];
    const sides = [];

    if (participantsBySide.has('player')) {
      values.push(participantsBySide.get('player'));
      sides.push('player');
    }

    if (participantsBySide.has('wild')) {
      values.push(participantsBySide.get('wild'));
      sides.push('wild');
    }

    return { values, sides };
  }

  function registerParticipants(actor, target, actorSide, targetSide) {
    if (actor && actorSide) participantsBySide.set(actorSide, actor);
    if (target && targetSide) participantsBySide.set(targetSide, target);
    return orderedParticipants();
  }

  function resetTurn(reason) {
    actionSides.clear();
    participantsBySide.clear();
    dispatch('dd:status-battle-turn-reset', {
      reason: reason || 'reset'
    });
  }

  function beginTurn(context) {
    const state = battleState();

    if (!state || typeof state.beginTurn !== 'function') {
      return {
        ok: false,
        skipped: true,
        reason: 'begin-turn-unavailable'
      };
    }

    const ordered = orderedParticipants();

    if (ordered.values.length < 2) {
      return {
        ok: false,
        skipped: true,
        reason: 'participants-incomplete',
        participantSides: ordered.sides
      };
    }

    const result = state.beginTurn(ordered.values, {
      source: OWNER,
      participantSides: ordered.sides,
      encounterId:
        state.snapshot &&
        state.snapshot().encounterId ||
        null,
      context: context || {}
    });

    dispatch('dd:status-battle-turn-started', {
      result,
      participantSides: ordered.sides
    });

    return result;
  }

  function endTurn(context) {
    const state = battleState();

    if (!state || typeof state.endTurn !== 'function') {
      return {
        ok: false,
        skipped: true,
        reason: 'end-turn-unavailable'
      };
    }

    const ordered = orderedParticipants();

    const result = state.endTurn(ordered.values, {
      source: OWNER,
      completedSides: Array.from(actionSides),
      participantSides: ordered.sides,
      encounterId:
        state.snapshot &&
        state.snapshot().encounterId ||
        null,
      context: context || {}
    });

    dispatch('dd:status-battle-turn-complete', {
      result,
      participantSides: ordered.sides
    });

    resetTurn('turn-complete');
    return result;
  }

  function terminalBlockedResult(user, move, startResult) {
    return {
      hit: false,
      miss: false,
      actionBlocked: true,
      actionGate: {
        allowed: false,
        blocked: true,
        reason: 'status-terminal'
      },
      blockedByConfiguration: false,
      type: {
        label: 'blocked',
        multiplier: 0,
        captureBonus: 0
      },
      move: move || null,
      hpDamage: 0,
      signalDamage: 0,
      capturePressure: 0,
      statusApplication: null,
      terminal:
        startResult &&
        startResult.terminal ||
        null,
      notes: [
        (user && user.name || 'Sprite') +
        ' could not act because the battle ended during the start phase.'
      ]
    };
  }

  function prepareAction(user, target, options) {
    const mode = options && options.mode || 'player';
    const actorSide = sideForMode(mode);
    const targetSide = opposite(actorSide);

    registerParticipants(
      user,
      target,
      actorSide,
      targetSide
    );

    let startResult = null;

    if (actionSides.size === 0) {
      startResult = beginTurn({
        mode,
        actorSide,
        targetSide
      });
    }

    return {
      mode,
      actorSide,
      targetSide,
      startResult
    };
  }

  function applyResolution(result, user, target, action) {
    const state = battleState();

    if (state && typeof state.applyResolution === 'function') {
      state.applyResolution(result, user, target, {
        actorSide: action.actorSide,
        targetSide: action.targetSide,
        source: OWNER
      });
    }

    actionSides.add(action.actorSide);

    if (
      actionSides.has('player') &&
      actionSides.has('wild')
    ) {
      endTurn({
        mode: action.mode,
        moveId:
          result &&
          result.move &&
          result.move.id ||
          null
      });
    }

    return result;
  }

  function install() {
    const activeResolver = resolver();

    if (!activeResolver || typeof activeResolver.resolve !== 'function') {
      return false;
    }

    if (
      installed &&
      activeResolver.resolve.__ddStatusBattleFlow
    ) {
      return true;
    }

    originalResolve =
      activeResolver.resolve.bind(activeResolver);

    function wrappedResolve(user, move, target, options) {
      const action = prepareAction(
        user,
        target,
        options || {}
      );

      if (
        action.startResult &&
        (
          action.startResult.terminal ||
          (
            action.startResult.state &&
            action.startResult.state.terminalProcessed
          )
        )
      ) {
        return terminalBlockedResult(
          user,
          move,
          action.startResult
        );
      }

      const state = battleState();
      const turn =
        state &&
        state.snapshot &&
        state.snapshot().turn ||
        0;

      const result = originalResolve(
        user,
        move,
        target,
        Object.assign({}, options || {}, {
          turn
        })
      );

      return applyResolution(
        result,
        user,
        target,
        action
      );
    }

    wrappedResolve.__ddStatusBattleFlow = true;
    activeResolver.resolve = wrappedResolve;
    installed = true;

    dispatch(
      'dd:status-battle-flow-ready',
      health()
    );

    return true;
  }

  function health() {
    const ordered = orderedParticipants();

    return {
      owner: OWNER,
      version: VERSION,
      installed,
      resolverAvailable: !!resolver(),
      battleStateAvailable: !!battleState(),
      statusRuntimeAvailable:
        !!window.DD_STATUS_RUNTIME,
      pendingSides:
        Array.from(actionSides),
      registeredSides:
        ordered.sides,
      turnPhases: {
        startBeforeActions: true,
        endAfterBothActions: true
      }
    };
  }

  document.addEventListener(
    'dd:battle-resolver-ready',
    install
  );

  document.addEventListener(
    'dd:battle-state-runtime-ready',
    install
  );

  document.addEventListener(
    'dd:status-runtime-ready',
    install
  );

  document.addEventListener(
    'dd:battle-state-change',
    function (event) {
      const value =
        event &&
        event.detail &&
        event.detail.value;

      if (value !== 'active') {
        resetTurn(
          'battle-state-' + value
        );
      }
    }
  );

  window.DD_STATUS_BATTLE_FLOW =
    Object.freeze({
      version: VERSION,
      owner: OWNER,
      install,
      orderedParticipants,
      registerParticipants,
      beginTurn,
      endTurn,
      resetTurn,
      health
    });

  install();
})();
