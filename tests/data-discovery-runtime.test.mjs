import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '..');

function browserContext(seed = {}) {
  const storage = new Map(Object.entries(seed));
  const events = [];
  class CustomEvent {
    constructor(type, options = {}) { this.type = type; this.detail = options.detail; }
  }
  const document = {
    dispatchEvent(event) { events.push(event); return true; },
    addEventListener() {},
    getElementById() { return null; },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    createElement() { return { style: {}, classList: { add() {}, remove() {} }, appendChild() {}, remove() {} }; },
    head: { appendChild() {} },
    body: { appendChild() {} }
  };
  const window = { addEventListener() {}, dispatchEvent(event) { events.push(event); return true; } };
  const context = vm.createContext({
    window,
    document,
    CustomEvent,
    location: { pathname: '/databyte-discovery.html' },
    localStorage: {
      getItem(key) { return storage.has(key) ? storage.get(key) : null; },
      setItem(key, value) { storage.set(key, String(value)); },
      removeItem(key) { storage.delete(key); }
    },
    console,
    Date,
    JSON,
    Math,
    Map,
    Set,
    Object,
    Array,
    Number,
    String,
    Boolean,
    Error,
    setTimeout,
    clearTimeout
  });
  window.window = window;
  window.document = document;
  return { context, window, storage, events };
}

function load(runtime, relativePath) {
  const filename = path.join(root, relativePath);
  vm.runInContext(fs.readFileSync(filename, 'utf8'), runtime.context, { filename });
}

test('player runtime owns collection, party, active slot, inventory, and dex', () => {
  const runtime = browserContext();
  runtime.window.DD_CANON_ROSTER = [
    { id: 'a', name: 'Alpha', hp: 20, maxHp: 20 },
    { id: 'b', name: 'Beta', hp: 18, maxHp: 18 }
  ];
  load(runtime, 'assets/js/dd-player-runtime.js');

  const player = runtime.window.DD_PLAYER_RUNTIME;
  assert.equal(player.owner, 'dd-player-runtime');
  assert.equal(runtime.window.DD_PARTY_RUNTIME.owner, 'dd-player-runtime');
  assert.equal(runtime.window.DD_COLLECTION_RUNTIME.owner, 'dd-player-runtime');

  player.collection.add(runtime.window.DD_CANON_ROSTER[0]);
  player.collection.add(runtime.window.DD_CANON_ROSTER[1]);
  player.party.save(['a', 'b']);
  assert.equal(player.party.lead().id, 'a');
  assert.equal(player.partySwitch.setActive(1), 1);
  assert.equal(player.party.lead().id, 'b');

  player.partySwitch.requireSwitch('test-faint');
  assert.equal(player.partySwitch.isSwitchRequired(), true);
  player.partySwitch.setActive(0);
  assert.equal(player.partySwitch.isSwitchRequired(), false);

  assert.equal(player.inventory.spend('byteCoins', 2).ok, true);
  assert.equal(player.inventory.count('byteCoins'), 6);
  player.dex.noteSeen(runtime.window.DD_CANON_ROSTER[1]);
  assert.equal(player.dex.statusFor(runtime.window.DD_CANON_ROSTER[1]), 'Captured');
  player.collection.update({ id: 'a', name: 'Alpha', hp: 0, maxHp: 20 });
  player.collection.update({ id: 'b', name: 'Beta', hp: 0, maxHp: 18 });
  const recovery = player.recovery.restoreParty();
  assert.equal(recovery.restored, 2);
  assert.equal(player.collection.find('a').hp, 20);
  assert.equal(player.collection.find('b').hp, 18);
  assert.deepEqual(JSON.parse(JSON.stringify(player.health())), {
    owner: 'dd-player-runtime',
    version: '1.2.1',
    collectionCount: 2,
    partyCount: 2,
    usableCount: 2,
    activeSlot: 0,
    switchRequired: false
  });
  const backup = JSON.parse(runtime.storage.get('vl_databyte_player_backup_v1'));
  assert.equal(backup.collection.length, 2);
  assert.deepEqual(backup.party, ['a', 'b']);
});

