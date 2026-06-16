// assets/js/databyte-party-autofill.js
(function () {
  const COLLECTION_KEY = "vl_databyte_discovery_collection_v2";
  const PARTY_KEY = "vl_databyte_active_party_v1";
  const PRESTIGE_KEY = "vl_databyte_party_prestige_v1";
  const BASE_PARTY = 3;
  const MAX_PARTY = 5;
  const MAX_PRESTIGE = 2;
  let applying = false;

  function read(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value ?? fallback;
    } catch {
      return fallback;
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function stat(value, fallback = 1) {
    const num = Number(value);
    return Number.isFinite(num) ? Math.max(1, Math.round(num)) : fallback;
  }

  function normalize(sprite) {
    if (!sprite || typeof sprite !== "object") return null;
    return Object.assign({}, sprite, {
      hp: stat(sprite.hp),
      atk: stat(sprite.atk),
      def: stat(sprite.def)
    });
  }

  function collection() {
    return read(COLLECTION_KEY, []).map(normalize).filter((sprite) => sprite && sprite.id);
  }

  function prestige() {
    const value = Number(read(PRESTIGE_KEY, 0));
    if (!Number.isFinite(value)) return 0;
    return Math.max(0, Math.min(MAX_PRESTIGE, Math.floor(value)));
  }

  function cap() {
    return Math.min(MAX_PARTY, BASE_PARTY + prestige());
  }

  function autoFillParty() {
    const list = collection();
    const valid = new Set(list.map((sprite) => sprite.id));
    const current = read(PARTY_KEY, []).filter((id) => valid.has(id));
    const next = current.slice(0, cap());

    for (const sprite of list) {
      if (next.length >= cap()) break;
      if (!next.includes(sprite.id)) next.push(sprite.id);
    }

    if (JSON.stringify(next) !== JSON.stringify(read(PARTY_KEY, []))) {
      write(PARTY_KEY, next);
      return true;
    }
    return false;
  }

  function partySprites() {
    autoFillParty();
    const list = collection();
    const byId = new Map(list.map((sprite) => [sprite.id, sprite]));
    return read(PARTY_KEY, []).slice(0, cap()).map((id) => byId.get(id)).filter(Boolean).map(normalize);
  }

  function apply() {
    if (applying) return;
    applying = true;
    const changed = autoFillParty();

    window.getActivePartySprites = partySprites;
    window.getLeadPartySprite = function () {
      return partySprites()[0] || collection()[collection().length - 1] || null;
    };
    window.getDataBytePartyState = function () {
      return { party: partySprites(), cap: cap(), prestige: prestige(), maxCap: MAX_PARTY, autoFilled: true };
    };

    if (changed) {
      window.dispatchEvent(new CustomEvent("databyte:party-autofilled", {
        detail: { party: partySprites(), cap: cap(), prestige: prestige() }
      }));
      window.dispatchEvent(new CustomEvent("databyte:party-updated", {
        detail: { party: partySprites(), cap: cap(), prestige: prestige() }
      }));
    }
    applying = false;
  }

  function boot() {
    apply();
    window.addEventListener("databyte:inventory-updated", apply);
    window.addEventListener("storage", apply);
    setInterval(apply, 1800);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();