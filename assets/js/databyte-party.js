// assets/js/databyte-party.js
(function () {
  const COLLECTION_KEY = "vl_databyte_discovery_collection_v2";
  const PARTY_KEY = "vl_databyte_active_party_v1";
  const PRESTIGE_KEY = "vl_databyte_party_prestige_v1";
  const BASE_PARTY = 3;
  const MAX_PRESTIGE = 2;
  const MAX_PARTY = 5;
  const PRESTIGE_REQUIREMENTS = [5, 10];
  let lastSignature = "";

  function read(key, fallback = []) {
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

  function clampStat(value, min = 1) {
    const num = Number(value);
    if (!Number.isFinite(num)) return min;
    return Math.max(min, Math.round(num));
  }

  function normalizeSprite(sprite) {
    if (!sprite || typeof sprite !== "object") return sprite;
    sprite.hp = clampStat(sprite.hp);
    sprite.atk = clampStat(sprite.atk);
    sprite.def = clampStat(sprite.def);
    return sprite;
  }

  function collection() {
    return read(COLLECTION_KEY, []).map(normalizeSprite).filter(Boolean);
  }

  function prestigeLevel() {
    const level = Number(read(PRESTIGE_KEY, 0));
    if (!Number.isFinite(level)) return 0;
    return Math.max(0, Math.min(MAX_PRESTIGE, Math.floor(level)));
  }

  function partyCap() {
    return Math.min(MAX_PARTY, BASE_PARTY + prestigeLevel());
  }

  function validIds() {
    return new Set(collection().map((sprite) => sprite.id).filter(Boolean));
  }

  function partyIds() {
    const cap = partyCap();
    const valid = validIds();
    const stored = read(PARTY_KEY, []).filter((id) => valid.has(id)).slice(0, cap);
    if (JSON.stringify(stored) !== JSON.stringify(read(PARTY_KEY, []))) write(PARTY_KEY, stored);
    return stored;
  }

  function partySprites() {
    const list = collection();
    const byId = new Map(list.map((sprite) => [sprite.id, sprite]));
    return partyIds().map((id) => byId.get(id)).filter(Boolean).map(normalizeSprite);
  }

  function stateSignature() {
    return JSON.stringify({
      collection: collection().map((sprite) => [sprite.id, sprite.name, sprite.hp, sprite.atk, sprite.def, sprite.byteCoin]),
      party: partyIds(),
      prestige: prestigeLevel()
    });
  }

  function dispatch() {
    window.dispatchEvent(new CustomEvent("databyte:party-updated", {
      detail: { party: partySprites(), cap: partyCap(), prestige: prestigeLevel() }
    }));
  }

  function addToParty(id) {
    const ids = partyIds();
    if (ids.includes(id)) return;
    if (ids.length >= partyCap()) {
      flashMessage("Party full. Prestige upgrades unlock more slots.");
      return;
    }
    ids.push(id);
    write(PARTY_KEY, ids);
    dispatch();
    render({ keepDrawerOpen: true });
  }

  function removeFromParty(id) {
    write(PARTY_KEY, partyIds().filter((item) => item !== id));
    dispatch();
    render({ keepDrawerOpen: true });
  }

  function setLeader(id) {
    const ids = partyIds();
    if (!ids.includes(id)) return;
    write(PARTY_KEY, [id].concat(ids.filter((item) => item !== id)));
    dispatch();
    render({ keepDrawerOpen: true });
  }

  function canPrestige(nextLevel) {
    const required = PRESTIGE_REQUIREMENTS[nextLevel - 1] || Infinity;
    return collection().length >= required;
  }

  function upgradePrestige() {
    const current = prestigeLevel();
    const next = current + 1;
    if (next > MAX_PRESTIGE) return;
    if (!canPrestige(next)) {
      flashMessage(`Prestige ${next} requires ${PRESTIGE_REQUIREMENTS[next - 1]} captured ByteCoins.`);
      return;
    }
    write(PRESTIGE_KEY, next);
    dispatch();
    render({ keepDrawerOpen: true });
  }

  function ensurePanel() {
    let panel = document.getElementById("activePartyPanel");
    if (panel) return panel;

    const aside = document.querySelector("#gamePanel aside");
    const adminSection = document.getElementById("adminCard")?.closest("section");
    if (!aside || !adminSection) return null;

    panel = document.createElement("section");
    panel.id = "activePartyPanel";
    panel.className = "bg-[#2C3E50] rounded-3xl border border-emerald-300/30 shadow-2xl overflow-hidden";
    adminSection.insertAdjacentElement("afterend", panel);
    return panel;
  }

  function flashMessage(message) {
    const el = document.getElementById("partyMessage");
    if (!el) return;
    el.textContent = message;
    el.classList.remove("hidden");
    clearTimeout(flashMessage.timer);
    flashMessage.timer = setTimeout(() => el.classList.add("hidden"), 2600);
  }

  function partyCard(sprite, index) {
    const cap = partyCap();
    const locked = index >= cap;
    const prestigeNeeded = index === 3 ? 1 : index === 4 ? 2 : 0;

    if (locked) {
      return `<div class="bg-black/20 border border-dashed border-sky-200/20 rounded-2xl p-3 text-gray-500 text-xs">
        <div class="font-bold text-sky-200/70">Slot ${index + 1}: Locked</div>
        <div>Prestige ${prestigeNeeded} required</div>
      </div>`;
    }

    if (!sprite) {
      return `<div class="bg-black/20 border border-dashed border-white/15 rounded-2xl p-3 text-gray-400 text-xs">
        <div class="font-bold">Slot ${index + 1}: Empty</div>
        <div>Add a captured ByteCoin below.</div>
      </div>`;
    }

    return `<div class="bg-black/25 border ${index === 0 ? "border-[#FFD700]/55" : "border-emerald-300/25"} rounded-2xl p-3">
      <div class="flex justify-between gap-3">
        <div>
          <div class="flex items-center gap-2"><strong>${sprite.icon || "◈"} ${sprite.name}</strong>${index === 0 ? `<span class="text-[9px] px-2 py-0.5 rounded-full bg-[#FFD700]/15 border border-[#FFD700]/35 text-[#FFD700] uppercase tracking-[0.16em]">Lead</span>` : ""}</div>
          <p class="text-xs text-gray-300 mt-1">HP ${sprite.hp ?? "?"} • ATK ${sprite.atk ?? "?"} • DEF ${sprite.def ?? "?"}</p>
          <p class="text-[10px] text-gray-500">${sprite.byteCoin || "BC-????"} • #${sprite.dex || "???"} • ${sprite.rarity || "Unknown"}</p>
        </div>
        <div class="grid gap-1 content-start">
          ${index !== 0 ? `<button type="button" data-party-leader="${sprite.id}" class="text-[10px] px-2 py-1 rounded-lg border border-[#FFD700]/35 text-[#FFD700]">Lead</button>` : ""}
          <button type="button" data-party-remove="${sprite.id}" class="text-[10px] px-2 py-1 rounded-lg border border-red-300/30 text-red-200">Remove</button>
        </div>
      </div>
    </div>`;
  }

  function candidateCard(sprite) {
    const ids = partyIds();
    const inParty = ids.includes(sprite.id);
    const full = ids.length >= partyCap();
    const disabled = inParty || full;
    return `<button type="button" data-party-add="${sprite.id}" class="text-left bg-black/20 border ${inParty ? "border-emerald-300/40" : "border-white/10"} rounded-xl p-3 ${disabled ? "opacity-60" : "hover:border-[#FFD700]/50"}" ${disabled ? "disabled" : ""}>
      <div class="flex justify-between gap-2"><strong>${sprite.name}</strong><span>${sprite.icon || "◈"}</span></div>
      <p class="text-[10px] text-gray-400">${sprite.byteCoin || "BC-????"} • HP ${sprite.hp ?? "?"} • ATK ${sprite.atk ?? "?"} • DEF ${sprite.def ?? "?"}</p>
      <p class="text-[10px] ${inParty ? "text-emerald-200" : full ? "text-gray-500" : "text-[#FFD700]"}">${inParty ? "In Party" : full ? "Party Full" : "Add to Party"}</p>
    </button>`;
  }

  function prestigeBlock() {
    const level = prestigeLevel();
    const next = level + 1;
    if (level >= MAX_PRESTIGE) {
      return `<div class="mt-3 rounded-xl border border-[#FFD700]/35 bg-[#FFD700]/10 p-3 text-xs text-[#FFD700] font-bold">Party Prestige II active. Max party size unlocked: 5.</div>`;
    }
    const required = PRESTIGE_REQUIREMENTS[next - 1];
    const ready = canPrestige(next);
    return `<div class="mt-3 rounded-xl border border-sky-200/20 bg-sky-400/10 p-3 text-xs">
      <div class="flex justify-between gap-3 items-center">
        <div><strong class="text-sky-200">Prestige ${next}</strong><p class="text-gray-300 mt-1">Unlock party slot ${BASE_PARTY + next}. Requires ${required} captured ByteCoins.</p></div>
        <button type="button" id="partyPrestigeBtn" class="px-3 py-2 rounded-lg ${ready ? "bg-[#FFD700] text-[#1A1A1A]" : "border border-white/20 text-gray-500"} font-bold" ${ready ? "" : "disabled"}>Unlock</button>
      </div>
    </div>`;
  }

  function render(options = {}) {
    const panel = ensurePanel();
    if (!panel) return;

    const drawerWasOpen = options.keepDrawerOpen || !!panel.querySelector("#partyAddDrawer[open]");
    const scrollBox = panel.querySelector("#partyCandidateList");
    const savedScroll = scrollBox ? scrollBox.scrollTop : 0;
    const currentParty = partySprites();
    const list = collection();
    const cap = partyCap();
    const prestige = prestigeLevel();

    panel.innerHTML = `<div class="p-5 border-b border-white/10 flex items-center justify-between gap-3">
      <div><h2 class="text-2xl font-bold text-[#FFD700]">Party</h2><p class="text-sm text-gray-300">Build the team your battle system will use.</p></div>
      <div class="text-xs text-emerald-100">${currentParty.length}/${cap}</div>
    </div>
    <div class="p-5">
      <div class="text-[10px] text-gray-400">Base cap 3 • Prestige ${prestige}/${MAX_PRESTIGE} • Max cap 5</div>
      <p id="partyMessage" class="hidden mt-3 rounded-xl border border-[#FFD700]/30 bg-[#FFD700]/10 p-2 text-xs text-[#FFD700]"></p>
      <div class="grid gap-2 mt-3">
        ${Array.from({ length: MAX_PARTY }).map((_, index) => partyCard(currentParty[index], index)).join("")}
      </div>
      ${prestigeBlock()}
      <details id="partyAddDrawer" class="mt-3" ${drawerWasOpen ? "open" : ""}>
        <summary class="cursor-pointer text-xs text-[#FFD700] font-bold">Add Sprite From ByteCoins</summary>
        <div id="partyCandidateList" class="grid gap-2 mt-2 max-h-56 overflow-auto pr-1">
          ${list.length ? list.slice().reverse().map(candidateCard).join("") : `<div class="text-gray-400 text-xs">Capture sprites to build a party.</div>`}
        </div>
      </details>
    </div>`;

    const nextScrollBox = panel.querySelector("#partyCandidateList");
    if (nextScrollBox) nextScrollBox.scrollTop = savedScroll;

    panel.querySelectorAll("[data-party-add]").forEach((button) => {
      button.addEventListener("click", () => addToParty(button.dataset.partyAdd));
    });
    panel.querySelectorAll("[data-party-remove]").forEach((button) => {
      button.addEventListener("click", () => removeFromParty(button.dataset.partyRemove));
    });
    panel.querySelectorAll("[data-party-leader]").forEach((button) => {
      button.addEventListener("click", () => setLeader(button.dataset.partyLeader));
    });
    const prestigeBtn = document.getElementById("partyPrestigeBtn");
    if (prestigeBtn) prestigeBtn.addEventListener("click", upgradePrestige);

    lastSignature = stateSignature();
  }

  function maybeRender() {
    const signature = stateSignature();
    if (signature !== lastSignature || !document.getElementById("activePartyPanel")) render();
  }

  function boot() {
    const oldNestedPanel = document.querySelector("#adminCard #activePartyPanel");
    if (oldNestedPanel) oldNestedPanel.remove();

    window.getActivePartySprites = partySprites;
    window.getLeadPartySprite = function () {
      return partySprites()[0] || collection()[collection().length - 1] || null;
    };
    window.getDataBytePartyState = function () {
      return { party: partySprites(), cap: partyCap(), prestige: prestigeLevel(), maxCap: MAX_PARTY };
    };
    render();
    window.addEventListener("databyte:inventory-updated", () => render({ keepDrawerOpen: true }));
    window.addEventListener("databyte:party-updated", () => render({ keepDrawerOpen: true }));
    setInterval(maybeRender, 2500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();