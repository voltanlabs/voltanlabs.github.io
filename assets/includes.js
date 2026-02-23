/* assets/includes.js */
async function inject(selector, url) {
  const mount = document.querySelector(selector);
  if (!mount) return;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
    mount.innerHTML = await res.text();
  } catch (e) {
    console.warn(e);
  }
}

// Inject global header/footer
inject("#vl-header", "/partials/header.html");
inject("#vl-footer", "/partials/footer.html");