test('player runtime reports forced switch and party wipe deterministically', () => {
  const runtime = browserContext();
  load(runtime, 'assets/js/dd-player-runtime.js');
  const player = runtime.window.DD_PLAYER_RUNTIME;
  const fainted = { id: 'a', name: 'Alpha', hp: 0, maxHp: 20 };
  const ready = { id: 'b', name: 'Beta', hp: 9, maxHp: 18 };
  player.collection.add(fainted);
  player.collection.add(ready);
  player.party.save(['a', 'b']);
  assert.equal(player.party.lead().id, 'b');

  const switchDecision = player.partySwitch.requestForFaint(fainted, { party: [fainted, ready] });
  assert.equal(switchDecision.switchRequired, true);
  assert.equal(switchDecision.partyWiped, false);
  assert.equal(switchDecision.candidates[0].id, 'b');

  ready.hp = 0;
  const wipeDecision = player.partySwitch.requestForFaint(fainted, { party: [fainted, ready] });
  assert.equal(wipeDecision.switchRequired, false);
  assert.equal(wipeDecision.partyWiped, true);
});

test('player runtime restores a missing primary save from its rolling backup', () => {
  const backup = JSON.stringify({
    version: '1.2.0',
    savedAt: '2026-07-17T00:00:00.000Z',
    collection: [{ id: 'saved', name: 'Saved Sprite', hp: 12, maxHp: 20 }],
    party: ['saved'],
    items: { byteCoins: 4, boosts: 1, repairPulses: 0 },
    seen: [{ name: 'Saved Sprite', status: 'Captured' }]
  });
  const runtime = browserContext({ vl_databyte_player_backup_v1: backup });
  load(runtime, 'assets/js/dd-player-runtime.js');

  const player = runtime.window.DD_PLAYER_RUNTIME;
  assert.equal(player.collection.find('saved').name, 'Saved Sprite');
  assert.deepEqual(player.party.ids(), ['saved']);
  assert.equal(player.inventory.count('byteCoins'), 4);
});

test('player runtime refreshes authored moves without replacing saved progress', () => {
  const runtime = browserContext();
  runtime.window.DD_CANON_ROSTER = [{
    id: 'saved', name: 'Saved Sprite', hp: 42, maxHp: 42,
    moves: [
      { id: 'signal-strike', name: 'Signal Strike' },
      { id: 'mirror-feint', name: 'Mirror Feint' }
    ]
  }];
  load(runtime, 'assets/js/dd-player-runtime.js');
  const player = runtime.window.DD_PLAYER_RUNTIME;
  player.collection.add({
    id: 'saved', name: 'Saved Sprite', hp: 17, maxHp: 44, level: 3, xp: 180,
    moves: [{ id: 'signal-strike', name: 'Signal Strike' }]
  });

  const result = player.recovery.reconcileCollectionWithRoster();
  const saved = player.collection.find('saved');
  assert.equal(result.updated, 1);
  assert.deepEqual(saved.moves.map(move => move.id), ['signal-strike', 'mirror-feint']);
  assert.equal(saved.hp, 17);
  assert.equal(saved.maxHp, 44);
  assert.equal(saved.level, 3);
  assert.equal(saved.xp, 180);
});

test('legacy battle facade remains parseable as an unloaded reference', () => {
  const runtime = browserContext();
  const calls = [];
  runtime.window.DDBattle24 = { typeResult() { return { multiplier: 1 }; } };
  runtime.window.DD_BATTLE_RESOLVER = {
    resolve(actor, move, target) { return { hit: true, damage: move.power, actor, target }; },
    turnOrder() { return 'player'; },
    chooseEnemyMove() { return { id: 'enemy-hit', power: 2 }; }
  };
  runtime.window.DD_BATTLE_STATE_RUNTIME = {
    beginTurn() { calls.push(['begin']); return { terminal: false }; },
    applyResolution(result, actor, target) { target.hp -= result.damage; calls.push(['apply', actor.id, target.id, result.damage]); return { hpResult: { damage: result.damage } }; },
    endTurn() { calls.push(['end']); return { terminal: false }; },
    snapshot() { return { value: 'active', turn: 1 }; }
  };
  runtime.window.DD_STATUS_RUNTIME = { tick() {}, actionGate() { return { allowed: true }; } };
  runtime.window.DD_BATTLE_REWARD_RUNTIME = { award() { return { ok: true }; } };
  runtime.window.DD_BATTLE_PRESENTATION_RUNTIME = {};
  load(runtime, 'assets/js/dd-battle-runtime.js');

  const battle = runtime.window.DD_BATTLE_RUNTIME;
  assert.equal(battle.validate().ok, true);
  battle.emit('turn', { turn: 1 });
  const lead = { id: 'lead', hp: 20 };
  const wild = { id: 'wild', hp: 12 };
  battle.beginTurn([lead, wild], { encounterId: 'enc-1' });
  const resolution = battle.resolve(lead, { id: 'hit', power: 4 }, wild, 'player');
  battle.applyResolution(resolution, lead, wild, { encounterId: 'enc-1' });
  battle.endTurn([lead, wild], { encounterId: 'enc-1' });
  assert.equal(wild.hp, 8);
  assert.deepEqual(calls.map(call => call[0]), ['begin', 'apply', 'end']);
  assert.equal(runtime.events.some(event => event.type === 'dd:battle:turn'), true);
  assert.equal(battle.snapshot().value, 'active');
});

