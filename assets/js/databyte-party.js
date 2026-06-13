// assets/js/databyte-party.js
(function () {
  const COLLECTION_KEY = "vl_databyte_discovery_collection_v2";
  const PARTY_KEY = "vl_databyte_active_party_v1";
  const MAX_PARTY = 3;

  function read(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function collection() {
    return read(COLLECTION_KEY);
  }

  function partyIds() {
    const validIds = new Set(collection().map((sprite) => sprite.id));
    const stored = read(PARTY_KEY).filter((id) => validIds.has(id)).slice(0, MAX_PARTY);
    if (stored.length !== read(PARTY_KEY).length) write(PARTY_KEY, stored);
    return stored;
  }

  function partySprites() {
    const ids = partyIds();
    return ids.map((id) => collection().find((sprite) => sprite.id === id)).filter(Boolean);
  }

  function addToParty(id) {
    const ids = partyIds();
    if (ids.includes(id)) return;
    if (ids.length >= MAX_PARTY) ids.shift();
    ids.push(id);
    write(PARTY_KEY, ids);
    window.dispatchEvent(new CustomEvent("databyte:party-updated"));
    render();
  }

  function removeFromParty(id) {
    write(PARTY_KEY, partyIds().filter((item) => item !== id));
    window.dispatchEvent(new CustomEvent("databyte:party-updated"));
    render();
  }

  function ensurePanel() {
    let panel = document.getElementById("activePartyPanel");
    if (panel) return panel;
    const adminCard = document.getElementById("adminCard");
    if (!adminCard) return null;
    panel = document.createElement("div");
    panel.id = "activePartyPanel";
    panel.className = "mt-4 bg-emerald-500/10 border border-emerald-300/30 rounded-2xl p-4 text-sm";
    adminCard.appendChild(panel);
    return panel;
  }

  function partyCard(sprite, index) {
    if (!sprite) {
      return `<div class="bg-black/20 border border-dashed border-white/15 rounded-2xl p-3 text-gray-400 text-xs">Slot ${index + 1}: Empty</div>`;
    }
    return `
      <div class="bg-black/25 border border-emerald-300/25 rounded-2xl p-3">
        <div class="flex justify-between gap-3">
          <div><strong>${sprite.name}</strong><p class="text-xs text-gray-300">HP ${sprite.hp ?? "?"} • ATK ${sprite.atk ?? "?"} • DEF ${sprite.def ?? "?"}</p></div>
          <button type="button" data-party-remove="${sprite.id}" class="text-xs px-2 py-1 rounded-lg border border-red-300/30 text-red-200">Remove</button>
        </div>
      </div>`;
  }

  function candidateCard(sprite) {
    const inParty = partyIds().includes(sprite.id);
    return `
      <button type="button" data-party-add="${sprite.id}" class="text-left bg-black/20 border ${inParty ? "border-emerald-300/40" : "border-white/10"} rounded-xl p-3 ${inParty ? "opacity-60" : "hover:border-[#FFD700]/50"}" ${inParty ? "disabled" : ""}>
        <div class="flex justify-between gap-2"><strong>${sprite.name}</strong><span>${sprite.icon || "◈"}</span></div>
        <p class="text-[10px] text-gray-400">${sprite.byteCoin || "BC-????"} • HP ${sprite.hp ?? "?"} • ATK ${sprite.atk ?? "?"} • DEF ${sprite.def ?? "?"}</p>
      </button>`;
  }

  function render() {
    const panel = ensurePanel();
    if (!panel) return;
    const currentParty = partySprites();
    const list = collection();
    panel.innerHTML = `
      <div class="flex justify-between gap-3 items-start">
        <div><div class="text-emerald-200 font-bold">Active Party</div><p class="text-xs text-gray-300 mt-1">Choose up to 3 sprites for signal battles.</p></div>
        <div class="text-xs text-emerald-100">${currentParty.length}/${MAX_PARTY}</div>
      </div>
      <div class="grid gap-2 mt-3">
        ${Array.from({ length: MAX_PARTY }).map((_, index) => partyCard(currentParty[index], index)).join("")}
      </div>
      <details class="mt-3">
        <summary class="cursor-pointer text-xs text-[#FFD700] font-bold">Add Sprite From Inventory</summary>
        <div class="grid gap-2 mt-2 max-h-56 overflow-auto pr-1">
          ${list.length ? list.slice().reverse().map(candidateCard).join("") : `<div class="text-gray-400 text-xs">Capture sprites to build a party.</div>`}
        </div>
      </details>`;

    panel.querySelectorAll("[data-party-add]").forEach((button) => {
      button.addEventListener("click", () => addToParty(button.dataset.partyAdd));
    });
    panel.querySelectorAll("[data-party-remove]").forEach((button) => {
      button.addEventListener("click", () => removeFromParty(button.dataset.partyRemove));
    });
  }

  function boot() {
    window.getActivePartySprites = partySprites;
    window.getLeadPartySprite = function () {
      return partySprites()[0] || collection()[collection().length - 1] || null;
    };
    render();
    window.addEventListener("databyte:inventory-updated", render);
    setInterval(render, 2500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
