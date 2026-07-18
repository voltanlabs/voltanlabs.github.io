// assets/js/dd-battle-state-runtime.js
// Canonical battle state, resolution application, status phases, terminal outcomes,
// reward context propagation, action-state decisions, and faint-to-party-switch coordination.
// Runtime recovery: guarded phase execution, re-entrancy protection, and safe diagnostics.
(function () {
  'use strict';

  const VERSION = '0.8.0';
  const OWNER = 'dd-battle-state-runtime';

  const STATES = Object.freeze({
    idle: 'idle',
    active: 'active',
    victory: 'victory',
    defeat: 'defeat',
    escaped: 'escaped',
    result: 'result'
  });

  const ACTION_DECISIONS = Object.freeze({
    allowed: 'allowed',
    missingContext: 'missing-context',
    wildDefeated: 'wild-defeated',
    switchRequired: 'switch-required',
    partyDefeated: 'party-defeated',
    battleInactive: 'battle-inactive',
    transactionBusy: 'transaction-busy',
    runtimeError: 'runtime-error'
  });

  let state = createInitialState();
  let battleContext = createInitialContext();

  const transaction = {
    active: false,
    phase: null,
    id: 0,
    startedAt: null,
    lastCompletedAt: null,
    lastError: null
  };

  const statusRuntime = () => window.DD_STATUS_RUNTIME || null;
  const captureRuntime = () => window.DD_CAPTURE_RUNTIME || null;
  const encounterRuntime = () => window.DD_ENCOUNTER_RUNTIME || null;
  const gameplayRules = () => window.DD_GAMEPLAY_RULES || null;
  const partyRuntime = () => window.DD_PARTY_RUNTIME || null;
  const partySwitchRuntime = () => window.DD_PARTY_SWITCH_RUNTIME || null;

  function createInitialState(reason) {
    return {
      value: STATES.idle,
      encounterId: null,
      terminalProcessed: false,
      reason: reason || null,
      turn: 0,
      updatedAt: new Date().toISOString()
    };
  }

  function createInitialContext() {
    return {
      encounterId: null,
      wild: null,
      lead: null,
      context: {}
    };
  }

  function snapshot() {
    return Object.assign({}, state);
  }

  function contextSnapshot() {
    return {
      encounterId: battleContext.encounterId || state.encounterId || null,
      wild: battleContext.wild || null,
      lead: battleContext.lead || null,
      context: Object.assign({}, battleContext.context || {})
    };
  }

  function transactionSnapshot() {
    return Object.assign({}, transaction);
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
      transaction.lastError = {
        phase: transaction.phase,
        message: error && error.message ? error.message : String(error),
        at: new Date().toISOString()
      };
      try {
        console.error('[' + OWNER + '] event dispatch failed:', name, error);
      } catch (_) {}
      return false;
    }
  }

  function emit() {
    safeDispatch('dd:battle-state-change', Object.assign({}, snapshot(), {
      battleContext: contextSnapshot(),
      transaction: transactionSnapshot()
    }));
  }

  function trace(phase, detail) {
    transaction.lastTrace = Object.assign({
      phase,
      transactionPhase: transaction.phase,
      transactionActive: transaction.active,
      battleState: state.value,
      turn: state.turn,
      encounterId: battleContext.encounterId || state.encounterId || null,
      at: new Date().toISOString()
    }, detail || {});
    return transaction.lastTrace;
  }

  function beginTransaction(phase) {
    if (transaction.active) {
      const result = {
        ok: false,
        block: true,
        decision: ACTION_DECISIONS.transactionBusy,
        reason: 'transaction-busy',
        activePhase: transaction.phase,
        state: snapshot(),
        battleContext: contextSnapshot(),
        transaction: transactionSnapshot()
      };
      trace('transaction-rejected', result);
      return result;
    }

    transaction.active = true;
    transaction.phase = phase || 'unknown';
    transaction.id += 1;
    transaction.startedAt = new Date().toISOString();
    transaction.lastError = null;
    trace('transaction-begin');
    return { ok: true, id: transaction.id };
  }

  function setTransactionPhase(phase) {
    transaction.phase = phase || transaction.phase;
    trace('transaction-phase');
  }

  function endTransaction(result) {
    trace('transaction-end', { result: result || null });
    transaction.active = false;
    transaction.phase = null;
    transaction.lastCompletedAt = new Date().toISOString();
    transaction.startedAt = null;
  }

  function failTransaction(error, phase) {
    const failure = {
      ok: false,
      block: true,
      decision: ACTION_DECISIONS.runtimeError,
      reason: 'runtime-error',
      phase: phase || transaction.phase || 'unknown',
      message: error && error.message ? error.message : String(error),
      state: snapshot(),
      battleContext: contextSnapshot()
    };
    transaction.lastError = {
      phase: failure.phase,
      message: failure.message,
      at: new Date().toISOString()
    };
    trace('transaction-error', failure);
    return failure;
  }

  function guardedTransaction(phase, work) {
    const started = beginTransaction(phase);
    if (!started.ok) return started;

    let result;
    try {
      result = work();
      return result;
    } catch (error) {
      return failTransaction(error, transaction.phase || phase);
    } finally {
      endTransaction(result || null);
    }
  }

  function set(next, reason) {
    state.value = next || STATES.idle;
    state.reason = reason || null;
    state.updatedAt = new Date().toISOString();

    if (state.value === STATES.active || state.value === STATES.idle) {
      state.terminalProcessed = false;
    }

    emit();
    return snapshot();
  }

  function normalizeStartContext(encounterId, context) {
    if (encounterId && typeof encounterId === 'object') {
      context = encounterId;
      encounterId = context.encounterId || context.battleId || null;
    }

    context = context && typeof context === 'object' ? context : {};
    const resolvedEncounterId =
      encounterId ||
      context.encounterId ||
      context.battleId ||
      ('enc-' + Date.now());

    return {
      encounterId: String(resolvedEncounterId),
      wild: context.wild || context.enemy || context.defeated || null,
      lead: context.lead || context.recipient || context.playerSprite || null,
      context: Object.assign({}, context, {
        encounterId: String(resolvedEncounterId)
      })
    };
  }

  function start(encounterId, context) {
    battleContext = normalizeStartContext(encounterId, context);
    state.encounterId = battleContext.encounterId;
    state.terminalProcessed = false;
    state.turn = 0;
    transaction.active = false;
    transaction.phase = null;
    transaction.startedAt = null;
    safeDispatch('dd:battle-context-ready', contextSnapshot());
    return set(STATES.active, 'battle-start');
  }

  function updateContext(context) {
    if (!context || typeof context !== 'object') return contextSnapshot();

    const encounterId =
      context.encounterId ||
      context.battleId ||
      battleContext.encounterId ||
      state.encounterId ||
      null;

    battleContext = {
      encounterId: encounterId ? String(encounterId) : null,
      wild:
        context.wild ||
        context.enemy ||
        context.defeated ||
        battleContext.wild ||
        null,
      lead:
        context.lead ||
        context.recipient ||
        context.playerSprite ||
        battleContext.lead ||
        null,
      context: Object.assign(
        {},
        battleContext.context || {},
        context,
        encounterId ? { encounterId: String(encounterId) } : {}
      )
    };

    if (battleContext.encounterId && !state.encounterId) {
      state.encounterId = battleContext.encounterId;
    }

    safeDispatch('dd:battle-context-updated', contextSnapshot());
    return contextSnapshot();
  }

  function reset(reason) {
    state = createInitialState(reason);
    battleContext = createInitialContext();
    transaction.active = false;
    transaction.phase = null;
    transaction.startedAt = null;
    transaction.lastError = null;

    const switchRuntime = partySwitchRuntime();
    if (switchRuntime && typeof switchRuntime.clearRequirement === 'function') {
      try {
        switchRuntime.clearRequirement('battle-reset');
      } catch (error) {
        trace('switch-reset-error', {
          message: error && error.message ? error.message : String(error)
        });
      }
    }

    emit();
    return snapshot();
  }

  const isActive = () => state.value === STATES.active;
  const isTerminal = () => [
    STATES.victory,
    STATES.defeat,
    STATES.escaped,
    STATES.result
  ].includes(state.value);
  const canAct = () => isActive() && !state.terminalProcessed;

  function terminalPayload(value, extra) {
    const context = contextSnapshot();
    return Object.assign({
      ok: true,
      alreadyProcessed: false,
      state: snapshot(),
      value,
      encounterId: context.encounterId,
      wild: context.wild,
      lead: context.lead,
      context: context.context,
      battleContext: context
    }, extra || {});
  }

  function processTerminal(next, reason, handler, terminalContext) {
    if (state.terminalProcessed) {
      return Object.assign({
        ok: false,
        alreadyProcessed: true,
        state: snapshot()
      }, contextSnapshot());
    }

    if (terminalContext) updateContext(terminalContext);

    state.terminalProcessed = true;
    state.value = next || STATES.result;
    state.reason = reason || next;
    state.updatedAt = new Date().toISOString();
    emit();

    let value;
    if (typeof handler === 'function') {
      try {
        value = handler(snapshot(), contextSnapshot());
      } catch (error) {
        trace('terminal-handler-error', {
          message: error && error.message ? error.message : String(error)
        });
      }
    }

    if (value && typeof value === 'object') updateContext(value);

    const result = terminalPayload(value);
    safeDispatch('dd:battle-terminal', result);
    return result;
  }

  const victory = (reason, handler, terminalContext) =>
    processTerminal(STATES.victory, reason || 'wild-defeated', handler, terminalContext);
  const defeat = (reason, handler, terminalContext) =>
    processTerminal(STATES.defeat, reason || 'party-defeated', handler, terminalContext);
  const escaped = (reason, handler, terminalContext) =>
    processTerminal(STATES.escaped, reason || 'signal-lost', handler, terminalContext);

  function captureParticipants(actor, target, context) {
    context = context || {};
    const next = {};
    if (context.actorSide === 'player') next.lead = actor;
    if (context.actorSide === 'wild') next.wild = actor;
    if (context.targetSide === 'player') next.lead = target;
    if (context.targetSide === 'wild') next.wild = target;
    if (context.encounterId) next.encounterId = context.encounterId;
    if (Object.keys(next).length) updateContext(next);
    return next;
  }

  function applyStatusApplication(resolution, actor, target, context) {
    const application = resolution && resolution.statusApplication;
    if (!application || !application.applied) {
      return {
        ok: false,
        skipped: true,
        reason: application ? 'status-roll-failed' : 'no-status-application',
        application: application || null
      };
    }

    const runtime = statusRuntime();
    if (!runtime || typeof runtime.apply !== 'function') {
      return {
        ok: false,
        skipped: false,
        reason: 'status-runtime-unavailable',
        application
      };
    }

    const recipient = application.target === 'self' ? actor : target;
    if (!recipient) {
      return {
        ok: false,
        skipped: false,
        reason: 'status-target-unavailable',
        application
      };
    }

    let status;
    try {
      status = runtime.apply(recipient, application.id, {
        duration: application.durationTurns,
        stacks: application.stacks,
        data: Object.assign({}, application.data || {}, {
          encounterId: state.encounterId,
          turn: state.turn,
          side: application.target === 'self'
            ? context && context.actorSide || null
            : context && context.targetSide || null
        })
      });
    } catch (error) {
      return {
        ok: false,
        skipped: false,
        reason: 'status-runtime-error',
        message: error && error.message ? error.message : String(error),
        application
      };
    }

    const result = {
      ok: true,
      skipped: false,
      recipient,
      status,
      application
    };
    safeDispatch('dd:battle-status-applied', result);
    return result;
  }

  function clamp(number, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, Number(number) || 0));
  }

  function targetMaxHp(target) {
    return Math.max(1, Number(target && (target.maxHp || target.hp) || 1));
  }

  function applyHpDamage(target, resolution) {
    if (!target) {
      return {
        applied: false,
        before: null,
        after: null,
        damage: 0,
        fainted: false
      };
    }

    const before = clamp(
      Number(target.hp == null ? targetMaxHp(target) : target.hp),
      0,
      targetMaxHp(target)
    );
    const damage = resolution.actionBlocked || !resolution.hit
      ? 0
      : Math.max(0, Number(resolution.hpDamage || 0));
    const after = clamp(before - damage, 0, targetMaxHp(target));
    target.hp = after;

    return {
      applied: damage > 0,
      before,
      after,
      damage,
      fainted: after <= 0
    };
  }

  function applyDownloadPressure(target, resolution, context) {
    const pressure = resolution.actionBlocked || !resolution.hit
      ? 0
      : Math.max(0, Number(resolution.capturePressure || 0));

    if (!target || !context || context.targetSide !== 'wild' || pressure <= 0) {
      return {
        applied: false,
        pressure: 0,
        before: null,
        after: null
      };
    }

    const runtime = captureRuntime();
    if (!runtime || typeof runtime.odds !== 'function' || typeof runtime.setOdds !== 'function') {
      return {
        applied: false,
        pressure,
        before: null,
        after: null,
        reason: 'capture-runtime-unavailable'
      };
    }

    try {
      const before = Number(runtime.odds(target) || 0);
      runtime.setOdds(target, before + pressure);
      return {
        applied: true,
        pressure,
        before,
        after: Number(runtime.odds(target) || 0)
      };
    } catch (error) {
      return {
        applied: false,
        pressure,
        before: null,
        after: null,
        reason: 'capture-runtime-error',
        message: error && error.message ? error.message : String(error)
      };
    }
  }

  function persistParticipant(participant, side) {
    if (!participant || side !== 'player') {
      return {
        ok: true,
        skipped: true,
        reason: 'persistence-not-required'
      };
    }

    const runtime = partyRuntime();
    if (!runtime || typeof runtime.updateSprite !== 'function') {
      return {
        ok: false,
        skipped: false,
        reason: 'party-runtime-unavailable'
      };
    }

    try {
      return {
        ok: true,
        skipped: false,
        value: runtime.updateSprite(participant)
      };
    } catch (error) {
      return {
        ok: false,
        skipped: false,
        reason: 'party-runtime-error',
        message: error && error.message ? error.message : String(error)
      };
    }
  }

  function victoryBonus() {
    const rules = gameplayRules();
    return rules && Number.isFinite(Number(rules.wildDefeatDownloadBonus))
      ? Number(rules.wildDefeatDownloadBonus)
      : 3;
  }

  function applyWildDefeat(wild, tools, context) {
    if (!wild) return { ok: false, message: 'No wild signal.' };

    context = context || {};
    updateContext(Object.assign({}, context, { wild }));
    wild.hp = 0;

    let odds = null;
    const runtime = captureRuntime();

    try {
      if (runtime && typeof runtime.odds === 'function' && typeof runtime.setOdds === 'function') {
        const before = Number(runtime.odds(wild) || 0);
        runtime.setOdds(wild, before + victoryBonus());
        odds = Number(runtime.odds(wild) || 0);
      } else if (tools && typeof tools.setOdds === 'function' && typeof tools.odds === 'function') {
        const before = Number(tools.odds(wild) || 0);
        tools.setOdds(wild, before + victoryBonus());
        odds = Number(tools.odds(wild) || 0);
      }
    } catch (error) {
      trace('victory-bonus-error', {
        message: error && error.message ? error.message : String(error)
      });
    }

    return victory('wild-defeated', function () {
      return {
        wild,
        lead: battleContext.lead,
        encounterId: battleContext.encounterId,
        odds,
        message: (wild.name || 'Wild signal') +
          ' is defeated. Choose Download or Return.'
      };
    }, context);
  }

  function applyFaintSignalPenalty(wild, context) {
    if (!wild) {
      return {
        applied: false,
        collapsed: false,
        reason: 'missing-wild'
      };
    }

    const runtime = encounterRuntime();
    try {
      if (runtime && typeof runtime.onPlayerFaint === 'function') {
        const value = runtime.onPlayerFaint(wild, context || {});
        return Object.assign({
          applied: true,
          collapsed: Number(wild.stability || 0) <= 0
        }, value && typeof value === 'object' ? value : {});
      }
    } catch (error) {
      trace('faint-signal-error', {
        message: error && error.message ? error.message : String(error)
      });
    }

    const before = Number(wild.stability || 0);
    const after = Math.max(0, before - 1);
    wild.stability = after;
    return {
      applied: true,
      collapsed: after <= 0,
      amount: 1,
      before,
      after,
      compatibilityFallback: true
    };
  }

  function handleActorFaint(actor, context) {
    context = context && typeof context === 'object' ? context : {};
    if (!actor || Number(actor.hp || 0) > 0) {
      return {
        ok: false,
        handled: false,
        decision: ACTION_DECISIONS.allowed,
        reason: 'actor-not-fainted',
        state: snapshot(),
        battleContext: contextSnapshot()
      };
    }

    updateContext(Object.assign({}, context, { lead: actor }));

    const switchRuntime = partySwitchRuntime();
    const party = partyRuntime();
    let switchDecision;

    try {
      if (switchRuntime && typeof switchRuntime.requestForFaint === 'function') {
        switchDecision = switchRuntime.requestForFaint(actor, {
          reason: context.reason || 'active-sprite-fainted',
          lead: actor,
          activeSprite: actor,
          party: context.party || (
            party && typeof party.members === 'function'
              ? party.members()
              : undefined
          ),
          encounterId: context.encounterId || state.encounterId,
          wild: context.wild || battleContext.wild || null,
          source: OWNER
        });
      }
    } catch (error) {
      trace('switch-request-error', {
        message: error && error.message ? error.message : String(error)
      });
    }

    if (!switchDecision) {
      let hasReplacement = false;
      try {
        hasReplacement = !!(
          party &&
          typeof party.hasUsableMember === 'function' &&
          party.hasUsableMember({ excludeId: actor.id })
        );
      } catch (_) {}

      switchDecision = {
        ok: hasReplacement,
        switchRequired: hasReplacement,
        partyWiped: !hasReplacement,
        reason: hasReplacement ? 'active-sprite-fainted' : 'party-defeated',
        candidates: hasReplacement &&
          party &&
          typeof party.replacementCandidates === 'function'
            ? party.replacementCandidates(actor)
            : []
      };
    }

    if (switchDecision.partyWiped) {
      const terminal = defeat('party-defeated', null, {
        lead: actor,
        wild: context.wild || battleContext.wild || null,
        encounterId: context.encounterId || state.encounterId
      });

      const result = {
        ok: true,
        handled: true,
        decision: ACTION_DECISIONS.partyDefeated,
        reason: 'party-defeated',
        switchDecision,
        terminal,
        state: snapshot(),
        battleContext: contextSnapshot()
      };
      safeDispatch('dd:battle-action-decision', result);
      return result;
    }

    const result = {
      ok: true,
      handled: true,
      decision: ACTION_DECISIONS.switchRequired,
      reason: switchDecision.reason || 'active-sprite-fainted',
      switchDecision,
      terminal: null,
      state: snapshot(),
      battleContext: contextSnapshot()
    };
    safeDispatch('dd:battle-action-decision', result);
    return result;
  }

  function resolvePostResolutionDecision(actor, target, context) {
    context = context || {};
    const wild = context.targetSide === 'wild'
      ? target
      : context.actorSide === 'wild'
        ? actor
        : battleContext.wild;
    const lead = context.targetSide === 'player'
      ? target
      : context.actorSide === 'player'
        ? actor
        : battleContext.lead;

    if (wild && Number(wild.hp || 0) <= 0) {
      return {
        block: true,
        decision: ACTION_DECISIONS.wildDefeated,
        terminal: applyWildDefeat(wild, null, {
          wild,
          lead,
          encounterId: context.encounterId || state.encounterId
        })
      };
    }

    if (lead && Number(lead.hp || 0) <= 0) {
      const signalResult = applyFaintSignalPenalty(wild, {
        lead,
        wild,
        encounterId: context.encounterId || state.encounterId
      });

      if (signalResult.collapsed) {
        return {
          block: true,
          decision: ACTION_DECISIONS.battleInactive,
          reason: 'signal-lost',
          signalResult,
          terminal: escaped('signal-lost', null, {
            wild,
            lead,
            encounterId: context.encounterId || state.encounterId
          })
        };
      }

      return Object.assign({ block: true, signalResult }, handleActorFaint(lead, {
        wild,
        lead,
        party: context.party,
        encounterId: context.encounterId || state.encounterId,
        reason: 'active-sprite-fainted'
      }));
    }

    return {
      ok: true,
      block: false,
      decision: ACTION_DECISIONS.allowed,
      reason: null,
      state: snapshot(),
      battleContext: contextSnapshot()
    };
  }

  function applyResolution(resolution, actor, target, context) {
    return guardedTransaction('apply-resolution', function () {
      if (!resolution) return { ok: false, reason: 'missing-resolution' };

      context = context && typeof context === 'object' ? context : {};
      captureParticipants(actor, target, context);

      if (resolution.actionBlocked) {
        const blockedResult = {
          ok: true,
          resolution,
          actor,
          target,
          actionBlocked: true,
          hpResult: { applied: false, damage: 0, fainted: false },
          pressureResult: { applied: false, pressure: 0 },
          statusResult: { ok: false, skipped: true, reason: 'action-blocked' },
          persistenceResult: { ok: true, skipped: true, reason: 'action-blocked' },
          decision: {
            ok: true,
            block: false,
            decision: ACTION_DECISIONS.allowed
          },
          state: snapshot(),
          battleContext: contextSnapshot()
        };
        return blockedResult;
      }

      setTransactionPhase('apply-hp');
      const hpResult = applyHpDamage(target, resolution);

      setTransactionPhase('apply-pressure');
      const pressureResult = applyDownloadPressure(target, resolution, context);

      setTransactionPhase('apply-status');
      const statusResult = applyStatusApplication(
        resolution,
        actor,
        target,
        context
      );

      setTransactionPhase('persist-target');
      const persistenceResult = persistParticipant(target, context.targetSide);

      captureParticipants(actor, target, context);

      setTransactionPhase('post-resolution-decision');
      const decision = resolvePostResolutionDecision(actor, target, context);

      const result = {
        ok: true,
        resolution,
        actor,
        target,
        actionBlocked: false,
        hpResult,
        pressureResult,
        statusResult,
        persistenceResult,
        decision,
        state: snapshot(),
        battleContext: contextSnapshot()
      };
      return result;
    });
  }

  function evaluateActionState(input) {
    input = input && typeof input === 'object' ? input : {};
    const wild = input.wild || battleContext.wild || null;
    const actor = input.actor || input.lead || battleContext.lead || null;

    if (!wild || !actor) {
      const result = {
        ok: false,
        block: true,
        decision: ACTION_DECISIONS.missingContext,
        reason: !wild ? 'missing-wild' : 'missing-actor',
        state: snapshot(),
        battleContext: contextSnapshot()
      };
      safeDispatch('dd:battle-action-decision', result);
      return result;
    }

    updateContext({
      wild,
      lead: actor,
      encounterId: input.encounterId || state.encounterId
    });

    if (Number(wild.hp || 0) <= 0) {
      const terminal = !state.terminalProcessed
        ? applyWildDefeat(wild, null, {
            wild,
            lead: actor,
            encounterId: input.encounterId || state.encounterId
          })
        : null;

      const result = {
        ok: true,
        block: true,
        decision: ACTION_DECISIONS.wildDefeated,
        reason: 'wild-defeated',
        terminal,
        state: snapshot(),
        battleContext: contextSnapshot()
      };
      safeDispatch('dd:battle-action-decision', result);
      return result;
    }

    if (Number(actor.hp || 0) <= 0) {
      return Object.assign({ block: true }, handleActorFaint(
        actor,
        Object.assign({}, input, { wild })
      ));
    }

    if (!canAct()) {
      const result = {
        ok: false,
        block: true,
        decision: ACTION_DECISIONS.battleInactive,
        reason: state.value,
        state: snapshot(),
        battleContext: contextSnapshot()
      };
      safeDispatch('dd:battle-action-decision', result);
      return result;
    }

    if (transaction.active) {
      const result = {
        ok: false,
        block: true,
        decision: ACTION_DECISIONS.transactionBusy,
        reason: 'transaction-busy',
        activePhase: transaction.phase,
        state: snapshot(),
        battleContext: contextSnapshot()
      };
      safeDispatch('dd:battle-action-decision', result);
      return result;
    }

    const switchRuntime = partySwitchRuntime();
    try {
      if (
        switchRuntime &&
        typeof switchRuntime.isSwitchRequired === 'function' &&
        switchRuntime.isSwitchRequired()
      ) {
        const result = {
          ok: true,
          block: true,
          decision: ACTION_DECISIONS.switchRequired,
          reason: typeof switchRuntime.getReason === 'function'
            ? switchRuntime.getReason() || 'switch-required'
            : 'switch-required',
          switchDecision: typeof switchRuntime.snapshot === 'function'
            ? switchRuntime.snapshot()
            : null,
          state: snapshot(),
          battleContext: contextSnapshot()
        };
        safeDispatch('dd:battle-action-decision', result);
        return result;
      }
    } catch (error) {
      trace('switch-state-error', {
        message: error && error.message ? error.message : String(error)
      });
    }

    const result = {
      ok: true,
      block: false,
      decision: ACTION_DECISIONS.allowed,
      reason: null,
      state: snapshot(),
      battleContext: contextSnapshot()
    };
    safeDispatch('dd:battle-action-decision', result);
    return result;
  }

  function tickParticipant(participant, context) {
    const runtime = statusRuntime();
    if (!participant) return { ok: false, reason: 'missing-participant' };
    if (!runtime || typeof runtime.tick !== 'function') {
      return {
        ok: false,
        reason: 'status-runtime-unavailable',
        participant
      };
    }

    try {
      const outcome = runtime.tick(participant, context || {});
      return {
        ok: true,
        participant,
        outcome,
        statuses: outcome && outcome.statuses || participant.statusEffects || [],
        damage: outcome && outcome.effects
          ? outcome.effects.reduce(
              (sum, effect) => sum + Number(effect.damage || 0),
              0
            )
          : 0,
        fainted: !!(outcome && outcome.fainted)
      };
    } catch (error) {
      return {
        ok: false,
        participant,
        reason: 'status-runtime-error',
        message: error && error.message ? error.message : String(error),
        statuses: participant.statusEffects || [],
        damage: 0,
        fainted: Number(participant.hp || 0) <= 0
      };
    }
  }

  function participantSide(participant, context, index) {
    if (context && Array.isArray(context.participantSides)) {
      return context.participantSides[index];
    }
    if (participant && battleContext.lead === participant) return 'player';
    if (participant && battleContext.wild === participant) return 'wild';

    const effects = participant && participant.statusEffects;
    const storedSide = Array.isArray(effects) &&
      effects[0] &&
      effects[0].data &&
      effects[0].data.side;

    return storedSide || (index === 0 ? 'player' : 'wild');
  }

  function captureTickParticipants(ticks, context) {
    const update = {};
    ticks.forEach((tick, index) => {
      if (!tick || !tick.participant) return;
      const side = participantSide(tick.participant, context, index);
      if (side === 'player') update.lead = tick.participant;
      if (side === 'wild') update.wild = tick.participant;
    });
    if (Object.keys(update).length) updateContext(update);
  }

  function resolveStatusTerminal(ticks, context) {
    if (isTerminal()) return null;

    captureTickParticipants(ticks, context || {});
    const fainted = ticks.filter(tick => tick && tick.ok && tick.fainted);
    if (!fainted.length) return null;

    const sides = fainted.map(tick =>
      participantSide(tick.participant, context, ticks.indexOf(tick))
    );

    let result = null;
    if (sides.includes('wild') && sides.includes('player')) {
      result = processTerminal(STATES.result, 'status-double-faint');
    } else if (sides.includes('wild')) {
      result = applyWildDefeat(battleContext.wild, null, context || {});
    } else if (sides.includes('player')) {
      const playerTick = fainted.find(tick =>
        participantSide(
          tick.participant,
          context,
          ticks.indexOf(tick)
        ) === 'player'
      );
      result = handleActorFaint(
        playerTick && playerTick.participant,
        Object.assign({}, context || {}, {
          reason: 'status-player-fainted'
        })
      );
    }

    if (result) {
      safeDispatch('dd:battle-status-terminal', {
        result,
        ticks,
        sides,
        battleContext: contextSnapshot()
      });
    }
    return result;
  }

  function tickPhaseCore(participants, phase, context) {
    if (!canAct()) {
      return {
        ok: false,
        reason: state.value,
        phase,
        state: snapshot(),
        battleContext: contextSnapshot()
      };
    }

    const list = Array.isArray(participants)
      ? participants.filter(Boolean)
      : [participants].filter(Boolean);

    const ticks = [];
    for (let index = 0; index < list.length; index += 1) {
      setTransactionPhase('status-' + phase + '-' + index);
      ticks.push(tickParticipant(list[index], Object.assign({
        encounterId: state.encounterId,
        turn: state.turn,
        participantIndex: index,
        phase
      }, context || {})));
    }

    captureTickParticipants(ticks, context || {});
    const terminal = resolveStatusTerminal(ticks, context || {});

    const result = {
      ok: true,
      phase,
      ticks,
      terminal,
      state: snapshot(),
      battleContext: contextSnapshot()
    };
    return result;
  }

  function tickPhase(participants, phase, context) {
    return guardedTransaction('status-' + (phase || 'end'), function () {
      return tickPhaseCore(participants, phase || 'end', context || {});
    });
  }

  function beginTurn(participants, context) {
    return guardedTransaction('begin-turn', function () {
      if (!canAct()) {
        return {
          ok: false,
          reason: state.value,
          state: snapshot(),
          battleContext: contextSnapshot()
        };
      }

      state.turn += 1;
      state.updatedAt = new Date().toISOString();
      emit();
      setTransactionPhase('status-start');
      return tickPhaseCore(participants, 'start', context || {});
    });
  }

  function endTurn(participants, context) {
    return guardedTransaction('end-turn', function () {
      const list = Array.isArray(participants)
        ? participants.filter(Boolean)
        : [participants].filter(Boolean);
      const hasStatuses = list.some(participant =>
        Array.isArray(participant.statusEffects) &&
        participant.statusEffects.length > 0
      );
      if (!hasStatuses) {
        return {
          ok: true,
          phase: 'end',
          ticks: [],
          terminal: null,
          state: snapshot(),
          battleContext: contextSnapshot()
        };
      }
      return tickPhaseCore(participants, 'end', context || {});
    });
  }

  function applyResolutionLite(resolution, actor, target, context) {
    if (!resolution) return { ok: false, reason: 'missing-resolution' };
    context = context && typeof context === 'object' ? context : {};

    if (context.actorSide === 'player') battleContext.lead = actor;
    if (context.actorSide === 'wild') battleContext.wild = actor;
    if (context.targetSide === 'player') battleContext.lead = target;
    if (context.targetSide === 'wild') battleContext.wild = target;
    if (context.encounterId) {
      battleContext.encounterId = String(context.encounterId);
      state.encounterId = state.encounterId || battleContext.encounterId;
    }

    const hpResult = resolution.actionBlocked
      ? { applied: false, damage: 0, fainted: false }
      : applyHpDamage(target, resolution);
    const pressureResult = resolution.actionBlocked
      ? { applied: false, pressure: 0 }
      : applyDownloadPressure(target, resolution, context);
    const persistenceResult = resolution.actionBlocked
      ? { ok: true, skipped: true, reason: 'action-blocked' }
      : persistParticipant(target, context.targetSide);
    const decision = resolution.actionBlocked
      ? { ok: true, block: false, decision: ACTION_DECISIONS.allowed }
      : resolvePostResolutionDecision(actor, target, context);

    return {
      ok: true,
      resolution,
      actor,
      target,
      actionBlocked: !!resolution.actionBlocked,
      hpResult,
      pressureResult,
      statusResult: { ok: false, skipped: true, reason: 'recovery-lite-path' },
      persistenceResult,
      decision,
      state: snapshot(),
      battleContext: contextSnapshot()
    };
  }

  function tickTurn(participants, context) {
    return guardedTransaction('tick-turn', function () {
      if (!canAct()) {
        return {
          ok: false,
          reason: state.value,
          state: snapshot(),
          battleContext: contextSnapshot()
        };
      }

      state.turn += 1;
      state.updatedAt = new Date().toISOString();
      emit();

      setTransactionPhase('status-start');
      const startResult = tickPhaseCore(participants, 'start', context || {});
      if (startResult.terminal || !canAct()) {
        return {
          ok: true,
          turn: state.turn,
          start: startResult,
          end: null,
          terminal: startResult.terminal || null,
          state: snapshot(),
          battleContext: contextSnapshot()
        };
      }

      setTransactionPhase('status-end');
      const endResult = tickPhaseCore(participants, 'end', context || {});
      const result = {
        ok: true,
        turn: state.turn,
        start: startResult,
        end: endResult,
        ticks: endResult.ticks || [],
        terminal: endResult.terminal || null,
        state: snapshot(),
        battleContext: contextSnapshot()
      };
      safeDispatch('dd:battle-status-turn-ticked', result);
      return result;
    });
  }

  function shouldBlockAction(wild, actor) {
    const decision = evaluateActionState({ wild, actor });
    return {
      block: !!decision.block,
      reason: decision.reason,
      decision: decision.decision,
      state: decision.state,
      battleContext: decision.battleContext,
      switchDecision: decision.switchDecision || null,
      terminal: decision.terminal || null
    };
  }

  function diagnostics() {
    return {
      owner: OWNER,
      version: VERSION,
      state: snapshot(),
      battleContext: contextSnapshot(),
      transaction: transactionSnapshot()
    };
  }

  window.DD_BATTLE_STATE_RUNTIME = Object.freeze({
    version: VERSION,
    owner: OWNER,
    phase: '4.8-guarded-canonical-resolution-application',
    STATES,
    ACTION_DECISIONS,
    snapshot,
    contextSnapshot,
    transactionSnapshot,
    diagnostics,
    updateContext,
    set,
    start,
    reset,
    isActive,
    isTerminal,
    canAct,
    victory,
    defeat,
    escaped,
    applyStatusApplication,
    applyResolution,
    applyResolutionLite,
    applyHpDamage,
    applyDownloadPressure,
    applyWildDefeat,
    applyFaintSignalPenalty,
    persistParticipant,
    tickParticipant,
    tickPhase,
    beginTurn,
    endTurn,
    tickTurn,
    resolveStatusTerminal,
    evaluateActionState,
    resolvePostResolutionDecision,
    handleActorFaint,
    shouldBlockAction
  });

  safeDispatch('dd:battle-state-runtime-ready', {
    runtime: window.DD_BATTLE_STATE_RUNTIME,
    diagnostics: diagnostics()
  });
})();
