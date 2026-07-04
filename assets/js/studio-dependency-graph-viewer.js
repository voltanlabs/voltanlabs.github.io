// assets/js/studio-dependency-graph-viewer.js
// Phase 2.0 Dependency Graph Viewer for VoltanLabs Studio Diagnostics.

(function () {
  const SCRIPT_VERSION = "2.0.0";

  function asArray(value) { return Array.isArray(value) ? value : []; }
  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
  }

  function nodeKey(value) { return String(value || "unknown").trim() || "unknown"; }

  function buildGraphModel(report) {
    const edges = asArray(report && report.dependencyExplorer);
    const nodes = new Map();

    function ensureNode(id, meta) {
      const key = nodeKey(id);
      if (!nodes.has(key)) {
        nodes.set(key, {
          id: key,
          label: meta && meta.label ? meta.label : key,
          kind: meta && meta.kind ? meta.kind : "unknown",
          source: meta && meta.source ? meta.source : null,
          path: meta && meta.path ? meta.path : null,
          inbound: 0,
          outbound: 0,
          unresolved: false
        });
      }
      return nodes.get(key);
    }

    const graphEdges = edges.map((edge, index) => {
      const from = ensureNode(edge.from || edge.fromTitle, { label: edge.fromTitle || edge.from, kind: edge.fromKind, source: edge.source, path: edge.sourcePath });
      const targetId = edge.resolvedTarget || edge.target;
      const to = ensureNode(targetId, { label: edge.target, kind: edge.targetSource || "target", source: edge.targetSource, path: edge.targetPath });
      from.outbound += 1;
      to.inbound += 1;
      if (edge.status !== "resolved") to.unresolved = true;
      return {
        id: `edge-${index + 1}`,
        from: from.id,
        to: to.id,
        field: edge.field || "reference",
        status: edge.status || "unknown",
        source: edge.source || null,
        sourcePath: edge.sourcePath || null,
        targetPath: edge.targetPath || null
      };
    });

    const nodeList = [...nodes.values()].sort((a, b) => (b.inbound + b.outbound) - (a.inbound + a.outbound) || a.id.localeCompare(b.id));
    const orphanHints = nodeList.filter((node) => node.inbound === 0 || node.outbound === 0).slice(0, 20);
    const unresolvedEdges = graphEdges.filter((edge) => edge.status !== "resolved");
    const circularHints = findCircularHints(graphEdges);

    return {
      generatedAt: new Date().toISOString(),
      scriptVersion: SCRIPT_VERSION,
      nodeCount: nodeList.length,
      edgeCount: graphEdges.length,
      resolvedEdgeCount: graphEdges.filter((edge) => edge.status === "resolved").length,
      unresolvedEdgeCount: unresolvedEdges.length,
      orphanHintCount: orphanHints.length,
      circularHintCount: circularHints.length,
      nodes: nodeList,
      edges: graphEdges,
      unresolvedEdges,
      orphanHints,
      circularHints
    };
  }

  function findCircularHints(edges) {
    const adjacency = new Map();
    edges.filter((edge) => edge.status === "resolved").forEach((edge) => {
      if (!adjacency.has(edge.from)) adjacency.set(edge.from, new Set());
      adjacency.get(edge.from).add(edge.to);
    });
    const hints = [];
    adjacency.forEach((targets, from) => {
      targets.forEach((target) => {
        if (adjacency.has(target) && adjacency.get(target).has(from)) {
          const pair = [from, target].sort().join(" -> ");
          if (!hints.some((item) => item.key === pair)) hints.push({ key: pair, from, to: target, type: "two-way-reference" });
        }
      });
    });
    return hints.slice(0, 20);
  }

  function exportGraph(graph) {
    const activeGraph = graph || buildGraphModel(window.VOLTAN_VALIDATION_REPORT || {});
    const blob = new Blob([JSON.stringify(activeGraph, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `voltanlabs-dependency-graph-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function renderNodeCloud(graph, filter) {
    const mode = filter || "all";
    let nodes = graph.nodes;
    if (mode === "unresolved") nodes = nodes.filter((node) => node.unresolved);
    if (mode === "entry") nodes = nodes.filter((node) => node.inbound === 0);
    if (mode === "terminal") nodes = nodes.filter((node) => node.outbound === 0);
    return nodes.slice(0, 32).map((node) => {
      const weight = Math.min(3, Math.max(1, Math.ceil((node.inbound + node.outbound) / 5)));
      const tone = node.unresolved ? "border-red-300/50 bg-red-950/30" : node.inbound === 0 || node.outbound === 0 ? "border-yellow-300/40 bg-yellow-950/20" : "border-emerald-300/30 bg-emerald-950/20";
      return `<button type="button" data-graph-node="${escapeHtml(node.id)}" class="text-left rounded-xl border ${tone} p-${weight + 2} hover:border-[#FFD700] transition">
        <p class="font-bold text-white text-sm">${escapeHtml(node.label)}</p>
        <p class="text-xs text-gray-400 mt-1">in ${node.inbound} • out ${node.outbound}</p>
      </button>`;
    }).join("") || "<p class=\"text-gray-300\">No nodes match this filter.</p>";
  }

  function renderEdgeList(graph, filter) {
    const mode = filter || "all";
    let edges = graph.edges;
    if (mode === "unresolved") edges = edges.filter((edge) => edge.status !== "resolved");
    if (mode === "resolved") edges = edges.filter((edge) => edge.status === "resolved");
    return edges.slice(0, 30).map((edge) => `<li class="mb-2 rounded-lg border border-white/10 bg-black/20 p-3">
      <span class="text-[#FFD700]">${escapeHtml(edge.from)}</span>
      <span class="text-gray-400"> ${escapeHtml(edge.field)} </span>
      <span class="${edge.status === "resolved" ? "text-emerald-200" : "text-red-200"}">→ ${escapeHtml(edge.to)}</span>
      <span class="text-xs text-gray-500 ml-2">${escapeHtml(edge.status)}</span>
    </li>`).join("") || "<li class=\"text-gray-300\">No edges match this filter.</li>";
  }

  function renderGraphPanel(report) {
    const output = document.getElementById("diagnostics");
    if (!output || !report) return;
    const existing = document.getElementById("dependencyGraphViewer");
    if (existing) existing.remove();
    const graph = buildGraphModel(report);
    report.dependencyGraph = graph;

    output.insertAdjacentHTML("afterbegin", `<section id="dependencyGraphViewer" class="lg:col-span-2 rounded-2xl border border-[#007BFF]/40 bg-[#0d1d31]/90 p-5">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-wide text-[#FFD700]">Phase 2.0 Dependency Graph Viewer</p>
          <h2 class="text-2xl font-bold text-[#FFD700] mt-1">Repository Relationship Map</h2>
          <p class="text-gray-300 mt-3">Maps source-aware links from runtime requirements, lore relations, assets, dex refs, moves, abilities, and mechanics graph edges. This creates the visual base for future circular dependency and orphan repair tools.</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button id="exportDependencyGraph" class="px-3 py-2 rounded-xl border border-[#FFD700] text-[#FFD700] text-sm font-bold">Export Graph</button>
        </div>
      </div>
      <div class="grid md:grid-cols-5 gap-3 mt-5">
        <div class="rounded-xl border border-white/10 bg-black/25 p-4"><p class="text-gray-400 text-sm">Nodes</p><strong class="text-2xl text-[#FFD700]">${graph.nodeCount}</strong></div>
        <div class="rounded-xl border border-white/10 bg-black/25 p-4"><p class="text-gray-400 text-sm">Edges</p><strong class="text-2xl text-[#FFD700]">${graph.edgeCount}</strong></div>
        <div class="rounded-xl border border-white/10 bg-black/25 p-4"><p class="text-gray-400 text-sm">Resolved</p><strong class="text-2xl text-[#FFD700]">${graph.resolvedEdgeCount}</strong></div>
        <div class="rounded-xl border border-white/10 bg-black/25 p-4"><p class="text-gray-400 text-sm">Unresolved</p><strong class="text-2xl text-[#FFD700]">${graph.unresolvedEdgeCount}</strong></div>
        <div class="rounded-xl border border-white/10 bg-black/25 p-4"><p class="text-gray-400 text-sm">Circular Hints</p><strong class="text-2xl text-[#FFD700]">${graph.circularHintCount}</strong></div>
      </div>
      <div class="flex flex-wrap gap-2 mt-5">
        <button data-graph-filter="all" class="graph-filter px-3 py-2 rounded-xl bg-[#007BFF] text-white text-sm font-bold">All</button>
        <button data-graph-filter="unresolved" class="graph-filter px-3 py-2 rounded-xl border border-red-300/40 text-red-100 text-sm font-bold">Unresolved</button>
        <button data-graph-filter="entry" class="graph-filter px-3 py-2 rounded-xl border border-yellow-300/40 text-yellow-100 text-sm font-bold">Entry Nodes</button>
        <button data-graph-filter="terminal" class="graph-filter px-3 py-2 rounded-xl border border-white/20 text-white text-sm font-bold">Terminal Nodes</button>
      </div>
      <div class="grid lg:grid-cols-2 gap-5 mt-5">
        <div class="rounded-xl border border-white/10 bg-black/20 p-4">
          <h3 class="font-bold text-white">Node Cloud</h3>
          <div id="dependencyNodeCloud" class="grid sm:grid-cols-2 gap-3 mt-4">${renderNodeCloud(graph, "all")}</div>
        </div>
        <div class="rounded-xl border border-white/10 bg-black/20 p-4">
          <h3 class="font-bold text-white">Edge Stream</h3>
          <ul id="dependencyEdgeList" class="mt-4 text-sm">${renderEdgeList(graph, "all")}</ul>
        </div>
      </div>
      <div class="grid md:grid-cols-2 gap-5 mt-5">
        <div class="rounded-xl border border-white/10 bg-black/20 p-4"><h3 class="font-bold text-white">Orphan / Endpoint Hints</h3><ul class="text-sm text-gray-200 list-disc ml-5 mt-3">${graph.orphanHints.slice(0, 10).map((node) => `<li>${escapeHtml(node.label)} — in ${node.inbound}, out ${node.outbound}</li>`).join("") || "<li>No endpoint hints.</li>"}</ul></div>
        <div class="rounded-xl border border-white/10 bg-black/20 p-4"><h3 class="font-bold text-white">Circular Hints</h3><ul class="text-sm text-gray-200 list-disc ml-5 mt-3">${graph.circularHints.slice(0, 10).map((hint) => `<li>${escapeHtml(hint.from)} ↔ ${escapeHtml(hint.to)}</li>`).join("") || "<li>No circular hints detected.</li>"}</ul></div>
      </div>
    </section>`);

    const exportButton = document.getElementById("exportDependencyGraph");
    if (exportButton) exportButton.addEventListener("click", () => exportGraph(graph));
    document.querySelectorAll(".graph-filter").forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.getAttribute("data-graph-filter") || "all";
        const nodeCloud = document.getElementById("dependencyNodeCloud");
        const edgeList = document.getElementById("dependencyEdgeList");
        if (nodeCloud) nodeCloud.innerHTML = renderNodeCloud(graph, filter);
        if (edgeList) edgeList.innerHTML = renderEdgeList(graph, filter === "entry" || filter === "terminal" ? "all" : filter);
      });
    });
  }

  function boot() {
    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      if (window.VOLTAN_VALIDATION_REPORT) {
        renderGraphPanel(window.VOLTAN_VALIDATION_REPORT);
        window.clearInterval(timer);
      }
      if (attempts > 80) window.clearInterval(timer);
    }, 250);
  }

  window.VoltanDependencyGraphViewer = { version: SCRIPT_VERSION, buildGraphModel, exportGraph, renderGraphPanel };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
