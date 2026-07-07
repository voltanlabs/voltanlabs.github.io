// assets/js/dd-battle-state-runtime.js
// Phase 3.8.5: single owner for encounter battle terminal-state transitions and rewards.
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
  function applyWildDefeat(wild, tools) {
    if (!wild) return { ok: false, message: 'No wild signal.' };
    return victory('wild-defeated', function () {
      wild.hp = 0;
      if (tools && typeof tools.stabilizeSignal === 'function') tools.stabilizeSignal(wild, 1);
      if (tools && typeof tools.setOdds === 'function' && typeof tools.odds === 'function') tools.setOdds(wild, tools.odds(wild) + Number((tools.bonus == null ? 3 : tools.bonus)));
      return { wild, odds: tools && tools.odds ? tools.odds(wild) : null, message: wild.name + ' is defeated. Choose Capture or Return.' };
    });
  }
  function shouldBlockAction(wild) {
    if (!wild) return { block: true, reason: 'missing-wild' };
    if (Number(wild.hp || 0) <= 0) return { block: true, reason: 'wild-defeated' };
    if (!canAct()) return { block: true, reason: state.value };
    return { block: false, reason: null };
  }

  window.DD_BATTLE_STATE_RUNTIME = { version: '0.2.0', phase: '3.8.5-battle-state-runtime', STATES, snapshot, set, start, reset, isActive, isTerminal, canAct, victory, defeat, escaped, applyWildDefeat, shouldBlockAction };
  document.dispatchEvent(new CustomEvent('dd:battle-state-runtime-ready', { detail: window.DD_BATTLE_STATE_RUNTIME }));
})();
