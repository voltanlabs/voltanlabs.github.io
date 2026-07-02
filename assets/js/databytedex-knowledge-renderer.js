// assets/js/databytedex-knowledge-renderer.js
// Knowledge Engine driven DataByteDex renderer.

(function () {
  const SPECIES_INDEX_URL = "/studio/databytesprites/species.json";
  const LORE_INDEX_URL = "/studio/databytesprites/lore.json";
  const COLLECTION_KEY = "vl_databyte_discovery_collection_v2";
  const SEEN_KEY = "vl_databyte_seen_v1";

  function readList(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
      return [];
    }
  }

  function capturedNames() {
    return new Set(readList(COLLECTION_KEY).map((sprite) => sprite && sprite.name).filter(Boolean));
  }

  function seenNames() {
    const seen = new Set(readList(SEEN_KEY).map((sprite) => typeof sprite === "string" ? sprite : sprite && sprite.name).filter(Boolean));
    capturedNames().forEach((name) => seen.add(name));
    return seen;
  }

  function normalize(value) {
    return String(value || "").toLowerCase();
  }

  function asArray(value) {
    return Array.isArray(value) ? value : [];
  }

  async function fetchJson(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`Unable to load ${url}: ${response.status}`);
    return response.json();
  }

  function relatedLoreForSpecies(species, loreRecords) {
    const speciesId = species.id;
    const speciesName = normalize(species.name);

    return loreRecords.filter((record) => {
      const relatedSpecies = asArray(record.relatedSpecies).map(normalize);
      const text = normalize([
        record.name,
        record.summary,
        record.canon,
        ...asArray(record.tags),
        ...asArray(record.dependencies)
      ].join(" "));

      return relatedSpecies.includes(speciesId) || relatedSpecies.includes(speciesName) || text.includes(speciesName);
    });
  }

  function speciesSearchText(species, loreRecords) {
    return normalize([
      species.id,
      species.name,
      species.speciesType,
      species.status,
      species.rarity,
      species.description,
      species.lore,
      ...asArray(species.elements),
      ...asArray(species.tags),
      ...asArray(species.dependencies),
      ...relatedLoreForSpecies(species, loreRecords).map((lore) => `${lore.name} ${lore.summary} ${lore.canon}`)
    ].join(" "));
  }

  function displayValue(value, fallback = "TBD") {
    if (Array.isArray(value)) return value.length ? value.join(" / ") : fallback;
    return value || fallback;
  }

  function statLine(stats) {
    if (!stats) return "Stats pending";
    return `HP ${stats.hp || "?"} • ATK ${stats.attack || "?"} • DEF ${stats.defense || "?"} • SPD ${stats.speed || "?"} • SPC ${stats.special || "?"}`;
  }

  function renderSpeciesCard(species, loreRecords, captured, seen) {
    const isCaptured = captured.has(species.name);
    const isSeen = seen.has(species.name);
    const loreMatches = relatedLoreForSpecies(species, loreRecords).slice(0, 3);
    const evolution = species.evolutionLine || {};
    const discovery = species.discovery || {};
    const capture = species.capture || {};

    return `
      <article class="bg-[#2C3E50] border ${isCaptured ? "border-[#FFD700]/60" : isSeen ? "border-emerald-300/40" : "border-white/10"} rounded-3xl p-5 shadow-lg">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-xs tracking-[0.25em] text-[#FFD700] mb-2">${displayValue(species.rarity)} • ${displayValue(species.speciesType)}</p>
            <h2 class="text-2xl font-bold text-white">${species.name}</h2>
          </div>
          <span class="text-xs rounded-full px-3 py-1 border border-white/15 text-gray-200">${species.status || "indexed"}</span>
        </div>
        <p class="text-sky-200 text-sm mt-2">${displayValue(species.elements)}</p>
        <p class="text-gray-300 text-sm mt-4">${species.description || species.lore || "No description indexed yet."}</p>
        <div class="mt-4 rounded-2xl bg-black/20 border border-white/10 p-4 text-sm text-gray-300">
          <p><span class="text-[#FFD700]">Lore:</span> ${species.lore || "Lore hook pending."}</p>
          <p class="mt-2"><span class="text-[#FFD700]">Evolution:</span> ${evolution.family || "Unassigned"}${evolution.stage ? ` • Stage ${evolution.stage}` : ""}</p>
          <p class="mt-2"><span class="text-[#FFD700]">Discovery:</span> ${displayValue(discovery.method)}${asArray(discovery.regions).length ? ` • ${discovery.regions.join(" / ")}` : ""}</p>
          <p class="mt-2"><span class="text-[#FFD700]">Capture:</span> ${displayValue(capture.difficulty)} ${capture.method ? `• ${capture.method}` : ""}</p>
          <p class="mt-2"><span class="text-[#FFD700]">Battle:</span> ${statLine(species.battleStats)}</p>
        </div>
        ${loreMatches.length ? `<div class="mt-4 text-xs text-gray-400"><span class="text-[#FFD700]">Linked Lore:</span> ${loreMatches.map((lore) => lore.name).join(" • ")}</div>` : ""}
        <div class="mt-4 grid grid-cols-2 gap-2 text-xs">
          <span class="px-3 py-2 rounded-xl ${isSeen ? "bg-emerald-400/15 text-emerald-200" : "bg-black/25 text-gray-400"}">Seen: ${isSeen ? "✓" : "—"}</span>
          <span class="px-3 py-2 rounded-xl ${isCaptured ? "bg-[#FFD700]/15 text-[#FFD700]" : "bg-black/25 text-gray-400"}">Captured: ${isCaptured ? "✓" : "—"}</span>
        </div>
      </article>`;
  }

  function updateCounts(speciesRecords, loreRecords, captured, seen) {
    const total = document.getElementById("totalCount");
    const seenCount = document.getElementById("seenCount");
    const capturedCount = document.getElementById("capturedCount");
    const source = document.getElementById("dexSource");

    if (total) total.textContent = speciesRecords.length;
    if (seenCount) seenCount.textContent = seen.size;
    if (capturedCount) capturedCount.textContent = captured.size;
    if (source) source.textContent = `Knowledge v0.1 • ${loreRecords.length} lore`;
  }

  async function initDex() {
    const grid = document.getElementById("dexGrid");
    const search = document.getElementById("dexSearch");
    const status = document.getElementById("dexStatus");

    if (!grid || !search) return;

    try {
      const [speciesIndex, loreIndex] = await Promise.all([
        fetchJson(SPECIES_INDEX_URL),
        fetchJson(LORE_INDEX_URL)
      ]);

      const speciesRecords = asArray(speciesIndex.species);
      const loreRecords = asArray(loreIndex.lore);

      function render(query = "") {
        const captured = capturedNames();
        const seen = seenNames();
        const term = normalize(query);
        const filtered = speciesRecords.filter((species) => speciesSearchText(species, loreRecords).includes(term));

        updateCounts(speciesRecords, loreRecords, captured, seen);
        grid.innerHTML = filtered.map((species) => renderSpeciesCard(species, loreRecords, captured, seen)).join("") || "<div class=\"text-gray-300\">No matching sprites found.</div>";
      }

      if (status) status.textContent = "Knowledge Engine source active";
      search.addEventListener("input", (event) => render(event.target.value));
      render();
    } catch (error) {
      console.warn(error);
      if (status) status.textContent = "Knowledge indexes unavailable";
      grid.innerHTML = "<div class=\"text-red-200\">DataByteDex knowledge indexes could not be loaded.</div>";
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDex);
  } else {
    initDex();
  }
})();
