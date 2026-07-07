// assets/js/studio-phase37-ownership-validator.js
// Phase 3.7 Step 3: ownership-aware diagnostics extension for Data Discovery.
(function () {
  const RULES_PATH = "/studio/validation/rules.json";
  const RUNTIME_PATH = "/studio/runtime/load-order.json";
  const SOURCE_FILES_PATH = "/studio/databytesprites/source-files.json";
  const KNOWLEDGE_PATH = "/studio/knowledge/index.v2.json";

  const EXPECTED = {
    app: "databyte-discovery-product-app-v3-5",
    battle: "dd-battle-resolver",
    capture: "dd-capture-runtime",
    encounter: "dd-encounter-runtime",
    rules: "dd-gameplay-rules-2-4",
    engine: "dd-battle-engine-2-4",
    balance: "dd-battle-balance-2-4",
    roster: "dd-canon-roster",
    bridge: "dd-studio-data-bridge"
  };
  const VISUAL_ONLY = new Set(["dd-health-signal-bridge", "dd-scan-bg"]);
  const LEGACY_STATUSES = new Set(["legacy-reference", "archive", "retire-candidate", "remove-candidate"]);

  function asArray(value) { return Array.isArray(value) ? value : []; }
  function esc(value) {
    return String(value ?? "").replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
  }
  async function fetchJson(path) {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) throw new Error(path + " HTTP " + response.status);
    return response.json();
  }
  function finding(severity, rule, message, detail) {
    return { severity, rule, message, detail: detail || null };
  }
  function sourceRecords(sourceFiles) { return asArray(sourceFiles && sourceFiles.sourceFiles); }
  function runtimeModules(runtime) { return asArray(runtime && runtime.modules); }
  function sourceById(sourceFiles) {
    const map = new Map();
    sourceRecords(sourceFiles).forEach((item) => map.set(item.id, item));
    return map;
  }
  function moduleById(runtime) {
    const map = new Map();
    runtimeModules(runtime).forEach((item) => map.set(item.id, item));
    return map;
  }
  function isActiveOwner(record) {
    return String(record && record.status || "").toLowerCase() === "active-owner";
  }
  function hasTag(record, term) {
    const haystack = [record && record.name, record && record.description].concat(asArray(record && record.tags)).join(" ").toLowerCase();
    return haystack.includes(term.toLowerCase());
  }

  function validateCanonicalOwners(runtime, sourceFiles, knowledge, rules) {
    const findings = [];
    const modules = moduleById(runtime);
    const sources = sourceById(sourceFiles);
    const owners = rules && rules.canonicalRuntime && rules.canonicalRuntime.gameplayOwnership ? rules.canonicalRuntime.gameplayOwnership : EXPECTED;

    Object.entries(EXPECTED).forEach(([role, id]) => {
      const runtimeModule = modules.get(id);
      const sourceRecord = sources.get("src-" + id) || sources.get(id);
      if (!runtimeModule) findings.push(finding("error", "canonical-runtime-ownership", `${id} missing from runtime manifest`, { role, id, path: RUNTIME_PATH }));
      else if (runtimeModule.status && runtimeModule.status !== "active") findings.push(finding("warning", "canonical-runtime-ownership", `${id} runtime status is ${runtimeModule.status}, expected active`, runtimeModule));
      if (!sourceRecord) findings.push(finding("warning", "canonical-runtime-ownership", `${id} missing from source-files index`, { role, id, path: SOURCE_FILES_PATH }));
      else if (!isActiveOwner(sourceRecord)) findings.push(finding("warning", "canonical-runtime-ownership", `${id} source status is ${sourceRecord.status}, expected active-owner`, sourceRecord));
    });

    if (String(runtime && runtime.runtime || "") !== EXPECTED.app) {
      findings.push(finding("error", "canonical-runtime-ownership", `Runtime manifest points to ${runtime && runtime.runtime}, expected ${EXPECTED.app}`, { path: RUNTIME_PATH }));
    }
    const registeredOwnerIds = new Set(asArray(knowledge && knowledge.runtimeOwners).map((item) => item.id));
    [EXPECTED.app, EXPECTED.battle, EXPECTED.capture, EXPECTED.encounter, EXPECTED.rules].forEach((id) => {
      if (!registeredOwnerIds.has(id)) findings.push(finding("warning", "canonical-runtime-ownership", `${id} not registered as a Knowledge Engine runtime owner`, { id, path: KNOWLEDGE_PATH }));
    });

    Object.entries(owners).forEach(([role, id]) => {
      if (!Object.values(EXPECTED).includes(id) && role !== "ui") {
        findings.push(finding("info", "canonical-runtime-ownership", `Rules manifest maps ${role} to ${id}; verify this remains intentional`, { role, id, path: RULES_PATH }));
      }
    });
    return findings;
  }

  function validateDuplicateGameplayOwners(sourceFiles) {
    const findings = [];
    const groups = {
      battle: sourceRecords(sourceFiles).filter((item) => isActiveOwner(item) && (hasTag(item, "battle") || hasTag(item, "damage") || hasTag(item, "enemy ai"))),
      capture: sourceRecords(sourceFiles).filter((item) => isActiveOwner(item) && (hasTag(item, "capture") || hasTag(item, "odds") || hasTag(item, "bytecoins"))),
      encounter: sourceRecords(sourceFiles).filter((item) => isActiveOwner(item) && (hasTag(item, "encounter") || hasTag(item, "scanner") || hasTag(item, "rarity pools"))),
      ui: sourceRecords(sourceFiles).filter((item) => isActiveOwner(item) && (hasTag(item, "product app") || hasTag(item, "ui orchestrator") || hasTag(item, "hp rings")))
    };
    const expectedByGroup = {
      battle: new Set(["src-dd-battle-resolver", "src-dd-battle-engine-2-4", "src-dd-battle-balance-2-4"]),
      capture: new Set(["src-dd-capture-runtime", "src-dd-gameplay-rules-2-4", "src-dd-battle-balance-2-4"]),
      encounter: new Set(["src-dd-encounter-runtime", "src-databyte-discovery-product-app-v3-5"]),
      ui: new Set(["src-databyte-discovery-product-app-v3-5"])
    };
    Object.entries(groups).forEach(([group, records]) => {
      const unexpected = records.filter((item) => !expectedByGroup[group].has(item.id));
      unexpected.forEach((item) => findings.push(finding("warning", "duplicate-gameplay-ownership", `${item.name || item.id} is active-owner and appears to overlap ${group} ownership`, item)));
    });
    sourceRecords(sourceFiles).forEach((item) => {
      const status = String(item.status || "").toLowerCase();
      if (LEGACY_STATUSES.has(status) && asArray(item.tags).some((tag) => String(tag).toLowerCase().includes("active owner"))) {
        findings.push(finding("warning", "duplicate-gameplay-ownership", `${item.name || item.id} is ${item.status} but still tagged like an active owner`, item));
      }
      if (VISUAL_ONLY.has(String(item.id || "").replace(/^src-/, "")) && isActiveOwner(item)) {
        findings.push(finding("warning", "duplicate-gameplay-ownership", `${item.name || item.id} is visual-only but marked active-owner`, item));
      }
    });
    return findings;
  }

  function validateProductUiCanon(runtime, sourceFiles, rules) {
    const findings = [];
    const source = sourceById(sourceFiles).get("src-databyte-discovery-product-app-v3-5");
    const uiText = [source && source.description].concat(asArray(source && source.tags)).join(" ").toLowerCase();
    ["hp rings", "signal meter", "canonical"].forEach((term) => {
      if (!uiText.includes(term)) findings.push(finding("warning", "product-app-ui-regression", `Product App v3.5 source index should mention ${term}`, source));
    });
    const deprecated = asArray(rules && rules.canonicalRuntime && rules.canonicalRuntime.uiCanon && rules.canonicalRuntime.uiCanon.deprecated);
    if (!deprecated.some((item) => String(item).toLowerCase().includes("horizontal"))) {
      findings.push(finding("warning", "product-app-ui-regression", "Rules manifest should mark horizontal battle HP bars as deprecated", { path: RULES_PATH }));
    }
    return findings;
  }

  function renderPanel(report) {
    const host = document.getElementById("diagnostics");
    if (!host) return;
    const errors = report.findings.filter((item) => item.severity === "error").length;
    const warnings = report.findings.filter((item) => item.severity === "warning").length;
    const ok = errors === 0;
    const list = report.findings.slice(0, 12).map((item) => `<li class="mb-2"><span class="text-gray-300">${esc(item.rule)}</span>: ${esc(item.message)}</li>`).join("");
    host.insertAdjacentHTML("afterbegin", `<article class="lg:col-span-2 rounded-2xl border ${ok ? "border-emerald-300/40 bg-emerald-950/20" : "border-yellow-300/40 bg-yellow-950/20"} p-5">
      <p class="text-xs uppercase tracking-wide text-[#FFD700]">Phase 3.7</p>
      <h2 class="text-2xl font-bold text-[#FFD700] mt-1">Runtime Ownership Validation</h2>
      <p class="text-gray-300 mt-3">Validated Product App v3.5, split gameplay owners, visual-only compatibility layers, and UI canon against the runtime manifest, source index, Knowledge Engine, and validation rules.</p>
      <div class="grid md:grid-cols-4 gap-3 mt-4 text-sm">
        <div class="rounded-xl border border-white/10 p-3"><b>${report.ownerCount}</b><br><span class="text-gray-300">canonical owners</span></div>
        <div class="rounded-xl border border-white/10 p-3"><b>${errors}</b><br><span class="text-gray-300">errors</span></div>
        <div class="rounded-xl border border-white/10 p-3"><b>${warnings}</b><br><span class="text-gray-300">warnings</span></div>
        <div class="rounded-xl border border-white/10 p-3"><b>${report.ready ? "Ready" : "Review"}</b><br><span class="text-gray-300">status</span></div>
      </div>
      ${list ? `<ul class="mt-4 text-sm list-disc ml-5">${list}</ul>` : `<p class="text-emerald-200 mt-4">No Phase 3.7 ownership findings.</p>`}
    </article>`);
  }

  async function run() {
    try {
      const [rules, runtime, sourceFiles, knowledge] = await Promise.all([
        fetchJson(RULES_PATH), fetchJson(RUNTIME_PATH), fetchJson(SOURCE_FILES_PATH), fetchJson(KNOWLEDGE_PATH)
      ]);
      const findings = []
        .concat(validateCanonicalOwners(runtime, sourceFiles, knowledge, rules))
        .concat(validateDuplicateGameplayOwners(sourceFiles))
        .concat(validateProductUiCanon(runtime, sourceFiles, rules));
      const report = {
        version: "0.1.0",
        phase: "3.7-diagnostics-alignment",
        checkedAt: new Date().toISOString(),
        ownerCount: Object.keys(EXPECTED).length,
        findings,
        ready: !findings.some((item) => item.severity === "error")
      };
      window.STUDIO_PHASE37_OWNERSHIP_REPORT = report;
      document.dispatchEvent(new CustomEvent("studio:phase37-ownership-report", { detail: report }));
      renderPanel(report);
    } catch (error) {
      const report = { version: "0.1.0", phase: "3.7-diagnostics-alignment", ready: false, findings: [finding("error", "phase37-ownership-extension", String(error))] };
      window.STUDIO_PHASE37_OWNERSHIP_REPORT = report;
      renderPanel(report);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => setTimeout(run, 450));
  else setTimeout(run, 450);
})();
