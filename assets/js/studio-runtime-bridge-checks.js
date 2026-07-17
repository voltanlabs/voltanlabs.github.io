// assets/js/studio-runtime-bridge-checks.js
// Phase 4.7.1: lightweight runtime ownership verification and throttled battle lifecycle diagnostics.
(function () {
  'use strict';

  if (!location.pathname.includes('databyte-discovery')) return;
  if (window.DD_RUNTIME_DIAGNOSTICS) return;

  const VERSION = '1.2.0';
  const OWNER = 'studio-runtime-bridge-checks';
  const MAX_TRACE = 80;
  const PANEL_ID = 'ddRuntimeDiagnosticsPanel';
  const TRACE_KEY = 'vl_dd_runtime_trace_v2';
  const PERSIST_DELAY = 600;
  const CHECK_DELAY = 180;

  const trace = [];
  let sequence = 0;
  let lastError = null;
  let persistTimer = null;
  let checksTimer = null;
  let panelTimer = null;
  let lastHealth = null;

  const checks = [
    { id: 'canon-roster', label: 'Canon Roster', test: () => Array.isArray(window.DD_CANON_ROSTER) && window.DD_CANON_ROSTER.length > 0 },
    { id: 'studio-data-bridge', label: 'Studio Data Bridge', test: () => !!window.DD_STUDIO_DATA_BRIDGE },
    { id: 'status-runtime', label: 'Status Runtime', test: () => !!window.DD_STATUS_RUNTIME && typeof window.DD_STATUS_RUNTIME.tick === 'function' && typeof window.DD_STATUS_RUNTIME.actionGate === 'function' },
    { id: 'battle-engine', label: 'Battle Engine', test: () => !!window.DDBattle24 && typeof window.DDBattle24.typeResult === 'function' },
    { id: 'gameplay-rules', label: 'Gameplay Rules', test: () => !!window.DD_GAMEPLAY_RULES },
    { id: 'capture-runtime', label: 'Capture Runtime', test: () => !!window.DD_CAPTURE_RUNTIME && typeof window.DD_CAPTURE_RUNTIME.attempt === 'function' && typeof window.DD_CAPTURE_RUNTIME.odds === 'function' },
    { id: 'encounter-runtime', label: 'Encounter Runtime', test: () => !!window.DD_ENCOUNTER_RUNTIME && typeof window.DD_ENCOUNTER_RUNTIME.create === 'function' && typeof window.DD_ENCOUNTER_RUNTIME.randomCode === 'function' },
    { id: 'battle-balance', label: 'Battle Balance', test: () => !!window.DD_BATTLE_BALANCE },
    { id: 'battle-resolver', label: 'Battle Resolver', test: () => !!window.DD_BATTLE_RESOLVER && typeof window.DD_BATTLE_RESOLVER.resolve === 'function' && typeof window.DD_BATTLE_RESOLVER.turnOrder === 'function' && typeof window.DD_BATTLE_RESOLVER.chooseEnemyMove === 'function' },
    { id: 'battle-state-runtime', label: 'Battle State Runtime', test: () => !!window.DD_BATTLE_STATE_RUNTIME && typeof window.DD_BATTLE_STATE_RUNTIME.snapshot === 'function' && typeof window.DD_BATTLE_STATE_RUNTIME.applyResolution === 'function' },
    { id: 'battle-reward-runtime', label: 'Battle Reward Runtime', test: () => !!window.DD_BATTLE_REWARD_RUNTIME && typeof window.DD_BATTLE_REWARD_RUNTIME.award === 'function' },
    { id: 'battle-reward-presentation', label: 'Battle Reward Presentation', test: () => !!window.DD_BATTLE_REWARD_PRESENTATION },
    { id: 'battle-presentation', label: 'Battle Presentation Runtime', test: () => !!window.DD_BATTLE_PRESENTATION_RUNTIME },
    { id: 'collection-runtime', label: 'Collection Runtime', test: () => !!window.DD_COLLECTION_RUNTIME && typeof window.DD_COLLECTION_RUNTIME.all === 'function' && typeof window.DD_COLLECTION_RUNTIME.add === 'function' },
    { id: 'party-runtime', label: 'Party Runtime', test: () => !!window.DD_PARTY_RUNTIME && typeof window.DD_PARTY_RUNTIME.lead === 'function' && typeof window.DD_PARTY_RUNTIME.members === 'function' },
    { id: 'inventory-runtime', label: 'Inventory Runtime', test: () => !!window.DD_INVENTORY_RUNTIME && typeof window.DD_INVENTORY_RUNTIME.read === 'function' && typeof window.DD_INVENTORY_RUNTIME.spend === 'function' },
    { id: 'dex-runtime', label: 'Dex Runtime', test: () => !!window.DD_DEX_RUNTIME && typeof window.DD_DEX_RUNTIME.stats === 'function' && typeof window.DD_DEX_RUNTIME.records === 'function' },
    { id: 'battle-screen', label: 'Battle Screen Owner', test: () => !!window.DD_BATTLE_SCREEN },
    { id: 'battle-controls', label: 'Battle Controls Owner', test: () => !!window.DD_BATTLE_CONTROLS },
    { id: 'collection-dex-bridge', label: 'Collection/Dex Bridge', test: () => !!window.DD_COLLECTION_DEX_BRIDGE },
    { id: 'local-storage', label: 'Local Storage', test: () => typeof localStorage !== 'undefined' },
    { id: 'app-shell', label: 'v4 App Shell', test: () => !!window.DD_PRODUCT_APP_V4_SHELL && !!document.getElementById('ddApp') }
  ];

  const observations = [
    { id: 'hp-ui', label: 'HP UI', test: () => !!document.querySelector('.ring.hp') || !!document.querySelector('.ring') || !!document.querySelector('.hpBar'), activeWhen: () => !!document.querySelector('.battle-card') },
    { id: 'signal-meter-ui', label: 'Signal Meter UI', test: () => !!document.querySelector('.signalBox') || !!document.querySelector('.signalMeter'), activeWhen: () => !!document.querySelector('.battle-card') }
  ];

  function safeClone(value) {
    try { return JSON.parse(JSON.stringify(value)); }
    catch { return String(value); }
  }

  function summarize(detail) {
    detail = detail || {};
    const state = detail.state || {};
    const result = detail.result || {};
    const move = detail.move || result.move || {};
    return {
      owner: detail.owner || null,
      version: detail.version || null,
      encounterId: detail.encounterId || state.encounterId || result.encounterId || null,
      state: detail.value || state.value || result.value || null,
      turn: detail.turn || state.turn || result.turn || null,
      moveId: move.id || detail.moveId || null,
      phase: detail.phase || result.phase || null,
      reason: detail.reason || result.reason || null,
      actionBlocked: detail.actionBlocked === true || result.actionBlocked === true,
      terminal: !!(detail.terminal || result.terminal || state.terminalProcessed)
    };
  }

  function persistNow() {
    persistTimer = null;
    try {
      sessionStorage.setItem(TRACE_KEY, JSON.stringify({ version: VERSION, owner: OWNER, lastError, trace }));
    } catch {}
  }

  function schedulePersist(immediate) {
    if (persistTimer) clearTimeout(persistTimer);
    persistTimer = null;
    if (immediate) return persistNow();
    persistTimer = setTimeout(persistNow, PERSIST_DELAY);
  }

  function schedulePanelUpdate(immediate) {
    if (!lastError) return;
    if (panelTimer) clearTimeout(panelTimer);
    panelTimer = null;
    if (immediate) return updatePanel();
    panelTimer = setTimeout(() => { panelTimer = null; updatePanel(); }, 120);
  }

  function record(type, detail, options) {
    const entry = { sequence: ++sequence, type, at: new Date().toISOString(), summary: summarize(detail) };
    trace.push(entry);
    while (trace.length > MAX_TRACE) trace.shift();
    const immediate = !!(options && options.immediate);
    schedulePersist(immediate);
    if (lastError) schedulePanelUpdate(immediate);
    return entry;
  }

  function evaluateChecks() {
    const results = checks.map(check => {
      let ok = false;
      let error = null;
      try { ok = !!check.test(); }
      catch (caught) { error = String(caught && caught.message || caught); }
      return { id: check.id, label: check.label, ok, error };
    });

    const observationResults = observations.map(check => {
      let active = false;
      let ok = true;
      let error = null;
      try {
        active = check.activeWhen ? !!check.activeWhen() : true;
        ok = !active || !!check.test();
      } catch (caught) {
        active = true;
        ok = false;
        error = String(caught && caught.message || caught);
      }
      return { id: check.id, label: check.label, active, ok, error, blocking: false };
    });

    return { results, observationResults };
  }

  function runChecks() {
    const evaluated = evaluateChecks();
    const results = evaluated.results;
    const observationResults = evaluated.observationResults;
    const battleState = window.DD_BATTLE_STATE_RUNTIME && typeof window.DD_BATTLE_STATE_RUNTIME.snapshot === 'function'
      ? safeClone(window.DD_BATTLE_STATE_RUNTIME.snapshot())
      : null;

    lastHealth = {
      version: VERSION,
      phase: '4.7.1-throttled-runtime-diagnostics',
      runtime: 'databyte-discovery-product-app-v4-shell',
      canonicalOwners: {
        app: 'databyte-discovery-product-app-v4-shell',
        battleMath: 'dd-battle-resolver',
        battleState: 'dd-battle-state-runtime',
        status: 'dd-status-runtime',
        rewards: 'dd-battle-reward-runtime',
        rewardPresentation: 'dd-battle-reward-presentation',
        battlePresentation: 'dd-battle-presentation-runtime'
      },
      checkedAt: new Date().toISOString(),
      results,
      observations: observationResults,
      passCount: results.filter(result => result.ok).length,
      failCount: results.filter(result => !result.ok).length,
      observationFailCount: observationResults.filter(result => result.active && !result.ok).length,
      ready: results.every(result => result.ok),
      battleState,
      lastTrace: trace[trace.length - 1] || null,
      lastError
    };

    window.DD_RUNTIME_HEALTH = lastHealth;
    window.DBS_RUNTIME_HEALTH = lastHealth;
    document.dispatchEvent(new CustomEvent('runtime:health-check', { detail: lastHealth }));
    renderHealthSummary(results, observationResults);
    if (lastError) updatePanel();
    return lastHealth;
  }

  function scheduleChecks(delay) {
    if (checksTimer) clearTimeout(checksTimer);
    checksTimer = setTimeout(() => { checksTimer = null; runChecks(); }, Number(delay == null ? CHECK_DELAY : delay));
  }

  function renderHealthSummary(results, observationResults) {
    const host = document.getElementById('runtimeHealthPanel');
    if (!host) return;
    let summary = document.getElementById('runtimeHealthChecks');
    if (!summary) {
      summary = document.createElement('div');
      summary.id = 'runtimeHealthChecks';
      summary.style.cssText = 'margin-top:8px;border-top:1px solid rgba(255,255,255,.1);padding-top:8px;display:grid;gap:3px';
      host.appendChild(summary);
    }
    const html = results.map(result => '<div>' + (result.ok ? '✅' : '⚠️') + ' ' + result.label + '</div>')
      .concat(observationResults.filter(result => result.active).map(result => '<div>' + (result.ok ? '✅' : '⚠️') + ' ' + result.label + ' <span style="opacity:.7">(screen observation)</span></div>'))
      .join('');
    if (summary.innerHTML !== html) summary.innerHTML = html;
  }

  function panel() {
    let element = document.getElementById(PANEL_ID);
    if (element) return element;
    element = document.createElement('aside');
    element.id = PANEL_ID;
    element.hidden = true;
    element.style.cssText = ['position:fixed','left:10px','right:10px','bottom:10px','z-index:1000010','max-height:44vh','overflow:auto','padding:12px','border:1px solid rgba(251,113,133,.7)','border-radius:16px','background:rgba(2,6,23,.96)','color:#f8fafc','font:12px/1.4 ui-monospace,SFMono-Regular,Consolas,monospace','box-shadow:0 18px 45px rgba(0,0,0,.45)'].join(';');
    document.body.appendChild(element);
    return element;
  }

  function updatePanel() {
    const element = panel();
    if (!lastError) {
      element.hidden = true;
      element.textContent = '';
      return;
    }
    const last = trace.slice(-8).map(entry => '#' + entry.sequence + ' ' + entry.type + ' ' + JSON.stringify(entry.summary)).join('\n');
    const text = 'DATA DISCOVERY RUNTIME ERROR\n\n' + lastError.message + (lastError.source ? '\n' + lastError.source : '') + (lastError.stack ? '\n\n' + lastError.stack : '') + '\n\nLAST COMPLETED EVENTS\n' + (last || 'No battle lifecycle events recorded.');
    element.hidden = false;
    if (element.textContent !== text) element.textContent = text;
  }

  function captureError(message, source, stack) {
    lastError = { message: String(message || 'Unknown runtime error'), source: source || null, stack: stack || null, at: new Date().toISOString(), lastTrace: trace[trace.length - 1] || null };
    record('runtime:error', lastError, { immediate: true });
    runChecks();
    updatePanel();
  }

  window.addEventListener('error', event => captureError(event.message, event.filename ? event.filename + ':' + event.lineno + ':' + event.colno : null, event.error && event.error.stack || null));
  window.addEventListener('unhandledrejection', event => {
    const reason = event.reason;
    captureError(reason && reason.message || String(reason || 'Unhandled promise rejection'), 'unhandledrejection', reason && reason.stack || null);
  });

  ['dd:battle-state-change','dd:battle-context-ready','dd:battle-context-updated','dd:battle-resolution-applied','dd:battle-status-phase-ticked','dd:battle-status-terminal','dd:battle-terminal','dd:battle-reward-awarded','dd:battle-reward-duplicate','dd:battle-reward-presented'].forEach(eventName => {
    document.addEventListener(eventName, event => record(eventName, event && event.detail || {}));
  });

  ['dd:battle:turn','dd:battle:hit','dd:battle:warn','dd:battle:success'].forEach(eventName => {
    window.addEventListener(eventName, event => record(eventName, event && event.detail || {}));
  });

  ['dd:studio-data-ready','dd:status-runtime-ready','dd:battle-engine-ready','dd:gameplay-rules-ready','dd:capture-runtime-ready','dd:encounter-runtime-ready','dd:battle-balance-ready','dd:battle-resolver-ready','dd:battle-state-runtime-ready','dd:battle-reward-runtime-ready','dd:battle-reward-presentation-ready','dd:battle-presentation-runtime-ready','dd:collection-runtime-ready','dd:party-runtime-ready','dd:inventory-runtime-ready','dd:dex-runtime-ready','dd:collection-dex-bridge-ready','dd:v4-shell-ready','runtime:ready','dd:screen'].forEach(eventName => {
    document.addEventListener(eventName, () => scheduleChecks());
  });

  window.DD_RUNTIME_DIAGNOSTICS = Object.freeze({
    version: VERSION,
    owner: OWNER,
    runChecks,
    scheduleChecks,
    record,
    getTrace: () => trace.slice(),
    getLastError: () => lastError ? safeClone(lastError) : null,
    getHealth: () => lastHealth ? safeClone(lastHealth) : null,
    clear() {
      trace.length = 0;
      sequence = 0;
      lastError = null;
      schedulePersist(true);
      updatePanel();
    }
  });

  window.DBS_RUN_HEALTH_CHECKS = runChecks;
  window.DD_RUN_HEALTH_CHECKS = runChecks;
  window.DD_GET_BATTLE_TRACE = () => trace.slice();

  record('runtime:diagnostics-ready', { owner: OWNER, version: VERSION });
  scheduleChecks(300);
})();
