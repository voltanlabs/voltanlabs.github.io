// Data Discovery: deterministic, event-free battle owner.
(function () {
  'use strict';

  if (!location.pathname.includes('databyte-discovery')) return;
  if (window.DD_BATTLE_CORE_RUNTIME) return;

  const VERSION = '1.2.0';
  const OWNER = 'dd-battle-core-runtime';
  let battle = null;
  let busy = false;
  let turn = 0;

  const number = (value, fallback) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : Number(fallback || 0);
  };
  const clamp = (value, minimum, maximum) =>
    Math.max(minimum, Math.min(maximum, number(value, minimum)));

  function hash(value) {
    const text = String(value || 'battle');
    let result = 2166136261;
    for (let index = 0; index < text.length; index += 1) {
      result ^= text.charCodeAt(index);
      result = Math.imul(result, 16777619);
    }
    return result >>> 0;
  }

  function normalizeMove(move) {
    const source = move || {};
    const statusSource = typeof source.statusEffect === 'string'
      ? { id: source.statusEffect }
      : source.statusEffect;
    return {
      id: String(source.id || 'signal-strike'),
      name: String(source.name || 'Signal Strike'),
      power: clamp(source.power != null ? source.power : 24, 0, 60),
      accuracy: clamp(source.accuracy || 92, 1, 100),
      captureEffect: clamp(
        source.captureEffect != null
          ? source.captureEffect
          : source.downloadEffect || 1,
        0,
        8
      ),
      statusEffect: statusSource && statusSource.id
        ? {
          id: String(statusSource.id).toLowerCase(),
          chance: clamp(statusSource.chance == null ? 100 : statusSource.chance, 0, 100),
          duration: clamp(statusSource.durationTurns || statusSource.duration || 1, 1, 99),
          stacks: clamp(statusSource.stacks || 1, 1, 99),
          target: statusSource.target || 'target',
          data: statusSource.data && typeof statusSource.data === 'object'
            ? Object.assign({}, statusSource.data)
            : {}
        }
        : null
    };
  }

  function movesOf(sprite) {
    return Array.isArray(sprite && sprite.moves) && sprite.moves.length
      ? sprite.moves.map(normalizeMove)
      : [normalizeMove()];
  }

  function chooseEnemyMove(enemy) {
    return movesOf(enemy).slice().sort((left, right) =>
      right.power - left.power
    )[0];
  }

  function calculate(actor, move, target, seed, mode) {
    const selected = normalizeMove(move);
    const statuses = window.DD_STATUS_RUNTIME;
    const actorModifiers = statuses && typeof statuses.modifiers === 'function'
      ? statuses.modifiers(actor)
      : { attackMultiplier: 1, accuracyMultiplier: 1 };
    const targetModifiers = statuses && typeof statuses.modifiers === 'function'
      ? statuses.modifiers(target)
      : { defenseMultiplier: 1, damageTakenMultiplier: 1 };
    const gate = statuses && typeof statuses.actionGate === 'function'
      ? statuses.actionGate(actor, {
        turn,
        moveId: selected.id,
        seed: String(seed || mode || 'turn')
      })
      : { allowed: true, blocked: false, reason: null };
    const roll = hash([
      battle && battle.id,
      turn,
      actor && (actor.id || actor.name),
      selected.id,
      target && (target.id || target.name),
      seed
    ].join('|')) % 100;
    const accuracy = clamp(
      selected.accuracy * number(actorModifiers.accuracyMultiplier, 1),
      1,
      100
    );
    const hit = gate.allowed && roll < accuracy;
    const attack = number(actor && (actor.atk || actor.attack), 12) *
      number(actorModifiers.attackMultiplier, 1);
    const defense = Math.max(
      1,
      number(target && (target.def || target.defense), 8) *
        number(targetModifiers.defenseMultiplier, 1)
    );
    const modeScale = mode === 'player' ? 1.3 : 0.8;
    const raw = (selected.power / 12 + attack / 8 - defense / 16) * modeScale;
    const damage = hit && selected.power > 0
      ? clamp(
        Math.round(raw * number(targetModifiers.damageTakenMultiplier, 1)),
        1,
        8
      )
      : 0;
    const pressure = hit && mode === 'player'
      ? clamp(selected.captureEffect + Math.max(0, Math.floor(damage / 4)), 0, 8)
      : 0;
    let statusApplication = null;
    if (hit && selected.statusEffect) {
      const statusRoll = hash([
        battle && battle.id,
        turn,
        actor && (actor.id || actor.name),
        selected.id,
        'status'
      ].join('|')) % 100;
      statusApplication = Object.assign({}, selected.statusEffect, {
        roll: statusRoll,
        applied: statusRoll < selected.statusEffect.chance
      });
    }
    return {
      actor,
      target,
      move: selected,
      mode,
      gate,
      hit,
      roll,
      accuracy,
      damage,
      pressure,
      statusApplication
    };
  }

  function apply(action) {
    const target = action.target;
    const before = number(target.hp, target.maxHp || 1);
    target.hp = Math.max(0, before - action.damage);

    let appliedStatus = null;
    let statusRecipient = null;
    const statusApplication = action.statusApplication;
    const statuses = window.DD_STATUS_RUNTIME;
    if (
      statusApplication &&
      statusApplication.applied &&
      statuses &&
      typeof statuses.apply === 'function'
    ) {
      const recipient = statusApplication.target === 'self'
        ? action.actor
        : target;
      statusRecipient = recipient;
      appliedStatus = statuses.apply(recipient, statusApplication.id, {
        duration: statusApplication.duration,
        stacks: statusApplication.stacks,
        data: statusApplication.data,
        silent: true
      });
    }

    let downloadBefore = null;
    let downloadAfter = null;
    const capture = window.DD_CAPTURE_RUNTIME;
    if (
      action.mode === 'player' &&
      action.pressure > 0 &&
      capture &&
      typeof capture.odds === 'function' &&
      typeof capture.setOdds === 'function'
    ) {
      downloadBefore = number(capture.odds(target), 0);
      capture.setOdds(target, downloadBefore + action.pressure);
      downloadAfter = number(capture.odds(target), downloadBefore);
    }

    return Object.assign({}, action, {
      hpBefore: before,
      hpAfter: target.hp,
      fainted: target.hp <= 0,
      appliedStatus,
      statusRecipient,
      downloadBefore,
      downloadAfter
    });
  }

  function persistLead(lead) {
    const player = window.DD_PLAYER_RUNTIME;
    const party = player && player.party;
    if (party && typeof party.updateSprite === 'function') {
      party.updateSprite(lead);
    }
  }

  function actionText(result) {
    if (result.gate && result.gate.blocked) {
      return result.actor.name + ' could not act because of ' + result.gate.reason + '.';
    }
    if (!result.hit) return result.actor.name + ' used ' + result.move.name + ', but missed.';
    let text = result.actor.name + ' used ' + result.move.name + '.';
    if (result.damage > 0) {
      text += ' ' + result.target.name + ' HP ' + result.hpAfter + '/' + result.target.maxHp + '.';
    }
    if (result.pressure > 0) text += ' Download +' + result.pressure + '%.';
    if (result.appliedStatus) {
      text += ' ' + (result.statusRecipient && result.statusRecipient.name || result.target.name) +
        ' gained ' + result.appliedStatus.label + '.';
    }
    return text;
  }

  function effectiveSpeed(sprite) {
    const statuses = window.DD_STATUS_RUNTIME;
    const modifiers = statuses && typeof statuses.modifiers === 'function'
      ? statuses.modifiers(sprite)
      : { speedMultiplier: 1 };
    return number(sprite && sprite.speed, 8) *
      number(modifiers.speedMultiplier, 1);
  }

  function tickStatuses(participants) {
    const statuses = window.DD_STATUS_RUNTIME;
    if (!statuses || typeof statuses.tick !== 'function') return [];
    return participants.map(participant => statuses.tick(participant, {
      phase: 'end',
      turn,
      battleId: battle && battle.id,
      silent: true
    }));
  }

  function terminalFor(lead, wild) {
    if (number(wild.hp, 0) <= 0) return 'wild-defeated';
    if (number(lead.hp, 0) <= 0) return 'lead-defeated';
    return null;
  }

  function start(input) {
    const context = input || {};
    battle = {
      id: String(context.encounterId || context.battleId || ('battle-' + Date.now())),
      lead: context.lead || null,
      wild: context.wild || null
    };
    turn = 0;
    busy = false;
    return snapshot();
  }

  function runTurn(input) {
    if (busy) return { ok: false, reason: 'turn-busy', state: snapshot() };
    const context = input || {};
    const lead = context.lead || battle && battle.lead;
    const wild = context.wild || battle && battle.wild;
    if (!lead || !wild) return { ok: false, reason: 'missing-combatant', state: snapshot() };
    if (!battle) start({ encounterId: context.encounterId, lead, wild });

    const existingTerminal = terminalFor(lead, wild);
    if (existingTerminal) {
      return { ok: true, terminal: existingTerminal, actions: [], state: snapshot() };
    }

    busy = true;
    turn += 1;
    const actions = [];
    try {
      const playerMove = normalizeMove(context.move || movesOf(lead)[0]);
      const enemyMove = chooseEnemyMove(wild);
      const playerFirst = effectiveSpeed(lead) >= effectiveSpeed(wild);
      const order = playerFirst
        ? [
          [lead, playerMove, wild, 'player'],
          [wild, enemyMove, lead, 'enemy']
        ]
        : [
          [wild, enemyMove, lead, 'enemy'],
          [lead, playerMove, wild, 'player']
        ];

      for (let index = 0; index < order.length; index += 1) {
        const [actor, move, target, mode] = order[index];
        const result = apply(calculate(actor, move, target, index, mode));
        actions.push(result);
        if (result.fainted) break;
      }
      const statusTicks = terminalFor(lead, wild)
        ? []
        : tickStatuses([lead, wild]);
      persistLead(lead);
      const terminal = terminalFor(lead, wild);
      const output = {
        ok: true,
        turn,
        terminal,
        actions,
        statusTicks,
        message: actions.map(actionText).join(' '),
        lead,
        wild,
        state: null
      };
      busy = false;
      output.state = snapshot();
      return output;
    } finally {
      busy = false;
    }
  }

  function reset() {
    battle = null;
    busy = false;
    turn = 0;
    return snapshot();
  }

  function snapshot() {
    return {
      owner: OWNER,
      version: VERSION,
      battleId: battle && battle.id || null,
      turn,
      busy,
      lead: battle && battle.lead || null,
      wild: battle && battle.wild || null
    };
  }

  window.DD_BATTLE_CORE_RUNTIME = Object.freeze({
    owner: OWNER,
    version: VERSION,
    phase: 'recovery-battle-rebuild',
    start,
    runTurn,
    calculate,
    reset,
    snapshot
  });
})();
