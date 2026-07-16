// assets/js/studio-runtime-bridge-checks.js
// Phase 4.5.1: runtime ownership verification and battle lifecycle diagnostics.
(function () {
  'use strict';

  if (!location.pathname.includes('databyte-discovery')) return;
  if (window.DD_RUNTIME_DIAGNOSTICS) return;

  const VERSION = '1.0.0';
  const OWNER = 'studio-runtime-bridge-checks';
  const MAX_TRACE = 120;
  const PANEL_ID = 'ddRuntimeDiagnosticsPanel';
  const TRACE_KEY = 'vl_dd_runtime_trace_v1';

  const trace = [];
  let sequence = 0;
  let lastError = null;

  const checks = [
    { id: 'canon-roster', label: 'Canon Roster', test: () => Array.isArray(window.DD_CANON_ROSTER) && window.DD_CANON_ROSTER.length > 0 },
    { id: 'studio-data-bridge', label: 'Studio Data Bridge', test: () => !!window.DD_STUDIO_DATA_BRIDGE },
    { id: 'status-runtime', label: 'Status Runtime', test: () => !!window.DD_STATUS_RUNTIME && typeof window.DD_STATUS_RUNTIME.tick === 'function' && typeof window.DD_STATUS_RUNTIME.actionGate === 'function' },
    { id: 'battle-engine', label: 'Battle Engine', test: () => !!window.DDBattle24 && typeof window.DDBattle24.typeResult === 'function' },
    { id: 'gameplay-rules', label: 'Gameplay Rules', test: () => !!window.DD_GAMEPLAY_RULES },
    { id: 'capture-runtime', label: 'Capture Runtime', test: () => !!window.DD_CAPTURE_RUNTIME && typeof window.DD_CAPTURE_RUNTIME.attempt === 'function' },
    { id: 'encounter-runtime', label: 'Encounter Runtime', test: () => !!window.DD_ENCOUNTER_RUNTIME && typeof window.DD_ENCOUNTER_RUNTIME.create === 'function' },
    { id: 'battle-balance', label: 'Battle Balance', test: () => !!window.DD_BATTLE_BALANCE },
    { id: 'battle-resolver', label: 'Battle Resolver', test: () => !!window.DD_BATTLE_RESOLVER && typeof window.DD_BATTLE_RESOLVER.resolve === 'function' },
    { id: 'battle-state-runtime', label: 'Battle State Runtime', test: () => !!window.DD_BATTLE_STATE_RUNTIME && typeof window.DD_BATTLE_STATE_RUNTIME.snapshot === 'function' },
    { id: 'status-battle-flow', label: 'Status Battle Flow', test: () => !!window.DD_STATUS_BATTLE_FLOW && typeof window.DD_STATUS_BATTLE_FLOW.health === 'function' },
    { id: 'battle-reward-runtime', label: 'Battle Reward Runtime', test: () => !!window.DD_BATTLE_REWARD_RUNTIME && typeof window.DD_BATTLE_REWARD_RUNTIME.award === 'function' },
    { id: 'battle-reward-presentation', label: 'Battle Reward Presentation', test: () => !!window.DD_BATTLE_REWARD_PRESENTATION },
    { id: 'battle-presentation', label: 'Battle Presentation Runtime', test: () => !!window.DD_BATTLE_PRESENTATION_RUNTIME },
    { id: 'collection-runtime', label: 'Collection Runtime', test: () => !!window.DD_COLLECTION_RUNTIME },
    { id: 'party-runtime', label: 'Party Runtime', test: () => !!window.DD_PARTY_RUNTIME },
    { id: 'inventory-runtime', label: 'Inventory Runtime', test: () => !!window.DD_INVENTORY_RUNTIME },
    { id: 'dex-runtime', label: 'Dex Runtime', test: () => !!window.DD_DEX_RUNTIME },
    { id: 'battle-screen', label: 'Battle Screen Owner', test: () => !!window.DD_BATTLE_SCREEN },
    { id: 'battle-controls', label: 'Battle Controls Owner', test: () => !!window.DD_BATTLE_CONTROLS },
    { id: 'app-shell', label: 'v4 App Shell', test: () => !!window.DD_PRODUCT_APP_V4_SHELL && !!document.getElementById('ddApp') }
  ];

  function safeClone(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch {
      return String(value);
    }
  }

  function summarize(detail) {
    detail = detail || {};
    const state = detail.state || {};
    const result = detail.result || {};
    const move = detail.move || result.move || {};
    return {
      owner: detail.owner || null,
      version: detail.version || null,
      encounterId:
        detail.encounterId ||
        state.encounterId ||
        result.encounterId ||
        null,
      state:
        detail.value ||
        state.value ||
        result.value ||
        null,
      turn:
        detail.turn ||
        state.turn ||
        result.turn ||
        null,
      moveId:
        move.id ||
        detail.moveId ||
        null,
      phase:
        detail.phase ||
        result.phase ||
        null,
      reason:
        detail.reason ||
        result.reason ||
        null,
      actionBlocked:
        detail.actionBlocked === true ||
        result.actionBlocked === true,
      terminal:
        !!(
          detail.terminal ||
          result.terminal ||
          state.terminalProcessed
        )
    };
  }

  function persist() {
    try {
      sessionStorage.setItem(
        TRACE_KEY,
        JSON.stringify({
          version: VERSION,
          owner: OWNER,
          lastError,
          trace
        })
      );
    } catch {}
  }

  function record(type, detail) {
    const entry = {
      sequence: ++sequence,
      type,
      at: new Date().toISOString(),
      summary: summarize(detail)
    };

    trace.push(entry);
    while (trace.length > MAX_TRACE) trace.shift();
    persist();
    updatePanel();
    return entry;
  }

  function runChecks() {
    const results = checks.map(check => {
      let ok = false;
      let error = null;

      try {
        ok = !!check.test();
      } catch (caught) {
        error = String(
          caught && caught.message ||
          caught
        );
      }

      return {
        id: check.id,
        label: check.label,
        ok,
        error
      };
    });

    const statusFlow =
      window.DD_STATUS_BATTLE_FLOW &&
      typeof window.DD_STATUS_BATTLE_FLOW.health === 'function'
        ? safeClone(window.DD_STATUS_BATTLE_FLOW.health())
        : null;

    const battleState =
      window.DD_BATTLE_STATE_RUNTIME &&
      typeof window.DD_BATTLE_STATE_RUNTIME.snapshot === 'function'
        ? safeClone(window.DD_BATTLE_STATE_RUNTIME.snapshot())
        : null;

    window.DD_RUNTIME_HEALTH = {
      version: VERSION,
      phase: '4.5.1-battle-lifecycle-diagnostics',
      runtime: 'databyte-discovery-product-app-v4-shell',
      canonicalOwners: {
        app: 'databyte-discovery-product-app-v4-shell',
        battleMath: 'dd-battle-resolver',
        battleState: 'dd-battle-state-runtime',
        status: 'dd-status-runtime',
        statusFlow: 'dd-status-battle-flow',
        rewards: 'dd-battle-reward-runtime',
        rewardPresentation: 'dd-battle-reward-presentation',
        battlePresentation: 'dd-battle-presentation-runtime'
      },
      checkedAt: new Date().toISOString(),
      results,
      passCount: results.filter(result => result.ok).length,
      failCount: results.filter(result => !result.ok).length,
      ready: results.every(result => result.ok),
      battleState,
      statusFlow,
      lastTrace: trace[trace.length - 1] || null,
      lastError
    };

    window.DBS_RUNTIME_HEALTH =
      window.DD_RUNTIME_HEALTH;

    document.dispatchEvent(
      new CustomEvent('runtime:health-check', {
        detail: window.DD_RUNTIME_HEALTH
      })
    );

    updatePanel();
    return window.DD_RUNTIME_HEALTH;
  }

  function panel() {
    let element =
      document.getElementById(PANEL_ID);

    if (element) return element;

    element =
      document.createElement('aside');
    element.id = PANEL_ID;
    element.hidden = true;
    element.style.cssText = [
      'position:fixed',
      'left:10px',
      'right:10px',
      'bottom:10px',
      'z-index:1000010',
      'max-height:44vh',
      'overflow:auto',
      'padding:12px',
      'border:1px solid rgba(251,113,133,.7)',
      'border-radius:16px',
      'background:rgba(2,6,23,.96)',
      'color:#f8fafc',
      'font:12px/1.4 ui-monospace,SFMono-Regular,Consolas,monospace',
      'box-shadow:0 18px 45px rgba(0,0,0,.45)'
    ].join(';');

    document.body.appendChild(element);
    return element;
  }

  function updatePanel() {
    const element = panel();
    if (!lastError) {
      element.hidden = true;
      return;
    }

    const last = trace
      .slice(-8)
      .map(entry =>
        '#' +
        entry.sequence +
        ' ' +
        entry.type +
        ' ' +
        JSON.stringify(entry.summary)
      )
      .join('\n');

    element.hidden = false;
    element.textContent =
      'DATA DISCOVERY RUNTIME ERROR\n\n' +
      lastError.message +
      (
        lastError.source
          ? '\n' + lastError.source
          : ''
      ) +
      (
        lastError.stack
          ? '\n\n' + lastError.stack
          : ''
      ) +
      '\n\nLAST COMPLETED EVENTS\n' +
      (last || 'No battle lifecycle events recorded.');
  }

  function captureError(message, source, stack) {
    lastError = {
      message: String(message || 'Unknown runtime error'),
      source: source || null,
      stack: stack || null,
      at: new Date().toISOString(),
      lastTrace: trace[trace.length - 1] || null
    };

    record('runtime:error', lastError);
    runChecks();
  }

  window.addEventListener('error', event => {
    captureError(
      event.message,
      event.filename
        ? event.filename +
          ':' +
          event.lineno +
          ':' +
          event.colno
        : null,
      event.error &&
      event.error.stack ||
      null
    );
  });

  window.addEventListener(
    'unhandledrejection',
    event => {
      const reason = event.reason;
      captureError(
        reason &&
        reason.message ||
        String(reason || 'Unhandled promise rejection'),
        'unhandledrejection',
        reason &&
        reason.stack ||
        null
      );
    }
  );

  [
    'dd:battle-state-change',
    'dd:battle-context-ready',
    'dd:battle-context-updated',
    'dd:status-battle-turn-started',
    'dd:battle-resolution-applied',
    'dd:status-battle-turn-complete',
    'dd:status-battle-turn-reset',
    'dd:battle-status-phase-ticked',
    'dd:battle-status-terminal',
    'dd:battle-terminal',
    'dd:battle-reward-awarded',
    'dd:battle-reward-duplicate',
    'dd:battle-reward-presented',
    'dd:presentation-event'
  ].forEach(eventName => {
    document.addEventListener(
      eventName,
      event => {
        record(
          eventName,
          event && event.detail || {}
        );
      }
    );
  });

  [
    'dd:battle:turn',
    'dd:battle:hit',
    'dd:battle:warn',
    'dd:battle:success'
  ].forEach(eventName => {
    window.addEventListener(
      eventName,
      event => {
        record(
          eventName,
          event && event.detail || {}
        );
      }
    );
  });

  window.DD_RUNTIME_DIAGNOSTICS =
    Object.freeze({
      version: VERSION,
      owner: OWNER,
      runChecks,
      record,
      getTrace: () => trace.slice(),
      getLastError: () =>
        lastError
          ? safeClone(lastError)
          : null,
      clear() {
        trace.length = 0;
        sequence = 0;
        lastError = null;
        persist();
        updatePanel();
      }
    });

  window.DBS_RUN_HEALTH_CHECKS = runChecks;
  window.DD_RUN_HEALTH_CHECKS = runChecks;
  window.DD_GET_BATTLE_TRACE =
    () => trace.slice();

  record('runtime:diagnostics-ready', {
    owner: OWNER,
    version: VERSION
  });

  setTimeout(runChecks, 300);
})();
