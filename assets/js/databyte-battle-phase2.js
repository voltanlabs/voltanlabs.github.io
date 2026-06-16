// assets/js/databyte-battle-phase2.js
(function () {
  let state = null;

  function host() { return document.querySelector("#gamePanel .scan-bg"); }
  function core() { return host()?.querySelector(".relative.z-10"); }
  function text(id) { return document.getElementById(id)?.textContent?.trim() || ""; }
  function clamp(v, min = 0, max = 999) { return Math.max(min, Math.min(max, Number(v) || 0)); }
  function pct(v, m) { return Math.max(0, Math.min(100, Math.round((v / Math.max(1, m)) * 100))); }
  function key(s) { return String(s?.id || s?.byteCoin || s?.name || ""); }

  function enemy() {
    const name = text("encounterName");
    if (!name) return null;
    const rarity = (text("encounterRarity") || "common").toLowerCase();
    return { name, type: text("encounterType") || "Unknown", icon: text("encounterIcon") || "◈", hp: clamp(text("statHp"), 1), atk: clamp(text("statAtk"), 1), def: clamp(text("statDef"), 1), maxStability: rarity.includes("legendary") ? 6 : rarity.includes("epic") ? 5 : rarity.includes("rare") ? 4 : 3 };
  }

  function norm(s) { return { id: key(s), name: s?.name || "Sprite", type: s?.type || "Party", icon: s?.icon || "◈", hp: clamp(s?.hp, 1), atk: clamp(s?.atk, 1), def: clamp(s?.def, 1) }; }
  function party() { return (window.getActivePartySprites?.() || []).map(norm).filter(s => s.id); }
  function lead() { return party()[0] || norm(window.getLeadPartySprite?.()) || { id: "core", name: "Scanner Core", type: "Fallback", icon: "◈", hp: 40, atk: 12, def: 12 }; }
  function signal() { return clamp(String(text("chanceText") || "0").replace(/[^0-9]/g, ""), 5, 100); }
  function syncSignal() { const el = document.getElementById("chanceText"); if (el && state) el.textContent = state.signal + "%"; }

  function styles() {
    if (document.getElementById("dbBattlePhase2Styles")) return;
    const s = document.createElement("style");
    s.id = "dbBattlePhase2Styles";
    s.textContent = `.dbp2{position:absolute;inset:0;z-index:30;border-radius:inherit;background:transparent;padding:14px;display:grid;grid-template-rows:auto 1fr auto auto auto;gap:8px;overflow:auto;overscroll-behavior:contain}.dbp2.hidden{display:none!important}.dbp2-top{display:flex;justify-content:space-between;color:#fecaca;font-size:11px;letter-spacing:.18em;text-transform:uppercase}.dbp2-arena{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:10px;text-align:center}.dbp2-vs{color:#FFD700;font-weight:900}.dbp2-f{display:grid;place-items:center}.dbp2-icon{width:105px;height:105px;border-radius:999px;border:1px solid rgba(0,123,255,.55);background:rgba(0,123,255,.18);display:grid;place-items:center;font-size:3.7rem}.dbp2-name{font-weight:900;font-size:1.45rem}.dbp2-sub{color:#BAE6FD;font-size:11px}.dbp2-bar{width:100%;max-width:220px;height:8px;border-radius:99px;background:rgba(15,23,42,.75);overflow:hidden;margin-top:5px}.dbp2-fill{height:100%;width:var(--w);background:linear-gradient(90deg,rgba(34,211,238,.9),rgba(255,215,0,.9))}.dbp2-meters{display:grid;grid-template-columns:1fr 1fr;gap:8px}.dbp2-meter,.dbp2-log,.dbp2-swap{background:rgba(15,23,42,.74);border:1px solid rgba(125,211,252,.18);border-radius:14px;padding:9px}.dbp2-meter span{display:flex;justify-content:space-between;gap:8px;color:#BAE6FD;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.12em}.dbp2-meter strong,.dbp2-stars{color:#FFD700}.dbp2-track{height:7px;background:rgba(255,255,255,.12);border-radius:99px;overflow:hidden;margin-top:7px}.dbp2-log{max-height:72px;overflow:auto;color:#CBD5E1;font-size:12px}.dbp2-actions,.dbp2-party{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.dbp2-actions.resolved{grid-template-columns:repeat(2,1fr)}.dbp2-actions.single{grid-template-columns:1fr}.dbp2 button{border-radius:14px;padding:12px 8px;font-weight:900;border:1px solid rgba(255,255,255,.16);background:rgba(15,23,42,.72);color:#E5E7EB}.dbp2 .gold{background:#FFD700;color:#111827;border-color:#FFD700}.dbp2-result{display:grid;place-items:center;text-align:center;gap:14px;min-height:100%}.dbp2-result h2{font-size:2.4rem;color:#FFD700}.dbp2-result p{color:#CBD5E1}.dbp2-party{grid-template-columns:repeat(3,1fr)}@media(max-width:768px){.dbp2-arena{grid-template-columns:1fr}.dbp2-vs{display:none}.dbp2-meters,.dbp2-actions,.dbp2-actions.resolved,.dbp2-party{grid-template-columns:1fr}.dbp2-icon{width:96px;height:96px;font-size:3.4rem}}`;
    document.head.appendChild(s);
  }

  function overlay() {
    styles();
    const h = host();
    if (!h) return null;
    if (getComputedStyle(h).position === "static") h.style.position = "relative";
    let o = document.getElementById("dbBattlePhase2");
    if (!o) { o = document.createElement("div"); o.id = "dbBattlePhase2"; o.className = "dbp2 hidden"; h.appendChild(o); }
    return o;
  }

  function dmg(a, d) { return clamp(Math.floor(a * .68 - d * .22 + 6), 1); }
  function log(m) { state.log.unshift(m); }
  function hpbar(now, max) { return `<div class="dbp2-bar"><div class="dbp2-fill" style="--w:${pct(now, max)}%"></div></div>`; }
  function fighter(s, hp, label) { return `<div class="dbp2-f"><div class="dbp2-icon">${s.icon}</div><div class="dbp2-name">${s.name}</div><div class="dbp2-sub">${label} • ${s.type}</div><div class="dbp2-sub">HP ${hp}/${s.hp}</div>${hpbar(hp, s.hp)}</div>`; }
  function stars() { return "★".repeat(state.stability) + "☆".repeat(Math.max(0, state.maxStability - state.stability)); }
  function remaining() { return party().filter(s => !state.down.has(s.id) && s.id !== state.player.id); }

  function result(title, msg) { state.result = { title, msg }; render(); }
  function drop(reason) { const b = state.stability; state.stability = clamp(state.stability - 1, 0, state.maxStability); log(`${reason} Stability ${b}/${state.maxStability} → ${state.stability}/${state.maxStability}.`); if (state.stability <= 0) result("Signal Lost", `${state.enemy.name} escaped the scanner network.`); }
  function strengthen(n) { const b = state.signal; state.signal = clamp(state.signal + n, 5, 100); syncSignal(); log(`Signal strengthened ${b}% → ${state.signal}%.`); }

  function start() {
    const e = enemy(); if (!e) return;
    const p = lead();
    state = { player: p, enemy: e, playerHp: p.hp, enemyHp: e.hp, signal: signal(), stability: e.maxStability, maxStability: e.maxStability, log: [`${e.name} pulled the scanner into battle mode.`], down: new Set(), swap: false, result: null };
    core()?.classList.add("hidden");
    document.getElementById("databyteSignalOverlay")?.classList.add("hidden");
    document.getElementById("databyteBattleStageOverlay")?.classList.add("hidden");
    syncSignal(); render();
  }

  function attack() { if (!state || state.swap || state.result) return; const hit = dmg(state.player.atk, state.enemy.def); state.enemyHp = clamp(state.enemyHp - hit, 0, state.enemy.hp); log(`${state.player.name} struck for ${hit}.`); if (state.enemyHp <= 0) { strengthen(15); log(`${state.enemy.name} subdued. Signal lock improved.`); render(); return; } enemyTurn(); }
  function guard() { if (!state || state.swap || state.result) return; const hit = Math.max(1, Math.floor(dmg(state.enemy.atk, state.player.def) * .45)); state.playerHp = clamp(state.playerHp - hit, 0, state.player.hp); log(`${state.player.name} guarded and took ${hit}.`); if (state.playerHp <= 0) offline(); render(); }
  function pulse() { if (!state || state.swap || state.result) return; strengthen(12); log("Scan Pulse tuned the signal resonance."); enemyTurn(); }
  function enemyTurn() { if (!state || state.result || state.enemyHp <= 0) return; const hit = dmg(state.enemy.atk, state.player.def); state.playerHp = clamp(state.playerHp - hit, 0, state.player.hp); log(`${state.enemy.name} countered for ${hit}.`); if (state.playerHp <= 0) offline(); render(); }
  function offline() { state.playerHp = 0; state.down.add(state.player.id); drop(`${state.player.name} was forced offline.`); if (state.result) return; const opts = remaining(); if (opts.length) { state.swap = true; log("Choose another party sprite to continue."); } else result("Party Offline", `${state.enemy.name} overran your active party.`); }
  function deploy(id) { const next = remaining().find(s => s.id === id); if (!next) return; state.player = next; state.playerHp = next.hp; state.swap = false; log(`${next.name} deployed.`); render(); }
  function capture() { if (!state || state.result) return; syncSignal(); const before = text("captureResult"); document.getElementById("captureBtn")?.click(); setTimeout(() => { const r = text("captureResult") || before; state.signal = signal(); syncSignal(); if (/captured|added|caught|success|created|stored/i.test(r)) result("Signal Stored", r || `${state.enemy.name} stored in a ByteCoin.`); else { log(`ByteCoin failed. ${r || "Signal broke out."}`); drop("ByteCoin breakout."); if (!state.result && state.enemyHp > 0) enemyTurn(); else render(); } }, 120); }
  function finish() { const title = state?.result?.title || "Scanner Ready"; state = null; document.getElementById("dbBattlePhase2")?.classList.add("hidden"); window.resetDataByteScannerStage?.(title); }
  function back() { state = null; document.getElementById("dbBattlePhase2")?.classList.add("hidden"); core()?.classList.remove("hidden"); }

  function meters() { return `<div class="dbp2-meters"><div class="dbp2-meter"><span>Signal<strong>${state.signal}%</strong></span><div class="dbp2-track"><div class="dbp2-fill" style="--w:${state.signal}%"></div></div></div><div class="dbp2-meter"><span>Stability <span class="dbp2-stars">${stars()}</span><strong>${state.stability}/${state.maxStability}</strong></span></div></div>`; }
  function swap() { if (!state.swap) return ""; return `<div class="dbp2-swap"><strong style="color:#FFD700">Deploy Next Sprite</strong><div class="dbp2-party">${remaining().map(s => `<button data-deploy="${s.id}">${s.icon} ${s.name}<br><small>HP ${s.hp} ATK ${s.atk} DEF ${s.def}</small></button>`).join("")}</div></div>`; }
  function actions() { if (state.swap) return ""; if (state.enemyHp <= 0) return `<div class="dbp2-actions resolved"><button class="gold" data-act="capture">Throw ByteCoin</button><button data-act="back">Return</button></div>`; return `<div class="dbp2-actions"><button data-act="attack">Attack</button><button data-act="guard">Guard</button><button data-act="pulse">Scan Pulse</button><button class="gold" data-act="capture">Throw ByteCoin</button></div>`; }

  function render() {
    const o = overlay(); if (!o || !state) return;
    o.classList.remove("hidden");
    if (state.result) { o.innerHTML = `<div class="dbp2-result"><h2>${state.result.title}</h2><p>${state.result.msg}</p><button data-act="finish">Continue</button></div>`; o.querySelector("[data-act='finish']")?.addEventListener("click", finish); return; }
    o.innerHTML = `<div class="dbp2-top"><span>Signal Battle</span><span>${state.swap ? "Swap Needed" : state.enemyHp <= 0 ? "Signal Subdued" : "Active"}</span></div><div class="dbp2-arena">${fighter(state.player, state.playerHp, "Party Lead")}<div class="dbp2-vs">VS</div>${fighter(state.enemy, state.enemyHp, "Wild Signal")}</div>${meters()}<div class="dbp2-log">${state.log.slice(0,6).map(x => `<p>${x}</p>`).join("")}</div>${swap()}${actions()}`;
    o.querySelector("[data-act='attack']")?.addEventListener("click", attack); o.querySelector("[data-act='guard']")?.addEventListener("click", guard); o.querySelector("[data-act='pulse']")?.addEventListener("click", pulse); o.querySelector("[data-act='capture']")?.addEventListener("click", capture); o.querySelector("[data-act='back']")?.addEventListener("click", back); o.querySelectorAll("[data-deploy]").forEach(b => b.addEventListener("click", () => deploy(b.dataset.deploy)));
  }

  function boot() { styles(); overlay(); window.startDataByteBattle = start; }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();