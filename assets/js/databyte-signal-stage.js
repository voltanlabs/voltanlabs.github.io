// assets/js/databyte-signal-stage.js
(function () {
  let open = false;
  let lastName = "";

  function stage() { return document.querySelector("#gamePanel .scan-bg"); }
  function core() { return stage()?.querySelector(".relative.z-10"); }
  function text(id) { return document.getElementById(id)?.textContent?.trim() || ""; }

  function num(textValue, fallback) {
    const value = Number(String(textValue || "").replace(/[^0-9]/g, ""));
    return Number.isFinite(value) && value > 0 ? Math.min(100, value) : fallback;
  }

  function data() {
    const name = text("encounterName");
    if (!name || name === "Awaiting Signal" || name === "Unknown Signal") return null;
    const rarity = text("encounterRarity") || "Signal";
    const chance = text("chanceText") || "?";
    const stability = text("stabilityText") || "?";
    const rarityLower = rarity.toLowerCase();
    const signalPct = rarityLower.includes("legendary") ? 96 : rarityLower.includes("epic") ? 88 : rarityLower.includes("rare") ? 78 : 62;
    return {
      name,
      rarity,
      type: text("encounterType") || "Unknown",
      icon: text("encounterIcon") || "◈",
      hp: text("statHp") || "?",
      atk: text("statAtk") || "?",
      def: text("statDef") || "?",
      stability,
      chance,
      chancePct: num(chance, 20),
      signalPct,
      lore: text("encounterLore") || "No signal lore decoded."
    };
  }

  function styles() {
    if (document.getElementById("databyteSignalStageStyles")) return;
    const s = document.createElement("style");
    s.id = "databyteSignalStageStyles";
    s.textContent = `
      body:has(#displaySignalBtn:not(.hidden)) #encounterCard{display:none!important}
      .db-signal-display-btn{margin-top:12px;border:1px solid rgba(255,215,0,.55);background:rgba(255,215,0,.13);color:#FFD700;border-radius:16px;padding:11px 16px;font-size:12px;font-weight:900;letter-spacing:.12em;text-transform:uppercase}
      .db-signal-overlay{position:absolute;inset:0;z-index:14;border-radius:inherit;background:transparent;padding:18px;display:grid;grid-template-rows:1fr auto;gap:12px;overflow:auto;overscroll-behavior:contain}.db-signal-overlay.hidden{display:none!important}
      .db-signal-screen{min-height:100%;display:grid;grid-template-rows:auto 1fr auto;gap:10px;text-align:center}.db-signal-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;text-align:left}.db-signal-kicker{font-size:10px;color:#FFD700;text-transform:uppercase;letter-spacing:.25em}.db-signal-name{font-size:clamp(1.7rem,7vw,3.6rem);font-weight:900;color:#fff;line-height:1.02;margin-top:5px}.db-signal-type{font-size:12px;color:#BAE6FD;margin-top:6px}.db-signal-orb{display:grid;place-items:center;align-self:center}.db-signal-icon{width:clamp(150px,36vw,260px);height:clamp(150px,36vw,260px);border-radius:999px;border:1px solid rgba(0,123,255,.62);background:rgba(0,123,255,.20);display:grid;place-items:center;font-size:clamp(4.5rem,16vw,8rem);box-shadow:0 0 44px rgba(0,123,255,.34)}.db-signal-lore{color:#CBD5E1;font-size:13px;line-height:1.42;margin:8px auto 0;max-width:520px}.db-signal-bottom{display:grid;gap:9px}.db-signal-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.db-signal-stat{background:rgba(0,0,0,.28);border:1px solid rgba(125,211,252,.18);border-radius:16px;padding:9px;text-align:center}.db-signal-stat span{display:block;color:#94A3B8;font-size:10px;text-transform:uppercase;letter-spacing:.13em}.db-signal-stat strong{color:#FFD700;font-size:clamp(1.2rem,4vw,1.8rem)}.db-signal-meter{background:rgba(15,23,42,.76);border:1px solid rgba(125,211,252,.20);border-radius:14px;padding:9px 10px;text-align:left}.db-signal-meter span{display:flex;justify-content:space-between;gap:10px;color:#BAE6FD;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.12em}.db-signal-meter strong{color:#FFD700}.db-signal-track{height:7px;background:rgba(255,255,255,.12);border-radius:999px;margin-top:7px;overflow:hidden}.db-signal-fill{height:100%;width:var(--fill);background:linear-gradient(90deg,rgba(34,211,238,.9),rgba(255,215,0,.9));border-radius:inherit}.db-signal-actions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}.db-signal-actions button{border-radius:15px;padding:12px 8px;font-size:12px;font-weight:900;border:1px solid rgba(255,255,255,.16);background:rgba(15,23,42,.72);color:#E5E7EB}.db-signal-actions [data-signal-action=capture]{background:#FFD700;color:#111827;border-color:#FFD700}.db-signal-actions [data-signal-action=battle]{color:#fecaca;border-color:rgba(252,165,165,.45);background:rgba(239,68,68,.12)}
      @media(max-width:768px){.db-signal-overlay{padding:14px}.db-signal-screen{gap:8px}.db-signal-actions{grid-template-columns:1fr}.db-signal-head{display:block;text-align:center}.db-signal-lore{font-size:12px}.db-signal-icon{width:142px;height:142px;font-size:4.5rem}.db-signal-stats{gap:6px}.db-signal-stat{padding:8px}}
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

  function meter(label, value, fill) {
    return `<div class="db-signal-meter"><span>${label}<strong>${value}</strong></span><div class="db-signal-track"><div class="db-signal-fill" style="--fill:${fill}%"></div></div></div>`;
  }

  function show() {
    const d = data();
    const o = overlay();
    if (!d || !o) return;
    open = true;
    core()?.classList.add("hidden");
    o.classList.remove("hidden");
    o.innerHTML = `<div class="db-signal-screen"><div class="db-signal-head"><div><div class="db-signal-kicker">${d.rarity}</div><div class="db-signal-name">${d.name}</div><div class="db-signal-type">${d.type}</div></div></div><div class="db-signal-orb"><div class="db-signal-icon">${d.icon}</div><p class="db-signal-lore">${d.lore}</p></div><div class="db-signal-bottom"><div class="db-signal-stats"><div class="db-signal-stat"><span>HP</span><strong>${d.hp}</strong></div><div class="db-signal-stat"><span>ATK</span><strong>${d.atk}</strong></div><div class="db-signal-stat"><span>DEF</span><strong>${d.def}</strong></div></div>${meter("Signal", `${d.signalPct}%`, d.signalPct)}${meter("Capture", d.chance, d.chancePct)}${meter("Rarity", d.rarity, d.signalPct)}<div class="db-signal-meter"><span>Stability<strong>${d.stability}</strong></span><div class="db-signal-track"><div class="db-signal-fill" style="--fill:${num(d.stability, 35)}%"></div></div></div><div class="db-signal-actions"><button type="button" data-signal-action="capture">Throw ByteCoin</button><button type="button" data-signal-action="battle">Battle Signal</button><button type="button" data-signal-action="return">Return</button></div></div></div>`;
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