// assets/js/dd-battle-state-runtime.js
// Phase 3.8.4: single owner for encounter battle terminal-state transitions.
(function () {
  const STATES = Object.freeze({ idle: 'idle', active: 'active', victory: 'victory', defeat: 'defeat', escaped: 'escaped', result: 'result' });
  let state = { value: STATES.idle, encounterId: null, terminalProcessed: false, reason: null, updatedAt: new Date().toISOString() };

  function snapshot() { return Object.assign({}, state); }
  function emit() { document.dispatchEvent(new CustomEvent('dd:battle-state-change', { detail: snapshot() })); }
  function set(next, reason) {
    state.value = next || STATES.idle;
    state.reason = reason || null;
    state.updatedAt = new Date().toISOString();
    if (state.value === STATES.active || state.value === STATES.idle) state.terminalProcessed = false;
    emit();
    return snapshot();
  }
  function start(encounterId) {
    state.encounterId = encounterId || ('enc-' + Date.now());
    state.terminalProcessed = false;
    return set(STATES.active, 'battle-start');
  }
  function reset(reason) {
    state = { value: STATES.idle, encounterId: null, terminalProcessed: false, reason: reason || null, updatedAt: new Date().toISOString() };
    emit();
    return snapshot();
  }
  function isActive() { return state.value === STATES.active; }
  function isTerminal() { return [STATES.victory, STATES.defeat, STATES.escaped, STATES.result].includes(state.value); }
  function canAct() { return isActive() && !state.terminalProcessed; }
  function processTerminal(next, reason, handler) {
    if (state.terminalProcessed) return { ok: false, alreadyProcessed: true, state: snapshot() };
    state.terminalProcessed = true;
    set(next, reason || next);
    let value;
    if (typeof handler === 'function') value = handler(snapshot());
    return { ok: true, alreadyProcessed: false, state: snapshot(), value };
  }
  function victory(reason, handler) { return processTerminal(STATES.victory, reason || 'wild-defeated', handler); }
  function defeat(reason, handler) { return processTerminal(STATES.defeat, reason || 'party-defeated', handler); }
  function escaped(reason, handler) { return processTerminal(STATES.escaped, reason || 'signal-lost', handler); }

  window.DD_BATTLE_STATE_RUNTIME = { version: '0.1.0', phase: '3.8.4-battle-state-runtime', STATES, snapshot, set, start, reset, isActive, isTerminal, canAct, victory, defeat, escaped };
  document.dispatchEvent(new CustomEvent('dd:battle-state-runtime-ready', { detail: window.DD_BATTLE_STATE_RUNTIME }));
})();
