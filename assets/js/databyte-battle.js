// assets/js/databyte-battle.js
(function () {
  let battle = null;

  function clamp(value, min = 0, max = 9999) {
    return Math.max(min, Math.min(max, Number(value) || 0));
  }

  function stage() {
    return document.querySelector("#gamePanel .scan-bg");
  }

  function scannerCore() {
    return stage()?.querySelector(".relative.z-10");
  }

  function currentEnemy() {
    const name = document.getElementById("encounterName")?.textContent?.trim();
    if (!name || name === "Awaiting Signal" || name === "Unknown Signal") return null;
    return {
      name,
      type: document.getElementById("encounterType")?.textContent?.trim() || "Unknown",
      icon: document.getElementById("encounterIcon")?.textContent?.trim() || "◈",
      hp: clamp(document.getElementById("statHp")?.textContent, 1),
      atk: clamp(document.getElementById("statAtk")?.textContent, 1),
      def: clamp(document.getElementById("statDef")?.textContent, 1)
    };
  }

  function leadSprite() {
    const lead = window.getLeadPartySprite?.();
    if (lead) {
      return {
        name: lead.name || "Lead Sprite",
        type: lead.type || "Party",
        icon: lead.icon || "◈",
        hp: clamp(lead.hp ?? 48, 1),
        atk: clamp(lead.atk ?? 14, 1),
        def: clamp(lead.def ?? 12, 1)
      };
    }
    return { name: "Scanner Core", type: "Fallback", icon: "🛡️", hp: 48, atk: 14, def: 12 };
  }

  function injectStyles() {
    if (document.getElementById("databyteBattleStageStyles")) return;
    const style = document.createElement("style");
    style.id = "databyteBattleStageStyles";
    style.textContent = `
      .db-battle-stage-overlay{position:absolute;inset:0;z-index:15;border-radius:inherit;background:radial-gradient(circle at top,rgba(239,68,68,.18),transparent 42%),rgba(2,6,23,.92);display:flex;flex-direction:column;justify-content:space-between;gap:10px;padding:16px;overflow:hidden}.db-battle-stage-overlay.hidden{display:none!important}.db-battle-title{display:flex;align-items:center;justify-content:space-between;gap:10px;color:#fecaca;font-size:11px;text-transform:uppercase;letter-spacing:.18em}.db-battle-grid{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:10px}.db-battle-fighter{background:rgba(0,0,0,.28);border:1px solid rgba(255,255,255,.10);border-radius:18px;padding:12px;text-align:center;min-width:0}.db-battle-icon{font-size:clamp(2.75rem,10vw,5.5rem);line-height:1;margin-bottom:8px}.db-battle-name{color:#fff;font-weight:900;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.db-battle-type{color:#94A3B8;font-size:11px;margin-top:2px}.db-battle-hp{margin-top:8px;color:#BAE6FD;font-size:11px}.db-battle-bar{height:8px;background:rgba(255,255,255,.12);border-radius:999px;overflow:hidden;margin-top:5px}.db-battle-fill{height:100%;width:var(--fill);background:linear-gradient(90deg,rgba(34,197,94,.9),rgba(250,204,21,.9));border-radius:inherit}.db-battle-vs{color:#FFD700;font-weight:900;letter-spacing:.18em}.db-battle-log{min-height:54px;max-height:72px;overflow:auto;border:1px solid rgba(255,255,255,.10);background:rgba(0,0,0,.22);border-radius:14px;padding:8px;color:#CBD5E1;font-size:11px}.db-battle-actions{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px}.db-battle-actions button{border-radius:12px;padding:10px 6px;font-size:11px;font-weight:900;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.08);color:#E5E7EB}.db-battle-actions button[data-battle-action=attack]{border-color:rgba(252,165,165,.4);color:#fecaca}.db-battle-actions button[data-battle-action=pulse]{border-color:rgba(255,215,0,.4);color:#FFD700}.db-battle-actions button[data-battle-action=end]{border-color:rgba(186,230,253,.3);color:#BAE6FD}@media(max-width:768px){.db-battle-stage-overlay{padding:12px}.db-battle-grid{grid-template-columns:1fr;gap:8px}.db-battle-vs{display:none}.db-battle-actions{grid-template-columns:repeat(2,minmax(0,1fr))}.db-battle-log{max-height:58px}}
    `;
    document.head.appendChild(style);
  }

  function ensureOverlay() {
    injectStyles();
    const s = stage();
    if (!s) return null;
    if (getComputedStyle(s).position === "static") s.style.position = "relative";
    let overlay = document.getElementById("databyteBattleStageOverlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "databyteBattleStageOverlay";
      overlay.className = "db-battle-stage-overlay hidden";
      s.appendChild(overlay);
    }
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

  function damage(atk, def) {
    return clamp(Math.floor(atk * 0.68 - def * 0.22 + 6), 1, 999);
  }

  function startBattle() {
    const enemy = currentEnemy();
    if (!enemy) return;
    const player = leadSprite();
    battle = {
      player, enemy,
      playerHp: player.hp,
      enemyHp: enemy.hp,
      log: [`${enemy.name} pulled the scanner into battle mode.`],
      finished: false
    };
    scannerCore()?.classList.add("hidden");
    renderPanel();
    renderStage();
  }

  function boostCaptureChance(amount) {
    const chanceText = document.getElementById("chanceText");
    if (!chanceText) return;
    const current = clamp(String(chanceText.textContent).replace("%", ""), 5, 100);
    chanceText.textContent = `${clamp(current + amount, 5, 100)}%`;
  }

  function playerAttack() {
    if (!battle || battle.finished) return;
    const dealt = damage(battle.player.atk, battle.enemy.def);
    battle.enemyHp = clamp(battle.enemyHp - dealt, 0, battle.enemy.hp);
    battle.log.unshift(`${battle.player.name} struck for ${dealt} signal damage.`);
    if (battle.enemyHp <= 0) {
      battle.finished = true;
      battle.log.unshift(`${battle.enemy.name} weakened. ByteCoin chance improved.`);
      boostCaptureChance(15);
      renderStage();
      renderPanel();
      return;
    }
    enemyTurn();
  }

  function guard() {
    if (!battle || battle.finished) return;
    const hit = Math.max(1, Math.floor(damage(battle.enemy.atk, battle.player.def) * 0.45));
    battle.playerHp = clamp(battle.playerHp - hit, 0, battle.player.hp);
    battle.log.unshift(`${battle.player.name} guarded and took ${hit}.`);
    if (battle.playerHp <= 0) finishPlayerDown();
    renderStage();
    renderPanel();
  }

  function scanPulse() {
    if (!battle || battle.finished) return;
    boostCaptureChance(8);
    battle.log.unshift("Scan Pulse improved ByteCoin chance.");
    enemyTurn();
  }

  function enemyTurn() {
    const hit = damage(battle.enemy.atk, battle.player.def);
    battle.playerHp = clamp(battle.playerHp - hit, 0, battle.player.hp);
    battle.log.unshift(`${battle.enemy.name} countered for ${hit}.`);
    if (battle.playerHp <= 0) finishPlayerDown();
    renderStage();
    renderPanel();
  }

  function finishPlayerDown() {
    battle.finished = true;
    battle.playerHp = 0;
    battle.log.unshift(`${battle.player.name} went offline. Capture is still available.`);
  }

  function endBattle() {
    battle = null;
    document.getElementById("databyteBattleStageOverlay")?.classList.add("hidden");
    scannerCore()?.classList.remove("hidden");
    renderPanel();
  }

  function hpPct(now, max) {
    return `${Math.max(0, Math.min(100, Math.round((now / Math.max(1, max)) * 100)))}%`;
  }

  function fighter(sprite, hp, side) {
    return `<div class="db-battle-fighter"><div class="db-battle-icon">${sprite.icon}</div><div class="db-battle-name">${sprite.name}</div><div class="db-battle-type">${side} • ${sprite.type}</div><div class="db-battle-hp">HP ${hp}/${sprite.hp}</div><div class="db-battle-bar"><div class="db-battle-fill" style="--fill:${hpPct(hp, sprite.hp)}"></div></div></div>`;
  }

  function renderStage() {
    const overlay = ensureOverlay();
    if (!overlay || !battle) return;
    overlay.classList.remove("hidden");
    overlay.innerHTML = `<div class="db-battle-title"><span>Signal Battle</span><span>${battle.finished ? "Resolved" : "Active"}</span></div><div class="db-battle-grid">${fighter(battle.player, battle.playerHp, "Party Lead")}<div class="db-battle-vs">VS</div>${fighter(battle.enemy, battle.enemyHp, "Wild Signal")}</div><div class="db-battle-log">${battle.log.slice(0, 5).map((line) => `<p>${line}</p>`).join("")}</div><div class="db-battle-actions"><button type="button" data-battle-action="attack" ${battle.finished ? "disabled" : ""}>Attack</button><button type="button" data-battle-action="guard" ${battle.finished ? "disabled" : ""}>Guard</button><button type="button" data-battle-action="pulse" ${battle.finished ? "disabled" : ""}>Scan Pulse</button><button type="button" data-battle-action="end">${battle.finished ? "Return" : "End"}</button></div>`;
    overlay.querySelector("[data-battle-action='attack']")?.addEventListener("click", playerAttack);
    overlay.querySelector("[data-battle-action='guard']")?.addEventListener("click", guard);
    overlay.querySelector("[data-battle-action='pulse']")?.addEventListener("click", scanPulse);
    overlay.querySelector("[data-battle-action='end']")?.addEventListener("click", endBattle);
  }

  function renderPanel() {
    const panel = ensurePanel();
    if (!panel) return;
    const enemy = currentEnemy();
    if (!enemy) {
      panel.innerHTML = `<div class="text-xs text-gray-400">Discover a sprite to initiate scanner battle mode.</div>`;
      return;
    }
    if (!battle) {
      panel.innerHTML = `<button id="startBattleBtn" type="button" class="w-full px-4 py-3 rounded-xl bg-red-400/15 border border-red-300/40 text-red-100 font-bold">Battle Signal</button><p class="text-xs text-gray-400 mt-2 text-center">Battle will take over the scanner viewport.</p>`;
      document.getElementById("startBattleBtn")?.addEventListener("click", startBattle);
      return;
    }
    panel.innerHTML = `<div class="text-red-100 font-bold">Battle Mode ${battle.finished ? "resolved" : "active"}</div><p class="text-xs text-gray-300 mt-1">Use the scanner viewport controls to continue.</p>`;
  }

  function resetForNewEncounter() {
    battle = null;
    document.getElementById("databyteBattleStageOverlay")?.classList.add("hidden");
    scannerCore()?.classList.remove("hidden");
    setTimeout(renderPanel, 80);
  }

  function boot() {
    injectStyles();
    ensureOverlay();
    renderPanel();
    const nameTarget = document.getElementById("encounterName");
    if (nameTarget) new MutationObserver(resetForNewEncounter).observe(nameTarget, { childList: true, characterData: true, subtree: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();