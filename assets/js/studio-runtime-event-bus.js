// assets/js/studio-runtime-event-bus.js
// Phase 2 Build 2 shared runtime event bus for VoltanLabs Studio.

(function () {
  const VERSION = "2.1.0";
  const startedAt = performance.now();
  const subscribers = new Set();
  const history = [];
  const mirroredEvents = [
    "studio:boot",
    "runtime:manifest-ready",
    "runtime:module-loaded",
    "runtime:module-failed",
    "runtime:ready",
    "runtime:failed",
    "runtime:health-check",
    "runtime:session-updated"
  ];
  let isPublishing = false;

  function nowMs() { return Math.round(performance.now() - startedAt); }
  function safeDetail(detail) {
    try { return JSON.parse(JSON.stringify(detail || {})); }
    catch { return { note: "detail could not be serialized" }; }
  }
  function normalizeEvent(name, detail, options) {
    return {
      id: `runtime-event-${Date.now()}-${history.length}`,
      name,
      channel: options && options.channel || name.split(":")[0] || "runtime",
      source: options && options.source || "browser-event",
      at: new Date().toISOString(),
      elapsedMs: nowMs(),
      severity: options && options.severity || (name.includes("failed") ? "error" : "info"),
      detail: safeDetail(detail)
    };
  }
  function notify(entry) {
    subscribers.forEach((callback) => {
      try { callback(entry, history.slice()); }
      catch (error) { console.warn("Runtime event subscriber failed", error); }
    });
  }
  function publish(name, detail, options) {
    const entry = normalizeEvent(name, detail, options);
    history.push(entry);
    if (history.length > 120) history.shift();
    window.VOLTAN_RUNTIME_EVENTS = history;
    notify(entry);
    if (!(options && options.silentDom) && !isPublishing) {
      isPublishing = true;
      document.dispatchEvent(new CustomEvent("runtime:event-bus-published", { detail: { entry, history: history.slice() } }));
      isPublishing = false;
    }
    return entry;
  }
  function subscribe(callback, options) {
    if (typeof callback !== "function") return () => {};
    subscribers.add(callback);
    if (options && options.replay) history.forEach((entry) => callback(entry, history.slice()));
    return () => subscribers.delete(callback);
  }
  function getHistory(filter) {
    if (!filter) return history.slice();
    return history.filter((entry) => {
      if (filter.name && entry.name !== filter.name) return false;
      if (filter.channel && entry.channel !== filter.channel) return false;
      if (filter.severity && entry.severity !== filter.severity) return false;
      return true;
    });
  }
  function exportMarkdown() {
    return [
      "# Runtime Event Bus Export",
      "",
      `Version: ${VERSION}`,
      `Events: ${history.length}`,
      "",
      ...history.map((entry) => `- ${entry.elapsedMs}ms [${entry.severity}] ${entry.name} (${entry.source})`)
    ].join("\n");
  }

  mirroredEvents.forEach((eventName) => {
    document.addEventListener(eventName, (event) => {
      publish(eventName, event.detail, { source: "dom", silentDom: true, severity: eventName.includes("failed") ? "error" : "info" });
    });
  });

  window.VOLTAN_RUNTIME_EVENTS = history;
  window.VoltanRuntimeEventBus = {
    version: VERSION,
    publish,
    subscribe,
    getHistory,
    exportMarkdown,
    clear: () => { history.splice(0, history.length); window.VOLTAN_RUNTIME_EVENTS = history; }
  };

  publish("runtime:event-bus-ready", { version: VERSION }, { source: "event-bus", silentDom: true });
})();
