// assets/js/dd-studio-data-bridge.js
// Phase 2.4.1: connect Data Discovery to Studio game data, species, moves, and configuration chart.
(function () {
  'use strict';

  if (
    !location.pathname.includes('databyte-discovery') &&
    !location.pathname.includes('databytedex')
  ) return;

  var MANIFEST_URL = '/studio/databytesprites/game-data.v1.json';
  var FALLBACK_SPECIES_URL = '/studio/databytesprites/species.json';
  var FALLBACK_MOVES_URL = '/studio/databytesprites/moves.json';
  var FALLBACK_TYPE_URL = '/studio/databytesprites/type-chart.json';
  var baseRoster = Array.isArray(window.DD_CANON_ROSTER)
    ? window.DD_CANON_ROSTER.slice()
    : [];

  function normalizeName(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
  }

  function fetchJson(path) {
    return fetch(path, { cache: 'no-store' }).then(function (response) {
      if (!response.ok) throw new Error(path + ' HTTP ' + response.status);
      return response.json();
    });
  }

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

  function toStage(species) {
    var line = species && species.evolutionLine;
    if (!line || !line.stage) return null;
    return line.stage === 1
      ? 'Kilobyte'
      : line.stage === 2
        ? 'Megabyte'
        : line.stage === 3
          ? 'Gigabyte'
          : null;
  }

  function configurationsFor(species) {
    if (!species) return [];

    var values = [];
    values = values.concat(asArray(species.configuration));
    values = values.concat(asArray(species.configurations));
    values = values.concat(asArray(species.elements));
    values = values.concat(asArray(species.element));
    values = values.concat(asArray(species.type));
    values = values.concat(asArray(species.types));

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
        .map(function (value) {
          return String(value || '').trim();
        })
    );
  }

  function toType(species) {
    var configurations = configurationsFor(species);
    return configurations.length ? configurations.join(' / ') : null;
  }

  function toRarity(species, current) {
    var rarity = String((species && species.rarity) || '').trim();
    if (!rarity || rarity === 'TBD') return current;
    if (rarity.indexOf('Legendary') >= 0) return 'Legendary';
    if (rarity === 'Locked') return 'Locked';
    return rarity;
  }

  function allMoves(movesData) {
    return Array.isArray(movesData && movesData.moves)
      ? movesData.moves
      : [];
  }

  function moveSets(movesData) {
    return Array.isArray(movesData && movesData.speciesMoveSets)
      ? movesData.speciesMoveSets
      : [];
  }

  function movesForSpecies(speciesId, movesData) {
    var moves = allMoves(movesData);
    var sets = moveSets(movesData);
    var ids = ['signal-strike'];
    var set = sets.find(function (entry) {
      return entry.speciesId === speciesId;
    });

    if (set && Array.isArray(set.moves)) ids = set.moves.slice();

    return ids
      .map(function (moveId) {
        return moves.find(function (move) {
          return move.id === moveId;
        });
      })
      .filter(Boolean);
  }

  function overlaySprite(sprite, species, movesData) {
    if (!species) {
      return Object.assign({}, sprite, {
        moves: movesForSpecies(null, movesData)
      });
    }

    var stats = species.battleStats || {};
    var hp = Number(stats.hp || sprite.hp || 42);
    var attack = Number(stats.attack || sprite.atk || 12);
    var defense = Number(stats.defense || sprite.def || 8);
    var special = Number(stats.special || attack);
    var speed = Number(stats.speed || 8);
    var configurations = configurationsFor(species);

    return Object.assign({}, sprite, {
      studioId: species.id,
      status: species.status || sprite.status || 'canon-roster',
      configuration: configurations[0] || sprite.configuration || null,
      configurations: configurations.length
        ? configurations
        : asArray(sprite.configurations),
      elements: configurations.length
        ? configurations.slice()
        : asArray(sprite.elements),
      type: toType(species) || sprite.type,
      alignment: species.alignment || sprite.alignment || null,
      stage: toStage(species) || sprite.stage,
      rarity: toRarity(species, sprite.rarity),
      lore: species.lore || species.description || sprite.lore,
      discovery: species.discovery || sprite.discovery || null,
      capture: species.capture || sprite.capture || null,
      assetRefs: species.assetRefs || sprite.assetRefs || [],
      dexRefs: species.dexRefs || sprite.dexRefs || [],
      dependencies: species.dependencies || sprite.dependencies || [],
      moves: movesForSpecies(species.id, movesData),
      hp: hp,
      maxHp: hp,
      atk: attack,
      def: defense,
      special: special,
      speed: speed,
      studioSource: '/studio/databytesprites/species.json'
    });
  }

  function chartRecordCount(typeChart) {
    if (Array.isArray(typeChart && typeChart.configurations)) {
      return typeChart.configurations.length;
    }
    if (Array.isArray(typeChart && typeChart.rules)) {
      return typeChart.rules.length;
    }
    return 0;
  }

  function applyStudioData(manifest, speciesRecords, movesData, typeChart) {
    var byName = new Map();

    speciesRecords.forEach(function (species) {
      byName.set(normalizeName(species.name), species);
      byName.set(normalizeName(species.id), species);
    });

    var merged = baseRoster.map(function (sprite) {
      return overlaySprite(
        sprite,
        byName.get(normalizeName(sprite.name)),
        movesData
      );
    });

    window.DD_CANON_ROSTER = merged;
    window.DD_GAME_DATA_MANIFEST = manifest || null;
    window.DD_MOVE_INDEX = movesData || null;
    window.DD_TYPE_CHART = typeChart || null;

    window.DD_STUDIO_DATA_BRIDGE = {
      ok: true,
      phase: '2.4.1',
      manifest: manifest ? MANIFEST_URL : null,
      speciesSource:
        manifest &&
        manifest.sources &&
        manifest.sources.studioSpecies
          ? manifest.sources.studioSpecies.path
          : FALLBACK_SPECIES_URL,
      movesSource:
        manifest &&
        manifest.sources &&
        manifest.sources.moves
          ? manifest.sources.moves.path
          : FALLBACK_MOVES_URL,
      typeChartSource:
        manifest &&
        manifest.sources &&
        manifest.sources.typeChart
          ? manifest.sources.typeChart.path
          : FALLBACK_TYPE_URL,
      studioRecordCount: speciesRecords.length,
      moveCount: allMoves(movesData).length,
      typeRuleCount: chartRecordCount(typeChart),
      configurationCount: chartRecordCount(typeChart),
      playableRosterCount: merged.length,
      matchedCount: merged.filter(function (sprite) {
        return !!sprite.studioId;
      }).length,
      generatedAt: new Date().toISOString()
    };

    document.dispatchEvent(
      new CustomEvent('dd:studio-data-ready', {
        detail: window.DD_STUDIO_DATA_BRIDGE
      })
    );
  }

  function fail(error) {
    window.DD_STUDIO_DATA_BRIDGE = {
      ok: false,
      phase: '2.4.1',
      manifest: MANIFEST_URL,
      error: String(error),
      playableRosterCount: baseRoster.length,
      generatedAt: new Date().toISOString()
    };

    document.dispatchEvent(
      new CustomEvent('dd:studio-data-ready', {
        detail: window.DD_STUDIO_DATA_BRIDGE
      })
    );
  }

  fetchJson(MANIFEST_URL)
    .catch(function () {
      return null;
    })
    .then(function (manifest) {
      var speciesPath =
        manifest &&
        manifest.sources &&
        manifest.sources.studioSpecies
          ? manifest.sources.studioSpecies.path
          : FALLBACK_SPECIES_URL;

      var movesPath =
        manifest &&
        manifest.sources &&
        manifest.sources.moves
          ? manifest.sources.moves.path
          : FALLBACK_MOVES_URL;

      var typePath =
        manifest &&
        manifest.sources &&
        manifest.sources.typeChart
          ? manifest.sources.typeChart.path
          : FALLBACK_TYPE_URL;

      return Promise.all([
        fetchJson(speciesPath),
        fetchJson(movesPath).catch(function () {
          return { moves: [], speciesMoveSets: [] };
        }),
        fetchJson(typePath).catch(function () {
          return {
            configurations: [],
            alignments: [],
            multipliers: {
              strong: 1.25,
              neutral: 1,
              weak: 0.8,
              none: 0,
              captureBonus: 3
            }
          };
        })
      ]).then(function (results) {
        applyStudioData(
          manifest,
          Array.isArray(results[0].species) ? results[0].species : [],
          results[1],
          results[2]
        );
      });
    })
    .catch(fail);
})();
        
