// assets/js/studio-validation-engine.js
// Browser-side Validation Engine for VoltanLabs Studio Diagnostics.

(function () {
  const SOURCE_REGISTRY = "/studio/diagnostics/sources.json";
  const RULES_MANIFEST = "/studio/validation/rules.json";
  let latestReport = null;

  function asArray(value) { return Array.isArray(value) ? value : []; }
  function unique(values) { return [...new Set(values.filter(Boolean))]; }
  function flatten(value) {
    if (Array.isArray(value)) return value.flatMap(flatten);
    if (value && typeof value === "object") return Object.values(value).flatMap(flatten);
    return value === undefined || value === null ? [] : [String(value)];
  }
  function getCollection(data, collection) {
    if (collection === "file") return [];
    return String(collection || "").split(",").map((name) => name.trim()).filter(Boolean).flatMap((name) => asArray(data[name]));
  }
  function titleOf(item) { return item.name || item.label || item.attackingElement || item.id || "record"; }
  function idOf(item) { return item.id || item.attackingElement || item.name || item.label || ""; }

  async function fetchJson(path) {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) throw new Error("HTTP " + response.status);
    return response.json();
  }
  async function fetchText(path) {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) throw new Error("HTTP " + response.status);
    return response.text();
  }

  function collectIds(records, rules) {
    const ids = new Set(asArray(rules.knownGlobalIds));
    records.forEach((record) => record.items.forEach((item) => { const id = idOf(item); if (id) ids.add(id); }));
    records.forEach((record) => {
      if (record.kind === "mechanicsGraph") asArray(record.data.nodes).forEach((node) => node.id && ids.add(node.id));
      if (record.kind === "registry") asArray(record.data.indexes).forEach((item) => item.id && ids.add(item.id));
    });
    ids.add("*");
    return ids;
  }

  function validateRecordShape(record) {
    const findings = [];
    record.items.forEach((item) => {
      const id = idOf(item);
      const title = titleOf(item);
      if (!id) findings.push({ severity: "error", rule: "required-fields", message: `${record.label}: record missing id-like field` });
      if (!title) findings.push({ severity: "error", rule: "required-fields", message: `${record.label}: ${id || "record"} missing title-like field` });
      if (record.kind === "species" && !item.battleStats) findings.push({ severity: "error", rule: "required-fields", message: `${title} missing battleStats` });
      if (record.kind === "species" && !asArray(item.elements).length) findings.push({ severity: "error", rule: "required-fields", message: `${title} missing elements` });
      if (record.kind === "move" && !asArray(item.learnedBy).length) findings.push({ severity: "error", rule: "required-fields", message: `${title} missing learnedBy` });
      if (record.kind === "ability" && !asArray(item.assignedTo).length) findings.push({ severity: "error", rule: "required-fields", message: `${title} missing assignedTo` });
      if (record.kind === "typeChart" && !item.attackingElement) findings.push({ severity: "error", rule: "required-fields", message: `${title} missing attackingElement` });
    });
    return findings;
  }

  function validateDuplicateIds(records) {
    const seen = new Map();
    const findings = [];
    records.forEach((record) => record.items.forEach((item) => {
      const id = idOf(item);
      if (!id || id === "*") return;
      const key = `${record.kind}:${id}`;
      if (seen.has(key)) findings.push({ severity: "warning", rule: "duplicate-ids", message: `Duplicate ${record.kind} id: ${id}` });
      seen.set(key, true);
    }));
    return findings;
  }

  function validateReferences(records, idMap) {
    const findings = [];
    const referenceFields = ["dependencies", "relatedSpecies", "relatedSystems", "learnedBy", "assignedTo", "requires"];
    records.forEach((record) => record.items.forEach((item) => {
      referenceFields.forEach((field) => {
        flatten(item[field]).forEach((ref) => {
          if (!ref || idMap.has(ref)) return;
          findings.push({ severity: "warning", rule: "cross-index-references", message: `${titleOf(item)} references unknown ${field}: ${ref}` });
        });
      });
    }));
    return findings;
  }

  function validateMechanicsGraph(records) {
    const findings = [];
    records.filter((record) => record.kind === "mechanicsGraph").forEach((record) => {
      const nodeIds = new Set(asArray(record.data.nodes).map((node) => node.id));
      const edgeTypes = new Set(asArray(record.data.graphModel && record.data.graphModel.edgeTypes));
      asArray(record.data.edges).forEach((edge) => {
        if (!nodeIds.has(edge.source)) findings.push({ severity: "error", rule: "mechanics-graph-integrity", message: `Graph edge source missing: ${edge.source}` });
        if (!nodeIds.has(edge.target)) findings.push({ severity: "error", rule: "mechanics-graph-integrity", message: `Graph edge target missing: ${edge.target}` });
        if (edge.edgeType && !edgeTypes.has(edge.edgeType)) findings.push({ severity: "error", rule: "mechanics-graph-integrity", message: `Graph edge type undeclared: ${edge.edgeType}` });
      });
    });
    return findings;
  }

  function validateRuntime(records) {
    const findings = [];
    records.filter((record) => record.kind === "runtime").forEach((record) => {
      const modules = asArray(record.data.modules);
      const ids = new Set(modules.map((module) => module.id));
      modules.forEach((module) => {
        asArray(module.requires).forEach((req) => {
          if (!ids.has(req)) findings.push({ severity: "error", rule: "runtime-load-order", message: `${module.id} requires missing runtime module ${req}` });
        });
        if (!module.script && record.collection !== "phases") findings.push({ severity: "warning", rule: "runtime-load-order", message: `${module.id} missing script path` });
      });
    });
    return findings;
  }

  function renderSummary(report) {
    const summary = document.getElementById("summary");
    if (!summary) return;
    summary.className = "grid md:grid-cols-5 gap-4 mt-10";
    const cards = [["Health", report.healthScore + "%"], ["Sources", report.sources.length], ["Records", report.recordCount], ["Errors", report.errorCount], ["Warnings", report.warningCount]];
    summary.innerHTML = cards.map(([label, value]) => `<div class="rounded-2xl border border-white/10 bg-[#2C3E50] p-5"><p class="text-gray-300 text-sm">${label}</p><strong class="text-3xl text-[#FFD700]">${value}</strong></div>`).join("");
  }

  function renderSources(report) {
    const output = document.getElementById("diagnostics");
    if (!output) return;
    const sourceCards = report.sources.map((item) => `<article class="rounded-2xl border ${item.ok ? "border-emerald-300/40 bg-emerald-950/20" : "border-red-400/50 bg-red-950/30"} p-5"><p class="text-[#FFD700] text-xs uppercase tracking-wide">${item.kind}</p><h2 class="text-xl font-bold mt-1">${item.label}</h2><p class="text-gray-300 text-sm mt-3">${item.path}</p><p class="text-gray-400 text-xs mt-2">Records: ${item.count} • ${item.ms}ms</p>${item.ok ? "<p class=\"text-emerald-200 text-sm mt-4\">Loaded.</p>" : `<p class="text-red-200 text-sm mt-4">${item.error}</p>`}</article>`).join("");
    const findings = report.findings.length ? report.findings.map((finding) => `<li class="mb-2"><strong class="text-[#FFD700]">${finding.severity.toUpperCase()}</strong> <span class="text-gray-300">${finding.rule}</span>: ${finding.message}</li>`).join("") : "<li class=\"text-emerald-200\">No validation findings.</li>";
    output.innerHTML = `<article class="lg:col-span-2 rounded-2xl border border-white/10 bg-black/25 p-5"><h2 class="text-2xl font-bold text-[#FFD700]">Validation Findings</h2><ul class="mt-4 text-sm text-gray-100">${findings}</ul></article>${sourceCards}`;
  }

  async function loadSource(source) {
    const started = performance.now();
    try {
      if (source.collection === "file") {
        const text = await fetchText(source.path);
        return { ...source, ok: true, count: 1, ms: Math.round(performance.now() - started), data: null, items: [], text };
      }
      const data = await fetchJson(source.path);
      return { ...source, ok: true, count: getCollection(data, source.collection).length || 1, ms: Math.round(performance.now() - started), data, items: getCollection(data, source.collection) };
    } catch (error) {
      return { ...source, ok: false, count: 0, ms: Math.round(performance.now() - started), data: null, items: [], error: String(error) };
    }
  }

  async function initValidationEngine() {
    const [sourceRegistry, rules] = await Promise.all([fetchJson(SOURCE_REGISTRY), fetchJson(RULES_MANIFEST)]);
    const sources = await Promise.all(asArray(sourceRegistry.sources).map(loadSource));
    const loaded = sources.filter((source) => source.ok && source.data);
    const idMap = collectIds(loaded, rules);
    const availability = sources.filter((source) => !source.ok).map((source) => ({ severity: "error", rule: "registry-availability", message: `${source.label} failed to load: ${source.error}` }));
    const schema = loaded.filter((source) => !source.data.schemaVersion).map((source) => ({ severity: "error", rule: "registry-availability", message: `${source.label} missing schemaVersion` }));
    const findings = unique([...availability, ...schema, ...loaded.flatMap(validateRecordShape), ...validateDuplicateIds(loaded), ...validateReferences(loaded, idMap), ...validateMechanicsGraph(loaded), ...validateRuntime(loaded)].map((finding) => JSON.stringify(finding))).map((value) => JSON.parse(value));
    const errorCount = findings.filter((finding) => finding.severity === "error").length;
    const warningCount = findings.filter((finding) => finding.severity === "warning").length;
    const recordCount = sources.reduce((sum, source) => sum + source.count, 0);
    const healthScore = Math.max(0, Math.round(100 - errorCount * 8 - warningCount * 3));
    latestReport = { generatedAt: new Date().toISOString(), rulesVersion: rules.schemaVersion, healthScore, errorCount, warningCount, recordCount, sources, findings };
    window.VOLTAN_VALIDATION_REPORT = latestReport;
    renderSummary(latestReport);
    renderSources(latestReport);
  }

  function wireCopyButton() {
    const copyButton = document.getElementById("copyReport");
    if (!copyButton) return;
    copyButton.addEventListener("click", async () => {
      await navigator.clipboard.writeText(JSON.stringify(latestReport, null, 2));
      copyButton.textContent = "Copied";
    });
  }

  window.VoltnValidationEngine = { init: initValidationEngine };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => { wireCopyButton(); initValidationEngine(); });
  else { wireCopyButton(); initValidationEngine(); }
})();
