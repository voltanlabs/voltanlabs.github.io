/* Generated Data Discovery runtime bundle.
 * Do not edit directly. Run: node studio/tools/build-data-discovery-runtime.mjs
 * Inputs: 19
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

  function movesForSpecies(speciesId, movesData, species) {
    var moves = allMoves(movesData);
    var sets = moveSets(movesData);
    var ids = ['signal-strike'];
    var set = sets.find(function (entry) {
      return entry.speciesId === speciesId;
    });

    if (set && Array.isArray(set.moves)) ids = set.moves.slice();

    if (!set && species) {
      var configurations = configurationsFor(species);
      var specialty = moves.find(function (move) {
        return move.id !== 'signal-strike' &&
          configurations.indexOf(move.configuration) >= 0;
      });
      if (specialty) ids.push(specialty.id);
    }

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
        moves: movesForSpecies(null, movesData, null)
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
      moves: movesForSpecies(species.id, movesData, species),
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

  const VERSION = '1.3.0';
  const OWNER = 'DD_STATUS_RUNTIME';

  const DEFINITIONS = Object.freeze({
    burn: { duration: 3, maxStacks: 3, tickDamage: 2, tickPhase: 'end', label: 'Burn' },
    freeze: { duration: 2, maxStacks: 1, actionBlockChance: 55, speedMultiplier: 0.65, label: 'Freeze' },
    shock: { duration: 2, maxStacks: 2, accuracyMultiplier: 0.82, speedMultiplier: 0.8, label: 'Shock' },
    corruption: { duration: 4, maxStacks: 3, tickDamage: 1, attackMultiplier: 0.9, defenseMultiplier: 0.9, tickPhase: 'end', label: 'Corruption' },
    shield: { duration: 3, maxStacks: 2, damageTakenMultiplier: 0.72, label: 'Shield' },
    boost: { duration: 3, maxStacks: 2, attackMultiplier: 1.18, speedMultiplier: 1.12, label: 'Boost' },
    charged: { duration: 2, maxStacks: 2, attackMultiplier: 1.15, speedMultiplier: 1.08, label: 'Charged' },
    guarded: { duration: 2, maxStacks: 1, damageTakenMultiplier: 0.68, label: 'Guarded' },
    misdirected: { duration: 1, maxStacks: 1, accuracyMultiplier: 0.72, label: 'Misdirected' },
    bound: { duration: 1, maxStacks: 1, speedMultiplier: 0.55, label: 'Bound' },
    infected: { duration: 3, maxStacks: 3, tickDamage: 2, attackMultiplier: 0.9, tickPhase: 'end', label: 'Infected' }
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
      if (!options.silent) {
        safeDispatch('dd:status-applied', {
          target,
          status: existing,
          refreshed: true
        });
      }
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
    if (!options.silent) {
      safeDispatch('dd:status-applied', {
        target,
        status: entry,
        refreshed: false
      });
    }
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
      if (!context.silent) {
        safeDispatch('dd:status-tick-blocked', {
          target,
          context,
          result
        });
      }
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

        if (!context.silent) {
          safeDispatch('dd:status-ticked', {
            target,
            status,
            context,
            effect
          });
        }

        if (damage > 0 && !context.silent) {
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
        if (!context.silent) {
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
        }
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

      if (!context.silent) {
        safeDispatch('dd:status-runtime-error', {
          target,
          context,
          error: lastError
        });
      }

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

/* ---- assets/js/dd-player-runtime.js ---- */
// Data Discovery v4.8: canonical player persistence and party ownership.
(function () {
  'use strict';

  if (!location.pathname.includes('databyte-discovery')) return;
  if (window.DD_PLAYER_RUNTIME) return;

  const VERSION = '1.2.1';
  const OWNER = 'dd-player-runtime';
  const MAX_PARTY = 5;
  const KEYS = Object.freeze({
    collection: 'vl_databyte_discovery_collection_v2',
    party: 'vl_databyte_party_v1',
    items: 'vl_databyte_items_v1',
    seen: 'vl_databyte_seen_v1',
    backup: 'vl_databyte_player_backup_v1'
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
    if (key !== KEYS.backup) backupSnapshot();
    return value;
  }

  function backupSnapshot() {
    const backup = {
      version: VERSION,
      savedAt: new Date().toISOString(),
      collection: read(KEYS.collection, []),
      party: read(KEYS.party, []),
      items: read(KEYS.items, DEFAULT_ITEMS),
      seen: read(KEYS.seen, [])
    };
    localStorage.setItem(KEYS.backup, JSON.stringify(backup));
    return backup;
  }

  function restoreBackup() {
    const backup = read(KEYS.backup, null);
    if (!backup || typeof backup !== 'object') return { ok: false, reason: 'backup-unavailable' };
    localStorage.setItem(KEYS.collection, JSON.stringify(Array.isArray(backup.collection) ? backup.collection : []));
    localStorage.setItem(KEYS.party, JSON.stringify(Array.isArray(backup.party) ? backup.party : []));
    localStorage.setItem(KEYS.items, JSON.stringify(normalizeItems(backup.items)));
    localStorage.setItem(KEYS.seen, JSON.stringify(Array.isArray(backup.seen) ? backup.seen : []));
    activeSlot = 0;
    clearRequirement('backup-restored');
    const restored = backupSnapshot();
    emit('dd:player-backup-restored', { savedAt: restored.savedAt });
    return { ok: true, backup: restored };
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

  function reconcileCollectionWithRoster() {
    const roster = Array.isArray(window.DD_CANON_ROSTER) ? window.DD_CANON_ROSTER : [];
    const current = collectionAll();
    if (!roster.length || !current.length) return { ok: true, updated: 0, collection: current };
    let updated = 0;
    const next = current.map(saved => {
      if (!saved) return saved;
      const canonical = roster.find(sprite =>
        sprite && (sprite.id === saved.id || sprite.name === saved.name)
      );
      if (!canonical) return saved;
      const canonicalMoves = Array.isArray(canonical.moves) ? canonical.moves : [];
      const savedMoveIds = (saved.moves || []).map(move => move && (move.id || move.name)).filter(Boolean).join('|');
      const canonicalMoveIds = canonicalMoves.map(move => move && (move.id || move.name)).filter(Boolean).join('|');
      if (!canonicalMoveIds || canonicalMoveIds === savedMoveIds) return saved;
      updated += 1;
      return Object.assign({}, canonical, saved, { moves: canonicalMoves });
    });
    if (updated) collectionWrite(next);
    return { ok: true, updated, collection: next };
  }

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
    return partyIds().map(id => sprites.find(sprite => sprite && sprite.id === id)).filter(Boolean);
  }
  function usableMembers(options) {
    const excludedId = options && (options.excludeId || options.activeId) || null;
    return partyMembers().filter(sprite => isUsable(sprite) && (!excludedId || sprite.id !== excludedId));
  }
  function lead() {
    const members = partyMembers();
    const active = members[activeSlot] || null;
    return (isUsable(active) ? active : members.find(isUsable)) || active || members[0] || collectionAll()[0] || null;
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
  function updateSprite(sprite) {
    if (!sprite || !sprite.id) return null;
    const list = collectionAll();
    const index = list.findIndex(item => item && item.id === sprite.id);
    if (index >= 0) list[index] = Object.assign({}, list[index], sprite);
    else list.push(sprite);
    collectionWrite(list);
    return sprite;
  }

  function restoreParty() {
    const ids = new Set(partyIds());
    let restored = 0;
    const next = collectionAll().map(sprite => {
      if (!sprite || !ids.has(sprite.id)) return sprite;
      const maxHp = Math.max(1, Number(sprite.maxHp || sprite.hp || 44));
      if (Number(sprite.hp || 0) < maxHp) restored += 1;
      return Object.assign({}, sprite, { hp: maxHp, maxHp });
    });
    collectionWrite(next);
    clearRequirement('party-restored');
    activeSlot = 0;
    emit('dd:party-restored', { restored, ids: [...ids] });
    emit('databyte:inventory-updated', { domain: 'collection', reason: 'party-restored' });
    return { ok: true, restored, party: partyMembers() };
  }

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
  const recovery = Object.freeze({ restoreParty, backup: backupSnapshot, restoreBackup, reconcileCollectionWithRoster });

  function snapshot() { return { collection: collectionAll(), party: partyMembers(), activeSlot, items: inventoryRead(), seen: readSeen(), switchRequired, switchReason }; }
  function health() { const state = snapshot(); return { owner: OWNER, version: VERSION, collectionCount: state.collection.length, partyCount: state.party.length, usableCount: state.party.filter(isUsable).length, activeSlot, switchRequired }; }

  window.DD_PLAYER_RUNTIME = Object.freeze({ version: VERSION, owner: OWNER, phase: '4.9-post-defeat-party-recovery', keys: KEYS, collection, party, partySwitch, inventory, dex, recovery, snapshot, health });

  // Compatibility views: one implementation and one storage owner.
  window.DD_COLLECTION_RUNTIME = Object.freeze(Object.assign({ version: VERSION, owner: OWNER, key: KEYS.collection }, collection));
  window.DD_PARTY_RUNTIME = Object.freeze(Object.assign({ version: VERSION, owner: OWNER, keys: KEYS }, party));
  window.DD_PARTY_SWITCH_RUNTIME = Object.freeze(Object.assign({ version: VERSION, owner: OWNER }, partySwitch));
  window.DD_INVENTORY_RUNTIME = Object.freeze(Object.assign({ version: VERSION, owner: OWNER, key: KEYS.items, defaults: DEFAULT_ITEMS }, inventory));
  window.DD_DEX_RUNTIME = Object.freeze(Object.assign({ version: VERSION, owner: OWNER, key: KEYS.seen }, dex));
  window.DD_COLLECTION_DEX_BRIDGE = Object.freeze({ version: VERSION, owner: OWNER, status: 'compatibility-view' });

  if (localStorage.getItem(KEYS.collection) === null && read(KEYS.backup, null)) {
    restoreBackup();
  }
  inventory.ensure();
  backupSnapshot();
  reconcileCollectionWithRoster();
  document.addEventListener('dd:studio-data-ready', reconcileCollectionWithRoster);
  emit('dd:player-runtime-ready', { runtime: window.DD_PLAYER_RUNTIME });
  emit('dd:collection-runtime-ready', { runtime: window.DD_COLLECTION_RUNTIME });
  emit('dd:party-runtime-ready', { runtime: window.DD_PARTY_RUNTIME });
  emit('dd:party-switch-runtime-ready', { runtime: window.DD_PARTY_SWITCH_RUNTIME });
  emit('dd:inventory-runtime-ready', { runtime: window.DD_INVENTORY_RUNTIME });
  emit('dd:dex-runtime-ready', { runtime: window.DD_DEX_RUNTIME });
  emit('dd:collection-dex-bridge-ready', { runtime: window.DD_COLLECTION_DEX_BRIDGE });
})();

/* ---- assets/js/dd-battle-core-runtime.js ---- */
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

/* ---- assets/js/dd-battle-reward-runtime.js ---- */
// assets/js/dd-battle-reward-runtime.js
// Phase 4.5: canonical, idempotent battle rewards and progression hooks.
(function () {
  'use strict';

  if (!location.pathname.includes('databyte-discovery')) return;
  if (window.DD_BATTLE_REWARD_RUNTIME) return;

  const VERSION = '1.1.0';
  const OWNER = 'dd-battle-reward-runtime';
  const STORAGE_KEY = 'vl_databyte_battle_rewards_v1';

  const DEFAULT_PROFILE = Object.freeze({
    totalXp: 0,
    victories: 0,
    byteCoinsEarned: 0,
    dropsEarned: {},
    spriteXp: {},
    spriteProgress: {},
    processedBattles: {},
    battleHistory: [],
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

    next.spriteProgress =
      next.spriteProgress &&
      typeof next.spriteProgress === 'object'
        ? next.spriteProgress
        : {};

    next.processedBattles =
      next.processedBattles &&
      typeof next.processedBattles === 'object'
        ? next.processedBattles
        : {};

    next.battleHistory = Array.isArray(next.battleHistory)
      ? next.battleHistory.slice(-100)
      : [];

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

  function player() {
    return window.DD_PLAYER_RUNTIME || null;
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

  function xpFloor(level) {
    const safeLevel = Math.max(1, Math.floor(Number(level) || 1));
    return 20 * (safeLevel - 1) * safeLevel;
  }

  function levelFromXp(totalXp) {
    const xp = Math.max(0, Number(totalXp) || 0);
    let level = 1;
    while (level < 30 && xp >= xpFloor(level + 1)) level += 1;
    return level;
  }

  function tierForLevel(level) {
    const value = Math.max(1, Number(level) || 1);
    if (value >= 25) return 'Petabyte';
    if (value >= 15) return 'Terabyte';
    if (value >= 10) return 'Gigabyte';
    if (value >= 5) return 'Megabyte';
    return 'Kilobyte';
  }

  function progressionSnapshot(sprite, totalXp) {
    const xp = Math.max(0, Number(totalXp) || 0);
    const level = levelFromXp(xp);
    const currentFloor = xpFloor(level);
    const nextFloor = level >= 30 ? currentFloor : xpFloor(level + 1);
    return {
      recipientKey: recipientKey(sprite),
      level,
      tier: tierForLevel(level),
      totalXp: xp,
      levelXp: Math.max(0, xp - currentFloor),
      levelXpRequired: level >= 30 ? 0 : Math.max(1, nextFloor - currentFloor),
      progressPercent: level >= 30
        ? 100
        : clamp(Math.round((xp - currentFloor) / (nextFloor - currentFloor) * 100), 0, 100)
    };
  }

  function applyProgression(recipient, previousXp, totalXp) {
    const before = progressionSnapshot(recipient, previousXp);
    const after = progressionSnapshot(recipient, totalXp);
    const levelsGained = Math.max(0, after.level - before.level);
    const tierUpgraded = before.tier !== after.tier;
    const runtime = player();
    let updatedSprite = null;

    if (
      recipient &&
      runtime &&
      runtime.collection &&
      typeof runtime.collection.find === 'function' &&
      typeof runtime.collection.update === 'function'
    ) {
      const current = runtime.collection.find(recipient.id) || recipient;
      const defenseGain = Math.max(0, Math.floor(after.level / 2) - Math.floor(before.level / 2));
      const speedGain = Math.max(0, Math.floor(after.level / 3) - Math.floor(before.level / 3));
      updatedSprite = Object.assign({}, current, {
        level: after.level,
        xp: after.totalXp,
        xpToNext: after.levelXpRequired,
        progressionTier: after.tier,
        maxHp: Math.max(1, Number(current.maxHp || current.hp || 1) + levelsGained * 2),
        hp: Math.max(0, Number(current.hp || 0) + levelsGained * 2),
        atk: Math.max(1, Number(current.atk || current.attack || 1) + levelsGained),
        def: Math.max(1, Number(current.def || current.defense || 1) + defenseGain),
        speed: Math.max(1, Number(current.speed || 1) + speedGain)
      });
      runtime.collection.update(updatedSprite);
    }

    return {
      before,
      after,
      levelsGained,
      leveledUp: levelsGained > 0,
      tierUpgraded,
      updatedSprite
    };
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

    const previousXp = Math.max(
      0,
      Number(profile.spriteXp[key] || 0)
    );
    profile.spriteXp[key] = previousXp + reward.xp;
    const progression = applyProgression(
      reward.recipient,
      previousXp,
      profile.spriteXp[key]
    );
    profile.spriteProgress[key] = progression.after;

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
        progression,
        inventoryResults,
        awardedAt:
          new Date().toISOString()
      }
    );

    profile.processedBattles[
      reward.encounterId
    ] = storedReward;
    profile.lastReward = storedReward;
    profile.battleHistory.push({
      encounterId: reward.encounterId,
      result: 'victory',
      opponent: reward.defeated,
      recipientKey: key,
      xp: reward.xp,
      byteCoins: reward.byteCoins,
      drops: reward.drops,
      level: progression.after.level,
      tier: progression.after.tier,
      leveledUp: progression.leveledUp,
      tierUpgraded: progression.tierUpgraded,
      at: storedReward.awardedAt
    });
    profile.battleHistory = profile.battleHistory.slice(-100);

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
        totalXp: saved.spriteXp[key],
        progression
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

  function getProgression(sprite) {
    const profile = read();
    const key = recipientKey(sprite);
    return profile.spriteProgress[key] || progressionSnapshot(
      sprite,
      profile.spriteXp[key] || 0
    );
  }

  function getHistory(limit) {
    const history = read().battleHistory.slice().reverse();
    return history.slice(0, Math.max(1, Number(limit) || 20));
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
        ).length,
      historyCount: read().battleHistory.length
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
      getProgression,
      getHistory,
      xpFloor,
      levelFromXp,
      tierForLevel,
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

  const VERSION = '1.1.0';
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
    const progression = reward.progression || {};
    const progress = progression.after || null;

    element.innerHTML =
      '<div class="dd-reward-title">BATTLE REWARDS</div>' +
      '<div class="dd-reward-row"><span>XP</span><strong>+' +
      Number(reward.xp || 0) +
      '</strong></div>' +
      '<div class="dd-reward-row"><span>ByteCoins</span><strong>+' +
      Number(reward.byteCoins || 0) +
      '</strong></div>' +
      (
        progress
          ? '<div class="dd-reward-row"><span>' +
            String(progress.tier || 'Kilobyte') +
            ' Level</span><strong>' +
            Number(progress.level || 1) +
            '</strong></div>'
          : ''
      ) +
      (
        progression.leveledUp
          ? '<div class="dd-reward-drop">LEVEL UP +' +
            Number(progression.levelsGained || 1) +
            '</div>'
          : ''
      ) +
      (
        progression.tierUpgraded
          ? '<div class="dd-reward-drop">VERSION UPGRADE: ' +
            String(progress && progress.tier || '') +
            '</div>'
          : ''
      ) +
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

  const VERSION='0.5.1';
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

  function hpColor(value,max){
    const valuePct=pct(value,max);
    if(valuePct>50)return '#22C55E';
    if(valuePct>25)return '#FFD700';
    return '#FB7185';
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

  function safeSpriteAsset(value){
    const raw=String(value||'').trim();
    if(!raw)return '';
    try{
      const origin=location&&location.origin||'http://localhost';
      const url=new URL(raw,origin);
      return url.origin===origin&&url.pathname.startsWith('/assets/')
        ?url.href
        :'';
    }catch(error){
      return '';
    }
  }

  function installStyle(){
    if(document.getElementById(STYLE_ID))return;

    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=[
      '#ddApp .battle-card[data-owner="dd-battle-screen"]{position:relative;display:grid;grid-template-rows:minmax(0,1fr) auto;gap:8px;width:100%;height:100%;min-height:0;overflow:hidden}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .battleGrid{display:grid;grid-template-columns:minmax(0,1fr) 30px minmax(0,1fr);gap:8px;align-items:center;align-content:center;justify-items:center;width:100%;height:100%;min-height:0}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter{text-align:center;min-width:0;width:100%;overflow:visible}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter h2{margin:8px 0 5px;color:#007BFF;font-size:clamp(20px,5.2vw,29px);line-height:1.04;overflow-wrap:anywhere;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .meta{display:grid;gap:3px;justify-content:center;color:#e0f2fe;font-size:11px;line-height:1.2;min-height:28px;overflow:hidden}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .statusRow{display:flex;justify-content:center;gap:4px;min-height:17px;margin-top:4px;overflow:hidden}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .statusChip{padding:2px 6px;border-radius:999px;background:rgba(167,139,250,.18);border:1px solid rgba(167,139,250,.42);color:#DDD6FE;font-size:9px;font-weight:900;text-transform:uppercase;white-space:nowrap}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter.dd-attacking .avatar{animation:ddSpriteAttack .22s ease-out}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter.dd-hit .ring{animation:ddSpriteHit .28s ease-out}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .vs{align-self:center;text-align:center;color:#FFD700;font-weight:1000}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .ring{width:min(25vw,116px);height:min(25vw,116px);border-radius:999px;margin:0 auto;display:grid;place-items:center;background:conic-gradient(from -90deg,var(--hp-color) 0 calc(var(--hp-pct)*1%),rgba(71,85,105,.48) calc(var(--hp-pct)*1%) 100%);border:0;position:relative;transform:none!important;box-sizing:border-box;transition:background .18s ease}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .avatar{position:relative;width:calc(100% - 8px);height:calc(100% - 8px);border-radius:999px;display:grid;place-items:center;background:radial-gradient(circle at 50% 42%,#103258 0%,#0a2039 52%,#07111f 100%);font-size:clamp(28px,8vw,40px);line-height:1}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .avatar img{width:88%;height:88%;object-fit:contain;border-radius:999px}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .avatar b{font-size:10px;color:#BAE6FD;margin-top:-12px}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .battleMeters{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;min-width:0}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .signalBox,#ddApp .battle-card[data-owner="dd-battle-screen"] .downloadGauge{min-width:0;margin:0;padding:7px 9px;border:1px solid rgba(96,165,250,.25);border-radius:14px;background:rgba(15,23,42,.55)}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .signalBox>div,#ddApp .battle-card[data-owner="dd-battle-screen"] .downloadGauge>div{display:flex;align-items:center;justify-content:space-between;gap:6px;min-width:0;font-size:11px;line-height:1.15}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .signalBox b,#ddApp .battle-card[data-owner="dd-battle-screen"] .downloadGauge b{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .signalBox span,#ddApp .battle-card[data-owner="dd-battle-screen"] .downloadGauge span,#ddApp .battle-card[data-owner="dd-battle-screen"] .downloadGauge b{color:#FFD700}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .signalBox em,#ddApp .battle-card[data-owner="dd-battle-screen"] .downloadGauge em{display:block;margin-top:5px;height:7px;border-radius:999px;background:#020617;overflow:hidden}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .signalBox i{display:block;height:100%;background:linear-gradient(90deg,#38BDF8,#A78BFA,#FB7185)}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .downloadGauge i{display:block;height:100%;background:linear-gradient(90deg,#FFD700,#A3E635,#22C55E)}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .battleLog{position:absolute;left:12px;right:12px;top:var(--dd-toast-top,8px);z-index:8;height:30px;max-height:30px;overflow:hidden;margin:0;padding:6px 10px;border:1px solid rgba(96,165,250,.28);border-radius:14px;background:rgba(2,6,23,.88);opacity:1;transform:none;pointer-events:none}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .battleLog b{display:none}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .battleLog ul{list-style:none;padding:0;margin:0;color:#BAE6FD;font-size:12px;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .battleLog li{display:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .battleLog li:last-child{display:block}',
      '@media(max-width:430px){#ddApp .battle-card[data-owner="dd-battle-screen"] .ring{width:min(22vw,106px);height:min(22vw,106px)}#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter h2{font-size:clamp(19px,5vw,25px)}}',
      '@media(max-width:350px){#ddApp .battle-card[data-owner="dd-battle-screen"] .battleMeters{grid-template-columns:minmax(0,1fr)}#ddApp .battle-card[data-owner="dd-battle-screen"] .signalBox,#ddApp .battle-card[data-owner="dd-battle-screen"] .downloadGauge{padding:6px 8px}}',
      '@media(max-height:720px){#ddApp .battle-card[data-owner="dd-battle-screen"]{gap:6px}#ddApp .battle-card[data-owner="dd-battle-screen"] .battleMeters{gap:6px}#ddApp .battle-card[data-owner="dd-battle-screen"] .signalBox,#ddApp .battle-card[data-owner="dd-battle-screen"] .downloadGauge{padding:6px 8px}}',
      '@keyframes ddSpriteAttack{50%{transform:scale(1.09);filter:brightness(1.35)}}',
      '@keyframes ddSpriteHit{35%{filter:brightness(1.8) saturate(1.5);transform:scale(.94)}70%{filter:brightness(.75)}}'
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
    const healthPct=pct(s.hp,s.maxHp);
    const asset=safeSpriteAsset(s.spriteAsset||s.asset);
    const visual=asset
      ?`<img src="${esc(asset)}" alt="" aria-hidden="true">`
      :'';
    return `<div class="ring hp" style="--hp-pct:${healthPct};--hp-color:${hpColor(s.hp,s.maxHp)}" data-hp-percent="${healthPct}" aria-label="HP ${esc(s.hp)} of ${esc(s.maxHp)}">
      <div class="avatar">
        ${visual}
        <span>${esc(s.icon||'◇')}</span>
        <b>${esc(s.hp)}/${esc(s.maxHp)}</b>
      </div>
    </div>`;
  }

  function renderFighter(sprite,side){
    const s=normalizeSprite(sprite);
    const statuses=Array.isArray(s.statusEffects)?s.statusEffects:[];
    return `<article class="fighter ${esc(side||'')}">
      ${renderHpRing(s)}
      <h2>${esc(s.name||'Unknown')}</h2>
      ${renderMetaLine(s)}
      <div class="statusRow">${statuses.slice(0,2).map(status=>`<span class="statusChip">${esc(status.label||status.id)} ${esc(status.duration||'')}</span>`).join('')}</div>
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
    phase:'5.1-canonical-hp-ring',
    mode:'screen-renderer',
    ready:true,
    installStyle,
    normalizeContext,
    renderBattleScreen,
    renderFighter,
    renderHpRing,
    safeSpriteAsset,
    hpColor,
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
  const VERSION='0.3.0';
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
      '#ddApp #controls.battleControlsHost .move .moveMeta{color:#A78BFA!important;text-transform:uppercase!important;letter-spacing:.04em!important}',
      '@media(max-height:760px){#ddApp #controls.battleControlsHost{padding:7px!important;gap:6px!important}#ddApp #controls.battleControlsHost>.battleMoves,#ddApp #controls.battleControlsHost>.battleActions{gap:6px!important}#ddApp #controls.battleControlsHost button{min-height:35px!important;padding:7px 8px!important;font-size:13px!important}}'
    ].join('');
    document.head.appendChild(style);
  }

  function normalizeMoves(context){
    const lead=context&&context.lead||{};
    const moves=Array.isArray(context&&context.moves)?context.moves:Array.isArray(lead.moves)?lead.moves:[];
    return moves.slice(0,4).map(function(move,index){
      if(typeof move==='string')return {id:slug(move),name:move,index:index};
      return {id:slug(move&&move.id||move&&move.name||('move-'+index)),name:(move&&move.name)||('Move '+(index+1)),index:index,type:move&&move.type,moveType:move&&move.moveType,power:move&&move.power,accuracy:move&&move.accuracy,configuration:move&&move.configuration,statusEffect:move&&move.statusEffect,description:move&&move.description};
    });
  }

  function renderMoveButton(move){
    const stats=(move.power||move.accuracy)?`<small>${move.power?'PWR '+esc(move.power):''}${move.power&&move.accuracy?' • ':''}${move.accuracy?'ACC '+esc(move.accuracy)+'%':''}</small>`:'';
    const status=move.statusEffect&&move.statusEffect.id
      ?String(move.statusEffect.id)
      :'';
    const meta=[move.configuration||move.moveType||move.type,status]
      .filter(Boolean)
      .join(' • ');
    return `<button class="move" data-action="move" data-move-id="${esc(move.id)}" data-move-index="${esc(move.index)}" title="${esc(move.description||'')}">${esc(move.name)}${stats}${meta?`<small class="moveMeta">${esc(meta)}</small>`:''}</button>`;
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
  const VERSION='1.1.0';
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
      '#ddApp .result-card[data-owner="dd-result-screen"] .rewardPanel{display:grid;gap:7px;width:min(100%,430px);padding:10px;border:1px solid rgba(255,215,0,.3);border-radius:14px;background:rgba(15,23,42,.72);box-sizing:border-box}',
      '#ddApp .result-card[data-owner="dd-result-screen"] .rewardRow{display:flex;justify-content:space-between;gap:12px;color:#BAE6FD;font-size:12px;font-weight:800}',
      '#ddApp .result-card[data-owner="dd-result-screen"] .rewardRow b{color:#FFD700}',
      '#ddApp .result-card[data-owner="dd-result-screen"] .xpTrack{height:7px;border-radius:999px;background:#020617;overflow:hidden}',
      '#ddApp .result-card[data-owner="dd-result-screen"] .xpTrack i{display:block;height:100%;background:linear-gradient(90deg,#38BDF8,#A78BFA,#FFD700)}',
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
    const battleVictory=result.reason==='battle-victory';
    const rewardResult=result.reward||{};
    const reward=rewardResult.reward||rewardResult;
    const progression=reward.progression||{};
    const progress=progression.after||null;
    const sprite=result.sprite||result.signal||result.downloadedSprite||null;
    const collection=Array.isArray(ctx.collection)?ctx.collection:[];
    const party=Array.isArray(ctx.party)?ctx.party:[];
    const inventory=ctx.items||{};
    const title=result.title||(success?'Download Complete':type==='failure'?'Download Failed':'Result');
    const message=result.msg||result.message||(success?'The signal was added to your collection.':'The signal could not be downloaded.');
    const icon=sprite&&sprite.icon?sprite.icon:(success?'✓':type==='failure'?'!':'◇');
    const status=battleVictory?'VICTORY':success?'SAVED':type==='failure'?'SIGNAL LOST':'COMPLETE';
    const next=battleVictory
      ?'Continue to open the Download confirmation, or return to the Scanner.'
      :success
        ?'The downloaded sprite is now available in your collection and party systems.'
        :'Return to the Scanner and search for another signal.';
    const rewardHtml=battleVictory&&rewardResult.ok
      ?`<div class="rewardPanel">
        <div class="rewardRow"><span>Battle XP</span><b>+${esc(reward.xp||0)}</b></div>
        <div class="rewardRow"><span>ByteCoins</span><b>+${esc(reward.byteCoins||0)}</b></div>
        ${progress?`<div class="rewardRow"><span>${esc(progress.tier)} Level</span><b>${esc(progress.level)}</b></div>
        <div class="xpTrack" aria-label="Level progress ${esc(progress.progressPercent)} percent"><i style="width:${esc(progress.progressPercent)}%"></i></div>`:''}
        ${progression.leveledUp?`<div class="rewardRow"><span>Level Up</span><b>+${esc(progression.levelsGained)}</b></div>`:''}
        ${progression.tierUpgraded?`<div class="rewardRow"><span>Version Upgrade</span><b>${esc(progress.tier)}</b></div>`:''}
      </div>`
      :'';

    return `<section class="card result-card ${esc(type)}" data-owner="dd-result-screen"><div class="resultTop"><span>${battleVictory?'Battle Result':'Scanner Result'}</span><b>${esc(status)}</b></div><div class="resultCore"><div class="resultIcon" aria-hidden="true">${esc(icon)}</div><h1>${esc(title)}</h1><p class="resultMessage">${esc(message)}</p>${rewardHtml}${sprite?`<p class="resultNext">${esc(sprite.name||'DataByte Sprite')} • #${esc(sprite.dex||'?')} • ${esc(sprite.rarity||'Common')}</p>`:''}</div><div><div class="resultSummary"><div class="resultStat">Collection<b>${esc(collection.length)}</b></div><div class="resultStat">Party Slots<b>${esc(party.length)}/5</b></div><div class="resultStat">ByteCoins<b>${esc(inventory.byteCoins||0)}</b></div></div><p class="resultNext">${esc(next)}</p></div></section>`;
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

  const VERSION = '1.1.0';
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
        ? '<button id="continueBattle" class="gold">' + (ctx.result.reason === 'battle-victory' ? 'Continue to Download' : 'Continue Battle') + '</button><button id="back">Return to Scanner</button>'
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

/* ---- assets/js/databyte-discovery-product-app-v4-shell.js ---- */
// assets/js/databyte-discovery-product-app-v4-shell.js
// Phase 6.0.4 application shell for Data Discovery.
// The shell owns boot, route state, shared context construction, runtime coordination,
// screen registry dispatch, and routing between dedicated runtime owners.
// Battle Core exclusively owns battle transactions, state application, faint handling,
// victory/defeat decisions, and battle lifecycle.
// Presentation runtimes exclusively own UI rendering and user interaction.
(function(){
  'use strict';

  if(!location.pathname.includes('databyte-discovery'))return;

  const VERSION='4.10.4';
  const PRODUCT_PHASE='6.0.4';
  const OWNER='databyte-discovery-product-app-v4-shell';
  const STYLE_ID='ddV4ShellStyle';
  const K={
    profile:'vl_databyte_admin_profile_v1',
    collection:'vl_databyte_discovery_collection_v2',
    seen:'vl_databyte_seen_v1',
    party:'vl_databyte_party_v1',
    items:'vl_databyte_items_v1'
  };

  const $=id=>document.getElementById(id);
  const esc=value=>String(value??'').replace(/[&<>"]/g,ch=>({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;'
  }[ch]));
  const read=(key,fallback)=>{
    try{return JSON.parse(localStorage.getItem(key))||fallback}
    catch(e){return fallback}
  };
  const write=(key,value)=>localStorage.setItem(key,JSON.stringify(value));

  const rt={
    roster:()=>window.DD_CANON_ROSTER||[],
    encounter:()=>window.DD_ENCOUNTER_RUNTIME,
    capture:()=>window.DD_CAPTURE_RUNTIME,
    player:()=>window.DD_PLAYER_RUNTIME,
    battle:()=>window.DD_BATTLE_RUNTIME,
    battleBus:()=>window.DD_BATTLE_RUNTIME,
    screenRegistry:()=>window.DD_SCREEN_REGISTRY,
    party:()=>window.DD_PLAYER_RUNTIME&&window.DD_PLAYER_RUNTIME.party,
    partySwitch:()=>window.DD_PLAYER_RUNTIME&&window.DD_PLAYER_RUNTIME.partySwitch,
    inventory:()=>window.DD_PLAYER_RUNTIME&&window.DD_PLAYER_RUNTIME.inventory,
    rewards:()=>window.DD_BATTLE_REWARD_RUNTIME
  };

  const ui={
    scanner:()=>window.DD_SCANNER_SCREEN,
    encounter:()=>window.DD_ENCOUNTER_SCREEN,
    battle:()=>window.DD_BATTLE_SCREEN,
    controls:()=>window.DD_BATTLE_CONTROLS,
    confirm:()=>window.DD_CONFIRM_SCREEN,
    result:()=>window.DD_RESULT_SCREEN,
    party:()=>window.DD_PARTY_SCREEN,
    items:()=>window.DD_ITEMS_SCREEN,
    dex:()=>window.DD_DEX_SCREEN,
    admin:()=>window.DD_ADMIN_SCREEN
  };

  const state={
    screen:'scanner',
    returnScreen:null,
    battleState:'idle',
    signal:null,
    result:null,
    confirm:null,
    fx:null,
    log:'Scanner ready. Enter a code or randomize a signal.',
    turnBusy:false,
    turnPhase:null,
    lastTurnError:null
  };

  function installShellStyle(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=[
      'body>*:not(#ddApp){display:none!important}',
      '#ddApp{position:fixed;inset:0;z-index:999999;background:radial-gradient(circle at 50% 30%,rgba(0,123,255,.22),transparent 38%),#07111f;color:white;display:grid;grid-template-rows:auto minmax(0,1fr) auto auto;gap:10px;padding:12px;box-sizing:border-box;font-family:Roboto,system-ui,sans-serif;overflow:hidden}',
      '#ddApp .top,#ddApp .card,#ddApp #controls,#ddApp .nav button{border:1px solid rgba(125,211,252,.22);background:rgba(7,17,31,.88);border-radius:22px}',
      '#ddApp .top{padding:12px;display:flex;justify-content:space-between;align-items:center;gap:8px;min-height:46px;box-sizing:border-box}',
      '#ddApp .top span{color:#BAE6FD;font-size:12px}',
      '#ddApp .stage{overflow:auto;min-height:0}',
      '#ddApp .stage.battleStage{display:grid;overflow:hidden}',
      '#ddApp .card{padding:16px;box-sizing:border-box}',
      '#ddApp #controls{padding:10px;display:grid;gap:8px;box-sizing:border-box;min-height:0}',
      '#ddApp #controls input{padding:14px;border-radius:16px;background:#020617;color:white;border:1px solid rgba(255,255,255,.16)}',
      '#ddApp button{border:0;border-radius:16px;padding:12px;color:white;background:#0F172A;font-weight:900}',
      '#ddApp button:disabled{opacity:.55;cursor:wait}',
      '#ddApp .gold{background:#FFD700!important;color:#111827!important}',
      '#ddApp .nav{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;min-height:38px}',
      '#ddApp .nav button{font-size:11px;padding:9px 3px}',
      '#ddApp .stats,#ddApp .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(105px,1fr));gap:8px}',
      '#ddApp .mini{background:rgba(15,23,42,.8);border:1px solid rgba(255,255,255,.1);border-radius:14px;padding:10px}',
      '#ddApp .hint,#ddApp .log{color:#BAE6FD;font-size:12px;line-height:1.35}',
      '#ddApp .coin,#ddApp .scannerOrb{width:90px;height:90px;border-radius:999px;display:grid;place-items:center;margin:auto;font-size:36px}',
      '#ddApp .coin{background:#FFD700;color:#111827}',
      '#ddApp .scannerOrb{background:rgba(0,123,255,.15);border:1px solid #38BDF8}',
      '#ddApp .good{border-color:rgba(34,197,94,.65)}',
      '#ddApp .bad{border-color:rgba(251,113,133,.65)}',
      '#ddApp.fx-fail .card,#ddApp.fx-warn .card{box-shadow:0 0 48px rgba(251,113,133,.22)}'
    ].join('');
    document.head.appendChild(style);
  }

  function emit(name,detail){
    if(rt.battleBus()&&rt.battleBus().emit)rt.battleBus().emit(name,detail);
  }

  function dispatchDiagnostic(name,detail){
    document.dispatchEvent(new CustomEvent(name,{
      detail:Object.assign({
        owner:OWNER,
        version:VERSION,
        productPhase:PRODUCT_PHASE,
        at:new Date().toISOString()
      },detail||{})
    }));
  }

  function fx(name){
    state.fx=name;
    setTimeout(()=>{
      if(state.fx===name){
        state.fx=null;
        paintFx();
      }
    },560);
  }

  function paintFx(){
    const root=$('ddApp');
    if(root)root.className=state.fx?'fx-'+state.fx:'';
  }

  function pushLog(text){
    state.log=String(text||'')
      .replace(/Capture Window/g,'Download Window')
      .replace(/Capture window/g,'Download window')
      .replace(/Capture /g,'Download ')
      .replace(/capture /g,'download ');
  }

  function fallbackItems(){
    return read(K.items,{byteCoins:8,boosts:0,repairPulses:0});
  }

  function items(){
    return rt.inventory()?rt.inventory().read():fallbackItems();
  }

  function spendItem(id,amount){
    return rt.inventory()?rt.inventory().spend(id,amount):fallbackSpend(id,amount);
  }

  function fallbackSpend(id,amount){
    const it=fallbackItems();
    amount=Number(amount||1);
    if(Number(it[id]||0)<amount)return{ok:false,items:it,spent:0};
    it[id]=Number(it[id]||0)-amount;
    write(K.items,it);
    return{ok:true,items:it,spent:amount};
  }

  function collection(){
    return rt.party()?rt.party().collection():read(K.collection,[]);
  }

  function party(){
    return rt.party()?rt.party().ids():read(K.party,[]);
  }

  function partyMembers(){
    return rt.party()&&rt.party().members
      ?rt.party().members()
      :fillParty().map(id=>collection().find(s=>s.id===id)).filter(Boolean);
  }

  function seen(){
    return read(K.seen,[]);
  }

  function profile(){
    let p=read(K.profile,null);
    if(!p){
      p={
        name:'Scanner Admin',
        rank:'Candidate',
        createdAt:new Date().toISOString()
      };
      write(K.profile,p);
    }
    return p;
  }

  function normalize(sprite){
    if(!sprite)return sprite;
    const s=Object.assign({},sprite);
    s.maxHp=Number(s.maxHp||s.hp||44);
    s.hp=Number(s.hp??s.maxHp);
    s.maxStability=Number(s.maxStability||s.stability||8);
    s.stability=Number(s.stability??s.maxStability);
    s.atk=Number(s.atk||s.attack||12);
    s.def=Number(s.def||s.defense||8);
    s.speed=Number(s.speed||8);
    const fallback={
      id:'signal-strike',
      name:'Signal Strike',
      power:24,
      accuracy:92,
      captureEffect:1,
      elements:['Signal'],
      moveType:'attack'
    };
    s.moves=Array.isArray(s.moves)&&s.moves.length?s.moves:[fallback];
    return s;
  }

  function fallbackLead(){
    const c=collection().map(normalize);
    const p=party();
    return c.find(s=>p.includes(s.id)&&Number(s.hp)>0)
      ||c.find(s=>Number(s.hp)>0)
      ||c[0]
      ||null;
  }

  function lead(){
    const partyRuntime=rt.party();
    const switchRuntime=rt.partySwitch();

    if(
      partyRuntime&&
      switchRuntime&&
      typeof partyRuntime.members==='function'&&
      typeof switchRuntime.getActive==='function'
    ){
      const members=partyRuntime.members();
      const activeIndex=Number(switchRuntime.getActive()||0);
      const activeLead=members[activeIndex];

      // During a battle the active slot remains authoritative even after it
      // faints. Returning the next usable member here would repaint only the
      // old card's HP while leaving the old name/icon visible until the user
      // completed the required switch.
      if(
        activeLead&&
        (
          state.screen==='battle'||
          Number(activeLead.hp||0)>0
        )
      ){
        return activeLead;
      }
    }

    return partyRuntime?partyRuntime.lead():fallbackLead();
  }

  function fillParty(){
    if(rt.party())return rt.party().autoFill();
    const c=collection();
    const p=party().filter(id=>c.some(s=>s.id===id));
    c.forEach(s=>{
      if(p.length<5&&!p.includes(s.id))p.push(s.id);
    });
    write(K.party,p.slice(0,5));
    return p.slice(0,5);
  }

  function mark(sprite,status){
    if(!sprite)return;
    const list=seen();
    const i=list.findIndex(x=>(typeof x==='string'?x:x.name)===sprite.name);
    const rec={
      name:sprite.name,
      dex:sprite.dex,
      type:sprite.type,
      rarity:sprite.rarity,
      status,
      seenAt:new Date().toISOString()
    };
    if(i>=0)list[i]=rec;
    else list.push(rec);
    write(K.seen,list);
  }

  function seed(){
    profile();
    if(rt.inventory())rt.inventory().ensure();
    else if(!localStorage.getItem(K.items)){
      write(K.items,{byteCoins:8,boosts:0,repairPulses:0});
    }

    if(!collection().length&&rt.roster().length){
      const base=rt.roster()[0];
      let starter=rt.encounter()&&rt.encounter().tuneSignal
        ?rt.encounter().tuneSignal(base,'STARTER-Leovolt',{starter:true})
        :base;
      starter=normalize(Object.assign({
        id:'DBS-STARTER-'+Date.now(),
        byteCoin:'BC-0001'
      },starter,{rarity:'Starter'}));
      write(K.collection,[starter]);
      if(rt.party())rt.party().save([starter.id]);
      else write(K.party,[starter.id]);
      mark(starter,'Captured');
    }

    fillParty();
  }

  function odds(sprite){
    return rt.capture()?rt.capture().odds(sprite):Number(sprite&&sprite.currentChance||30);
  }

  function drainSignal(wild,amount,reason){
    wild.stability=Math.max(0,Number(wild.stability||0)-Number(amount||1));
    return wild.stability<=0
      ?((reason||'The wild signal')+' collapsed. '+wild.name+' disappeared from scanner range.')
      :null;
  }

  function isWildDefeated(){
    return !!(state.signal&&Number(state.signal.hp||0)<=0);
  }

  function syncBattleState(){
    const core=window.DD_BATTLE_CORE_RUNTIME;
    if(core&&core.snapshot)state.battleState=core.snapshot();
    return state.battleState;
  }

  function contextBase(){
    return{
      state,
      version:VERSION,
        productPhase:PRODUCT_PHASE,
      profile:profile(),
      items:items(),
      collection:collection(),
      party:party(),
      seen:seen(),
      roster:rt.roster(),
      log:state.log
    };
  }

  function battleContext(baseContext){
    const base=baseContext||contextBase();
    const wild=normalize(state.signal);
    const activeLead=normalize(lead());
    return Object.assign({},base,{
      lead:activeLead,
      wild,
      odds:wild?odds(wild):0,
      signal:wild?Number(wild.stability||0):0,
      maxSignal:wild?Number(wild.maxStability||1):1,
      isWildDefeated:isWildDefeated(),
      latestMessage:state.log,
      turnBusy:state.turnBusy,
      turnPhase:state.turnPhase,
      battleState:{
        value:syncBattleState(),
        wildDefeated:isWildDefeated(),
        leadDefeated:activeLead?Number(activeLead.hp||0)<=0:false
      },
      moves:activeLead&&activeLead.moves||[]
    });
  }

  function screenContext(){
    const base=contextBase();
    const context=Object.assign({},base,{
      signal:normalize(state.signal),
      confirm:state.confirm,
      result:state.result
    });
    if(state.screen==='battle'||state.screen==='confirm'||state.screen==='result'){
      context.battleContext=battleContext(base);
    }
    return context;
  }

  function canonicalBattleStartContext(wild,activeLead){
    const encounterId='ENC-'+Date.now()+'-'+String(wild&&wild.id||'signal');
    return{
      encounterId,
      battleId:encounterId,
      wild,
      enemy:wild,
      lead:activeLead,
      playerSprite:activeLead,
      source:OWNER,
      shellversion:VERSION,
        productPhase:PRODUCT_PHASE,
      startedAt:new Date().toISOString()
    };
  }

  function discover(code){
    code=(code||($('code')&&$('code').value)||'').trim();
    if(!code){
      pushLog('Enter a discovery code first.');
      fx('warn');
      render();
      return;
    }

    const out=rt.encounter()?rt.encounter().create(code):null;
    if(!out||!out.signal){
      pushLog('No signal found. Encounter Runtime unavailable.');
      fx('warn');
      render();
      return;
    }

    state.signal=normalize(Object.assign({id:'ENC-'+Date.now()},out.signal));
    state.returnScreen=null;
    state.battleState='idle';
    state.turnBusy=false;
    state.turnPhase=null;
    state.lastTurnError=null;
    if(window.DD_BATTLE_CORE_RUNTIME)window.DD_BATTLE_CORE_RUNTIME.reset();
    state.screen='encounter';
    state.result=null;
    state.confirm=null;
    mark(state.signal,'Seen');
    pushLog('Signal locked from '+(state.signal.encounterPoolLabel||'scanner pool')+'.');
    fx('discover');
    render();
  }

  function randomCode(){
    const code=rt.encounter()
      ?rt.encounter().randomCode()
      :'DBS-'+Math.random().toString(36).slice(2,7).toUpperCase();
    if($('code'))$('code').value=code;
    discover(code);
  }

  function startBattle(){
    if(!state.signal)return;

    const wild=normalize(state.signal);
    const activeLead=normalize(lead());
    const context=canonicalBattleStartContext(wild,activeLead);
    const leadIndex=partyMembers().findIndex(member =>
      member&&activeLead&&member.id===activeLead.id
    );

    state.signal=wild;
    state.returnScreen=null;
    state.result=null;
    state.turnBusy=false;
    state.turnPhase=null;
    state.lastTurnError=null;

    if(leadIndex>=0&&rt.partySwitch()){
      rt.partySwitch().setActive(leadIndex);
    }

    if(!window.DD_BATTLE_CORE_RUNTIME){
      pushLog('Battle Core Runtime unavailable. Battle cannot start.');
      fx('warn');
      render();
      return;
    }

    window.DD_BATTLE_CORE_RUNTIME.start({
      encounterId:context.encounterId,
      lead:activeLead,
      wild
    });
    syncBattleState();
    state.screen='battle';
    pushLog('Battle started.');
    emit('turn',{
      label:'Battle Start',
      encounterId:context.encounterId,
      wild,
      lead:activeLead,
      source:OWNER
    });
    fx('battle');
    render();
  }

  function animateTurnResult(result){
    if(!result||!Array.isArray(result.actions))return;
    result.actions.forEach((action,index)=>{
      const actorSelector=action.mode==='player'?'.fighter.lead':'.fighter.wild';
      const targetSelector=action.mode==='player'?'.fighter.wild':'.fighter.lead';
      const actor=document.querySelector(actorSelector);
      const target=document.querySelector(targetSelector);
      setTimeout(()=>{
        if(actor)actor.classList.add('dd-attacking');
        if(target&&action.hit)target.classList.add('dd-hit');
        setTimeout(()=>{
          if(actor)actor.classList.remove('dd-attacking');
          if(target)target.classList.remove('dd-hit');
        },320);
      },index*110);
    });
  }

  function fight(moveId){
    if(state.turnBusy)return;

    const core=window.DD_BATTLE_CORE_RUNTIME;
    const wild=normalize(state.signal);
    const activeLead=normalize(lead());
    if(!core||typeof core.runTurn!=='function'||!wild||!activeLead){
      pushLog('Battle Core Runtime is unavailable.');
      fx('warn');
      render();
      return;
    }

    const move=
      (activeLead.moves||[]).find(item=>item.id===moveId)||
      (activeLead.moves||[])[0];
    state.turnBusy=true;
    state.turnPhase='core-turn';
    applyControlHost();
    applyTurnLock();

    try{
      const result=core.runTurn({
        encounterId:wild.id,
        lead:activeLead,
        wild,
        move
      });
      if(!result||result.ok===false){
        throw new Error(result&&result.reason||'battle-core-turn-failed');
      }

      state.signal=wild;
      pushLog(result.message||'Battle turn completed.');
      animateTurnResult(result);

      if(result.terminal==='wild-defeated'){
        const rewards=window.DD_BATTLE_REWARD_RUNTIME;
        const coreState=core.snapshot();
        const rewardResult=rewards&&typeof rewards.award==='function'
          ?rewards.award({
            encounterId:coreState.battleId,
            defeated:wild,
            wild,
            recipient:activeLead,
            lead:activeLead
          })
          :null;
        pushLog(
          result.message+' '+wild.name+
          ' is defeated. '+
          (rewardResult&&rewardResult.ok
            ?'Rewards applied. '
            :'')+
          'Choose Download or Return.'
        );
        state.result={
          type:'success',
          reason:'battle-victory',
          title:'Battle Victory',
          msg:wild.name+' was defeated. Progression and rewards are secured.',
          sprite:wild,
          reward:rewardResult,
          canContinue:true
        };
        state.returnScreen='battle';
        state.screen='result';
        fx('success');
      }else if(result.terminal==='lead-defeated'){
        const replacements=partyMembers().filter(member =>
          member&&member.id!==activeLead.id&&Number(member.hp||0)>0
        );
        if(replacements.length){
          pushLog(activeLead.name+' fainted. Choose an available party sprite.');
          setTimeout(()=>document.dispatchEvent(
            new CustomEvent('dd:open-party-switch')
          ),0);
        }else{
          state.result={
            type:'failure',
            reason:'party-defeated',
            title:'Party Defeated',
            msg:'No usable party sprites remain. Return to the scanner to restore the team.',
            sprite:wild,
            canContinue:false
          };
          state.screen='result';
          pushLog(state.result.msg);
          fx('fail');
        }
      }
    }catch(error){
      state.lastTurnError={
        phase:'core-turn',
        message:error&&error.message?error.message:String(error),
        at:new Date().toISOString()
      };
      pushLog('Battle turn stopped safely. Try the action again.');
      fx('warn');
    }finally{
      state.turnBusy=false;
      state.turnPhase=null;
      if(!patchBattleHud())render();
    }
  }

  function captureAsk(){
    if(!state.signal||state.turnBusy)return;
    state.confirm={
      odds:odds(state.signal),
      byteCoins:items().byteCoins
    };
    state.screen='confirm';
    state.returnScreen=null;
    fx('coin');
    render();
  }

  function captureResolve(){
    const it=items();
    const wild=state.signal;
    if(!wild)return;

    if(!rt.capture()||!rt.capture().canAttempt(it)){
      state.result={
        type:'failure',
        title:'No ByteCoins',
        msg:'A ByteCoin is required before another download can be attempted.',
        sprite:wild,
        canContinue:true
      };
      state.confirm=null;
      state.screen='result';
      fx('warn');
      render();
      return;
    }

    const out=rt.capture().attempt(wild,it,wild.id);
    spendItem('byteCoins',1);

    if(out.ok){
      wild.byteCoin='BC-'+String(Date.now()).slice(-6);
      const c=collection();
      c.push(wild);
      write(K.collection,c);
      if(rt.party())rt.party().add(wild);
      else fillParty();
      mark(wild,'Captured');
      return success(
        'Download Complete',
        wild.name+' downloaded into '+wild.byteCoin+'.',
        wild
      );
    }

    rt.capture().onFailedCapture(wild);
    const collapse=drainSignal(
      wild,
      1,
      'Download failed and the wild signal'
    );

    if(collapse){
      return fail('Signal Disappeared',collapse,wild);
    }

    state.signal=wild;
    state.confirm=null;
    state.result={
      type:'failure',
      title:'Download Failed',
      msg:
        'Roll '+out.roll+
        ' vs '+out.odds+
        '. Signal weakened to '+
        wild.stability+'/'+wild.maxStability+
        '. Download now '+odds(wild)+'%.',
      sprite:wild,
      canContinue:true
    };
    state.screen='result';
    pushLog(state.result.msg);
    fx('fail');
    render();
  }

  function success(title,msg,sprite){
    state.result={
      type:'success',
      title,
      msg,
      sprite,
      canContinue:false
    };
    state.signal=null;
    state.confirm=null;
    state.returnScreen=null;
    state.battleState='idle';
    state.turnBusy=false;
    state.turnPhase=null;
    if(window.DD_BATTLE_CORE_RUNTIME)window.DD_BATTLE_CORE_RUNTIME.reset();
    state.screen='result';
    emit('success');
    fx('success');
    render();
  }

  function fail(title,msg,sprite,shouldRender){
    state.result={
      type:'failure',
      title,
      msg,
      sprite,
      canContinue:false
    };
    state.signal=null;
    state.confirm=null;
    state.returnScreen=null;
    state.battleState='idle';
    state.turnBusy=false;
    state.turnPhase=null;
    if(window.DD_BATTLE_CORE_RUNTIME)window.DD_BATTLE_CORE_RUNTIME.reset();
    state.screen='result';
    fx('fail');
    if(shouldRender!==false)render();
  }

  function continueBattle(){
    if(!state.signal)return back();
    const continueToDownload=!!(
      state.result&&state.result.reason==='battle-victory'
    );
    state.confirm=null;
    state.result=null;
    state.returnScreen=null;
    if(continueToDownload){
      pushLog('Battle complete. Confirm the Download attempt.');
      captureAsk();
      return;
    }
    state.screen='battle';
    pushLog('Battle resumed.');
    fx('battle');
    render();
  }

  function back(){
    const restoreAfterDefeat=!!(
      state.result&&state.result.reason==='party-defeated'
    );
    let recovery=null;

    if(
      state.signal&&
      ['encounter','battle','confirm'].includes(state.screen)&&
      !isWildDefeated()
    ){
      const collapse=drainSignal(
        state.signal,
        1,
        'You returned and the wild signal'
      );
      if(collapse){
        return fail('Signal Disappeared',collapse,state.signal);
      }
    }

    state.screen='scanner';
    state.returnScreen=null;
    state.battleState='idle';
    state.turnBusy=false;
    state.turnPhase=null;
    if(window.DD_BATTLE_CORE_RUNTIME)window.DD_BATTLE_CORE_RUNTIME.reset();
    if(
      restoreAfterDefeat&&
      rt.player()&&
      rt.player().recovery&&
      typeof rt.player().recovery.restoreParty==='function'
    ){
      recovery=rt.player().recovery.restoreParty();
    }
    state.signal=null;
    state.confirm=null;
    state.result=null;
    pushLog(
      recovery
        ?'Scanner ready. '+Number(recovery.restored||0)+' party sprite(s) restored to full HP.'
        :'Scanner ready.'
    );
    fx('return');
    render();
  }

  function panel(name){
    state.returnScreen=
      state.screen==='battle'&&state.signal
        ?'battle'
        :'scanner';
    state.screen=name;
    render();
  }

  function returnFromPanel(){
    const target=
      state.returnScreen==='battle'&&state.signal
        ?'battle'
        :'scanner';
    state.returnScreen=null;

    if(target==='battle'){
      state.screen='battle';
      pushLog('Battle resumed.');
      fx('battle');
      render();
      return;
    }

    back();
  }

  const fallback={
    scanner:ctx=>
      `<section class="card scanner-card">
        <div class="scannerOrb">📡</div>
        <h1>Signal Ready</h1>
        <p>${esc(ctx.log)}</p>
      </section>`,
    encounter:ctx=>{
      const s=normalize(state.signal);
      if(!s)return fallback.scanner(ctx);
      return `<section class="card encounter-card">
        <h2>${esc(s.name||'Unknown Signal')}</h2>
        <div class="stats">
          <b>Download ${odds(s)}%</b>
          <b>HP ${s.hp}/${s.maxHp}</b>
          <b>Signal ${s.stability}/${s.maxStability}</b>
        </div>
        <p>${esc(s.lore||'Unknown signal.')}</p>
        <p class="log">${esc(state.log)}</p>
      </section>`;
    },
    battle:ctx=>
      `<section class="card bad">
        <h2>Battle Screen Missing</h2>
        <p>DD_BATTLE_SCREEN is not available.</p>
      </section>`,
    confirm:ctx=>
      `<section class="card bad">
        <h2>Download Confirm Screen Missing</h2>
        <p>DD_CONFIRM_SCREEN is not available.</p>
      </section>`,
    result:ctx=>
      `<section class="card bad">
        <h2>Download Result Screen Missing</h2>
        <p>DD_RESULT_SCREEN is not available.</p>
      </section>`,
    party:ctx=>{
      const members=rt.party()
        ?rt.party().members()
        :fillParty()
          .map(id=>collection().find(s=>s.id===id))
          .filter(Boolean);
      return `<section class="card">
        <h2>Party</h2>
        <p class="hint">
          Runtime: ${rt.player()?'DD_PLAYER_RUNTIME':'fallback local storage'}
        </p>
        <div class="grid">
          ${members.map(x=>
            `<div class="mini">
              ${esc(x.icon||'◇')} ${esc(x.name)}
              <br>HP ${esc(x.hp)}/${esc(x.maxHp)}
            </div>`
          ).join('')||'<p>No downloaded sprites yet.</p>'}
        </div>
      </section>`;
    },
    items:ctx=>{
      const it=items();
      return `<section class="card">
        <h2>Inventory</h2>
        <p class="hint">
          Runtime: ${rt.player()?'DD_PLAYER_RUNTIME':'fallback local storage'}
        </p>
        <div class="grid">
          <div class="mini">ByteCoins<br><b>${esc(it.byteCoins||0)}</b></div>
          <div class="mini">Items<br><b>Coming Soon</b></div>
        </div>
      </section>`;
    },
    dex:ctx=>{
      const capd=new Set(collection().map(x=>x.name));
      const sn=new Set(
        seen().map(x=>typeof x==='string'?x:x.name)
      );
      capd.forEach(x=>sn.add(x));
      return `<section class="card">
        <h2>DataByteDex</h2>
        <p>${sn.size}/${rt.roster().length} seen • ${capd.size} downloaded</p>
        <div class="grid">
          ${rt.roster().map(x=>
            `<div class="mini">
              ${esc(x.icon||'◇')} #${esc(x.dex)} ${esc(x.name)}
              <br>${capd.has(x.name)
                ?'Downloaded'
                :sn.has(x.name)
                  ?'Seen'
                  :'Unknown'}
            </div>`
          ).join('')}
        </div>
      </section>`;
    },
    admin:ctx=>{
      const rewardRuntime=rt.rewards();
      const rewardProfile=rewardRuntime&&rewardRuntime.read
        ?rewardRuntime.read()
        :{victories:0,totalXp:0,battleHistory:[]};
      const history=rewardRuntime&&rewardRuntime.getHistory
        ?rewardRuntime.getHistory(8)
        :[];
      return `<section class="card">
        <h2>${esc(profile().name)}</h2>
        <div class="grid">
          <div class="mini">Victories<br><b>${esc(rewardProfile.victories||0)}</b></div>
          <div class="mini">Total XP<br><b>${esc(rewardProfile.totalXp||0)}</b></div>
        </div>
        <h3>Battle History</h3>
        <div class="grid">
          ${history.map(entry=>`<div class="mini">
            ${esc(entry.result||'battle').toUpperCase()} • ${esc(entry.opponent&&entry.opponent.name||'Unknown')}
            <br>+${esc(entry.xp||0)} XP • Lv ${esc(entry.level||1)} ${esc(entry.tier||'Kilobyte')}
          </div>`).join('')||'<p>No completed battles yet.</p>'}
        </div>
        <p class="hint">Progress is saved automatically on this device.</p>
      </section>`;
    }
  };

  const screenRegistry={
    scanner:{
      module:ui.scanner,
      method:'renderScannerScreen',
      fallback:fallback.scanner
    },
    encounter:{
      module:ui.encounter,
      method:'renderEncounterScreen',
      fallback:fallback.encounter
    },
    battle:{
      module:ui.battle,
      method:'renderBattleScreen',
      fallback:ctx=>
        ui.battle()&&ui.battle().renderBattleScreen
          ?ui.battle().renderBattleScreen(ctx.battleContext)
          :fallback.battle(ctx)
    },
    confirm:{
      module:ui.confirm,
      method:'renderConfirmScreen',
      fallback:fallback.confirm
    },
    result:{
      module:ui.result,
      method:'renderResultScreen',
      fallback:fallback.result
    },
    party:{
      module:ui.party,
      method:'renderPartyScreen',
      fallback:fallback.party
    },
    items:{
      module:ui.items,
      method:'renderItemsScreen',
      fallback:fallback.items
    },
    dex:{
      module:ui.dex,
      method:'renderDexScreen',
      fallback:fallback.dex
    },
    admin:{
      module:ui.admin,
      method:'renderAdminScreen',
      fallback:fallback.admin
    }
  };

  function panelReturnControls(ctx){
    const battleReturn=
      ctx.state&&ctx.state.returnScreen==='battle';
    return `<button id="panelBack" class="gold">
      ${battleReturn?'Return to Battle':'Return to Scanner'}
    </button>`;
  }

  const controlsRegistry={
    scanner:ctx=>
      `<label>Discovery Code</label>
      <input id="code" placeholder="Enter code...">
      <button id="discover" class="gold">Discover</button>
      <button id="random">Random Code</button>`,
    encounter:ctx=>
      `<button id="battleStart" class="gold">Start Battle</button>
      <button id="back">Return</button>`,
    battle:ctx=>
      ui.controls()&&ui.controls().renderBattleControls
        ?ui.controls().renderBattleControls(ctx.battleContext)
        :`<button id="back" class="gold">Return</button>`,
    confirm:ctx=>
      `<button id="confirm" class="gold">Confirm Download</button>
      <button id="battleStart">Back to Battle</button>`,
    result:ctx=>
      ctx.result&&ctx.result.canContinue
        ?`<button id="continueBattle" class="gold">${ctx.result.reason==='battle-victory'?'Continue to Download':'Continue Battle'}</button>
          <button id="back">Return to Scanner</button>`
        :`<button id="back" class="gold">Return to Scanner</button>`,
    party:panelReturnControls,
    items:panelReturnControls,
    dex:panelReturnControls,
    admin:panelReturnControls
  };

  function callScreen(entry,ctx){
    const mod=entry.module&&entry.module();
    if(mod&&entry.method&&typeof mod[entry.method]==='function'){
      return mod[entry.method](ctx);
    }
    return entry.fallback(ctx);
  }

  function screenHtml(ctx){
    ctx=ctx||screenContext();
    const registry=rt.screenRegistry();
    if(registry&&registry.has&&registry.has(state.screen)){
      return registry.renderScreen(state.screen,ctx);
    }
    return callScreen(
      screenRegistry[state.screen]||screenRegistry.scanner,
      ctx
    );
  }

  function controlsHtml(ctx){
    ctx=ctx||screenContext();
    const registry=rt.screenRegistry();
    if(registry&&registry.renderControls){
      const rendered=registry.renderControls(state.screen,ctx);
      if(rendered!=null)return rendered;
    }
    const fn=controlsRegistry[state.screen]||controlsRegistry.scanner;
    return fn(ctx);
  }

  function applyControlHost(){
    const host=$('controls');
    const stage=$('stage');
    if(stage){
      stage.classList.toggle('battleStage',state.screen==='battle');
      stage.dataset.screen=state.screen;
    }
    if(!host)return;
    host.className=
      state.screen==='battle'
        ?'controls battleControlsHost'
        :'controls';
    host.setAttribute(
      'aria-busy',
      state.turnBusy?'true':'false'
    );
  }

  function applyTurnLock(){
    document
      .querySelectorAll('#controls [data-action="move"]')
      .forEach(button=>{
        button.disabled=!!state.turnBusy;
      });
  }

  function forceUnlockControls(){
    state.turnBusy=false;
    state.turnPhase=null;

    const host=$('controls');
    if(host){
      host.setAttribute('aria-busy','false');
    }

    document
      .querySelectorAll('#controls button')
      .forEach(button=>{
        button.disabled=false;
      });

    try{
      bind();
    }catch(error){
      dispatchDiagnostic('dd:battle-control-rebind-error',{
        message:error&&error.message
          ?error.message
          :String(error)
      });
    }
  }

  function runAction(button){
    const action=button.dataset.action;
    if(state.turnBusy&&action==='move')return;

    if(action==='move'){
      const moveId=button.dataset.moveId||button.dataset.moveIndex;
      setTimeout(()=>fight(moveId),80);
      return;
    }
    if(action==='download')return captureAsk();
    if(action==='items')return panel('items');
    if(action==='switch'){
      document.dispatchEvent(new CustomEvent('dd:open-party-switch'));
      return;
    }
    if(action==='return')return back();
  }

  function bind(){
    if($('discover'))$('discover').onclick=()=>discover();
    if($('random'))$('random').onclick=randomCode;
    if($('battleStart'))$('battleStart').onclick=startBattle;
    if($('confirm'))$('confirm').onclick=captureResolve;
    if($('continueBattle'))$('continueBattle').onclick=continueBattle;
    if($('panelBack'))$('panelBack').onclick=returnFromPanel;
    if($('back'))$('back').onclick=back;

    document.querySelectorAll('[data-action]').forEach(btn=>{
      btn.onclick=()=>runAction(btn);
    });
    document.querySelectorAll('[data-panel]').forEach(btn=>{
      btn.onclick=()=>panel(btn.dataset.panel);
    });

    applyTurnLock();
  }

  function ensureRoot(){
    if($('ddApp'))return;
    document.body.innerHTML=
      '<div id="ddApp">'+
        '<header class="top">'+
          '<b>Data Discovery</b>'+ 
          '<span>Phase 6.0.4</span>'+
        '</header>'+ 
        '<main id="stage" class="stage"></main>'+ 
        '<section id="controls" class="controls"></section>'+ 
        '<nav class="nav">'+ 
          '<button data-panel="scanner">Scan</button>'+ 
          '<button data-panel="dex">Dex</button>'+ 
          '<button data-panel="party">Party</button>'+ 
          '<button data-panel="items">Items</button>'+ 
          '<button data-panel="admin">Admin</button>'+ 
        '</nav>'+ 
      '</div>';
  }

  function render(){
    installShellStyle();
    ensureRoot();
    const ctx=screenContext();
    const nextScreen=screenHtml(ctx);
    const nextControls=controlsHtml(ctx);
    $('stage').innerHTML=nextScreen;
    $('controls').innerHTML=nextControls;
    applyControlHost();
    bind();
    paintFx();
  }

  function patchBattleHud(){
    if(state.screen!=='battle'||!state.signal)return false;

    const wild=normalize(state.signal);
    const activeLead=normalize(lead());
    if(!wild||!activeLead)return false;

    // Terminal turns change the available controls and must use the canonical
    // screen renderer. Ordinary attacks only need their existing HUD patched.
    if(Number(wild.hp||0)<=0||Number(activeLead.hp||0)<=0)return false;

    const updateFighter=(selector,sprite)=>{
      const fighter=document.querySelector(selector);
      if(!fighter)return false;

      const hpText=fighter.querySelector('.avatar b');
      if(hpText){
        hpText.textContent=Number(sprite.hp||0)+'/'+Number(sprite.maxHp||0);
      }

      const hpRing=fighter.querySelector('.ring.hp');
      if(hpRing){
        const maxHp=Number(sprite.maxHp||0);
        const healthPct=maxHp>0
          ?Math.max(0,Math.min(100,Math.round(Number(sprite.hp||0)/maxHp*100)))
          :0;
        const healthColor=healthPct>50
          ?'#22C55E'
          :(healthPct>25?'#FFD700':'#FB7185');
        hpRing.style.setProperty('--hp-pct',String(healthPct));
        hpRing.style.setProperty('--hp-color',healthColor);
        hpRing.dataset.hpPercent=String(healthPct);
        hpRing.setAttribute(
          'aria-label',
          'HP '+Number(sprite.hp||0)+' of '+maxHp
        );
      }

      const statusRow=fighter.querySelector('.statusRow');
      if(statusRow){
        const statuses=Array.isArray(sprite.statusEffects)
          ?sprite.statusEffects
          :[];
        statusRow.innerHTML=statuses.slice(0,2).map(status=>
          `<span class="statusChip">${esc(status.label||status.id)} ${esc(status.duration||'')}</span>`
        ).join('');
      }
      return true;
    };

    if(
      !updateFighter('.fighter.lead',activeLead)||
      !updateFighter('.fighter.wild',wild)
    )return false;

    const signal=Number(wild.stability||0);
    const maxSignal=Number(wild.maxStability||1);
    const signalText=document.querySelector('.signalBox span');
    if(signalText)signalText.textContent=signal+'/'+maxSignal;
    const signalBar=document.querySelector('.signalBox i');
    if(signalBar){
      signalBar.style.width=Math.max(
        0,
        Math.min(100,signal/maxSignal*100)
      )+'%';
    }

    const downloadOdds=Number(odds(wild)||0);
    const captureCap=Number(wild.captureCap||100);
    const downloadText=document.querySelector('.downloadGauge span');
    if(downloadText){
      downloadText.textContent=Math.round(downloadOdds)+'% / '+captureCap+'%';
    }
    const downloadBar=document.querySelector('.downloadGauge i');
    if(downloadBar){
      downloadBar.style.width=Math.max(
        0,
        Math.min(100,downloadOdds/captureCap*100)
      )+'%';
    }

    const logLine=document.querySelector('.battleLog li:last-child');
    if(logLine)logLine.textContent='▸ '+(state.log||'Awaiting command.');

    applyControlHost();
    applyTurnLock();
    return true;
  }

  window.DD_PRODUCT_APP_V4_SHELL={
    version:VERSION,
        productPhase:PRODUCT_PHASE,
    owner:OWNER,
    phase:'4.10-canonical-battle-core-shell',
    state,
    render,
    discover,
    randomCode,
    startBattle,
    fight,
    captureAsk,
    captureResolve,
    continueBattle,
    back,
    panel,
    returnFromPanel,
    battleContext,
    screenContext,
    canonicalBattleStartContext,
    forceUnlockControls,
    screenRegistry,
    controlsRegistry
  };

  seed();
  render();

  document.dispatchEvent(new CustomEvent('dd:v4-shell-ready',{
    detail:window.DD_PRODUCT_APP_V4_SHELL
  }));
})();

/* ---- assets/js/dd-app-presentation-runtime.js ---- */
// Data Discovery v4.9: canonical app layout, overlays, and lifecycle presentation.
(function () {
  'use strict';

  if (!location.pathname.includes('databyte-discovery')) return;
  if (window.DD_APP_PRESENTATION_RUNTIME) return;

  const VERSION = '1.0.0';
  const OWNER = 'dd-app-presentation-runtime';
  const STYLE_ID = 'ddAppPresentationStyle';
  let switchOpen = false;

  const $ = id => document.getElementById(id);
  const player = () => window.DD_PLAYER_RUNTIME;
  const shell = () => window.DD_PRODUCT_APP_V4_SHELL;
  const esc = value => String(value ?? '').replace(/[&<>"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));

  function installStyle() {
    if ($(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      'html,body{height:100%;min-height:100%;overflow:hidden;position:fixed;inset:0;width:100%;overscroll-behavior:none;touch-action:manipulation}',
      '#ddApp{height:100dvh;max-height:100dvh;overflow:hidden}',
      '#ddApp .stage{min-height:0;overflow:hidden;overscroll-behavior:contain}',
      '#ddApp .stage[data-screen="scanner"],#ddApp .stage[data-screen="encounter"]{position:relative;background:radial-gradient(circle at 50% 36%,rgba(56,189,248,.12),transparent 34%),linear-gradient(rgba(56,189,248,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(56,189,248,.08) 1px,transparent 1px);background-size:100% 100%,22px 22px,22px 22px}',
      '#ddApp .stage[data-screen="scanner"]:before,#ddApp .stage[data-screen="encounter"]:before{content:"";position:absolute;left:-15%;right:-15%;top:-10%;height:18%;pointer-events:none;background:linear-gradient(180deg,transparent,rgba(255,215,0,.22),rgba(56,189,248,.12),transparent);filter:blur(1px);animation:ddPresentationScanSweep 4.8s linear infinite;z-index:0}',
      '#ddApp .stage[data-screen="scanner"]>.card,#ddApp .stage[data-screen="encounter"]>.card{position:relative;z-index:1}',
      '#ddApp .scannerOrb:before,#ddApp .scannerOrb:after{animation:ddPresentationRingSpin 12s linear infinite}',
      '#ddApp .scannerOrb:after{animation-direction:reverse;animation-duration:18s}',
      '@keyframes ddPresentationScanSweep{from{transform:translateY(-30%)}to{transform:translateY(620%)}}',
      '@keyframes ddPresentationRingSpin{to{transform:rotate(360deg)}}',
      '@media(prefers-reduced-motion:reduce){#ddApp .stage[data-screen="scanner"]:before,#ddApp .stage[data-screen="encounter"]:before,#ddApp .scannerOrb:before,#ddApp .scannerOrb:after{animation:none!important}}',
      '#ddApp .controls{overflow:auto;overscroll-behavior:contain}',
      '.dd-switch-panel{position:fixed;inset:10px;z-index:1000003;background:rgba(7,17,31,.98);border:1px solid rgba(125,211,252,.28);border-radius:24px;padding:14px;color:white;display:grid;grid-template-rows:auto minmax(0,1fr) auto;gap:10px}',
      '.dd-switch-head{display:flex;justify-content:space-between;gap:10px;align-items:center}.dd-switch-head b{color:#FFD700}',
      '.dd-switch-list{overflow:auto;display:grid;gap:8px}.dd-switch-card{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center;border:1px solid rgba(255,255,255,.12);border-radius:18px;padding:10px;background:rgba(15,23,42,.82)}',
      '.dd-switch-card.active{border-color:rgba(255,215,0,.75)}.dd-switch-card.disabled{opacity:.48}.dd-switch-meta{display:grid;gap:3px;min-width:0}.dd-switch-meta strong{color:#38BDF8}.dd-switch-meta span{font-size:12px;color:#BAE6FD}',
      '.dd-switch-card button,.dd-switch-close{border:0;border-radius:14px;padding:10px 12px;font-weight:900}.dd-switch-card button{background:#FFD700;color:#111827}.dd-switch-card button:disabled{background:#334155;color:#94A3B8}.dd-switch-close{background:#0F172A;color:white}',
      '.dd-switch-note{font-size:12px;color:#BAE6FD;line-height:1.35}'
    ].join('');
    document.head.appendChild(style);
  }

  function inBattle() { return !!(shell() && shell().state && shell().state.screen === 'battle'); }
  function members() { return player() ? player().party.members() : []; }
  function activeSlot() { return player() ? Number(player().partySwitch.getActive() || 0) : 0; }
  function healthy(member) { return !!(member && Number(member.hp || 0) > 0); }

  function hidePartySwitch() {
    switchOpen = false;
    const panel = $('ddPartySwitchPanel');
    if (panel) panel.remove();
  }

  function chooseParty(index) {
    const runtime = player();
    const list = members();
    if (!runtime || !runtime.partySwitch.canSwitch(list, index)) return;
    runtime.partySwitch.setActive(index);
    hidePartySwitch();
    if (shell() && shell().render) shell().render();
  }

  function showPartySwitch(required) {
    if (!inBattle() && !required) return;
    installStyle();
    switchOpen = true;
    let panel = $('ddPartySwitchPanel');
    if (!panel) {
      panel = document.createElement('section');
      panel.id = 'ddPartySwitchPanel';
      panel.className = 'dd-switch-panel';
      ($('ddApp') || document.body).appendChild(panel);
    }
    const list = members();
    const current = activeSlot();
    panel.innerHTML = '<div class="dd-switch-head"><b>' + (required ? 'Switch Required' : 'Switch Party') + '</b><button class="dd-switch-close" ' + (required ? 'disabled' : '') + '>Close</button></div><div class="dd-switch-list">' + list.map((member, index) => {
      const ready = healthy(member) && index !== current;
      return '<article class="dd-switch-card ' + (index === current ? 'active ' : '') + (!healthy(member) ? 'disabled' : '') + '"><div class="dd-switch-meta"><strong>' + esc(member.name || 'Unknown') + '</strong><span>HP ' + Number(member.hp || 0) + '/' + Number(member.maxHp || member.hp || 0) + (index === current ? ' • Active' : healthy(member) ? ' • Ready' : ' • Fainted') + '</span></div><button data-switch-index="' + index + '" ' + (ready ? '' : 'disabled') + '>' + (index === current ? 'Active' : healthy(member) ? 'Switch' : 'Fainted') + '</button></article>';
    }).join('') + '</div><p class="dd-switch-note">Choose a ready party member. Fainted sprites cannot be sent out.</p>';
    const close = panel.querySelector('.dd-switch-close');
    if (close) close.onclick = hidePartySwitch;
    panel.querySelectorAll('[data-switch-index]').forEach(button => { button.onclick = () => chooseParty(Number(button.dataset.switchIndex)); });
  }

  function preventPageScroll(event) {
    const allowed = event.target && event.target.closest && event.target.closest('.controls,.battleLog,.dd-switch-list');
    if (!allowed) event.preventDefault();
  }

  function boot() {
    installStyle();
    document.addEventListener('touchmove', preventPageScroll, { passive: false });
    document.addEventListener('click', event => {
      const button = event.target && event.target.closest && event.target.closest('[data-action="switch"]');
      if (!button || !inBattle()) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      showPartySwitch(false);
    }, true);
    document.addEventListener('dd:open-party-switch', () => showPartySwitch(false));
    document.addEventListener('dd:party-switch-required', () => showPartySwitch(true));
    document.addEventListener('dd:party-switch', hidePartySwitch);
  }

  window.DD_APP_PRESENTATION_RUNTIME = Object.freeze({
    version: VERSION,
    owner: OWNER,
    phase: '4.9-canonical-app-presentation',
    installStyle,
    showPartySwitch,
    hidePartySwitch,
    isPartySwitchOpen: () => switchOpen
  });
  window.DD_PARTY_SWITCH_UI = Object.freeze({ show: showPartySwitch, hide: hidePartySwitch, isOpen: () => switchOpen, owner: OWNER, version: VERSION });
  boot();
  document.dispatchEvent(new CustomEvent('dd:app-presentation-runtime-ready', { detail: window.DD_APP_PRESENTATION_RUNTIME }));
})();
