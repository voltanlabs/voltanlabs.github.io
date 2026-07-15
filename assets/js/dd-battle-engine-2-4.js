// assets/js/dd-battle-engine-2-4.js
// Runtime recovery: canonical configuration lookup, battle feedback, enemy move scoring,
// compatibility helpers, and status-runtime delegation for Data Discovery v4.4.3.
(function () {
  'use strict';

  if (
    !location.pathname.includes('databyte-discovery') &&
    !location.pathname.includes('databytedex')
  ) return;

  var VERSION = '3.3.0';
  var OWNER = 'dd-battle-engine-2-4';
  var DEFAULT_MULTIPLIERS = Object.freeze({
    strong: 1.25,
    neutral: 1,
    weak: 0.8,
    none: 0,
    captureBonus: 3
  });

  var cache = {
    chart: null,
    source: null,
    byConfiguration: new Map()
  };

  function asArray(value) {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (value === null || value === undefined || value === '') return [];
    return [value];
  }

  function unique(values) {
    var seen = new Set();
    return values.filter(function (value) {
      var key = String(value || '').trim().toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function cleanName(value) {
    return String(value || '').trim();
  }

  function keyOf(value) {
    return cleanName(value).toLowerCase();
  }

  function dispatch(name, detail) {
    var payload = Object.assign(
      { version: VERSION, owner: OWNER, at: new Date().toISOString() },
      detail || {}
    );
    document.dispatchEvent(new CustomEvent(name, { detail: payload }));
    return payload;
  }

  function currentChart() {
    return window.DD_TYPE_CHART || null;
  }

  function setChart(chart) {
    cache.chart = chart || null;
    cache.source = chart || null;
    cache.byConfiguration = new Map();
    indexChart(cache.chart);
    return cache.chart;
  }

  function clearCache() {
    cache.chart = null;
    cache.source = null;
    cache.byConfiguration = new Map();
  }

  function ensureChart() {
    var source = currentChart();
    if (source !== cache.source) setChart(source);
    return cache.chart;
  }

  function indexChart(chart) {
    if (!chart || typeof chart !== 'object') return cache.byConfiguration;

    var authored = Array.isArray(chart.configurations)
      ? chart.configurations
      : [];

    authored.forEach(function (entry) {
      if (!entry || !entry.id) return;
      cache.byConfiguration.set(keyOf(entry.id), normalizeRule(entry));
    });

    // Legacy compatibility: older charts stored records in `rules`.
    if (Array.isArray(chart.rules)) {
      chart.rules.forEach(function (entry) {
        if (!entry) return;
        var id = entry.id || entry.attackingElement || entry.attackingType;
        if (!id || cache.byConfiguration.has(keyOf(id))) return;
        cache.byConfiguration.set(keyOf(id), normalizeLegacyRule(entry, id));
      });
    }

    return cache.byConfiguration;
  }

  function normalizeRule(entry) {
    return {
      id: cleanName(entry.id),
      strongAgainst: unique(asArray(entry.strongAgainst).map(cleanName)),
      weakAgainst: unique(asArray(entry.weakAgainst).map(cleanName)),
      noEffectAgainst: unique(
        asArray(entry.noEffectAgainst || entry.noneAgainst).map(cleanName)
      ),
      captureBonusAgainst: unique(
        asArray(entry.captureBonusAgainst).map(cleanName)
      )
    };
  }

  function normalizeLegacyRule(entry, id) {
    var strong = entry.strongAgainst || entry.superEffectiveAgainst || [];
    var weak = entry.weakAgainst || entry.notVeryEffectiveAgainst || [];
    var none = entry.noEffectAgainst || entry.immuneAgainst || [];
    var capture = entry.captureBonusAgainst || [];

    if (entry.defendingElement || entry.defendingType) {
      var defender = entry.defendingElement || entry.defendingType;
      var multiplier = Number(entry.multiplier);
      if (multiplier === 0) none = asArray(none).concat(defender);
      else if (multiplier > 1) strong = asArray(strong).concat(defender);
      else if (multiplier > 0 && multiplier < 1) weak = asArray(weak).concat(defender);
      if (Number(entry.captureBonus) > 0) {
        capture = asArray(capture).concat(defender);
      }
    }

    return normalizeRule({
      id: id,
      strongAgainst: strong,
      weakAgainst: weak,
      noEffectAgainst: none,
      captureBonusAgainst: capture
    });
  }

  function multipliers() {
    var chart = ensureChart();
    return Object.assign(
      {},
      DEFAULT_MULTIPLIERS,
      chart && chart.multipliers ? chart.multipliers : {}
    );
  }

  function extractConfigurations(subject) {
    if (!subject) return [];

    var values = [];
    values = values.concat(asArray(subject.configuration));
    values = values.concat(asArray(subject.configurations));
    values = values.concat(asArray(subject.elements));
    values = values.concat(asArray(subject.element));
    values = values.concat(asArray(subject.type));
    values = values.concat(asArray(subject.types));

    return unique(
      values
        .reduce(function (all, value) {
          if (typeof value === 'string' && value.indexOf('/') >= 0) {
            return all.concat(value.split('/'));
          }
          if (typeof value === 'string' && value.indexOf(',') >= 0) {
            return all.concat(value.split(','));
          }
          return all.concat(value);
        }, [])
        .map(cleanName)
    );
  }

  function moveConfigurations(move) {
    var configs = extractConfigurations(move);
    if (!configs.length) configs = ['Neutral'];
    return configs;
  }

  function targetConfigurations(target) {
    var configs = extractConfigurations(target);
    if (!configs.length) configs = ['Neutral'];
    return configs;
  }

  function containsName(list, value) {
    var wanted = keyOf(value);
    return asArray(list).some(function (item) {
      return keyOf(item) === wanted;
    });
  }

  function pairResult(attacking, defending) {
    ensureChart();
    var rule = cache.byConfiguration.get(keyOf(attacking));
    var mods = multipliers();
    var result = {
      attacking: attacking,
      defending: defending,
      label: 'neutral',
      multiplier: Number(mods.neutral || 1),
      captureBonus: 0,
      matched: false
    };

    if (!rule) return result;

    if (containsName(rule.noEffectAgainst, defending)) {
      result.label = 'none';
      result.multiplier = Number(mods.none || 0);
      result.matched = true;
    } else if (containsName(rule.strongAgainst, defending)) {
      result.label = 'strong';
      result.multiplier = Number(mods.strong || 1.25);
      result.matched = true;
    } else if (containsName(rule.weakAgainst, defending)) {
      result.label = 'weak';
      result.multiplier = Number(mods.weak || 0.8);
      result.matched = true;
    }

    if (containsName(rule.captureBonusAgainst, defending)) {
      result.captureBonus = Number(mods.captureBonus || 0);
      result.matched = true;
    }

    return result;
  }

  function resultPriority(label) {
    // Canonical dual-configuration precedence from the authored chart.
    if (label === 'none') return 4;
    if (label === 'strong') return 3;
    if (label === 'weak') return 2;
    return 1;
  }

  function feedbackFor(result) {
    if (!result) return {
      text: 'The configurations interacted normally.',
      tone: 'neutral',
      event: 'dd:battle:turn'
    };

    if (result.label === 'none') {
      return {
        text: 'No signal resonance.',
        tone: 'none',
        event: 'dd:battle:warn'
      };
    }
    if (result.label === 'strong') {
      return {
        text: 'Configuration advantage!',
        tone: 'strong',
        event: 'dd:battle:success'
      };
    }
    if (result.label === 'weak') {
      return {
        text: 'The configuration barely connected.',
        tone: 'weak',
        event: 'dd:battle:warn'
      };
    }
    if (Number(result.captureBonus || 0) > 0) {
      return {
        text: 'Signal resonance increased Download pressure!',
        tone: 'capture',
        event: 'dd:battle:success'
      };
    }
    return {
      text: 'The configurations interacted normally.',
      tone: 'neutral',
      event: 'dd:battle:turn'
    };
  }

  function typeResult(move, target) {
    var attackers = moveConfigurations(move);
    var defenders = targetConfigurations(target);
    var pairs = [];

    attackers.forEach(function (attacking) {
      defenders.forEach(function (defending) {
        pairs.push(pairResult(attacking, defending));
      });
    });

    var chosen = pairs.reduce(function (best, candidate) {
      if (!best) return candidate;
      var candidatePriority = resultPriority(candidate.label);
      var bestPriority = resultPriority(best.label);
      if (candidatePriority > bestPriority) return candidate;
      if (
        candidatePriority === bestPriority &&
        Number(candidate.captureBonus || 0) > Number(best.captureBonus || 0)
      ) return candidate;
      return best;
    }, null) || pairResult('Neutral', 'Neutral');

    var maxCaptureBonus = pairs.reduce(function (max, pair) {
      return Math.max(max, Number(pair.captureBonus || 0));
    }, 0);

    var result = {
      label: chosen.label,
      multiplier: Number(chosen.multiplier),
      captureBonus: maxCaptureBonus,
      attackingConfigurations: attackers,
      defendingConfigurations: defenders,
      matchedPair: {
        attacking: chosen.attacking,
        defending: chosen.defending
      },
      pairs: pairs,
      alignmentApplied: false
    };

    result.feedback = feedbackFor(result);
    return result;
  }

  function emitFeedback(result, context) {
    var feedback = feedbackFor(result);
    var detail = Object.assign(
      {
        text: feedback.text,
        tone: feedback.tone,
        typeResult: result
      },
      context || {}
    );
    dispatch(feedback.event, detail);
    dispatch('dd:battle:configuration-result', detail);
    return detail;
  }

  function normalizeMove(move) {
    var normalized = Object.assign(
      {
        id: 'signal-strike',
        name: 'Signal Strike',
        power: 24,
        accuracy: 92,
        captureEffect: 1,
        configuration: 'Neutral',
        moveType: 'attack'
      },
      move || {}
    );

    var rules = window.DD_GAMEPLAY_RULES;
    if (rules && typeof rules.tuneMove === 'function') {
      normalized = rules.tuneMove(normalized);
    }

    normalized.configurations = moveConfigurations(normalized);
    normalized.elements = normalized.configurations.slice();
    return normalized;
  }

  function stableHash(text) {
    text = String(text || 'battle');
    var hash = 2166136261;
    for (var index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash +=
        (hash << 1) +
        (hash << 4) +
        (hash << 7) +
        (hash << 8) +
        (hash << 24);
    }
    return Math.abs(hash >>> 0);
  }

  function scoreMove(move, enemy, target) {
    var normalized = normalizeMove(move);
    var result = typeResult(normalized, target);
    var power = Number(normalized.power || 0);
    var accuracy = Number(normalized.accuracy || 90) / 100;
    var capture = Number(normalized.captureEffect || 0);
    var score = power * accuracy * Number(result.multiplier || 1);

    if (Number(target && (target.hp || target.maxHp) || 0) <= 8) {
      score += power * 0.15;
    }
    if (Number(enemy && enemy.stability || 10) <= 3) {
      score += capture * 2;
    }
    if (result.label === 'none') score = -1000;
    score += Number(result.captureBonus || 0) * 0.5;

    return {
      move: normalized,
      score: score,
      typeResult: result
    };
  }

  function chooseEnemyMove(enemy, target) {
    enemy = enemy || {};
    var moves = Array.isArray(enemy.moves) && enemy.moves.length
      ? enemy.moves
      : [normalizeMove()];

    var ranked = moves
      .map(function (move) {
        return scoreMove(move, enemy, target || {});
      })
      .sort(function (left, right) {
        return right.score - left.score;
      });

    if (!ranked.length) return normalizeMove();

    var seed = [
      enemy.id || enemy.name || 'enemy',
      target && (target.id || target.name) || 'target',
      Math.floor(Date.now() / 750)
    ].join('|');
    var roll = stableHash(seed) % 100;

    // Prefer the best move while allowing a smaller amount of tactical variation.
    var selected = ranked[0];
    if (ranked.length > 1 && roll >= 78) selected = ranked[1];
    if (ranked.length > 2 && roll >= 94) selected = ranked[2];

    dispatch('dd:battle:enemy-move-selected', {
      enemyId: enemy.id || null,
      moveId: selected.move.id || null,
      score: selected.score,
      typeResult: selected.typeResult
    });

    return selected.move;
  }

  function statusRuntime() {
    return window.DD_STATUS_RUNTIME || null;
  }

  function applyStatus(target, status, options) {
    var runtime = statusRuntime();
    if (!runtime || typeof runtime.apply !== 'function') {
      return {
        ok: false,
        delegated: true,
        reason: 'status-runtime-unavailable',
        target: target || null,
        status: status || null
      };
    }
    return runtime.apply(target, status, options || {});
  }

  function removeStatus(target, status, options) {
    var runtime = statusRuntime();
    if (!runtime || typeof runtime.remove !== 'function') {
      return {
        ok: false,
        delegated: true,
        reason: 'status-runtime-unavailable',
        target: target || null,
        status: status || null
      };
    }
    return runtime.remove(target, status, options || {});
  }

  function tickStatuses(target, context) {
    var runtime = statusRuntime();
    if (!runtime || typeof runtime.tick !== 'function') {
      return {
        ok: false,
        delegated: true,
        reason: 'status-runtime-unavailable',
        target: target || null
      };
    }
    return runtime.tick(target, context || {});
  }

  function health() {
    ensureChart();
    return {
      version: VERSION,
      owner: OWNER,
      chartAvailable: !!cache.chart,
      configurationCount: cache.byConfiguration.size,
      statusRuntimeAvailable: !!statusRuntime(),
      resolverContract: {
        typeResult: true,
        chooseEnemyMove: true
      }
    };
  }

  function boot() {
    ensureChart();

    window.DDBattle24 = Object.freeze({
      version: VERSION,
      owner: OWNER,
      role: 'configuration-feedback-and-compatibility-helper',
      getChart: ensureChart,
      setChart: setChart,
      clearCache: clearCache,
      extractConfigurations: extractConfigurations,
      moveConfigurations: moveConfigurations,
      targetConfigurations: targetConfigurations,
      typeResult: typeResult,
      pairResult: pairResult,
      feedbackFor: feedbackFor,
      emitFeedback: emitFeedback,
      normalizeMove: normalizeMove,
      scoreMove: scoreMove,
      chooseEnemyMove: chooseEnemyMove,
      applyStatus: applyStatus,
      removeStatus: removeStatus,
      tickStatuses: tickStatuses,
      health: health
    });

    dispatch('dd:battle-engine-ready', health());
    return window.DDBattle24;
  }

  document.addEventListener('dd:studio-data-ready', function () {
    clearCache();
    ensureChart();
    dispatch('dd:battle-chart-ready', health());
  });

  document.addEventListener('dd:status-runtime-ready', function () {
    dispatch('dd:battle-status-delegate-ready', health());
  });

  boot();
})();
    
