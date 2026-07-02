// assets/asset-search.js
// Offline-first unified Studio search for modules, assets, and Technology Vault records.

(function () {
  const KNOWLEDGE_INDEX_URL = "/studio/knowledge/index.json";
  const ASSET_INDEX_URL = "/studio/assets/index.json";
  const TECHNOLOGY_INDEX_URL = "/studio/technology/index.json";

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

  function moduleToRecord(module) {
    return {
      recordType: "module",
      id: module.id,
      title: module.name,
      category: module.category,
      project: module.name,
      status: module.status || "planned",
      description: asArray(module.keywords).join(" • "),
      keywords: asArray(module.keywords),
      dependencies: asArray(module.dependencies),
      location: module.entry,
      preview: module.manifest,
      version: "0.3.0",
      sourceRecord: module
    };
  }

  function assetToRecord(asset) {
    return {
      recordType: "asset",
      id: asset.id,
      title: asset.name,
      category: asset.assetType,
      project: asset.project,
      status: "active",
      description: asset.description,
      keywords: asArray(asset.tags),
      dependencies: asArray(asset.dependencies),
      location: asset.path,
      preview: asset.preview,
      version: asset.version,
      sourceRecord: asset
    };
  }

  function technologyToRecord(technology) {
    return {
      recordType: "technology",
      id: technology.id,
      title: technology.name,
      category: technology.technologyType,
      project: technology.project,
      status: "active",
      description: technology.description,
      keywords: asArray(technology.tags),
      dependencies: asArray(technology.dependencies),
      location: technology.path,
      preview: technology.preview,
      version: technology.version,
      sourceRecord: technology
    };
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
      ...asArray(record.keywords),
      ...asArray(record.dependencies)
    ]).map(normalize).join(" ");
  }

  function recordTypeLabel(type) {
    if (type === "asset") return "Asset";
    if (type === "module") return "Module";
    if (type === "technology") return "Technology";
    if (type === "document") return "Document";
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
        ? `<p class=\"text-gray-400 text-xs mt-3\">Depends on: ${record.dependencies.join(" • ")}</p>`
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

  function applySearch(records, query, activeFilter) {
    const normalizedQuery = normalize(query);

    return records.filter((record) => {
      const matchesFilter = activeFilter === "all" || record.recordType === activeFilter;
      const matchesQuery = !normalizedQuery || searchableText(record).includes(normalizedQuery);
      return matchesFilter && matchesQuery;
    });
  }

  async function fetchJson(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`Index failed: ${url} ${response.status}`);
    return response.json();
  }

  async function initAssetSearch() {
    const input = document.querySelector("[data-knowledge-search]");
    const output = document.querySelector("[data-knowledge-results]");
    const filters = document.querySelector("[data-search-filters]");

    if (!input || !output) return;

    try {
      const [knowledgeIndex, assetIndex, technologyIndex] = await Promise.all([
        fetchJson(KNOWLEDGE_INDEX_URL),
        fetchJson(ASSET_INDEX_URL),
        fetchJson(TECHNOLOGY_INDEX_URL)
      ]);

      const records = [
        ...asArray(knowledgeIndex.modules).map(moduleToRecord),
        ...asArray(assetIndex.assets).map(assetToRecord),
        ...asArray(technologyIndex.technologies).map(technologyToRecord)
      ];

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
    document.addEventListener("DOMContentLoaded", initAssetSearch);
  } else {
    initAssetSearch();
  }
})();
