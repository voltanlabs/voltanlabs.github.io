// assets/js/dd-party-runtime.js
// Phase 3.8: split party ownership out of Product App.
(function () {
  const KEY_COLLECTION = "vl_databyte_discovery_collection_v2";
  const KEY_PARTY = "vl_databyte_party_v1";
  const MAX_PARTY = 5;

  function read(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; }
    catch { return fallback; }
  }
  function write(key, value) { localStorage.setItem(key, JSON.stringify(value)); return value; }
  function collection() { return read(KEY_COLLECTION, []); }
  function partyIds() { return read(KEY_PARTY, []); }
  function exists(id, list) { return list.some((sprite) => sprite && sprite.id === id); }
  function saveParty(ids) {
    const sprites = collection();
    const clean = [...new Set((ids || []).filter((id) => exists(id, sprites)))].slice(0, MAX_PARTY);
    return write(KEY_PARTY, clean);
  }
  function autoFill() {
    const sprites = collection();
    const ids = partyIds().filter((id) => exists(id, sprites));
    sprites.forEach((sprite) => {
      if (ids.length < MAX_PARTY && sprite && sprite.id && !ids.includes(sprite.id)) ids.push(sprite.id);
    });
    return saveParty(ids);
  }
  function members() {
    const sprites = collection();
    const ids = autoFill();
    return ids.map((id) => sprites.find((sprite) => sprite && sprite.id === id)).filter(Boolean);
  }
  function lead() {
    const party = members();
    const available = party.find((sprite) => Number(sprite.hp || sprite.maxHp || 0) > 0);
    return available || party[0] || collection()[0] || null;
  }
  function add(sprite) {
    if (!sprite || !sprite.id) return autoFill();
    const ids = partyIds();
    if (!ids.includes(sprite.id) && ids.length < MAX_PARTY) ids.push(sprite.id);
    return saveParty(ids);
  }
  function remove(id) { return saveParty(partyIds().filter((item) => item !== id)); }
  function swap(fromIndex, toIndex) {
    const ids = autoFill();
    if (fromIndex < 0 || toIndex < 0 || fromIndex >= ids.length || toIndex >= ids.length) return ids;
    const next = ids.slice();
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    return saveParty(next);
  }
  function updateSprite(sprite) {
    if (!sprite || !sprite.id) return sprite;
    const sprites = collection();
    const index = sprites.findIndex((item) => item && item.id === sprite.id);
    if (index >= 0) {
      sprites[index] = sprite;
      write(KEY_COLLECTION, sprites);
    }
    return sprite;
  }
  function reset() { return write(KEY_PARTY, []); }

  window.DD_PARTY_RUNTIME = {
    version: "0.1.0",
    phase: "3.8-party-runtime-split",
    maxParty: MAX_PARTY,
    keys: { collection: KEY_COLLECTION, party: KEY_PARTY },
    collection,
    ids: partyIds,
    save: saveParty,
    autoFill,
    members,
    lead,
    add,
    remove,
    swap,
    updateSprite,
    reset
  };
  document.dispatchEvent(new CustomEvent("dd:party-runtime-ready", { detail: window.DD_PARTY_RUNTIME }));
})();
