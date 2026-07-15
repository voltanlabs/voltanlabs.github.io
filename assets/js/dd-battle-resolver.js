// assets/js/dd-battle-resolver.js
(function () {
  'use strict';

  if (
    !location.pathname.includes('databyte-discovery') &&
    !location.pathname.includes('databytedex')
  ) return;

  var VERSION = '3.4.0';
  var OWNER = 'dd-battle-resolver';

  function battle() { return window.DDBattle24 || null; }
  function rules() { return window.DD_GAMEPLAY_RULES || null; }
  function statuses() { return window.DD_STATUS_RUNTIME || null; }

  function hash(text) {
    text = String(text || 'battle');
    var value = 2166136261;
    for (var index = 0; index < text.length; index += 1) {
      value ^= text.charCodeAt(index);
      value += (value << 1) + (value << 4) + (value << 7) + (value << 8) + (value << 24);
    }
    return Math.abs(value >>> 0);
  }

  function clamp(number, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, Number(number) || 0));
  }

  function asArray(value) {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (value === null || value === undefined || value === '') return [];
    return [value];
  }

  function configurationsOf(subject) {
    if (!subject) return [];
    var values = [];
    values = values.concat(asArray(subject.configuration));
    values = values.concat(asArray(subject.configurations));
    values = values.concat(asArray(subject.elements));
    values = values.concat(asArray(subject.element));
    values = values.concat(asArray(subject.type));
    values = values.concat(asArray(subject.types));

    return values.reduce(function (all, value) {
      if (typeof value === 'string' && value.indexOf('/') >= 0) return all.concat(value.split('/'));
      if (typeof value === 'string' && value.indexOf(',') >= 0) return all.concat(value.split(','));
      return all.concat(value);
    }, []).map(function (value) {
      return String(value || '').trim();
    }).filter(Boolean);
  }

  function normalizeStatusEffect(effect) {
    if (!effect) return null;
    if (typeof effect === 'string') effect = { id: effect };
    if (!effect.id) return null;

    return {
      id: String(effect.id).trim().toLowerCase(),
      chance: clamp(effect.chance === undefined ? 100 : effect.chance, 0, 100),
      durationTurns: clamp(effect.durationTurns || effect.duration || 1, 1, 99),
      stacks: clamp(effect.stacks || 1, 1, 99),
      target: effect.target || effect.appliesTo || null,
      data: effect.data && typeof effect.data === 'object' ? Object.assign({}, effect.data) : {}
    };
  }

  function normalizeMove(move) {
    move = Object.assign({
      id: 'signal-strike',
      name: 'Signal Strike',
      power: 24,
      accuracy: 92,
      captureEffect: 1,
      downloadEffect: null,
      configuration: 'Aether',
      moveType: 'attack',
      statusEffect: null
    }, move || {});

    if (rules() && typeof rules().tuneMove === 'function') move = rules().tuneMove(move);

    move.power = clamp(move.power || 24, 0, 60);
    move.accuracy = clamp(move.accuracy || 90, 0, 100);
    move.captureEffect = clamp(
      move.captureEffect !== undefined ? move.captureEffect : move.downloadEffect || 1,
      0,
      8
    );
    move.downloadEffect = move.captureEffect;
    move.configuration = move.configuration || configurationsOf(move)[0] || 'Aether';
    move.configurations = configurationsOf(move);
    move.elements = move.configurations.slice();
    move.statusEffect = normalizeStatusEffect(move.statusEffect);
    return move;
  }

  function typeResult(move, target) {
    if (battle() && typeof battle().typeResult === 'function') return battle().typeResult(move, target);
    return { label: 'neutral', multiplier: 1, captureBonus: 0 };
  }

  function statusModifiers(target) {
    if (statuses() && typeof statuses().modifiers === 'function') return statuses().modifiers(target);
    return {
      attackMultiplier: 1,
      defenseMultiplier: 1,
      speedMultiplier: 1,
      accuracyMultiplier: 1,
      damageTakenMultiplier: 1
    };
  }

  function actionGate(user, move, opts) {
    if (statuses() && typeof statuses().actionGate === 'function') {
      return statuses().actionGate(user, {
        turn: opts.turn || 0,
        moveId: move.id,
        seed: opts.seed || opts.mode || 'turn'
      });
    }
    return { allowed: true, blocked: false, reason: null };
  }

  function hitCheck(user, move, target, seed, modifiers) {
    var adjustedAccuracy = clamp(
      Number(move.accuracy || 90) * Number(modifiers && modifiers.accuracyMultiplier || 1),
      1,
      100
    );
    var roll = hash([
      user && user.id,
      user && user.name,
      move && move.id,
      target && target.id,
      seed,
      Date.now()
    ].join('|')) % 100;

    return { hit: roll < adjustedAccuracy, roll: roll, accuracy: adjustedAccuracy };
  }

  function statusTarget(move) {
    var effect = move && move.statusEffect;
    if (!effect) return null;
    if (effect.target) return effect.target;
    return move.moveType === 'defense' || move.moveType === 'support' ? 'self' : 'target';
  }

  function resolveStatus(user, move, target, opts, hit) {
    var effect = move && move.statusEffect;
    if (!effect || !hit) return null;

    var appliesTo = statusTarget(move);
    var recipient = appliesTo === 'self' ? user : target;
    var roll = hash([
      user && (user.id || user.name),
      move.id,
      recipient && (recipient.id || recipient.name),
      opts.seed || opts.mode || 'status',
      'status',
      Date.now()
    ].join('|')) % 100;

    return {
      id: effect.id,
      chance: effect.chance,
      roll: roll,
      applied: roll < effect.chance,
      durationTurns: effect.durationTurns,
      stacks: effect.stacks,
      target: appliesTo,
      targetId: recipient && (recipient.id || recipient.name) || null,
      data: Object.assign({
        sourceMoveId: move.id,
        sourceMoveName: move.name,
        sourceActorId: user && (user.id || user.name) || null
      }, effect.data || {})
    };
  }

  function sameConfigurationBonus(user, move) {
    var userConfigurations = configurationsOf(user).map(function (value) {
      return value.toLowerCase();
    });
    var moveConfigurations = configurationsOf(move).map(function (value) {
      return value.toLowerCase();
    });

    return moveConfigurations.some(function (configuration) {
      return userConfigurations.indexOf(configuration) >= 0;
    }) ? 1.08 : 1;
  }

  function blockedResult(user, move, gate) {
    return {
      hit: false,
      miss: false,
      actionBlocked: true,
      actionGate: gate,
      blockedByConfiguration: false,
      type: { label: 'blocked', multiplier: 0, captureBonus: 0 },
      move: move,
      hpDamage: 0,
      signalDamage: 0,
      capturePressure: 0,
      statusApplication: null,
      notes: [(user.name || 'Sprite') + ' could not act because of ' + String(gate.reason || 'a status effect') + '.']
    };
  }

  function resolve(user, move, target, opts) {
    opts = opts || {};
    user = user || {};
    target = target || {};
    move = normalizeMove(move);

    var userMods = statusModifiers(user);
    var targetMods = statusModifiers(target);
    var gate = actionGate(user, move, opts);
    if (!gate.allowed) return blockedResult(user, move, gate);

    var hit = hitCheck(user, move, target, opts.seed || opts.mode || 'turn', userMods);
    var type = typeResult(move, target);
    var effectiveHit = hit.hit && Number(type.multiplier) !== 0;

    if (!effectiveHit) {
      return {
        hit: false,
        miss: true,
        actionBlocked: false,
        actionGate: gate,
        blockedByConfiguration: hit.hit && Number(type.multiplier) === 0,
        type: type,
        move: move,
        hpDamage: 0,
        signalDamage: 0,
        capturePressure: 0,
        statusApplication: null,
        modifiers: { user: userMods, target: targetMods },
        notes: [(user.name || 'Sprite') + ' used ' + move.name + (hit.hit ? ', but it had no effect.' : ', but missed.')]
      };
    }

    var attack = Number(user.atk || user.attack || 12) * Number(userMods.attackMultiplier || 1);
    var defense = Number(target.def || target.defense || 8) * Number(targetMods.defenseMultiplier || 1);
    var power = Number(move.power || 0);
    var multiplier = Number(type.multiplier || 1);
    var sameConfiguration = sameConfigurationBonus(user, move);

    var base = (power / 30) + (attack / 18) - (defense / 48) + 0.65;
    var raw = power <= 0 ? 0 : Math.max(0.35, base * multiplier * sameConfiguration);
    raw *= Number(targetMods.damageTakenMultiplier || 1);

    var hpDamage = power <= 0 ? 0 : clamp(Math.round(raw * 2.4), 1, 8);
    var signalDamage = power <= 0 ? 0 : clamp(Math.round(raw), 1, 3);

    if (opts.mode === 'player' && signalDamage > 0) {
      signalDamage = clamp(signalDamage, 1, 2);
    }

    var capturePressure = clamp(
      Number(move.captureEffect || 0) +
      Number(type.captureBonus || 0) +
      Math.max(0, signalDamage - 1),
      0,
      12
    );

    var statusApplication = resolveStatus(user, move, target, opts, true);

    return {
      hit: true,
      miss: false,
      actionBlocked: false,
      actionGate: gate,
      blockedByConfiguration: false,
      type: type,
      move: move,
      hpDamage: hpDamage,
      signalDamage: signalDamage,
      capturePressure: capturePressure,
      statusApplication: statusApplication,
      modifiers: { user: userMods, target: targetMods },
      notes: [(user.name || 'Sprite') + ' used ' + move.name + ' (' + type.label + ').']
    };
  }

  function chooseEnemyMove(enemy, lead) {
    enemy = enemy || {};
    var moves = Array.isArray(enemy.moves) && enemy.moves.length
      ? enemy.moves.map(normalizeMove)
      : [normalizeMove()];

    if (battle() && typeof battle().chooseEnemyMove === 'function') {
      var picked = battle().chooseEnemyMove(enemy, lead);
      if (picked) return normalizeMove(picked);
    }

    var sorted = moves.slice().sort(function (left, right) {
      return Number(right.power || 0) - Number(left.power || 0);
    });

    var value = hash((enemy.id || enemy.name || 'enemy') + '|' + Date.now());

    if (Number(enemy.stability || 10) <= 3 && sorted.length > 1) {
      return sorted[1] || sorted[0];
    }

    return value % 100 < 70 ? sorted[0] : moves[value % moves.length];
  }

  function effectiveSpeed(subject) {
    var base = Number(subject && subject.speed || 8);
    var mods = statusModifiers(subject);
    return base * Number(mods.speedMultiplier || 1);
  }

  function turnOrder(lead, wild) {
    var leadSpeed = effectiveSpeed(lead);
    var wildSpeed = effectiveSpeed(wild);

    if (leadSpeed === wildSpeed) {
      return hash((lead && lead.id || 'lead') + (wild && wild.id || 'wild') + Date.now()) % 2 === 0
        ? 'player'
        : 'enemy';
    }
    return leadSpeed > wildSpeed ? 'player' : 'enemy';
  }

  window.DD_BATTLE_RESOLVER = {
    version: VERSION,
    owner: OWNER,
    normalizeMove: normalizeMove,
    normalizeStatusEffect: normalizeStatusEffect,
    configurationsOf: configurationsOf,
    statusModifiers: statusModifiers,
    actionGate: actionGate,
    typeResult: typeResult,
    resolveStatus: resolveStatus,
    resolve: resolve,
    chooseEnemyMove: chooseEnemyMove,
    effectiveSpeed: effectiveSpeed,
    turnOrder: turnOrder,
    hash: hash
  };

  document.dispatchEvent(new CustomEvent('dd:battle-resolver-ready', {
    detail: { version: VERSION, owner: OWNER }
  }));
})();
