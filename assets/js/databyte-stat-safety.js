// assets/js/databyte-stat-safety.js
// Safety layer for Data Discovery stats.
// Prevents negative or invalid HP/ATK/DEF values from appearing in the scanner, Dex modal, saved ByteCoins, or visible Dex cards.
(function () {
  const COLLECTION_KEY = "vl_databyte_discovery_collection_v2";
  const MIN_STATS = { hp: 1, atk: 1, def: 1 };

  function clampNumber(value, min) {
    const num = Number(value);
    if (!Number.isFinite(num)) return min;
    return Math.max(min, Math.round(num));
  }

  function clampSprite(sprite) {
    if (!sprite || typeof sprite !== "object") return sprite;
    sprite.hp = clampNumber(sprite.hp, MIN_STATS.hp);
    sprite.atk = clampNumber(sprite.atk, MIN_STATS.atk);
    sprite.def = clampNumber(sprite.def, MIN_STATS.def);
    return sprite;
  }

  function readCollection() {
    try {
      const value = JSON.parse(localStorage.getItem(COLLECTION_KEY));
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  }

  function writeCollection(collection) {
    localStorage.setItem(COLLECTION_KEY, JSON.stringify(collection));
  }

  function sanitizeCollection() {
    const collection = readCollection();
    if (!collection.length) return;

    let changed = false;
    const safe = collection.map((sprite) => {
      const before = JSON.stringify({ hp: sprite?.hp, atk: sprite?.atk, def: sprite?.def });
      clampSprite(sprite);
      const after = JSON.stringify({ hp: sprite?.hp, atk: sprite?.atk, def: sprite?.def });
      if (before !== after) changed = true;
      return sprite;
    });

    if (changed) writeCollection(safe);
  }

  function setText(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const current = el.textContent.trim();
    if (current === "" || current === "?") return;
    el.textContent = String(clampNumber(current, 1));
  }

  function sanitizeVisibleStats() {
    setText("statHp");
    setText("statAtk");
    setText("statDef");
    setText("modalHp");
    setText("modalAtk");
    setText("modalDef");
  }

  function sanitizeInlineCardStats() {
    const targets = document.querySelectorAll("#collectionList p, #collectionList span, #collectionList div, #collectionList button, #databyteSimpleConsoleBody p, #databyteSimpleConsoleBody span, #databyteSimpleConsoleBody div");
    targets.forEach((el) => {
      if (!el || el.children.length) return;
      let text = el.textContent;
      if (!text || !/(HP|ATK|DEF)\s*:/i.test(text)) return;
      text = text.replace(/\b(HP|ATK|DEF)\s*:\s*(-?\d+)/gi, function (_, label, value) {
        return label.toUpperCase() + ": " + clampNumber(value, 1);
      });
      el.textContent = text;
    });
  }

  function run() {
    sanitizeCollection();
    sanitizeVisibleStats();
    sanitizeInlineCardStats();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();

  setInterval(run, 250);
})();