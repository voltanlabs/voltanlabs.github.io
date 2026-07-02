// assets/asset-search.js
// Offline-first Studio-wide global search driven by the Knowledge Engine index registry.

(function () {
  const KNOWLEDGE_INDEX_URL = "/studio/knowledge/index.json";

  const recordAdapters = {
    module(item, context) {
      return {
        recordType: "module",
        id: item.id,
        title: item.name,
        category: item.category,
        project: item.name,
        status: item.status || "planned",
        description: asArray(item.keywords).join(" • "),
        keywords: asArray(item.keywords),
        dependencies: asArray(item.dependencies),
        location: item.entry,
        preview: item.manifest,
        version: context.schemaVersion,
        sourceIndex: context.indexId,
        sourceRecord: item
      };
    },

    asset(item, context) {
      return {
        recordType: "asset",
        id: item.id,
        title: item.name,
        category: item.assetType,
        project: item.project,
        status: "active",
        description: item.description,
        keywords: asArray(item.tags),
        dependencies: asArray(item.dependencies),
        location: item.path,
        preview: item.preview,
        version: item.version,
        sourceIndex: context.indexId,
        sourceRecord: item
      };
    },

    technology(item, context) {
      return {
        recordType: "technology",
        id: item.id,
        title: item.name,
        category: item.technologyType,
        project: item.project,
        status: "active",
        description: item.description,
        keywords: asArray(item.tags),
        dependencies: asArray(item.dependencies),
        location: item.path,
        preview: item.preview,
        version: item.version,
        sourceIndex: context.indexId,
        sourceRecord: item
      };
    },

    graph(item, context) {
      return {
        recordType: "graph",
        id: item.id,
        title: item.label || item.name || item.id,
        category: item.nodeType || item.edgeType || item.category,
        project: item.category || context.indexName,
        status: item.status || "active",
        description: item.description || item.reason,
        keywords: compact([item.category, item.nodeType, item.edgeType, item.source, item.target]),
        dependencies: compact([item.source, item.target]),
        location: item.path || context.indexPath,
        preview: item.path || context.indexPath,
        version: context.schemaVersion,
        sourceIndex: context.indexId,
        sourceRecord: item
      };
    },

    databytesprites(item, context) {
      return {
        recordType: "databytesprites",
        id: item.id,
        title: item.name,
        category: item.systemType,
        project: item.project || "DataByteSprites",
        status: item.status || "active",
        description: item.description,
        keywords: asArray(item.tags),
        dependencies: asArray(item.dependencies),
        location: item.path,
        preview: item.preview,
        version: item.version,
        sourceIndex: context.indexId,
        sourceRecord: item
      };
    }
  };

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function asArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function compact(value) {
    return value.filter(Boolean);
  }

  function unique(values) {
    return [...new Set(values)];
  }

  function recordKey(record) {
    return `${record.recordType}:${record.id}:${record.sourceIndex || "unknown"}`;
  }

  function dedupe(records) {
    const seen = new Set();
    return records.filter((record) => {
      const key = recordKey(record);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function searchableText(record) {
    return compact([
      record.recordType,
      record.id,
      record.title,
      record.category,
      record.project,
      record.status,
      record.description,
      record.location,
      record.preview,
      record.version,
      record.sourceIndex,
      ...asArray(record.keywords),
      ...asArray(record.dependencies)
    ]).map(normalize).join(" ");
  }

  function recordTypeLabel(type) {
    if (type === "asset") return "Asset";
    if (type === "module") return "Module";
    if (type === "technology") return "Technology";
    if (type === "graph") return "Graph";
    if (type === "databytesprites") return "DataByteSprites";
    if (type === "document") return "Document";
    if (type === "sourceFile") return "Source";
    return "Record";
  }

  function recordHref(record) {
    const target = record.preview || record.location || "";
    if (!target || String(target).startsWith("#")) return "";
    return target;
  }

  function renderFilters(records, filters) {
    if (!filters) return;

    const types = unique(records.map((record) => record.recordType)).sort();
    const buttons = ["all", ...types];

    filters.innerHTML = buttons.map((type) => {
      const label = type === "all" ? "All" : recordTypeLabel(type);
      return `<button type="button" data-search-filter="${type}" class="rounded-full border border-white/15 px-4 py-2 text-sm text-gray-200 hover:border-[#FFD700] hover:text-[#FFD700] transition">${label}</button>`;
    }).join("");
  }

  function renderResults(results, output) {
    if (!output) return;

    if (!results.length) {
      output.innerHTML = "<p class=\"text-gray-400 text-sm\">No matching Studio records found.</p>";
      return;
    }

    output.innerHTML = results.map((record) => {
      const href = recordHref(record);
      const tag = href ? "a" : "div";
      const attr = href ? ` href=\"${href}\"` : "";
      const action = href ? "Open" : "Indexed";
      const keywords = asArray(record.keywords).slice(0, 6).join(" • ");
      const dependencyText = asArray(record.dependencies).length
        ? `<p class=\"text-gray-400 text-xs mt-3\">Links: ${record.dependencies.join(" • ")}</p>`
        : "";

      return `
        <${tag}${attr} class="block rounded-2xl border border-white/10 bg-[#2C3E50] p-4 hover:border-[#FFD700] transition">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-xs uppercase tracking-wide text-[#FFD700]">${record.category || "Studio"}</p>
              <h3 class="text-xl font-bold text-white mt-1">${record.title}</h3>
            </div>
            <span class="shrink-0 text-xs px-3 py-1 rounded-full border border-white/20 text-gray-200">${recordTypeLabel(record.recordType)}</span>
          </div>
          <p class="text-gray-300 text-sm mt-3">${record.description || keywords}</p>
          ${keywords ? `<p class="text-gray-400 text-xs mt-3">${keywords}</p>` : ""}
          ${dependencyText}
          <p class="text-[#FFD700] text-sm mt-3">${action} →</p>
        </${tag}>`;
    }).join("");
  }

  function scoreRecord(record, query) {
    if (!query) return 1;
    const q = normalize(query);
    let score = 0;

    if (normalize(record.title) === q) score += 20;
    if (normalize(record.title).includes(q)) score += 12;
    if (normalize(record.id).includes(q)) score += 8;
    if (normalize(record.recordType).includes(q)) score += 6;
    if (normalize(record.category).includes(q)) score += 5;
    if (normalize(record.project).includes(q)) score += 4;
    if (asArray(record.keywords).some((keyword) => normalize(keyword).includes(q))) score += 4;
    if (asArray(record.dependencies).some((dependency) => normalize(dependency).includes(q))) score += 3;
    if (normalize(record.description).includes(q)) score += 2;

    return score;
  }

  function applySearch(records, query, activeFilter) {
    const normalizedQuery = normalize(query);

    return records
      .filter((record) => {
        const matchesFilter = activeFilter === "all" || record.recordType === activeFilter;
        const matchesQuery = !normalizedQuery || searchableText(record).includes(normalizedQuery);
        return matchesFilter && matchesQuery;
      })
      .sort((a, b) => scoreRecord(b, query) - scoreRecord(a, query));
  }

  async function fetchJson(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`Index failed: ${url} ${response.status}`);
    return response.json();
  }

  function extractCollection(indexData, descriptor) {
    const collection = descriptor.collection || "";
    const collectionNames = collection.split(",").map((item) => item.trim()).filter(Boolean);

    if (!collectionNames.length) return [];

    return collectionNames.flatMap((name) => {
      const value = indexData[name];
      return Array.isArray(value) ? value : [];
    });
  }

  async function loadRegisteredIndex(descriptor) {
    if (!descriptor.path || descriptor.path === KNOWLEDGE_INDEX_URL) {
      return [];
    }

    const indexData = await fetchJson(descriptor.path);
    const adapter = recordAdapters[descriptor.recordType];

    if (!adapter) return [];

    const context = {
      indexId: descriptor.id,
      indexName: descriptor.name,
      indexPath: descriptor.path,
      schemaVersion: indexData.schemaVersion || "0.1.0"
    };

    return extractCollection(indexData, descriptor).map((item) => adapter(item, context));
  }

  async function buildGlobalIndex(knowledgeIndex) {
    const moduleDescriptor = {
      id: "studio-modules",
      name: "Studio Module Index",
      path: KNOWLEDGE_INDEX_URL,
      collection: "modules",
      recordType: "module"
    };

    const moduleRecords = asArray(knowledgeIndex.modules).map((item) => {
      return recordAdapters.module(item, {
        indexId: moduleDescriptor.id,
        indexName: moduleDescriptor.name,
        indexPath: moduleDescriptor.path,
        schemaVersion: knowledgeIndex.schemaVersion || "0.1.0"
      });
    });

    const dynamicRecords = (await Promise.all(asArray(knowledgeIndex.indexes).map(loadRegisteredIndex))).flat();

    return dedupe([...moduleRecords, ...dynamicRecords]);
  }

  async function initGlobalSearch() {
    const input = document.querySelector("[data-knowledge-search]");
    const output = document.querySelector("[data-knowledge-results]");
    const filters = document.querySelector("[data-search-filters]");

    if (!input || !output) return;

    try {
      const knowledgeIndex = await fetchJson(KNOWLEDGE_INDEX_URL);
      const records = await buildGlobalIndex(knowledgeIndex);
      let activeFilter = "all";

      renderFilters(records, filters);
      renderResults(records, output);

      function update() {
        renderResults(applySearch(records, input.value, activeFilter), output);
      }

      input.addEventListener("input", update);

      if (filters) {
        filters.addEventListener("click", (event) => {
          const button = event.target.closest("[data-search-filter]");
          if (!button) return;

          activeFilter = button.dataset.searchFilter || "all";
          filters.querySelectorAll("[data-search-filter]").forEach((item) => {
            item.classList.toggle("border-[#FFD700]", item === button);
            item.classList.toggle("text-[#FFD700]", item === button);
          });
          update();
        });
      }
    } catch (error) {
      console.warn(error);
      output.innerHTML = "<p class=\"text-red-200 text-sm\">Studio search indexes unavailable.</p>";
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGlobalSearch);
  } else {
    initGlobalSearch();
  }
})();
