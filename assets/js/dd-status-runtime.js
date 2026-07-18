// assets/js/dd-status-runtime.js
// Status ownership runtime with guarded dispatch and re-entrancy-safe ticking.
(function () {
  'use strict';
  if (window.DD_STATUS_RUNTIME) return;

  const VERSION = '1.3.0';
  const OWNER = 'DD_STATUS_RUNTIME';

  const DEFINITIONS = Object.freeze({
    burn: { duration: 3, maxStacks: 3, tickDamage: 2, tickPhase: 'end', label: 'Burn' },
    freeze: { duration: 2, maxStacks: 1, actionBlockChance: 55, speedMultiplier: 0.65, label: 'Freeze' },
    shock: { duration: 2, maxStacks: 2, accuracyMultiplier: 0.82, speedMultiplier: 0.8, label: 'Shock' },
    corruption: { duration: 4, maxStacks: 3, tickDamage: 1, attackMultiplier: 0.9, defenseMultiplier: 0.9, tickPhase: 'end', label: 'Corruption' },
    shield: { duration: 3, maxStacks: 2, damageTakenMultiplier: 0.72, label: 'Shield' },
    boost: { duration: 3, maxStacks: 2, attackMultiplier: 1.18, speedMultiplier: 1.12, label: 'Boost' },
    charged: { duration: 2, maxStacks: 2, attackMultiplier: 1.15, speedMultiplier: 1.08, label: 'Charged' },
    guarded: { duration: 2, maxStacks: 1, damageTakenMultiplier: 0.68, label: 'Guarded' },
    misdirected: { duration: 1, maxStacks: 1, accuracyMultiplier: 0.72, label: 'Misdirected' },
    bound: { duration: 1, maxStacks: 1, speedMultiplier: 0.55, label: 'Bound' },
    infected: { duration: 3, maxStacks: 3, tickDamage: 2, attackMultiplier: 0.9, tickPhase: 'end', label: 'Infected' }
  });

  const normalizeId = value => String(value || '').trim().toLowerCase();
  const clone = value => JSON.parse(JSON.stringify(value));
  const clamp = (n, min, max) => Math.max(min, Math.min(max, Number(n) || 0));

  const activeTicks = new WeakSet();
  let dispatchDepth = 0;
  const MAX_DISPATCH_DEPTH = 12;
  let lastError = null;

  function hash(text) {
    text = String(text || 'status');
    let value = 2166136261;
    for (let i = 0; i < text.length; i += 1) {
      value ^= text.charCodeAt(i);
      value += (value << 1) + (value << 4) + (value << 7) + (value << 8) + (value << 24);
    }
    return Math.abs(value >>> 0);
  }

  function safeDispatch(name, detail) {
    if (dispatchDepth >= MAX_DISPATCH_DEPTH) {
      lastError = {
        type: 'dispatch-depth',
        event: name,
        at: new Date().toISOString()
      };
      try {
        console.error('[' + OWNER + '] blocked recursive event dispatch:', name);
      } catch (_) {}
      return false;
    }

    dispatchDepth += 1;
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
      lastError = {
        type: 'dispatch-error',
        event: name,
        message: error && error.message ? error.message : String(error),
        at: new Date().toISOString()
      };
      try {
        console.error('[' + OWNER + '] event dispatch failed:', name, error);
      } catch (_) {}
      return false;
    } finally {
      dispatchDepth = Math.max(0, dispatchDepth - 1);
    }
  }

  function ensure(target) {
    if (!target || typeof target !== 'object') return [];
    if (!Array.isArray(target.statusEffects)) target.statusEffects = [];
    return target.statusEffects;
  }

  function definition(status) {
    const id = normalizeId(typeof status === 'string' ? status : status && status.id);
    return Object.assign(
      { duration: 1, maxStacks: 1, label: id || 'Status' },
      DEFINITIONS[id] || {},
      status && typeof status === 'object' ? status.definition || {} : {}
    );
  }

  function get(target, status) {
    const id = normalizeId(status);
    return ensure(target).find(entry => normalizeId(entry.id) === id) || null;
  }

  const has = (target, status) => !!get(target, status);

  function apply(target, status, options = {}) {
    if (!target || typeof target !== 'object') return null;

    const id = normalizeId(typeof status === 'string' ? status : status && status.id);
    if (!id) return null;

    const config = definition(status);
    const existing = get(target, id);
    const requestedStacks = clamp(options.stacks || 1, 1, config.maxStacks || 99);

    if (existing) {
      existing.duration = Math.max(
        Number(existing.duration || 0),
        Number(options.duration ?? config.duration ?? 1)
      );
      existing.stacks = clamp(
        Number(existing.stacks || 1) + requestedStacks,
        1,
        config.maxStacks || 99
      );
      existing.data = Object.assign({}, existing.data || {}, options.data || {});
      existing.updatedAt = new Date().toISOString();
      if (!options.silent) {
        safeDispatch('dd:status-applied', {
          target,
          status: existing,
          refreshed: true
        });
      }
      return existing;
    }

    const entry = {
      id,
      label: config.label || id,
      duration: Math.max(0, Number(options.duration ?? config.duration ?? 1)),
      stacks: requestedStacks,
      data: Object.assign({}, options.data || {}),
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    ensure(target).push(entry);
    if (!options.silent) {
      safeDispatch('dd:status-applied', {
        target,
        status: entry,
        refreshed: false
      });
    }
    return entry;
  }

  function remove(target, status, reason, options = {}) {
    const id = normalizeId(status);
    const list = ensure(target);
    const index = list.findIndex(entry => normalizeId(entry.id) === id);
    if (index < 0) return false;

    const removed = list.splice(index, 1)[0];
    if (!options.silent) {
      safeDispatch('dd:status-removed', {
        target,
        status: removed,
        reason: reason || 'removed'
      });
    }
    return removed;
  }

  function clear(target, reason) {
    if (!target || typeof target !== 'object') return [];
    const removed = ensure(target).slice();
    target.statusEffects = [];

    removed.forEach(status => {
      safeDispatch('dd:status-removed', {
        target,
        status,
        reason: reason || 'cleared'
      });
    });

    safeDispatch('dd:status-cleared', { target, removed });
    return removed;
  }

  function modifiers(target) {
    const result = {
      attackMultiplier: 1,
      defenseMultiplier: 1,
      speedMultiplier: 1,
      accuracyMultiplier: 1,
      damageTakenMultiplier: 1
    };

    ensure(target).slice().forEach(status => {
      const config = definition(status);
      const stacks = Math.max(1, Number(status.stacks || 1));
      Object.keys(result).forEach(key => {
        if (config[key] !== undefined) {
          result[key] *= Math.pow(Number(config[key]), stacks);
        }
      });
    });

    return result;
  }

  function actionGate(target, context = {}) {
    const frozen = get(target, 'freeze');
    if (!frozen) {
      return {
        allowed: true,
        blocked: false,
        reason: null,
        status: null
      };
    }

    const config = definition(frozen);
    const chance = clamp(config.actionBlockChance || 0, 0, 100);
    const roll = hash([
      target && (target.id || target.name),
      context.turn || 0,
      context.moveId || '',
      context.seed || '',
      'freeze'
    ].join('|')) % 100;

    const blocked = roll < chance;
    const result = {
      allowed: !blocked,
      blocked,
      reason: blocked ? 'freeze' : null,
      status: frozen,
      chance,
      roll
    };

    return result;
  }

  function tick(target, context = {}) {
    const phase = context.phase || 'end';

    if (!target || typeof target !== 'object') {
      return {
        target,
        phase,
        effects: [],
        expired: [],
        hp: 0,
        fainted: true,
        statuses: [],
        ok: false,
        reason: 'missing-target'
      };
    }

    if (activeTicks.has(target)) {
      const result = {
        target,
        phase,
        effects: [],
        expired: [],
        hp: Number(target.hp || 0),
        fainted: Number(target.hp || 0) <= 0,
        statuses: ensure(target),
        ok: false,
        reason: 'reentrant-tick-blocked'
      };
      if (!context.silent) {
        safeDispatch('dd:status-tick-blocked', {
          target,
          context,
          result
        });
      }
      return result;
    }

    activeTicks.add(target);

    const effects = [];
    const expiredIds = [];
    const expiredEntries = [];

    try {
      const snapshot = ensure(target).slice();

      for (let index = 0; index < snapshot.length; index += 1) {
        const status = snapshot[index];
        if (!status || !get(target, status.id)) continue;

        const config = definition(status);
        const stacks = Math.max(1, Number(status.stacks || 1));
        let damage = 0;

        if (
          config.tickDamage &&
          (config.tickPhase || 'end') === phase &&
          Number(target.hp || 0) > 0
        ) {
          damage = Math.min(
            Number(target.hp || 0),
            Math.max(0, Math.round(Number(config.tickDamage || 0) * stacks))
          );
          target.hp = Math.max(0, Number(target.hp || 0) - damage);
        }

        if (phase === 'end') {
          status.duration = Math.max(0, Number(status.duration || 0) - 1);
          status.updatedAt = new Date().toISOString();
        }

        const isExpired =
          phase === 'end' &&
          Number(status.duration || 0) <= 0;

        const effect = {
          status,
          phase,
          damage,
          hp: Number(target.hp || 0),
          expired: isExpired
        };

        effects.push(effect);

        if (!context.silent) {
          safeDispatch('dd:status-ticked', {
            target,
            status,
            context,
            effect
          });
        }

        if (damage > 0 && !context.silent) {
          safeDispatch('dd:status-damage', {
            target,
            status,
            damage,
            hp: target.hp,
            context
          });
        }

        if (isExpired && !expiredIds.includes(normalizeId(status.id))) {
          expiredIds.push(normalizeId(status.id));
          expiredEntries.push(status);
        }
      }

      expiredIds.forEach((id, index) => {
        const status = expiredEntries[index] || get(target, id) || id;
        remove(target, id, 'expired', { silent: true });
        if (!context.silent) {
          safeDispatch('dd:status-removed', {
            target,
            status,
            reason: 'expired'
          });
          safeDispatch('dd:status-expired', {
            target,
            status,
            context
          });
        }
      });

      return {
        target,
        phase,
        effects,
        expired: expiredIds.slice(),
        hp: Number(target.hp || 0),
        fainted: Number(target.hp || 0) <= 0,
        statuses: ensure(target),
        ok: true
      };
    } catch (error) {
      lastError = {
        type: 'tick-error',
        phase,
        message: error && error.message ? error.message : String(error),
        at: new Date().toISOString()
      };

      if (!context.silent) {
        safeDispatch('dd:status-runtime-error', {
          target,
          context,
          error: lastError
        });
      }

      return {
        target,
        phase,
        effects,
        expired: expiredIds.slice(),
        hp: Number(target.hp || 0),
        fainted: Number(target.hp || 0) <= 0,
        statuses: ensure(target),
        ok: false,
        reason: 'tick-error',
        message: lastError.message
      };
    } finally {
      activeTicks.delete(target);
    }
  }

  const serialize = target => clone(ensure(target));

  function deserialize(target, data) {
    if (!target || typeof target !== 'object') return [];

    target.statusEffects = Array.isArray(data)
      ? clone(data).map(entry => ({
          id: normalizeId(entry.id),
          label: entry.label || definition(entry).label,
          duration: Math.max(0, Number(entry.duration || 0)),
          stacks: Math.max(1, Number(entry.stacks || 1)),
          data: entry.data && typeof entry.data === 'object' ? entry.data : {},
          appliedAt: entry.appliedAt || new Date().toISOString(),
          updatedAt: entry.updatedAt || new Date().toISOString()
        }))
      : [];

    return target.statusEffects;
  }

  function health() {
    return {
      owner: OWNER,
      version: VERSION,
      supported: Object.keys(DEFINITIONS),
      capabilities: [
        'lifecycle',
        'stacking',
        'serialization',
        'action-gates',
        'stat-modifiers',
        'turn-damage',
        'reentrancy-guard',
        'safe-dispatch'
      ],
      dispatchDepth,
      lastError
    };
  }

  window.DD_STATUS_RUNTIME = Object.freeze({
    version: VERSION,
    owner: OWNER,
    definitions: DEFINITIONS,
    definition,
    ensure,
    get,
    has,
    apply,
    remove,
    clear,
    modifiers,
    actionGate,
    tick,
    serialize,
    deserialize,
    health
  });

  safeDispatch('dd:status-runtime-ready', health());
})();
