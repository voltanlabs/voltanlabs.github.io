// assets/includes.js
async function inject(selector, url) {
  const mount = document.querySelector(selector);
  if (!mount) return false;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
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

  // Prevent double-binding if this runs more than once
  if (btn.dataset.bound === "1") return;
  btn.dataset.bound = "1";

  function setOpen(open) {
  menu.classList.toggle("hidden", !open);
  btn.setAttribute("aria-expanded", String(open));

  // Highlight hamburger when open
  if (open) {
    btn.classList.add("bg-white/20", "border-[#FFD700]", "ring-2", "ring-[#FFD700]/60");
  } else {
    btn.classList.remove("bg-white/20", "border-[#FFD700]", "ring-2", "ring-[#FFD700]/60");
  }
}

  btn.addEventListener("click", () => {
    const willOpen = menu.classList.contains("hidden");
    setOpen(willOpen);
  });

  menu.addEventListener("click", (e) => {
    if (e.target && e.target.tagName === "A") setOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
}

(async function boot() {
  const headerInjected = await inject("#vl-header", "/partials/header.html");
  const footerInjected = await inject("#vl-footer", "/partials/footer.html");

  // Only init after header exists in the DOM
  if (headerInjected) initVoltanHeader();
})();
