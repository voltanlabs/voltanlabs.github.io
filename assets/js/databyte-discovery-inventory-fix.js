// assets/js/databyte-discovery-inventory-fix.js
// Fixes duplicate sprite inventory cards by opening Dex entries using each sprite's unique id.

(function () {
  const COLLECTION_KEY = "vl_databyte_discovery_collection_v2";
  const SPECIAL_NAMES = new Set(["Glitchwyrm", "Mirrormaster", "Proxsentience"]);

  function readCollection() {
    try { return JSON.parse(localStorage.getItem(COLLECTION_KEY)) || []; } catch { return []; }
  }

  function isSpecial(sprite) {
    return SPECIAL_NAMES.has(sprite?.name);
  }

  function fillDexModal(sprite) {
    if (!sprite) return;
    document.getElementById("modalDex").textContent = `#${sprite.dex || "???"} • ${sprite.rarity || ""}`;
    document.getElementById("modalName").textContent = sprite.name || "Unknown Sprite";
    document.getElementById("modalType").textContent = sprite.type || "Unknown";
    document.getElementById("modalIcon").textContent = sprite.icon || "◈";
    document.getElementById("modalLore").textContent = sprite.lore || "Codex data unavailable.";
    document.getElementById("modalHp").textContent = sprite.hp ?? "?";
    document.getElementById("modalAtk").textContent = sprite.atk ?? "?";
    document.getElementById("modalDef").textContent = sprite.def ?? "?";
    document.getElementById("dexModal").classList.remove("hidden");
  }

  function renderCollectionFixed() {
    const collectionList = document.getElementById("collectionList");
    if (!collectionList) return;

    const collection = readCollection();
    if (!collection.length) {
      collectionList.innerHTML = `<div class="text-gray-300 bg-black/20 rounded-2xl p-5 border border-white/10">No ByteCoins created yet.</div>`;
      return;
    }

    collectionList.innerHTML = "";

    collection.slice().reverse().forEach((sprite) => {
      const special = isSpecial(sprite);
      const card = document.createElement("article");
      card.className = special
        ? "text-left bg-purple-500/10 border border-purple-300/60 hover:border-purple-200 rounded-2xl p-4 transition shadow-[0_0_24px_rgba(192,132,252,.22)]"
        : "text-left bg-black/25 border border-white/10 hover:border-[#FFD700]/60 rounded-2xl p-4 transition";
      card.innerHTML = `
        <div class="flex justify-between gap-3">
          <div>
            <p class="text-[10px] uppercase tracking-[0.25em] ${special ? "text-purple-200" : "text-[#FFD700]"}">${sprite.byteCoin || "BC-????"} • #${sprite.dex || "???"} • ${sprite.rarity || "Unknown"}</p>
            <h3 class="text-xl font-bold text-white mt-1">${sprite.name || "Unknown Sprite"}</h3>
            <p class="text-sm text-gray-300">${sprite.type || "Unknown"}</p>
            ${special ? `<p class="inline-block mt-2 px-2 py-1 rounded-full bg-purple-300/15 border border-purple-200/40 text-purple-100 text-[10px] uppercase tracking-[0.2em]">Special Signal</p>` : ""}
            <p class="text-[10px] text-gray-500 mt-1">HP ${sprite.hp ?? "?"} • ATK ${sprite.atk ?? "?"} • DEF ${sprite.def ?? "?"}</p>
          </div>
          <div class="text-4xl">${sprite.icon || "◈"}</div>
        </div>
        <div class="grid grid-cols-2 gap-2 mt-4"></div>`;

      const actions = card.querySelector("div.grid");
      const dexButton = document.createElement("button");
      dexButton.type = "button";
      dexButton.className = "px-3 py-2 rounded-xl bg-emerald-400/15 border border-emerald-300/40 text-emerald-200 text-xs font-bold";
      dexButton.textContent = "View Dex";
      dexButton.addEventListener("click", () => fillDexModal(sprite));

      const decompileButton = document.createElement("button");
      decompileButton.type = "button";
      decompileButton.className = "px-3 py-2 rounded-xl bg-red-400/10 border border-red-300/40 text-red-200 text-xs font-bold";
      decompileButton.textContent = "Decompile";
      decompileButton.addEventListener("click", () => window.decompileSprite?.(sprite.id));

      actions.appendChild(dexButton);
      actions.appendChild(decompileButton);
      collectionList.appendChild(card);
    });
  }

  function bootInventoryFix() {
    window.renderCollection = renderCollectionFixed;
    window.openDexById = function (spriteId) {
      const sprite = readCollection().find((item) => item && item.id === spriteId);
      fillDexModal(sprite);
    };
    renderCollectionFixed();
    window.addEventListener("databyte:inventory-updated", renderCollectionFixed);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootInventoryFix);
  } else {
    bootInventoryFix();
  }
})();
