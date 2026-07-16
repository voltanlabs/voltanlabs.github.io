// assets/js/dd-battle-state-runtime.js
// Canonical battle state, status phases, terminal outcomes, and reward context propagation.
(function () {
  'use strict';

  const VERSION = '0.5.0';
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

  let battleContext = {
    encounterId: null,
    wild: null,
    lead: null,
    context: {}
  };

  const statusRuntime = () => window.DD_STATUS_RUNTIME || null;
  const snapshot = () => Object.assign({}, state);

  function contextSnapshot() {
    return {
      encounterId:
        battleContext.encounterId ||
        state.encounterId ||
        null,
      wild: battleContext.wild || null,
      lead: battleContext.lead || null,
      context: Object.assign(
        {},
        battleContext.context || {}
      )
    };
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
        {
          detail: Object.assign(
            {},
            snapshot(),
            {
              battleContext:
                contextSnapshot()
            }
          )
        }
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

  function normalizeStartContext(
    encounterId,
    context
  ) {
    if (
      encounterId &&
      typeof encounterId === 'object'
    ) {
      context = encounterId;
      encounterId =
        context.encounterId ||
        context.battleId ||
        null;
    }

    context =
      context &&
      typeof context === 'object'
        ? context
        : {};

    const resolvedEncounterId =
      encounterId ||
      context.encounterId ||
      context.battleId ||
      ('enc-' + Date.now());

    return {
      encounterId:
        String(resolvedEncounterId),
      wild:
        context.wild ||
        context.enemy ||
        context.defeated ||
        null,
      lead:
        context.lead ||
        context.recipient ||
        context.playerSprite ||
        null,
      context: Object.assign(
        {},
        context,
        {
          encounterId:
            String(resolvedEncounterId)
        }
      )
    };
  }

  function start(encounterId, context) {
    battleContext =
      normalizeStartContext(
        encounterId,
        context
      );

    state.encounterId =
      battleContext.encounterId;
    state.terminalProcessed = false;
    state.turn = 0;

    dispatch(
      'dd:battle-context-ready',
      contextSnapshot()
    );

    return set(
      STATES.active,
      'battle-start'
    );
  }

  function updateContext(context) {
    if (
      !context ||
      typeof context !== 'object'
    ) {
      return contextSnapshot();
    }

    const encounterId =
      context.encounterId ||
      context.battleId ||
      battleContext.encounterId ||
      state.encounterId ||
      null;

    battleContext = {
      encounterId:
        encounterId
          ? String(encounterId)
          : null,
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
        encounterId
          ? {
              encounterId:
                String(encounterId)
            }
          : {}
      )
    };

    if (
      battleContext.encounterId &&
      !state.encounterId
    ) {
      state.encounterId =
        battleContext.encounterId;
    }

    dispatch(
      'dd:battle-context-updated',
      contextSnapshot()
    );

    return contextSnapshot();
  }

  function reset(reason) {
    state = {
      value: STATES.idle,
      encounterId: null,
      terminalProcessed: false,
      reason: reason || null,
      turn: 0,
      updatedAt:
        new Date().toISOString()
    };

    battleContext = {
      encounterId: null,
      wild: null,
      lead: null,
      context: {}
    };

    emit();
    return snapshot();
  }

  const isActive =
    () => state.value === STATES.active;

  const isTerminal =
    () => [
      STATES.victory,
      STATES.defeat,
      STATES.escaped,
      STATES.result
    ].includes(state.value);

  const canAct =
    () =>
      isActive() &&
      !state.terminalProcessed;

  function terminalPayload(
    value,
    extra
  ) {
    const context =
      contextSnapshot();

    return Object.assign(
      {
        ok: true,
        alreadyProcessed: false,
        state: snapshot(),
        value,
        encounterId:
          context.encounterId,
        wild: context.wild,
        lead: context.lead,
        context: context.context,
        battleContext: context
      },
      extra || {}
    );
  }

  function processTerminal(
    next,
    reason,
    handler,
    terminalContext
  ) {
    if (state.terminalProcessed) {
      return Object.assign(
        {
          ok: false,
          alreadyProcessed: true,
          state: snapshot()
        },
        contextSnapshot()
      );
    }

    if (terminalContext) {
      updateContext(terminalContext);
    }

    state.terminalProcessed = true;
    state.value =
      next || STATES.result;
    state.reason = reason || next;
    state.updatedAt =
      new Date().toISOString();

    emit();

    let value;
    if (typeof handler === 'function') {
      value = handler(
        snapshot(),
        contextSnapshot()
      );
    }

    if (
      value &&
      typeof value === 'object'
    ) {
      updateContext(value);
    }

    const result =
      terminalPayload(value);

    dispatch(
      'dd:battle-terminal',
      result
    );

    return result;
  }

  const victory = (
    reason,
    handler,
    terminalContext
  ) =>
    processTerminal(
      STATES.victory,
      reason || 'wild-defeated',
      handler,
      terminalContext
    );

  const defeat = (
    reason,
    handler,
    terminalContext
  ) =>
    processTerminal(
      STATES.defeat,
      reason || 'party-defeated',
      handler,
      terminalContext
    );

  const escaped = (
    reason,
    handler,
    terminalContext
  ) =>
    processTerminal(
      STATES.escaped,
      reason || 'signal-lost',
      handler,
      terminalContext
    );

  function captureParticipants(
    actor,
    target,
    context
  ) {
    context = context || {};

    const actorSide =
      context.actorSide || null;
    const targetSide =
      context.targetSide || null;

    const next = {};

    if (actorSide === 'player') {
      next.lead = actor;
    } else if (actorSide === 'wild') {
      next.wild = actor;
    }

    if (targetSide === 'player') {
      next.lead = target;
    } else if (targetSide === 'wild') {
      next.wild = target;
    }

    if (context.encounterId) {
      next.encounterId =
        context.encounterId;
    }

    if (Object.keys(next).length) {
      updateContext(next);
    }
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
        application:
          application || null
      };
    }

    const runtime =
      statusRuntime();

    if (
      !runtime ||
      typeof runtime.apply !==
        'function'
    ) {
      return {
        ok: false,
        skipped: false,
        reason:
          'status-runtime-unavailable',
        application
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
        reason:
          'status-target-unavailable',
        application
      };
    }

    const status =
      runtime.apply(
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
                application.target ===
                  'self'
                  ? context &&
                    context.actorSide ||
                    null
                  : context &&
                    context.targetSide ||
                    null
            }
          )
        }
      );

    const result = {
      ok: true,
      skipped: false,
      recipient,
      status,
      application
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
        reason:
          'missing-resolution'
      };
    }

    context = context || {};

    captureParticipants(
      actor,
      target,
      context
    );

    const statusResult =
      applyStatusApplication(
        resolution,
        actor,
        target,
        context
      );

    const result = {
      ok: true,
      resolution,
      statusResult,
      actionBlocked:
        !!resolution.actionBlocked,
      state: snapshot(),
      battleContext:
        contextSnapshot()
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
    const runtime =
      statusRuntime();

    if (!participant) {
      return {
        ok: false,
        reason:
          'missing-participant'
      };
    }

    if (
      !runtime ||
      typeof runtime.tick !==
        'function'
    ) {
      return {
        ok: false,
        reason:
          'status-runtime-unavailable',
        participant
      };
    }

    const outcome =
      runtime.tick(
        participant,
        context || {}
      );

    return {
      ok: true,
      participant,
      outcome,
      statuses:
        outcome &&
        outcome.statuses ||
        participant.statusEffects ||
        [],
      damage:
        outcome &&
        outcome.effects
          ? outcome.effects.reduce(
              (sum, effect) =>
                sum +
                Number(
                  effect.damage || 0
                ),
              0
            )
          : 0,
      fainted:
        !!(
          outcome &&
          outcome.fainted
        )
    };
  }

  function participantSide(
    participant,
    context,
    index
  ) {
    if (
      context &&
      Array.isArray(
        context.participantSides
      )
    ) {
      return context
        .participantSides[index];
    }

    if (
      participant &&
      battleContext.lead ===
        participant
    ) {
      return 'player';
    }

    if (
      participant &&
      battleContext.wild ===
        participant
    ) {
      return 'wild';
    }

    const effects =
      participant &&
      participant.statusEffects;

    const storedSide =
      Array.isArray(effects) &&
      effects[0] &&
      effects[0].data &&
      effects[0].data.side;

    return storedSide || (
      index === 0
        ? 'player'
        : 'wild'
    );
  }

  function captureTickParticipants(
    ticks,
    context
  ) {
    const update = {};

    ticks.forEach(
      (tick, index) => {
        if (
          !tick ||
          !tick.participant
        ) {
          return;
        }

        const side =
          participantSide(
            tick.participant,
            context,
            index
          );

        if (side === 'player') {
          update.lead =
            tick.participant;
        } else if (
          side === 'wild'
        ) {
          update.wild =
            tick.participant;
        }
      }
    );

    if (Object.keys(update).length) {
      updateContext(update);
    }
  }

  function resolveStatusTerminal(
    ticks,
    context
  ) {
    if (isTerminal()) return null;

    captureTickParticipants(
      ticks,
      context || {}
    );

    const fainted =
      ticks.filter(
        tick =>
          tick &&
          tick.ok &&
          tick.fainted
      );

    if (!fainted.length) return null;

    const sides =
      fainted.map(tick =>
        participantSide(
          tick.participant,
          context,
          ticks.indexOf(tick)
        )
      );

    const wildFainted =
      sides.includes('wild');

    const playerFainted =
      sides.includes('player');

    let result = null;

    if (
      wildFainted &&
      playerFainted
    ) {
      result =
        processTerminal(
          STATES.result,
          'status-double-faint'
        );
    } else if (wildFainted) {
      result =
        victory(
          'status-wild-defeated'
        );
    } else if (
      playerFainted
    ) {
      result =
        defeat(
          'status-player-defeated'
        );
    }

    if (result) {
      dispatch(
        'dd:battle-status-terminal',
        {
          result,
          ticks,
          sides,
          battleContext:
            contextSnapshot()
        }
      );
    }

    return result;
  }

  function tickPhase(
    participants,
    phase,
    context
  ) {
    if (!canAct()) {
      return {
        ok: false,
        reason: state.value,
        phase,
        state: snapshot(),
        battleContext:
          contextSnapshot()
      };
    }

    const list =
      Array.isArray(participants)
        ? participants.filter(Boolean)
        : [participants].filter(
            Boolean
          );

    const ticks =
      list.map(
        function (
          participant,
          index
        ) {
          return tickParticipant(
            participant,
            Object.assign(
              {
                encounterId:
                  state.encounterId,
                turn:
                  state.turn,
                participantIndex:
                  index,
                phase
              },
              context || {}
            )
          );
        }
      );

    captureTickParticipants(
      ticks,
      context || {}
    );

    const terminal =
      resolveStatusTerminal(
        ticks,
        context || {}
      );

    const result = {
      ok: true,
      phase,
      ticks,
      terminal,
      state: snapshot(),
      battleContext:
        contextSnapshot()
    };

    dispatch(
      'dd:battle-status-phase-ticked',
      result
    );

    return result;
  }

  function beginTurn(
    participants,
    context
  ) {
    if (!canAct()) {
      return {
        ok: false,
        reason: state.value,
        state: snapshot(),
        battleContext:
          contextSnapshot()
      };
    }

    state.turn += 1;
    state.updatedAt =
      new Date().toISOString();
    emit();

    return tickPhase(
      participants,
      'start',
      context || {}
    );
  }

  const endTurn = (
    participants,
    context
  ) =>
    tickPhase(
      participants,
      'end',
      context || {}
    );

  function tickTurn(
    participants,
    context
  ) {
    if (!canAct()) {
      return {
        ok: false,
        reason: state.value,
        state: snapshot(),
        battleContext:
          contextSnapshot()
      };
    }

    const startResult =
      beginTurn(
        participants,
        context || {}
      );

    if (
      startResult.terminal ||
      !canAct()
    ) {
      return {
        ok: true,
        turn: state.turn,
        start: startResult,
        end: null,
        terminal:
          startResult.terminal ||
          null,
        state: snapshot(),
        battleContext:
          contextSnapshot()
      };
    }

    const endResult =
      endTurn(
        participants,
        context || {}
      );

    const result = {
      ok: true,
      turn: state.turn,
      start: startResult,
      end: endResult,
      ticks:
        endResult.ticks || [],
      terminal:
        endResult.terminal ||
        null,
      state: snapshot(),
      battleContext:
        contextSnapshot()
    };

    dispatch(
      'dd:battle-status-turn-ticked',
      result
    );

    return result;
  }

  function applyWildDefeat(
    wild,
    tools,
    context
  ) {
    if (!wild) {
      return {
        ok: false,
        message:
          'No wild signal.'
      };
    }

    updateContext(
      Object.assign(
        {},
        context || {},
        {
          wild
        }
      )
    );

    return victory(
      'wild-defeated',
      function () {
        wild.hp = 0;

        if (
          tools &&
          typeof tools
            .stabilizeSignal ===
            'function'
        ) {
          tools.stabilizeSignal(
            wild,
            1
          );
        }

        if (
          tools &&
          typeof tools.setOdds ===
            'function' &&
          typeof tools.odds ===
            'function'
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
          wild,
          lead:
            battleContext.lead,
          encounterId:
            battleContext.encounterId,
          odds:
            tools &&
            tools.odds
              ? tools.odds(wild)
              : null,
          message:
            wild.name +
            ' is defeated. Choose Download or Return.'
        };
      }
    );
  }

  function shouldBlockAction(
    wild,
    actor
  ) {
    if (!wild) {
      return {
        block: true,
        reason:
          'missing-wild'
      };
    }

    if (
      Number(wild.hp || 0) <= 0
    ) {
      return {
        block: true,
        reason:
          'wild-defeated'
      };
    }

    if (
      actor &&
      Number(actor.hp || 0) <= 0
    ) {
      return {
        block: true,
        reason:
          'actor-defeated'
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

  window.DD_BATTLE_STATE_RUNTIME =
    Object.freeze({
      version: VERSION,
      owner: OWNER,
      phase:
        '4.5-terminal-reward-context',
      STATES,
      snapshot,
      contextSnapshot,
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
      tickParticipant,
      tickPhase,
      beginTurn,
      endTurn,
      tickTurn,
      resolveStatusTerminal,
      applyWildDefeat,
      shouldBlockAction
    });

  document.dispatchEvent(
    new CustomEvent(
      'dd:battle-state-runtime-ready',
      {
        detail:
          window
            .DD_BATTLE_STATE_RUNTIME
      }
    )
  );
})();
