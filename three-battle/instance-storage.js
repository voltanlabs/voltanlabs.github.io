(function () {
  const session = window.DataByteSession;
  if (!session || session.__instanceStorage) return;
  const PARTY_KEY = 'vl_three_battle_party', SLOTS_KEY = 'vl_three_battle_slots', REPO_KEY = 'vl_three_battle_repository';
  const uid = item => item?.uid || item?.id || '';
  const makeUid = id => `${id}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const statBases = { Voltricity: [68, 48, 72], Mystic: [62, 56, 62], Alloy: [56, 74, 48], Thermal: [72, 48, 58], Seismic: [64, 70, 42], Organic: [58, 62, 56], Aquatic: [54, 58, 68], Default: [60, 60, 60] };
  const stageFor = item => window.DataByteProgressionData?.stageFor?.(item) || 1;
  const hpCap = item => Math.min(300, stageFor(item) * 100);
  const levelFor = item => Math.max(1, Math.min(100, Number(item?.level) || 1));
  const hpFor = item => { const base = Math.max(1, Number(item?.captureHp) || 60), progress = Math.max(0, Math.min(1, (levelFor(item) - 1) / 99)); return Math.min(hpCap(item), Math.round(base + (hpCap(item) - base) * Math.pow(progress, 0.55))); };
  const statRollsFor = item => { if (item?.statRolls) return { ...item.statRolls }; const configuration = item?.primaryConfiguration || item?.configurations?.[0] || item?.configuration || 'Default', base = statBases[configuration] || statBases.Default, text = `${item?.id || ''}:${item?.uid || ''}`; let seed = 0; for (const char of text) seed = (seed * 31 + char.charCodeAt(0)) >>> 0; return { attack: base[0] + (seed % 13) - 6, defense: base[1] + ((seed >>> 4) % 13) - 6, speed: base[2] + ((seed >>> 8) % 13) - 6 }; };
  const statsFor = item => { const rolls = statRollsFor(item), stageBonus = (stageFor(item) - 1) * 18, growth = (levelFor(item) - 1) * 0.85, wildCap = item?.wildInstance === true ? value => Math.min(160, value) : value => value; return { attack: Math.max(1, wildCap(Math.round(rolls.attack + stageBonus + growth))), defense: Math.max(1, wildCap(Math.round(rolls.defense + stageBonus + growth))), speed: Math.max(1, wildCap(Math.round(rolls.speed + stageBonus + growth))), crit: Math.max(0, Math.min(50, Number(item?.stats?.crit ?? item?.crit ?? Math.floor(Math.random() * 51)))) }; };
  const progressionFor = item => { const cap = hpCap(item), current = Math.max(1, Number(item?.captureHp) || Math.min(100, Number(item?.maxHp) || 100)), maxHp = hpFor({ ...item, captureHp: Math.min(current, cap) }); return { maxHp, hp: Math.min(maxHp, Math.max(0, Number(item?.hp ?? maxHp))) }; };
  const createWildInstance = source => { const level = Math.max(1, Math.min(100, Number(source?.level) || 1)), captureHp = 60 + Math.floor(Math.random() * 41), xp = Math.max(Number(source?.xp) || 0, 50 * (level - 1) * level), wild = normalizeInstance({ ...source, uid: `wild-${source?.id || 'signal'}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, captureHp, maxHp: captureHp, hp: captureHp, level, xp, wildInstance: true }); wild.hp = wild.maxHp; return wild; };
  const normalizeInstance = item => { const next = { ...item }; next.xp = Math.max(0, Number(next.xp) || 0); next.level = session.spriteProgress?.(next)?.level || 1; next.captureHp = Math.max(1, Math.min(hpCap(next), Number(next.captureHp) || Math.min(100, Number(next.maxHp) || 100))); next.maxHp = progressionFor(next).maxHp; next.hp = Math.min(next.maxHp, Math.max(0, Number(next.hp ?? next.maxHp))); next.statRolls = statRollsFor(next); next.stats = statsFor(next); next.statsVersion = 3; return next; };
  const read = (key, prefix) => {
    let list; try { list = JSON.parse(localStorage.getItem(key) || '[]'); } catch { list = []; }
    if (!Array.isArray(list)) list = [];
    let changed = false; const used = new Set();
    list = list.filter(Boolean).map((item, index) => {
      const next = { ...item };
      if (!next.uid || used.has(next.uid)) { next.uid = `${next.id || 'databyte'}-${prefix}-${index + 1}`; changed = true; }
      const normalized = normalizeInstance(next); if (JSON.stringify(normalized) !== JSON.stringify(next)) changed = true;
      Object.assign(next, normalized);
      used.add(next.uid); return next;
    });
    if (changed) localStorage.setItem(key, JSON.stringify(list));
    return list;
  };
  const party = () => read(PARTY_KEY, 'party');
  const repository = () => read(REPO_KEY, 'repo');
  const slots = () => {
    let list; try { list = JSON.parse(localStorage.getItem(SLOTS_KEY) || 'null'); } catch { list = null; }
    const legacy = party();
    if (!Array.isArray(list)) list = legacy;
    else {
      const present = new Set(list.filter(Boolean).map(item => uid(item)));
      for (const item of legacy) {
        if (present.has(uid(item))) continue;
        const open = list.findIndex(entry => !entry);
        if (open < 0) break;
        list[open] = item;
        present.add(uid(item));
      }
    }
    list = Array.from({ length: 5 }, (_, index) => list[index] || null);
    const normalized = list.map((item, index) => item ? { ...item, uid: item.uid || `${item.id || 'databyte'}-slot-${index + 1}`, stats: item.stats || statsFor(item), statsVersion: item.statsVersion || 2 } : null);
    localStorage.setItem(SLOTS_KEY, JSON.stringify(normalized));
    localStorage.setItem(PARTY_KEY, JSON.stringify(normalized.filter(Boolean)));
    return normalized;
  };
  const save = (active, stored) => {
    const normalized = Array.from({ length: 5 }, (_, index) => active[index] || null);
    localStorage.setItem(SLOTS_KEY, JSON.stringify(normalized));
    localStorage.setItem(PARTY_KEY, JSON.stringify(normalized.filter(Boolean)));
    localStorage.setItem(REPO_KEY, JSON.stringify(stored.filter(Boolean)));
  };
  const find = (id, includeRepository = true) => [...party(), ...(includeRepository ? repository() : [])].find(item => uid(item) === id || item.id === id);
  function starter() { return localStorage.getItem('vl_three_battle_starter') || ''; }
  function setStarter(id) {
    const item = find(id), source = session.roster?.().find(entry => entry.id === id);
    if (item && Number(item.hp ?? 100) <= 0) return false;
    if (!item && source) {
      const active = slots(), stored = repository();
      if (active.filter(Boolean).length >= 5) return false;
    const captureHp = 60 + Math.floor(Math.random() * 41), addedBase = { ...source, uid: makeUid(source.id), sprite: './data/sprites/' + (source.sprite || 'placeholder.png'), hp: captureHp, captureHp, maxHp: captureHp, xp: 0, level: 1 };
    const added = normalizeInstance({ ...addedBase, stats: { crit: Math.floor(Math.random() * 51) } });
      active.unshift(added); save(active, stored); id = added.uid;
    } else if (item) {
      id = uid(item);
      const active = slots(), index = active.findIndex(entry => uid(entry) === id);
      if (index > 0) { [active[0], active[index]] = [active[index], active[0]]; save(active, repository()); }
    }
    localStorage.setItem('vl_three_battle_starter', id || '');
    if (source) session.markSeen?.(source);
    window.dispatchEvent(new CustomEvent('databyte:starter-updated', { detail: { id: find(id)?.id || source?.id || id, uid: id } }));
    window.dispatchEvent(new CustomEvent('databyte:party-updated'));
    return true;
  }
  function setLead(id) { const item = find(id); return item && Number(item.hp ?? 100) > 0 ? setStarter(uid(item)) : false; }
  function updateHp(id, hp) { const active = party(), stored = repository(), item = [...active, ...stored].find(entry => uid(entry) === id || entry.id === id); if (!item) return false; item.hp = Math.max(0, Number(hp) || 0); if (item.hp > 0) item.recoveryRounds = 0; save(active, stored); window.dispatchEvent(new CustomEvent('databyte:party-updated')); return true; }
  function addSpriteXp(id, amount) { const gain = Math.max(0, Number(amount) || 0), active = party(), stored = repository(), item = [...active, ...stored].find(entry => uid(entry) === id || entry.id === id); if (!gain || !item) return { ok: false, reason: !gain ? 'invalid-xp' : 'not-found' }; const before = session.spriteProgress?.(item) || { xp: Number(item.xp || 0), level: Number(item.level || 1) }; const hpRatio = Number(item.maxHp) > 0 ? Math.max(0, Number(item.hp || 0) / Number(item.maxHp)) : 1; item.xp = before.xp + gain; item.level = session.spriteProgress(item).level; const refreshed = normalizeInstance(item); item.maxHp = refreshed.maxHp; item.hp = Math.round(refreshed.maxHp * hpRatio); item.stats = refreshed.stats; item.statsVersion = 3; item.statRolls = refreshed.statRolls; save(active, stored); window.dispatchEvent(new CustomEvent('databyte:party-updated', { detail: { id: uid(item), xp: item.xp, level: item.level } })); return { ok: true, id: uid(item), xp: item.xp, level: item.level, previousLevel: before.level, leveledUp: item.level > before.level }; }
  function capture(sprite) { const active = party(), stored = repository(), instanceUid = makeUid(sprite.id), captureHp = Math.max(1, Number(sprite?.captureHp) || Math.min(100, Number(sprite?.maxHp) || 100)), currentHp = Math.max(0, Number(sprite?.hp ?? sprite?.maxHp ?? captureHp)), item = normalizeInstance({ ...sprite, uid: instanceUid, id: sprite.id, name: sprite.name, sprite: sprite.sprite, hp: currentHp, captureHp, maxHp: Number(sprite?.maxHp) || captureHp, stats: { ...(sprite?.stats || {}) }, statRolls: sprite?.statRolls ? { ...sprite.statRolls } : undefined, wildInstance: false }); const empty = slots().findIndex(entry => !entry); if (empty < 0) { stored.push(item); save(active, stored); window.dispatchEvent(new CustomEvent('databyte:party-updated')); return { ok: true, location: 'repository', items: active, repository: stored, uid: item.uid }; } const next = slots(); next[empty] = item; save(next, stored); window.dispatchEvent(new CustomEvent('databyte:party-updated')); return { ok: true, location: 'party', items: next.filter(Boolean), uid: item.uid }; }
  function store(id) { const active = slots(), stored = repository(), index = active.findIndex(item => item && (uid(item) === id || item.id === id)); if (index < 0 || index === 0) return false; stored.push(active[index]); active[index] = null; save(active, stored); if (starter() === uid(stored[stored.length - 1])) setStarter(active.find(Boolean)?.uid || ''); window.dispatchEvent(new CustomEvent('databyte:party-updated')); return true; }
  function storeSlot(index) { if (index === 0) return false; const active = slots(), item = active[index]; if (!item) return false; const stored = repository(); stored.push(item); active[index] = null; save(active, stored); window.dispatchEvent(new CustomEvent('databyte:party-updated')); return true; }
  function deploy(id) { const active = slots(), stored = repository(), index = stored.findIndex(item => uid(item) === id || item.id === id); if (index < 0) return false; const next = stored.splice(index, 1)[0], empty = active.findIndex(item => !item); if (empty < 0) return false; active[empty] = next; save(active, stored); window.dispatchEvent(new CustomEvent('databyte:party-updated')); return true; }
  function swapSlots(a, b) { const active = slots(); if (a === b || (a === 0 && active[b] && Number(active[b].hp ?? 100) <= 0) || (b === 0 && active[a] && Number(active[a].hp ?? 100) <= 0)) return false; [active[a], active[b]] = [active[b], active[a]]; save(active, repository()); setStarter(active[0]?.uid || ''); return true; }
  function assignSlot(index, id) { const active = slots(), stored = repository(), repoIndex = stored.findIndex(item => uid(item) === id || item.id === id); if (repoIndex < 0 || (index === 0 && Number(stored[repoIndex].hp ?? 100) <= 0)) return false; const old = active[index]; active[index] = stored.splice(repoIndex, 1)[0]; if (old) stored.push(old); save(active, stored); if (index === 0) setStarter(active[0].uid); return true; }
  function deleteInstance(id) { const active = slots(), stored = repository(), key = id, wasLead = starter() === key, nextActive = active.map(item => item && (uid(item) === key || item.id === id) ? null : item), nextStored = stored.filter(item => !(uid(item) === key || item.id === id)); if (nextActive.length === active.length && nextStored.length === stored.length && !active.some(Boolean)) return false; save(nextActive, nextStored); if (wasLead) { const replacement = nextActive.find(item => item && Number(item.hp ?? 100) > 0); if (replacement) setStarter(uid(replacement)); else localStorage.removeItem('vl_three_battle_starter'); } window.dispatchEvent(new CustomEvent('databyte:party-updated')); return true; }
  function importSave(payload) { let data = payload; try { if (typeof payload === 'string') data = JSON.parse(payload); } catch { return { ok: false, reason: 'invalid-json' }; } if (!data || !Array.isArray(data.party) || !Array.isArray(data.repository)) return { ok: false, reason: 'invalid-save' }; const normalize = (list, prefix) => { const used = new Set(); return list.filter(Boolean).map((item, index) => { const next = { ...item, uid: item.uid || `${item.id || 'databyte'}-${prefix}-${index + 1}`, stats: item.stats || statsFor(item) }; while (used.has(next.uid)) next.uid = makeUid(next.id); used.add(next.uid); return next; }); }; const active = normalize(data.party, 'import-party').slice(0, 5), stored = normalize(data.repository, 'import-repo').filter(item => !active.some(entry => uid(entry) === uid(item))); save(active, stored); const requested = data.starter || ''; const lead = active.find(item => uid(item) === requested || item.id === requested); if (lead && Number(lead.hp ?? 100) > 0) localStorage.setItem('vl_three_battle_starter', uid(lead)); else localStorage.removeItem('vl_three_battle_starter'); window.dispatchEvent(new CustomEvent('databyte:party-updated')); window.dispatchEvent(new CustomEvent('databyte:dex-updated')); return { ok: true }; }
    session.party = party; session.repository = repository; session.slots = slots; session.starter = starter; session.setStarter = setStarter; session.setLead = setLead; session.updateHp = updateHp; session.addSpriteXp = addSpriteXp; session.capture = capture; session.store = store; session.storeSlot = storeSlot; session.deploy = deploy; session.swapSlots = swapSlots; session.assignSlot = assignSlot; session.deleteInstance = deleteInstance; session.importSave = importSave; session.identity = uid; session.createInstanceStats = statsFor; session.createWildInstance = createWildInstance; session.refreshInstance = normalizeInstance; session.hpCap = hpCap; session.__instanceStorage = true;
})();
