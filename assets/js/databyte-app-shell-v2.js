// assets/js/databyte-app-shell-v2.js
(function () {
  const PROFILE_KEY = "vl_databyte_admin_profile_v1";
  const COLLECTION_KEY = "vl_databyte_discovery_collection_v2";
  const SEEN_KEY = "vl_databyte_seen_v1";
  const STYLE_ID = "databyteNativeScannerShellStyles";

  const $ = (id) => document.getElementById(id);
  let activeOverlay = null;
  let lastSignalKey = "";

  function read(key, fallback = []) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  }

  function profile() { return read(PROFILE_KEY, null); }
  function collection() { return read(COLLECTION_KEY, []); }
  function seenList() { return read(SEEN_KEY, []); }

  function injectStyles() {
    if ($(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      html:has(body.dd-native-scanner),body.dd-native-scanner{height:100%;overflow:hidden!important;background:#07111f!important;overscroll-behavior:none!important}
      body.dd-native-scanner #vl-header,body.dd-native-scanner #vl-footer,body.dd-native-scanner main>section:first-child{display:none!important}
      body.dd-native-scanner main{height:100dvh;overflow:hidden}
      body.dd-native-scanner #registrationPanel{min-height:100dvh;display:grid;place-items:center;padding:18px!important}
      body.dd-native-scanner #gamePanel{position:fixed!important;inset:0!important;z-index:2147480000!important;width:100vw!important;height:100dvh!important;max-width:none!important;margin:0!important;padding:10px 10px max(10px,env(safe-area-inset-bottom))!important;display:grid!important;grid-template-columns:1fr!important;gap:0!important;overflow:hidden!important;background:#07111f!important;isolation:isolate!important}
      body.dd-native-scanner #gamePanel:before{content:"";position:absolute;inset:0;z-index:0;pointer-events:none;opacity:.88;background-image:radial-gradient(circle at 50% 38%,rgba(0,123,255,.28),transparent 24%),radial-gradient(circle at 50% 42%,transparent 0 35%,rgba(125,211,252,.22) 35.4%,transparent 36.1%),linear-gradient(rgba(0,123,255,.14) 1px,transparent 1px),linear-gradient(90deg,rgba(0,123,255,.14) 1px,transparent 1px);background-size:100% 100%,100% 100%,22px 22px,22px 22px}
      body.dd-native-scanner #gamePanel>div{position:relative;z-index:1;height:100%;min-height:0;display:grid!important;grid-template-rows:minmax(0,1fr)!important;background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;overflow:hidden!important}
      body.dd-native-scanner #gamePanel>div>div:first-child{display:none!important}
      body.dd-native-scanner #gamePanel>div>div:nth-child(2){height:100%;min-height:0;padding:0!important;display:grid!important;grid-template-columns:1fr!important;grid-template-rows:minmax(0,1fr) auto!important;gap:10px!important;overflow:hidden!important}
      body.dd-native-scanner #gamePanel aside{display:none!important}
      body.dd-native-scanner #gamePanel .scan-bg{position:relative!important;min-height:0!important;height:100%!important;border:1px solid rgba(125,211,252,.18)!important;border-radius:26px!important;background-color:rgba(7,17,31,.38)!important;overflow:hidden!important;box-shadow:inset 0 0 70px rgba(0,123,255,.12),0 20px 80px rgba(0,0,0,.32)}
      body.dd-native-scanner .dd-scanner-controls{position:relative!important;z-index:4!important;margin:0!important;padding:12px!important;max-height:36dvh!important;overflow:auto!important;overscroll-behavior:contain!important;background:rgba(7,17,31,.86)!important;border:1px solid rgba(125,211,252,.18)!important;border-radius:22px!important;box-shadow:0 18px 48px rgba(0,0,0,.28)}
      body.dd-native-scanner.dd-battle-active .dd-scanner-controls{display:none!important}
      body.dd-native-scanner #encounterCard{position:absolute!important;left:-99999px!important;top:auto!important;width:1px!important;height:1px!important;overflow:hidden!important;visibility:hidden!important;pointer-events:none!important;display:block!important}
      body.dd-native-scanner #dexModal{z-index:2147483000!important}
      .dd-native-overlay-root{position:absolute;inset:0;z-index:35;pointer-events:none}
      .dd-native-overlay{position:absolute;inset:0;display:grid;grid-template-rows:auto minmax(0,1fr) auto;gap:12px;padding:18px;overflow:auto;overscroll-behavior:contain;border-radius:inherit;pointer-events:auto;background:radial-gradient(circle at 50% 30%,rgba(0,123,255,.18),rgba(7,17,31,.78) 58%,rgba(7,17,31,.94));backdrop-filter:blur(8px)}
      .dd-native-modal{position:fixed!important;inset:12px!important;z-index:2147483200!important;border:1px solid rgba(125,211,252,.24);border-radius:26px;box-shadow:0 24px 90px rgba(0,0,0,.55)}
      .dd-native-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.dd-native-kicker{color:#FFD700;font-size:10px;font-weight:900;letter-spacing:.24em;text-transform:uppercase}.dd-native-title{color:#fff;font-size:clamp(2rem,8vw,4.4rem);font-weight:900;line-height:.96;margin-top:5px}.dd-native-sub{color:#BAE6FD;font-size:12px;margin-top:7px}.dd-native-close{border:1px solid rgba(186,230,253,.28);background:rgba(15,23,42,.72);color:#E5E7EB;border-radius:14px;padding:9px 12px;font-weight:900}
      .dd-native-orb-wrap{display:grid;place-items:center;text-align:center;align-self:center}.dd-native-orb{width:clamp(150px,40vw,280px);height:clamp(150px,40vw,280px);border-radius:999px;display:grid;place-items:center;border:1px solid rgba(0,123,255,.65);background:rgba(0,123,255,.20);font-size:clamp(4.4rem,17vw,9rem);box-shadow:0 0 48px rgba(0,123,255,.34)}.dd-native-lore{color:#CBD5E1;max-width:620px;margin:12px auto 0;line-height:1.45;font-size:13px}
      .dd-native-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.dd-native-stat,.dd-native-card{border:1px solid rgba(125,211,252,.16);background:rgba(15,23,42,.74);border-radius:16px;padding:12px}.dd-native-stat{text-align:center}.dd-native-stat span{display:block;color:#94A3B8;font-size:10px;letter-spacing:.15em;text-transform:uppercase}.dd-native-stat strong{color:#FFD700;font-size:1.35rem}.dd-native-actions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}.dd-native-actions button,.dd-native-primary{border-radius:16px;padding:13px 10px;border:1px solid rgba(255,255,255,.16);background:rgba(15,23,42,.78);color:#E5E7EB;font-weight:900}.dd-native-primary,.dd-native-actions [data-dd-native-action=capture]{background:#FFD700!important;color:#111827!important;border-color:#FFD700!important}.dd-native-actions [data-dd-native-action=battle]{color:#fecaca;border-color:rgba(252,165,165,.45);background:rgba(239,68,68,.14)}
      .dd-native-menu{position:fixed;right:14px;bottom:max(14px,env(safe-area-inset-bottom));z-index:2147482500;display:grid;justify-items:end;gap:9px;pointer-events:none}.dd-native-fab{width:58px;height:58px;border-radius:20px;border:1px solid rgba(125,211,252,.34);background:rgba(15,23,42,.94);color:#FFD700;font-size:1.4rem;font-weight:900;box-shadow:0 16px 46px rgba(0,0,0,.42);pointer-events:auto}.dd-native-stack{display:none;gap:8px;pointer-events:auto}.dd-native-menu.open .dd-native-stack{display:grid}.dd-native-stack button{min-width:132px;border:1px solid rgba(125,211,252,.26);background:rgba(15,23,42,.94);color:#E5E7EB;border-radius:16px;padding:11px 14px;font-weight:900;text-align:left;box-shadow:0 12px 32px rgba(0,0,0,.28)}.dd-native-stack span{color:#FFD700;margin-right:8px}body.dd-battle-active .dd-native-menu,body.dd-modal-active .dd-native-menu{display:none!important}
      @media(max-width:760px){.dd-native-overlay{padding:14px}.dd-native-actions{grid-template-columns:1fr}.dd-native-grid{gap:6px}.dd-native-orb{width:138px;height:138px;font-size:4.2rem}.dd-native-lore{font-size:12px}.dd-native-head{display:block;text-align:center}.dd-native-close{margin-top:10px}.dd-scanner-controls{max-height:38dvh!important}}
    `;
    document.head.appendChild(style);
  }

  function scannerStage() { return document.querySelector("#gamePanel .scan-bg"); }
  function controlsPanel() { return document.querySelector("#gamePanel .scan-bg + div"); }

  function root() {
    const stage = scannerStage();
    if (!stage) return null;
    let el = $("ddNativeOverlayRoot");
    if (!el) { el = document.createElement("div"); el.id = "ddNativeOverlayRoot"; el.className = "dd-native-overlay-root"; stage.appendChild(el); }
    return el;
  }

  function closeOverlay() {
    activeOverlay = null;
    document.body.classList.remove("dd-overlay-open", "dd-modal-active");
    const r = root();
    if (r) r.innerHTML = "";
  }

  function openOverlay(type, html, modal = false) {
    activeOverlay = type;
    document.body.classList.add("dd-overlay-open");
    document.body.classList.toggle("dd-modal-active", modal);
    const r = root();
    if (!r) return;
    r.innerHTML = `<div class="dd-native-overlay ${modal ? "dd-native-modal" : ""}" data-dd-native-overlay="${type}">${html}</div>`;
    r.querySelectorAll("[data-dd-native-close]").forEach((b) => b.addEventListener("click", closeOverlay));
  }

  function text(id) { return $(id)?.textContent?.trim() || ""; }

  function encounterData() {
    const card = $("encounterCard");
    const name = text("encounterName");
    if (!card || card.classList.contains("hidden") || !name) return null;
    return { name, rarity:text("encounterRarity")||"Signal", type:text("encounterType")||"Unknown", icon:text("encounterIcon")||"◈", hp:text("statHp")||"?", atk:text("statAtk")||"?", def:text("statDef")||"?", stability:text("stabilityText")||"?", chance:text("chanceText")||"?", lore:text("encounterLore")||"Signal data decoded." };
  }

  function openSignal() {
    const d = encounterData();
    if (!d || activeOverlay === "battle") return;
    lastSignalKey = `${d.name}|${d.stability}|${d.chance}`;
    openOverlay("signal", `<div class="dd-native-head"><div><div class="dd-native-kicker">${d.rarity}</div><div class="dd-native-title">${d.name}</div><div class="dd-native-sub">${d.type}</div></div><button class="dd-native-close" type="button" data-dd-native-close>Scanner</button></div><div class="dd-native-orb-wrap"><div class="dd-native-orb">${d.icon}</div><p class="dd-native-lore">${d.lore}</p></div><div><div class="dd-native-grid"><div class="dd-native-stat"><span>HP</span><strong>${d.hp}</strong></div><div class="dd-native-stat"><span>ATK</span><strong>${d.atk}</strong></div><div class="dd-native-stat"><span>DEF</span><strong>${d.def}</strong></div></div><div class="dd-native-card" style="margin-top:9px"><div class="dd-native-kicker">Signal Stability</div><strong>${d.stability}</strong><div class="dd-native-sub">DataByteCoin Chance: ${d.chance}</div></div><div class="dd-native-actions" style="margin-top:9px"><button type="button" data-dd-native-action="capture">Launch DataByteCoin</button><button type="button" data-dd-native-action="battle">Battle Signal</button><button type="button" data-dd-native-close>Return</button></div></div>`);
    const r = root();
    r?.querySelector("[data-dd-native-action='capture']")?.addEventListener("click", captureFromOverlay);
    r?.querySelector("[data-dd-native-action='battle']")?.addEventListener("click", startBattle);
  }

  function normalizeResult(value) { return String(value || "").replace(/ByteCoin/gi, "DataByteCoin").replace(/BC-(\d+)/g, "DBC-$1"); }

  function captureFromOverlay() {
    const before = text("captureResult");
    $("captureBtn")?.click();
    setTimeout(() => {
      const result = normalizeResult(text("captureResult") || before || "DataByteCoin launched.");
      const caught = /captured|created|stored|caught|success/i.test(result);
      const collapsed = /collapsed|escaped|signal lost/i.test(result);
      openCaptureResult(caught, collapsed, result);
    }, 160);
  }

  function openCaptureResult(caught, collapsed, result) {
    const title = caught ? "Signal Stored" : collapsed ? "Signal Collapse" : "DataByteCoin Failed";
    const icon = caught ? "◈" : collapsed ? "⚠" : "◇";
    const sub = caught ? "Stored in your ByteCoin collection." : collapsed ? "The signal escaped back into the DataLines." : "Signal remains available.";
    openOverlay("capture-result", `<div class="dd-native-head"><div><div class="dd-native-kicker">Capture Result</div><div class="dd-native-title">${title}</div><div class="dd-native-sub">${sub}</div></div></div><div class="dd-native-orb-wrap"><div class="dd-native-orb">${icon}</div><p class="dd-native-lore">${result}</p></div><div class="dd-native-actions"><button class="dd-native-primary" type="button" data-dd-native-action="continue">Continue Scanner</button></div>`, true);
    root()?.querySelector("[data-dd-native-action='continue']")?.addEventListener("click", () => {
      if (caught || collapsed) resetScanner(caught ? "SIGNAL STORED" : "SIGNAL RESET");
      else openSignal();
    });
  }

  function resetScanner(message) {
    closeOverlay();
    $("encounterCard")?.classList.add("hidden");
    const orb = $("spriteOrb");
    if (orb) { orb.textContent = "?"; orb.style.borderColor = ""; orb.style.boxShadow = ""; }
    if ($("revealStage")) $("revealStage").textContent = "SIGNAL WAITING";
    if ($("scannerStatus")) $("scannerStatus").textContent = `${message}. Scanner ready for next signal.`;
    if ($("encounterName")) $("encounterName").textContent = "";
    window.dispatchEvent(new CustomEvent("databyte:inventory-updated"));
  }

  function startBattle() {
    closeOverlay();
    activeOverlay = "battle";
    document.body.classList.add("dd-battle-active");
    window.startDataByteBattle?.();
  }

  function battleVisible() {
    const battle = $("databyteBattleStageOverlay") || $("dbBattlePhase2");
    if (!battle) return false;
    const s = getComputedStyle(battle);
    return !battle.classList.contains("hidden") && s.display !== "none" && s.visibility !== "hidden";
  }

  function openPanel(name) {
    const lower = name.toLowerCase();
    const list = collection();
    let body = "";
    if (lower === "party") {
      const state = window.getDataBytePartyState?.();
      const party = state?.party || window.getActivePartySprites?.() || [];
      body = `<div class="dd-native-card"><strong>Active Party</strong><div class="dd-native-sub">${party.length}/${state?.cap || 3} slots filled.</div></div>${party.map(spriteCard).join("") || `<div class="dd-native-card">No party loaded yet.</div>`}`;
    } else if (lower === "dex") {
      const seen = seenList();
      body = `<div class="dd-native-card"><strong>DataByteDex</strong><div class="dd-native-sub">Seen ${seen.length} • Captured ${list.length}</div></div>${seen.slice().reverse().slice(0, 40).map((x) => `<div class="dd-native-card"><strong>#${x.dex || "???"} ${x.name || x}</strong><div class="dd-native-sub">${x.status || "Seen"}</div></div>`).join("") || `<div class="dd-native-card">No signals logged.</div>`}`;
    } else if (lower === "items") {
      body = `<div class="dd-native-card"><strong>Items</strong><div class="dd-native-sub">DataByteCoins owned: ${list.length}</div></div>${list.slice().reverse().map(spriteCard).join("") || `<div class="dd-native-card">No DataByteCoins yet.</div>`}`;
    } else {
      const p = profile() || {};
      body = `<div class="dd-native-card"><strong>Admin ${p.name || "Unknown"}</strong><div class="dd-native-sub">Partner: ${p.starter || "None"}</div><div class="dd-native-sub">Seen ${seenList().length} • DataByteCoins ${list.length}</div></div><button id="ddNativeResetBtn" class="dd-native-primary" type="button">Reset Save</button>`;
    }
    openOverlay(`panel-${lower}`, `<div class="dd-native-head"><div><div class="dd-native-kicker">Scanner Menu</div><div class="dd-native-title">${name}</div></div><button class="dd-native-close" type="button" data-dd-native-close>Close</button></div><div style="display:grid;gap:10px;overflow:auto">${body}</div><div></div>`, true);
    $("ddNativeResetBtn")?.addEventListener("click", () => $("resetBtn")?.click());
  }

  function spriteCard(sprite) { return `<div class="dd-native-card"><strong>${sprite.icon || "◈"} ${sprite.name || "Unknown"}</strong><div class="dd-native-sub">${sprite.byteCoin || "BC-????"} • #${sprite.dex || "???"} • ${sprite.rarity || "Unknown"}</div><div class="dd-native-sub">HP ${sprite.hp ?? "?"} • ATK ${sprite.atk ?? "?"} • DEF ${sprite.def ?? "?"}</div></div>`; }

  function buildMenu() {
    if ($("ddNativeMenu")) return;
    const menu = document.createElement("div");
    menu.id = "ddNativeMenu";
    menu.className = "dd-native-menu";
    menu.innerHTML = `<div class="dd-native-stack"><button type="button" data-panel="Party"><span>⚔</span>Party</button><button type="button" data-panel="Dex"><span>▣</span>Dex</button><button type="button" data-panel="Items"><span>◈</span>Items</button><button type="button" data-panel="Admin"><span>☰</span>Admin</button></div><button class="dd-native-fab" type="button">☰</button>`;
    menu.querySelector(".dd-native-fab")?.addEventListener("click", () => menu.classList.toggle("open"));
    menu.querySelectorAll("[data-panel]").forEach((b) => b.addEventListener("click", () => { menu.classList.remove("open"); openPanel(b.dataset.panel); }));
    document.body.appendChild(menu);
  }

  function sync() {
    if (profile()) document.body.classList.add("dd-native-scanner");
    else document.body.classList.remove("dd-native-scanner");
    controlsPanel()?.classList.add("dd-scanner-controls");
    root();
    buildMenu();
    document.body.classList.toggle("dd-battle-active", battleVisible());
    if (battleVisible()) return;
    if (activeOverlay && activeOverlay !== "signal") return;
    const d = encounterData();
    if (!d) return;
    const key = `${d.name}|${d.stability}|${d.chance}`;
    if (key !== lastSignalKey) openSignal();
  }

  window.resetDataByteScannerStage = resetScanner;

  function boot() {
    injectStyles();
    sync();
    const game = $("gamePanel");
    if (game) new MutationObserver(sync).observe(game, { childList:true, subtree:true, characterData:true, attributes:true });
    document.addEventListener("click", () => setTimeout(sync, 80), true);
    window.addEventListener("databyte:inventory-updated", () => setTimeout(sync, 80));
    setInterval(sync, 700);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
