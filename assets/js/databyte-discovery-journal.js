// assets/js/databyte-discovery-journal.js
// Lightweight enhancement layer for Data Discovery.
// Tracks journal stats from localStorage and adds upgrade/evolution tree views without touching the core scanner loop.

(function () {
  const COLLECTION_KEY = "vl_databyte_discovery_collection_v2";
  const SEEN_KEY = "vl_databyte_seen_v1";
  const JOURNAL_KEY = "vl_databyte_discovery_journal_v1";
  const EVENT_KEY = "vl_databyte_discovery_journal_event_log_v1";

  const upgradeTrees = [
    ["Leovolt", "Leothor", "Leozues"],
    ["Crabician", "Crabizard", "Crabzaster"],
    ["Scorpyone", "Scorpytwo", "Scorpyus"],
    ["SeismaGoat", "GigantaGoat", "TitantaGoat"],
    ["SwimPig", "DiveSwine", "PorkFloat"],
    ["Crowupt", "Crowuption", "Crowtastrophe"],
    ["DoughDawg", "MoneyMutt", "HundredHound"],
    ["Primateicore", "Primateican", "Primateicon"],
    ["Clockadile", "Aligatorithm", "Technogatorus"],
    ["Financialfish", "LoanShark", "AFKWHALE"],
    ["Landline", "Octocable", "Fiberoptopus"],
    ["Technoblin", "Technomoly", "Technareality"],
    ["Screensavior", "Monitorman"],
    ["Displaydevil", "Mirrormaster"],
    ["Proxentity", "Proxsentience"]
  ];

  function read(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function now() {
    return new Date().toISOString();
  }

  function findTree(name) {
    return upgradeTrees.find((tree) => tree.includes(name)) || [name];
  }

  function capturedSet() {
    return new Set(read(COLLECTION_KEY).map((sprite) => sprite.name));
  }

  function seenSet() {
    return new Set(read(SEEN_KEY).map((sprite) => typeof sprite === "string" ? sprite : sprite.name));
  }

  function getJournal() {
    const journal = read(JOURNAL_KEY);
    return Array.isArray(journal) ? journal : [];
  }

  function saveJournal(journal) {
    write(JOURNAL_KEY, journal);
  }

  function upsertJournalEvent(sprite, status) {
    if (!sprite || !sprite.name) return;

    const journal = getJournal();
    let record = journal.find((item) => item.name === sprite.name);
    const stamp = sprite.seenAt || sprite.discoveredAt || now();

    if (!record) {
      record = {
        name: sprite.name,
        dex: sprite.dex || "???",
        firstSeen: stamp,
        lastSeen: stamp,
        timesSeen: 0,
        timesCaptured: 0,
        timesEscaped: 0,
        lastStatus: status || "Seen"
      };
      journal.push(record);
    }

    record.dex = sprite.dex || record.dex || "???";
    record.lastSeen = stamp;
    record.lastStatus = status || record.lastStatus || "Seen";

    if (status === "Captured") record.timesCaptured += 1;
    else if (status === "Escaped") record.timesEscaped += 1;
    else record.timesSeen += 1;

    saveJournal(journal);
  }

  function syncEvents() {
    const eventLog = new Set(read(EVENT_KEY));

    read(SEEN_KEY).forEach((sprite) => {
      const item = typeof sprite === "string" ? { name: sprite, status: "Seen", seenAt: now() } : sprite;
      const signature = `seen:${item.name}:${item.status || "Seen"}:${item.seenAt || "legacy"}`;
      if (!eventLog.has(signature)) {
        upsertJournalEvent(item, item.status || "Seen");
        eventLog.add(signature);
      }
    });

    read(COLLECTION_KEY).forEach((sprite) => {
      const signature = `captured:${sprite.id || sprite.byteCoin || sprite.name}`;
      if (!eventLog.has(signature)) {
        upsertJournalEvent(sprite, "Captured");
        eventLog.add(signature);
      }
    });

    write(EVENT_KEY, Array.from(eventLog).slice(-500));
  }

  function formatDate(value) {
    if (!value) return "—";
    try { return new Date(value).toLocaleDateString(); } catch { return "—"; }
  }

  function treeHtml(name) {
    const seen = seenSet();
    const captured = capturedSet();
    const tree = findTree(name);

    return `
      <div class="mt-5 bg-black/25 border border-white/10 rounded-2xl p-4">
        <h3 class="text-[#FFD700] font-bold mb-3">Upgrade Tree</h3>
        <div class="grid gap-2">
          ${tree.map((node, index) => `
            <div class="flex items-center justify-between gap-3 rounded-xl px-3 py-2 ${node === name ? "bg-[#FFD700]/15 border border-[#FFD700]/40" : "bg-black/20"}">
              <span>${index > 0 ? "↳ " : ""}${node}</span>
              <span class="text-xs ${captured.has(node) ? "text-[#FFD700]" : seen.has(node) ? "text-emerald-200" : "text-gray-500"}">${captured.has(node) ? "Captured" : seen.has(node) ? "Seen" : "Unknown"}</span>
            </div>
          `).join("")}
        </div>
      </div>`;
  }

  function journalHtml(name) {
    const record = getJournal().find((item) => item.name === name);
    if (!record) {
      return `
        <div class="mt-5 bg-black/25 border border-white/10 rounded-2xl p-4">
          <h3 class="text-[#FFD700] font-bold mb-3">Discovery Journal</h3>
          <p class="text-sm text-gray-300">No journal events recorded yet for this sprite.</p>
        </div>`;
    }

    return `
      <div class="mt-5 bg-black/25 border border-white/10 rounded-2xl p-4">
        <h3 class="text-[#FFD700] font-bold mb-3">Discovery Journal</h3>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="bg-black/25 rounded-xl p-3"><span class="text-gray-400">First Seen</span><br><strong>${formatDate(record.firstSeen)}</strong></div>
          <div class="bg-black/25 rounded-xl p-3"><span class="text-gray-400">Last Seen</span><br><strong>${formatDate(record.lastSeen)}</strong></div>
          <div class="bg-black/25 rounded-xl p-3"><span class="text-gray-400">Seen Events</span><br><strong>${record.timesSeen || 0}</strong></div>
          <div class="bg-black/25 rounded-xl p-3"><span class="text-gray-400">Captured</span><br><strong>${record.timesCaptured || 0}</strong></div>
          <div class="bg-black/25 rounded-xl p-3"><span class="text-gray-400">Escaped</span><br><strong>${record.timesEscaped || 0}</strong></div>
          <div class="bg-black/25 rounded-xl p-3"><span class="text-gray-400">Last Status</span><br><strong>${record.lastStatus || "Seen"}</strong></div>
        </div>
      </div>`;
  }

  function renderJournalSummary() {
    const collectionList = document.getElementById("collectionList");
    if (!collectionList || document.getElementById("journalSummaryPanel")) return;

    const panel = document.createElement("section");
    panel.id = "journalSummaryPanel";
    panel.className = "bg-[#2C3E50] rounded-3xl border border-white/10 shadow-2xl overflow-hidden";
    collectionList.closest("section").after(panel);
  }

  function updateJournalSummary() {
    const panel = document.getElementById("journalSummaryPanel");
    if (!panel) return;

    const journal = getJournal();
    const captures = journal.reduce((sum, item) => sum + (item.timesCaptured || 0), 0);
    const escapes = journal.reduce((sum, item) => sum + (item.timesEscaped || 0), 0);
    const latest = journal.slice().sort((a, b) => String(b.lastSeen).localeCompare(String(a.lastSeen))).slice(0, 4);

    panel.innerHTML = `
      <div class="p-5 border-b border-white/10">
        <h2 class="text-2xl font-bold text-[#FFD700]">Discovery Journal</h2>
        <p class="text-sm text-gray-300">Auto-tracks seen, captured, and escaped signals.</p>
      </div>
      <div class="p-5">
        <div class="grid grid-cols-3 gap-2 text-center text-xs mb-4">
          <div class="bg-black/25 rounded-xl p-3"><span class="text-gray-400">Entries</span><br><strong>${journal.length}</strong></div>
          <div class="bg-black/25 rounded-xl p-3"><span class="text-gray-400">Captures</span><br><strong>${captures}</strong></div>
          <div class="bg-black/25 rounded-xl p-3"><span class="text-gray-400">Escapes</span><br><strong>${escapes}</strong></div>
        </div>
        <div class="grid gap-2 text-sm">
          ${latest.length ? latest.map((item) => `<div class="bg-black/20 rounded-xl p-3 flex justify-between gap-3"><span>${item.name}</span><span class="text-[#FFD700] text-xs">${item.lastStatus || "Seen"}</span></div>`).join("") : `<p class="text-gray-300 text-sm">Start scanning to fill the journal.</p>`}
        </div>
      </div>`;
  }

  function enhanceModal() {
    const modalLore = document.getElementById("modalLore");
    const modalName = document.getElementById("modalName");
    if (!modalLore || !modalName) return;

    const observer = new MutationObserver(() => {
      const name = modalName.textContent.trim();
      if (!name) return;
      document.getElementById("journalModalExtras")?.remove();
      const wrap = document.createElement("div");
      wrap.id = "journalModalExtras";
      wrap.innerHTML = `${treeHtml(name)}${journalHtml(name)}`;
      modalLore.insertAdjacentElement("afterend", wrap);
    });

    observer.observe(modalName, { childList: true, characterData: true, subtree: true });
  }

  function bootEnhancements() {
    syncEvents();
    renderJournalSummary();
    updateJournalSummary();
    enhanceModal();
    setInterval(() => {
      syncEvents();
      updateJournalSummary();
    }, 1200);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootEnhancements);
  } else {
    bootEnhancements();
  }
})();
