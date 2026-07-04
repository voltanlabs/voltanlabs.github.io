// assets/js/studio-runtime-dependency-graph.js
// Phase 2 Build 3 live runtime dependency graph for VoltanLabs Studio.

(function () {
  const VERSION = "2.2.0";
  let latestGraph = null;

  function asArray(value) { return Array.isArray(value) ? value : []; }
  function byId(items) { return new Map(asArray(items).map((item) => [item.id, item])); }
  function statusOf(module, session) {
    const record = session && session.modules && session.modules[module.id];
    if (record && record.status) return record.status;
    if (!module.requires || !module.requires.length) return "waiting";
    return "blocked";
  }
  function buildGraph(manifest, session) {
    const modules = asArray(manifest && manifest.modules);
    const moduleMap = byId(modules);
    const nodes = modules.map((module) => {
      const missing = asArray(module.requires).filter((id) => !moduleMap.has(id));
      const blockedBy = asArray(module.requires).filter((id) => {
        const dep = session && session.modules && session.modules[id];
        return dep && dep.status === "failed";
      });
      return {
        id: module.id,
        label: module.label || module.id,
        phase: module.phase || "unassigned",
        required: !!module.required,
        status: missing.length ? "missing-dependency" : blockedBy.length ? "blocked" : statusOf(module, session),
        requires: asArray(module.requires),
        emits: asArray(module.emits),
        missing,
        blockedBy,
        script: module.script || null
      };
    });
    const edges = modules.flatMap((module) => asArray(module.requires).map((source) => ({
      source,
      target: module.id,
      status: moduleMap.has(source) ? "linked" : "missing-source"
    })));
    const phases = [...new Set(nodes.map((node) => node.phase))].map((phase) => ({
      id: phase,
      nodes: nodes.filter((node) => node.phase === phase).map((node) => node.id)
    }));
    const risk = {
      missingDependencies: nodes.filter((node) => node.missing.length).length,
      blockedModules: nodes.filter((node) => node.status === "blocked").length,
      failedModules: nodes.filter((node) => node.status === "failed").length,
      waitingModules: nodes.filter((node) => node.status === "waiting" || node.status === "pending").length
    };
    return { version: VERSION, generatedAt: new Date().toISOString(), nodes, edges, phases, risk };
  }
  function cssFor(status) {
    if (status === "loaded") return "border-emerald-300/40 bg-emerald-950/20";
    if (status === "failed" || status === "missing-dependency") return "border-red-400/50 bg-red-950/30";
    if (status === "blocked") return "border-yellow-300/50 bg-yellow-950/30";
    return "border-white/10 bg-black/25";
  }
  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
  }
  function renderGraph(graph, targetId) {
    const output = document.getElementById(targetId || "runtimeDependencyGraph");
    if (!output || !graph) return;
    const riskCards = [
      ["Nodes", graph.nodes.length],
      ["Edges", graph.edges.length],
      ["Missing", graph.risk.missingDependencies],
      ["Blocked", graph.risk.blockedModules],
      ["Failed", graph.risk.failedModules],
      ["Waiting", graph.risk.waitingModules]
    ].map(([label, value]) => `<div class="rounded-xl border border-white/10 bg-[#2C3E50] p-4"><p class="text-gray-300 text-xs">${label}</p><strong class="text-2xl text-[#FFD700]">${value}</strong></div>`).join("");
    const phaseColumns = graph.phases.map((phase) => {
      const nodes = phase.nodes.map((id) => graph.nodes.find((node) => node.id === id)).filter(Boolean);
      const cards = nodes.map((node) => `<article class="rounded-xl border ${cssFor(node.status)} p-4"><p class="text-xs uppercase tracking-wide text-gray-400">${escapeHtml(node.status)}</p><h3 class="font-bold text-white mt-1">${escapeHtml(node.label)}</h3><p class="text-xs text-gray-400 mt-2">${escapeHtml(node.id)}</p><p class="text-xs text-gray-500 mt-2">Requires: ${escapeHtml(node.requires.join(" • ") || "none")}</p>${node.missing.length ? `<p class="text-xs text-red-200 mt-2">Missing: ${escapeHtml(node.missing.join(" • "))}</p>` : ""}${node.blockedBy.length ? `<p class="text-xs text-yellow-200 mt-2">Blocked by: ${escapeHtml(node.blockedBy.join(" • "))}</p>` : ""}</article>`).join("");
      return `<section class="rounded-2xl border border-white/10 bg-black/20 p-4"><h3 class="text-lg font-bold text-[#FFD700]">${escapeHtml(phase.id)}</h3><div class="grid gap-3 mt-3">${cards || "<p>No modules.</p>"}</div></section>`;
    }).join("");
    const edges = graph.edges.map((edge) => `<li class="border-t border-white/10 py-2"><span class="text-[#FFD700]">${escapeHtml(edge.source)}</span> → ${escapeHtml(edge.target)} <span class="text-gray-500">${escapeHtml(edge.status)}</span></li>`).join("");
    output.innerHTML = `<article class="rounded-2xl border border-white/10 bg-black/25 p-5"><p class="text-xs uppercase tracking-wide text-[#FFD700]">Build 3</p><h2 class="text-2xl font-bold text-[#FFD700] mt-1">Live Runtime Dependency Graph</h2><p class="text-gray-300 mt-3">Visualizes runtime modules by phase, dependency edges, active status, blocked modules, failed modules, waiting modules, and missing dependency chains.</p><div class="grid sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">${riskCards}</div><div class="grid lg:grid-cols-2 gap-4 mt-5">${phaseColumns}</div><details class="mt-5"><summary class="cursor-pointer text-[#FFD700] font-bold">Dependency Edges</summary><ul class="mt-3 text-sm">${edges || "<li>No dependency edges.</li>"}</ul></details></article>`;
  }
  function updateFromRuntime(reason) {
    const session = window.VOLTAN_RUNTIME_SESSION;
    const manifest = session && session.manifest || window.VOLTAN_RUNTIME_MANIFEST;
    if (!manifest) return null;
    latestGraph = buildGraph(manifest, session);
    window.VOLTAN_RUNTIME_GRAPH = latestGraph;
    renderGraph(latestGraph);
    const bus = window.VoltanRuntimeEventBus;
    if (bus) bus.publish("runtime:dependency-graph-updated", { reason, graph: latestGraph }, { source: "dependency-graph" });
    return latestGraph;
  }

  document.addEventListener("runtime:manifest-ready", (event) => {
    window.VOLTAN_RUNTIME_MANIFEST = event.detail && event.detail.manifest;
    updateFromRuntime("manifest-ready");
  });
  document.addEventListener("runtime:session-updated", (event) => updateFromRuntime(event.detail && event.detail.reason || "session-updated"));
  document.addEventListener("runtime:event-bus-published", (event) => {
    const name = event.detail && event.detail.entry && event.detail.entry.name;
    if (name && name.startsWith("runtime:module")) updateFromRuntime(name);
  });

  window.VoltanRuntimeDependencyGraph = {
    version: VERSION,
    build: buildGraph,
    render: renderGraph,
    update: updateFromRuntime,
    getGraph: () => latestGraph
  };
})();
