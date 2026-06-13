// assets/js/databytedex-action-router.js
(function () {
  function spriteNameFromCard(card) {
    return card?.querySelector("h3")?.textContent?.trim() || "";
  }

  function spriteIdByName(name) {
    try {
      const list = JSON.parse(localStorage.getItem("vl_databyte_discovery_collection_v2")) || [];
      const sprite = list.find((item) => item && item.name === name);
      return sprite?.id || "";
    } catch {
      return "";
    }
  }

  function bindRouter() {
    const body = document.getElementById("databyteSimpleConsoleBody");
    if (!body || body.dataset.databytedexRouterBound) return;
    body.dataset.databytedexRouterBound = "true";

    body.addEventListener("click", function (event) {
      const button = event.target.closest("button");
      if (!button || !body.contains(button)) return;

      const label = button.textContent.trim().toLowerCase();
      const card = button.closest("article, button, div");
      const name = spriteNameFromCard(card);
      if (!name) return;

      if (label.includes("view dex")) {
        event.preventDefault();
        event.stopPropagation();
        if (typeof window.openDex === "function") window.openDex(name);
        return;
      }

      if (label.includes("decompile")) {
        event.preventDefault();
        event.stopPropagation();
        const id = spriteIdByName(name);
        if (id && typeof window.decompileSprite === "function") window.decompileSprite(id);
      }
    }, true);
  }

  function boot() {
    bindRouter();
    setInterval(bindRouter, 500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
