// assets/js/databyte-admin-tabs-stable.js
(function () {
  const STORE_KEY = "vl_databyte_admin_console_tab";
  const VALID = new Set(["profile", "missions", "inventory", "evolution", "signals", "research"]);

  function getActive() {
    const saved = localStorage.getItem(STORE_KEY) || "profile";
    return VALID.has(saved) ? saved : "profile";
  }

  function setActive(id) {
    if (!VALID.has(id)) return;
    localStorage.setItem(STORE_KEY, id);
    paint(id);
  }

  function paint(id) {
    document.querySelectorAll("[data-db-console-tab]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.dbConsoleTab === id);
    });
  }

  function bind() {
    const host = document.querySelector(".db-console-tabs");
    if (!host || host.dataset.stableTabsBound) return;
    host.dataset.stableTabsBound = "true";
    host.addEventListener("pointerdown", function (event) {
      const button = event.target.closest("[data-db-console-tab]");
      if (!button) return;
      setActive(button.dataset.dbConsoleTab);
    }, true);
    host.addEventListener("click", function (event) {
      const button = event.target.closest("[data-db-console-tab]");
      if (!button) return;
      setActive(button.dataset.dbConsoleTab);
    }, true);
  }

  function boot() {
    bind();
    paint(getActive());
    setInterval(function () {
      bind();
      paint(getActive());
    }, 300);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
