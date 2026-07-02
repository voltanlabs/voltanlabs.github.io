// assets/asset-search.js
// Offline-first Studio-wide global search driven by the Knowledge Engine index registry.

(function () {
  const KNOWLEDGE_INDEX_URL = "/studio/knowledge/index.json";

  function asArray(value) { return Array.isArray(value) ? value : []; }
  function compact(value) { return value.filter(Boolean); }
  function normalize(value) { return String(value || "").toLowerCase().trim(); }
  function unique(values) { return [...new Set(values)]; }

  function makeRecord(type, item, context, shape) {
    return {
      recordType: type,
      id: shape.id,
      title: shape.title,
      category: shape.category,
      project: shape.project || "DataByteSprites",
      status: shape.status || "active-foundation",
      description: shape.description,
      keywords: asArray(shape.keywords),
      dependencies: asArray(shape.dependencies),
      location: shape.location || context.indexPath,
      preview: shape.preview || context.indexPath,
      version: shape.version || context.schemaVersion,
      sourceIndex: context.indexId,
      sourceRecord: item
    };
  }

  const recordAdapters = {
    module(item, context) { return makeRecord("module", item, context, { id: item.id, title: item.name, category: item.category, project: item.name, status: item.status || "planned", description: asArray(item.keywords).join(" • "), keywords: item.keywords, dependencies: item.dependencies, location: item.entry, preview: item.manifest }); },
    asset(item, context) { return makeRecord("asset", item, context, { id: item.id, title: item.name, category: item.assetType, project: item.project, status: "active", description: item.description, keywords: item.tags, dependencies: item.dependencies, location: item.path, preview: item.preview, version: item.version }); },
    technology(item, context) { return makeRecord("technology", item, context, { id: item.id, title: item.name, category: item.technologyType, project: item.project, status: "active", description: item.description, keywords: item.tags, dependencies: item.dependencies, location: item.path, preview: item.preview, version: item.version }); },
    graph(item, context) { return makeRecord("graph", item, context, { id: item.id, title: item.label || item.name || item.id, category: item.nodeType || item.edgeType || item.category, project: item.category || context.indexName, status: item.status || "active", description: item.description || item.reason, keywords: compact([item.category, item.nodeType, item.edgeType, item.source, item.target]), dependencies: compact([item.source, item.target]), location: item.path || context.indexPath, preview: item.path || context.indexPath }); },
    databytesprites(item, context) { return makeRecord("databytesprites", item, context, { id: item.id, title: item.name, category: item.systemType, project: item.project || "DataByteSprites", status: item.status || "active", description: item.description, keywords: item.tags, dependencies: item.dependencies, location: item.path, preview: item.preview, version: item.version }); },
    sourceFile(item, context) { return makeRecord("sourceFile", item, context, { id: item.id, title: item.name, category: item.fileType, project: item.project || "DataByteSprites", status: item.status || "active", description: item.description, keywords: item.tags, dependencies: item.dependencies, location: item.path, preview: item.preview, version: item.version }); },
    spriteSpecies(item, context) { return makeRecord("spriteSpecies", item, context, { id: item.id, title: item.name, category: item.speciesType, project: item.project || "DataByteSprites", status: item.status || "active", description: item.description || item.lore, keywords: compact([...(item.tags || []), ...(item.elements || []), item.rarity]), dependencies: compact([...(item.dependencies || []), ...(item.dexRefs || []), ...(item.assetRefs || [])]), version: item.version }); },
    lore(item, context) { return makeRecord("lore", item, context, { id: item.id, title: item.name, category: item.loreType, project: item.project || "DataByteSprites", status: item.status || "active", description: item.summary || item.canon, keywords: compact([...(item.tags || []), ...(item.relatedCharacters || []), ...(item.relatedSpecies || []), ...(item.relatedSystems || [])]), dependencies: item.dependencies, location: item.path, preview: item.preview, version: item.version }); },
    mechanicsGraph(item, context) { return recordAdapters.graph(item, context); },
    move(item, context) { return makeRecord("move", item, context, { id: item.id, title: item.name, category: item.moveType, description: item.description, keywords: compact([...(item.elements || []), ...(item.tags || []), "power " + item.power, "accuracy " + item.accuracy]), dependencies: item.learnedBy, version: item.version }); },
    typeChart(item, context) { return makeRecord("typeChart", item, context, { id: item.attackingElement, title: item.attackingElement + " Type Rule", category: "type-rule", description: item.notes, keywords: compact([...(item.strongAgainst || []), ...(item.weakAgainst || []), ...(item.captureBonusAgainst || [])]), dependencies: compact([...(item.strongAgainst || []), ...(item.weakAgainst || [])]) }); },
    ability(item, context) { return makeRecord("ability", item, context, { id: item.id, title: item.name, category: item.abilityType, description: item.description, keywords: compact([...(item.tags || []), item.trigger]), dependencies: item.assignedTo, version: item.version }); }
  };

  function recordKey(record) { return record.recordType + ":" + record.id + ":" + (record.sourceIndex || "unknown"); }
  function dedupe(records) { const seen = new Set(); return records.filter((record) => { const key = recordKey(record); if (seen.has(key)) return false; seen.add(key); return true; }); }
  function searchableText(record) { return compact([record.recordType, record.id, record.title, record.category, record.project, record.status, record.description, record.location, record.preview, record.version, record.sourceIndex, ...asArray(record.keywords), ...asArray(record.dependencies)]).map(normalize).join(" "); }

  function recordTypeLabel(type) {
    const labels = { asset: "Asset", module: "Module", technology: "Technology", graph: "Graph", databytesprites: "DataByteSprites", sourceFile: "Source", spriteSpecies: "Species", lore: "Lore", mechanicsGraph: "Mechanics", move: "Move", typeChart: "Type", ability: "Ability", document: "Document" };
    return labels[type] || "Record";
  }

  function recordHref(record) { const target = record.preview || record.location || ""; if (!target || String(target).startsWith("#")) return ""; return target; }
  function renderFilters(records, filters) { if (!filters) return; const types = unique(records.map((record) => record.recordType)).sort(); filters.innerHTML = ["all", ...types].map((type) => `<button type="button" data-search-filter="${type}" class="rounded-full border border-white/15 px-4 py-2 text-sm text-gray-200 hover:border-[#FFD700] hover:text-[#FFD700] transition">${type === "all" ? "All" : recordTypeLabel(type)}</button>`).join(""); }

  function renderResults(results, output) {
    if (!output) return;
    if (!results.length) { output.innerHTML = "<p class=\"text-gray-400 text-sm\">No matching Studio records found.</p>"; return; }
    output.innerHTML = results.map((record) => { const href = recordHref(record); const tag = href ? "a" : "div"; const attr = href ? ` href=\"${href}\"` : ""; const keywords = asArray(record.keywords).slice(0, 6).join(" • "); const deps = asArray(record.dependencies).length ? `<p class=\"text-gray-400 text-xs mt-3\">Links: ${record.dependencies.join(" • ")}</p>` : ""; return `<${tag}${attr} class="block rounded-2xl border border-white/10 bg-[#2C3E50] p-4 hover:border-[#FFD700] transition"><div class="flex items-start justify-between gap-3"><div><p class="text-xs uppercase tracking-wide text-[#FFD700]">${record.category || "Studio"}</p><h3 class="text-xl font-bold text-white mt-1">${record.title}</h3></div><span class="shrink-0 text-xs px-3 py-1 rounded-full border border-white/20 text-gray-200">${recordTypeLabel(record.recordType)}</span></div><p class="text-gray-300 text-sm mt-3">${record.description || keywords}</p>${keywords ? `<p class="text-gray-400 text-xs mt-3">${keywords}</p>` : ""}${deps}<p class="text-[#FFD700] text-sm mt-3">${href ? "Open" : "Indexed"} →</p></${tag}>`; }).join("");
  }

  function scoreRecord(record, query) { if (!query) return 1; const q = normalize(query); let score = 0; if (normalize(record.title) === q) score += 20; if (normalize(record.title).includes(q)) score += 12; if (normalize(record.id).includes(q)) score += 8; if (normalize(record.recordType).includes(q)) score += 6; if (normalize(record.category).includes(q)) score += 5; if (normalize(record.project).includes(q)) score += 4; if (asArray(record.keywords).some((keyword) => normalize(keyword).includes(q))) score += 4; if (asArray(record.dependencies).some((dependency) => normalize(dependency).includes(q))) score += 3; if (normalize(record.description).includes(q)) score += 2; return score; }
  function applySearch(records, query, activeFilter) { const q = normalize(query); return records.filter((record) => (activeFilter === "all" || record.recordType === activeFilter) && (!q || searchableText(record).includes(q))).sort((a, b) => scoreRecord(b, query) - scoreRecord(a, query)); }

  async function fetchJson(url) { const response = await fetch(url, { cache: "no-store" }); if (!response.ok) throw new Error("Index failed: " + url + " " + response.status); return response.json(); }
  function extractCollection(indexData, descriptor) { return String(descriptor.collection || "").split(",").map((item) => item.trim()).filter(Boolean).flatMap((name) => Array.isArray(indexData[name]) ? indexData[name] : []); }
  async function loadRegisteredIndex(descriptor) { if (!descriptor.path || descriptor.path === KNOWLEDGE_INDEX_URL) return []; const indexData = await fetchJson(descriptor.path); const adapter = recordAdapters[descriptor.recordType]; if (!adapter) return []; const context = { indexId: descriptor.id, indexName: descriptor.name, indexPath: descriptor.path, schemaVersion: indexData.schemaVersion || "0.1.0" }; return extractCollection(indexData, descriptor).map((item) => adapter(item, context)); }
  async function buildGlobalIndex(knowledgeIndex) { const moduleRecords = asArray(knowledgeIndex.modules).map((item) => recordAdapters.module(item, { indexId: "studio-modules", indexName: "Studio Module Index", indexPath: KNOWLEDGE_INDEX_URL, schemaVersion: knowledgeIndex.schemaVersion || "0.1.0" })); const dynamicRecords = (await Promise.all(asArray(knowledgeIndex.indexes).map(loadRegisteredIndex))).flat(); return dedupe([...moduleRecords, ...dynamicRecords]); }

  async function initGlobalSearch() { const input = document.querySelector("[data-knowledge-search]"); const output = document.querySelector("[data-knowledge-results]"); const filters = document.querySelector("[data-search-filters]"); if (!input || !output) return; try { const knowledgeIndex = await fetchJson(KNOWLEDGE_INDEX_URL); const records = await buildGlobalIndex(knowledgeIndex); let activeFilter = "all"; renderFilters(records, filters); renderResults(records, output); function update() { renderResults(applySearch(records, input.value, activeFilter), output); } input.addEventListener("input", update); if (filters) filters.addEventListener("click", (event) => { const button = event.target.closest("[data-search-filter]"); if (!button) return; activeFilter = button.dataset.searchFilter || "all"; filters.querySelectorAll("[data-search-filter]").forEach((item) => { item.classList.toggle("border-[#FFD700]", item === button); item.classList.toggle("text-[#FFD700]", item === button); }); update(); }); } catch (error) { console.warn(error); output.innerHTML = "<p class=\"text-red-200 text-sm\">Studio search indexes unavailable.</p>"; } }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initGlobalSearch); else initGlobalSearch();
})();
