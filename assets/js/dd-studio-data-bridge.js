// assets/js/dd-studio-data-bridge.js
// Phase 2.3: connect Data Discovery to the Studio game-data manifest.
(function () {
  if (!location.pathname.includes('databyte-discovery') && !location.pathname.includes('databytedex')) return;

  var MANIFEST_URL = '/studio/databytesprites/game-data.v1.json';
  var FALLBACK_SPECIES_URL = '/studio/databytesprites/species.json';
  var baseRoster = Array.isArray(window.DD_CANON_ROSTER) ? window.DD_CANON_ROSTER.slice() : [];

  function normalizeName(value) {
    return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  function fetchJson(path) {
    return fetch(path, { cache: 'no-store' }).then(function (response) {
      if (!response.ok) throw new Error(path + ' HTTP ' + response.status);
      return response.json();
    });
  }

  function toStage(species) {
    var line = species && species.evolutionLine;
    if (!line || !line.stage) return null;
    return line.stage === 1 ? 'Kilobyte' : line.stage === 2 ? 'Megabyte' : line.stage === 3 ? 'Gigabyte' : null;
  }

  function toType(species) {
    return Array.isArray(species.elements) && species.elements.length ? species.elements.join(' / ') : null;
  }

  function toRarity(species, current) {
    var rarity = String((species && species.rarity) || '').trim();
    if (!rarity || rarity === 'TBD') return current;
    if (rarity.indexOf('Legendary') >= 0) return 'Legendary';
    if (rarity === 'Locked') return 'Locked';
    return rarity;
  }

  function overlaySprite(sprite, species) {
    if (!species) return sprite;
    var stats = species.battleStats || {};
    var hp = Number(stats.hp || sprite.hp || 42);
    var attack = Number(stats.attack || sprite.atk || 12);
    var defense = Number(stats.defense || sprite.def || 8);
    var special = Number(stats.special || attack);
    var speed = Number(stats.speed || 8);
    return Object.assign({}, sprite, {
      studioId: species.id,
      status: species.status || sprite.status || 'canon-roster',
      type: toType(species) || sprite.type,
      stage: toStage(species) || sprite.stage,
      rarity: toRarity(species, sprite.rarity),
      lore: species.lore || species.description || sprite.lore,
      discovery: species.discovery || sprite.discovery || null,
      capture: species.capture || sprite.capture || null,
      assetRefs: species.assetRefs || sprite.assetRefs || [],
      dexRefs: species.dexRefs || sprite.dexRefs || [],
      dependencies: species.dependencies || sprite.dependencies || [],
      hp: hp,
      maxHp: hp,
      atk: attack,
      def: defense,
      special: special,
      speed: speed,
      studioSource: '/studio/databytesprites/species.json'
    });
  }

  function applyStudioData(manifest, speciesRecords) {
    var byName = new Map();
    speciesRecords.forEach(function (species) {
      byName.set(normalizeName(species.name), species);
      byName.set(normalizeName(species.id), species);
    });

    var merged = baseRoster.map(function (sprite) {
      return overlaySprite(sprite, byName.get(normalizeName(sprite.name)));
    });

    window.DD_CANON_ROSTER = merged;
    window.DD_GAME_DATA_MANIFEST = manifest || null;
    window.DD_STUDIO_DATA_BRIDGE = {
      ok: true,
      phase: '2.3',
      manifest: manifest ? MANIFEST_URL : null,
      speciesSource: manifest && manifest.sources && manifest.sources.studioSpecies ? manifest.sources.studioSpecies.path : FALLBACK_SPECIES_URL,
      studioRecordCount: speciesRecords.length,
      playableRosterCount: merged.length,
      matchedCount: merged.filter(function (sprite) { return !!sprite.studioId; }).length,
      generatedAt: new Date().toISOString()
    };
    document.dispatchEvent(new CustomEvent('dd:studio-data-ready', { detail: window.DD_STUDIO_DATA_BRIDGE }));
  }

  function fail(error) {
    window.DD_STUDIO_DATA_BRIDGE = {
      ok: false,
      phase: '2.3',
      manifest: MANIFEST_URL,
      error: String(error),
      playableRosterCount: baseRoster.length,
      generatedAt: new Date().toISOString()
    };
    document.dispatchEvent(new CustomEvent('dd:studio-data-ready', { detail: window.DD_STUDIO_DATA_BRIDGE }));
  }

  fetchJson(MANIFEST_URL)
    .catch(function () { return null; })
    .then(function (manifest) {
      var speciesPath = manifest && manifest.sources && manifest.sources.studioSpecies ? manifest.sources.studioSpecies.path : FALLBACK_SPECIES_URL;
      return fetchJson(speciesPath).then(function (speciesData) {
        applyStudioData(manifest, Array.isArray(speciesData.species) ? speciesData.species : []);
      });
    })
    .catch(fail);
})();
