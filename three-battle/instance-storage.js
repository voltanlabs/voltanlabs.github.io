(function () {
  const session = window.DataByteSession;
  if (!session || session.__instanceStorage) return;
  const PARTY_KEY = 'vl_three_battle_party', SLOTS_KEY = 'vl_three_battle_slots', REPO_KEY = 'vl_three_battle_repository';
  const uid = item => item?.uid || item?.id || '';
  const makeUid = id => `${id}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const read = (key, prefix) => {
    let list; try { list = JSON.parse(localStorage.getItem(key) || '[]'); } catch { list = []; }
    if (!Array.isArray(list)) list = [];
    let changed = false; const used = new Set();
    list = list.filter(Boolean).map((item, index) => {
      const next = { ...item };
      if (!next.uid || used.has(next.uid)) { next.uid = `${next.id || 'databyte'}-${prefix}-${index + 1}`; changed = true; }
      used.add(next.uid); return next;
    });
    if (changed) localStorage.setItem(key, JSON.stringify(list));
    return list;
  };
  const party = () => read(PARTY_KEY, 'party');
  const repository = () => read(REPO_KEY, 'repo');
  const slots = () => {
    let list; try { list = JSON.parse(localStorage.getItem(SLOTS_KEY) || 'null'); } catch { list = null; }
    if (!Array.isArray(list)) list = party();
    list = Array.from({ length: 5 }, (_, index) => list[index] || null);
    const normalized = list.map((item, index) => item ? { ...item, uid: item.uid || `${item.id || 'databyte'}-slot-${index + 1}` } : null);
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
      const added = { ...source, uid: makeUid(source.id), sprite: './data/sprites/' + (source.sprite || 'placeholder.png'), hp: 100, maxHp: 100, xp: 0, level: 1 };
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
  function addSpriteXp(id, amount) { const gain = Math.max(0, Number(amount) || 0), active = party(), stored = repository(), item = [...active, ...stored].find(entry => uid(entry) === id || entry.id === id); if (!gain || !item) return { ok: false, reason: !gain ? 'invalid-xp' : 'not-found' }; const before = session.spriteProgress?.(item) || { xp: Number(item.xp || 0), level: Number(item.level || 1) }; item.xp = before.xp + gain; item.level = session.spriteProgress(item).level; save(active, stored); window.dispatchEvent(new CustomEvent('databyte:party-updated', { detail: { id: uid(item), xp: item.xp, level: item.level } })); return { ok: true, id: uid(item), xp: item.xp, level: item.level, previousLevel: before.level, leveledUp: item.level > before.level }; }
  function capture(sprite) { const active = party(), stored = repository(), item = { ...sprite, uid: makeUid(sprite.id), id: sprite.id, name: sprite.name, sprite: sprite.sprite, hp: Math.max(0, Number(sprite.hp ?? 100)), maxHp: Number(sprite.maxHp ?? 100), xp: 0, level: 1 }; const empty = slots().findIndex(entry => !entry); if (empty < 0) { stored.push(item); save(active, stored); window.dispatchEvent(new CustomEvent('databyte:party-updated')); return { ok: true, location: 'repository', items: active, repository: stored, uid: item.uid }; } const next = slots(); next[empty] = item; save(next, stored); window.dispatchEvent(new CustomEvent('databyte:party-updated')); return { ok: true, location: 'party', items: next.filter(Boolean), uid: item.uid }; }
  function store(id) { const active = slots(), stored = repository(), index = active.findIndex(item => item && (uid(item) === id || item.id === id)); if (index < 0 || index === 0) return false; stored.push(active[index]); active[index] = null; save(active, stored); if (starter() === uid(stored[stored.length - 1])) setStarter(active.find(Boolean)?.uid || ''); window.dispatchEvent(new CustomEvent('databyte:party-updated')); return true; }
  function deploy(id) { const active = slots(), stored = repository(), index = stored.findIndex(item => uid(item) === id || item.id === id); if (index < 0) return false; const next = stored.splice(index, 1)[0], empty = active.findIndex(item => !item); if (empty < 0) return false; active[empty] = next; save(active, stored); window.dispatchEvent(new CustomEvent('databyte:party-updated')); return true; }
  function swapSlots(a, b) { const active = slots(); if (a === b || (a === 0 && active[b] && Number(active[b].hp ?? 100) <= 0) || (b === 0 && active[a] && Number(active[a].hp ?? 100) <= 0)) return false; [active[a], active[b]] = [active[b], active[a]]; save(active, repository()); setStarter(active[0]?.uid || ''); return true; }
  function assignSlot(index, id) { const active = slots(), stored = repository(), repoIndex = stored.findIndex(item => uid(item) === id || item.id === id); if (repoIndex < 0 || (index === 0 && Number(stored[repoIndex].hp ?? 100) <= 0)) return false; const old = active[index]; active[index] = stored.splice(repoIndex, 1)[0]; if (old) stored.push(old); save(active, stored); if (index === 0) setStarter(active[0].uid); return true; }
  session.party = party; session.repository = repository; session.slots = slots; session.starter = starter; session.setStarter = setStarter; session.setLead = setLead; session.updateHp = updateHp; session.addSpriteXp = addSpriteXp; session.capture = capture; session.store = store; session.deploy = deploy; session.swapSlots = swapSlots; session.assignSlot = assignSlot; session.identity = uid; session.__instanceStorage = true;
})();
