// assets/js/databyte-party-copy.js
(function () {
  const COLLECTION_KEY = "vl_databyte_discovery_collection_v2";
  const PARTY_KEY = "vl_databyte_active_party_v1";
  const MAX_SIZE = 3;

  function read(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function allSprites() {
    return read(COLLECTION_KEY);
  }

  function ids() {
    const valid = new Set(allSprites().map((item) => item.id));
    const stored = read(PARTY_KEY).filter((id) => valid.has(id)).slice(0, MAX_SIZE);
    write(PARTY_KEY, stored);
    return stored;
  }

  function members() {
    const list = allSprites();
    return ids().map((id) => list.find((item) => item.id === id)).filter(Boolean);
  }

  function add(id) {
    const list = ids();
    if (list.includes(id)) return;
    if (list.length >= MAX_SIZE) list.shift();
    list.push(id);
    write(PARTY_KEY, list);
    window.dispatchEvent(new CustomEvent("databyte:party-updated"));
    render();
  }

  function remove(id) {
    write(PARTY_KEY, ids().filter((item) => item !== id));
    window.dispatchEvent(new CustomEvent("databyte:party-updated"));
    render();
  }

  function host() {
    let panel = document.getElementById("partyCopyPanel");
    if (panel) return panel;
    const adminCard = document.getElementById("adminCard");
    if (!adminCard) return null;
    panel = document.createElement("div");
    panel.id = "partyCopyPanel";
    panel.className = "mt-4 bg-emerald-500/10 border border-emerald-300/30 rounded-2xl p-4 text-sm";
    adminCard.appendChild(panel);
    return panel;
  }

  function slot(sprite, index) {
    if (!sprite) return `<div class="bg-black/20 border border-dashed border-white/15 rounded-2xl p-3 text-gray-400 text-xs">Slot ${index + 1}: Empty</div>`;
    return `<div class="bg-black/25 border border-emerald-300/25 rounded-2xl p-3"><div class="flex justify-between gap-3"><div><strong>${sprite.name}</strong><p class="text-xs text-gray-300">HP ${sprite.hp ?? "?"} • ATK ${sprite.atk ?? "?"} • DEF ${sprite.def ?? "?"}</p></div><button type="button" data-party-remove="${sprite.id}" class="text-xs px-2 py-1 rounded-lg border border-red-300/30 text-red-200">Remove</button></div></div>`;
  }

  function choice(sprite) {
    const selected = ids().includes(sprite.id);
    return `<button type="button" data-party-add="${sprite.id}" class="text-left bg-black/20 border ${selected ? "border-emerald-300/40 opacity-60" : "border-white/10 hover:border-[#FFD700]/50"} rounded-xl p-3" ${selected ? "disabled" : ""}><div class="flex justify-between gap-2"><strong>${sprite.name}</strong><span>${sprite.icon || "◈"}</span></div><p class="text-[10px] text-gray-400">${sprite.byteCoin || "BC-????"} • HP ${sprite.hp ?? "?"} • ATK ${sprite.atk ?? "?"} • DEF ${sprite.def ?? "?"}</p></button>`;
  }

  function render() {
    const panel = host();
    if (!panel) return;
    const party = members();
    const inventory = allSprites();
    panel.innerHTML = `<div class="flex justify-between gap-3 items-start"><div><div class="text-emerald-200 font-bold">Active Party Copy</div><p class="text-xs text-gray-300 mt-1">Test copy. Choose up to 3 sprites.</p></div><div class="text-xs text-emerald-100">${party.length}/${MAX_SIZE}</div></div><div class="grid gap-2 mt-3">${Array.from({ length: MAX_SIZE }).map((_, index) => slot(party[index], index)).join("")}</div><details class="mt-3"><summary class="cursor-pointer text-xs text-[#FFD700] font-bold">Add Sprite From Inventory</summary><div class="grid gap-2 mt-2 max-h-56 overflow-auto pr-1">${inventory.length ? inventory.slice().reverse().map(choice).join("") : `<div class="text-gray-400 text-xs">Capture sprites to build a party.</div>`}</div></details>`;
    panel.querySelectorAll("[data-party-add]").forEach((button) => button.addEventListener("click", () => add(button.dataset.partyAdd)));
    panel.querySelectorAll("[data-party-remove]").forEach((button) => button.addEventListener("click", () => remove(button.dataset.partyRemove)));
  }

  function boot() {
    window.getActivePartySprites = members;
    window.getLeadPartySprite = function () { return members()[0] || allSprites().slice(-1)[0] || null; };
    render();
    window.addEventListener("databyte:inventory-updated", render);
    setInterval(render, 2500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
