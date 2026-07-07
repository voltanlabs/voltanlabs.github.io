// assets/js/dd-collection-runtime.js
// Phase 3.8.2: captured sprite collection ownership split.
(function () {
  const KEY_COLLECTION = "vl_databyte_discovery_collection_v2";

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY_COLLECTION)) || []; }
    catch { return []; }
  }
  function write(list) {
    const next = Array.isArray(list) ? list : [];
    localStorage.setItem(KEY_COLLECTION, JSON.stringify(next));
    return next;
  }
  function all() { return read(); }
  function find(id) { return all().find((sprite) => sprite && sprite.id === id) || null; }
  function has(id) { return !!find(id); }
  function add(sprite) {
    if (!sprite || !sprite.id) return { ok: false, collection: all(), sprite: null, reason: "missing-sprite-id" };
    const list = all();
    if (!list.some((item) => item && item.id === sprite.id)) list.push(sprite);
    else {
      const index = list.findIndex((item) => item && item.id === sprite.id);
      list[index] = Object.assign({}, list[index], sprite);
    }
    return { ok: true, collection: write(list), sprite };
  }
  function update(sprite) { return add(sprite); }
  function remove(id) {
    const next = all().filter((sprite) => sprite && sprite.id !== id);
    return write(next);
  }
  function clear() { return write([]); }
  function count() { return all().length; }
  function names() { return all().map((sprite) => sprite && sprite.name).filter(Boolean); }

  window.DD_COLLECTION_RUNTIME = {
    version: "0.1.0",
    phase: "3.8.2-collection-runtime-split",
    key: KEY_COLLECTION,
    read,
    write,
    all,
    find,
    has,
    add,
    update,
    remove,
    clear,
    count,
    names
  };
  document.dispatchEvent(new CustomEvent("dd:collection-runtime-ready", { detail: window.DD_COLLECTION_RUNTIME }));
})();
