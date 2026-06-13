// assets/js/databyte-battle.js
(function () {
  let battle = null;

  function clamp(value, min = 0, max = 9999) {
    return Math.max(min, Math.min(max, Number(value) || 0));
  }

  function getEncounterStats() {
    const name = document.getElementById("encounterName")?.textContent?.trim();
    if (!name) return null;
    return {
      name,
      hp: clamp(document.getElementById("statHp")?.textContent, 1),
      atk: clamp(document.getElementById("statAtk")?.textContent, 1),
      def: clamp(document.getElementById("statDef")?.textContent, 1)
    };
  }

  function playerStats() {
    const collection = (() => {
      try { return JSON.parse(localStorage.getItem("vl_databyte_discovery_collection_v2")) || []; } catch { return []; }
    })();
    const lead = collection[collection.length - 1] || { name: "Scanner Core", hp: 48, atk: 14, def: 12 };
    return {
      name: lead.name || "Scanner Core",
      hp: clamp(lead.hp ?? 48, 1),
      atk: clamp(lead.atk ?? 14, 1),
      def: clamp(lead.def ?? 12, 1)
    };
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

  function startBattle() {
    const enemy = getEncounterStats();
    if (!enemy) return;
    const player = playerStats();
    battle = {
      playerName: player.name,
      enemyName: enemy.name,
      playerHp: player.hp,
      playerMaxHp: player.hp,
      playerAtk: player.atk,
      playerDef: player.def,
      enemyHp: enemy.hp,
      enemyMaxHp: enemy.hp,
      enemyAtk: enemy.atk,
      enemyDef: enemy.def,
      log: [`${enemy.name} challenges your scanner signal.`],
      finished: false
    };
    render();
  }

  function damage(atk, def) {
    return clamp(Math.floor(atk * 0.65 - def * 0.25 + 6), 1, 999);
  }

  function attack() {
    if (!battle || battle.finished) return;
    const dealt = damage(battle.playerAtk, battle.enemyDef);
    battle.enemyHp = clamp(battle.enemyHp - dealt, 0, battle.enemyMaxHp);
    battle.log.unshift(`${battle.playerName} dealt ${dealt} signal damage.`);

    if (battle.enemyHp <= 0) {
      battle.finished = true;
      battle.log.unshift(`${battle.enemyName} was weakened. ByteCoin chance improved.`);
      boostCaptureChance(15);
      render();
      return;
    }

    enemyTurn();
    render();
  }

  function guard() {
    if (!battle || battle.finished) return;
    const reduced = clamp(Math.floor(damage(battle.enemyAtk, battle.playerDef) * 0.45), 1, 999);
    battle.playerHp = clamp(battle.playerHp - reduced, 0, battle.playerMaxHp);
    battle.log.unshift(`${battle.playerName} guarded. Took ${reduced} damage.`);
    if (battle.playerHp <= 0) finishPlayerDown();
    render();
  }

  function scanPulse() {
    if (!battle || battle.finished) return;
    boostCaptureChance(8);
    battle.log.unshift(`Scan Pulse raised ByteCoin chance.`);
    enemyTurn();
    render();
  }

  function enemyTurn() {
    const hit = damage(battle.enemyAtk, battle.playerDef);
    battle.playerHp = clamp(battle.playerHp - hit, 0, battle.playerMaxHp);
    battle.log.unshift(`${battle.enemyName} dealt ${hit} damage.`);
    if (battle.playerHp <= 0) finishPlayerDown();
  }

  function finishPlayerDown() {
    battle.finished = true;
    battle.playerHp = 0;
    battle.log.unshift(`${battle.playerName} signal was knocked offline. You can still attempt capture.`);
  }

  function boostCaptureChance(amount) {
    const chanceText = document.getElementById("chanceText");
    if (!chanceText) return;
    const current = clamp(String(chanceText.textContent).replace("%", ""), 5, 100);
    chanceText.textContent = `${clamp(current + amount, 5, 100)}%`;
  }

  function hpBar(now, max) {
    const slots = 10;
    const filled = max <= 0 ? 0 : Math.round((clamp(now, 0, max) / max) * slots);
    return "█".repeat(filled) + "░".repeat(slots - filled);
  }

  function render() {
    const panel = ensurePanel();
    if (!panel) return;
    if (!battle) {
      panel.innerHTML = `<button id="startBattleBtn" type="button" class="w-full px-4 py-3 rounded-xl bg-red-400/15 border border-red-300/40 text-red-100 font-bold">Battle Signal</button>`;
      document.getElementById("startBattleBtn")?.addEventListener("click", startBattle);
      return;
    }

    panel.innerHTML = `
      <div class="text-red-100 font-bold">Signal Battle</div>
      <div class="grid grid-cols-2 gap-2 mt-3 text-xs">
        <div class="bg-black/20 rounded-xl p-3"><strong>${battle.playerName}</strong><div class="text-emerald-200 mt-1">HP ${battle.playerHp}/${battle.playerMaxHp}</div><div class="tracking-widest">${hpBar(battle.playerHp, battle.playerMaxHp)}</div></div>
        <div class="bg-black/20 rounded-xl p-3"><strong>${battle.enemyName}</strong><div class="text-red-200 mt-1">HP ${battle.enemyHp}/${battle.enemyMaxHp}</div><div class="tracking-widest">${hpBar(battle.enemyHp, battle.enemyMaxHp)}</div></div>
      </div>
      <div class="grid grid-cols-3 gap-2 mt-3">
        <button id="battleAttackBtn" type="button" class="px-3 py-2 rounded-xl bg-red-400/15 border border-red-300/40 text-red-100 text-xs font-bold">Attack</button>
        <button id="battleGuardBtn" type="button" class="px-3 py-2 rounded-xl bg-sky-400/15 border border-sky-300/40 text-sky-100 text-xs font-bold">Guard</button>
        <button id="battlePulseBtn" type="button" class="px-3 py-2 rounded-xl bg-[#FFD700]/15 border border-[#FFD700]/40 text-[#FFD700] text-xs font-bold">Scan Pulse</button>
      </div>
      <div class="mt-3 text-xs text-gray-300 grid gap-1 max-h-24 overflow-auto">${battle.log.slice(0, 5).map((line) => `<p>${line}</p>`).join("")}</div>`;

    document.getElementById("battleAttackBtn")?.addEventListener("click", attack);
    document.getElementById("battleGuardBtn")?.addEventListener("click", guard);
    document.getElementById("battlePulseBtn")?.addEventListener("click", scanPulse);
  }

  function boot() {
    render();
    const nameTarget = document.getElementById("encounterName");
    if (nameTarget) {
      new MutationObserver(() => {
        battle = null;
        setTimeout(render, 50);
      }).observe(nameTarget, { childList: true, characterData: true, subtree: true });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
