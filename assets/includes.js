// assets/includes.js

async function inject(selector, url) {
  const mount = document.querySelector(selector);
  if (!mount) return false;

  try {
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`Failed ${url}: ${res.status}`);
    }

    mount.innerHTML = await res.text();
    return true;
  } catch (e) {
    console.warn(e);
    return false;
  }
}

function initVoltanHeader() {
  const btn = document.getElementById("vlMenuBtn");
  const menu = document.getElementById("vlSiteMenu");

  if (!btn || !menu) return;

  // Prevent double-binding
  if (btn.dataset.bound === "1") return;
  btn.dataset.bound = "1";

  function setOpen(open) {
    menu.classList.toggle("hidden", !open);
    btn.setAttribute("aria-expanded", String(open));

    // Highlight hamburger while open
    if (open) {
      btn.classList.add(
        "bg-white/20",
        "border-[#FFD700]",
        "ring-2",
        "ring-[#FFD700]/60"
      );
    } else {
      btn.classList.remove(
        "bg-white/20",
        "border-[#FFD700]",
        "ring-2",
        "ring-[#FFD700]/60"
      );
    }
  }

  btn.addEventListener("click", () => {
    const willOpen = menu.classList.contains("hidden");
    setOpen(willOpen);
  });

  menu.addEventListener("click", (e) => {
    if (e.target && e.target.tagName === "A") {
      setOpen(false);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      setOpen(false);
    }
  });
}

function highlightActiveNav() {
  const current = window.location.pathname;

  document.querySelectorAll("nav a").forEach((link) => {
    const href = link.getAttribute("href");

    if (!href) return;

    const normalizedHref = href.replace("/index.html", "/");

    const normalizedCurrent =
      current === "/index.html"
        ? "/"
        : current;

    const normalizedCompare =
      normalizedHref === "/"
        ? "/"
        : normalizedHref.replace(".html", "");

    if (
      normalizedCurrent === normalizedHref ||
      normalizedCurrent.startsWith(normalizedCompare)
    ) {
      link.classList.add(
        "bg-white/15",
        "text-[#FFD700]",
        "border",
        "border-[#FFD700]/40"
      );
    }
  });
}

function initDataDiscoveryPatchHook() {
  if (!window.location.pathname.includes("databyte-discovery")) return;
  window.DD_PATCH_HOOK_READY = true;
  window.DD_ENCOUNTER_GROUPS = [
    [0,1,2],[3,4,5],[6,7,8],[9,10,11],[12,13,14],[15],[16,17,18],[19,20,21],
    [22,23,24],[25,26,27],[28,29,30],[31],[32],[33],[34,35,36],[37,38],[39,40,41],
    [42],[43,44],[45,46],[47],[48],[49],[50,51]
  ];
  window.DD_STAGE_WEIGHTS = { one:[100], two:[80,20], three:[70,25,5] };
  window.DD_WEIGHTED_PREP_READY = true;
}

window.VOLTAN_INCLUDES_VERSION = "2026-06-12-c2";

(async function boot() {
  const headerInjected = await inject(
    "#vl-header",
    "/partials/header.html"
  );

  await inject(
    "#vl-footer",
    "/partials/footer.html"
  );

  // Initialize after header loads
  if (headerInjected) {
    initVoltanHeader();
    highlightActiveNav();
  }

  initDataDiscoveryPatchHook();
})();