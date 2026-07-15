// assets/js/dd-status-runtime.js
(function () {
  'use strict';

  if (window.DD_STATUS_RUNTIME) return;

  const VERSION = '1.0.0';
  const OWNER = 'DD_STATUS_RUNTIME';

  const DEFAULTS = {
    Burn: { duration: 3 },
    Freeze: { duration: 2 },
    Shock: { duration: 2 },
    Corruption: { duration: 4 },
    Shield: { duration: 3 },
    Boost: { duration: 3 }
  };

  function dispatch(name, detail) {
    document.dispatchEvent(new CustomEvent(name, {
      detail: Object.assign({
        owner: OWNER,
        version: VERSION,
        at: new Date().toISOString()
      }, detail || {})
    }));
  }

  function ensure(target) {
    if (!target.statusEffects) target.statusEffects = [];
    return target.statusEffects;
  }

  function apply(target, status, options = {}) {
    const list = ensure(target);
    const existing = list.find(s => s.id === status);
    if (existing) {
      existing.duration = options.duration ?? existing.duration;
      dispatch('dd:status-applied', { target, status: existing });
      return existing;
    }

    const entry = {
      id: status,
      duration: options.duration ?? (DEFAULTS[status]?.duration ?? 1),
      stacks: options.stacks ?? 1,
      data: options.data ?? {}
    };

    list.push(entry);
    dispatch('dd:status-applied', { target, status: entry });
    return entry;
  }

  function remove(target, status) {
    const list = ensure(target);
    const index = list.findIndex(s => s.id === status);
    if (index >= 0) {
      const removed = list.splice(index, 1)[0];
      dispatch('dd:status-removed', { target, status: removed });
      return true;
    }
    return false;
  }

  function tick(target, context = {}) {
    const list = ensure(target);
    const expired = [];

    list.forEach(s => {
      if (s.duration > 0) s.duration--;
      dispatch('dd:status-ticked', { target, status: s, context });
      if (s.duration <= 0) expired.push(s.id);
    });

    expired.forEach(id => {
      remove(target, id);
      dispatch('dd:status-expired', { target, status: id });
    });

    return list;
  }

  function clear(target) {
    ensure(target).length = 0;
  }

  function serialize(target) {
    return JSON.parse(JSON.stringify(ensure(target)));
  }

  function deserialize(target, data) {
    target.statusEffects = Array.isArray(data) ? JSON.parse(JSON.stringify(data)) : [];
    return target.statusEffects;
  }

  function health() {
    return {
      owner: OWNER,
      version: VERSION,
      supported: Object.keys(DEFAULTS)
    };
  }

  window.DD_STATUS_RUNTIME = Object.freeze({
    version: VERSION,
    owner: OWNER,
    apply,
    remove,
    tick,
    clear,
    serialize,
    deserialize,
    health
  });

  dispatch('dd:status-runtime-ready', health());
})();
