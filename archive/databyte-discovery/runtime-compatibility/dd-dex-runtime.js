// assets/js/dd-dex-runtime.js
// Phase 3.8.2: DataByteDex progress ownership split.
(function () {
  const KEY_SEEN = "vl_databyte_seen_v1";
  const collectionRt = () => window.DD_COLLECTION_RUNTIME;
  const roster = () => window.DD_CANON_ROSTER || [];

  function readSeen() {
    try { return JSON.parse(localStorage.getItem(KEY_SEEN)) || []; }
    catch { return []; }
  }
  function writeSeen(list) {
    const next = Array.isArray(list) ? list : [];
    localStorage.setItem(KEY_SEEN, JSON.stringify(next));
    return next;
  }
  function recordName(record) { return typeof record === "string" ? record : record && record.name; }
  function collectionNames() { return new Set((collectionRt() ? collectionRt().all() : []).map((sprite) => sprite && sprite.name).filter(Boolean)); }
  function seenNames() {
    const names = new Set(readSeen().map(recordName).filter(Boolean));
    collectionNames().forEach((name) => names.add(name));
    return names;
  }
  function note(sprite, status) {
    if (!sprite || !sprite.name) return null;
    const list = readSeen();
    const index = list.findIndex((record) => recordName(record) === sprite.name);
    const next = { name: sprite.name, dex: sprite.dex, type: sprite.type, rarity: sprite.rarity, status: status || "Seen", seenAt: new Date().toISOString() };
    if (index >= 0) list[index] = Object.assign({}, typeof list[index] === "string" ? {} : list[index], next);
    else list.push(next);
    writeSeen(list);
    return next;
  }
  function noteSeen(sprite) { return note(sprite, "Seen"); }
  function noteOwned(sprite) { return note(sprite, "Captured"); }
  function statusFor(sprite) {
    const name = sprite && sprite.name;
    if (!name) return "Unknown";
    if (collectionNames().has(name)) return "Captured";
    if (seenNames().has(name)) return "Seen";
    return "Unknown";
  }
  function stats() { return { seen: seenNames().size, captured: collectionNames().size, total: roster().length }; }
  function records() {
    return roster().map((sprite) => ({ name: sprite.name, dex: sprite.dex, icon: sprite.icon, type: sprite.type, rarity: sprite.rarity, status: statusFor(sprite) }));
  }
  function reset() { return writeSeen([]); }

  window.DD_DEX_RUNTIME = {
    version: "0.1.0",
    phase: "3.8.2-dex-runtime-split",
    key: KEY_SEEN,
    readSeen,
    writeSeen,
    note,
    noteSeen,
    noteOwned,
    seenNames,
    collectionNames,
    statusFor,
    stats,
    records,
    reset
  };
  document.dispatchEvent(new CustomEvent("dd:dex-runtime-ready", { detail: window.DD_DEX_RUNTIME }));
})();
