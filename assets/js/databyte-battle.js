// assets/js/databyte-battle.js
(function () {
  let battle = null;

  function clamp(value, min = 0, max = 9999) {
    return Math.max(min, Math.min(max, Number(value) || 0));
  }

  function stage() { return document.querySelector("#gamePanel .scan-bg"); }
  function scannerCore() { return stage()?.querySelector(".relative.z-10"); }
  function chanceNumber() { return clamp(String(document.getElementById("chanceText")?.textContent || "0").replace(/[^0-9]/g, ""), 5, 100); }

  function currentEnemy() {
    const name = document.getElementById("encounterName")?.textContent?.trim();
    if (!name || name === "Awaiting Signal" || name === "Unknown Signal") return null;
    const rarityText = (document.getElementById("encounterRarity")?.textContent || "common").toLowerCase();
    const maxStability = rarityText.includes("legendary") ? 6 : rarityText.includes("epic") ? 5 : rarityText.includes("rare") ? 4 : 3;
    return {
      name,
      type: document.getElementById("encounterType")?.textContent?.trim() || "Unknown",
      icon: document.getElementById("encounterIcon")?.textContent?.trim() || "◈",
      hp: clamp(document.getElementById("statHp")?.textContent, 1),
      atk: clamp(document.getElementById("statAtk")?.textContent, 1),
      def: clamp(document.getElementById("statDef")?.textContent, 1),
      maxStability
    };
  }

  function leadSprite() {
    const lead = window.getLeadPartySprite?.();
    if (lead) return { name: lead.name || "Lead Sprite", type: lead.type || "Party", icon: lead.icon || "◈", hp: clamp(lead.hp ?? 48, 1), atk: clamp(lead.atk ?? 14, 1), def: clamp(lead.def ?? 12, 1) };
    return { name: "Scanner Core", type: "Fallback", icon: "🛡️", hp: 48, atk: 14, def: 12 };
  }

  function injectStyles() {
    if (document.getElementById("databyteBattleStageStyles")) return;
    const style = document.createElement("style");
    style.id = "databyteBattleStageStyles";
    style.textContent = `
      .db-battle-stage-overlay{position:absolute;inset:0;z-index:15;border-radius:inherit;background:transparent;display:grid;grid-template-rows:auto 1fr auto auto auto;gap:8px;padding:18px;overflow:auto;overscroll-behavior:contain}.db-battle-stage-overlay.hidden{display:none!important}.db-battle-title{display:flex;align-items:center;justify-content:space-between;gap:10px;color:#fecaca;font-size:11px;text-transform:uppercase;letter-spacing:.18em}.db-battle-arena{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:10px}.db-battle-fighter{display:grid;place-items:center;text-align:center;min-width:0}.db-battle-icon{width:clamp(120px,22vw,210px);height:clamp(120px,22vw,210px);border-radius:999px;border:1px solid rgba(0,123,255,.55);background:rgba(0,123,255,.18);display:grid;place-items:center;font-size:clamp(3.6rem,11vw,6.8rem);line-height:1;box-shadow:0 0 34px rgba(0,123,255,.28);margin-bottom:8px}.db-battle-name{color:#fff;font-weight:900;font-size:clamp(1.15rem,4vw,2rem);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}.db-battle-type{color:#BAE6FD;font-size:11px;margin-top:2px}.db-battle-hp{margin-top:8px;color:#BAE6FD;font-size:11px}.db-battle-bar{height:8px;background:rgba(15,23,42,.72);border-radius:999px;overflow:hidden;margin-top:5px;width:100%;max-width:220px;border:1px solid rgba(125,211,252,.16)}.db-battle-fill{height:100%;width:var(--fill);background:linear-gradient(90deg,rgba(34,197,94,.9),rgba(250,204,21,.9));border-radius:inherit}.db-battle-vs{color:#FFD700;font-weight:900;letter-spacing:.18em;text-shadow:0 0 18px rgba(255,215,0,.35)}.db-battle-signal-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.db-battle-meter{background:rgba(15,23,42,.72);border:1px solid rgba(125,211,252,.18);border-radius:14px;padding:8px 10px}.db-battle-meter span{display:flex;justify-content:space-between;align-items:center;gap:8px;color:#BAE6FD;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.12em}.db-battle-meter strong{color:#FFD700}.db-battle-track{height:7px;background:rgba(255,255,255,.12);border-radius:999px;margin-top:7px;overflow:hidden}.db-battle-signal-fill{height:100%;width:var(--fill);background:linear-gradient(90deg,rgba(34,211,238,.9),rgba(255,215,0,.9));border-radius:inherit}.db-stability-label{display:flex;align-items:center;gap:8px}.db-stability-pips{color:#FFD700;letter-spacing:.14em;font-size:12px;white-space:nowrap}.db-battle-log{min-height:52px;max-height:76px;overflow:auto;border:1px solid rgba(125,211,252,.18);background:rgba(15,23,42,.72);border-radius:14px;padding:9px;color:#CBD5E1;font-size:12px}.db-battle-actions{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.db-battle-actions.is-resolved{grid-template-columns:repeat(2,minmax(0,1fr))}.db-battle-actions.is-lost{grid-template-columns:1fr}.db-battle-actions button{border-radius:15px;padding:12px 8px;font-size:12px;font-weight:900;border:1px solid rgba(255,255,255,.16);background:rgba(15,23,42,.72);color:#E5E7EB}.db-battle-actions button[data-battle-action=attack]{border-color:rgba(252,165,165,.48);color:#fecaca;background:rgba(239,68,68,.12)}.db-battle-actions button[data-battle-action=pulse]{border-color:rgba(255,215,0,.45);color:#FFD700}.db-battle-actions button[data-battle-action=capture]{background:#FFD700;color:#111827;border-color:#FFD700}.db-battle-actions button[data-battle-action=return]{border-color:rgba(186,230,253,.34);color:#BAE6FD}@media(max-width:768px){.db-battle-stage-overlay{padding:14px}.db-battle-arena{grid-template-columns:1fr;gap:7px}.db-battle-vs{display:none}.db-battle-actions{grid-template-columns:repeat(2,minmax(0,1fr))}.db-battle-actions.is-lost{grid-template-columns:1fr}.db-battle-signal-grid{grid-template-columns:1fr}.db-battle-log{max-height:64px}.db-battle-icon{width:104px;height:104px;font-size:3.8rem}}
    `;
    document.head.appendChild(style);
  }

  function ensureOverlay() {
    injectStyles();
    const s = stage();
    if (!s) return null;
    if (getComputedStyle(s).position === "static") s.style.position = "relative";
    let overlay = document.getElementById("databyteBattleStageOverlay");
    if (!overlay) { overlay = document.createElement("div"); overlay.id = "databyteBattleStageOverlay"; overlay.className = "db-battle-stage-overlay hidden"; s.appendChild(overlay); }
    return overlay;
  }

  function ensurePanel() {
    let panel = document.getElementById("battlePanel");
    if (panel) return panel;
    const encounterCard = document.getElementById("encounterCard");
    if (!encounterCard) return null;
    panel = document.createElement("div");
    panel.id = "battlePanel";
    panel.className = "mt-5 bg-red-500/10 border border-red-300/30 rounded-2xl p-4 text-sm";
    encounterCard.appendChild(panel);
    return panel;
  }

  function damage(atk, def) { return clamp(Math.floor(atk * 0.68 - def * 0.22 + 6), 1, 999); }

  function startBattle() {
    const enemy = currentEnemy();
    if (!enemy) return;
    const player = leadSprite();
    battle = { player, enemy, playerHp: player.hp, enemyHp: enemy.hp, signal: chanceNumber(), stability: enemy.maxStability, maxStability: enemy.maxStability, log: [`${enemy.name} pulled the scanner into battle mode.`], finished: false, lost: false };
    scannerCore()?.classList.add("hidden");
    document.getElementById("databyteSignalOverlay")?.classList.add("hidden");
    syncChanceText();
    renderPanel(); renderStage();
  }

  function syncChanceText() {
    const chanceText = document.getElementById("chanceText");
    if (chanceText && battle) chanceText.textContent = `${battle.signal}%`;
  }

  function syncSignalFromCaptureSystem() {
    if (!battle) return;
    battle.signal = chanceNumber();
    syncChanceText();
  }

  function boostSignal(amount) {
    if (!battle) return;
    const before = battle.signal;
    battle.signal = clamp(battle.signal + amount, 5, 100);
    syncChanceText();
    battle.log.unshift(`Signal strengthened ${before}% → ${battle.signal}%.`);
  }

  function dropStability(reason) {
    if (!battle || battle.lost) return;
    const before = battle.stability;
    battle.stability = clamp(battle.stability - 1, 0, battle.maxStability);
    battle.log.unshift(`${reason} Stability ${before}/${battle.maxStability} → ${battle.stability}/${battle.maxStability}.`);
    if (battle.stability <= 0) {
      battle.finished = true;
      battle.lost = true;
      battle.log.unshift(`SIGNAL LOST • ${battle.enemy.name} escaped the scanner network.`);
    }
  }

  function playerAttack() {
    if (!battle || battle.finished) return;
    const dealt = damage(battle.player.atk, battle.enemy.def);
    battle.enemyHp = clamp(battle.enemyHp - dealt, 0, battle.enemy.hp);
    battle.log.unshift(`${battle.player.name} struck for ${dealt} signal damage.`);
    if (battle.enemyHp <= 0) { battle.finished = true; boostSignal(15); battle.log.unshift(`${battle.enemy.name} weakened. Signal lock improved.`); renderStage(); renderPanel(); return; }
    enemyTurn();
  }

  function guard() {
    if (!battle || battle.finished) return;
    const hit = Math.max(1, Math.floor(damage(battle.enemy.atk, battle.player.def) * 0.45));
    battle.playerHp = clamp(battle.playerHp - hit, 0, battle.player.hp);
    battle.log.unshift(`${battle.player.name} guarded and took ${hit}.`);
    if (battle.playerHp <= 0) finishPlayerDown();
    renderStage(); renderPanel();
  }

  function scanPulse() {
    if (!battle || battle.finished) return;
    boostSignal(12);
    battle.log.unshift("Scan Pulse tuned the signal resonance.");
    enemyTurn();
  }

  function throwByteCoin() {
    if (!battle || battle.lost) return;
    const before = document.getElementById("captureResult")?.textContent?.trim() || "";
    syncChanceText();
    document.getElementById("captureBtn")?.click();
    setTimeout(function () {
      const result = document.getElementById("captureResult")?.textContent?.trim() || before;
      syncSignalFromCaptureSystem();
      const caught = /captured|added|caught|success|created|stored/i.test(result);
      if (caught) {
        battle.finished = true;
        battle.log.unshift(`SIGNAL CAPTURED • ${result}`);
        renderStage();
        setTimeout(function () { window.resetDataByteScannerStage?.("SIGNAL CAPTURED"); }, 900);
      } else {
        battle.log.unshift(`ByteCoin failed to hold. ${result || "The signal broke out."}`);
        dropStability("ByteCoin breakout.");
        renderStage();
        if (!battle.finished) enemyTurn();
      }
    }, 120);
  }

  function enemyTurn() {
    if (!battle || battle.finished) return;
    const hit = damage(battle.enemy.atk, battle.player.def);
    battle.playerHp = clamp(battle.playerHp - hit, 0, battle.player.hp);
    battle.log.unshift(`${battle.enemy.name} countered for ${hit}.`);
    if (battle.playerHp <= 0) finishPlayerDown();
    renderStage(); renderPanel();
  }

  function finishPlayerDown() {
    if (!battle || battle.finished) return;
    battle.playerHp = 0;
    dropStability(`${battle.player.name} was forced offline.`);
    if (!battle.lost) { battle.finished = true; battle.log.unshift(`Party swap needed. Next phase will let you deploy another sprite.`); }
  }

  function endBattle() {
    battle = null;
    document.getElementById("databyteBattleStageOverlay")?.classList.add("hidden");
    scannerCore()?.classList.remove("hidden");
    renderPanel();
  }

  function hpPct(now, max) { return `${Math.max(0, Math.min(100, Math.round((now / Math.max(1, max)) * 100)))}%`; }
  function stabilityPips() { return "★".repeat(battle.stability) + "☆".repeat(Math.max(0, battle.maxStability - battle.stability)); }

  function fighter(sprite, hp, side) {
    return `<div class="db-battle-fighter"><div class="db-battle-icon">${sprite.icon}</div><div class="db-battle-name">${sprite.name}</div><div class="db-battle-type">${side} • ${sprite.type}</div><div class="db-battle-hp">HP ${hp}/${sprite.hp}</div><div class="db-battle-bar"><div class="db-battle-fill" style="--fill:${hpPct(hp, sprite.hp)}"></div></div></div>`;
  }

  function meters() {
    return `<div class="db-battle-signal-grid"><div class="db-battle-meter"><span>Signal<strong>${battle.signal}%</strong></span><div class="db-battle-track"><div class="db-battle-signal-fill" style="--fill:${battle.signal}%"></div></div></div><div class="db-battle-meter"><span><span class="db-stability-label">Stability <span class="db-stability-pips">${stabilityPips()}</span></span><strong>${battle.stability}/${battle.maxStability}</strong></span></div></div>`;
  }

  function actionButtons() {
    if (battle.lost) return `<div class="db-battle-actions is-lost"><button type="button" data-battle-action="return">Return</button></div>`;
    if (battle.finished) return `<div class="db-battle-actions is-resolved"><button type="button" data-battle-action="capture">Throw ByteCoin</button><button type="button" data-battle-action="return">Return</button></div>`;
    return `<div class="db-battle-actions"><button type="button" data-battle-action="attack">Attack</button><button type="button" data-battle-action="guard">Guard</button><button type="button" data-battle-action="pulse">Scan Pulse</button><button type="button" data-battle-action="capture">Throw ByteCoin</button></div>`;
  }

  function renderStage() {
    const overlay = ensureOverlay();
    if (!overlay || !battle) return;
    overlay.classList.remove("hidden");
    overlay.innerHTML = `<div class="db-battle-title"><span>Signal Battle</span><span>${battle.lost ? "Signal Lost" : battle.finished ? "Signal Subdued" : "Active"}</span></div><div class="db-battle-arena">${fighter(battle.player, battle.playerHp, "Party Lead")}<div class="db-battle-vs">VS</div>${fighter(battle.enemy, battle.enemyHp, "Wild Signal")}</div>${meters()}<div class="db-battle-log">${battle.log.slice(0, 6).map((line) => `<p>${line}</p>`).join("")}</div>${actionButtons()}`;
    overlay.querySelector("[data-battle-action='attack']")?.addEventListener("click", playerAttack);
    overlay.querySelector("[data-battle-action='guard']")?.addEventListener("click", guard);
    overlay.querySelector("[data-battle-action='pulse']")?.addEventListener("click", scanPulse);
    overlay.querySelector("[data-battle-action='capture']")?.addEventListener("click", throwByteCoin);
    overlay.querySelector("[data-battle-action='return']")?.addEventListener("click", endBattle);
  }

  function renderPanel() {
    const panel = ensurePanel();
    if (!panel) return;
    const enemy = currentEnemy();
    if (!enemy) { panel.innerHTML = `<div class="text-xs text-gray-400">Discover a sprite to initiate scanner battle mode.</div>`; return; }
    if (!battle) { panel.innerHTML = `<button id="startBattleBtn" type="button" class="w-full px-4 py-3 rounded-xl bg-red-400/15 border border-red-300/40 text-red-100 font-bold">Battle Signal</button><p class="text-xs text-gray-400 mt-2 text-center">Battle will take over the scanner viewport.</p>`; document.getElementById("startBattleBtn")?.addEventListener("click", startBattle); return; }
    panel.innerHTML = `<div class="text-red-100 font-bold">Battle Mode ${battle.finished ? "resolved" : "active"}</div><p class="text-xs text-gray-300 mt-1">Use the scanner viewport controls to continue.</p>`;
  }

  function resetForNewEncounter() {
    battle = null;
    document.getElementById("databyteBattleStageOverlay")?.classList.add("hidden");
    scannerCore()?.classList.remove("hidden");
    setTimeout(renderPanel, 80);
  }

  function boot() {
    injectStyles(); ensureOverlay(); renderPanel();
    const nameTarget = document.getElementById("encounterName");
    if (nameTarget) new MutationObserver(resetForNewEncounter).observe(nameTarget, { childList: true, characterData: true, subtree: true });
  }

  window.startDataByteBattle = startBattle;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();