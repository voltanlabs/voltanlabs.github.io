// assets/js/databyte-discovery-decompile.js
// Adds inventory Decompile action for captured DataByteSprites.
// Decompile removes a sprite from current inventory but records it as historical progress.

(function () {
  const COLLECTION_KEY = "vl_databyte_discovery_collection_v2";
  const SEEN_KEY = "vl_databyte_seen_v1";
  const DECOMPILE_KEY = "vl_databyte_decompiled_v1";

  function read(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function ensureSeen(sprite) {
    const seen = read(SEEN_KEY);
    const exists = seen.some((item) => (typeof item === "string" ? item : item.name) === sprite.name);
    if (!exists) {
      seen.push({ name: sprite.name, dex: sprite.dex, status: "Seen", seenAt: new Date().toISOString() });
      write(SEEN_KEY, seen);
    }
  }

  function decompileSprite(spriteId) {
    const collection = read(COLLECTION_KEY);
    const index = collection.findIndex((sprite) => sprite && sprite.id === spriteId);
    if (index < 0) return;

    const sprite = collection[index];
    const confirmed = confirm(`Decompile ${sprite.name}?\n\nThis returns the sprite to the Signal Network. It will leave your current inventory, but your Discovery Journal and evolution progress stay intact.`);
    if (!confirmed) return;

    const decompiled = read(DECOMPILE_KEY);
    decompiled.push({
      id: sprite.id,
      byteCoin: sprite.byteCoin || null,
      name: sprite.name,
      dex: sprite.dex || "???",
      rarity: sprite.rarity || "Unknown",
      decompiledAt: new Date().toISOString()
    });

    collection.splice(index, 1);
    write(COLLECTION_KEY, collection);
    write(DECOMPILE_KEY, decompiled);
    ensureSeen(sprite);

    window.renderCollection?.();
    window.dispatchEvent(new CustomEvent("databyte:inventory-updated", { detail: { action: "decompile", sprite } }));
    alert(`${sprite.name} has been decompiled and returned to the Signal Network.`);
  }

  function renderCollectionWithDecompile() {
    const collectionList = document.getElementById("collectionList");
    if (!collectionList) return;

    const collection = read(COLLECTION_KEY);
    if (!collection.length) {
      collectionList.innerHTML = `<div class="text-gray-300 bg-black/20 rounded-2xl p-5 border border-white/10">No ByteCoins created yet.</div>`;
      return;
    }

    collectionList.innerHTML = collection.slice().reverse().map((sprite) => {
      const safeName = String(sprite.name || "Unknown").replace(/'/g, "");
      return `
        <article class="text-left bg-black/25 border border-white/10 hover:border-[#FFD700]/60 rounded-2xl p-4 transition">
          <div class="flex justify-between gap-3">
            <div>
              <p class="text-[10px] uppercase tracking-[0.25em] text-[#FFD700]">${sprite.byteCoin || "BC-????"} • #${sprite.dex || "???"} • ${sprite.rarity}</p>
              <h3 class="text-xl font-bold text-white mt-1">${sprite.name}</h3>
              <p class="text-sm text-gray-300">${sprite.type}</p>
            </div>
            <div class="text-4xl">${sprite.icon}</div>
          </div>
          <div class="grid grid-cols-2 gap-2 mt-4">
            <button type="button" onclick="openDex('${safeName}')" class="px-3 py-2 rounded-xl bg-emerald-400/15 border border-emerald-300/40 text-emerald-200 text-xs font-bold">View Dex</button>
            <button type="button" onclick="decompileSprite('${sprite.id}')" class="px-3 py-2 rounded-xl bg-red-400/10 border border-red-300/40 text-red-200 text-xs font-bold">Decompile</button>
          </div>
        </article>`;
    }).join("");
  }

  function renderDecompileStats() {
    const adminCard = document.getElementById("adminCard");
    if (!adminCard) return;

    let stat = document.getElementById("decompileStatPanel");
    if (!stat) {
      stat = document.createElement("div");
      stat.id = "decompileStatPanel";
      stat.className = "mt-4 bg-black/25 border border-red-300/20 rounded-2xl p-4 text-sm";
      adminCard.appendChild(stat);
    }

    const count = read(DECOMPILE_KEY).length;
    stat.innerHTML = `<div class="text-red-200 font-bold">Signal Management</div><p class="text-gray-300 mt-1">Sprites Decompiled: <strong>${count}</strong></p>`;
  }

  function bootDecompile() {
    window.decompileSprite = decompileSprite;
    window.renderCollection = renderCollectionWithDecompile;
    renderCollectionWithDecompile();
    renderDecompileStats();
    setInterval(() => {
      renderDecompileStats();
    }, 1200);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootDecompile);
  } else {
    bootDecompile();
  }
})();
