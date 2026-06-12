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
}

window.VOLTAN_INCLUDES_VERSION = "2026-06-12-b";

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