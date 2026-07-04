// assets/js/studio-validation-engine.js
// Phase 1.2 Repository Integrity Engine for VoltanLabs Studio Diagnostics.

(function () {
  const SOURCE_REGISTRY = "/studio/diagnostics/sources.json";
  const RULES_MANIFEST = "/studio/validation/rules.json";
  const ENGINE_VERSION = "1.2.1";
  let latestReport = null;

  function asArray(value) { return Array.isArray(value) ? value : []; }
  function compact(values) { return values.filter((value) => value !== undefined && value !== null && value !== ""); }
  function unique(values) { return [...new Set(compact(values))]; }
  function flatten(value) {
    if (Array.isArray(value)) return value.flatMap(flatten);
    if (value && typeof value === "object") return Object.values(value).flatMap(flatten);
    return value === undefined || value === null ? [] : [String(value)];
  }
  function splitCollection(collection) { return String(collection || "").split(",").map((name) => name.trim()).filter(Boolean); }
  function getCollection(data, collection) {
    if (collection === "file") return [];
    return splitCollection(collection).flatMap((name) => asArray(data[name]));
  }
  function idOf(item) { return item.id || item.attackingElement || item.name || item.label || ""; }
  function titleOf(item) { return item.name || item.label || item.attackingElement || item.id || "record"; }
  function normalize(value) { return String(value || "").trim().toLowerCase(); }
  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
  }

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

  function finding(severity, rule, message, detail) { return { severity, rule, message, detail: detail || null }; }

  function buildRepositoryModel(records, rules) {
    const ids = new Map();
    const aliases = new Map();
    const references = [];
    const graphNodes = new Set();
    const graphEdges = [];
    const reverseReferences = new Map();
    const sourceIndex = new Map();

    function addId(id, record, item) {
      if (!id) return;
      const key = String(id);
      if (!ids.has(key)) ids.set(key, []);
      ids.get(key).push({ sourceId: record.id, kind: record.kind, label: record.label, itemTitle: titleOf(item), path: record.path });
      aliases.set(normalize(key), key);
      sourceIndex.set(key, { sourceId: record.id, kind: record.kind, label: record.label, path: record.path });
    }

    function addAlias(alias, canonical) {
      if (!alias || !canonical) return;
      aliases.set(normalize(alias), canonical);
    }

    asArray(rules.knownGlobalIds).forEach((id) => {
      ids.set(id, [{ sourceId: "validation-rules", kind: "knownGlobalId", label: "Validation Rules", itemTitle: id, path: RULES_MANIFEST }]);
      addAlias(id, id);
    });

    records.forEach((record) => {
      record.items.forEach((item) => {
        const id = idOf(item);
        addId(id, record, item);
        addAlias(titleOf(item), id);
        if (item.name && item.id) addAlias(item.name, item.id);
      });

      if (record.kind === "registry") {
        asArray(record.data.indexes).forEach((item) => addId(item.id, record, item));
        asArray(record.data.modules).forEach((item) => addId(item.id, record, item));
      }

      if (record.kind === "mechanicsGraph") {
        asArray(record.data.nodes).forEach((node) => { addId(node.id, record, node); graphNodes.add(node.id); });
        asArray(record.data.edges).forEach((edge) => graphEdges.push(edge));
      }
    });

    ids.set("*", [{ sourceId: "wildcard", kind: "wildcard", label: "Wildcard", itemTitle: "*", path: null }]);
    aliases.set("*", "*");

    records.forEach((record) => record.items.forEach((item) => collectReferences(record, item).forEach((ref) => {
      references.push(ref);
      const canonicalTarget = resolveCanonicalId(ref.target, { ids, aliases });
      if (!canonicalTarget) return;
      if (!reverseReferences.has(canonicalTarget)) reverseReferences.set(canonicalTarget, []);
      reverseReferences.get(canonicalTarget).push(ref);
    })));

    return { ids, aliases, references, graphNodes, graphEdges, reverseReferences, sourceIndex };
  }

  function resolveCanonicalId(value, model) {
    if (!value) return null;
    const direct = String(value);
    if (model.ids && model.ids.has(direct)) return direct;
    return model.aliases ? model.aliases.get(normalize(direct)) || null : null;
  }

  function collectReferences(record, item) {
    const owner = idOf(item) || titleOf(item);
    const refs = [];
    const fields = ["dependencies", "relatedSpecies", "relatedSystems", "relatedCharacters", "learnedBy", "assignedTo", "requires", "assetRefs", "dexRefs"];
    fields.forEach((field) => {
      flatten(item[field]).forEach((value) => {
        if (!value) return;
        refs.push({ owner, ownerTitle: titleOf(item), ownerKind: record.kind, field, target: value, source: record.label, sourceId: record.id, sourcePath: record.path });
      });
    });
    if (record.kind === "mechanicsGraph") {
      if (item.source) refs.push({ owner, ownerTitle: titleOf(item), ownerKind: record.kind, field: "edge.source", target: item.source, source: record.label, sourceId: record.id, sourcePath: record.path });
      if (item.target) refs.push({ owner, ownerTitle: titleOf(item), ownerKind: record.kind, field: "edge.target", target: item.target, source: record.label, sourceId: record.id, sourcePath: record.path });
    }
    return refs;
  }

  function isReferenceAllowed(ref, model) {
    if (!ref.target) return true;
    if (model.ids.has(ref.target)) return true;
    if (model.aliases.has(normalize(ref.target))) return true;
    if (String(ref.target).startsWith("/")) return true;
    if (String(ref.target).startsWith("#")) return true;
    if (String(ref.target).startsWith("future-")) return true;
    if (String(ref.target).startsWith("asset-")) return true;
    if (String(ref.target).startsWith("databytedex-")) return true;
    return false;
  }

  function validateAvailability(sources) {
    return sources.filter((source) => !source.ok).map((source) => finding("error", "registry-availability", `${source.label} failed to load: ${source.error}`, source.path));
  }

  function validateSchema(records) {
    return records.filter((source) => source.data && !source.data.schemaVersion).map((source) => finding("error", "registry-availability", `${source.label} missing schemaVersion`, source.path));
  }

  function validateRequiredFields(records) {
    const findings = [];
    records.forEach((record) => record.items.forEach((item) => {
      const id = idOf(item);
      const title = titleOf(item);
      if (!id) findings.push(finding("error", "required-fields", `${record.label}: record missing id-like field`));
      if (!title) findings.push(finding("error", "required-fields", `${record.label}: ${id || "record"} missing title-like field`));
      if (record.kind === "species" && !item.battleStats) findings.push(finding("error", "required-fields", `${title} missing battleStats`));
      if (record.kind === "species" && !asArray(item.elements).length) findings.push(finding("error", "required-fields", `${title} missing elements`));
      if (record.kind === "move" && !asArray(item.learnedBy).length) findings.push(finding("error", "required-fields", `${title} missing learnedBy`));
      if (record.kind === "ability" && !asArray(item.assignedTo).length) findings.push(finding("error", "required-fields", `${title} missing assignedTo`));
      if (record.kind === "typeChart" && !item.attackingElement) findings.push(finding("error", "required-fields", `${title} missing attackingElement`));
    }));
    return findings;
  }

  function validateDuplicateIds(model) {
    const findings = [];
    model.ids.forEach((owners, id) => {
      if (id === "*" || owners.length < 2) return;
      const activeOwners = owners.filter((owner) => owner.kind !== "knownGlobalId");
      const kinds = unique(activeOwners.map((owner) => owner.kind));
      if (activeOwners.length > 1 && kinds.length === 1) findings.push(finding("warning", "duplicate-ids", `Duplicate ${kinds[0]} id: ${id}`, activeOwners));
    });
    return findings;
  }

  function validateReferences(model) {
    return model.references
      .filter((ref) => !isReferenceAllowed(ref, model))
      .map((ref) => finding("warning", "cross-index-references", `${ref.ownerTitle} references unknown ${ref.field}: ${ref.target}`, ref));
  }

  function validateMechanicsGraph(records) {
    const findings = [];
    records.filter((record) => record.kind === "mechanicsGraph").forEach((record) => {
      const nodeIds = new Set(asArray(record.data.nodes).map((node) => node.id));
      const edgeTypes = new Set(asArray(record.data.graphModel && record.data.graphModel.edgeTypes));
      asArray(record.data.edges).forEach((edge) => {
        if (!nodeIds.has(edge.source)) findings.push(finding("error", "mechanics-graph-integrity", `Graph edge source missing: ${edge.source}`, edge));
        if (!nodeIds.has(edge.target)) findings.push(finding("error", "mechanics-graph-integrity", `Graph edge target missing: ${edge.target}`, edge));
        if (!edgeTypes.has(edge.edgeType)) findings.push(finding("error", "mechanics-graph-integrity", `Graph edge type undeclared: ${edge.edgeType}`, edge));
      });
    });
    return findings;
  }

  function validateRuntime(records) {
    const findings = [];
    records.filter((record) => record.kind === "runtime").forEach((record) => {
      const modules = asArray(record.data.modules);
      const ids = new Set(modules.map((module) => module.id));
      modules.forEach((module, index) => {
        asArray(module.requires).forEach((req) => {
          const depIndex = modules.findIndex((candidate) => candidate.id === req);
          if (!ids.has(req)) findings.push(finding("error", "runtime-load-order", `${module.id} requires missing runtime module ${req}`, module));
          else if (depIndex > index) findings.push(finding("warning", "runtime-load-order", `${module.id} loads before dependency ${req}`, module));
        });
        if (!module.script) findings.push(finding("warning", "runtime-load-order", `${module.id} missing script path`, module));
      });
    });
    return findings;
  }

  function validateOrphans(records, model) {
    const referenced = new Set(model.references.map((ref) => resolveCanonicalId(ref.target, model) || ref.target));
    const ignoredKinds = new Set(["registry", "runtime", "modules", "script"]);
    const findings = [];
    records.forEach((record) => {
      if (ignoredKinds.has(record.kind)) return;
      record.items.forEach((item) => {
        const id = idOf(item);
        if (!id || referenced.has(id)) return;
        const status = String(item.status || "").toLowerCase();
        if (["planned", "pending", "design-seed", "locked", "active-foundation"].includes(status)) return;
        findings.push(finding("info", "orphan-detection", `${titleOf(item)} is not referenced by another indexed record`, { id, kind: record.kind, source: record.label, path: record.path }));
      });
    });
    return findings;
  }

  function buildKnowledgeCoverage(records, model) {
    const trackedKinds = ["species", "move", "ability", "lore", "sourceFile", "mechanicsGraph", "runtime"];
    return trackedKinds.map((kind) => {
      const items = records.filter((record) => record.kind === kind).flatMap((record) => record.items.map((item) => ({ record, item })));
      const total = items.length;
      const referenced = items.filter(({ item }) => model.reverseReferences.has(idOf(item))).length;
      const documented = items.filter(({ item }) => item.description || item.summary || item.notes || item.status).length;
      const withDependencies = items.filter(({ item }) => collectReferences({ kind, label: "coverage", id: "coverage", path: null }, item).length).length;
      const score = total ? Math.round(((referenced + documented + withDependencies) / (total * 3)) * 100) : 100;
      return { kind, total, referenced, documented, withDependencies, score };
    });
  }

  function buildDependencyExplorer(model) {
    return model.references.slice(0, 80).map((ref) => {
      const targetId = resolveCanonicalId(ref.target, model);
      const targetSource = targetId ? model.sourceIndex.get(targetId) : null;
      return {
        from: ref.owner,
        fromTitle: ref.ownerTitle,
        fromKind: ref.ownerKind,
        field: ref.field,
        target: ref.target,
        resolvedTarget: targetId,
        source: ref.source,
        sourcePath: ref.sourcePath,
        targetSource: targetSource ? targetSource.label : null,
        targetPath: targetSource ? targetSource.path : null,
        status: targetId ? "resolved" : "unresolved"
      };
    });
  }

  function buildRepairSuggestions(findings) {
    return findings.slice(0, 12).map((item) => {
      const sourcePath = item.detail && (item.detail.sourcePath || item.detail.path || (typeof item.detail === "string" ? item.detail : null));
      const target = item.detail && item.detail.target;
      const base = { rule: item.rule, severity: item.severity, finding: item.message, sourcePath };
      if (item.rule === "cross-index-references") return { ...base, action: `Add or rename an indexed record for "${target}" or update the referencing field to an existing ID.` };
      if (item.rule === "duplicate-ids") return { ...base, action: "Rename one duplicate ID and update every reference that points to the old ID." };
      if (item.rule === "orphan-detection") return { ...base, action: "Link this record from a lore, mechanics, runtime, move, or ability index, or mark it planned/design-seed if it is intentionally parked." };
      if (item.rule === "runtime-load-order") return { ...base, action: "Move required modules earlier in load-order.json and confirm every runtime module has a script path." };
      if (item.rule === "mechanics-graph-integrity") return { ...base, action: "Add the missing mechanics graph node or correct the edge source, target, or edgeType." };
      if (item.rule === "required-fields") return { ...base, action: "Add the missing required field to the source record so it can join the repository ID graph." };
      return { ...base, action: "Review the source file and reconcile it with the active validation rule." };
    });
  }

  function dedupeFindings(findings) {
    return unique(findings.map((item) => JSON.stringify(item))).map((item) => JSON.parse(item));
  }

  function classify(findings, severity) { return findings.filter((finding) => finding.severity === severity).length; }

  function renderSummary(report) {
    const summary = document.getElementById("summary");
    if (!summary) return;
    summary.className = "grid md:grid-cols-4 xl:grid-cols-8 gap-4 mt-10";
    const cards = [
      ["Health", report.healthScore + "%"],
      ["Sources", report.sources.length],
      ["Records", report.recordCount],
      ["IDs", report.idCount],
      ["Links", report.linkCount],
      ["Errors", report.errorCount],
      ["Warnings", report.warningCount],
      ["Coverage", report.coverageScore + "%"]
    ];
    summary.innerHTML = cards.map(([label, value]) => `<div class="rounded-2xl border border-white/10 bg-[#2C3E50] p-5"><p class="text-gray-300 text-sm">${label}</p><strong class="text-3xl text-[#FFD700]">${value}</strong></div>`).join("");
  }

  function renderCoverage(report) {
    const rows = report.coverage.map((item) => `<tr class="border-t border-white/10"><td class="py-2 pr-4 text-[#FFD700]">${escapeHtml(item.kind)}</td><td class="py-2 pr-4">${item.total}</td><td class="py-2 pr-4">${item.referenced}</td><td class="py-2 pr-4">${item.documented}</td><td class="py-2 pr-4">${item.withDependencies}</td><td class="py-2">${item.score}%</td></tr>`).join("");
    return `<article class="rounded-2xl border border-white/10 bg-black/25 p-5"><p class="text-xs uppercase tracking-wide text-[#FFD700]">Repository Health Dashboard</p><h2 class="text-2xl font-bold text-[#FFD700] mt-1">Knowledge Coverage</h2><p class="text-gray-300 mt-3">Coverage scores blend references, documentation/status fields, and dependency metadata for each indexed kind.</p><div class="overflow-x-auto mt-4"><table class="w-full text-sm text-left"><thead class="text-gray-300"><tr><th class="py-2 pr-4">Kind</th><th class="py-2 pr-4">Total</th><th class="py-2 pr-4">Referenced</th><th class="py-2 pr-4">Documented</th><th class="py-2 pr-4">Linked</th><th class="py-2">Score</th></tr></thead><tbody>${rows}</tbody></table></div></article>`;
  }

  function renderDependencyExplorer(report) {
    const items = report.dependencyExplorer.slice(0, 20).map((edge) => `<li class="mb-2"><span class="text-[#FFD700]">${escapeHtml(edge.fromTitle)}</span> <span class="text-gray-400">${escapeHtml(edge.field)}</span> → <span class="${edge.status === "resolved" ? "text-emerald-200" : "text-red-200"}">${escapeHtml(edge.target)}</span><span class="text-gray-500"> ${edge.targetSource ? `(${escapeHtml(edge.targetSource)})` : "(unresolved)"}</span></li>`).join("");
    return `<article class="rounded-2xl border border-white/10 bg-black/25 p-5"><p class="text-xs uppercase tracking-wide text-[#FFD700]">Dependency Explorer</p><h2 class="text-2xl font-bold text-[#FFD700] mt-1">Cross-Index Edges</h2><p class="text-gray-300 mt-3">Source-aware links generated from runtime requirements, move/ability ownership, lore relations, assets, dex refs, and mechanics graph edges.</p><ul class="mt-4 text-sm">${items || "<li>No dependency edges found.</li>"}</ul></article>`;
  }

  function renderRepairSuggestions(report) {
    const items = report.repairSuggestions.map((item) => `<li class="mb-3"><p class="font-bold text-white">${escapeHtml(item.finding)}</p><p class="text-gray-300">${escapeHtml(item.action)}</p>${item.sourcePath ? `<p class="text-xs text-gray-500 mt-1">Source: ${escapeHtml(item.sourcePath)}</p>` : ""}</li>`).join("");
    return `<article class="rounded-2xl border border-white/10 bg-black/25 p-5"><p class="text-xs uppercase tracking-wide text-[#FFD700]">Actionable Diagnostics</p><h2 class="text-2xl font-bold text-[#FFD700] mt-1">Repair Suggestions</h2><ul class="mt-4 text-sm list-disc ml-5">${items || "<li>No repair suggestions needed.</li>"}</ul></article>`;
  }

  function renderSources(report) {
    const output = document.getElementById("diagnostics");
    if (!output) return;
    const grouped = ["error", "warning", "info"].map((severity) => {
      const items = report.findings.filter((finding) => finding.severity === severity);
      if (!items.length) return "";
      return `<section class="mt-5"><h3 class="text-lg font-bold text-[#FFD700]">${severity.toUpperCase()} Findings</h3><ul class="mt-3 text-sm text-gray-100 list-disc ml-5">${items.map((item) => `<li class="mb-2"><span class="text-gray-300">${escapeHtml(item.rule)}</span>: ${escapeHtml(item.message)}</li>`).join("")}</ul></section>`;
    }).join("");

    const sourceCards = report.sources.map((item) => `<article class="rounded-2xl border ${item.ok ? "border-emerald-300/40 bg-emerald-950/20" : "border-red-400/50 bg-red-950/30"} p-5"><p class="text-[#FFD700] text-xs uppercase tracking-wide">${escapeHtml(item.kind)}</p><h2 class="text-xl font-bold mt-1">${escapeHtml(item.label)}</h2><p class="text-gray-300 text-sm mt-3">${escapeHtml(item.path)}</p><p class="text-gray-400 text-xs mt-2">Records: ${item.count} • ${item.ms}ms</p>${item.ok ? "<p class=\"text-emerald-200 text-sm mt-4\">Loaded.</p>" : `<p class="text-red-200 text-sm mt-4">${escapeHtml(item.error)}</p>`}</article>`).join("");

    const lead = report.findings.length ? grouped : "<p class=\"text-emerald-200 mt-4\">No repository integrity findings.</p>";
    output.innerHTML = `<article class="lg:col-span-2 rounded-2xl border border-white/10 bg-black/25 p-5"><p class="text-xs uppercase tracking-wide text-[#FFD700]">Phase 1.2</p><h2 class="text-2xl font-bold text-[#FFD700] mt-1">Repository Integrity Report</h2><p class="text-gray-300 mt-3">Engine ${ENGINE_VERSION} validates source availability, required fields, cross-index references, mechanics graph edges, runtime load order, duplicate IDs, orphan records, knowledge coverage, and actionable repair paths.</p>${lead}</article>${renderCoverage(report)}${renderDependencyExplorer(report)}${renderRepairSuggestions(report)}${sourceCards}`;
  }

  async function loadSource(source) {
    const started = performance.now();
    try {
      if (source.collection === "file") {
        const text = await fetchText(source.path);
        return { ...source, ok: true, count: 1, ms: Math.round(performance.now() - started), data: null, items: [], text };
      }
      const data = await fetchJson(source.path);
      const items = getCollection(data, source.collection);
      return { ...source, ok: true, count: items.length || 1, ms: Math.round(performance.now() - started), data, items };
    } catch (error) {
      return { ...source, ok: false, count: 0, ms: Math.round(performance.now() - started), data: null, items: [], error: String(error) };
    }
  }

  async function initValidationEngine() {
    const [sourceRegistry, rules] = await Promise.all([fetchJson(SOURCE_REGISTRY), fetchJson(RULES_MANIFEST)]);
    const sources = await Promise.all(asArray(sourceRegistry.sources).map(loadSource));
    const loaded = sources.filter((source) => source.ok && source.data);
    const model = buildRepositoryModel(loaded, rules);
    const findings = dedupeFindings([
      ...validateAvailability(sources),
      ...validateSchema(loaded),
      ...validateRequiredFields(loaded),
      ...validateDuplicateIds(model),
      ...validateReferences(model),
      ...validateMechanicsGraph(loaded),
      ...validateRuntime(loaded),
      ...validateOrphans(loaded, model)
    ]);
    const coverage = buildKnowledgeCoverage(loaded, model);
    const dependencyExplorer = buildDependencyExplorer(model);
    const repairSuggestions = buildRepairSuggestions(findings);
    const errorCount = classify(findings, "error");
    const warningCount = classify(findings, "warning");
    const infoCount = classify(findings, "info");
    const recordCount = sources.reduce((sum, source) => sum + source.count, 0);
    const coverageScore = coverage.length ? Math.round(coverage.reduce((sum, item) => sum + item.score, 0) / coverage.length) : 100;
    const healthScore = Math.max(0, Math.round(100 - errorCount * 10 - warningCount * 4 - infoCount * 1 - Math.max(0, 100 - coverageScore) * 0.15));
    latestReport = {
      generatedAt: new Date().toISOString(),
      engineVersion: ENGINE_VERSION,
      rulesVersion: rules.schemaVersion,
      healthScore,
      coverageScore,
      errorCount,
      warningCount,
      infoCount,
      recordCount,
      idCount: model.ids.size,
      linkCount: model.references.length,
      sources,
      findings,
      coverage,
      dependencyExplorer,
      repairSuggestions
    };
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

  window.VoltnValidationEngine = { init: initValidationEngine, version: ENGINE_VERSION };
  window.VoltanValidationEngine = window.VoltnValidationEngine;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => { wireCopyButton(); initValidationEngine(); });
  else { wireCopyButton(); initValidationEngine(); }
})();
