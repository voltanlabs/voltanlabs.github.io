// assets/js/databyte-missions.js
(function () {
  const COLLECTION_KEY = "vl_databyte_discovery_collection_v2";
  const SEEN_KEY = "vl_databyte_seen_v1";
  const SPECIAL_KEY = "vl_databyte_special_signals_v1";
  const DECOMPILE_KEY = "vl_databyte_decompiled_v1";
  let lastSignature = "";

  function read(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
  }

  function uniqueSeenCount() {
    return new Set(read(SEEN_KEY).map((x) => typeof x === "string" ? x : x.name)).size;
  }

  function countByType(term) {
    return read(COLLECTION_KEY).filter((sprite) => String(sprite.type || "").includes(term)).length;
  }

  function missions() {
    const collection = read(COLLECTION_KEY);
    const specials = read(SPECIAL_KEY);
    const decompiled = read(DECOMPILE_KEY);
    return [
      { title: "Build Your First Squad", desc: "Capture 3 total sprites.", progress: collection.length, target: 3 },
      { title: "Dex Scout", desc: "Discover 10 unique sprites.", progress: uniqueSeenCount(), target: 10 },
      { title: "Mystic Signal Study", desc: "Hold 3 Mystic-type sprites.", progress: countByType("Mystic"), target: 3 },
      { title: "Special Signal Logged", desc: "Detect your first Special Signal.", progress: specials.length, target: 1 },
      { title: "Signal Management", desc: "Decompile 1 duplicate sprite.", progress: decompiled.length, target: 1 }
    ];
  }

  function signature() {
    return JSON.stringify({
      collection: read(COLLECTION_KEY).length,
      seen: uniqueSeenCount(),
      specials: read(SPECIAL_KEY).length,
      decompiled: read(DECOMPILE_KEY).length,
      mystic: countByType("Mystic")
    });
  }

  function bar(value, target) {
    const full = Math.min(target, value);
    return "█".repeat(full) + "░".repeat(Math.max(0, target - full));
  }

  function makePanel() {
    const adminCard = document.getElementById("adminCard");
    if (!adminCard || document.getElementById("scannerMissionsPanel")) return;
    const panel = document.createElement("div");
    panel.id = "scannerMissionsPanel";
    panel.className = "mt-4 bg-sky-500/10 border border-sky-300/30 rounded-2xl p-4 text-sm";
    adminCard.appendChild(panel);
  }

  function render(force = false) {
    makePanel();
    const panel = document.getElementById("scannerMissionsPanel");
    if (!panel) return;

    const nextSignature = signature();
    if (!force && nextSignature === lastSignature && panel.dataset.rendered === "true") return;
    lastSignature = nextSignature;
    panel.dataset.rendered = "true";

    const oldScroll = document.getElementById("scannerMissionsList")?.scrollTop || 0;
    const list = missions();
    const done = list.filter((m) => m.progress >= m.target).length;
    panel.innerHTML = `
      <div class="text-sky-200 font-bold">Scanner Missions</div>
      <div class="mt-2 text-xs text-sky-100">Completed: <strong>${done}/${list.length}</strong></div>
      <div id="scannerMissionsList" class="mt-3 grid gap-2 max-h-72 overflow-auto pr-1">
        ${list.map((m) => `
          <div class="bg-black/20 border ${m.progress >= m.target ? "border-emerald-300/30" : "border-white/10"} rounded-xl p-3">
            <div class="flex justify-between gap-3"><strong>${m.title}</strong><span class="${m.progress >= m.target ? "text-emerald-200" : "text-[#FFD700]"} text-xs">${Math.min(m.progress, m.target)}/${m.target}</span></div>
            <p class="text-gray-300 text-xs mt-1">${m.desc}</p>
            <div class="text-[#FFD700] tracking-widest mt-2 text-xs">${bar(m.progress, m.target)}</div>
          </div>`).join("")}
      </div>`;

    const newScrollTarget = document.getElementById("scannerMissionsList");
    if (newScrollTarget) newScrollTarget.scrollTop = oldScroll;
  }

  function scheduleRender() {
    requestAnimationFrame(() => render());
  }

  function boot() {
    render(true);
    window.addEventListener("databyte:inventory-updated", scheduleRender);
    window.addEventListener("databyte:party-updated", scheduleRender);
    window.addEventListener("databyte:progress-updated", scheduleRender);
    window.addEventListener("storage", scheduleRender);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();