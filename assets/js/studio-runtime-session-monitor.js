// assets/js/studio-runtime-session-monitor.js
// Phase 2 Build 1 runtime session monitor for VoltanLabs Studio.

(function () {
  const VERSION = "2.0.0";
  const startedAt = performance.now();
  const session = {
    version: VERSION,
    id: `runtime-session-${Date.now()}`,
    startedAt: new Date().toISOString(),
    status: "booting",
    manifest: null,
    modules: {},
    events: [],
    healthChecks: [],
    summary: {
      totalModules: 0,
      loadedModules: 0,
      failedModules: 0,
      warningModules: 0,
      elapsedMs: 0
    }
  };

  function nowMs() { return Math.round(performance.now() - startedAt); }
  function asArray(value) { return Array.isArray(value) ? value : []; }
  function safeDetail(detail) {
    try { return JSON.parse(JSON.stringify(detail || {})); }
    catch { return { note: "detail could not be serialized" }; }
  }
  function emitUpdate(reason) {
    session.summary.elapsedMs = nowMs();
    window.VOLTAN_RUNTIME_SESSION = session;
    document.dispatchEvent(new CustomEvent("runtime:session-updated", { detail: { reason, session } }));
  }
  function pushEvent(name, detail) {
    session.events.push({ name, at: new Date().toISOString(), elapsedMs: nowMs(), detail: safeDetail(detail) });
    if (session.events.length > 60) session.events.shift();
  }
  function ensureModule(module) {
    if (!module || !module.id) return null;
    if (!session.modules[module.id]) {
      session.modules[module.id] = {
        id: module.id,
        label: module.label || module.id,
        script: module.script || null,
        phase: module.phase || null,
        requires: asArray(module.requires),
        emits: asArray(module.emits),
        required: !!module.required,
        failureBehavior: module.failureBehavior || "unknown",
        status: "pending",
        startedMs: null,
        endedMs: null,
        durationMs: null,
        error: null
      };
    }
    return session.modules[module.id];
  }
  function recomputeSummary() {
    const modules = Object.values(session.modules);
    session.summary.totalModules = modules.length || (session.manifest && asArray(session.manifest.modules).length) || 0;
    session.summary.loadedModules = modules.filter((module) => module.status === "loaded").length;
    session.summary.failedModules = modules.filter((module) => module.status === "failed").length;
    session.summary.warningModules = modules.filter((module) => module.status === "warning").length;
    session.summary.elapsedMs = nowMs();
  }
  function markModule(module, status, detail) {
    const record = ensureModule(module);
    if (!record) return;
    if (record.startedMs === null) record.startedMs = nowMs();
    record.status = status;
    record.endedMs = nowMs();
    record.durationMs = Math.max(0, record.endedMs - record.startedMs);
    if (detail && detail.error) record.error = String(detail.error);
    recomputeSummary();
    emitUpdate(`module:${status}`);
  }
  function registerManifest(manifest) {
    session.manifest = manifest || null;
    asArray(manifest && manifest.modules).forEach((module) => ensureModule(module));
    recomputeSummary();
    emitUpdate("manifest-ready");
  }
  function exportMarkdown() {
    const lines = [
      `# Runtime Session ${session.id}`,
      "",
      `Status: ${session.status}`,
      `Started: ${session.startedAt}`,
      `Elapsed: ${session.summary.elapsedMs}ms`,
      "",
      "## Modules",
      ...Object.values(session.modules).map((module) => `- ${module.status}: ${module.id} (${module.durationMs ?? "pending"}ms)`),
      "",
      "## Events",
      ...session.events.map((event) => `- ${event.elapsedMs}ms — ${event.name}`)
    ];
    return lines.join("\n");
  }

  document.addEventListener("studio:boot", (event) => {
    session.status = "booting";
    pushEvent("studio:boot", event.detail);
    emitUpdate("boot-started");
  });
  document.addEventListener("runtime:manifest-ready", (event) => {
    pushEvent("runtime:manifest-ready", event.detail);
    registerManifest(event.detail && event.detail.manifest);
  });
  document.addEventListener("runtime:module-loaded", (event) => {
    pushEvent("runtime:module-loaded", event.detail);
    markModule(event.detail && event.detail.module, "loaded", event.detail);
  });
  document.addEventListener("runtime:module-failed", (event) => {
    pushEvent("runtime:module-failed", event.detail);
    markModule(event.detail && event.detail.module, "failed", event.detail);
  });
  document.addEventListener("runtime:ready", (event) => {
    session.status = session.summary.failedModules ? "warning" : "ready";
    pushEvent("runtime:ready", event.detail);
    recomputeSummary();
    emitUpdate("runtime-ready");
  });
  document.addEventListener("runtime:failed", (event) => {
    session.status = "failed";
    pushEvent("runtime:failed", event.detail);
    recomputeSummary();
    emitUpdate("runtime-failed");
  });
  document.addEventListener("runtime:health-check", (event) => {
    session.healthChecks.push({ at: new Date().toISOString(), elapsedMs: nowMs(), detail: safeDetail(event.detail) });
    if (session.healthChecks.length > 20) session.healthChecks.shift();
    pushEvent("runtime:health-check", event.detail);
    emitUpdate("health-check");
  });

  window.VOLTAN_RUNTIME_SESSION = session;
  window.VoltanRuntimeSessionMonitor = {
    version: VERSION,
    getSession: () => session,
    exportMarkdown,
    recompute: () => { recomputeSummary(); emitUpdate("manual-recompute"); return session; }
  };

  emitUpdate("monitor-ready");
})();
