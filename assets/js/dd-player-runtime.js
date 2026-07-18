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
