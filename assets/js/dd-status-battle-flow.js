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
