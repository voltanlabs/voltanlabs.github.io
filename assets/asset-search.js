// assets/asset-search.js
// Live Studio search backed by Knowledge Engine v2 and registered DataByteSprites indexes.

(function () {
  const KNOWLEDGE_INDEX_URL = "/studio/knowledge/index.v2.json";

  function asArray(value) { return Array.isArray(value) ? value : []; }
  function normalize(value) { return String(value || "").toLowerCase().trim(); }
  function compact(values) { return values.filter((value) => value !== undefined && value !== null && value !== ""); }
  function unique(values) { return [...new Set(values)]; }
  function flatten(value) {
    if (Array.isArray(value)) return value.flatMap(flatten);
    if (value && typeof value === "object") return Object.values(value).flatMap(flatten);
    return value === undefined || value === null ? [] : [String(value)];
  }

  function makeRecord(type, item, sourceIndex, shape) {
    return {
      recordType: type,
      id: shape.id,
      title: shape.title,
      category: shape.category,
      project: shape.project || "VoltanLabs Studio",
      status: shape.status || "active",
      description: shape.description || "",
      keywords: unique(flatten(shape.keywords || [])),
      dependencies: unique(flatten(shape.dependencies || [])),
      location: shape.location || "",
      preview: shape.preview || "",
      sourceIndex
    };
  }

  const adapters = {
    module(item, sourceIndex) {
      return makeRecord("module", item, sourceIndex, { id: item.id, title: item.name, category: item.category, project: item.name, status: item.status, description: asArray(item.keywords).join(" • "), keywords: item.keywords, dependencies: item.dependencies, location: item.entry, preview: item.manifest });
    },
    spriteSpecies(item, sourceIndex) {
      return makeRecord("spriteSpecies", item, sourceIndex, { id: item.id, title: item.name, category: item.speciesType, project: item.project, status: item.status, description: item.description || item.lore, keywords: [item.rarity, item.elements, item.tags, item.lore, item.discovery, item.capture, item.battleStats, item.assetRefs, item.dexRefs], dependencies: item.dependencies, location: "/studio/databytesprites/species.json#" + item.id, preview: "/studio/databytesprites/species.json" });
    },
    lore(item, sourceIndex) {
      return makeRecord("lore", item, sourceIndex, { id: item.id, title: item.name, category: item.loreType, project: item.project, status: item.status, description: item.summary || item.canon, keywords: [item.tags, item.canon, item.timeline, item.relatedCharacters, item.relatedSpecies, item.relatedSystems], dependencies: item.dependencies, location: item.path, preview: item.preview });
    },
    sourceFile(item, sourceIndex) {
      return makeRecord("sourceFile", item, sourceIndex, { id: item.id, title: item.name, category: item.fileType, project: item.project, status: item.status, description: item.description, keywords: [item.tags, item.path, item.preview], dependencies: item.dependencies, location: item.path, preview: item.preview });
    },
    mechanicsGraph(item, sourceIndex) {
      return makeRecord("mechanicsGraph", item, sourceIndex, { id: item.id || item.source + "-to-" + item.target, title: item.label || item.edgeType || item.id, category: item.nodeType || item.edgeType || "graph", project: "DataByteSprites", status: item.status || "active", description: item.description || item.reason, keywords: [item.category, item.nodeType, item.edgeType, item.source, item.target, item.reason], dependencies: [item.source, item.target], location: item.path || "/studio/databytesprites/mechanics-graph.json", preview: "/studio/databytesprites/mechanics-graph.json" });
    },
    move(item, sourceIndex) {
      return makeRecord("move", item, sourceIndex, { id: item.id, title: item.name, category: item.moveType, project: "DataByteSprites", status: "active", description: item.description, keywords: [item.elements, item.power, item.accuracy, item.stabilityEffect, item.captureEffect, item.tags, item.learnedBy], dependencies: item.learnedBy, location: "/studio/databytesprites/moves.json#" + item.id, preview: "/studio/databytesprites/moves.json" });
    },
    typeChart(item, sourceIndex) {
      return makeRecord("typeChart", item, sourceIndex, { id: item.attackingElement, title: item.attackingElement + " Type Rule", category: "type-rule", project: "DataByteSprites", status: "active", description: item.notes, keywords: [item.strongAgainst, item.weakAgainst, item.noEffectAgainst, item.captureBonusAgainst], dependencies: [item.strongAgainst, item.weakAgainst], location: "/studio/databytesprites/type-chart.json#" + item.attackingElement, preview: "/studio/databytesprites/type-chart.json" });
    },
    ability(item, sourceIndex) {
      return makeRecord("ability", item, sourceIndex, { id: item.id, title: item.name, category: item.abilityType, project: "DataByteSprites", status: "active", description: item.description, keywords: [item.trigger, item.effects, item.tags, item.assignedTo], dependencies: item.assignedTo, location: "/studio/databytesprites/abilities.json#" + item.id, preview: "/studio/databytesprites/abilities.json" });
    }
  };

  async function fetchJson(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(url + " failed");
    return response.json();
  }

  function collectionItems(data, descriptor) {
    return String(descriptor.collection || "").split(",").map((name) => name.trim()).filter(Boolean).flatMap((name) => asArray(data[name]));
  }

  function searchableText(record) {
    return compact([record.recordType, record.id, record.title, record.category, record.project, record.status, record.description, record.location, record.preview, ...record.keywords, ...record.dependencies]).map(normalize).join(" ");
  }

  function recordHref(record) {
    return record.location && !record.location.startsWith("#") ? record.location : "";
  }

  function recordTypeLabel(type) {
    const labels = { module: "Module", spriteSpecies: "Species", lore: "Lore", sourceFile: "Source", mechanicsGraph: "Mechanics", move: "Move", typeChart: "Type", ability: "Ability" };
    return labels[type] || "Record";
  }

  function renderFilters(records, filters) {
    if (!filters) return;
    const types = unique(records.map((record) => record.recordType)).sort();
    filters.innerHTML = ["all", ...types].map((type) => `<button type="button" data-search-filter="${type}" class="rounded-full border border-white/15 px-4 py-2 text-sm text-gray-200 hover:border-[#FFD700] hover:text-[#FFD700] transition">${type === "all" ? "All" : recordTypeLabel(type)}</button>`).join("");
  }

  function renderResults(results, output) {
    if (!output) return;
    if (!results.length) { output.innerHTML = "<p class=\"text-gray-400 text-sm\">No matching Studio records found.</p>"; return; }
    output.innerHTML = results.map((record) => {
      const href = recordHref(record);
      const tag = href ? "a" : "div";
      const attr = href ? ` href=\"${href}\"` : "";
      const keywords = record.keywords.slice(0, 6).join(" • ");
      return `<${tag}${attr} class="block rounded-2xl border border-white/10 bg-[#2C3E50] p-4 hover:border-[#FFD700] transition"><div class="flex items-start justify-between gap-3"><div><p class="text-xs uppercase tracking-wide text-[#FFD700]">${record.category || "Studio"}</p><h3 class="text-xl font-bold text-white mt-1">${record.title}</h3></div><span class="shrink-0 text-xs px-3 py-1 rounded-full border border-white/20 text-gray-200">${recordTypeLabel(record.recordType)}</span></div><p class="text-gray-300 text-sm mt-3">${record.description || keywords}</p>${keywords ? `<p class="text-gray-400 text-xs mt-3">${keywords}</p>` : ""}<p class="text-[#FFD700] text-sm mt-3">${href ? "Open" : "Indexed"} →</p></${tag}>`;
    }).join("");
  }

  function scoreRecord(record, query) {
    if (!query) return 1;
    const q = normalize(query);
    let score = 0;
    if (normalize(record.title).includes(q)) score += 12;
    if (normalize(record.id).includes(q)) score += 8;
    if (normalize(record.recordType).includes(q)) score += 6;
    if (normalize(record.category).includes(q)) score += 5;
    if (record.keywords.some((keyword) => normalize(keyword).includes(q))) score += 4;
    if (normalize(record.description).includes(q)) score += 2;
    return score;
  }

  function applySearch(records, query, activeFilter) {
    const q = normalize(query);
    return records.filter((record) => (activeFilter === "all" || record.recordType === activeFilter) && (!q || searchableText(record).includes(q))).sort((a, b) => scoreRecord(b, query) - scoreRecord(a, query));
  }

  async function loadDescriptor(descriptor) {
    if (!descriptor.path || descriptor.path === KNOWLEDGE_INDEX_URL) return [];
    const adapter = adapters[descriptor.recordType];
    if (!adapter) return [];
    const data = await fetchJson(descriptor.path);
    return collectionItems(data, descriptor).map((item) => adapter(item, descriptor.id));
  }

  async function buildGlobalIndex() {
    const index = await fetchJson(KNOWLEDGE_INDEX_URL);
    const records = asArray(index.modules).map((item) => adapters.module(item, "studio-modules"));
    const loaded = await Promise.all(asArray(index.indexes).map(loadDescriptor));
    loaded.flat().forEach((record) => records.push(record));
    const seen = new Set();
    return records.filter((record) => {
      const key = record.recordType + ":" + record.id + ":" + record.sourceIndex;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  async function initGlobalSearch() {
    const input = document.querySelector("[data-knowledge-search]");
    const output = document.querySelector("[data-knowledge-results]");
    const filters = document.querySelector("[data-search-filters]");
    if (!input || !output) return;
    try {
      const records = await buildGlobalIndex();
      let activeFilter = "all";
      renderFilters(records, filters);
      renderResults(records, output);
      function update() { renderResults(applySearch(records, input.value, activeFilter), output); }
      input.addEventListener("input", update);
      if (filters) filters.addEventListener("click", (event) => { const button = event.target.closest("[data-search-filter]"); if (!button) return; activeFilter = button.dataset.searchFilter || "all"; update(); });
    } catch (error) {
      console.warn(error);
      output.innerHTML = "<p class=\"text-red-200 text-sm\">Studio search indexes unavailable.</p>";
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initGlobalSearch);
  else initGlobalSearch();
})();