test('screen registry is the single screen and control dispatch contract', () => {
  const runtime = browserContext();
  runtime.window.DD_SCANNER_SCREEN = { renderScannerScreen: context => 'scanner:' + context.log };
  runtime.window.DD_ENCOUNTER_SCREEN = { renderEncounterScreen: context => 'encounter:' + context.signal.name };
  runtime.window.DD_BATTLE_SCREEN = { renderBattleScreen: context => 'battle:' + context.wild.name };
  runtime.window.DD_BATTLE_CONTROLS = { renderBattleControls: context => 'controls:' + context.moves.length };
  runtime.window.DD_CONFIRM_SCREEN = { renderConfirmScreen: () => 'confirm' };
  runtime.window.DD_RESULT_SCREEN = { renderResultScreen: () => 'result' };
  load(runtime, 'assets/js/dd-screen-registry.js');

  const registry = runtime.window.DD_SCREEN_REGISTRY;
  assert.equal(registry.validate().ok, true);
  assert.equal(registry.renderScreen('scanner', { log: 'ready' }), 'scanner:ready');
  assert.equal(registry.renderScreen('encounter', { signal: { name: 'Alpha' } }), 'encounter:Alpha');
  assert.equal(registry.renderScreen('battle', { battleContext: { wild: { name: 'Beta' } } }), 'battle:Beta');
  assert.equal(registry.renderControls('battle', { battleContext: { moves: [{ id: 'hit' }] } }), 'controls:1');
  assert.match(registry.renderControls('encounter', {}), /Start Battle/);
});

