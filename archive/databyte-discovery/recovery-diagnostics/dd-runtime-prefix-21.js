/* Generated Data Discovery runtime bundle.
 * Do not edit directly. Run: node studio/tools/build-data-discovery-runtime.mjs
 * Inputs: 21
 */

/* ---- assets/js/dd-canon-roster.js ---- */
// assets/js/dd-canon-roster.js
// Shared DataByteSprites canon roster for Data Discovery, DataByteDex, and Studio indexing.
// Canon model: one required alignment plus one or two configurations as they Version Upgrade.
(function(){
  const ALIGNMENTS=['Pristine','Stained','Null'];
  const CONFIGURATIONS=['Mystic','Voltricity','Acoustic','Torrent','Thermal','Organic','Malware','Analog','Quantum','Financial','Temporal','Spam','Cryo','Alloy','Spectral','Cipher','Neural','Celestial','Aether','Seismic'];

  const colors={
    Pristine:'#BAE6FD',Stained:'#FB7185',Null:'#64748B',Mystic:'#A78BFA',Voltricity:'#FFD700',
    Acoustic:'#F9A8D4',Torrent:'#38BDF8',Thermal:'#F97316',Organic:'#22C55E',Malware:'#EF4444',
    Analog:'#FB923C',Quantum:'#818CF8',Financial:'#34D399',Temporal:'#FACC15',Spam:'#F472B6',
    Cryo:'#67E8F9',Alloy:'#CBD5E1',Spectral:'#C084FC',Cipher:'#2DD4BF',Neural:'#A78BFA',
    Celestial:'#60A5FA',Aether:'#93C5FD',Seismic:'#A3E635',Unassigned:'#38BDF8'
  };

  function rarity(version,alignment,name){
    if(name==='Leovolt')return 'Legendary';
    if(version==='Terabyte')return 'Mythic';
    if(version==='Gigabyte')return 'Epic';
    if(version==='Megabyte')return 'Rare';
    if(alignment==='Stained')return 'Uncommon';
    if(alignment==='Null')return 'Rare';
    return 'Common';
  }
  function chance(value){return value==='Mythic'?42:value==='Legendary'?55:value==='Epic'?62:value==='Rare'?72:value==='Uncommon'?80:88}
  function stability(value){return value==='Mythic'?7:value==='Legendary'?6:value==='Epic'?5:value==='Rare'?4:3}
  function icon(name,configs){
    if(name.startsWith('Leo'))return '🦁';
    if(name.includes('Crab'))return '🦀';
    if(name.includes('Scorp'))return '🦂';
    if(name.includes('Goat')||name.includes('Ram'))return '🐐';
    if(name.includes('Pig')||name.includes('Swine')||name.includes('Pork'))return '🐷';
    if(name.includes('Calf')||name.includes('Cow')||name.includes('Bull'))return '🐂';
    if(name.includes('Crow'))return '🐦‍⬛';
    if(name.includes('Dawg')||name.includes('Mutt')||name.includes('Hound')||name.includes('Pup')||name.includes('Wolf')||name.includes('Lupin'))return '🐶';
    if(name.toLowerCase().includes('fish')||name.includes('Shark')||name.includes('WHALE')||name.startsWith('Aquo'))return '🐟';
    if(name.includes('Troll')||name.includes('Technoblin'))return '👹';
    if(name.includes('Clock')||name.includes('gator')||name.includes('Gator'))return '🐊';
    if(name.toLowerCase().includes('wyrm'))return '🐉';
    if(name.includes('Screen')||name.includes('Monitor'))return '🖥️';
    if(name.includes('Mirror'))return '🪞';
    if(name.includes('Bear'))return '🐻';
    if(name.includes('Pigeon'))return '🐦';
    if(name.includes('Cable')||name.includes('optopus'))return '🐙';
    if(name.includes('Cassette'))return '📼';
    if(name.includes('Disk'))return '💾';
    if(name.includes('Gem'))return '💎';
    if(name.includes('Centa')||name.includes('Colt')||name.includes('Quiver'))return '🏹';
    if(configs.includes('Voltricity'))return '⚡';
    if(configs.includes('Financial'))return '💰';
    if(configs.includes('Thermal'))return '🔥';
    if(configs.includes('Mystic'))return '✨';
    return '◇';
  }

  // [dex, name, alignment, configurations, version, familyId, zodiac, description]
  const raw=[
    ['001','Leovolt','Pristine',['Voltricity'],'Kilobyte','leo-family','Leo','Lion cub with blue electric fur, circuit lines, and a lightning bolt tail.'],
    ['002','Leothor','Pristine',['Voltricity'],'Megabyte','leo-family','Leo','Adolescent lion with blue electric fur, circuit lines, and a lightning bolt tail.'],
    ['003','Leozues','Pristine',['Voltricity'],'Gigabyte','leo-family','Leo','Full-grown lion with blue electric fur, an energy-charged mane, and a larger lightning-bolt tail.'],
    ['004','Crabician','Null',['Mystic'],'Kilobyte','crabician-family','Cancer','Apprentice mage crab.'],
    ['005','Crabizard','Null',['Mystic'],'Megabyte','crabician-family','Cancer','Full-fledged wizard crab.'],
    ['006','Crabzaster','Null',['Mystic'],'Gigabyte','crabician-family','Cancer','Sorcerer Supreme master crab.'],
    ['007','Scorpyone','Stained',['Alloy'],'Kilobyte','scorpy-family','Scorpio','One-eyed orange robotic Stained scorpion.'],
    ['008','Scorpytwo','Stained',['Alloy'],'Megabyte','scorpy-family','Scorpio','Robotic scorpion-and-spider duo representing Stained and Pristine data.'],
    ['009','Scorpyus','Stained',['Alloy'],'Gigabyte','scorpy-family','Scorpio','Combined robotic form of the Stained and Pristine scorpion-and-spider duo.'],
    ['010','KindleKid','Unassigned',['Thermal'],'Kilobyte','aries-family','Aries','Thermal zodiac-family base form.'],
    ['011','GaseousGoat','Unassigned',['Thermal','Seismic'],'Megabyte','aries-family','Aries','Thermal and Seismic goat Version Upgrade.'],
    ['012','ReactorRam','Unassigned',['Thermal','Seismic'],'Gigabyte','aries-family','Aries','Reactor-powered ram and final known Aries-family upgrade.'],
    ['013','SwimPig','Unassigned',['Torrent'],'Kilobyte','swimpig-family',null,'Torrent pig line base form.'],
    ['014','DiveSwine','Unassigned',['Torrent'],'Megabyte','swimpig-family',null,'Torrent swine Version Upgrade.'],
    ['015','PorkFloat','Unassigned',['Torrent'],'Gigabyte','swimpig-family',null,'Floating Torrent pig final form.'],
    ['016','CoinCalf','Unassigned',['Financial'],'Kilobyte','taurus-family','Taurus','Financial calf and Taurus-family base form.'],
    ['017','Cash Cow','Unassigned',['Financial','Seismic'],'Megabyte','taurus-family','Taurus','Financial and Seismic cow Version Upgrade.'],
    ['018','BankerBull','Unassigned',['Financial','Seismic'],'Gigabyte','taurus-family','Taurus','Financial and Seismic bull final form.'],
    ['019','Crowupt','Unassigned',[],'Kilobyte','crowupt-family',null,'Crow corruption line base form; alignment and configurations pending.'],
    ['020','Crowuption','Unassigned',[],'Megabyte','crowupt-family',null,'Crow corruption line Version Upgrade; alignment and configurations pending.'],
    ['021','Crowtastrophe','Unassigned',[],'Gigabyte','crowupt-family',null,'Crow corruption catastrophe form; alignment and configurations pending.'],
    ['022','DoughDawg','Unassigned',['Financial'],'Kilobyte','money-hound-family',null,'Financial hound line base form.'],
    ['023','MoneyMutt','Unassigned',['Financial'],'Megabyte','money-hound-family',null,'Financial hound Version Upgrade.'],
    ['024','HundredHound','Unassigned',['Financial'],'Gigabyte','money-hound-family',null,'High-value Financial hound final form.'],
    ['025','Primateicore','Unassigned',[],'Kilobyte','primate-family',null,'Primate line base form; configurations pending.'],
    ['026','Primateican','Unassigned',[],'Megabyte','primate-family',null,'Primate line Version Upgrade; configurations pending.'],
    ['027','Primateicon','Unassigned',[],'Gigabyte','primate-family',null,'Primate line final form; configurations pending.'],
    ['028','Clockadile','Unassigned',[],'Kilobyte','capricorn-family','Capricorn','Clock crocodile and Capricorn-family base form.'],
    ['029','Aligatorithm','Unassigned',[],'Megabyte','capricorn-family','Capricorn','Algorithm alligator Version Upgrade.'],
    ['030','Technogatorus','Unassigned',[],'Gigabyte','capricorn-family','Capricorn','Advanced gator final form.'],
    ['031','FiscalFish','Unassigned',['Torrent'],'Kilobyte','pisces-family','Pisces','Torrent and financial fish-family base form.'],
    ['032','LoanShark','Unassigned',['Torrent','Financial'],'Megabyte','pisces-family','Pisces','Torrent and Financial shark Version Upgrade.'],
    ['033','AFKWHALE','Unassigned',['Torrent','Financial'],'Gigabyte','pisces-family','Pisces','Massive Torrent and Financial whale final form.'],
    ['034','PrankCaller','Unassigned',[],'Kilobyte','prankcaller-family',null,'Prank communication sprite; configurations pending.'],
    ['035','KeyboardWarrior','Unassigned',[],'Kilobyte','keyboardwarrior-family',null,'Internet argument sprite; configurations pending.'],
    ['036','Troll','Unassigned',[],'Kilobyte','troll-family',null,'Hostile internet sprite; configurations pending.'],
    ['037','Landline','Unassigned',[],'Kilobyte','cable-family',null,'Cable communication line base form.'],
    ['038','Octocable','Unassigned',[],'Megabyte','cable-family',null,'Cable cephalopod Version Upgrade.'],
    ['039','Fiberoptopus','Unassigned',[],'Gigabyte','cable-family',null,'Fiber-optic octopus final form.'],
    ['040','CassetteKid','Unassigned',[],'Kilobyte','retro-family',null,'Analog cassette sprite; exact configurations pending.'],
    ['041','DiskDaddy','Unassigned',[],'Megabyte','retro-family',null,'Disk-based Version Upgrade; exact configurations pending.'],
    ['042','Technoblin','Unassigned',[],'Kilobyte','technoblin-family',null,'Technology goblin line base form; configurations pending.'],
    ['043','Technomoly','Unassigned',[],'Megabyte','technoblin-family',null,'Technology goblin Version Upgrade; configurations pending.'],
    ['044','Technareality','Unassigned',[],'Gigabyte','technoblin-family',null,'Reality-bending technology final form; configurations pending.'],
    ['045','Glitchwyrm','Unassigned',[],'Kilobyte','glitchwyrm-family',null,'Glitch wyrm sprite; canonical configuration pending.'],
    ['046','Screensavior','Unassigned',[],'Kilobyte','display-family',null,'Screen guardian sprite; canonical configurations pending.'],
    ['047','Monitorman','Unassigned',[],'Megabyte','display-family',null,'Monitor humanoid Version Upgrade; canonical configurations pending.'],
    ['048','Displaydevil','Unassigned',[],'Gigabyte','display-family',null,'Display demon sprite; family relationship and configurations pending.'],
    ['049','Mirrormaster','Unassigned',[],'Terabyte','display-family',null,'Mirror master sprite; Terabyte role and configurations pending.'],
    ['050','Compressaur','Unassigned',[],'Kilobyte','compressaur-family',null,'Compression dinosaur sprite; configurations pending.'],
    ['051','Pixelpigeon','Unassigned',[],'Kilobyte','pixelpigeon-family',null,'Pixel bird sprite; configurations pending.'],
    ['052','Binarybear','Unassigned',[],'Kilobyte','binarybear-family',null,'Binary bear sprite; configurations pending.'],
    ['053','Proxentity','Unassigned',[],'Megabyte','proxy-family',null,'Proxy entity; canonical configurations pending.'],
    ['054','Proxsentience','Unassigned',[],'Gigabyte','proxy-family',null,'Sentient proxy Version Upgrade; canonical configurations pending.'],
    ['055','Gem-N-Eye','Unassigned',[],'Kilobyte','gemini-family','Gemini','Gemini zodiac sprite; version path and configurations pending.'],
    ['056','6.ela','Unassigned',[],'Kilobyte','virgo-family','Virgo','Earth Logic Algorithm and Virgo zodiac sprite; configurations pending.'],
    ['057','PixelPup','Unassigned',[],'Kilobyte','libra-family','Libra','Libra-family base form.'],
    ['058','WireframeWolf','Unassigned',[],'Megabyte','libra-family','Libra','Wireframe wolf Version Upgrade.'],
    ['059','Lupinfinity','Unassigned',[],'Gigabyte','libra-family','Libra','Infinite wolf final form.'],
    ['060','Centaurcher','Unassigned',[],'Kilobyte','sagittarius-family','Sagittarius','Centaur archer and Sagittarius-family base form.'],
    ['061','Quiver&Colt','Unassigned',[],'Megabyte','sagittarius-family','Sagittarius','Quiver-and-colt Version Upgrade.'],
    ['062','Kernel:ColtQuiver','Unassigned',[],'Gigabyte','sagittarius-family','Sagittarius','Kernel-level Sagittarius final form.'],
    ['063','AquoBit','Unassigned',['Aether'],'Kilobyte','aquarius-family','Aquarius','Aether-based Aquarius-family base form.'],
    ['064','AquoMid','Unassigned',['Aether','Torrent'],'Megabyte','aquarius-family','Aquarius','Aether and Torrent Aquarius Version Upgrade.'],
    ['065','AquoMead','Unassigned',['Aether','Torrent'],'Gigabyte','aquarius-family','Aquarius','Aether and Torrent Aquarius final form.'],

    // Independent alignment species belonging to the Leo family.
    ['066','LeoRust','Stained',['Alloy'],'Kilobyte','leo-family','Leo','Stained Alloy lion-family base species.'],
    ['067','LeoWreck','Stained',['Alloy'],'Megabyte','leo-family','Leo','Stained Alloy lion-family Version Upgrade.'],
    ['068','LeoRuin','Stained',['Alloy'],'Gigabyte','leo-family','Leo','Stained Alloy lion-family final species.'],
    ['069','LeoNot','Null',['Spectral'],'Kilobyte','leo-family','Leo','Null Spectral lion-family base species.'],
    ['070','LeoNill','Null',['Spectral'],'Megabyte','leo-family','Leo','Null Spectral lion-family Version Upgrade.'],
    ['071','LeoNone','Null',['Spectral'],'Gigabyte','leo-family','Leo','Null Spectral lion-family final species.']
  ];

  window.DD_ALIGNMENT_TYPES=ALIGNMENTS.slice();
  window.DD_CONFIGURATION_TYPES=CONFIGURATIONS.slice();
  window.DD_CANON_ROSTER=raw.map(function(row){
    const dex=row[0],name=row[1],alignment=row[2],configs=row[3],version=row[4],familyId=row[5],zodiac=row[6],lore=row[7];
    const rare=rarity(version,alignment,name);
    const primary=configs[0]||'Unassigned';
    return {
      dex,name,alignment,configurations:configs.slice(),primaryConfiguration:configs[0]||null,
      secondaryConfiguration:configs[1]||null,configurationStatus:configs.length?'assigned':'pending',
      type:configs.length?configs.join(' / '):'Unassigned',stage:version,version,familyId,zodiac,
      rarity:rare,icon:icon(name,configs),color:colors[primary]||colors[alignment]||colors.Unassigned,
      chance:chance(rare),stability:stability(rare),lore
    };
  });
})();

