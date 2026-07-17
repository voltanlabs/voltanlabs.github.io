// assets/js/dd-status-battle-flow.js
// Phase 4.7.2: passive status-flow compatibility surface.
//
// IMPORTANT OWNERSHIP RULE:
// - DD_BATTLE_RESOLVER owns calculations only.
// - DD_BATTLE_STATE_RUNTIME owns turn phases, state mutation, status ticking,
//   faint handling, and terminal decisions.
// - databyte-discovery-product-app-v4-shell owns orchestration and calls
//   beginTurn -> resolve -> applyResolution -> endTurn exactly once.
//
// This module MUST NOT replace, wrap, monkey-patch, or decorate
// DD_BATTLE_RESOLVER.resolve. The previous 1.1.0 implementation did so and
// caused duplicate beginTurn/applyResolution/endTurn execution.
(function () {
  'use strict';

  if (!location.pathname.includes('databyte-discovery')) return;
  if (window.DD_STATUS_BATTLE_FLOW) return;

  const VERSION = '1.2.0';
  const OWNER = 'dd-status-battle-flow';

  let installed = false;
  let readyAt = null;
  let lastBattleState = null;
  let lastResolution = null;
  let lastStatusPhase = null;

  function resolver() {
    return window.DD_BATTLE_RESOLVER || null;
  }

  function battleState() {
    return window.DD_BATTLE_STATE_RUNTIME || null;
  }

  function statusRuntime() {
    return window.DD_STATUS_RUNTIME || null;
  }

  function safeDispatch(name, detail) {
    try {
      document.dispatchEvent(new CustomEvent(name, {
        detail: Object.assign({
          owner: OWNER,
          version: VERSION,
          at: new Date().toISOString()
        }, detail || {})
      }));
      return true;
    } catch (error) {
      try {
        console.error('[' + OWNER + '] event dispatch failed:', name, error);
      } catch (_) {}
      return false;
    }
  }

  function resolverIsWrapped() {
    const activeResolver = resolver();
    return !!(
      activeResolver &&
      activeResolver.resolve &&
      activeResolver.resolve.__ddStatusBattleFlow
    );
  }

  function install() {
    // Deliberately passive. The canonical v4 shell already owns turn
    // orchestration and Battle State Runtime owns all state application.
    installed = true;
    readyAt = readyAt || new Date().toISOString();

    const result = health();

    safeDispatch('dd:status-battle-flow-ready', result);

    if (result.legacyResolverWrapperDetected) {
      safeDispatch('dd:status-battle-flow-warning', {
        reason: 'legacy-resolver-wrapper-detected',
        message:
          'Reload after replacing dd-status-battle-flow.js. ' +
          'The resolver must remain calculation-only.'
      });
    }

    return true;
  }

  function resetTurn(reason) {
    // Compatibility no-op. Turn bookkeeping belongs to the v4 shell and
    // DD_BATTLE_STATE_RUNTIME.
    const result = {
      ok: true,
      skipped: true,
      reason: reason || 'canonical-shell-owned',
      owner: OWNER
    };

    safeDispatch('dd:status-battle-turn-reset', result);
    return result;
  }

  function registerParticipants(actor, target, actorSide, targetSide) {
    // Compatibility diagnostic only. Do not retain mutable turn state here.
    return {
      values: [actor, target].filter(Boolean),
      sides: [actorSide, targetSide].filter(Boolean),
      passive: true
    };
  }

  function orderedParticipants() {
    // This module no longer stores participants between actions.
    return {
      values: [],
      sides: [],
      passive: true
    };
  }

  function beginTurn() {
    return {
      ok: true,
      skipped: true,
      reason: 'canonical-shell-owned',
      owner: OWNER
    };
  }

  function endTurn() {
    return {
      ok: true,
      skipped: true,
      reason: 'canonical-shell-owned',
      owner: OWNER
    };
  }

  function health() {
    return {
      owner: OWNER,
      version: VERSION,
      installed,
      readyAt,
      mode: 'passive-compatibility',
      resolverAvailable: !!resolver(),
      battleStateAvailable: !!battleState(),
      statusRuntimeAvailable: !!statusRuntime(),
      legacyResolverWrapperDetected: resolverIsWrapped(),
      ownership: {
        resolver: 'calculations-only',
        battleState: 'state-and-status-owner',
        shell: 'turn-orchestration-owner',
        statusBattleFlow: 'passive-diagnostics-only'
      },
      mutatesResolver: false,
      appliesResolution: false,
      startsTurns: false,
      endsTurns: false,
      lastBattleState,
      lastResolution,
      lastStatusPhase
    };
  }

  document.addEventListener('dd:battle-state-change', function (event) {
    lastBattleState = event && event.detail
      ? {
          value: event.detail.value || null,
          turn: event.detail.turn || 0,
          reason: event.detail.reason || null,
          at: event.detail.at || new Date().toISOString()
        }
      : null;
  });

  document.addEventListener('dd:battle-resolution-applied', function (event) {
    const detail = event && event.detail || {};
    lastResolution = {
      ok: detail.ok !== false,
      actionBlocked: !!detail.actionBlocked,
      decision:
        detail.decision &&
        detail.decision.decision ||
        null,
      at: detail.at || new Date().toISOString()
    };
  });

  document.addEventListener('dd:battle-status-phase-ticked', function (event) {
    const detail = event && event.detail || {};
    lastStatusPhase = {
      phase: detail.phase || null,
      terminal: !!detail.terminal,
      at: detail.at || new Date().toISOString()
    };
  });

  document.addEventListener('dd:battle-resolver-ready', install);
  document.addEventListener('dd:battle-state-runtime-ready', install);
  document.addEventListener('dd:status-runtime-ready', install);

  window.DD_STATUS_BATTLE_FLOW = Object.freeze({
    version: VERSION,
    owner: OWNER,
    mode: 'passive-compatibility',
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
