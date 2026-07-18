/* Generated Data Discovery runtime bundle.
 * Do not edit directly. Run: node studio/tools/build-data-discovery-runtime.mjs
 * Inputs: 6
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
