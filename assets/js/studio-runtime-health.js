// assets/js/studio-runtime-health.js
// Lightweight runtime health panel for Data Discovery manifest boot.

(function () {
  if (!location.pathname.includes("databyte-discovery")) return;

  const state = {
    manifest: null,
    loaded: [],
    failed: [],
    events: []
  };

  function addEvent(name, detail) {
    state.events.push({ name, detail, at: new Date().toISOString() });
    if (state.events.length > 8) state.events.shift();
    render();
  }

  function ensurePanel() {
    let panel = document.getElementById("runtimeHealthPanel");
    if (panel) return panel;

    panel = document.createElement("aside");
    panel.id = "runtimeHealthPanel";
    panel.style.cssText = "position:fixed;right:10px;bottom:10px;z-index:9999;max-width:310px;background:rgba(7,17,31,.88);border:1px solid rgba(125,211,252,.28);border-radius:16px;padding:12px;color:#e5f6ff;font:12px system-ui,sans-serif;box-shadow:0 0 28px rgba(0,123,255,.18);backdrop-filter:blur(10px)";
    document.body.appendChild(panel);
    return panel;
  }

  function render() {
    const panel = ensurePanel();
    const total = state.manifest && Array.isArray(state.manifest.modules) ? state.manifest.modules.length : 0;
    const loaded = state.loaded.length;
    const failed = state.failed.length;
    const status = failed ? "Warning" : loaded && total && loaded >= total ? "Ready" : "Booting";

    panel.innerHTML = `
      <div style="display:flex;justify-content:space-between;gap:10px;align-items:center">
        <strong style="color:#FFD700">Runtime Health</strong>
        <span>${status}</span>
      </div>
      <div style="margin-top:8px;color:#BAE6FD">Loaded: ${loaded}/${total || "?"} • Failed: ${failed}</div>
      <div style="margin-top:8px;display:grid;gap:4px">
        ${state.events.slice(-5).map((entry) => `<div style="border-top:1px solid rgba(255,255,255,.08);padding-top:4px">${entry.name}</div>`).join("")}
      </div>`;
  }

  document.addEventListener("runtime:manifest-ready", (event) => {
    state.manifest = event.detail && event.detail.manifest;
    addEvent("runtime:manifest-ready", event.detail);
  });

  document.addEventListener("runtime:module-loaded", (event) => {
    const id = event.detail && event.detail.module && event.detail.module.id;
    if (id && !state.loaded.includes(id)) state.loaded.push(id);
    addEvent(`loaded:${id || "module"}`, event.detail);
  });

  document.addEventListener("runtime:module-failed", (event) => {
    const id = event.detail && event.detail.module && event.detail.module.id;
    if (id && !state.failed.includes(id)) state.failed.push(id);
    addEvent(`failed:${id || "module"}`, event.detail);
  });

  document.addEventListener("runtime:ready", (event) => {
    addEvent("runtime:ready", event.detail);
  });

  document.addEventListener("runtime:failed", (event) => {
    addEvent("runtime:failed", event.detail);
  });

  render();
})();
