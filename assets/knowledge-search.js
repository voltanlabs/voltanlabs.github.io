// assets/knowledge-search.js
// Lightweight offline-first search for the VoltanLabs Studio Knowledge Engine.

(function () {
  const INDEX_URL = "/studio/knowledge/index.json";

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function searchableText(item) {
    return [
      item.id,
      item.name,
      item.category,
      item.status,
      item.entry,
      item.manifest,
      ...(item.keywords || []),
      ...(item.dependencies || [])
    ].map(normalize).join(" ");
  }

  function renderResults(results, output) {
    if (!output) return;

    if (!results.length) {
      output.innerHTML = "<p class=\"text-gray-400 text-sm\">No matching Studio systems found.</p>";
      return;
    }

    output.innerHTML = results.map((item) => {
      const disabled = String(item.entry || "").startsWith("#");
      const tag = disabled ? "div" : "a";
      const href = disabled ? "" : ` href=\"${item.entry}\"`;
      const action = disabled ? "Planned" : "Open";

      return `
        <${tag}${href} class="block rounded-2xl border border-white/10 bg-[#2C3E50] p-4 hover:border-[#FFD700] transition">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-xs uppercase tracking-wide text-[#FFD700]">${item.category}</p>
              <h3 class="text-xl font-bold text-white mt-1">${item.name}</h3>
            </div>
            <span class="text-xs px-3 py-1 rounded-full border border-white/20 text-gray-200">${item.status}</span>
          </div>
          <p class="text-gray-300 text-sm mt-3">${(item.keywords || []).slice(0, 6).join(" • ")}</p>
          <p class="text-[#FFD700] text-sm mt-3">${action} →</p>
        </${tag}>`;
    }).join("");
  }

  async function initKnowledgeSearch() {
    const input = document.querySelector("[data-knowledge-search]");
    const output = document.querySelector("[data-knowledge-results]");

    if (!input || !output) return;

    try {
      const response = await fetch(INDEX_URL, { cache: "no-store" });
      if (!response.ok) throw new Error(`Knowledge index failed: ${response.status}`);

      const index = await response.json();
      const modules = index.modules || [];

      renderResults(modules, output);

      input.addEventListener("input", () => {
        const query = normalize(input.value);
        const results = query
          ? modules.filter((item) => searchableText(item).includes(query))
          : modules;

        renderResults(results, output);
      });
    } catch (error) {
      console.warn(error);
      output.innerHTML = "<p class=\"text-red-200 text-sm\">Knowledge index unavailable.</p>";
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initKnowledgeSearch);
  } else {
    initKnowledgeSearch();
  }
})();
