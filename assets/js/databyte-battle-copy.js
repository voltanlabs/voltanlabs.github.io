// assets/js/databyte-battle-copy.js
(function () {
  let state = null;

  function safeNumber(value, min, max) {
    const numberValue = Number(value) || 0;
    return Math.max(min, Math.min(max, numberValue));
  }

  function readCollection() {
    try { return JSON.parse(localStorage.getItem("vl_databyte_discovery_collection_v2")) || []; } catch { return []; }
  }

  function leadSprite() {
    const partyLead = typeof window.getLeadPartySprite === "function" ? window.getLeadPartySprite() : null;
    return partyLead || readCollection().slice(-1)[0] || { name: "Scanner Core", hp: 48, atk: 14, def: 12 };
  }

  function targetSprite() {
    const name = document.getElementById("encounterName")?.textContent?.trim();
    if (!name) return null;
    return {
      name,
      hp: safeNumber(document.getElementById("statHp")?.textContent, 1, 9999),
      atk: safeNumber(document.getElementById("statAtk")?.textContent, 1, 9999),
      def: safeNumber(document.getElementById("statDef")?.textContent, 1, 9999)
    };
  }

  function score(atk, def) {
    return safeNumber(Math.floor(atk * 0.65 - def * 0.25 + 6), 1, 999);
  }

  function improveRate(amount) {
    if (typeof window.boostCurrentCaptureChance === "function") {
      window.boostCurrentCaptureChance(amount);
      return;
    }
    const chanceText = document.getElementById("chanceText");
    if (!chanceText) return;
    const current = safeNumber(String(chanceText.textContent).replace("%", ""), 5, 100);
    chanceText.textContent = `${safeNumber(current + amount, 5, 100)}%`;
  }

  function startTest() {
    const target = targetSprite();
    if (!target) return;
    const lead = leadSprite();
    const leadHp = safeNumber(lead.hp ?? 48, 1, 9999);
    state = {
      leadName: lead.name || "Scanner Core",
      leadHp,
      leadMaxHp: leadHp,
      leadAtk: safeNumber(lead.atk ?? 14, 1, 9999),
      leadDef: safeNumber(lead.def ?? 12, 1, 9999),
      targetName: target.name,
      targetHp: target.hp,
      targetMaxHp: target.hp,
      targetAtk: target.atk,
      targetDef: target.def,
      done: false,
      log: [`${lead.name || "Scanner Core"} linked with ${target.name}.`]
    };
    render();
  }

  function focusSignal() {
    if (!state || state.done) return;
    const amount = score(state.leadAtk, state.targetDef);
    state.targetHp = safeNumber(state.targetHp - amount, 0, state.targetMaxHp);
    state.log.unshift(`${state.leadName} lowered signal by ${amount}.`);
    if (state.targetHp <= 0) {
      state.done = true;
      improveRate(15);
      state.log.unshift("Signal stabilized. Capture rate improved.");
      render();
      return;
    }
    targetResponse();
    render();
  }

  function shieldSignal() {
    if (!state || state.done) return;
    const amount = safeNumber(Math.floor(score(state.targetAtk, state.leadDef) * 0.45), 1, 999);
    state.leadHp = safeNumber(state.leadHp - amount, 0, state.leadMaxHp);
    state.log.unshift(`${state.leadName} shielded. Signal loss ${amount}.`);
    if (state.leadHp <= 0) endLeadSignal();
    render();
  }

  function pulseSignal() {
    if (!state || state.done) return;
    improveRate(8);
    state.log.unshift(`${state.leadName} used Scan Pulse.`);
    targetResponse();
    render();
  }

  function targetResponse() {
    const amount = score(state.targetAtk, state.leadDef);
    state.leadHp = safeNumber(state.leadHp - amount, 0, state.leadMaxHp);
    state.log.unshift(`${state.targetName} response measured ${amount}.`);
    if (state.leadHp <= 0) endLeadSignal();
  }

  function endLeadSignal() {
    state.done = true;
    state.leadHp = 0;
    state.log.unshift(`${state.leadName} signal reached zero. Capture remains available.`);
  }

  function bar(current, max) {
    const slots = 10;
    const filled = max <= 0 ? 0 : Math.round((safeNumber(current, 0, max) / max) * slots);
    return "█".repeat(filled) + "░".repeat(slots - filled);
  }

  function panel() {
    let element = document.getElementById("battleCopyPanel");
    if (element) return element;
    const card = document.getElementById("encounterCard");
    if (!card) return null;
    element = document.createElement("div");
    element.id = "battleCopyPanel";
    element.className = "mt-5 bg-red-500/10 border border-red-300/30 rounded-2xl p-4 text-sm";
    card.appendChild(element);
    return element;
  }

  function render() {
    const element = panel();
    if (!element) return;
    if (!state) {
      const lead = leadSprite();
      element.innerHTML = `<div class="text-red-100 font-bold mb-2">Signal Test Copy</div><p class="text-xs text-gray-300 mb-3">Active sprite: <strong>${lead.name || "Scanner Core"}</strong></p><button id="signalCopyStart" type="button" class="w-full px-4 py-3 rounded-xl bg-red-400/15 border border-red-300/40 text-red-100 font-bold">Start Signal Test</button>`;
      document.getElementById("signalCopyStart")?.addEventListener("click", startTest);
      return;
    }
    element.innerHTML = `<div class="text-red-100 font-bold">Signal Test Copy</div>
      <div class="grid grid-cols-2 gap-2 mt-3 text-xs">
        <div class="bg-black/20 rounded-xl p-3"><strong>${state.leadName}</strong><div class="text-emerald-200 mt-1">HP ${state.leadHp}/${state.leadMaxHp}</div><div class="tracking-widest">${bar(state.leadHp, state.leadMaxHp)}</div></div>
        <div class="bg-black/20 rounded-xl p-3"><strong>${state.targetName}</strong><div class="text-red-200 mt-1">HP ${state.targetHp}/${state.targetMaxHp}</div><div class="tracking-widest">${bar(state.targetHp, state.targetMaxHp)}</div></div>
      </div>
      <div class="grid grid-cols-3 gap-2 mt-3">
        <button id="signalCopyFocus" type="button" class="px-3 py-2 rounded-xl bg-red-400/15 border border-red-300/40 text-red-100 text-xs font-bold">Focus</button>
        <button id="signalCopyShield" type="button" class="px-3 py-2 rounded-xl bg-sky-400/15 border border-sky-300/40 text-sky-100 text-xs font-bold">Shield</button>
        <button id="signalCopyPulse" type="button" class="px-3 py-2 rounded-xl bg-[#FFD700]/15 border border-[#FFD700]/40 text-[#FFD700] text-xs font-bold">Scan Pulse</button>
      </div>
      <div class="mt-3 text-xs text-gray-300 grid gap-1 max-h-24 overflow-auto">${state.log.slice(0, 5).map((line) => `<p>${line}</p>`).join("")}</div>`;
    document.getElementById("signalCopyFocus")?.addEventListener("click", focusSignal);
    document.getElementById("signalCopyShield")?.addEventListener("click", shieldSignal);
    document.getElementById("signalCopyPulse")?.addEventListener("click", pulseSignal);
  }

  function boot() {
    render();
    window.addEventListener("databyte:party-updated", () => { if (!state) render(); });
    const target = document.getElementById("encounterName");
    if (target) {
      new MutationObserver(() => {
        state = null;
        setTimeout(render, 50);
      }).observe(target, { childList: true, characterData: true, subtree: true });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
