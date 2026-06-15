// assets/js/databyte-signal-stage.js
(function () {
  let open = false;
  let lastName = "";

  function stage() { return document.querySelector("#gamePanel .scan-bg"); }
  function core() { return stage()?.querySelector(".relative.z-10"); }
  function text(id) { return document.getElementById(id)?.textContent?.trim() || ""; }

  function data() {
    const name = text("encounterName");
    if (!name || name === "Awaiting Signal" || name === "Unknown Signal") return null;
    return {
      name,
      rarity: text("encounterRarity") || "Signal",
      type: text("encounterType") || "Unknown",
      icon: text("encounterIcon") || "◈",
      hp: text("statHp") || "?",
      atk: text("statAtk") || "?",
      def: text("statDef") || "?",
      stability: text("stabilityText") || "?",
      chance: text("chanceText") || "?",
      lore: text("encounterLore") || "No signal lore decoded."
    };
  }

  function styles() {
    if (document.getElementById("databyteSignalStageStyles")) return;
    const s = document.createElement("style");
    s.id = "databyteSignalStageStyles";
    s.textContent = `
      .db-signal-display-btn{margin-top:12px;border:1px solid rgba(255,215,0,.45);background:rgba(255,215,0,.12);color:#FFD700;border-radius:14px;padding:10px 14px;font-size:12px;font-weight:900}
      .db-signal-overlay{position:absolute;inset:0;z-index:14;border-radius:inherit;background:radial-gradient(circle at top,rgba(0,123,255,.22),transparent 44%),rgba(2,6,23,.92);padding:16px;display:grid;place-items:center;overflow:auto;overscroll-behavior:contain}.db-signal-overlay.hidden{display:none!important}
      .db-signal-card{width:min(540px,100%);border:1px solid rgba(255,215,0,.36);background:rgba(15,23,42,.86);border-radius:24px;padding:18px;box-shadow:0 24px 80px rgba(0,0,0,.34)}
      .db-signal-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.db-signal-kicker{font-size:10px;color:#FFD700;text-transform:uppercase;letter-spacing:.22em}.db-signal-name{font-size:clamp(1.45rem,6vw,2.5rem);font-weight:900;color:#fff;line-height:1.05;margin-top:4px}.db-signal-type{font-size:12px;color:#BAE6FD;margin-top:5px}.db-signal-icon{font-size:clamp(3.5rem,16vw,6.2rem);line-height:1}
      .db-signal-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:14px}.db-signal-stat{background:rgba(0,0,0,.25);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:10px;text-align:center}.db-signal-stat span{display:block;color:#94A3B8;font-size:10px;text-transform:uppercase;letter-spacing:.12em}.db-signal-stat strong{color:#FFD700;font-size:18px}.db-signal-lore{margin-top:14px;color:#CBD5E1;font-size:13px;line-height:1.45}.db-signal-meta{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px;color:#CBD5E1;font-size:12px}.db-signal-meta div{background:rgba(0,0,0,.20);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:9px}.db-signal-actions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:14px}.db-signal-actions button{border-radius:13px;padding:11px 8px;font-size:11px;font-weight:900;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.08);color:#E5E7EB}.db-signal-actions [data-signal-action=capture]{background:#FFD700;color:#111827;border-color:#FFD700}.db-signal-actions [data-signal-action=battle]{color:#fecaca;border-color:rgba(252,165,165,.45);background:rgba(239,68,68,.12)}
      @media(max-width:768px){.db-signal-overlay{padding:12px}.db-signal-card{padding:14px}.db-signal-actions{grid-template-columns:1fr}.db-signal-meta{grid-template-columns:1fr}}
    `;
    document.head.appendChild(s);
  }

  function overlay() {
    styles();
    const host = stage();
    if (!host) return null;
    if (getComputedStyle(host).position === "static") host.style.position = "relative";
    let o = document.getElementById("databyteSignalOverlay");
    if (!o) {
      o = document.createElement("div");
      o.id = "databyteSignalOverlay";
      o.className = "db-signal-overlay hidden";
      host.appendChild(o);
    }
    return o;
  }

  function button() {
    const c = core();
    if (!c) return;
    let b = document.getElementById("displaySignalBtn");
    if (!b) {
      b = document.createElement("button");
      b.id = "displaySignalBtn";
      b.type = "button";
      b.className = "db-signal-display-btn hidden";
      b.textContent = "Display Signal";
      c.appendChild(b);
      b.addEventListener("click", show);
    }
    b.classList.toggle("hidden", !data());
  }

  function show() {
    const d = data();
    const o = overlay();
    if (!d || !o) return;
    open = true;
    core()?.classList.add("hidden");
    o.classList.remove("hidden");
    o.innerHTML = `<div class="db-signal-card"><div class="db-signal-top"><div><div class="db-signal-kicker">${d.rarity}</div><div class="db-signal-name">${d.name}</div><div class="db-signal-type">${d.type}</div></div><div class="db-signal-icon">${d.icon}</div></div><div class="db-signal-stats"><div class="db-signal-stat"><span>HP</span><strong>${d.hp}</strong></div><div class="db-signal-stat"><span>ATK</span><strong>${d.atk}</strong></div><div class="db-signal-stat"><span>DEF</span><strong>${d.def}</strong></div></div><p class="db-signal-lore">${d.lore}</p><div class="db-signal-meta"><div>Stability<br><strong>${d.stability}</strong></div><div>ByteCoin Chance<br><strong>${d.chance}</strong></div></div><div class="db-signal-actions"><button type="button" data-signal-action="capture">Throw ByteCoin</button><button type="button" data-signal-action="battle">Battle Signal</button><button type="button" data-signal-action="return">Return</button></div></div>`;
    o.querySelector("[data-signal-action='capture']")?.addEventListener("click", function () { document.getElementById("captureBtn")?.click(); show(); });
    o.querySelector("[data-signal-action='battle']")?.addEventListener("click", function () { hide(); setTimeout(function () { document.getElementById("startBattleBtn")?.click(); }, 80); });
    o.querySelector("[data-signal-action='return']")?.addEventListener("click", hide);
  }

  function hide() {
    open = false;
    document.getElementById("databyteSignalOverlay")?.classList.add("hidden");
    core()?.classList.remove("hidden");
    button();
  }

  function sync() {
    const name = data()?.name || "";
    if (name !== lastName) {
      lastName = name;
      open = false;
      document.getElementById("databyteSignalOverlay")?.classList.add("hidden");
      core()?.classList.remove("hidden");
    }
    button();
  }

  function boot() {
    styles(); overlay(); button(); sync();
    const target = document.getElementById("encounterName");
    if (target) new MutationObserver(sync).observe(target, { childList: true, characterData: true, subtree: true });
    window.addEventListener("databyte:inventory-updated", function () { if (open) show(); });
    setInterval(sync, 1500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();