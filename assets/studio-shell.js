// assets/studio-shell.js
// Reusable Studio dashboard renderer.

(function () {
  function statusClasses(status) {
    if (status === "active") return "bg-emerald-400/10 text-emerald-200 border-emerald-300/40";
    return "bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]/40";
  }

  function renderStudioShell() {
    const mount = document.querySelector("[data-studio-modules]");
    const modules = window.VOLTAN_STUDIO_MODULES || [];
    if (!mount || !modules.length) return;

    mount.innerHTML = modules.map((module) => {
      const disabled = module.href.startsWith("#");
      const tag = disabled ? "div" : "a";
      const href = disabled ? "" : ` href=\"${module.href}\"`;
      const disabledClass = disabled ? " opacity-80" : " hover:-translate-y-1 hover:border-[#FFD700]";
      return `<${tag}${href} id="${module.id}" class="block bg-[#2C3E50] p-6 rounded-2xl border border-white/10 shadow-lg transition${disabledClass}"><div class="flex items-start justify-between gap-4 mb-4"><div class="text-5xl">${module.icon}</div><span class="text-[11px] uppercase tracking-wide px-3 py-1 rounded-full border ${statusClasses(module.status)}">${module.status}</span></div><p class="text-xs uppercase tracking-wide text-[#FFD700] mb-2">${module.category}</p><h2 class="text-2xl font-bold text-white mb-3">${module.title}</h2><p class="text-gray-300 text-sm leading-relaxed">${module.description}</p></${tag}>`;
    }).join("");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", renderStudioShell);
  else renderStudioShell();
})();
