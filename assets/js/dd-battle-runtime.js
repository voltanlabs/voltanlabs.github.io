// Data Discovery v4.8: canonical public facade for battle components.
(function () {
  'use strict';

  if (!location.pathname.includes('databyte-discovery')) return;
  if (window.DD_BATTLE_RUNTIME) return;

  const VERSION = '1.0.0';
  const OWNER = 'dd-battle-runtime';

  function components() {
    return {
      engine: window.DDBattle24 || null,
      resolver: window.DD_BATTLE_RESOLVER || null,
      state: window.DD_BATTLE_STATE_RUNTIME || null,
      status: window.DD_STATUS_RUNTIME || null,
      rewards: window.DD_BATTLE_REWARD_RUNTIME || null,
      rewardPresentation: window.DD_BATTLE_REWARD_PRESENTATION || null,
      presentation: window.DD_BATTLE_PRESENTATION_RUNTIME || null
    };
  }

  function requireComponent(name, methods) {
    const component = components()[name];
    if (!component) throw new Error('Battle Runtime missing required component: ' + name);
    (methods || []).forEach(method => {
      if (typeof component[method] !== 'function') {
        throw new Error('Battle Runtime component ' + name + ' is missing method ' + method);
      }
    });
    return component;
  }

  function validate() {
    const checks = [
      ['engine', ['typeResult']],
      ['resolver', ['resolve', 'turnOrder', 'chooseEnemyMove']],
      ['state', ['beginTurn', 'applyResolution', 'endTurn', 'snapshot']],
      ['status', ['tick', 'actionGate']],
      ['rewards', ['award']]
    ];
    const failures = [];
    checks.forEach(([name, methods]) => {
      try { requireComponent(name, methods); }
      catch (error) { failures.push({ component: name, message: error.message }); }
    });
    return { ok: failures.length === 0, owner: OWNER, version: VERSION, failures };
  }

  function snapshot() {
    const state = components().state;
    return state && typeof state.snapshot === 'function' ? state.snapshot() : null;
  }

  function emit(type, detail) {
    const payload = detail || {};
    window.dispatchEvent(new CustomEvent('dd:battle:' + type, { detail: payload }));
    return payload;
  }

  function resolve(actor, move, target, mode) {
    return requireComponent('resolver', ['resolve']).resolve(actor, move, target, mode);
  }

  function beginTurn(participants, context) {
    return requireComponent('state', ['beginTurn']).beginTurn(participants, context);
  }

  function applyResolution(resolution, actor, target, context) {
    return requireComponent('state', ['applyResolution']).applyResolution(resolution, actor, target, context);
  }

  function endTurn(participants, context) {
    return requireComponent('state', ['endTurn']).endTurn(participants, context);
  }

  const runtime = Object.freeze({
    version: VERSION,
    owner: OWNER,
    phase: '4.8-canonical-battle-facade',
    components,
    validate,
    snapshot,
    emit,
    resolve,
    beginTurn,
    applyResolution,
    endTurn,
    resolver: () => requireComponent('resolver'),
    state: () => requireComponent('state'),
    status: () => requireComponent('status'),
    rewards: () => requireComponent('rewards'),
    presentation: () => components().presentation
  });

  const validation = runtime.validate();
  window.DD_BATTLE_RUNTIME = runtime;
  document.dispatchEvent(new CustomEvent('dd:battle-runtime-ready', {
    detail: { owner: OWNER, version: VERSION, validation, runtime }
  }));
})();