/* ---- assets/js/dd-studio-data-bridge.js ---- */
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

/* ---- assets/js/dd-status-runtime.js ---- */
// assets/js/dd-status-runtime.js
// Status ownership runtime with guarded dispatch and re-entrancy-safe ticking.
(function () {
  'use strict';
  if (window.DD_STATUS_RUNTIME) return;

  const VERSION = '1.2.0';
  const OWNER = 'DD_STATUS_RUNTIME';

  const DEFINITIONS = Object.freeze({
    burn: { duration: 3, maxStacks: 3, tickDamage: 2, tickPhase: 'end', label: 'Burn' },
    freeze: { duration: 2, maxStacks: 1, actionBlockChance: 55, speedMultiplier: 0.65, label: 'Freeze' },
    shock: { duration: 2, maxStacks: 2, accuracyMultiplier: 0.82, speedMultiplier: 0.8, label: 'Shock' },
    corruption: { duration: 4, maxStacks: 3, tickDamage: 1, attackMultiplier: 0.9, defenseMultiplier: 0.9, tickPhase: 'end', label: 'Corruption' },
    shield: { duration: 3, maxStacks: 2, damageTakenMultiplier: 0.72, label: 'Shield' },
    boost: { duration: 3, maxStacks: 2, attackMultiplier: 1.18, speedMultiplier: 1.12, label: 'Boost' }
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
      safeDispatch('dd:status-applied', {
        target,
        status: existing,
        refreshed: true
      });
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
    safeDispatch('dd:status-applied', {
      target,
      status: entry,
      refreshed: false
    });
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

    safeDispatch(
      blocked ? 'dd:status-action-blocked' : 'dd:status-action-allowed',
      { target, result, context }
    );

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
      safeDispatch('dd:status-tick-blocked', {
        target,
        context,
        result
      });
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

        safeDispatch('dd:status-ticked', {
          target,
          status,
          context,
          effect
        });

        if (damage > 0) {
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

      safeDispatch('dd:status-runtime-error', {
        target,
        context,
        error: lastError
      });

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

/* ---- assets/js/dd-battle-engine-2-4.js ---- */
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

/* ---- assets/js/dd-gameplay-rules-2-4.js ---- */
// assets/js/dd-gameplay-rules-2-4.js
// Phase 2.4 gameplay consolidation: one runtime source for capture caps, odds, and stability baselines.
(function(){
  if(!location.pathname.includes('databyte-discovery')&&!location.pathname.includes('databytedex'))return;

  var rules={
    version:'2.4.2',
    minCaptureChance:5,
    captureOdds:{Starter:100,Common:32,Uncommon:28,Rare:22,Epic:16,Legendary:10,Mythic:6},
    captureCaps:{Starter:100,Common:72,Uncommon:68,Rare:60,Epic:52,Legendary:42,Mythic:34},
    stability:{Starter:12,Common:8,Uncommon:9,Rare:11,Epic:13,Legendary:16,Mythic:18},
    move:{minPower:18,maxPower:42,minAccuracy:72,maxAccuracy:98,minCaptureEffect:1,maxCaptureEffect:3}
  };

  function rarityOf(sprite){return sprite&&sprite.rarity||'Common';}
  function clamp(n,min,max){return Math.max(min,Math.min(max,Number(n)||0));}
  function baseChance(sprite){var r=rarityOf(sprite);return rules.captureOdds[r]!==undefined?rules.captureOdds[r]:30;}
  function capFor(sprite){var r=rarityOf(sprite);return Number(sprite&&sprite.captureCap)||rules.captureCaps[r]||70;}
  function stabilityFor(sprite){var r=rarityOf(sprite);return rules.stability[r]||8;}
  function odds(sprite){return clamp(Number(sprite&&sprite.currentChance)||Number(sprite&&sprite.captureChance)||baseChance(sprite),rules.minCaptureChance,capFor(sprite));}
  function setOdds(sprite,value){if(!sprite)return 0;sprite.currentChance=clamp(Math.round(value),rules.minCaptureChance,capFor(sprite));return sprite.currentChance;}
  function tuneMove(move){
    if(!move)return move;
    var tuned=Object.assign({},move);
    tuned.power=clamp(tuned.power||30,rules.move.minPower,rules.move.maxPower);
    tuned.accuracy=clamp(tuned.accuracy||92,rules.move.minAccuracy,rules.move.maxAccuracy);
    tuned.captureEffect=clamp(tuned.captureEffect||2,rules.move.minCaptureEffect,rules.move.maxCaptureEffect);
    tuned.stabilityEffect=Math.max(-1,Number(tuned.stabilityEffect||-1));
    tuned.balanceVersion=rules.version;
    return tuned;
  }
  function tuneSprite(sprite,opts){
    if(!sprite)return sprite;
    opts=opts||{};
    var tuned=Object.assign({},sprite);
    var base=baseChance(tuned);
    var cap=capFor(tuned);
    var stable=stabilityFor(tuned);
    if(opts.starter||tuned.rarity==='Starter'){
      base=100;cap=100;stable=Math.max(stable,12);tuned.rarity='Starter';
    }
    tuned.captureChance=base;
    tuned.currentChance=clamp(Number(tuned.currentChance)||base,rules.minCaptureChance,cap);
    tuned.captureCap=cap;
    tuned.stability=Number(tuned.stability)>stable?Number(tuned.stability):stable;
    tuned.maxStability=Number(tuned.maxStability)>stable?Number(tuned.maxStability):stable;
    tuned.hp=Number(tuned.hp||tuned.maxHp||44);
    tuned.maxHp=Number(tuned.maxHp||tuned.hp||44);
    tuned.atk=clamp(tuned.atk||12,7,22);
    tuned.def=clamp(tuned.def||8,5,18);
    tuned.speed=clamp(tuned.speed||8,4,18);
    tuned.moves=Array.isArray(tuned.moves)?tuned.moves.map(tuneMove):[];
    tuned.rulesVersion=rules.version;
    return tuned;
  }
  function tuneRoster(){
    if(Array.isArray(window.DD_CANON_ROSTER))window.DD_CANON_ROSTER=window.DD_CANON_ROSTER.map(function(sprite){return tuneSprite(sprite);});
    window.DD_GAMEPLAY_RULES={version:rules.version,rules:rules,baseChance:baseChance,capFor:capFor,stabilityFor:stabilityFor,odds:odds,setOdds:setOdds,tuneMove:tuneMove,tuneSprite:tuneSprite,tuneRoster:tuneRoster};
    document.dispatchEvent(new CustomEvent('dd:gameplay-rules-ready',{detail:{version:rules.version}}));
    return true;
  }
  window.DD_GAMEPLAY_RULES={version:rules.version,rules:rules,baseChance:baseChance,capFor:capFor,stabilityFor:stabilityFor,odds:odds,setOdds:setOdds,tuneMove:tuneMove,tuneSprite:tuneSprite,tuneRoster:tuneRoster};
  document.addEventListener('dd:studio-data-ready',function(){tuneRoster();},{once:true});
  setTimeout(tuneRoster,450);
})();

/* ---- assets/js/dd-capture-runtime.js ---- */
// assets/js/dd-capture-runtime.js
// Phase 3 split-module owner for Data Discovery capture odds and capture resolution helpers.
(function(){
  if(!location.pathname.includes('databyte-discovery')&&!location.pathname.includes('databytedex'))return;

  function rules(){return window.DD_GAMEPLAY_RULES||null;}
  function clamp(n,min,max){return Math.max(min,Math.min(max,Number(n)||0));}
  function rarityOf(sprite){return sprite&&sprite.rarity||'Common';}
  var fallback={
    min:5,
    odds:{Starter:100,Common:30,Uncommon:26,Rare:20,Epic:15,Legendary:9,Mythic:5},
    caps:{Starter:100,Common:60,Uncommon:56,Rare:48,Epic:40,Legendary:32,Mythic:26},
    failBonus:5,
    boostBonus:8
  };

  function capFor(sprite){
    if(rules()&&typeof rules().capFor==='function')return rules().capFor(sprite);
    var r=rarityOf(sprite);
    var table=fallback.caps[r]||60;
    var explicit=Number(sprite&&sprite.captureCap);
    return explicit?Math.min(explicit,table):table;
  }

  function baseChance(sprite){
    if(rules()&&typeof rules().baseChance==='function')return rules().baseChance(sprite);
    return fallback.odds[rarityOf(sprite)]||28;
  }

  function odds(sprite){
    if(rules()&&typeof rules().odds==='function')return rules().odds(sprite);
    return clamp(Number(sprite&&sprite.currentChance)||Number(sprite&&sprite.captureChance)||baseChance(sprite),fallback.min,capFor(sprite));
  }

  function setOdds(sprite,value){
    if(!sprite)return 0;
    if(rules()&&typeof rules().setOdds==='function')return rules().setOdds(sprite,value);
    sprite.currentChance=clamp(Math.round(value),fallback.min,capFor(sprite));
    return sprite.currentChance;
  }

  function tune(sprite){
    if(!sprite)return sprite;
    if(rules()&&typeof rules().tuneSprite==='function')return rules().tuneSprite(sprite);
    sprite.captureCap=capFor(sprite);
    sprite.captureChance=baseChance(sprite);
    sprite.currentChance=odds(sprite);
    return sprite;
  }

  function add(sprite,amount){return setOdds(sprite,odds(sprite)+Number(amount||0));}
  function onFailedCapture(sprite){return add(sprite,fallback.failBonus);}
  function onBoost(sprite){return add(sprite,fallback.boostBonus);}
  function canAttempt(items){return Number(items&&items.byteCoins||0)>0;}
  function roll(sprite,seed){
    var text=String(seed||sprite&&sprite.id||'capture')+Date.now();
    var h=2166136261;
    for(var i=0;i<text.length;i++){h^=text.charCodeAt(i);h+=(h<<1)+(h<<4)+(h<<7)+(h<<8)+(h<<24);}
    return Math.abs(h>>>0)%100;
  }
  function attempt(sprite,items,seed){
    var current=odds(sprite);
    if(!canAttempt(items))return {ok:false,reason:'no-bytecoins',odds:current,roll:null};
    var r=roll(sprite,seed);
    return {ok:r<current,reason:r<current?'captured':'resisted',odds:current,roll:r};
  }

  window.DD_CAPTURE_RUNTIME={
    version:'3.0.0',
    owner:'dd-capture-runtime',
    capFor:capFor,
    baseChance:baseChance,
    odds:odds,
    setOdds:setOdds,
    add:add,
    tune:tune,
    onFailedCapture:onFailedCapture,
    onBoost:onBoost,
    canAttempt:canAttempt,
    attempt:attempt
  };

  document.dispatchEvent(new CustomEvent('dd:capture-runtime-ready',{detail:{version:'3.0.0',owner:'dd-capture-runtime'}}));
})();

/* ---- assets/js/dd-encounter-runtime.js ---- */
// assets/js/dd-encounter-runtime.js
// Phase 3 split-module owner for Data Discovery encounter generation and signal initialization.
(function(){
  if(!location.pathname.includes('databyte-discovery')&&!location.pathname.includes('databytedex'))return;

  function roster(){return Array.isArray(window.DD_CANON_ROSTER)?window.DD_CANON_ROSTER:[];}
  function manifest(){return window.DD_GAME_DATA_MANIFEST||{};}
  function rules(){return window.DD_GAMEPLAY_RULES||null;}
  function capture(){return window.DD_CAPTURE_RUNTIME||null;}
  function hash(text){
    text=String(text||'SIGNAL');
    var h=2166136261;
    for(var i=0;i<text.length;i++){h^=text.charCodeAt(i);h+=(h<<1)+(h<<4)+(h<<7)+(h<<8)+(h<<24);}
    return Math.abs(h>>>0);
  }
  function rarityPool(code){
    var h=hash(code),bucket=h%100;
    var pools=Array.isArray(manifest().encounterPools)?manifest().encounterPools:[];
    if(pools.length){
      var acc=0,chosen=pools[pools.length-1];
      for(var i=0;i<pools.length;i++){
        acc+=Number(pools[i].weight||0);
        if(bucket<acc){chosen=pools[i];break;}
      }
      if(chosen&&Array.isArray(chosen.rarities)&&chosen.rarities.length)return {pool:chosen,rarities:chosen.rarities,bucket:bucket};
    }
    var rarities=bucket<55?['Common','Uncommon']:bucket<82?['Rare','Uncommon']:bucket<96?['Epic','Rare']:['Legendary','Mythic','Epic'];
    return {pool:{id:'fallback-signal',label:'Fallback Signal'},rarities:rarities,bucket:bucket};
  }
  function pickSpecies(code){
    var info=rarityPool(code),list=roster().filter(function(s){return info.rarities.indexOf(s.rarity)>=0;});
    if(!list.length)list=roster();
    var selected=list.length?list[hash(code+'|species')%list.length]:null;
    return {species:selected,pool:info.pool,rarities:info.rarities,bucket:info.bucket};
  }
  function tuneSignal(species,code,opts){
    if(!species)return null;
    opts=opts||{};
    var seed=hash(code+'-'+species.name);
    var base=Object.assign({},species,{seed:seed,code:code,encounterId:'ENC-'+seed+'-'+Date.now(),discoveredAt:new Date().toISOString()});
    if(rules()&&typeof rules().tuneSprite==='function')base=rules().tuneSprite(base,opts);
    if(capture()&&typeof capture().tune==='function')base=capture().tune(base);
    base.maxStability=Number(base.maxStability||base.stability||8);
    base.stability=Number(base.stability||base.maxStability);
    base.currentChance=Number(base.currentChance||base.captureChance||base.chance||30);
    base.captureCap=Number(base.captureCap||70);
    base.runtimeSource='dd-encounter-runtime';
    return base;
  }
  function create(code,opts){
    code=String(code||'SIGNAL').trim()||'SIGNAL';
    var picked=pickSpecies(code);
    var signal=tuneSignal(picked.species,code,opts||{});
    if(signal){
      signal.encounterPool=picked.pool&&picked.pool.id;
      signal.encounterPoolLabel=picked.pool&&picked.pool.label;
      signal.encounterBucket=picked.bucket;
    }
    return {ok:!!signal,code:code,signal:signal,species:picked.species,pool:picked.pool,rarities:picked.rarities,bucket:picked.bucket};
  }
  function randomCode(){return 'DBS-'+Math.random().toString(36).slice(2,7).toUpperCase();}

  window.DD_ENCOUNTER_RUNTIME={
    version:'3.0.0',
    owner:'dd-encounter-runtime',
    hash:hash,
    rarityPool:rarityPool,
    pickSpecies:pickSpecies,
    tuneSignal:tuneSignal,
    create:create,
    randomCode:randomCode
  };

  document.dispatchEvent(new CustomEvent('dd:encounter-runtime-ready',{detail:{version:'3.0.0',owner:'dd-encounter-runtime'}}));
})();

/* ---- assets/js/dd-battle-balance-2-4.js ---- */
// assets/js/dd-battle-balance-2-4.js
// Phase 2.4 balance pass. Defers to DD_GAMEPLAY_RULES when available.
(function(){
  if(!location.pathname.includes('databyte-discovery'))return;

  var fallbackOdds={Starter:100,Common:32,Uncommon:28,Rare:22,Epic:16,Legendary:10,Mythic:6};
  var fallbackStability={Starter:12,Common:8,Uncommon:9,Rare:11,Epic:13,Legendary:16,Mythic:18};
  var fallbackCap={Starter:100,Common:72,Uncommon:68,Rare:60,Epic:52,Legendary:42,Mythic:34};

  function rarityOf(sprite){return sprite&&sprite.rarity||'Common';}
  function clamp(n,min,max){return Math.max(min,Math.min(max,Number(n)||0));}
  function rules(){return window.DD_GAMEPLAY_RULES||null;}

  function tuneMove(move){
    if(!move)return move;
    if(rules()&&typeof rules().tuneMove==='function')return rules().tuneMove(move);
    var tuned=Object.assign({},move);
    tuned.power=clamp(tuned.power||30,18,42);
    tuned.accuracy=clamp(tuned.accuracy||92,72,98);
    tuned.captureEffect=clamp(tuned.captureEffect||2,1,3);
    tuned.stabilityEffect=Math.max(-1,Number(tuned.stabilityEffect||-1));
    tuned.balanceVersion='2.4.2-fallback';
    return tuned;
  }

  function tuneSprite(sprite){
    if(!sprite)return sprite;
    if(rules()&&typeof rules().tuneSprite==='function')return rules().tuneSprite(sprite);
    var r=rarityOf(sprite);
    var tuned=Object.assign({},sprite);
    tuned.chance=fallbackOdds[r]!==undefined?fallbackOdds[r]:30;
    tuned.captureChance=tuned.chance;
    tuned.currentChance=tuned.currentChance?Math.min(tuned.currentChance,tuned.chance):tuned.chance;
    tuned.captureCap=fallbackCap[r]!==undefined?fallbackCap[r]:70;
    tuned.stability=fallbackStability[r]!==undefined?fallbackStability[r]:8;
    tuned.maxStability=tuned.stability;
    tuned.hp=Number(tuned.hp||tuned.maxHp||44);
    tuned.maxHp=Number(tuned.maxHp||tuned.hp||44);
    tuned.atk=clamp(tuned.atk||12,7,22);
    tuned.def=clamp(tuned.def||8,5,18);
    tuned.speed=clamp(tuned.speed||8,4,18);
    tuned.moves=Array.isArray(tuned.moves)&&tuned.moves.length?tuned.moves.map(tuneMove):[];
    tuned.balanceVersion='2.4.2-fallback';
    return tuned;
  }

  function tuneRoster(){
    if(!Array.isArray(window.DD_CANON_ROSTER))return false;
    window.DD_CANON_ROSTER=window.DD_CANON_ROSTER.map(tuneSprite);
    window.DD_BATTLE_BALANCE={
      ok:true,
      version:(rules()&&rules().version)||'2.4.2-fallback',
      source:rules()?'DD_GAMEPLAY_RULES':'fallback-balance',
      captureOdds:(rules()&&rules().rules&&rules().rules.captureOdds)||fallbackOdds,
      stability:(rules()&&rules().rules&&rules().rules.stability)||fallbackStability,
      captureCaps:(rules()&&rules().rules&&rules().rules.captureCaps)||fallbackCap,
      generatedAt:new Date().toISOString()
    };
    document.dispatchEvent(new CustomEvent('dd:battle-balance-ready',{detail:window.DD_BATTLE_BALANCE}));
    return true;
  }

  document.addEventListener('dd:gameplay-rules-ready',function(){tuneRoster();},{once:true});
  document.addEventListener('dd:studio-data-ready',function(){setTimeout(tuneRoster,80);},{once:true});
  setTimeout(tuneRoster,650);
})();

/* ---- assets/js/dd-battle-resolver.js ---- */
// assets/js/dd-battle-resolver.js
(function () {
  'use strict';

  if (
    !location.pathname.includes('databyte-discovery') &&
    !location.pathname.includes('databytedex')
  ) return;

  var VERSION = '3.4.1';
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

  function blockedResult(user, move, gate, userMods, targetMods) {
    return {
      resultType: 'blocked',
      terminal: false,
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
      modifiers: {
        user: userMods || statusModifiers(user),
        target: targetMods || statusModifiers(null)
      },
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
    if (!gate.allowed) return blockedResult(user, move, gate, userMods, targetMods);

    var hit = hitCheck(user, move, target, opts.seed || opts.mode || 'turn', userMods);
    var type = typeResult(move, target);
    var effectiveHit = hit.hit && Number(type.multiplier) !== 0;

    if (!effectiveHit) {
      return {
        resultType: hit.hit ? 'no-effect' : 'miss',
        terminal: false,
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
      resultType: 'hit',
      terminal: false,
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

/* ---- assets/js/dd-battle-state-runtime.js ---- */
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
    safeDispatch('dd:battle-runtime-trace', Object.assign({
      phase,
      transaction: transactionSnapshot(),
      state: snapshot(),
      battleContext: contextSnapshot()
    }, detail || {}));
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
        safeDispatch('dd:battle-resolution-applied', blockedResult);
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
      safeDispatch('dd:battle-resolution-applied', result);
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
    safeDispatch('dd:battle-status-phase-ticked', result);
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
      return tickPhaseCore(participants, 'end', context || {});
    });
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

/* ---- assets/js/dd-player-runtime.js ---- */
// Data Discovery v4.8: canonical player persistence and party ownership.
(function () {
  'use strict';

  if (!location.pathname.includes('databyte-discovery')) return;
  if (window.DD_PLAYER_RUNTIME) return;

  const VERSION = '1.0.0';
  const OWNER = 'dd-player-runtime';
  const MAX_PARTY = 5;
  const KEYS = Object.freeze({
    collection: 'vl_databyte_discovery_collection_v2',
    party: 'vl_databyte_party_v1',
    items: 'vl_databyte_items_v1',
    seen: 'vl_databyte_seen_v1'
  });
  const DEFAULT_ITEMS = Object.freeze({ byteCoins: 8, boosts: 3, repairPulses: 1 });

  let activeSlot = 0;
  let switchRequired = false;
  let switchReason = null;

  function emit(type, detail) {
    document.dispatchEvent(new CustomEvent(type, {
      detail: Object.assign({ owner: OWNER, version: VERSION }, detail || {})
    }));
  }

  function read(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value === null || value === undefined ? fallback : value;
    } catch {
      return fallback;
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
    return value;
  }

  function collectionAll() { return read(KEYS.collection, []); }
  function collectionWrite(list) { return write(KEYS.collection, Array.isArray(list) ? list : []); }
  function collectionFind(id) { return collectionAll().find(sprite => sprite && sprite.id === id) || null; }
  function collectionHas(id) { return !!collectionFind(id); }
  function collectionAdd(sprite) {
    if (!sprite || !sprite.id) return { ok: false, collection: collectionAll(), sprite: null, reason: 'missing-sprite-id' };
    const list = collectionAll();
    const index = list.findIndex(item => item && item.id === sprite.id);
    if (index >= 0) list[index] = Object.assign({}, list[index], sprite);
    else list.push(sprite);
    const collection = collectionWrite(list);
    emit('databyte:inventory-updated', { domain: 'collection', spriteId: sprite.id });
    return { ok: true, collection, sprite };
  }
  function collectionRemove(id) { return collectionWrite(collectionAll().filter(sprite => sprite && sprite.id !== id)); }
  function collectionClear() { return collectionWrite([]); }
  function collectionNames() { return collectionAll().map(sprite => sprite && sprite.name).filter(Boolean); }

  function partyIds() { return read(KEYS.party, []); }
  function isUsable(sprite) { return !!(sprite && Number(sprite.hp || 0) > 0); }
  function partySave(ids) {
    const sprites = collectionAll();
    const existing = new Set(sprites.map(sprite => sprite && sprite.id).filter(Boolean));
    const clean = [...new Set((ids || []).filter(id => existing.has(id)))].slice(0, MAX_PARTY);
    write(KEYS.party, clean);
    if (activeSlot >= clean.length) activeSlot = 0;
    emit('databyte:party-updated', { ids: clean.slice() });
    return clean;
  }
  function partyAutoFill() {
    const sprites = collectionAll();
    const ids = partyIds().filter(id => sprites.some(sprite => sprite && sprite.id === id));
    sprites.forEach(sprite => {
      if (ids.length < MAX_PARTY && sprite && sprite.id && !ids.includes(sprite.id)) ids.push(sprite.id);
    });
    return partySave(ids);
  }
  function partyMembers() {
    const sprites = collectionAll();
    return partyAutoFill().map(id => sprites.find(sprite => sprite && sprite.id === id)).filter(Boolean);
  }
  function usableMembers(options) {
    const excludedId = options && (options.excludeId || options.activeId) || null;
    return partyMembers().filter(sprite => isUsable(sprite) && (!excludedId || sprite.id !== excludedId));
  }
  function lead() {
    const members = partyMembers();
    return members[activeSlot] || members.find(isUsable) || members[0] || collectionAll()[0] || null;
  }
  function replacementCandidates(activeSprite) {
    return usableMembers({ excludeId: activeSprite && activeSprite.id });
  }
  function partyAdd(sprite) {
    if (!sprite || !sprite.id) return partyAutoFill();
    const ids = partyIds();
    if (!ids.includes(sprite.id) && ids.length < MAX_PARTY) ids.push(sprite.id);
    return partySave(ids);
  }
  function partyRemove(id) { return partySave(partyIds().filter(item => item !== id)); }
  function partySwap(fromIndex, toIndex) {
    const ids = partyAutoFill();
    if (fromIndex < 0 || toIndex < 0 || fromIndex >= ids.length || toIndex >= ids.length) return ids;
    const next = ids.slice();
    const moved = next.splice(fromIndex, 1)[0];
    next.splice(toIndex, 0, moved);
    return partySave(next);
  }
  function updateSprite(sprite) { return collectionAdd(sprite).sprite; }

  function normalizeSlot(slot) {
    const value = Number(slot);
    return Number.isInteger(value) && value >= 0 ? value : -1;
  }
  function canSwitch(party, slot) {
    const index = normalizeSlot(slot);
    return !!(Array.isArray(party) && index >= 0 && party[index] && isUsable(party[index]));
  }
  function setActive(slot) {
    const index = normalizeSlot(slot);
    const members = partyMembers();
    if (index < 0 || !members[index]) return activeSlot;
    const previousSlot = activeSlot;
    activeSlot = index;
    switchRequired = false;
    switchReason = null;
    emit('dd:party-switch', { slot: activeSlot, previousSlot, sprite: members[index] });
    return activeSlot;
  }
  function requireSwitch(reason) {
    switchRequired = true;
    switchReason = reason || 'switch-required';
    emit('dd:party-switch-required', { slot: activeSlot, reason: switchReason });
    return true;
  }
  function clearRequirement(reason) {
    const wasRequired = switchRequired;
    switchRequired = false;
    switchReason = null;
    if (wasRequired) emit('dd:party-switch-requirement-cleared', { slot: activeSlot, reason: reason || 'requirement-cleared' });
    return true;
  }
  function requestForFaint(actor, context) {
    const party = context && Array.isArray(context.party) ? context.party : partyMembers();
    const candidates = party.filter((member, index) => index !== activeSlot && isUsable(member) && (!actor || !actor.id || member.id !== actor.id));
    if (!candidates.length) {
      clearRequirement('party-defeated');
      return { ok: false, switchRequired: false, partyWiped: true, reason: 'party-defeated', candidates: [] };
    }
    const reason = context && context.reason || 'active-sprite-fainted';
    requireSwitch(reason);
    return { ok: true, switchRequired: true, partyWiped: false, reason, candidates };
  }

  function normalizeItems(items) {
    const next = Object.assign({}, DEFAULT_ITEMS, items || {});
    Object.keys(next).forEach(id => { next[id] = Math.max(0, Number(next[id] || 0)); });
    return next;
  }
  function inventoryRead() { return normalizeItems(read(KEYS.items, DEFAULT_ITEMS)); }
  function inventoryWrite(items) { return write(KEYS.items, normalizeItems(items)); }
  function inventorySpend(id, amount) {
    const count = Number(amount || 1);
    const items = inventoryRead();
    if (Number(items[id] || 0) < count) return { ok: false, items, spent: 0 };
    items[id] -= count;
    return { ok: true, items: inventoryWrite(items), spent: count };
  }
  function inventoryAdd(id, amount) {
    const items = inventoryRead();
    items[id] = Number(items[id] || 0) + Number(amount || 1);
    return inventoryWrite(items);
  }
  function inventorySet(id, amount) {
    const items = inventoryRead();
    items[id] = Math.max(0, Number(amount || 0));
    return inventoryWrite(items);
  }

  function readSeen() { return read(KEYS.seen, []); }
  function writeSeen(list) { return write(KEYS.seen, Array.isArray(list) ? list : []); }
  function recordName(record) { return typeof record === 'string' ? record : record && record.name; }
  function dexCollectionNames() { return new Set(collectionNames()); }
  function seenNames() {
    const names = new Set(readSeen().map(recordName).filter(Boolean));
    dexCollectionNames().forEach(name => names.add(name));
    return names;
  }
  function note(sprite, status) {
    if (!sprite || !sprite.name) return null;
    const list = readSeen();
    const index = list.findIndex(record => recordName(record) === sprite.name);
    const next = { name: sprite.name, dex: sprite.dex, type: sprite.type, rarity: sprite.rarity, status: status || 'Seen', seenAt: new Date().toISOString() };
    if (index >= 0) list[index] = Object.assign({}, typeof list[index] === 'string' ? {} : list[index], next);
    else list.push(next);
    writeSeen(list);
    return next;
  }
  function statusFor(sprite) {
    if (!sprite || !sprite.name) return 'Unknown';
    if (dexCollectionNames().has(sprite.name)) return 'Captured';
    return seenNames().has(sprite.name) ? 'Seen' : 'Unknown';
  }
  function dexStats() { return { seen: seenNames().size, captured: dexCollectionNames().size, total: (window.DD_CANON_ROSTER || []).length }; }
  function dexRecords() { return (window.DD_CANON_ROSTER || []).map(sprite => Object.assign({}, sprite, { status: statusFor(sprite) })); }

  const collection = Object.freeze({ all: collectionAll, read: collectionAll, write: collectionWrite, find: collectionFind, has: collectionHas, add: collectionAdd, update: collectionAdd, remove: collectionRemove, clear: collectionClear, count: () => collectionAll().length, names: collectionNames });
  const party = Object.freeze({ maxParty: MAX_PARTY, collection: collectionAll, ids: partyIds, save: partySave, autoFill: partyAutoFill, members: partyMembers, usableMembers, hasUsableMember: options => usableMembers(options).length > 0, partyWiped: () => !usableMembers().length, isUsable, lead, activeIndex: () => activeSlot, replacementCandidates, add: partyAdd, remove: partyRemove, swap: partySwap, updateSprite, reset: () => partySave([]) });
  const partySwitch = Object.freeze({ getActive: () => activeSlot, getReason: () => switchReason, snapshot: () => ({ activeSlot, switchRequired, switchReason }), setActive, requireSwitch, isSwitchRequired: () => switchRequired, clearRequirement, requestForFaint, canSwitch, partyWiped: partyList => !Array.isArray(partyList) || !partyList.some(isUsable), reset: () => { activeSlot = 0; clearRequirement('runtime-reset'); return health(); } });
  const inventory = Object.freeze({ read: inventoryRead, write: inventoryWrite, ensure: () => inventoryWrite(inventoryRead()), count: id => Number(inventoryRead()[id] || 0), has: (id, amount) => Number(inventoryRead()[id] || 0) >= Number(amount || 1), spend: inventorySpend, add: inventoryAdd, set: inventorySet, reset: () => inventoryWrite(DEFAULT_ITEMS) });
  const dex = Object.freeze({ readSeen, writeSeen, note, noteSeen: sprite => note(sprite, 'Seen'), noteOwned: sprite => note(sprite, 'Captured'), seenNames, collectionNames: dexCollectionNames, statusFor, stats: dexStats, records: dexRecords, reset: () => writeSeen([]) });

  function snapshot() { return { collection: collectionAll(), party: partyMembers(), activeSlot, items: inventoryRead(), seen: readSeen(), switchRequired, switchReason }; }
  function health() { const state = snapshot(); return { owner: OWNER, version: VERSION, collectionCount: state.collection.length, partyCount: state.party.length, usableCount: state.party.filter(isUsable).length, activeSlot, switchRequired }; }

  window.DD_PLAYER_RUNTIME = Object.freeze({ version: VERSION, owner: OWNER, phase: '4.8-canonical-player-owner', keys: KEYS, collection, party, partySwitch, inventory, dex, snapshot, health });

  // Compatibility views: one implementation and one storage owner.
  window.DD_COLLECTION_RUNTIME = Object.freeze(Object.assign({ version: VERSION, owner: OWNER, key: KEYS.collection }, collection));
  window.DD_PARTY_RUNTIME = Object.freeze(Object.assign({ version: VERSION, owner: OWNER, keys: KEYS }, party));
  window.DD_PARTY_SWITCH_RUNTIME = Object.freeze(Object.assign({ version: VERSION, owner: OWNER }, partySwitch));
  window.DD_INVENTORY_RUNTIME = Object.freeze(Object.assign({ version: VERSION, owner: OWNER, key: KEYS.items, defaults: DEFAULT_ITEMS }, inventory));
  window.DD_DEX_RUNTIME = Object.freeze(Object.assign({ version: VERSION, owner: OWNER, key: KEYS.seen }, dex));
  window.DD_COLLECTION_DEX_BRIDGE = Object.freeze({ version: VERSION, owner: OWNER, status: 'compatibility-view' });

  inventory.ensure();
  emit('dd:player-runtime-ready', { runtime: window.DD_PLAYER_RUNTIME });
  emit('dd:collection-runtime-ready', { runtime: window.DD_COLLECTION_RUNTIME });
  emit('dd:party-runtime-ready', { runtime: window.DD_PARTY_RUNTIME });
  emit('dd:party-switch-runtime-ready', { runtime: window.DD_PARTY_SWITCH_RUNTIME });
  emit('dd:inventory-runtime-ready', { runtime: window.DD_INVENTORY_RUNTIME });
  emit('dd:dex-runtime-ready', { runtime: window.DD_DEX_RUNTIME });
  emit('dd:collection-dex-bridge-ready', { runtime: window.DD_COLLECTION_DEX_BRIDGE });
})();

/* ---- assets/js/dd-battle-reward-runtime.js ---- */
// assets/js/dd-battle-reward-runtime.js
// Phase 4.5: canonical, idempotent battle rewards and progression hooks.
(function () {
  'use strict';

  if (!location.pathname.includes('databyte-discovery')) return;
  if (window.DD_BATTLE_REWARD_RUNTIME) return;

  const VERSION = '1.0.0';
  const OWNER = 'dd-battle-reward-runtime';
  const STORAGE_KEY = 'vl_databyte_battle_rewards_v1';

  const DEFAULT_PROFILE = Object.freeze({
    totalXp: 0,
    victories: 0,
    byteCoinsEarned: 0,
    dropsEarned: {},
    spriteXp: {},
    processedBattles: {},
    lastReward: null
  });

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function clamp(number, minimum, maximum) {
    return Math.max(
      minimum,
      Math.min(maximum, Number(number) || 0)
    );
  }

  function hash(text) {
    text = String(text || 'reward');
    let value = 2166136261;

    for (let index = 0; index < text.length; index += 1) {
      value ^= text.charCodeAt(index);
      value +=
        (value << 1) +
        (value << 4) +
        (value << 7) +
        (value << 8) +
        (value << 24);
    }

    return Math.abs(value >>> 0);
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

  function normalizeProfile(profile) {
    const next = Object.assign(
      {},
      clone(DEFAULT_PROFILE),
      profile || {}
    );

    next.totalXp = Math.max(
      0,
      Number(next.totalXp || 0)
    );
    next.victories = Math.max(
      0,
      Number(next.victories || 0)
    );
    next.byteCoinsEarned = Math.max(
      0,
      Number(next.byteCoinsEarned || 0)
    );

    next.dropsEarned =
      next.dropsEarned &&
      typeof next.dropsEarned === 'object'
        ? next.dropsEarned
        : {};

    next.spriteXp =
      next.spriteXp &&
      typeof next.spriteXp === 'object'
        ? next.spriteXp
        : {};

    next.processedBattles =
      next.processedBattles &&
      typeof next.processedBattles === 'object'
        ? next.processedBattles
        : {};

    return next;
  }

  function read() {
    try {
      return normalizeProfile(
        JSON.parse(
          localStorage.getItem(STORAGE_KEY)
        )
      );
    } catch {
      return normalizeProfile();
    }
  }

  function write(profile) {
    const next = normalizeProfile(profile);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(next)
    );
    return next;
  }

  function reset() {
    return write(clone(DEFAULT_PROFILE));
  }

  function inventory() {
    return window.DD_INVENTORY_RUNTIME || null;
  }

  function battleState() {
    return window.DD_BATTLE_STATE_RUNTIME || null;
  }

  function encounterIdFrom(context) {
    const state =
      battleState() &&
      battleState().snapshot
        ? battleState().snapshot()
        : null;

    return String(
      context &&
      (
        context.encounterId ||
        context.battleId
      ) ||
      state &&
      state.encounterId ||
      'battle-' + Date.now()
    );
  }

  function rarityMultiplier(rarity) {
    const key = String(
      rarity || 'Common'
    ).toLowerCase();

    if (key.includes('legendary')) return 2.5;
    if (key.includes('rare')) return 1.7;
    if (key.includes('uncommon')) return 1.25;
    return 1;
  }

  function defeatedFrom(context) {
    return (
      context &&
      (
        context.defeated ||
        context.wild ||
        context.enemy
      )
    ) || {};
  }

  function recipientFrom(context) {
    return (
      context &&
      (
        context.recipient ||
        context.lead ||
        context.playerSprite
      )
    ) || null;
  }

  function calculate(context) {
    context = context || {};

    const defeated = defeatedFrom(context);
    const encounterId =
      encounterIdFrom(context);
    const rarity = defeated.rarity || 'Common';
    const level = Math.max(
      1,
      Number(
        defeated.level ||
        defeated.stageLevel ||
        context.level ||
        1
      )
    );
    const multiplier =
      rarityMultiplier(rarity);
    const seed = hash([
      encounterId,
      defeated.id || defeated.name || 'wild',
      rarity,
      level
    ].join('|'));

    const xp = clamp(
      Math.round(
        (10 + level * 3) *
        multiplier
      ),
      8,
      250
    );

    const byteCoins = clamp(
      Math.round(
        (2 + level * 0.75) *
        multiplier
      ),
      1,
      60
    );

    const dropRoll = seed % 100;
    const drops = [];

    if (dropRoll >= 94) {
      drops.push({
        id: 'repairPulses',
        amount: 1,
        rarity: 'rare'
      });
    } else if (dropRoll >= 78) {
      drops.push({
        id: 'boosts',
        amount: 1,
        rarity: 'uncommon'
      });
    }

    return {
      encounterId,
      xp,
      byteCoins,
      drops,
      defeated: {
        id: defeated.id || null,
        name: defeated.name || null,
        rarity,
        level
      },
      recipient: recipientFrom(context),
      seed,
      calculatedAt:
        new Date().toISOString()
    };
  }

  function addInventoryReward(
    id,
    amount
  ) {
    const runtime = inventory();

    if (
      !runtime ||
      typeof runtime.add !== 'function'
    ) {
      return {
        ok: false,
        reason:
          'inventory-runtime-unavailable',
        id,
        amount
      };
    }

    return {
      ok: true,
      id,
      amount,
      items: runtime.add(id, amount)
    };
  }

  function recipientKey(recipient) {
    if (!recipient) return 'account';

    return String(
      recipient.id ||
      recipient.studioId ||
      recipient.name ||
      'account'
    );
  }

  function award(context) {
    const reward = calculate(context);
    const profile = read();

    if (
      profile.processedBattles[
        reward.encounterId
      ]
    ) {
      const duplicate = {
        ok: false,
        duplicate: true,
        encounterId:
          reward.encounterId,
        reward:
          profile.processedBattles[
            reward.encounterId
          ],
        profile
      };

      dispatch(
        'dd:battle-reward-duplicate',
        duplicate
      );

      return duplicate;
    }

    const key = recipientKey(
      reward.recipient
    );

    profile.totalXp += reward.xp;
    profile.victories += 1;
    profile.byteCoinsEarned +=
      reward.byteCoins;

    profile.spriteXp[key] =
      Math.max(
        0,
        Number(profile.spriteXp[key] || 0)
      ) + reward.xp;

    const inventoryResults = [
      addInventoryReward(
        'byteCoins',
        reward.byteCoins
      )
    ];

    reward.drops.forEach(drop => {
      profile.dropsEarned[drop.id] =
        Math.max(
          0,
          Number(
            profile.dropsEarned[
              drop.id
            ] || 0
          )
        ) + drop.amount;

      inventoryResults.push(
        addInventoryReward(
          drop.id,
          drop.amount
        )
      );
    });

    const storedReward = Object.assign(
      {},
      reward,
      {
        recipientKey: key,
        inventoryResults,
        awardedAt:
          new Date().toISOString()
      }
    );

    profile.processedBattles[
      reward.encounterId
    ] = storedReward;
    profile.lastReward = storedReward;

    const saved = write(profile);

    const result = {
      ok: true,
      duplicate: false,
      reward: storedReward,
      profile: saved
    };

    dispatch(
      'dd:battle-reward-awarded',
      result
    );

    dispatch(
      'dd:progression-xp-awarded',
      {
        encounterId:
          reward.encounterId,
        recipientKey: key,
        xp: reward.xp,
        totalXp:
          saved.spriteXp[key]
      }
    );

    return result;
  }

  function eventContext(detail) {
    detail = detail || {};

    return Object.assign(
      {},
      detail,
      detail.value || {},
      {
        encounterId:
          detail.encounterId ||
          detail.state &&
          detail.state.encounterId ||
          detail.value &&
          detail.value.encounterId,
        defeated:
          detail.defeated ||
          detail.wild ||
          detail.value &&
          (
            detail.value.wild ||
            detail.value.defeated
          ),
        recipient:
          detail.recipient ||
          detail.lead ||
          detail.value &&
          (
            detail.value.lead ||
            detail.value.recipient
          )
      }
    );
  }

  function handleTerminal(event) {
    const detail =
      event &&
      event.detail ||
      {};

    const state =
      detail.state ||
      {};

    if (state.value !== 'victory') return;

    award(eventContext(detail));
  }

  function getSpriteXp(sprite) {
    return Number(
      read().spriteXp[
        recipientKey(sprite)
      ] || 0
    );
  }

  function health() {
    return {
      owner: OWNER,
      version: VERSION,
      storageKey: STORAGE_KEY,
      inventoryAvailable:
        !!inventory(),
      battleStateAvailable:
        !!battleState(),
      processedBattleCount:
        Object.keys(
          read().processedBattles
        ).length
    };
  }

  document.addEventListener(
    'dd:battle-terminal',
    handleTerminal
  );

  window.DD_BATTLE_REWARD_RUNTIME =
    Object.freeze({
      version: VERSION,
      owner: OWNER,
      storageKey: STORAGE_KEY,
      read,
      write,
      reset,
      calculate,
      award,
      getSpriteXp,
      health
    });

  dispatch(
    'dd:battle-reward-runtime-ready',
    health()
  );
})();

/* ---- assets/js/dd-battle-reward-presentation.js ---- */
// assets/js/dd-battle-reward-presentation.js
// Phase 4.5: presentation-only observer for canonical battle rewards.
(function () {
  'use strict';

  if (!location.pathname.includes('databyte-discovery')) return;
  if (window.DD_BATTLE_REWARD_PRESENTATION) return;

  const VERSION = '1.0.0';
  const OWNER = 'dd-battle-reward-presentation';
  const STYLE_ID = 'ddBattleRewardPresentationStyle';
  const ROOT_ID = 'ddBattleRewardPresentationRoot';
  const history = [];
  const MAX_HISTORY = 30;

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

  function installStyle() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent =
      '.dd-reward-toast{' +
      'position:fixed;' +
      'left:50%;' +
      'bottom:88px;' +
      'transform:translateX(-50%);' +
      'z-index:1000004;' +
      'width:min(92vw,420px);' +
      'padding:14px 16px;' +
      'border-radius:18px;' +
      'background:rgba(7,17,31,.96);' +
      'border:1px solid rgba(255,215,0,.6);' +
      'box-shadow:0 18px 45px rgba(0,0,0,.42);' +
      'color:#f8fafc;' +
      'font-family:inherit;' +
      'pointer-events:none;' +
      'animation:ddRewardEnter .24s ease-out' +
      '}' +
      '.dd-reward-title{' +
      'font-size:15px;' +
      'font-weight:1000;' +
      'letter-spacing:.04em;' +
      'color:#FFD700;' +
      'margin-bottom:8px' +
      '}' +
      '.dd-reward-row{' +
      'display:flex;' +
      'justify-content:space-between;' +
      'gap:12px;' +
      'font-size:13px;' +
      'font-weight:800;' +
      'margin-top:5px' +
      '}' +
      '.dd-reward-drop{' +
      'margin-top:7px;' +
      'font-size:12px;' +
      'color:#d8b4fe;' +
      'font-weight:800' +
      '}' +
      '@keyframes ddRewardEnter{' +
      'from{opacity:0;transform:translate(-50%,16px) scale(.96)}' +
      'to{opacity:1;transform:translate(-50%,0) scale(1)}' +
      '}';

    document.head.appendChild(style);
  }

  function root() {
    let element = document.getElementById(ROOT_ID);

    if (!element) {
      element = document.createElement('div');
      element.id = ROOT_ID;
      document.body.appendChild(element);
    }

    return element;
  }

  function safeReward(detail) {
    return (
      detail &&
      detail.reward ||
      {}
    );
  }

  function dropLabel(drop) {
    if (!drop) return '';

    const id = String(
      drop.id || 'item'
    )
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, letter =>
        letter.toUpperCase()
      );

    return (
      '+' +
      Number(drop.amount || 1) +
      ' ' +
      id
    );
  }

  function render(detail) {
    installStyle();

    const reward = safeReward(detail);
    const element = document.createElement('section');
    element.className = 'dd-reward-toast';

    const drops = Array.isArray(reward.drops)
      ? reward.drops
      : [];

    element.innerHTML =
      '<div class="dd-reward-title">BATTLE REWARDS</div>' +
      '<div class="dd-reward-row"><span>XP</span><strong>+' +
      Number(reward.xp || 0) +
      '</strong></div>' +
      '<div class="dd-reward-row"><span>ByteCoins</span><strong>+' +
      Number(reward.byteCoins || 0) +
      '</strong></div>' +
      (
        reward.recipientKey
          ? '<div class="dd-reward-row"><span>Recipient</span><strong>' +
            String(reward.recipientKey) +
            '</strong></div>'
          : ''
      ) +
      drops.map(drop =>
        '<div class="dd-reward-drop">' +
        dropLabel(drop) +
        '</div>'
      ).join('');

    const container = root();
    container.replaceChildren(element);

    setTimeout(() => {
      if (element.isConnected) element.remove();
    }, 3200);

    return element;
  }

  function show(detail) {
    history.push({
      detail: detail || {},
      at: new Date().toISOString()
    });

    while (history.length > MAX_HISTORY) {
      history.shift();
    }

    const element = render(detail || {});

    dispatch(
      'dd:battle-reward-presented',
      {
        detail: detail || {},
        elementId: element.id || null
      }
    );

    return element;
  }

  function getHistory() {
    return history.slice();
  }

  function clear() {
    history.length = 0;

    const element =
      document.getElementById(ROOT_ID);

    if (element) {
      element.replaceChildren();
    }
  }

  function health() {
    return {
      owner: OWNER,
      version: VERSION,
      historyCount: history.length,
      rewardRuntimeAvailable:
        !!window.DD_BATTLE_REWARD_RUNTIME
    };
  }

  document.addEventListener(
    'dd:battle-reward-awarded',
    function (event) {
      show(
        event &&
        event.detail ||
        {}
      );
    }
  );

  window.DD_BATTLE_REWARD_PRESENTATION =
    Object.freeze({
      version: VERSION,
      owner: OWNER,
      show,
      clear,
      getHistory,
      health
    });

  dispatch(
    'dd:battle-reward-presentation-ready',
    health()
  );
})();

/* ---- assets/js/dd-battle-runtime.js ---- */
// Data Discovery v4.8: canonical public facade for battle components.
(function () {
  'use strict';

  if (!location.pathname.includes('databyte-discovery')) return;
  if (window.DD_BATTLE_RUNTIME) return;

  const VERSION = '1.0.0';
  const OWNER = 'dd-battle-runtime';

  function components() {
    return {
      engine: window.DDBattle24 || null,
      resolver: window.DD_BATTLE_RESOLVER || null,
      state: window.DD_BATTLE_STATE_RUNTIME || null,
      status: window.DD_STATUS_RUNTIME || null,
      rewards: window.DD_BATTLE_REWARD_RUNTIME || null,
      rewardPresentation: window.DD_BATTLE_REWARD_PRESENTATION || null,
      presentation: window.DD_BATTLE_PRESENTATION_RUNTIME || null
    };
  }

  function requireComponent(name, methods) {
    const component = components()[name];
    if (!component) throw new Error('Battle Runtime missing required component: ' + name);
    (methods || []).forEach(method => {
      if (typeof component[method] !== 'function') {
        throw new Error('Battle Runtime component ' + name + ' is missing method ' + method);
      }
    });
    return component;
  }

  function validate() {
    const checks = [
      ['engine', ['typeResult']],
      ['resolver', ['resolve', 'turnOrder', 'chooseEnemyMove']],
      ['state', ['beginTurn', 'applyResolution', 'endTurn', 'snapshot']],
      ['status', ['tick', 'actionGate']],
      ['rewards', ['award']]
    ];
    const failures = [];
    checks.forEach(([name, methods]) => {
      try { requireComponent(name, methods); }
      catch (error) { failures.push({ component: name, message: error.message }); }
    });
    return { ok: failures.length === 0, owner: OWNER, version: VERSION, failures };
  }

  function snapshot() {
    const state = components().state;
    return state && typeof state.snapshot === 'function' ? state.snapshot() : null;
  }

  function emit(type, detail) {
    const payload = detail || {};
    window.dispatchEvent(new CustomEvent('dd:battle:' + type, { detail: payload }));
    return payload;
  }

  function resolve(actor, move, target, mode) {
    return requireComponent('resolver', ['resolve']).resolve(actor, move, target, mode);
  }

  function beginTurn(participants, context) {
    return requireComponent('state', ['beginTurn']).beginTurn(participants, context);
  }

  function applyResolution(resolution, actor, target, context) {
    return requireComponent('state', ['applyResolution']).applyResolution(resolution, actor, target, context);
  }

  function endTurn(participants, context) {
    return requireComponent('state', ['endTurn']).endTurn(participants, context);
  }

  const runtime = Object.freeze({
    version: VERSION,
    owner: OWNER,
    phase: '4.8-canonical-battle-facade',
    components,
    validate,
    snapshot,
    emit,
    resolve,
    beginTurn,
    applyResolution,
    endTurn,
    resolver: () => requireComponent('resolver'),
    state: () => requireComponent('state'),
    status: () => requireComponent('status'),
    rewards: () => requireComponent('rewards'),
    presentation: () => components().presentation
  });

  const validation = runtime.validate();
  window.DD_BATTLE_RUNTIME = runtime;
  document.dispatchEvent(new CustomEvent('dd:battle-runtime-ready', {
    detail: { owner: OWNER, version: VERSION, validation, runtime }
  }));
})();

/* ---- assets/js/dd-scanner-screen.js ---- */
// assets/js/dd-scanner-screen.js
// Core Stabilization v1.0: canonical scanner presentation owner.
(function(){
  const VERSION='1.0.0';
  const STYLE_ID='ddScannerScreenStyle';

  function esc(value){
    return String(value??'').replace(/[&<>"]/g,function(ch){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch];
    });
  }

  function installStyle(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=[
      '#ddApp .scanner-card[data-owner="dd-scanner-screen"]{height:100%;min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr) auto;gap:14px;align-items:center;text-align:center;overflow:hidden}',
      '#ddApp .scanner-card[data-owner="dd-scanner-screen"] .scannerStatus{display:flex;justify-content:space-between;align-items:center;gap:10px;color:#BAE6FD;font-size:12px}',
      '#ddApp .scanner-card[data-owner="dd-scanner-screen"] .scannerStatus b{color:#FFD700}',
      '#ddApp .scanner-card[data-owner="dd-scanner-screen"] .scannerCore{display:grid;place-items:center;align-content:center;gap:14px;min-height:0}',
      '#ddApp .scanner-card[data-owner="dd-scanner-screen"] .scannerOrb{position:relative;width:min(44vw,180px);height:min(44vw,180px);border-radius:999px;display:grid;place-items:center;margin:0;background:radial-gradient(circle,rgba(56,189,248,.25),rgba(0,123,255,.08) 55%,rgba(2,6,23,.92) 56%);border:1px solid rgba(56,189,248,.62);box-shadow:0 0 30px rgba(0,123,255,.24),inset 0 0 24px rgba(56,189,248,.14);font-size:clamp(42px,13vw,72px)}',
      '#ddApp .scanner-card[data-owner="dd-scanner-screen"] .scannerOrb:before,#ddApp .scanner-card[data-owner="dd-scanner-screen"] .scannerOrb:after{content:"";position:absolute;border-radius:999px;border:1px solid rgba(56,189,248,.28);inset:12%}',
      '#ddApp .scanner-card[data-owner="dd-scanner-screen"] .scannerOrb:after{inset:28%;border-color:rgba(255,215,0,.34)}',
      '#ddApp .scanner-card[data-owner="dd-scanner-screen"] h1{margin:0;color:#38BDF8;font-size:clamp(28px,8vw,42px);line-height:1}',
      '#ddApp .scanner-card[data-owner="dd-scanner-screen"] .scannerMessage{margin:0;max-width:34rem;color:#E0F2FE;font-size:14px;line-height:1.4}',
      '#ddApp .scanner-card[data-owner="dd-scanner-screen"] .scannerStats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}',
      '#ddApp .scanner-card[data-owner="dd-scanner-screen"] .scannerStat{padding:10px 6px;border:1px solid rgba(125,211,252,.18);border-radius:14px;background:rgba(15,23,42,.58);font-size:11px;color:#BAE6FD}',
      '#ddApp .scanner-card[data-owner="dd-scanner-screen"] .scannerStat b{display:block;margin-top:3px;color:white;font-size:16px}',
      '@media(max-height:700px){#ddApp .scanner-card[data-owner="dd-scanner-screen"]{gap:8px}#ddApp .scanner-card[data-owner="dd-scanner-screen"] .scannerOrb{width:min(32vw,126px);height:min(32vw,126px)}#ddApp .scanner-card[data-owner="dd-scanner-screen"] .scannerStats{gap:6px}}'
    ].join('');
    document.head.appendChild(style);
  }

  function renderScannerScreen(context){
    installStyle();
    const ctx=context||{};
    const collection=Array.isArray(ctx.collection)?ctx.collection:[];
    const seen=Array.isArray(ctx.seen)?ctx.seen:[];
    const roster=Array.isArray(ctx.roster)?ctx.roster:[];
    const items=ctx.items||{};
    const message=ctx.log||'Scanner ready. Enter a discovery code or generate a random signal.';
    return `<section class="card scanner-card" data-owner="dd-scanner-screen"><div class="scannerStatus"><span>SCANNER ONLINE</span><b>READY</b></div><div class="scannerCore"><div class="scannerOrb" aria-hidden="true">📡</div><h1>Signal Ready</h1><p class="scannerMessage">${esc(message)}</p></div><div class="scannerStats"><div class="scannerStat">Downloaded<b>${esc(collection.length)}</b></div><div class="scannerStat">Seen<b>${esc(seen.length)}/${esc(roster.length||'?')}</b></div><div class="scannerStat">ByteCoins<b>${esc(items.byteCoins||0)}</b></div></div></section>`;
  }

  installStyle();
  window.DD_SCANNER_SCREEN={version:VERSION,owner:'dd-scanner-screen',status:'active-screen-owner',installStyle,renderScannerScreen};
  document.dispatchEvent(new CustomEvent('dd:scanner-screen-ready',{detail:window.DD_SCANNER_SCREEN}));
})();

/* ---- assets/js/dd-encounter-screen.js ---- */
// assets/js/dd-encounter-screen.js
// Core Stabilization v1.0: canonical encounter presentation owner.
(function(){
  const VERSION='1.0.0';
  const STYLE_ID='ddEncounterScreenStyle';

  function esc(value){
    return String(value??'').replace(/[&<>"]/g,function(ch){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch];
    });
  }

  function pct(value,max){
    const m=Number(max||0);
    if(!m)return 0;
    return Math.max(0,Math.min(100,Math.round(Number(value||0)/m*100)));
  }

  function rarityClass(rarity){
    return String(rarity||'common').toLowerCase().replace(/[^a-z0-9]+/g,'-');
  }

  function installStyle(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=[
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"]{height:100%;min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr) auto;gap:12px;overflow:hidden}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .encounterTop{display:flex;justify-content:space-between;align-items:center;gap:10px}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .encounterTop span{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#BAE6FD}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .rarityBadge{border:1px solid rgba(255,215,0,.38);border-radius:999px;padding:6px 10px;color:#FFD700!important;background:rgba(255,215,0,.08);font-weight:900;letter-spacing:.08em!important}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .encounterCore{display:grid;place-items:center;align-content:center;text-align:center;gap:9px;min-height:0}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .encounterPortrait{--rarity:#38BDF8;width:min(38vw,156px);height:min(38vw,156px);border-radius:999px;display:grid;place-items:center;position:relative;background:radial-gradient(circle,rgba(56,189,248,.2),rgba(15,23,42,.94) 66%);border:7px solid var(--rarity);box-shadow:0 0 34px color-mix(in srgb,var(--rarity) 38%,transparent);font-size:clamp(48px,14vw,78px)}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .encounterPortrait.rare{--rarity:#A78BFA}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .encounterPortrait.epic{--rarity:#F472B6}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .encounterPortrait.legendary{--rarity:#FFD700}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .encounterPortrait.starter{--rarity:#22C55E}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] h1{margin:0;color:#38BDF8;font-size:clamp(28px,8vw,42px);line-height:1;overflow-wrap:anywhere}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .encounterMeta{color:#E0F2FE;font-size:13px}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .encounterLore{margin:3px 0 0;max-width:34rem;color:#E2E8F0;line-height:1.4;font-size:14px}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .encounterSource{margin:0;color:#BAE6FD;font-size:12px}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .encounterStats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .encounterStat{padding:10px 6px;border:1px solid rgba(125,211,252,.2);border-radius:14px;background:rgba(15,23,42,.62);color:#BAE6FD;font-size:11px;text-align:center}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .encounterStat b{display:block;margin-top:3px;color:white;font-size:17px}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .encounterMeters{display:grid;gap:8px}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .meter{border:1px solid rgba(96,165,250,.22);border-radius:14px;background:rgba(15,23,42,.55);padding:8px 10px}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .meterHead{display:flex;justify-content:space-between;gap:8px;color:#E0F2FE;font-size:12px}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .meterHead b{color:#FFD700}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .meterTrack{display:block;margin-top:6px;height:7px;border-radius:999px;background:#020617;overflow:hidden}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .meterTrack i{display:block;height:100%;border-radius:999px}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .signalMeter i{background:linear-gradient(90deg,#38BDF8,#A78BFA,#FB7185)}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .downloadMeter i{background:linear-gradient(90deg,#FFD700,#A3E635,#22C55E)}',
      '@media(max-height:700px){#ddApp .encounter-card[data-owner="dd-encounter-screen"]{gap:7px}#ddApp .encounter-card[data-owner="dd-encounter-screen"] .encounterPortrait{width:min(27vw,112px);height:min(27vw,112px);font-size:clamp(38px,10vw,58px)}#ddApp .encounter-card[data-owner="dd-encounter-screen"] .encounterLore{font-size:12px}}'
    ].join('');
    document.head.appendChild(style);
  }

  function renderEncounterScreen(context){
    installStyle();
    const ctx=context||{};
    const signal=ctx.signal||{};
    const hp=Number(signal.hp??signal.maxHp??44);
    const maxHp=Number(signal.maxHp||signal.hp||44);
    const stability=Number(signal.stability??signal.maxStability??1);
    const maxStability=Number(signal.maxStability||signal.stability||1);
    const odds=Number(signal.currentChance??signal.captureChance??30);
    const captureCap=Number(signal.captureCap||100);
    const rarity=signal.rarity||'Common';
    const types=String(signal.type||'Signal').replace(/\s*\/\s*/g,' • ');
    const source=signal.encounterPoolLabel||'Scanner Pool';
    const lore=signal.lore||signal.description||'An unidentified DataByte signal has entered scanner range.';

    return `<section class="card encounter-card" data-owner="dd-encounter-screen"><div class="encounterTop"><span>Signal Locked</span><span class="rarityBadge">${esc(rarity)}</span></div><div class="encounterCore"><div class="encounterPortrait ${esc(rarityClass(rarity))}">${esc(signal.icon||'◇')}</div><h1>${esc(signal.name||'Unknown Signal')}</h1><div class="encounterMeta">#${esc(signal.dex||'?')} • ${esc(types)}</div><p class="encounterLore">${esc(lore)}</p><p class="encounterSource">Detected in ${esc(source)}.</p></div><div><div class="encounterStats"><div class="encounterStat">Download<b>${esc(odds)}%</b></div><div class="encounterStat">HP<b>${esc(hp)}/${esc(maxHp)}</b></div><div class="encounterStat">Signal<b>${esc(stability)}/${esc(maxStability)}</b></div></div><div class="encounterMeters"><div class="meter signalMeter"><div class="meterHead"><span>Signal Stability</span><b>${esc(stability)}/${esc(maxStability)}</b></div><span class="meterTrack"><i style="width:${pct(stability,maxStability)}%"></i></span></div><div class="meter downloadMeter"><div class="meterHead"><span>Download Window</span><b>${esc(odds)}% / Cap ${esc(signal.captureCap||'?')}</b></div><span class="meterTrack"><i style="width:${pct(odds,captureCap)}%"></i></span></div></div></div></section>`;
  }

  installStyle();
  window.DD_ENCOUNTER_SCREEN={version:VERSION,owner:'dd-encounter-screen',status:'active-screen-owner',installStyle,renderEncounterScreen};
  document.dispatchEvent(new CustomEvent('dd:encounter-screen-ready',{detail:window.DD_ENCOUNTER_SCREEN}));
})();

/* ---- assets/js/dd-battle-screen.js ---- */
// assets/js/dd-battle-screen.js
// Phase 4.8: battle screen renderer with compositor-safe HP presentation.
// Presentation only: reads prepared battle context and never mutates gameplay state.
(function(){
  'use strict';

  const VERSION='0.3.0';
  const STYLE_ID='ddBattleScreenStyle';

  function esc(value){
    return String(value??'').replace(/[&<>"]/g,function(ch){
      return{
        '&':'&amp;',
        '<':'&lt;',
        '>':'&gt;',
        '"':'&quot;'
      }[ch];
    });
  }

  function pct(value,max){
    const m=Number(max||0);
    if(!m)return 0;
    return Math.max(
      0,
      Math.min(100,Math.round(Number(value||0)/m*100))
    );
  }

  function normalizeSprite(sprite){
    const s=Object.assign({},sprite||{});
    s.maxHp=Number(s.maxHp||s.hp||44);
    s.hp=Number(s.hp??s.maxHp);
    s.maxStability=Number(s.maxStability||s.stability||8);
    s.stability=Number(s.stability??s.maxStability);
    return s;
  }

  function normalizeContext(context){
    if(context&&context.battleContext)return context.battleContext;
    return context||{};
  }

  function installStyle(){
    if(document.getElementById(STYLE_ID))return;

    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=[
      '#ddApp .battle-card[data-owner="dd-battle-screen"]{position:relative;display:grid;grid-template-rows:minmax(0,1fr) auto;gap:8px;min-height:0;overflow:hidden}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .battleGrid{display:grid;grid-template-columns:minmax(0,1fr) 30px minmax(0,1fr);gap:8px;align-items:center;justify-items:center;min-height:0}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter{text-align:center;min-width:0;width:100%;overflow:visible}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter h2{margin:8px 0 5px;color:#007BFF;font-size:clamp(20px,5.2vw,29px);line-height:1.04;overflow-wrap:anywhere;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .meta{display:grid;gap:3px;justify-content:center;color:#e0f2fe;font-size:11px;line-height:1.2;min-height:28px;overflow:hidden}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .vs{align-self:center;text-align:center;color:#FFD700;font-weight:1000}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .ring{width:min(25vw,116px);height:min(25vw,116px);border-radius:999px;margin:0 auto;display:grid;place-items:center;background:#07111f;border:4px solid #22C55E;position:relative;transform:none!important;box-sizing:border-box}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .avatar{position:relative;width:calc(100% - 12px);height:calc(100% - 12px);border-radius:999px;display:grid;place-items:center;background:rgba(0,123,255,.15);font-size:clamp(28px,8vw,40px);line-height:1}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .avatar b{font-size:10px;color:#BAE6FD;margin-top:-12px}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .hpTrack{position:absolute;left:14px;right:14px;bottom:10px;height:6px;border-radius:999px;background:#0F172A;overflow:hidden;border:1px solid rgba(255,255,255,.12)}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .hpTrack i{display:block;height:100%;background:#22C55E}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .battleMeters{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;min-width:0}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .signalBox,#ddApp .battle-card[data-owner="dd-battle-screen"] .downloadGauge{min-width:0;margin:0;padding:7px 9px;border:1px solid rgba(96,165,250,.25);border-radius:14px;background:rgba(15,23,42,.55)}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .signalBox>div,#ddApp .battle-card[data-owner="dd-battle-screen"] .downloadGauge>div{display:flex;align-items:center;justify-content:space-between;gap:6px;min-width:0;font-size:11px;line-height:1.15}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .signalBox b,#ddApp .battle-card[data-owner="dd-battle-screen"] .downloadGauge b{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .signalBox span,#ddApp .battle-card[data-owner="dd-battle-screen"] .downloadGauge span,#ddApp .battle-card[data-owner="dd-battle-screen"] .downloadGauge b{color:#FFD700}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .signalBox em,#ddApp .battle-card[data-owner="dd-battle-screen"] .downloadGauge em{display:block;margin-top:5px;height:7px;border-radius:999px;background:#020617;overflow:hidden}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .signalBox i{display:block;height:100%;background:linear-gradient(90deg,#38BDF8,#A78BFA,#FB7185);transition:width .25s}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .downloadGauge i{display:block;height:100%;background:linear-gradient(90deg,#FFD700,#A3E635,#22C55E);transition:width .25s}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .battleLog{position:absolute;left:12px;right:12px;top:var(--dd-toast-top,8px);z-index:8;height:30px;max-height:30px;overflow:hidden;margin:0;padding:6px 10px;border:1px solid rgba(96,165,250,.28);border-radius:14px;background:rgba(2,6,23,.88);box-shadow:0 12px 28px rgba(0,0,0,.28),0 0 18px rgba(0,123,255,.12);opacity:0;transform:translateY(8px);pointer-events:none;transition:opacity .22s ease,transform .22s ease}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .battleLog.dd-toast-visible{opacity:1;transform:translateY(0)}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .battleLog b{display:none}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .battleLog ul{list-style:none;padding:0;margin:0;color:#BAE6FD;font-size:12px;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .battleLog li{display:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .battleLog li:last-child{display:block}',
      '@media(max-width:430px){#ddApp .battle-card[data-owner="dd-battle-screen"] .ring{width:min(22vw,106px);height:min(22vw,106px)}#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter h2{font-size:clamp(19px,5vw,25px)}}',
      '@media(max-width:350px){#ddApp .battle-card[data-owner="dd-battle-screen"] .battleMeters{grid-template-columns:minmax(0,1fr)}#ddApp .battle-card[data-owner="dd-battle-screen"] .signalBox,#ddApp .battle-card[data-owner="dd-battle-screen"] .downloadGauge{padding:6px 8px}}',
      '@media(max-height:720px){#ddApp .battle-card[data-owner="dd-battle-screen"]{gap:6px}#ddApp .battle-card[data-owner="dd-battle-screen"] .battleMeters{gap:6px}#ddApp .battle-card[data-owner="dd-battle-screen"] .signalBox,#ddApp .battle-card[data-owner="dd-battle-screen"] .downloadGauge{padding:6px 8px}}'
    ].join('');

    document.head.appendChild(style);
  }

  function renderMetaLine(sprite){
    const s=normalizeSprite(sprite);
    const type=String(s.type||'Signal').replace(/\s*\/\s*/g,' • ');
    return `<div class="meta">
      <span>#${esc(s.dex||'?')} • ${esc(s.rarity||'Common')}</span>
      <span>${esc(type)}</span>
    </div>`;
  }

  function renderHpRing(sprite){
    const s=normalizeSprite(sprite);
    return `<div class="ring hp">
      <div class="avatar">
        <span>${esc(s.icon||'◇')}</span>
        <b>${esc(s.hp)}/${esc(s.maxHp)}</b>
        <span class="hpTrack" aria-hidden="true"><i style="width:${pct(s.hp,s.maxHp)}%"></i></span>
      </div>
    </div>`;
  }

  function renderFighter(sprite,side){
    const s=normalizeSprite(sprite);
    return `<article class="fighter ${esc(side||'')}">
      ${renderHpRing(s)}
      <h2>${esc(s.name||'Unknown')}</h2>
      ${renderMetaLine(s)}
    </article>`;
  }

  function renderSignalMeter(context){
    const ctx=normalizeContext(context);
    const signalValue=
      ctx.signal!=null
        ?ctx.signal
        :(ctx.wild?ctx.wild.stability:0);
    const maxSignalValue=
      ctx.maxSignal!=null
        ?ctx.maxSignal
        :(ctx.wild?ctx.wild.maxStability:1);
    const signal=Number(signalValue||0);
    const maxSignal=Number(maxSignalValue||1);

    return `<div class="signalBox">
      <div>
        <b>Signal</b>
        <span>${esc(signal)}/${esc(maxSignal)}</span>
      </div>
      <em><i style="width:${pct(signal,maxSignal)}%"></i></em>
    </div>`;
  }

  function renderDownloadGauge(context){
    const ctx=normalizeContext(context);
    const wild=ctx.wild||{};
    const oddsValue=
      ctx.odds!=null
        ?ctx.odds
        :(wild.currentChance!=null?wild.currentChance:30);
    const odds=Number(oddsValue||0);
    const cap=Number(wild.captureCap||100);

    return `<div class="downloadGauge">
      <div>
        <b>Download</b>
        <span>${esc(odds)}% / ${esc(wild.captureCap||100)}%</span>
      </div>
      <em><i style="width:${pct(odds,cap)}%"></i></em>
    </div>`;
  }

  function renderBattleMeters(context){
    return `<div class="battleMeters" data-owner="dd-battle-screen">
      ${renderSignalMeter(context)}
      ${renderDownloadGauge(context)}
    </div>`;
  }

  function renderBattleToast(context){
    const ctx=normalizeContext(context);
    const msg=String(ctx.latestMessage||'').trim();

    return `<div class="battleLog" data-battle-toast="battle-screen">
      <b>Battle Log</b>
      <ul>
        ${msg
          ?`<li>▸ ${esc(msg)}</li>`
          :'<li>▸ Awaiting command.</li>'}
      </ul>
    </div>`;
  }

  function renderBattleScreen(context){
    installStyle();
    const ctx=normalizeContext(context);
    const lead=normalizeSprite(ctx.lead||{});
    const wild=normalizeSprite(ctx.wild||{});

    return `<section class="card battle-card" data-owner="dd-battle-screen">
      <div class="battleGrid">
        ${renderFighter(lead,'lead')}
        <strong class="vs">VS</strong>
        ${renderFighter(wild,'wild')}
      </div>
      ${renderBattleToast(ctx)}
      ${renderBattleMeters(ctx)}
    </section>`;
  }

  installStyle();

  window.DD_BATTLE_SCREEN={
    version:VERSION,
    owner:'dd-battle-screen',
    phase:'4.8-compositor-safe-hp-layout',
    mode:'screen-renderer',
    ready:true,
    installStyle,
    normalizeContext,
    renderBattleScreen,
    renderFighter,
    renderHpRing,
    renderSignalMeter,
    renderDownloadGauge,
    renderBattleMeters,
    renderBattleToast
  };

  document.dispatchEvent(new CustomEvent('dd:battle-screen-ready',{
    detail:window.DD_BATTLE_SCREEN
  }));
})();

/* ---- assets/js/dd-battle-controls.js ---- */
// assets/js/dd-battle-controls.js
// Phase 4.3 Ownership Correction: battle controls renderer and controls layout owner.
(function(){
  const VERSION='0.2.1';
  const STYLE_ID='ddBattleControlsStyle';

  function esc(value){
    return String(value ?? '').replace(/[&<>"]/g,function(ch){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch];
    });
  }

  function slug(value){
    return String(value||'move').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'move';
  }

  function installStyle(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=[
      '#ddApp #controls.battleControlsHost{padding:9px!important;display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:8px!important;border:1px solid rgba(125,211,252,.22)!important;background:rgba(7,17,31,.88)!important;border-radius:22px!important;overflow:hidden!important}',
      '#ddApp #controls.battleControlsHost>.battleMoves{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important;min-width:0!important;width:100%!important}',
      '#ddApp #controls.battleControlsHost>.battleActions{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important;min-width:0!important;width:100%!important}',
      '#ddApp #controls.battleControlsHost button{min-height:39px!important;border:0!important;border-radius:16px!important;padding:9px 10px!important;color:white!important;background:#0F172A!important;font-weight:900!important;font-size:14px!important;line-height:1.05!important;min-width:0!important;white-space:normal!important;overflow:hidden!important}',
      '#ddApp #controls.battleControlsHost button.gold{grid-column:1/-1!important;background:#FFD700!important;color:#111827!important}',
      '#ddApp #controls.battleControlsHost .move{background:linear-gradient(180deg,rgba(15,23,42,.98),rgba(15,23,42,.78))!important;border:1px solid rgba(96,165,250,.18)!important}',
      '#ddApp #controls.battleControlsHost .move small{display:block!important;margin-top:3px!important;color:#BAE6FD!important;font-size:10px!important;font-weight:800!important;line-height:1.05!important}',
      '@media(max-height:760px){#ddApp #controls.battleControlsHost{padding:7px!important;gap:6px!important}#ddApp #controls.battleControlsHost>.battleMoves,#ddApp #controls.battleControlsHost>.battleActions{gap:6px!important}#ddApp #controls.battleControlsHost button{min-height:35px!important;padding:7px 8px!important;font-size:13px!important}}'
    ].join('');
    document.head.appendChild(style);
  }

  function normalizeMoves(context){
    const lead=context&&context.lead||{};
    const moves=Array.isArray(context&&context.moves)?context.moves:Array.isArray(lead.moves)?lead.moves:[];
    return moves.slice(0,4).map(function(move,index){
      if(typeof move==='string')return {id:slug(move),name:move,index:index};
      return {id:slug(move&&move.id||move&&move.name||('move-'+index)),name:(move&&move.name)||('Move '+(index+1)),index:index,type:move&&move.type,power:move&&move.power,accuracy:move&&move.accuracy};
    });
  }

  function renderMoveButton(move){
    const stats=(move.power||move.accuracy)?`<small>${move.power?'PWR '+esc(move.power):''}${move.power&&move.accuracy?' • ':''}${move.accuracy?'ACC '+esc(move.accuracy)+'%':''}</small>`:'';
    return `<button class="move" data-action="move" data-move-id="${esc(move.id)}" data-move-index="${esc(move.index)}">${esc(move.name)}${stats}</button>`;
  }

  function renderMoveGrid(context){
    const moves=normalizeMoves(context);
    const safe=moves.length?moves:[{id:'attack',name:'Attack',index:0}];
    return `<div class="battleMoves" data-owner="dd-battle-controls">${safe.map(renderMoveButton).join('')}</div>`;
  }

  function renderActionGrid(context){
    const state=context&&context.battleState||{};
    const defeated=!!(context&&context.isWildDefeated||state.wildDefeated);
    const leadDown=!!(state.leadDefeated||context&&context.lead&&Number(context.lead.hp||0)<=0);
    if(leadDown){
      return `<div class="battleActions" data-owner="dd-battle-controls"><button data-action="switch">Switch</button><button data-action="return">Return</button></div>`;
    }
    if(defeated){
      return `<div class="battleActions" data-owner="dd-battle-controls"><button class="gold" data-action="download">Download</button><button data-action="items">Items</button><button data-action="return">Return</button></div>`;
    }
    return `<div class="battleActions" data-owner="dd-battle-controls"><button class="gold" data-action="download">Download</button><button data-action="items">Items</button><button data-action="switch">Switch</button><button data-action="return">Return</button></div>`;
  }

  function renderBattleControls(context){
    installStyle();
    return `${renderMoveGrid(context)}${renderActionGrid(context)}`;
  }

  installStyle();
  window.DD_BATTLE_CONTROLS={version:VERSION,owner:'dd-battle-controls',phase:'4.3-ownership-correction',mode:'controls-renderer',installStyle,renderBattleControls,renderMoveGrid,renderActionGrid,renderMoveButton,normalizeMoves};
  document.dispatchEvent(new CustomEvent('dd:battle-controls-ready',{detail:window.DD_BATTLE_CONTROLS}));
})();

/* ---- assets/js/dd-confirm-screen.js ---- */
// assets/js/dd-confirm-screen.js
// Core Stabilization v1.0: canonical Download confirmation presentation owner.
(function(){
  const VERSION='1.0.0';
  const STYLE_ID='ddConfirmScreenStyle';

  function esc(value){
    return String(value??'').replace(/[&<>"]/g,function(ch){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch];
    });
  }

  function pct(value,max){
    const m=Number(max||0);
    if(!m)return 0;
    return Math.max(0,Math.min(100,Math.round(Number(value||0)/m*100)));
  }

  function installStyle(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=[
      '#ddApp .confirm-card[data-owner="dd-confirm-screen"]{height:100%;min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr) auto;gap:14px;overflow:hidden;text-align:center}',
      '#ddApp .confirm-card[data-owner="dd-confirm-screen"] .confirmTop{display:flex;justify-content:space-between;align-items:center;gap:10px;color:#BAE6FD;font-size:11px;letter-spacing:.15em;text-transform:uppercase}',
      '#ddApp .confirm-card[data-owner="dd-confirm-screen"] .confirmTop b{color:#FFD700}',
      '#ddApp .confirm-card[data-owner="dd-confirm-screen"] .confirmCore{display:grid;place-items:center;align-content:center;gap:12px;min-height:0}',
      '#ddApp .confirm-card[data-owner="dd-confirm-screen"] .coin{position:relative;width:min(40vw,160px);height:min(40vw,160px);border-radius:999px;display:grid;place-items:center;margin:0;background:radial-gradient(circle at 35% 30%,#FFF7A8,#FFD700 45%,#B88700 78%);color:#111827;border:7px solid rgba(255,255,255,.22);box-shadow:0 0 38px rgba(255,215,0,.35),inset 0 0 18px rgba(255,255,255,.38);font-size:clamp(34px,10vw,56px);font-weight:1000;letter-spacing:-.06em}',
      '#ddApp .confirm-card[data-owner="dd-confirm-screen"] .coin:after{content:"BYTECOIN";position:absolute;bottom:24%;font-size:9px;letter-spacing:.15em}',
      '#ddApp .confirm-card[data-owner="dd-confirm-screen"] h1{margin:0;color:#38BDF8;font-size:clamp(27px,7vw,40px);line-height:1.05;overflow-wrap:anywhere}',
      '#ddApp .confirm-card[data-owner="dd-confirm-screen"] .confirmLead{margin:0;color:#E2E8F0;font-size:14px;line-height:1.4;max-width:34rem}',
      '#ddApp .confirm-card[data-owner="dd-confirm-screen"] .confirmStats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;width:100%}',
      '#ddApp .confirm-card[data-owner="dd-confirm-screen"] .confirmStat{padding:10px 6px;border:1px solid rgba(125,211,252,.2);border-radius:14px;background:rgba(15,23,42,.62);color:#BAE6FD;font-size:11px}',
      '#ddApp .confirm-card[data-owner="dd-confirm-screen"] .confirmStat b{display:block;margin-top:3px;color:white;font-size:17px}',
      '#ddApp .confirm-card[data-owner="dd-confirm-screen"] .oddsBox{width:100%;padding:10px;border:1px solid rgba(255,215,0,.25);border-radius:16px;background:rgba(15,23,42,.58);box-sizing:border-box}',
      '#ddApp .confirm-card[data-owner="dd-confirm-screen"] .oddsHead{display:flex;justify-content:space-between;gap:8px;color:#E0F2FE;font-size:12px}',
      '#ddApp .confirm-card[data-owner="dd-confirm-screen"] .oddsHead b{color:#FFD700}',
      '#ddApp .confirm-card[data-owner="dd-confirm-screen"] .oddsTrack{display:block;margin-top:7px;height:8px;border-radius:999px;background:#020617;overflow:hidden}',
      '#ddApp .confirm-card[data-owner="dd-confirm-screen"] .oddsTrack i{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,#FFD700,#A3E635,#22C55E)}',
      '#ddApp .confirm-card[data-owner="dd-confirm-screen"] .riskNote{margin:0;color:#FDE68A;font-size:12px;line-height:1.35}',
      '@media(max-height:700px){#ddApp .confirm-card[data-owner="dd-confirm-screen"]{gap:8px}#ddApp .confirm-card[data-owner="dd-confirm-screen"] .coin{width:min(28vw,112px);height:min(28vw,112px);font-size:34px}#ddApp .confirm-card[data-owner="dd-confirm-screen"] .coin:after{bottom:19%;font-size:7px}}'
    ].join('');
    document.head.appendChild(style);
  }

  function renderConfirmScreen(context){
    installStyle();
    const ctx=context||{};
    const signal=ctx.signal||{};
    const confirm=ctx.confirm||{};
    const inventory=ctx.items||{};
    const odds=Number(confirm.odds??signal.currentChance??signal.captureChance??0);
    const cap=Number(signal.captureCap||100);
    const byteCoins=Number(confirm.byteCoins??inventory.byteCoins??0);
    const stability=Number(signal.stability??signal.maxStability??0);
    const maxStability=Number(signal.maxStability||signal.stability||1);
    const hasCoin=byteCoins>0;

    return `<section class="card confirm-card ${hasCoin?'':'bad'}" data-owner="dd-confirm-screen"><div class="confirmTop"><span>Download Confirmation</span><b>${hasCoin?'BYTECOIN READY':'NO BYTECOINS'}</b></div><div class="confirmCore"><div class="coin" aria-hidden="true">BC</div><h1>Download ${esc(signal.name||'this signal')}?</h1><p class="confirmLead">Spend one ByteCoin to attempt a permanent download into your collection.</p><div class="confirmStats"><div class="confirmStat">Download Odds<b>${esc(odds)}%</b></div><div class="confirmStat">ByteCoins<b>${esc(byteCoins)}</b></div><div class="confirmStat">Signal<b>${esc(stability)}/${esc(maxStability)}</b></div></div><div class="oddsBox"><div class="oddsHead"><span>Download Window</span><b>${esc(odds)}% / Cap ${esc(signal.captureCap||'?')}</b></div><span class="oddsTrack"><i style="width:${pct(odds,cap)}%"></i></span></div></div><p class="riskNote">A failed download consumes one ByteCoin and weakens Signal stability.</p></section>`;
  }

  installStyle();
  window.DD_CONFIRM_SCREEN={version:VERSION,owner:'dd-confirm-screen',status:'active-screen-owner',installStyle,renderConfirmScreen};
  document.dispatchEvent(new CustomEvent('dd:confirm-screen-ready',{detail:window.DD_CONFIRM_SCREEN}));
})();

/* ---- assets/js/dd-result-screen.js ---- */
// assets/js/dd-result-screen.js
// Core Stabilization v1.0: canonical Download result presentation owner.
(function(){
  const VERSION='1.0.0';
  const STYLE_ID='ddResultScreenStyle';

  function esc(value){
    return String(value??'').replace(/[&<>"]/g,function(ch){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch];
    });
  }

  function normalizeType(value){
    const type=String(value||'').toLowerCase();
    if(type==='success'||type==='complete'||type==='captured')return 'success';
    if(type==='fail'||type==='failure'||type==='error'||type==='lost')return 'failure';
    return 'neutral';
  }

  function installStyle(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=[
      '#ddApp .result-card[data-owner="dd-result-screen"]{--result-accent:#38BDF8;height:100%;min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr) auto;gap:14px;overflow:hidden;text-align:center}',
      '#ddApp .result-card[data-owner="dd-result-screen"].success{--result-accent:#22C55E;border-color:rgba(34,197,94,.55)}',
      '#ddApp .result-card[data-owner="dd-result-screen"].failure{--result-accent:#FB7185;border-color:rgba(251,113,133,.55)}',
      '#ddApp .result-card[data-owner="dd-result-screen"] .resultTop{display:flex;justify-content:space-between;align-items:center;gap:10px;color:#BAE6FD;font-size:11px;letter-spacing:.15em;text-transform:uppercase}',
      '#ddApp .result-card[data-owner="dd-result-screen"] .resultTop b{color:var(--result-accent)}',
      '#ddApp .result-card[data-owner="dd-result-screen"] .resultCore{display:grid;place-items:center;align-content:center;gap:14px;min-height:0}',
      '#ddApp .result-card[data-owner="dd-result-screen"] .resultIcon{width:min(42vw,168px);height:min(42vw,168px);border-radius:999px;display:grid;place-items:center;position:relative;background:radial-gradient(circle,rgba(56,189,248,.18),rgba(15,23,42,.94) 68%);border:7px solid var(--result-accent);box-shadow:0 0 40px color-mix(in srgb,var(--result-accent) 36%,transparent);font-size:clamp(50px,15vw,82px)}',
      '#ddApp .result-card[data-owner="dd-result-screen"] .resultIcon:after{content:"";position:absolute;inset:12%;border-radius:999px;border:1px solid color-mix(in srgb,var(--result-accent) 48%,transparent)}',
      '#ddApp .result-card[data-owner="dd-result-screen"] h1{margin:0;color:var(--result-accent);font-size:clamp(28px,8vw,42px);line-height:1.04;overflow-wrap:anywhere}',
      '#ddApp .result-card[data-owner="dd-result-screen"] .resultMessage{margin:0;max-width:34rem;color:#E2E8F0;font-size:15px;line-height:1.45}',
      '#ddApp .result-card[data-owner="dd-result-screen"] .resultSummary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;width:100%}',
      '#ddApp .result-card[data-owner="dd-result-screen"] .resultStat{padding:10px 6px;border:1px solid rgba(125,211,252,.18);border-radius:14px;background:rgba(15,23,42,.62);color:#BAE6FD;font-size:11px}',
      '#ddApp .result-card[data-owner="dd-result-screen"] .resultStat b{display:block;margin-top:3px;color:white;font-size:16px}',
      '#ddApp .result-card[data-owner="dd-result-screen"] .resultNext{margin:0;color:#BAE6FD;font-size:12px;line-height:1.35}',
      '@media(max-height:700px){#ddApp .result-card[data-owner="dd-result-screen"]{gap:8px}#ddApp .result-card[data-owner="dd-result-screen"] .resultIcon{width:min(29vw,116px);height:min(29vw,116px);font-size:42px}#ddApp .result-card[data-owner="dd-result-screen"] .resultMessage{font-size:13px}}'
    ].join('');
    document.head.appendChild(style);
  }

  function renderResultScreen(context){
    installStyle();
    const ctx=context||{};
    const result=ctx.result||{};
    const type=normalizeType(result.type);
    const success=type==='success';
    const sprite=result.sprite||result.signal||result.downloadedSprite||null;
    const collection=Array.isArray(ctx.collection)?ctx.collection:[];
    const party=Array.isArray(ctx.party)?ctx.party:[];
    const inventory=ctx.items||{};
    const title=result.title||(success?'Download Complete':type==='failure'?'Download Failed':'Result');
    const message=result.msg||result.message||(success?'The signal was added to your collection.':'The signal could not be downloaded.');
    const icon=sprite&&sprite.icon?sprite.icon:(success?'✓':type==='failure'?'!':'◇');
    const status=success?'SAVED':type==='failure'?'SIGNAL LOST':'COMPLETE';
    const next=success?'The downloaded sprite is now available in your collection and party systems.':'Return to the Scanner and search for another signal.';

    return `<section class="card result-card ${esc(type)}" data-owner="dd-result-screen"><div class="resultTop"><span>Scanner Result</span><b>${esc(status)}</b></div><div class="resultCore"><div class="resultIcon" aria-hidden="true">${esc(icon)}</div><h1>${esc(title)}</h1><p class="resultMessage">${esc(message)}</p>${sprite?`<p class="resultNext">${esc(sprite.name||'DataByte Sprite')} • #${esc(sprite.dex||'?')} • ${esc(sprite.rarity||'Common')}</p>`:''}</div><div><div class="resultSummary"><div class="resultStat">Collection<b>${esc(collection.length)}</b></div><div class="resultStat">Party Slots<b>${esc(party.length)}/5</b></div><div class="resultStat">ByteCoins<b>${esc(inventory.byteCoins||0)}</b></div></div><p class="resultNext">${esc(next)}</p></div></section>`;
  }

  installStyle();
  window.DD_RESULT_SCREEN={version:VERSION,owner:'dd-result-screen',status:'active-screen-owner',installStyle,renderResultScreen};
  document.dispatchEvent(new CustomEvent('dd:result-screen-ready',{detail:window.DD_RESULT_SCREEN}));
})();

/* ---- assets/js/dd-screen-registry.js ---- */
// Data Discovery v4.9: canonical public registry for screen and control owners.
(function () {
  'use strict';

  if (!location.pathname.includes('databyte-discovery')) return;
  if (window.DD_SCREEN_REGISTRY) return;

  const VERSION = '1.0.0';
  const OWNER = 'dd-screen-registry';

  function components() {
    return {
      scanner: window.DD_SCANNER_SCREEN || null,
      encounter: window.DD_ENCOUNTER_SCREEN || null,
      battle: window.DD_BATTLE_SCREEN || null,
      battleControls: window.DD_BATTLE_CONTROLS || null,
      confirm: window.DD_CONFIRM_SCREEN || null,
      result: window.DD_RESULT_SCREEN || null
    };
  }

  const screens = Object.freeze({
    scanner: ['scanner', 'renderScannerScreen'],
    encounter: ['encounter', 'renderEncounterScreen'],
    battle: ['battle', 'renderBattleScreen'],
    confirm: ['confirm', 'renderConfirmScreen'],
    result: ['result', 'renderResultScreen']
  });

  function has(name) { return !!screens[name]; }

  function renderScreen(name, context) {
    const entry = screens[name];
    if (!entry) return null;
    const component = components()[entry[0]];
    if (!component || typeof component[entry[1]] !== 'function') {
      throw new Error('Screen Registry missing ' + name + ' screen owner.');
    }
    return component[entry[1]](name === 'battle' ? context && context.battleContext || context : context);
  }

  function renderControls(name, context) {
    const ctx = context || {};
    if (name === 'scanner') {
      return '<label>Discovery Code</label><input id="code" placeholder="Enter code..."><button id="discover" class="gold">Discover</button><button id="random">Random Code</button>';
    }
    if (name === 'encounter') {
      return '<button id="battleStart" class="gold">Start Battle</button><button id="back">Return</button>';
    }
    if (name === 'battle') {
      const controls = components().battleControls;
      if (!controls || typeof controls.renderBattleControls !== 'function') {
        throw new Error('Screen Registry missing battle controls owner.');
      }
      return controls.renderBattleControls(ctx.battleContext || ctx);
    }
    if (name === 'confirm') {
      return '<button id="confirm" class="gold">Confirm Download</button><button id="battleStart">Back to Battle</button>';
    }
    if (name === 'result') {
      return ctx.result && ctx.result.canContinue
        ? '<button id="continueBattle" class="gold">Continue Battle</button><button id="back">Return to Scanner</button>'
        : '<button id="back" class="gold">Return to Scanner</button>';
    }
    return null;
  }

  function validate() {
    const failures = [];
    Object.keys(screens).forEach(name => {
      const entry = screens[name];
      const component = components()[entry[0]];
      if (!component || typeof component[entry[1]] !== 'function') {
        failures.push({ name, message: 'Missing screen owner method ' + entry[1] + '.' });
      }
    });
    const controls = components().battleControls;
    if (!controls || typeof controls.renderBattleControls !== 'function') {
      failures.push({ name: 'battle-controls', message: 'Missing battle controls owner method renderBattleControls.' });
    }
    return { ok: failures.length === 0, owner: OWNER, version: VERSION, failures };
  }

  window.DD_SCREEN_REGISTRY = Object.freeze({
    version: VERSION,
    owner: OWNER,
    phase: '4.9-canonical-screen-registry',
    components,
    screens,
    has,
    renderScreen,
    renderControls,
    validate
  });

  document.dispatchEvent(new CustomEvent('dd:screen-registry-ready', {
    detail: { owner: OWNER, version: VERSION, validation: validate(), registry: window.DD_SCREEN_REGISTRY }
  }));
})();
