// assets/js/dd-inventory-runtime.js
// Phase 3.8: split inventory ownership out of Product App.
(function () {
  const KEY_ITEMS = "vl_databyte_items_v1";
  const DEFAULT_ITEMS = { byteCoins: 8, boosts: 3, repairPulses: 1 };

  function normalize(items) {
    const next = Object.assign({}, DEFAULT_ITEMS, items || {});
    next.byteCoins = Math.max(0, Number(next.byteCoins || 0));
    next.boosts = Math.max(0, Number(next.boosts || 0));
    next.repairPulses = Math.max(0, Number(next.repairPulses || 0));
    return next;
  }
  function read() {
    try { return normalize(JSON.parse(localStorage.getItem(KEY_ITEMS))); }
    catch { return normalize(); }
  }
  function write(items) {
    const next = normalize(items);
    localStorage.setItem(KEY_ITEMS, JSON.stringify(next));
    return next;
  }
  function ensure() { return write(read()); }
  function count(id) { return Number(read()[id] || 0); }
  function has(id, amount) { return count(id) >= Number(amount || 1); }
  function spend(id, amount) {
    amount = Number(amount || 1);
    const items = read();
    if (Number(items[id] || 0) < amount) return { ok: false, items, spent: 0 };
    items[id] = Number(items[id] || 0) - amount;
    return { ok: true, items: write(items), spent: amount };
  }
  function add(id, amount) {
    amount = Number(amount || 1);
    const items = read();
    items[id] = Number(items[id] || 0) + amount;
    return write(items);
  }
  function set(id, amount) {
    const items = read();
    items[id] = Math.max(0, Number(amount || 0));
    return write(items);
  }
  function reset() { return write(DEFAULT_ITEMS); }

  window.DD_INVENTORY_RUNTIME = {
    version: "0.1.0",
    phase: "3.8-inventory-runtime-split",
    key: KEY_ITEMS,
    defaults: DEFAULT_ITEMS,
    read,
    write,
    ensure,
    count,
    has,
    spend,
    add,
    set,
    reset
  };
  ensure();
  document.dispatchEvent(new CustomEvent("dd:inventory-runtime-ready", { detail: window.DD_INVENTORY_RUNTIME }));
})();
