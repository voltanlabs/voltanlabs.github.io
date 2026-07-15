// assets/js/dd-status-battle-flow.js
// Phase 4.4.4: live bridge between battle resolution, battle state, and canonical status runtime.
(function () {
  'use strict';

  if (!location.pathname.includes('databyte-discovery')) return;
  if (window.DD_STATUS_BATTLE_FLOW) return;

  const VERSION = '1.0.0';
  const OWNER = 'dd-status-battle-flow';
  let installed = false;
  let originalResolve = null;
  let actionSides = new Set();
  let participants = new Map();

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

  function participantKey(value, fallback) {
    return String(
      value && (value.id || value.name) ||
      fallback
    );
  }

  function dispatch(name, detail) {
    document.dispatchEvent(
      new CustomEvent(name, {
        detail: Object.assign({
          owner: OWNER,
          version: VERSION,
          at: new Date().toISOString()
        }, detail || {})
      })
    );
  }

  function resetTurn(reason) {
    actionSides.clear();
    participants.clear();
    dispatch('dd:status-battle-turn-reset', {
      reason: reason || 'reset'
    });
  }

  function tickWhenComplete(context) {
    const state = battleState();
    if (!state || typeof state.tickTurn !== 'function') return null;
    if (!actionSides.has('player') || !actionSides.has('wild')) return null;

    const values = Array.from(participants.values());
    const result = state.tickTurn(values, {
      source: OWNER,
      completedSides: Array.from(actionSides),
      encounterId:
        state.snapshot && state.snapshot().encounterId || null,
      context: context || {}
    });

    resetTurn('turn-complete');
    dispatch('dd:status-battle-turn-complete', {
      result: result
    });
    return result;
  }

  function applyResolution(result, user, target, options) {
    const state = battleState();
    const mode = options && options.mode || 'player';
    const actorSide = sideForMode(mode);
    const targetSide = opposite(actorSide);

    if (state && typeof state.applyResolution === 'function') {
      state.applyResolution(result, user, target, {
        actorSide: actorSide,
        targetSide: targetSide,
        source: OWNER
      });
    }

    actionSides.add(actorSide);
    participants.set(
      participantKey(user, actorSide),
      user
    );
    participants.set(
      participantKey(target, targetSide),
      target
    );

    tickWhenComplete({
      mode: mode,
      moveId: result && result.move && result.move.id || null
    });

    return result;
  }

  function install() {
    const activeResolver = resolver();
    if (!activeResolver || typeof activeResolver.resolve !== 'function') {
      return false;
    }

    if (installed && activeResolver.resolve.__ddStatusBattleFlow) {
      return true;
    }

    originalResolve = activeResolver.resolve.bind(activeResolver);

    function wrappedResolve(user, move, target, options) {
      const result = originalResolve(user, move, target, options || {});
      return applyResolution(result, user, target, options || {});
    }

    wrappedResolve.__ddStatusBattleFlow = true;
    activeResolver.resolve = wrappedResolve;
    installed = true;

    dispatch('dd:status-battle-flow-ready', health());
    return true;
  }

  function health() {
    return {
      owner: OWNER,
      version: VERSION,
      installed: installed,
      resolverAvailable: !!resolver(),
      battleStateAvailable: !!battleState(),
      statusRuntimeAvailable: !!window.DD_STATUS_RUNTIME,
      pendingSides: Array.from(actionSides)
    };
  }

  document.addEventListener('dd:battle-resolver-ready', install);
  document.addEventListener('dd:battle-state-runtime-ready', install);
  document.addEventListener('dd:status-runtime-ready', install);

  document.addEventListener('dd:battle-state-change', function (event) {
    const value = event && event.detail && event.detail.value;
    if (value !== 'active') resetTurn('battle-state-' + value);
  });

  window.DD_STATUS_BATTLE_FLOW = Object.freeze({
    version: VERSION,
    owner: OWNER,
    install: install,
    resetTurn: resetTurn,
    health: health
  });

  install();
})();