test('battle fighter ring renders canonical HP percentage and severity color', () => {
  const runtime = browserContext();
  load(runtime, 'assets/js/dd-battle-screen.js');
  const screen = runtime.window.DD_BATTLE_SCREEN;

  const healthy = screen.renderHpRing({ name: 'Healthy', hp: 30, maxHp: 40 });
  const critical = screen.renderHpRing({ name: 'Critical', hp: 5, maxHp: 40 });
  const fainted = screen.renderHpRing({ name: 'Fainted', hp: 0, maxHp: 40 });

  assert.match(healthy, /--hp-pct:75;--hp-color:#22C55E/);
  assert.match(critical, /--hp-pct:13;--hp-color:#FB7185/);
  assert.match(fainted, /data-hp-percent="0"/);
  assert.match(fainted, /aria-label="HP 0 of 40"/);
  const statusFighter = screen.renderFighter({ name: 'Status', hp: 20, maxHp: 20, statusEffects: [{ id: 'misdirected', label: 'Misdirected', duration: 1 }] }, 'wild');
  assert.match(statusFighter, /statusChip">Misdirected 1/);
  const source = fs.readFileSync(path.join(root, 'assets/js/dd-battle-screen.js'), 'utf8');
  assert.match(source, /width:calc\(100% - 8px\)/);
  assert.match(source, /background:radial-gradient\(circle at 50% 42%,#103258/);
  assert.match(source, /width:100%;height:100%;min-height:0/);
  const shell = fs.readFileSync(path.join(root, 'assets/js/databyte-discovery-product-app-v4-shell.js'), 'utf8');
  assert.match(shell, /classList\.toggle\('battleStage',state\.screen==='battle'\)/);
});

test('battle controls and victory screen expose strategy and progression details', () => {
  const runtime = browserContext();
  const moveIndex = JSON.parse(fs.readFileSync(path.join(root, 'studio/databytesprites/moves.json'), 'utf8'));
  assert.equal(moveIndex.moves.find(move => move.id === 'mirror-feint').statusEffect.durationTurns, 2);
  assert.equal(moveIndex.moves.find(move => move.id === 'shell-clamp').statusEffect.durationTurns, 2);
  load(runtime, 'assets/js/dd-battle-controls.js');
  load(runtime, 'assets/js/dd-result-screen.js');

  const move = runtime.window.DD_BATTLE_CONTROLS.renderMoveButton({
    id: 'screen-guard', name: 'Screen Guard', index: 0,
    power: 0, accuracy: 100, configuration: 'Alloy',
    statusEffect: { id: 'guarded' }, description: 'Guard this sprite.'
  });
  assert.match(move, /Alloy • guarded/);
  assert.match(move, /title="Guard this sprite\."/);

  const victory = runtime.window.DD_RESULT_SCREEN.renderResultScreen({
    result: {
      type: 'success', reason: 'battle-victory', title: 'Battle Victory',
      reward: {
        ok: true,
        reward: {
          xp: 100, byteCoins: 8,
          progression: {
            leveledUp: true, levelsGained: 1, tierUpgraded: false,
            after: { tier: 'Kilobyte', level: 2, progressPercent: 50 }
          }
        }
      }
    },
    collection: [], party: [], items: { byteCoins: 8 }
  });
  assert.match(victory, /Battle Result/);
  assert.match(victory, /Battle XP/);
  assert.match(victory, /Level Up/);
  assert.match(victory, /width:50%/);
});

test('HTML entrypoint and bootstrap imports match the runtime manifest', () => {
  const html = fs.readFileSync(path.join(root, 'databyte-discovery.html'), 'utf8');
  const bootstrap = fs.readFileSync(path.join(root, 'assets/js/dd-app-bootstrap.js'), 'utf8');
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'studio/runtime/load-order.json'), 'utf8'));
  const entrypoints = [...html.matchAll(/<script\s+type="module"\s+src="([^"]+)"/g)].map(match => match[1]);
  const moduleBlock = bootstrap.match(/const modules = Object\.freeze\(\[([\s\S]*?)\]\);/);
  assert.ok(moduleBlock, 'bootstrap module list is present');
  const imports = [...moduleBlock[1].matchAll(/'([^']+)'/g)].map(match => match[1]);

  assert.deepEqual(entrypoints, [manifest.entrypoint.script]);
  assert.deepEqual(imports, manifest.modules.map(module => module.script));
  assert.equal(new Set(imports).size, imports.length);
});

test('legacy resolver and state references remain deterministic when isolated', () => {
  const runtime = browserContext();
  runtime.window.DDBattle24 = {
    typeResult() { return { multiplier: 1, effectiveness: 'neutral' }; }
  };
  runtime.window.DD_GAMEPLAY_RULES = {
    tuneMove(move) { return Object.assign({}, move); }
  };
  load(runtime, 'assets/js/dd-status-runtime.js');
  load(runtime, 'assets/js/dd-battle-resolver.js');
  load(runtime, 'assets/js/dd-battle-state-runtime.js');

  const resolver = runtime.window.DD_BATTLE_RESOLVER;
  const state = runtime.window.DD_BATTLE_STATE_RUNTIME;
  const lead = { id: 'lead', name: 'Lead', hp: 500, maxHp: 500, atk: 14, def: 9, speed: 12, type: 'Aether' };
  const wild = { id: 'wild', name: 'Wild', hp: 120, maxHp: 120, atk: 10, def: 10, speed: 8, type: 'Alloy', stability: 12, maxStability: 12 };
  const move = { id: 'signal-strike', name: 'Signal Strike', power: 24, accuracy: 100, captureEffect: 1, type: 'Aether' };
  const enemyMove = { id: 'counter-pulse', name: 'Counter Pulse', power: 8, accuracy: 100, captureEffect: 0, type: 'Alloy' };
  const context = { encounterId: 'integration-battle', wild, lead, party: [lead], participantSides: ['player', 'wild'] };

  state.start(context.encounterId, context);
  for (let turn = 0; turn < 7; turn += 1) {
    const opened = state.beginTurn([lead, wild], context);
    assert.equal(opened.ok, true);
    const resolution = resolver.resolve(lead, move, wild, { mode: 'player', seed: 'turn-' + turn });
    const applied = state.applyResolution(resolution, lead, wild, Object.assign({}, context, { actorSide: 'player', targetSide: 'wild' }));
    assert.equal(applied.ok, true);
    const counter = resolver.resolve(wild, enemyMove, lead, { mode: 'enemy', seed: 'counter-' + turn });
    const counterApplied = state.applyResolution(counter, wild, lead, Object.assign({}, context, { actorSide: 'wild', targetSide: 'player' }));
    assert.equal(counterApplied.ok, true);
    const closed = state.endTurn([lead, wild], context);
    assert.equal(closed.ok, true);
    assert.equal(state.transactionSnapshot().active, false);
  }
  assert.equal(state.snapshot().turn, 7);
  assert.ok(wild.hp < wild.maxHp);
});

test('rebuilt battle core completes repeated two-action turns without events', () => {
  const runtime = browserContext();
  const persisted = [];
  runtime.window.DD_PLAYER_RUNTIME = {
    party: { updateSprite(sprite) { persisted.push(sprite.hp); return sprite; } }
  };
  runtime.window.DD_CAPTURE_RUNTIME = {
    odds(sprite) { return Number(sprite.currentChance || 30); },
    setOdds(sprite, value) { sprite.currentChance = value; return value; }
  };
  load(runtime, 'assets/js/dd-battle-core-runtime.js');

  const core = runtime.window.DD_BATTLE_CORE_RUNTIME;
  const lead = {
    id: 'lead', name: 'Lead', hp: 80, maxHp: 80,
    atk: 14, def: 9, speed: 12,
    moves: [{ id: 'strike', name: 'Strike', power: 24, accuracy: 100, captureEffect: 1 }]
  };
  const wild = {
    id: 'wild', name: 'Wild', hp: 80, maxHp: 80,
    atk: 10, def: 10, speed: 8, currentChance: 30,
    moves: [{ id: 'pulse', name: 'Pulse', power: 18, accuracy: 100 }]
  };

  core.start({ encounterId: 'core-battle', lead, wild });
  for (let index = 0; index < 7; index += 1) {
    const result = core.runTurn({ lead, wild, move: lead.moves[0] });
    assert.equal(result.ok, true);
    assert.equal(result.actions.length, 2);
    assert.equal(result.state.busy, false);
    assert.equal(core.snapshot().busy, false);
  }
  assert.equal(core.snapshot().turn, 7);
  assert.equal(persisted.length, 7);
  assert.ok(lead.hp < lead.maxHp);
  assert.ok(wild.hp < wild.maxHp);
  assert.ok(wild.currentChance > 30);
});

test('rebuilt battle core owns ordering, misses, and terminal decisions', () => {
  const runtime = browserContext();
  runtime.window.DD_PLAYER_RUNTIME = {
    party: { updateSprite(sprite) { return sprite; } }
  };
  runtime.window.DD_CAPTURE_RUNTIME = {
    odds(sprite) { return Number(sprite.currentChance || 30); },
    setOdds(sprite, value) { sprite.currentChance = value; return value; }
  };
  load(runtime, 'assets/js/dd-battle-core-runtime.js');
  const core = runtime.window.DD_BATTLE_CORE_RUNTIME;

  const slowLead = {
    id: 'slow-lead', name: 'Slow Lead', hp: 20, maxHp: 20,
    atk: 12, def: 8, speed: 1,
    moves: [{ id: 'slow-hit', name: 'Slow Hit', power: 12, accuracy: 100 }]
  };
  const fastWild = {
    id: 'fast-wild', name: 'Fast Wild', hp: 20, maxHp: 20,
    atk: 12, def: 8, speed: 99,
    moves: [{ id: 'fast-hit', name: 'Fast Hit', power: 12, accuracy: 100 }]
  };
  core.start({ encounterId: 'ordering', lead: slowLead, wild: fastWild });
  const ordered = core.runTurn({ lead: slowLead, wild: fastWild, move: slowLead.moves[0] });
  assert.equal(ordered.actions[0].mode, 'enemy');

  let miss = null;
  for (let seed = 0; seed < 20 && !miss; seed += 1) {
    const candidate = core.calculate(
      slowLead,
      { id: 'miss', name: 'Miss', power: 20, accuracy: 1 },
      fastWild,
      seed,
      'player'
    );
    if (!candidate.hit) miss = candidate;
  }
  assert.ok(miss);
  assert.equal(miss.damage, 0);

  const winner = Object.assign({}, slowLead, { hp: 20, speed: 99 });
  const defeatedWild = Object.assign({}, fastWild, { hp: 1, speed: 1 });
  core.start({ encounterId: 'victory', lead: winner, wild: defeatedWild });
  const victory = core.runTurn({ lead: winner, wild: defeatedWild, move: winner.moves[0] });
  assert.equal(victory.terminal, 'wild-defeated');
  assert.equal(victory.actions.length, 1);

  const defeatedLead = Object.assign({}, slowLead, { hp: 1, speed: 1 });
  const attacker = Object.assign({}, fastWild, { hp: 20, speed: 99 });
  core.start({ encounterId: 'defeat', lead: defeatedLead, wild: attacker });
  const defeat = core.runTurn({ lead: defeatedLead, wild: attacker, move: defeatedLead.moves[0] });
  assert.equal(defeat.terminal, 'lead-defeated');
  assert.equal(defeat.actions.length, 1);
});

test('rebuilt battle core integrates silent status application and ticking', () => {
  const runtime = browserContext();
  runtime.window.DD_PLAYER_RUNTIME = {
    party: { updateSprite(sprite) { return sprite; } }
  };
  runtime.window.DD_CAPTURE_RUNTIME = {
    odds(sprite) { return Number(sprite.currentChance || 30); },
    setOdds(sprite, value) { sprite.currentChance = value; return value; }
  };
  load(runtime, 'assets/js/dd-status-runtime.js');
  load(runtime, 'assets/js/dd-battle-core-runtime.js');

  const core = runtime.window.DD_BATTLE_CORE_RUNTIME;
  const lead = {
    id: 'status-lead', name: 'Status Lead', hp: 40, maxHp: 40,
    atk: 14, def: 9, speed: 20,
    moves: [{
      id: 'burn-hit', name: 'Burn Hit', power: 16, accuracy: 100,
      statusEffect: { id: 'burn', chance: 100, duration: 2 }
    }]
  };
  const wild = {
    id: 'status-wild', name: 'Status Wild', hp: 40, maxHp: 40,
    atk: 8, def: 8, speed: 1,
    moves: [{ id: 'pulse', name: 'Pulse', power: 8, accuracy: 100 }]
  };

  core.start({ encounterId: 'status-battle', lead, wild });
  const result = core.runTurn({ lead, wild, move: lead.moves[0] });
  assert.equal(result.ok, true);
  assert.equal(result.actions[0].appliedStatus.id, 'burn');
  assert.equal(result.statusTicks.length, 2);
  assert.equal(wild.statusEffects[0].duration, 1);
  assert.ok(result.statusTicks[1].effects.some(effect => effect.damage >= 2));

  lead.statusEffects = [];
  wild.statusEffects = [];
  lead.hp = 40;
  wild.hp = 40;
  const guard = {
    id: 'screen-guard', name: 'Screen Guard', power: 0, accuracy: 100,
    statusEffect: { id: 'guarded', chance: 100, durationTurns: 2, target: 'self' }
  };
  core.start({ encounterId: 'guard-battle', lead, wild });
  const guarded = core.runTurn({ lead, wild, move: guard });
  assert.equal(guarded.actions[0].damage, 0);
  assert.equal(guarded.actions[0].appliedStatus.id, 'guarded');
  assert.equal(guarded.actions[0].statusRecipient.id, lead.id);
  assert.ok(runtime.window.DD_STATUS_RUNTIME.modifiers(lead).damageTakenMultiplier < 1);
});

test('battle rewards are granted once per unique rebuilt-core encounter', () => {
  const runtime = browserContext();
  load(runtime, 'assets/js/dd-player-runtime.js');
  const player = runtime.window.DD_PLAYER_RUNTIME;
  player.collection.add({ id: 'lead-1', name: 'Lead One', hp: 20, maxHp: 20, atk: 10, def: 8, speed: 7 });
  player.party.save(['lead-1']);
  load(runtime, 'assets/js/dd-battle-reward-runtime.js');

  const rewards = runtime.window.DD_BATTLE_REWARD_RUNTIME;
  const context = {
    encounterId: 'core-reward-1',
    defeated: { id: 'wild-1', name: 'Wild One', rarity: 'Legendary', level: 10 },
    recipient: { id: 'lead-1', name: 'Lead One' }
  };

  const first = rewards.award(context);
  const duplicate = rewards.award(context);
  assert.equal(first.ok, true);
  assert.equal(first.duplicate, false);
  assert.equal(first.profile.victories, 1);
  assert.ok(first.reward.xp > 0);
  assert.ok(first.reward.byteCoins > 0);
  assert.equal(first.reward.progression.leveledUp, true);
  assert.equal(first.reward.progression.after.level, 2);
  assert.equal(player.collection.find('lead-1').level, 2);
  assert.equal(player.collection.find('lead-1').maxHp, 22);
  assert.equal(rewards.getHistory(10).length, 1);
  assert.equal(duplicate.ok, false);
  assert.equal(duplicate.duplicate, true);
  assert.equal(duplicate.profile.victories, 1);
  assert.equal(rewards.getHistory(10).length, 1);
});
