// assets/js/studio-runtime-loader.js
// Manifest-driven browser runtime loader for VoltanLabs Studio modules.

(function () {
  const DEFAULT_MANIFEST = "/studio/runtime/load-order.json";
  const loaded = new Set();
  const failed = new Map();

  function emit(name, detail) {
    document.dispatchEvent(new CustomEvent(name, { detail: detail || {} }));
  }

  function runtimeError(message, detail) {
    console.warn(message, detail || "");
    const boot = document.querySelector(".dd-boot-sub");
    if (boot) boot.textContent = message;
  }

  async function fetchJson(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`Unable to load runtime manifest: ${response.status}`);
    return response.json();
  }

  function loadScript(module) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[data-runtime-module="${module.id}"]`);
      if (existing) {
        loaded.add(module.id);
        resolve(module);
        return;
      }

      const script = document.createElement("script");
      script.src = module.script;
      script.async = false;
      script.dataset.runtimeModule = module.id;
      script.onload = () => {
        loaded.add(module.id);
        emit("runtime:module-loaded", { module });
        asArray(module.emits).forEach((eventName) => emit(eventName, { module }));
        resolve(module);
      };
      script.onerror = () => {
        failed.set(module.id, module);
        emit("runtime:module-failed", { module });
        const error = new Error(`Runtime module failed: ${module.id}`);
        if (module.required) reject(error);
        else resolve(module);
      };
      document.body.appendChild(script);
    });
  }

  function asArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function canLoad(module) {
    return asArray(module.requires).every((id) => loaded.has(id) || failed.has(id));
  }

  async function loadModules(modules) {
    const pending = modules.slice();
    let progress = true;

    while (pending.length && progress) {
      progress = false;
      for (let index = 0; index < pending.length; index += 1) {
        const module = pending[index];
        if (!canLoad(module)) continue;
        pending.splice(index, 1);
        index -= 1;
        progress = true;
        await loadScript(module);
      }
    }

    if (pending.length) {
      const missing = pending.map((module) => module.id).join(", ");
      throw new Error(`Runtime dependency cycle or missing dependency: ${missing}`);
    }
  }

  async function boot(manifestUrl) {
    const url = manifestUrl || document.currentScript && document.currentScript.dataset.manifest || DEFAULT_MANIFEST;
    emit("studio:boot", { manifestUrl: url });

    try {
      const manifest = await fetchJson(url);
      emit("runtime:manifest-ready", { manifest });
      await loadModules(asArray(manifest.modules));
      emit("runtime:ready", { manifest, loaded: Array.from(loaded), failed: Array.from(failed.keys()) });
    } catch (error) {
      emit("runtime:failed", { error: String(error) });
      runtimeError("Runtime loader failed. Check console for details.", error);
    }
  }

  window.VoltnRuntimeLoader = { boot, loaded, failed };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => boot());
  } else {
    boot();
  }
})();
