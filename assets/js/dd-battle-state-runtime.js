// assets/js/dd-battle-state-runtime.js
// Phase 3.9: canonical battle state transitions plus status application and turn-boundary ticking.
(function () {
  'use strict';

  const VERSION = '0.3.0';
  const OWNER = 'dd-battle-state-runtime';

  const STATES = Object.freeze({
    idle: 'idle',
    active: 'active',
    victory: 'victory',
    defeat: 'defeat',
    escaped: 'escaped',
    result: 'result'
  });

  let state = {
    value: STATES.idle,
    encounterId: null,
    terminalProcessed: false,
    reason: null,
    turn: 0,
    updatedAt: new Date().toISOString()
  };

  function statusRuntime() {
    return window.DD_STATUS_RUNTIME || null;
  }

  function snapshot() {
    return Object.assign({}, state);
  }

  function dispatch(name, detail) {
    document.dispatchEvent(
      new CustomEvent(name, {
        detail: Object.assign(
          {
            owner: OWNER,
            version: VERSION,
            at: new Date().toISOString()
          },
          detail || {}
        )
      })
    );
  }

  function emit() {
    document.dispatchEvent(
      new CustomEvent(
        'dd:battle-state-change',
        { detail: snapshot() }
      )
    );
  }

  function set(next, reason) {
    state.value = next || STATES.idle;
    state.reason = reason || null;
    state.updatedAt =
      new Date().toISOString();

    if (
      state.value === STATES.active ||
      state.value === STATES.idle
    ) {
      state.terminalProcessed = false;
    }

    emit();
    return snapshot();
  }

  function start(encounterId) {
    state.encounterId =
      encounterId ||
      ('enc-' + Date.now());
    state.terminalProcessed = false;
    state.turn = 0;
    return set(
      STATES.active,
      'battle-start'
    );
  }

  function reset(reason) {
    state = {
      value: STATES.idle,
      encounterId: null,
      terminalProcessed: false,
      reason: reason || null,
      turn: 0,
      updatedAt: new Date().toISOString()
    };
    emit();
    return snapshot();
  }

  function isActive() {
    return state.value === STATES.active;
  }

  function isTerminal() {
    return [
      STATES.victory,
      STATES.defeat,
      STATES.escaped,
      STATES.result
    ].includes(state.value);
  }

  function canAct() {
    return (
      isActive() &&
      !state.terminalProcessed
    );
  }

  function processTerminal(
    next,
    reason,
    handler
  ) {
    if (state.terminalProcessed) {
      return {
        ok: false,
        alreadyProcessed: true,
        state: snapshot()
      };
    }

    state.terminalProcessed = true;
    set(next, reason || next);

    let value;
    if (typeof handler === 'function') {
      value = handler(snapshot());
    }

    return {
      ok: true,
      alreadyProcessed: false,
      state: snapshot(),
      value: value
    };
  }

  function victory(reason, handler) {
    return processTerminal(
      STATES.victory,
      reason || 'wild-defeated',
      handler
    );
  }

  function defeat(reason, handler) {
    return processTerminal(
      STATES.defeat,
      reason || 'party-defeated',
      handler
    );
  }

  function escaped(reason, handler) {
    return processTerminal(
      STATES.escaped,
      reason || 'signal-lost',
      handler
    );
  }

  function applyStatusApplication(
    resolution,
    actor,
    target,
    context
  ) {
    const application =
      resolution &&
      resolution.statusApplication;

    if (
      !application ||
      !application.applied
    ) {
      return {
        ok: false,
        skipped: true,
        reason: application
          ? 'status-roll-failed'
          : 'no-status-application',
        application: application || null
      };
    }

    const runtime = statusRuntime();
    if (
      !runtime ||
      typeof runtime.apply !== 'function'
    ) {
      return {
        ok: false,
        skipped: false,
        reason: 'status-runtime-unavailable',
        application: application
      };
    }

    const recipient =
      application.target === 'self'
        ? actor
        : target;

    if (!recipient) {
      return {
        ok: false,
        skipped: false,
        reason: 'status-target-unavailable',
        application: application
      };
    }

    const status = runtime.apply(
      recipient,
      application.id,
      {
        duration:
          application.durationTurns,
        stacks:
          application.stacks,
        data: Object.assign(
          {},
          application.data || {},
          {
            encounterId:
              state.encounterId,
            turn: state.turn,
            side:
              application.target === 'self'
                ? context && context.actorSide || null
                : context && context.targetSide || null
          }
        )
      }
    );

    const result = {
      ok: true,
      skipped: false,
      recipient: recipient,
      status: status,
      application: application
    };

    dispatch(
      'dd:battle-status-applied',
      result
    );

    return result;
  }

  function applyResolution(
    resolution,
    actor,
    target,
    context
  ) {
    if (!resolution) {
      return {
        ok: false,
        reason: 'missing-resolution'
      };
    }

    const statusResult =
      applyStatusApplication(
        resolution,
        actor,
        target,
        context || {}
      );

    const result = {
      ok: true,
      resolution: resolution,
      statusResult: statusResult,
      state: snapshot()
    };

    dispatch(
      'dd:battle-resolution-applied',
      result
    );

    return result;
  }

  function tickParticipant(
    participant,
    context
  ) {
    const runtime = statusRuntime();

    if (!participant) {
      return {
        ok: false,
        reason: 'missing-participant'
      };
    }

    if (
      !runtime ||
      typeof runtime.tick !== 'function'
    ) {
      return {
        ok: false,
        reason: 'status-runtime-unavailable',
        participant: participant
      };
    }

    return {
      ok: true,
      participant: participant,
      statuses: runtime.tick(
        participant,
        context || {}
      )
    };
  }

  function tickTurn(
    participants,
    context
  ) {
    if (!canAct()) {
      return {
        ok: false,
        reason: state.value,
        state: snapshot()
      };
    }

    state.turn += 1;
    state.updatedAt =
      new Date().toISOString();

    const list = Array.isArray(participants)
      ? participants.filter(Boolean)
      : [participants].filter(Boolean);

    const ticks = list.map(
      function (participant, index) {
        return tickParticipant(
          participant,
          Object.assign(
            {
              encounterId:
                state.encounterId,
              turn: state.turn,
              participantIndex: index
            },
            context || {}
          )
        );
      }
    );

    emit();

    const result = {
      ok: true,
      turn: state.turn,
      ticks: ticks,
      state: snapshot()
    };

    dispatch(
      'dd:battle-status-turn-ticked',
      result
    );

    return result;
  }

  function applyWildDefeat(wild, tools) {
    if (!wild) {
      return {
        ok: false,
        message: 'No wild signal.'
      };
    }

    return victory(
      'wild-defeated',
      function () {
        wild.hp = 0;

        if (
          tools &&
          typeof tools.stabilizeSignal ===
            'function'
        ) {
          tools.stabilizeSignal(wild, 1);
        }

        if (
          tools &&
          typeof tools.setOdds === 'function' &&
          typeof tools.odds === 'function'
        ) {
          tools.setOdds(
            wild,
            tools.odds(wild) +
              Number(
                tools.bonus == null
                  ? 3
                  : tools.bonus
              )
          );
        }

        return {
          wild: wild,
          odds:
            tools && tools.odds
              ? tools.odds(wild)
              : null,
          message:
            wild.name +
            ' is defeated. Choose Download or Return.'
        };
      }
    );
  }

  function shouldBlockAction(wild) {
    if (!wild) {
      return {
        block: true,
        reason: 'missing-wild'
      };
    }

    if (Number(wild.hp || 0) <= 0) {
      return {
        block: true,
        reason: 'wild-defeated'
      };
    }

    if (!canAct()) {
      return {
        block: true,
        reason: state.value
      };
    }

    return {
      block: false,
      reason: null
    };
  }

  window.DD_BATTLE_STATE_RUNTIME = {
    version: VERSION,
    owner: OWNER,
    phase:
      '3.9-status-battle-integration',
    STATES: STATES,
    snapshot: snapshot,
    set: set,
    start: start,
    reset: reset,
    isActive: isActive,
    isTerminal: isTerminal,
    canAct: canAct,
    victory: victory,
    defeat: defeat,
    escaped: escaped,
    applyStatusApplication:
      applyStatusApplication,
    applyResolution: applyResolution,
    tickParticipant: tickParticipant,
    tickTurn: tickTurn,
    applyWildDefeat: applyWildDefeat,
    shouldBlockAction:
      shouldBlockAction
  };

  document.dispatchEvent(
    new CustomEvent(
      'dd:battle-state-runtime-ready',
      {
        detail:
          window.DD_BATTLE_STATE_RUNTIME
      }
    )
  );
})();
 
