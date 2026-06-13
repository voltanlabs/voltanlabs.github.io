// assets/js/databytedex-action-router.js
(function () {
  const COLLECTION_KEY = "vl_databyte_discovery_collection_v2";

  function spriteNameFromCard(card) {
    return card?.querySelector("h3, strong")?.textContent?.trim() || "";
  }

  function readCollection() {
    try { return JSON.parse(localStorage.getItem(COLLECTION_KEY)) || []; } catch { return []; }
  }

  function spriteIdByName(name) {
    const sprite = readCollection().find((item) => item && item.name === name);
    return sprite?.id || "";
  }

  function originalButtonFor(label, name) {
    const collectionList = document.getElementById("collectionList");
    if (!collectionList) return null;
    const cards = Array.from(collectionList.querySelectorAll("article, button, div"));
    const sourceCard = cards.find((card) => spriteNameFromCard(card) === name);
    if (!sourceCard) return null;
    const buttons = Array.from(sourceCard.querySelectorAll("button"));
    return buttons.find((button) => button.textContent.trim().toLowerCase().includes(label));
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

      if (label.includes("view dex") || label.includes("codex") || label.includes("dex")) {
        event.preventDefault();
        event.stopPropagation();
        if (typeof window.openDex === "function") window.openDex(name);
        else originalButtonFor("dex", name)?.click();
        return;
      }

      if (label.includes("decompile")) {
        event.preventDefault();
        event.stopPropagation();
        const id = spriteIdByName(name);
        if (id && typeof window.decompileSprite === "function") window.decompileSprite(id);
        else originalButtonFor("decompile", name)?.click();
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
