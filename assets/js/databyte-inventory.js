// assets/js/databyte-inventory.js
(function () {
  const COLLECTION_KEY = "vl_databyte_discovery_collection_v2";
  const SPECIAL_KEY = "vl_databyte_special_signals_v1";
  const DECOMPILE_KEY = "vl_databyte_decompiled_v1";
  const SPECIAL_NAMES = new Set(["Glitchwyrm", "Mirrormaster", "Proxsentience"]);
  let activeTab = "sprites";

  function read(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
  }

  function panel() {
    let el = document.getElementById("trueInventoryPanel");
    if (el) return el;
    const collectionList = document.getElementById("collectionList");
    const host = collectionList?.parentElement;
    if (!host) return null;
    el = document.createElement("section");
    el.id = "trueInventoryPanel";
    el.className = "mt-4 bg-black/20 border border-sky-300/20 rounded-3xl p-4";
    host.appendChild(el);
    return el;
  }

  function tabButton(id, label, count) {
    const active = activeTab === id;
    return `<button type="button" data-inventory-tab="${id}" class="px-3 py-2 rounded-xl text-xs font-bold border ${active ? "bg-[#FFD700] text-[#1A1A1A] border-[#FFD700]" : "bg-black/20 text-gray-200 border-white/10"}">${label} ${count}</button>`;
  }

  function spriteRows(list) {
    if (!list.length) return `<div class="text-gray-400 text-sm bg-black/20 border border-white/10 rounded-2xl p-4">No records in this inventory tab yet.</div>`;
    return list.slice().reverse().map((sprite) => {
      const special = SPECIAL_NAMES.has(sprite.name);
      return `
        <div class="bg-black/25 border ${special ? "border-purple-300/50" : "border-white/10"} rounded-2xl p-3">
          <div class="flex justify-between gap-3">
            <div>
              <p class="text-[10px] uppercase tracking-[0.2em] ${special ? "text-purple-200" : "text-[#FFD700]"}">${sprite.byteCoin || "DATA"} • #${sprite.dex || "???"} • ${sprite.rarity || "Unknown"}</p>
              <strong class="text-white">${sprite.name || "Unknown"}</strong>
              <p class="text-xs text-gray-300">${sprite.type || "Unknown"}</p>
              <p class="text-[10px] text-gray-500 mt-1">HP ${sprite.hp ?? "?"} • ATK ${sprite.atk ?? "?"} • DEF ${sprite.def ?? "?"}</p>
            </div>
            <div class="text-3xl">${sprite.icon || "◈"}</div>
          </div>
        </div>`;
    }).join("");
  }

  function specialRows() {
    const collection = read(COLLECTION_KEY).filter((sprite) => SPECIAL_NAMES.has(sprite.name));
    const signalLog = read(SPECIAL_KEY);
    if (!collection.length && !signalLog.length) return `<div class="text-gray-400 text-sm bg-black/20 border border-white/10 rounded-2xl p-4">No Special Signals logged yet.</div>`;
    return `
      ${collection.length ? `<div class="text-purple-200 text-xs font-bold mb-2">Captured Special Signals</div>${spriteRows(collection)}` : ""}
      ${signalLog.length ? `<div class="text-purple-200 text-xs font-bold mt-3 mb-2">Signal Log</div>${signalLog.slice().reverse().map((item) => `<div class="bg-purple-500/10 border border-purple-300/30 rounded-2xl p-3 text-sm"><strong>${item.name}</strong><p class="text-xs text-gray-400">${item.type || "Special Signal"}</p></div>`).join("")}` : ""}`;
  }

  function decomposedRows() {
    const list = read(DECOMPILE_KEY);
    if (!list.length) return `<div class="text-gray-400 text-sm bg-black/20 border border-white/10 rounded-2xl p-4">No sprites have been decompiled yet.</div>`;
    return list.slice().reverse().map((sprite) => `
      <div class="bg-red-500/10 border border-red-300/20 rounded-2xl p-3 text-sm">
        <div class="flex justify-between gap-3"><strong>${sprite.name || "Unknown"}</strong><span class="text-red-200 text-xs">Decompiled</span></div>
        <p class="text-xs text-gray-400">#${sprite.dex || "???"} • ${sprite.rarity || "Unknown"}</p>
      </div>`).join("");
  }

  function body() {
    if (activeTab === "special") return specialRows();
    if (activeTab === "decompiled") return decomposedRows();
    return spriteRows(read(COLLECTION_KEY));
  }

  function render() {
    const el = panel();
    if (!el) return;
    const collection = read(COLLECTION_KEY);
    const specialCount = collection.filter((sprite) => SPECIAL_NAMES.has(sprite.name)).length;
    const decomposedCount = read(DECOMPILE_KEY).length;
    el.innerHTML = `
      <div class="flex items-start justify-between gap-3 mb-3">
        <div><h3 class="text-xl font-bold text-[#FFD700]">Inventory</h3><p class="text-xs text-gray-400">Organized storage for sprites and signal records.</p></div>
      </div>
      <div class="flex flex-wrap gap-2 mb-3">
        ${tabButton("sprites", "Sprites", collection.length)}
        ${tabButton("special", "Special", specialCount)}
        ${tabButton("decompiled", "Decompiled", decomposedCount)}
      </div>
      <div class="grid gap-2 max-h-[420px] overflow-auto pr-1">${body()}</div>`;

    el.querySelectorAll("[data-inventory-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        activeTab = button.dataset.inventoryTab;
        render();
      });
    });
  }

  function boot() {
    render();
    window.addEventListener("databyte:inventory-updated", render);
    setInterval(render, 1600);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
